<?php

/**
 * Incorpora un estudiante a un espacio respetando el cupo configurado.
 * El bloqueo de la fila del espacio evita que dos aceptaciones simultaneas
 * superen el limite.
 *
 * @return array{ok: bool, status: string, limit: int}
 */
function acceptStudentIntoSpace(
    mysqli $conn,
    int $spaceId,
    int $studentId,
    bool $requireExistingMembership = false
): array
{
    $defaultLimit = 30;

    if ($spaceId <= 0 || $studentId <= 0) {
        return ['ok' => false, 'status' => 'invalid', 'limit' => $defaultLimit];
    }

    if (!mysqli_begin_transaction($conn)) {
        return ['ok' => false, 'status' => 'database_error', 'limit' => $defaultLimit];
    }

    try {
        $spaceStatement = mysqli_prepare($conn, 'SELECT id FROM espacios WHERE id = ? FOR UPDATE');
        if (!$spaceStatement) {
            throw new RuntimeException('No se pudo bloquear el espacio.');
        }
        mysqli_stmt_bind_param($spaceStatement, 'i', $spaceId);
        if (!mysqli_stmt_execute($spaceStatement)) {
            throw new RuntimeException('No se pudo consultar el espacio.');
        }
        $spaceResult = mysqli_stmt_get_result($spaceStatement);
        $spaceExists = $spaceResult && mysqli_num_rows($spaceResult) > 0;
        mysqli_stmt_close($spaceStatement);

        if (!$spaceExists) {
            mysqli_rollback($conn);
            return ['ok' => false, 'status' => 'not_found', 'limit' => $defaultLimit];
        }

        $membershipStatement = mysqli_prepare(
            $conn,
            'SELECT estado FROM espacio_estudiantes WHERE id_espacio = ? AND id_estudiante = ? FOR UPDATE'
        );
        if (!$membershipStatement) {
            throw new RuntimeException('No se pudo consultar la membresia.');
        }
        mysqli_stmt_bind_param($membershipStatement, 'ii', $spaceId, $studentId);
        if (!mysqli_stmt_execute($membershipStatement)) {
            throw new RuntimeException('No se pudo consultar la membresia.');
        }
        $membershipResult = mysqli_stmt_get_result($membershipStatement);
        $membership = $membershipResult ? mysqli_fetch_assoc($membershipResult) : null;
        mysqli_stmt_close($membershipStatement);

        if ($membership && $membership['estado'] === 'aceptado') {
            mysqli_commit($conn);
            return ['ok' => true, 'status' => 'already_member', 'limit' => $defaultLimit];
        }

        if ($requireExistingMembership && !$membership) {
            mysqli_rollback($conn);
            return ['ok' => false, 'status' => 'not_invited', 'limit' => $defaultLimit];
        }

        $limitResult = mysqli_query(
            $conn,
            "SELECT valor FROM config WHERE clave = 'limite_estudiantes_espacio' LIMIT 1"
        );
        $limitRow = $limitResult ? mysqli_fetch_assoc($limitResult) : null;
        $limit = max(1, min(200, intval($limitRow['valor'] ?? $defaultLimit)));

        $countStatement = mysqli_prepare(
            $conn,
            "SELECT COUNT(*) AS total FROM espacio_estudiantes WHERE id_espacio = ? AND estado = 'aceptado'"
        );
        if (!$countStatement) {
            throw new RuntimeException('No se pudo consultar el cupo.');
        }
        mysqli_stmt_bind_param($countStatement, 'i', $spaceId);
        if (!mysqli_stmt_execute($countStatement)) {
            throw new RuntimeException('No se pudo consultar el cupo.');
        }
        $countResult = mysqli_stmt_get_result($countStatement);
        $countRow = $countResult ? mysqli_fetch_assoc($countResult) : null;
        $acceptedStudents = intval($countRow['total'] ?? 0);
        mysqli_stmt_close($countStatement);

        if ($acceptedStudents >= $limit) {
            mysqli_rollback($conn);
            return ['ok' => false, 'status' => 'capacity_reached', 'limit' => $limit];
        }

        if ($membership) {
            $joinStatement = mysqli_prepare(
                $conn,
                "UPDATE espacio_estudiantes SET estado = 'aceptado' WHERE id_espacio = ? AND id_estudiante = ?"
            );
        } else {
            $joinStatement = mysqli_prepare(
                $conn,
                "INSERT INTO espacio_estudiantes (id_espacio, id_estudiante, estado) VALUES (?, ?, 'aceptado')"
            );
        }
        if (!$joinStatement) {
            throw new RuntimeException('No se pudo preparar la union al espacio.');
        }
        mysqli_stmt_bind_param($joinStatement, 'ii', $spaceId, $studentId);
        if (!mysqli_stmt_execute($joinStatement)) {
            throw new RuntimeException('No se pudo completar la union al espacio.');
        }
        mysqli_stmt_close($joinStatement);

        if (!mysqli_commit($conn)) {
            throw new RuntimeException('No se pudo confirmar la union al espacio.');
        }

        return ['ok' => true, 'status' => 'accepted', 'limit' => $limit];
    } catch (Throwable $error) {
        mysqli_rollback($conn);
        error_log('SpaceCapacity: ' . $error->getMessage());
        return ['ok' => false, 'status' => 'database_error', 'limit' => $defaultLimit];
    }
}
