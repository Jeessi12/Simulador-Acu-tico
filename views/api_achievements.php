<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/../app/models/Conexion.php';
require_once __DIR__ . '/../app/services/AchievementManager.php';

function achievementApiResponse(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    achievementApiResponse(405, ['ok' => false, 'message' => 'Método no permitido.']);
}

if (empty($_SESSION['id'])) {
    achievementApiResponse(401, ['ok' => false, 'message' => 'Tu sesión ha expirado.']);
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    achievementApiResponse(400, ['ok' => false, 'message' => 'Solicitud inválida.']);
}

if (!AchievementManager::validateCsrfToken($payload['csrf_token'] ?? null)) {
    achievementApiResponse(403, ['ok' => false, 'message' => 'Token de seguridad inválido.']);
}

$action = (string) ($payload['action'] ?? '');
$userId = (int) $_SESSION['id'];

try {
    $manager = new AchievementManager((new Conexion())->getConnection());
    $result = match ($action) {
        'start_simulation' => $manager->startSimulation(
            $userId,
            (int) ($payload['simulation_id'] ?? 0),
            isset($payload['assignment_id']) ? (int) $payload['assignment_id'] : null
        ),
        'heartbeat_simulation' => $manager->heartbeatSimulation(
            $userId,
            (string) ($payload['session_token'] ?? '')
        ),
        'pause_simulation' => $manager->pauseSimulation(
            $userId,
            (string) ($payload['session_token'] ?? '')
        ),
        'resume_simulation' => $manager->resumeSimulation(
            $userId,
            (string) ($payload['session_token'] ?? '')
        ),
        'complete_simulation' => $manager->completeSimulation(
            $userId,
            (string) ($payload['session_token'] ?? ''),
            false
        ),
        default => throw new InvalidArgumentException('Acción de logro no reconocida.'),
    };

    achievementApiResponse(200, ['ok' => true, 'data' => $result]);
} catch (InvalidArgumentException $error) {
    achievementApiResponse(422, ['ok' => false, 'message' => $error->getMessage()]);
} catch (Throwable $error) {
    error_log('BlueEcoSim achievement API error: ' . $error->getMessage());
    achievementApiResponse(500, [
        'ok' => false,
        'message' => 'No fue posible actualizar tus logros. Intenta nuevamente.',
    ]);
}
