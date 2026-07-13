<?php

require_once __DIR__ . '/../app/models/Conexion.php';
require_once __DIR__ . '/../app/services/AchievementManager.php';

function achievementAssert(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException('FAIL: ' . $message);
    }
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$conn = (new Conexion())->getConnection();
$manager = new AchievementManager($conn);
$suffix = bin2hex(random_bytes(5));
$email = "achievement-test-{$suffix}@example.test";
$username = "achievement_test_{$suffix}";
$password = password_hash('test-only-password', PASSWORD_BCRYPT);
$role = 1;
$status = 'activo';
$userId = 0;

try {
    $statement = $conn->prepare(
        'INSERT INTO usuarios (email, username, password, rol_id, estado) VALUES (?, ?, ?, ?, ?)'
    );
    $statement->bind_param('sssis', $email, $username, $password, $role, $status);
    $statement->execute();
    $userId = (int) $statement->insert_id;
    $statement->close();

    $_SESSION = [];
    $loginUnlocks = $manager->recordLogin($userId, false);
    $loginCodes = array_column($loginUnlocks, 'code');
    achievementAssert(in_array('first_login', $loginCodes, true), 'First login unlocks exactly once.');
    achievementAssert(in_array('profile_complete', $loginCodes, true), 'A complete active profile is recognized.');
    achievementAssert($manager->recordLogin($userId, false) === [], 'Repeated login on one day is idempotent.');

    foreach (['home', 'about', 'resources', 'species', 'simulations'] as $section) {
        $sectionUnlocks = $manager->recordSectionVisit($userId, $section, false);
    }
    achievementAssert(
        in_array('educational_explorer', array_column($sectionUnlocks, 'code'), true),
        'Visiting all educational sections unlocks the explorer badge.'
    );

    $session = $manager->startSimulation($userId, 1);
    $token = $session['session_token'];
    $statement = $conn->prepare(
        'UPDATE simulation_activity_sessions SET duration_seconds = 60 WHERE session_token = ?'
    );
    $statement->bind_param('s', $token);
    $statement->execute();
    $statement->close();

    $completion = $manager->completeSimulation($userId, $token, false);
    achievementAssert($completion['completed_now'] === true, 'A valid active session completes.');
    achievementAssert(
        in_array('first_simulation', array_column($completion['unlocked'], 'code'), true),
        'The first completed simulation unlocks its badge.'
    );
    $duplicate = $manager->completeSimulation($userId, $token, false);
    achievementAssert($duplicate['completed_now'] === false, 'A session cannot reward completion twice.');

    $collection = $manager->getUserAchievements($userId);
    achievementAssert($collection['totals']['total'] === 12, 'The seeded collection contains 12 achievements.');
    achievementAssert($collection['totals']['unlocked'] >= 4, 'Earned badges are reflected in profile totals.');

    fwrite(STDOUT, "AchievementManager tests passed.\n");
} finally {
    if ($userId > 0) {
        $statement = $conn->prepare('DELETE FROM usuarios WHERE id = ?');
        $statement->bind_param('i', $userId);
        $statement->execute();
        $statement->close();
    }
}
