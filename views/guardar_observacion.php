<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['id']) || !isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Sesion no valida.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
    exit;
}

include __DIR__ . '/../app/models/Conexion.php';
include __DIR__ . '/../app/models/ObservacionesSchema.php';

$conn = (new Conexion())->getConnection();
ensureObservacionesSimulacionTable($conn);

$id_estudiante = intval($_SESSION['id']);
$id_asignacion = intval($_POST['id_asignacion'] ?? 0);
$observacion = trim($_POST['observacion'] ?? '');

if ($id_asignacion <= 0 || $observacion === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Escribe una observacion para guardar.']);
    exit;
}

if (mb_strlen($observacion, 'UTF-8') > 1000) {
    $observacion = mb_substr($observacion, 0, 1000, 'UTF-8');
}

$stmt = mysqli_prepare($conn, "SELECT id, id_docente, id_simulacion, id_espacio FROM asignaciones WHERE id = ? AND id_estudiante = ? LIMIT 1");
mysqli_stmt_bind_param($stmt, "ii", $id_asignacion, $id_estudiante);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
mysqli_stmt_close($stmt);

if (!$result || mysqli_num_rows($result) === 0) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'No tienes acceso a esta asignacion.']);
    exit;
}

$stmt = mysqli_prepare($conn, "INSERT INTO observaciones_simulacion (id_asignacion, id_estudiante, observacion) VALUES (?, ?, ?)");
mysqli_stmt_bind_param($stmt, "iis", $id_asignacion, $id_estudiante, $observacion);
$saved = mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

if ($saved) {
    mysqli_query($conn,
        "UPDATE asignaciones
         SET estado = 'en_progreso'
         WHERE id = $id_asignacion
           AND id_estudiante = $id_estudiante
           AND estado = 'pendiente'"
    );
    echo json_encode([
        'ok' => true,
        'message' => 'Observacion guardada.',
        'observation' => [
            'usuario' => $_SESSION['usuario'] ?? 'Estudiante',
            'fecha' => date('d/m/Y H:i'),
            'observacion' => $observacion
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(500);
echo json_encode(['ok' => false, 'message' => 'No se pudo guardar la observacion.']);
