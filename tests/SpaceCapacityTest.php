<?php

require_once __DIR__ . '/../app/models/Conexion.php';
require_once __DIR__ . '/../app/support/SpaceCapacity.php';

function capacityAssert(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException('FAIL: ' . $message);
    }
}

$conn = (new Conexion())->getConnection();

// Las tablas temporales ocultan las tablas reales solo durante esta conexion.
// Esto permite probar commits y bloqueos sin modificar datos de la plataforma.
mysqli_query($conn, 'CREATE TEMPORARY TABLE config (clave VARCHAR(100) PRIMARY KEY, valor TEXT NOT NULL) ENGINE=InnoDB');
mysqli_query($conn, 'CREATE TEMPORARY TABLE espacios (id INT PRIMARY KEY) ENGINE=InnoDB');
mysqli_query($conn, "CREATE TEMPORARY TABLE espacio_estudiantes (
    id_espacio INT NOT NULL,
    id_estudiante INT NOT NULL,
    estado ENUM('pendiente','aceptado','rechazado') NOT NULL,
    PRIMARY KEY (id_espacio, id_estudiante)
) ENGINE=InnoDB");

mysqli_query($conn, "INSERT INTO config (clave, valor) VALUES ('limite_estudiantes_espacio', '1')");
mysqli_query($conn, 'INSERT INTO espacios (id) VALUES (1)');
mysqli_query($conn, "INSERT INTO espacio_estudiantes VALUES (1, 10, 'aceptado'), (1, 11, 'pendiente')");

$fullResult = acceptStudentIntoSpace($conn, 1, 11, true);
capacityAssert(!$fullResult['ok'], 'El estudiante no entra cuando el espacio esta lleno.');
capacityAssert($fullResult['status'] === 'capacity_reached', 'Se informa que el cupo fue alcanzado.');

$pendingResult = mysqli_query($conn, 'SELECT estado FROM espacio_estudiantes WHERE id_espacio = 1 AND id_estudiante = 11');
$pendingRow = mysqli_fetch_assoc($pendingResult);
capacityAssert($pendingRow['estado'] === 'pendiente', 'Una invitacion conserva su estado si no hay cupo.');

mysqli_query($conn, "UPDATE config SET valor = '2' WHERE clave = 'limite_estudiantes_espacio'");
$acceptedResult = acceptStudentIntoSpace($conn, 1, 11, true);
capacityAssert($acceptedResult['ok'], 'El estudiante entra cuando existe un cupo disponible.');
capacityAssert($acceptedResult['status'] === 'accepted', 'La union devuelve el estado aceptado.');

$notInvitedResult = acceptStudentIntoSpace($conn, 1, 12, true);
capacityAssert(!$notInvitedResult['ok'], 'No se puede aceptar una invitacion inexistente.');
capacityAssert($notInvitedResult['status'] === 'not_invited', 'Se distingue una invitacion inexistente.');

$alreadyMemberResult = acceptStudentIntoSpace($conn, 1, 11, true);
capacityAssert($alreadyMemberResult['ok'], 'Un miembro existente no genera un error.');
capacityAssert($alreadyMemberResult['status'] === 'already_member', 'Se identifica al miembro existente.');

echo "Space capacity test passed.\n";
