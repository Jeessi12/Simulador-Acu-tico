<?php

/**
 * Creates and seeds the achievement tables for installations that have not yet
 * applied the SQL migration. The method is idempotent and runs once per request.
 */
final class AchievementSchema
{
    private const SCHEMA_VERSION = 2;
    private static bool $initialized = false;

    public static function ensure(mysqli $conn): void
    {
        if (self::$initialized) {
            return;
        }

        try {
            $versionResult = $conn->query(
                "SELECT meta_value FROM achievement_system_meta
                 WHERE meta_key = 'schema_version' LIMIT 1"
            );
            $version = (int) ($versionResult->fetch_assoc()['meta_value'] ?? 0);
            if ($version >= self::SCHEMA_VERSION) {
                self::$initialized = true;
                return;
            }
        } catch (mysqli_sql_exception $error) {
            // First installation: the metadata table is created below.
        }

        $statements = [
            "CREATE TABLE IF NOT EXISTS achievement_system_meta (
                meta_key VARCHAR(80) PRIMARY KEY,
                meta_value VARCHAR(255) NOT NULL,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            "CREATE TABLE IF NOT EXISTS achievement_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                description VARCHAR(255) NULL,
                icon VARCHAR(32) NOT NULL DEFAULT '🌊',
                sort_order SMALLINT NOT NULL DEFAULT 0,
                is_active TINYINT(1) NOT NULL DEFAULT 1
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            "CREATE TABLE IF NOT EXISTS achievements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NOT NULL,
                code VARCHAR(80) NOT NULL UNIQUE,
                name VARCHAR(120) NOT NULL,
                description VARCHAR(300) NOT NULL,
                icon VARCHAR(255) NOT NULL,
                level VARCHAR(20) NOT NULL DEFAULT 'Bronze',
                xp_reward INT NOT NULL DEFAULT 0,
                is_hidden TINYINT(1) NOT NULL DEFAULT 0,
                season_code VARCHAR(50) NULL,
                available_from DATETIME NULL,
                available_until DATETIME NULL,
                sort_order SMALLINT NOT NULL DEFAULT 0,
                is_active TINYINT(1) NOT NULL DEFAULT 1,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_achievement_category FOREIGN KEY (category_id)
                    REFERENCES achievement_categories(id),
                INDEX idx_achievement_availability (is_active, available_from, available_until),
                INDEX idx_achievement_category_sort (category_id, sort_order)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            "CREATE TABLE IF NOT EXISTS achievement_rules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                achievement_id INT NOT NULL,
                metric_key VARCHAR(80) NOT NULL,
                comparison_operator VARCHAR(10) NOT NULL DEFAULT 'gte',
                target_value DECIMAL(12,2) NOT NULL,
                options_json LONGTEXT NULL,
                sort_order SMALLINT NOT NULL DEFAULT 0,
                CONSTRAINT fk_rule_achievement FOREIGN KEY (achievement_id)
                    REFERENCES achievements(id) ON DELETE CASCADE,
                UNIQUE KEY uq_achievement_rule (achievement_id, metric_key, sort_order),
                INDEX idx_rule_metric (metric_key)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            "CREATE TABLE IF NOT EXISTS user_achievements (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                achievement_id INT NOT NULL,
                progress_value DECIMAL(12,2) NOT NULL DEFAULT 0,
                progress_target DECIMAL(12,2) NOT NULL DEFAULT 1,
                status VARCHAR(20) NOT NULL DEFAULT 'locked',
                unlocked_at DATETIME NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_user_achievement_user FOREIGN KEY (user_id)
                    REFERENCES usuarios(id) ON DELETE CASCADE,
                CONSTRAINT fk_user_achievement_definition FOREIGN KEY (achievement_id)
                    REFERENCES achievements(id) ON DELETE CASCADE,
                UNIQUE KEY uq_user_achievement (user_id, achievement_id),
                INDEX idx_user_achievement_status (user_id, status, unlocked_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            "CREATE TABLE IF NOT EXISTS user_login_days (
                user_id INT NOT NULL,
                login_date DATE NOT NULL,
                first_login_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, login_date),
                CONSTRAINT fk_login_day_user FOREIGN KEY (user_id)
                    REFERENCES usuarios(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            "CREATE TABLE IF NOT EXISTS user_education_visits (
                user_id INT NOT NULL,
                section_key VARCHAR(50) NOT NULL,
                first_visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                last_visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                visit_count INT NOT NULL DEFAULT 1,
                PRIMARY KEY (user_id, section_key),
                CONSTRAINT fk_education_visit_user FOREIGN KEY (user_id)
                    REFERENCES usuarios(id) ON DELETE CASCADE,
                INDEX idx_education_visit_user (user_id, first_visited_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            "CREATE TABLE IF NOT EXISTS simulation_activity_sessions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                session_token CHAR(64) NOT NULL UNIQUE,
                user_id INT NOT NULL,
                simulation_id INT NOT NULL,
                assignment_id INT NULL,
                started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                last_activity_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                duration_seconds INT NOT NULL DEFAULT 0,
                is_active TINYINT(1) NOT NULL DEFAULT 1,
                completed_at DATETIME NULL,
                CONSTRAINT fk_activity_session_user FOREIGN KEY (user_id)
                    REFERENCES usuarios(id) ON DELETE CASCADE,
                CONSTRAINT fk_activity_session_simulation FOREIGN KEY (simulation_id)
                    REFERENCES simulaciones(id) ON DELETE CASCADE,
                CONSTRAINT fk_activity_session_assignment FOREIGN KEY (assignment_id)
                    REFERENCES asignaciones(id) ON DELETE SET NULL,
                INDEX idx_activity_user_completed (user_id, completed_at),
                INDEX idx_activity_user_simulation (user_id, simulation_id, completed_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        ];

        foreach ($statements as $sql) {
            if (!$conn->query($sql)) {
                throw new RuntimeException('No se pudo preparar el sistema de logros: ' . $conn->error);
            }
        }

        $activeColumn = $conn->query("SHOW COLUMNS FROM simulation_activity_sessions LIKE 'is_active'");
        if ($activeColumn && $activeColumn->num_rows === 0) {
            if (!$conn->query(
                'ALTER TABLE simulation_activity_sessions
                 ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER duration_seconds'
            )) {
                throw new RuntimeException('No se pudo actualizar el seguimiento de simulaciones: ' . $conn->error);
            }
        }

        self::seed($conn);
        $schemaVersion = (string) self::SCHEMA_VERSION;
        $versionStatement = $conn->prepare(
            "INSERT INTO achievement_system_meta (meta_key, meta_value)
             VALUES ('schema_version', ?)
             ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value)"
        );
        $versionStatement->bind_param('s', $schemaVersion);
        $versionStatement->execute();
        $versionStatement->close();
        self::$initialized = true;
    }

    private static function seed(mysqli $conn): void
    {
        $categories = [
            ['learning', 'Aprendizaje', 'Metas relacionadas con el contenido educativo.', '📚', 10],
            ['simulation', 'Simulación', 'Metas obtenidas experimentando con los ecosistemas.', '🐠', 20],
            ['exploration', 'Exploración', 'Reconocimientos por descubrir toda la plataforma.', '🧭', 30],
            ['consistency', 'Constancia', 'Recompensas por regresar y mantener el hábito.', '🪸', 40],
            ['special', 'Especiales', 'Retos destacados y reconocimientos de conservación.', '🏆', 50],
        ];

        $categoryStatement = $conn->prepare(
            "INSERT INTO achievement_categories (code, name, description, icon, sort_order)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description),
                 icon = VALUES(icon), sort_order = VALUES(sort_order)"
        );
        foreach ($categories as $category) {
            $categoryStatement->bind_param('ssssi', ...$category);
            $categoryStatement->execute();
        }
        $categoryStatement->close();

        $categoryIds = [];
        $result = $conn->query('SELECT id, code FROM achievement_categories');
        while ($row = $result->fetch_assoc()) {
            $categoryIds[$row['code']] = (int) $row['id'];
        }

        $achievements = [
            ['first_login', 'consistency', 'Primera inmersión', 'Inicia sesión por primera vez en BlueEcoSim.', '🐚', 'Bronze', 10, 10],
            ['first_simulation', 'simulation', 'Primera simulación', 'Completa tu primera experiencia de simulación.', '🐠', 'Bronze', 20, 10],
            ['all_simulations', 'simulation', 'Trilogía oceánica', 'Completa los tres escenarios de simulación disponibles.', '🌊', 'Silver', 60, 20],
            ['simulation_hour', 'simulation', 'Una hora bajo el mar', 'Acumula una hora de uso activo en las simulaciones.', '⏱️', 'Silver', 75, 30],
            ['simulations_10', 'simulation', 'Investigador de arrecifes', 'Completa 10 sesiones de simulación.', '🥉', 'Bronze', 50, 40],
            ['simulations_25', 'simulation', 'Analista marino', 'Completa 25 sesiones de simulación.', '🥈', 'Silver', 100, 50],
            ['simulations_50', 'simulation', 'Maestro de simulaciones', 'Completa 50 sesiones de simulación.', '🥇', 'Gold', 200, 60],
            ['educational_explorer', 'exploration', 'Cartógrafo del conocimiento', 'Visita todas las secciones educativas principales.', '🧭', 'Silver', 60, 10],
            ['profile_complete', 'exploration', 'Identidad marina', 'Completa la información esencial de tu perfil.', '🪪', 'Bronze', 25, 20],
            ['week_streak', 'consistency', 'Marea constante', 'Regresa a BlueEcoSim durante 7 días consecutivos.', '🪸', 'Gold', 150, 20],
            ['ecosystem_expert', 'learning', 'Experto en ecosistemas', 'Domina los tres escenarios y explora todo el contenido educativo.', '🔬', 'Gold', 200, 10],
            ['marine_advocate', 'special', 'Defensor de la conservación marina', 'Completa tres estudios de contaminación y consulta los recursos de conservación.', '🐢', 'Platinum', 250, 10],
        ];

        $achievementStatement = $conn->prepare(
            "INSERT INTO achievements
                (category_id, code, name, description, icon, level, xp_reward, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE category_id = VALUES(category_id), name = VALUES(name),
                 description = VALUES(description), icon = VALUES(icon), level = VALUES(level),
                 xp_reward = VALUES(xp_reward), sort_order = VALUES(sort_order)"
        );
        foreach ($achievements as $achievement) {
            [$code, $categoryCode, $name, $description, $icon, $level, $xp, $sort] = $achievement;
            $categoryId = $categoryIds[$categoryCode];
            $achievementStatement->bind_param(
                'isssssii',
                $categoryId,
                $code,
                $name,
                $description,
                $icon,
                $level,
                $xp,
                $sort
            );
            $achievementStatement->execute();
        }
        $achievementStatement->close();

        $achievementIds = [];
        $result = $conn->query('SELECT id, code FROM achievements');
        while ($row = $result->fetch_assoc()) {
            $achievementIds[$row['code']] = (int) $row['id'];
        }

        $rules = [
            ['first_login', 'login_days_total', 1, null, 10],
            ['first_simulation', 'simulation_completed_count', 1, null, 10],
            ['all_simulations', 'required_simulations_completed', 3, '{"simulation_ids":[1,2,3]}', 10],
            ['simulation_hour', 'simulation_seconds', 3600, null, 10],
            ['simulations_10', 'simulation_completed_count', 10, null, 10],
            ['simulations_25', 'simulation_completed_count', 25, null, 10],
            ['simulations_50', 'simulation_completed_count', 50, null, 10],
            ['educational_explorer', 'educational_sections_visited', 5, null, 10],
            ['profile_complete', 'profile_completeness_percent', 100, null, 10],
            ['week_streak', 'consecutive_login_days', 7, null, 10],
            ['ecosystem_expert', 'required_simulations_completed', 3, '{"simulation_ids":[1,2,3]}', 10],
            ['ecosystem_expert', 'educational_sections_visited', 5, null, 20],
            ['marine_advocate', 'simulation_type_completed_count', 3, '{"simulation_id":3}', 10],
            ['marine_advocate', 'section_visited', 1, '{"section_key":"resources"}', 20],
        ];

        $conn->query(
            "DELETE ar FROM achievement_rules ar
             JOIN achievements a ON a.id = ar.achievement_id
             WHERE a.code IN ('all_simulations', 'ecosystem_expert')
               AND ar.metric_key = 'distinct_simulations_completed'"
        );

        $ruleStatement = $conn->prepare(
            "INSERT INTO achievement_rules
                (achievement_id, metric_key, comparison_operator, target_value, options_json, sort_order)
             VALUES (?, ?, 'gte', ?, ?, ?)
             ON DUPLICATE KEY UPDATE comparison_operator = VALUES(comparison_operator),
                 target_value = VALUES(target_value), options_json = VALUES(options_json)"
        );
        foreach ($rules as [$achievementCode, $metric, $target, $options, $sort]) {
            $achievementId = $achievementIds[$achievementCode];
            $ruleStatement->bind_param('isdsi', $achievementId, $metric, $target, $options, $sort);
            $ruleStatement->execute();
        }
        $ruleStatement->close();
    }
}
