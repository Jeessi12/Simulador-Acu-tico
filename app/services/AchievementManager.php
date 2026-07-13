<?php

require_once __DIR__ . '/../models/AchievementSchema.php';

/**
 * Central service for achievement events, metric evaluation and unlocks.
 * Controllers only report user actions; all reward rules remain here/data-driven.
 */
final class AchievementManager
{
    private const NOTIFICATION_SESSION_KEY = 'achievement_unlock_notifications';
    private const EDUCATIONAL_SECTIONS = ['home', 'about', 'resources', 'species', 'simulations'];
    private const MIN_COMPLETION_SECONDS = 60;

    private mysqli $conn;
    private array $metricCache = [];

    public function __construct(mysqli $conn)
    {
        AchievementSchema::ensure($conn);
        $this->conn = $conn;
    }

    public static function csrfToken(): string
    {
        if (empty($_SESSION['achievement_csrf_token'])) {
            $_SESSION['achievement_csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['achievement_csrf_token'];
    }

    public static function validateCsrfToken(?string $token): bool
    {
        return is_string($token)
            && isset($_SESSION['achievement_csrf_token'])
            && hash_equals($_SESSION['achievement_csrf_token'], $token);
    }

    public static function consumePendingNotifications(): array
    {
        $notifications = $_SESSION[self::NOTIFICATION_SESSION_KEY] ?? [];
        unset($_SESSION[self::NOTIFICATION_SESSION_KEY]);
        return is_array($notifications) ? $notifications : [];
    }

    public function recordLogin(int $userId, bool $queueNotifications = true): array
    {
        $statement = $this->conn->prepare(
            'INSERT IGNORE INTO user_login_days (user_id, login_date) VALUES (?, CURRENT_DATE)'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $statement->close();

        return $this->evaluate($userId, $queueNotifications);
    }

    public function recordSectionVisit(int $userId, string $sectionKey, bool $queueNotifications = true): array
    {
        if (!in_array($sectionKey, self::EDUCATIONAL_SECTIONS, true)) {
            return [];
        }

        $statement = $this->conn->prepare(
            "INSERT INTO user_education_visits (user_id, section_key)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE visit_count = visit_count + 1, last_visited_at = CURRENT_TIMESTAMP"
        );
        $statement->bind_param('is', $userId, $sectionKey);
        $statement->execute();
        $statement->close();

        return $this->evaluate($userId, $queueNotifications);
    }

    public function syncProfileCompletion(int $userId, bool $queueNotifications = true): array
    {
        return $this->evaluate($userId, $queueNotifications);
    }

    public function startSimulation(int $userId, int $simulationId, ?int $assignmentId = null): array
    {
        $simulationId = $this->validatedSimulationId($simulationId);
        $assignmentId = $this->validatedAssignmentId($userId, $simulationId, $assignmentId);
        $token = bin2hex(random_bytes(32));

        $statement = $this->conn->prepare(
            'INSERT INTO simulation_activity_sessions
                (session_token, user_id, simulation_id, assignment_id)
             VALUES (?, ?, ?, ?)'
        );
        $statement->bind_param('siii', $token, $userId, $simulationId, $assignmentId);
        $statement->execute();
        $sessionId = (int) $statement->insert_id;
        $statement->close();

        return [
            'session_id' => $sessionId,
            'session_token' => $token,
            'simulation_id' => $simulationId,
        ];
    }

    public function heartbeatSimulation(int $userId, string $token): array
    {
        $this->creditActiveTime($userId, $token, false);
        return [
            'duration_seconds' => $this->sessionDuration($userId, $token),
            'unlocked' => $this->evaluate($userId, false),
        ];
    }

    public function pauseSimulation(int $userId, string $token): array
    {
        $this->creditActiveTime($userId, $token, false);
        $statement = $this->conn->prepare(
            'UPDATE simulation_activity_sessions SET is_active = 0
             WHERE session_token = ? AND user_id = ? AND completed_at IS NULL'
        );
        $statement->bind_param('si', $token, $userId);
        $statement->execute();
        $statement->close();
        return ['duration_seconds' => $this->sessionDuration($userId, $token)];
    }

    public function resumeSimulation(int $userId, string $token): array
    {
        $statement = $this->conn->prepare(
            'UPDATE simulation_activity_sessions
             SET is_active = 1, last_activity_at = CURRENT_TIMESTAMP
             WHERE session_token = ? AND user_id = ? AND completed_at IS NULL'
        );
        $statement->bind_param('si', $token, $userId);
        $statement->execute();
        if ($statement->affected_rows < 1) {
            $statement->close();
            throw new RuntimeException('No se pudo reanudar la sesión de simulación.');
        }
        $statement->close();
        return ['duration_seconds' => $this->sessionDuration($userId, $token)];
    }

    public function completeSimulation(int $userId, string $token, bool $queueNotifications = false): array
    {
        $completedNow = $this->creditActiveTime($userId, $token, true);
        $unlocked = $completedNow ? $this->evaluate($userId, $queueNotifications) : [];

        return [
            'completed_now' => $completedNow,
            'duration_seconds' => $this->sessionDuration($userId, $token),
            'unlocked' => $unlocked,
        ];
    }

    public function evaluate(int $userId, bool $queueNotifications = true): array
    {
        $this->metricCache = [];
        $definitions = $this->achievementDefinitions();
        $unlocked = [];

        $upsert = $this->conn->prepare(
            "INSERT INTO user_achievements
                (user_id, achievement_id, progress_value, progress_target, status)
             VALUES (?, ?, ?, ?, 'locked')
             ON DUPLICATE KEY UPDATE
                progress_value = IF(status = 'unlocked', VALUES(progress_target), VALUES(progress_value)),
                progress_target = VALUES(progress_target)"
        );
        $unlock = $this->conn->prepare(
            "UPDATE user_achievements
             SET status = 'unlocked', progress_value = progress_target, unlocked_at = CURRENT_TIMESTAMP
             WHERE user_id = ? AND achievement_id = ? AND status = 'locked'"
        );

        foreach ($definitions as $definition) {
            [$progress, $target, $fulfilled] = $this->calculateProgress($userId, $definition['rules']);
            $achievementId = (int) $definition['id'];
            $upsert->bind_param('iidd', $userId, $achievementId, $progress, $target);
            $upsert->execute();

            if (!$fulfilled) {
                continue;
            }

            $unlock->bind_param('ii', $userId, $achievementId);
            $unlock->execute();
            if ($unlock->affected_rows === 1) {
                $notification = $this->notificationPayload($definition);
                $unlocked[] = $notification;
                if ($queueNotifications) {
                    $_SESSION[self::NOTIFICATION_SESSION_KEY][] = $notification;
                }
            }
        }

        $upsert->close();
        $unlock->close();
        return $unlocked;
    }

    public function getUserAchievements(int $userId): array
    {
        $this->evaluate($userId, true);
        $statement = $this->conn->prepare(
            "SELECT a.id, a.code, a.name, a.description, a.icon, a.level, a.xp_reward,
                    a.is_hidden, c.code AS category_code, c.name AS category_name,
                    c.icon AS category_icon, c.sort_order AS category_sort,
                    ua.progress_value, ua.progress_target, ua.status, ua.unlocked_at,
                    COUNT(ar.id) AS rule_count, MIN(ar.metric_key) AS primary_metric
             FROM achievements a
             JOIN achievement_categories c ON c.id = a.category_id AND c.is_active = 1
             LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
             LEFT JOIN achievement_rules ar ON ar.achievement_id = a.id
             WHERE a.is_active = 1
               AND (a.available_from IS NULL OR a.available_from <= CURRENT_TIMESTAMP)
               AND (a.available_until IS NULL OR a.available_until >= CURRENT_TIMESTAMP)
             GROUP BY a.id, a.code, a.name, a.description, a.icon, a.level, a.xp_reward,
                      a.is_hidden, c.code, c.name, c.icon, c.sort_order,
                      ua.progress_value, ua.progress_target, ua.status, ua.unlocked_at,
                      a.sort_order
             ORDER BY c.sort_order, a.sort_order, a.id"
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $result = $statement->get_result();

        $categories = [];
        $totals = ['unlocked' => 0, 'total' => 0, 'xp' => 0];
        while ($row = $result->fetch_assoc()) {
            $status = $row['status'] ?? 'locked';
            $progress = (float) ($row['progress_value'] ?? 0);
            $target = max(1.0, (float) ($row['progress_target'] ?? 1));
            $isHiddenLocked = (bool) $row['is_hidden'] && $status !== 'unlocked';
            $categoryCode = $row['category_code'];

            if (!isset($categories[$categoryCode])) {
                $categories[$categoryCode] = [
                    'code' => $categoryCode,
                    'name' => $row['category_name'],
                    'icon' => $row['category_icon'],
                    'achievements' => [],
                ];
            }

            $row['status'] = $status;
            $row['progress_value'] = $progress;
            $row['progress_target'] = $target;
            $row['progress_percent'] = min(100, round(($progress / $target) * 100));
            if ((int) $row['rule_count'] > 1) {
                $row['progress_label'] = (int) $row['progress_percent'] . '% de requisitos';
            } elseif ($row['primary_metric'] === 'simulation_seconds') {
                $row['progress_label'] = $this->formatProgress($progress / 60)
                    . ' min / ' . $this->formatProgress($target / 60) . ' min';
            } else {
                $row['progress_label'] = $this->formatProgress($progress)
                    . ' / ' . $this->formatProgress($target);
            }
            if ($isHiddenLocked) {
                $row['name'] = 'Logro secreto';
                $row['description'] = 'Sigue explorando para descubrir este logro.';
                $row['icon'] = '❔';
            }

            $categories[$categoryCode]['achievements'][] = $row;
            $totals['total']++;
            if ($status === 'unlocked') {
                $totals['unlocked']++;
                $totals['xp'] += (int) $row['xp_reward'];
            }
        }
        $statement->close();

        return ['categories' => array_values($categories), 'totals' => $totals];
    }

    private function achievementDefinitions(): array
    {
        $result = $this->conn->query(
            "SELECT a.id, a.code, a.name, a.description, a.icon, a.level, a.xp_reward,
                    ar.metric_key, ar.comparison_operator, ar.target_value, ar.options_json
             FROM achievements a
             JOIN achievement_categories c ON c.id = a.category_id AND c.is_active = 1
             JOIN achievement_rules ar ON ar.achievement_id = a.id
             WHERE a.is_active = 1
               AND (a.available_from IS NULL OR a.available_from <= CURRENT_TIMESTAMP)
               AND (a.available_until IS NULL OR a.available_until >= CURRENT_TIMESTAMP)
             ORDER BY a.id, ar.sort_order"
        );

        $definitions = [];
        while ($row = $result->fetch_assoc()) {
            $id = (int) $row['id'];
            if (!isset($definitions[$id])) {
                $definitions[$id] = [
                    'id' => $id,
                    'code' => $row['code'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'icon' => $row['icon'],
                    'level' => $row['level'],
                    'xp_reward' => (int) $row['xp_reward'],
                    'rules' => [],
                ];
            }
            $definitions[$id]['rules'][] = [
                'metric_key' => $row['metric_key'],
                'operator' => $row['comparison_operator'],
                'target' => (float) $row['target_value'],
                'options' => json_decode($row['options_json'] ?? '[]', true) ?: [],
            ];
        }

        return array_values($definitions);
    }

    private function calculateProgress(int $userId, array $rules): array
    {
        $ratios = [];
        $values = [];
        $fulfilled = true;

        foreach ($rules as $rule) {
            $value = $this->metricValue($userId, $rule['metric_key'], $rule['options']);
            $target = max(0.01, (float) $rule['target']);
            $matches = match ($rule['operator']) {
                'eq' => abs($value - $target) < 0.001,
                'lte' => $value <= $target,
                default => $value >= $target,
            };
            $fulfilled = $fulfilled && $matches;
            $values[] = min($value, $target);
            $ratios[] = min(1, max(0, $value / $target));
        }

        if (count($rules) === 1) {
            return [$values[0] ?? 0, (float) ($rules[0]['target'] ?? 1), $fulfilled];
        }

        $progress = $ratios === [] ? 0 : (array_sum($ratios) / count($ratios)) * 100;
        return [round($progress, 2), 100.0, $fulfilled];
    }

    private function metricValue(int $userId, string $metricKey, array $options): float
    {
        return match ($metricKey) {
            'login_days_total' => (float) $this->loginMetrics($userId)['total'],
            'consecutive_login_days' => (float) $this->loginMetrics($userId)['streak'],
            'simulation_completed_count' => (float) $this->simulationMetrics($userId)['completed'],
            'distinct_simulations_completed' => (float) $this->simulationMetrics($userId)['distinct'],
            'required_simulations_completed' => (float) count(array_filter(
                array_map('intval', $options['simulation_ids'] ?? []),
                fn (int $simulationId): bool => ($this->simulationMetrics($userId)['by_simulation'][$simulationId] ?? 0) > 0
            )),
            'simulation_seconds' => (float) $this->simulationMetrics($userId)['seconds'],
            'simulation_type_completed_count' => (float) ($this->simulationMetrics($userId)['by_simulation'][(int) ($options['simulation_id'] ?? 0)] ?? 0),
            'educational_sections_visited' => (float) count(array_intersect(
                self::EDUCATIONAL_SECTIONS,
                $this->educationVisits($userId)
            )),
            'section_visited' => in_array((string) ($options['section_key'] ?? ''), $this->educationVisits($userId), true) ? 1.0 : 0.0,
            'profile_completeness_percent' => $this->profileCompleteness($userId),
            default => 0.0,
        };
    }

    private function loginMetrics(int $userId): array
    {
        if (isset($this->metricCache['login'])) {
            return $this->metricCache['login'];
        }

        $statement = $this->conn->prepare(
            'SELECT login_date FROM user_login_days WHERE user_id = ? ORDER BY login_date DESC'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $result = $statement->get_result();
        $dates = [];
        while ($row = $result->fetch_assoc()) {
            $dates[] = $row['login_date'];
        }
        $statement->close();

        $streak = 0;
        $expected = new DateTimeImmutable('today');
        foreach ($dates as $date) {
            if ($date !== $expected->format('Y-m-d')) {
                break;
            }
            $streak++;
            $expected = $expected->modify('-1 day');
        }

        return $this->metricCache['login'] = ['total' => count($dates), 'streak' => $streak];
    }

    private function simulationMetrics(int $userId): array
    {
        if (isset($this->metricCache['simulation'])) {
            return $this->metricCache['simulation'];
        }

        $statement = $this->conn->prepare(
            "SELECT simulation_id, SUM(duration_seconds) AS seconds,
                    SUM(completed_at IS NOT NULL) AS completed
             FROM simulation_activity_sessions
             WHERE user_id = ?
             GROUP BY simulation_id"
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $result = $statement->get_result();
        $metrics = ['seconds' => 0, 'completed' => 0, 'distinct' => 0, 'by_simulation' => []];
        while ($row = $result->fetch_assoc()) {
            $simulationId = (int) $row['simulation_id'];
            $completed = (int) $row['completed'];
            $metrics['seconds'] += (int) $row['seconds'];
            $metrics['completed'] += $completed;
            $metrics['by_simulation'][$simulationId] = $completed;
            if ($completed > 0) {
                $metrics['distinct']++;
            }
        }
        $statement->close();

        return $this->metricCache['simulation'] = $metrics;
    }

    private function educationVisits(int $userId): array
    {
        if (isset($this->metricCache['education'])) {
            return $this->metricCache['education'];
        }

        $statement = $this->conn->prepare(
            'SELECT section_key FROM user_education_visits WHERE user_id = ?'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $result = $statement->get_result();
        $visits = [];
        while ($row = $result->fetch_assoc()) {
            $visits[] = $row['section_key'];
        }
        $statement->close();

        return $this->metricCache['education'] = $visits;
    }

    private function profileCompleteness(int $userId): float
    {
        if (isset($this->metricCache['profile'])) {
            return $this->metricCache['profile'];
        }

        $statement = $this->conn->prepare(
            'SELECT username, email, rol_id, estado FROM usuarios WHERE id = ? LIMIT 1'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $user = $statement->get_result()->fetch_assoc();
        $statement->close();

        if (!$user) {
            return $this->metricCache['profile'] = 0.0;
        }

        $checks = [
            trim((string) $user['username']) !== '',
            filter_var($user['email'], FILTER_VALIDATE_EMAIL) !== false,
            (int) $user['rol_id'] > 0,
            $user['estado'] === 'activo',
        ];
        return $this->metricCache['profile'] = (array_sum(array_map('intval', $checks)) / count($checks)) * 100;
    }

    private function creditActiveTime(int $userId, string $token, bool $complete): bool
    {
        if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
            throw new InvalidArgumentException('Sesión de simulación inválida.');
        }

        $this->conn->begin_transaction();
        try {
            $statement = $this->conn->prepare(
                "SELECT id, assignment_id, completed_at, duration_seconds, is_active,
                        LEAST(90, GREATEST(0, TIMESTAMPDIFF(SECOND, last_activity_at, CURRENT_TIMESTAMP))) AS elapsed
                 FROM simulation_activity_sessions
                 WHERE session_token = ? AND user_id = ?
                 FOR UPDATE"
            );
            $statement->bind_param('si', $token, $userId);
            $statement->execute();
            $session = $statement->get_result()->fetch_assoc();
            $statement->close();

            if (!$session) {
                throw new RuntimeException('No se encontró la sesión de simulación.');
            }
            if ($session['completed_at'] !== null) {
                $this->conn->commit();
                return false;
            }

            $elapsed = (int) $session['is_active'] === 1 ? (int) $session['elapsed'] : 0;
            $creditedDuration = (int) $session['duration_seconds'] + $elapsed;
            if ($complete && $creditedDuration < self::MIN_COMPLETION_SECONDS) {
                throw new InvalidArgumentException(
                    'Explora la simulación durante al menos 1 minuto antes de finalizarla.'
                );
            }

            if (!$complete && (int) $session['is_active'] !== 1) {
                $this->conn->commit();
                return false;
            }
            if ($complete) {
                $update = $this->conn->prepare(
                    'UPDATE simulation_activity_sessions
                     SET duration_seconds = duration_seconds + ?, last_activity_at = CURRENT_TIMESTAMP,
                         completed_at = CURRENT_TIMESTAMP
                     WHERE id = ? AND completed_at IS NULL'
                );
            } else {
                $update = $this->conn->prepare(
                    'UPDATE simulation_activity_sessions
                     SET duration_seconds = duration_seconds + ?, last_activity_at = CURRENT_TIMESTAMP
                     WHERE id = ? AND completed_at IS NULL'
                );
            }
            $sessionId = (int) $session['id'];
            $update->bind_param('ii', $elapsed, $sessionId);
            $update->execute();
            $completedNow = $complete && $update->affected_rows === 1;
            $update->close();

            if ($completedNow && !empty($session['assignment_id'])) {
                $assignmentId = (int) $session['assignment_id'];
                $assignment = $this->conn->prepare(
                    "UPDATE asignaciones SET estado = 'completada'
                     WHERE id = ? AND id_estudiante = ?"
                );
                $assignment->bind_param('ii', $assignmentId, $userId);
                $assignment->execute();
                $assignment->close();
            }

            $this->conn->commit();
            return $completedNow;
        } catch (Throwable $error) {
            $this->conn->rollback();
            throw $error;
        }
    }

    private function sessionDuration(int $userId, string $token): int
    {
        $statement = $this->conn->prepare(
            'SELECT duration_seconds FROM simulation_activity_sessions
             WHERE session_token = ? AND user_id = ? LIMIT 1'
        );
        $statement->bind_param('si', $token, $userId);
        $statement->execute();
        $duration = (int) ($statement->get_result()->fetch_assoc()['duration_seconds'] ?? 0);
        $statement->close();
        return $duration;
    }

    private function validatedSimulationId(int $simulationId): int
    {
        $statement = $this->conn->prepare('SELECT id FROM simulaciones WHERE id = ? LIMIT 1');
        $statement->bind_param('i', $simulationId);
        $statement->execute();
        $exists = (bool) $statement->get_result()->fetch_assoc();
        $statement->close();
        if (!$exists) {
            throw new InvalidArgumentException('La simulación seleccionada no existe.');
        }
        return $simulationId;
    }

    private function validatedAssignmentId(int $userId, int $simulationId, ?int $assignmentId): ?int
    {
        if (!$assignmentId || $assignmentId < 1) {
            return null;
        }

        $statement = $this->conn->prepare(
            'SELECT id FROM asignaciones
             WHERE id = ? AND id_estudiante = ? AND id_simulacion = ? LIMIT 1'
        );
        $statement->bind_param('iii', $assignmentId, $userId, $simulationId);
        $statement->execute();
        $valid = (bool) $statement->get_result()->fetch_assoc();
        $statement->close();
        return $valid ? $assignmentId : null;
    }

    private function notificationPayload(array $definition): array
    {
        return [
            'code' => $definition['code'],
            'title' => $definition['name'],
            'message' => '¡Logro desbloqueado! ' . $definition['description'],
            'icon' => $definition['icon'],
            'level' => $definition['level'],
            'xp' => (int) $definition['xp_reward'],
        ];
    }

    private function formatProgress(float $value): string
    {
        return abs($value - round($value)) < 0.001
            ? (string) (int) round($value)
            : number_format($value, 1, '.', '');
    }
}
