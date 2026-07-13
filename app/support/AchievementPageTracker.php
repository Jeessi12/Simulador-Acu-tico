<?php

require_once __DIR__ . '/../models/Conexion.php';
require_once __DIR__ . '/../services/AchievementManager.php';

/** Records eligible page visits without coupling views to achievement rules. */
final class AchievementPageTracker
{
    public static function track(?string $sectionKey = null, ?mysqli $conn = null): void
    {
        if (empty($_SESSION['id'])) {
            return;
        }

        try {
            $manager = new AchievementManager($conn ?? (new Conexion())->getConnection());
            if ($sectionKey !== null) {
                $manager->recordSectionVisit((int) $_SESSION['id'], $sectionKey, true);
            } else {
                $manager->evaluate((int) $_SESSION['id'], true);
            }
        } catch (Throwable $error) {
            // Achievements must never make the primary educational experience unavailable.
            error_log('BlueEcoSim achievement tracking error: ' . $error->getMessage());
        }
    }

    public static function recordLogin(mysqli $conn, int $userId): void
    {
        try {
            (new AchievementManager($conn))->recordLogin($userId, true);
        } catch (Throwable $error) {
            // Authentication remains available even if an optional reward write fails.
            error_log('BlueEcoSim login achievement error: ' . $error->getMessage());
        }
    }
}
