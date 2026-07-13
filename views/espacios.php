<?php
session_start();
require_once __DIR__ . '/../app/support/AuthRedirect.php';

if (!defined('ROL_ESTUDIANTE')) {
    define('ROL_ESTUDIANTE', 1);
    define('ROL_DOCENTE', 2);
    define('ROL_PERSONAL', 3);
    define('ROL_ADMIN', 4);
}
// â”€â”€ ConexiÃ³n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$ruta_conexion = __DIR__ . '/../app/models/Conexion.php';
if (!file_exists($ruta_conexion)) {
    $ruta_conexion = __DIR__ . '/../PHP/conexion.php';
}
include $ruta_conexion;
include __DIR__ . '/../app/models/ObservacionesSchema.php';
$conn = (new Conexion())->getConnection();
ensureObservacionesSimulacionTable($conn);

AuthRedirect::requireAuthentication();

if ($_SESSION['rol'] != ROL_DOCENTE) {
    header("Location: login.php?error=locked");
    exit();
}

$id_docente = $_SESSION['id'];
$mensaje = '';
$error = '';
if (isset($_GET['msg'])) {
    $mensaje = htmlspecialchars($_GET['msg']);
}

// â”€â”€ Crear espacio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['crear_espacio'])) {
    $nombre = trim($_POST['nombre_espacio']);
    $imagen = trim($_POST['portada'] ?? '');
    if ($nombre === '') {
        $error = 'El nombre del espacio no puede estar vacÃ­o.';
    } elseif ($imagen === '') {
        $error = 'Debes seleccionar una imagen para el espacio.';
    } else {
        $stmt = mysqli_prepare($conn, "INSERT INTO espacios (nombre, id_docente, portada) VALUES (?, ?, ?)");
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "sis", $nombre, $id_docente, $imagen);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            $mensaje = "Espacio \"$nombre\" creado correctamente.";
        } else {
            $error = 'Error al crear el espacio.';
        }
    }
}

// â”€â”€ Eliminar espacio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['eliminar_espacio'])) {
    $id_eliminar = intval($_POST['id_espacio_eliminar']);
    if ($id_eliminar > 0) {
        $verificar = mysqli_query($conn,
            "SELECT id, nombre FROM espacios WHERE id = $id_eliminar AND id_docente = $id_docente"
        );
        if ($verificar && mysqli_num_rows($verificar) > 0) {
            $espacio_data = mysqli_fetch_assoc($verificar);
            mysqli_begin_transaction($conn);
            try {
                $ids_est = [];
                $res = mysqli_query($conn,
                    "SELECT id_estudiante FROM espacio_estudiantes WHERE id_espacio = $id_eliminar"
                );
                if ($res) {
                    while ($row = mysqli_fetch_assoc($res)) {
                        $ids_est[] = intval($row['id_estudiante']);
                    }
                }
                if (!empty($ids_est)) {
                    $lista = implode(',', $ids_est);
                    mysqli_query($conn,
                        "DELETE FROM asignaciones
                         WHERE id_docente = $id_docente AND id_estudiante IN ($lista)"
                    );
                }
                mysqli_query($conn, "DELETE FROM espacio_estudiantes WHERE id_espacio = $id_eliminar");
                mysqli_query($conn, "DELETE FROM espacios WHERE id = $id_eliminar AND id_docente = $id_docente");
                mysqli_commit($conn);
                $mensaje = "Espacio \"{$espacio_data['nombre']}\" eliminado correctamente.";
            } catch (Exception $e) {
                mysqli_rollback($conn);
                $error = 'Error al eliminar el espacio.';
            }
        } else {
            $error = 'El espacio no existe o no tienes permiso para eliminarlo.';
        }
    }
}

$id_espacio = isset($_GET['id_espacio']) && is_numeric($_GET['id_espacio'])
    ? intval($_GET['id_espacio']) : 0;

if ($id_espacio > 0) {
    $espacio_query = mysqli_query($conn,
        "SELECT * FROM espacios WHERE id = $id_espacio AND id_docente = $id_docente"
    );
    if (!$espacio_query || mysqli_num_rows($espacio_query) === 0) {
        $error = 'El espacio no existe o no tienes acceso.';
        $id_espacio = 0;
    } else {
        $espacio_actual = mysqli_fetch_assoc($espacio_query);

        // â”€â”€ Invitar / Re-invitar estudiantes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        // ON DUPLICATE KEY UPDATE permite re-invitar a quienes rechazaron
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['invitar'])) {
            $seleccionados = $_POST['estudiantes'] ?? [];
            if (empty($seleccionados)) {
                $error = 'Selecciona al menos un estudiante.';
            } else {
                $stmt = mysqli_prepare($conn,
                    "INSERT INTO espacio_estudiantes (id_espacio, id_estudiante, estado)
                     VALUES (?, ?, 'pendiente')
                     ON DUPLICATE KEY UPDATE estado = 'pendiente'"
                );
                $stmt_n = mysqli_prepare($conn,
                    "INSERT INTO notificaciones (id_usuario, mensaje, tipo, id_espacio) VALUES (?, ?, 'invitacion', ?)"
                );
                if ($stmt && $stmt_n) {
                    foreach ($seleccionados as $id_est) {
                        $id_est = intval($id_est);
                        mysqli_stmt_bind_param($stmt, "ii", $id_espacio, $id_est);
                        mysqli_stmt_execute($stmt);
                        $msg = "Te han invitado al espacio: " . $espacio_actual['nombre'];
                        mysqli_stmt_bind_param($stmt_n, "isi", $id_est, $msg, $id_espacio);
                        mysqli_stmt_execute($stmt_n);
                    }
                    mysqli_stmt_close($stmt);
                    mysqli_stmt_close($stmt_n);
                    $mensaje = 'Invitaciones enviadas correctamente.';
                } else {
                    $error = 'Error al invitar estudiantes.';
                }
            }
        }

        // â”€â”€ Eliminar miembro del espacio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['eliminar_miembro'])) {
            $id_miembro = intval($_POST['id_miembro']);
            if ($id_miembro > 0) {
                mysqli_begin_transaction($conn);
                try {
                    mysqli_query($conn,
                        "DELETE FROM asignaciones
                         WHERE id_docente = $id_docente
                           AND id_estudiante = $id_miembro
                           AND id_espacio = $id_espacio"
                    );
                    mysqli_query($conn,
                        "DELETE FROM espacio_estudiantes
                         WHERE id_espacio = $id_espacio AND id_estudiante = $id_miembro"
                    );
                    mysqli_commit($conn);
                    $mensaje = 'Miembro eliminado del espacio.';
                } catch (Exception $e) {
                    mysqli_rollback($conn);
                    $error = 'Error al eliminar el miembro.';
                }
            }
        }

        // â”€â”€ Asignar simulaciÃ³n a todo el espacio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['asignar_simulacion_tarea'])) {
            $id_simulacion = intval($_POST['simulacion'] ?? 0);
            $modo_asignacion = $_POST['modo_asignacion'] ?? 'todos';
            $seleccionados = $_POST['estudiantes_asignar'] ?? [];

            if ($id_simulacion <= 0) {
                $error = 'Elige una simulacion.';
            } else {
                $ids_destino = [];
                if ($modo_asignacion === 'seleccionados') {
                    foreach ($seleccionados as $id_est) {
                        $id_est = intval($id_est);
                        if ($id_est > 0) $ids_destino[] = $id_est;
                    }
                } else {
                    $miembros_asig = mysqli_query($conn,
                        "SELECT id_estudiante FROM espacio_estudiantes
                         WHERE id_espacio = $id_espacio AND estado = 'aceptado'"
                    );
                    if ($miembros_asig) {
                        while ($m = mysqli_fetch_assoc($miembros_asig)) {
                            $ids_destino[] = intval($m['id_estudiante']);
                        }
                    }
                }

                $permitidos = [];
                $permitidos_q = mysqli_query($conn,
                    "SELECT id_estudiante FROM espacio_estudiantes
                     WHERE id_espacio = $id_espacio AND estado = 'aceptado'"
                );
                if ($permitidos_q) {
                    while ($p = mysqli_fetch_assoc($permitidos_q)) {
                        $permitidos[] = intval($p['id_estudiante']);
                    }
                }
                $ids_destino = array_values(array_intersect(array_unique($ids_destino), $permitidos));

                if (empty($ids_destino)) {
                    $error = $modo_asignacion === 'seleccionados'
                        ? 'Selecciona al menos un estudiante activo.'
                        : 'El espacio no tiene estudiantes activos para asignar.';
                } else {
                    $sim_nombre = '';
                    $sim_query = mysqli_query($conn, "SELECT nombre FROM simulaciones WHERE id = $id_simulacion");
                    if ($sim_query && $sim_row = mysqli_fetch_assoc($sim_query)) {
                        $sim_nombre = $sim_row['nombre'];
                    }

                    $stmt_insert = mysqli_prepare($conn,
                        "INSERT INTO asignaciones (id_docente, id_estudiante, id_simulacion, id_espacio, estado)
                         VALUES (?, ?, ?, ?, 'pendiente')"
                    );
                    $stmt_noti = mysqli_prepare($conn,
                        "INSERT INTO notificaciones (id_usuario, mensaje, tipo, id_espacio)
                         VALUES (?, ?, 'asignacion', ?)"
                    );

                    if ($stmt_insert && $stmt_noti) {
                        $total_asignadas = 0;
                        mysqli_begin_transaction($conn);
                        try {
                            foreach ($ids_destino as $id_est) {
                                mysqli_stmt_bind_param($stmt_insert, "iiii", $id_docente, $id_est, $id_simulacion, $id_espacio);
                                mysqli_stmt_execute($stmt_insert);

                                $msg = "Nueva tarea de simulacion en " . $espacio_actual['nombre'] . ": " . $sim_nombre;
                                mysqli_stmt_bind_param($stmt_noti, "isi", $id_est, $msg, $id_espacio);
                                mysqli_stmt_execute($stmt_noti);
                                $total_asignadas++;
                            }
                            mysqli_commit($conn);
                            $mensaje = "Tarea asignada a $total_asignadas estudiante" . ($total_asignadas !== 1 ? 's' : '') . ".";
                            header("Location: espacios.php?id_espacio=$id_espacio&msg=" . urlencode($mensaje));
                            exit();
                        } catch (Exception $e) {
                            mysqli_rollback($conn);
                            $error = 'Error al asignar la tarea.';
                        }
                        mysqli_stmt_close($stmt_insert);
                        mysqli_stmt_close($stmt_noti);
                    } else {
                        $error = 'Error al preparar la asignacion.';
                    }
                }
            }
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['asignar_espacio'])) {
            $id_simulacion = intval($_POST['simulacion']);
            if ($id_simulacion <= 0) {
                $error = 'Elige una simulaciÃ³n.';
            } else {
                $miembros_asig = mysqli_query($conn,
                    "SELECT id_estudiante FROM espacio_estudiantes
                     WHERE id_espacio = $id_espacio AND estado = 'aceptado'"
                );
                if (!$miembros_asig || mysqli_num_rows($miembros_asig) === 0) {
                    $error = 'El espacio no tiene estudiantes que hayan aceptado la invitaciÃ³n.';
                } else {
                    $sim_nombre = '';
                    $sim_query = mysqli_query($conn,
                        "SELECT nombre FROM simulaciones WHERE id = $id_simulacion"
                    );
                    if ($sim_query && $sim_row = mysqli_fetch_assoc($sim_query)) {
                        $sim_nombre = $sim_row['nombre'];
                    }
                    $stmt_a = mysqli_prepare($conn,
                        "INSERT INTO asignaciones (id_docente, id_estudiante, id_simulacion, id_espacio) VALUES (?, ?, ?, ?)"
                    );
                    $stmt_n = mysqli_prepare($conn,
                        "INSERT INTO notificaciones (id_usuario, mensaje) VALUES (?, ?)"
                    );
                    if ($stmt_a && $stmt_n) {
                        while ($m = mysqli_fetch_assoc($miembros_asig)) {
                            $id_est = $m['id_estudiante'];
                            mysqli_stmt_bind_param($stmt_a, "iiii", $id_docente, $id_est, $id_simulacion, $id_espacio);
                            mysqli_stmt_execute($stmt_a);
                            $msg = "Nueva simulaciÃ³n en el espacio: " . $sim_nombre;
                            mysqli_stmt_bind_param($stmt_n, "is", $id_est, $msg);
                            mysqli_stmt_execute($stmt_n);
                        }
                        mysqli_stmt_close($stmt_a);
                        mysqli_stmt_close($stmt_n);
                        $mensaje = 'SimulaciÃ³n asignada a todos los miembros.';
                    } else {
                        $error = 'Error al preparar las consultas de asignaciÃ³n.';
                    }
                }
            }
        }

        // â”€â”€ Miembros: aceptados + pendientes + rechazados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        $miembros = mysqli_query($conn,
            "SELECT u.id, u.username, u.email, u.google_id, ee.estado
             FROM espacio_estudiantes ee
             JOIN usuarios u ON ee.id_estudiante = u.id
             WHERE ee.id_espacio = $id_espacio
               AND ee.estado IN ('aceptado', 'pendiente', 'rechazado')
             ORDER BY FIELD(ee.estado, 'aceptado', 'pendiente', 'rechazado'), u.username"
        );
        if (!$miembros) $miembros = false;

        // â”€â”€ IDs de quienes rechazaron (para mostrar etiqueta en lista de invitar) â”€â”€
        $rechazados_ids = [];
        $res_rech = mysqli_query($conn,
            "SELECT id_estudiante FROM espacio_estudiantes
             WHERE id_espacio = $id_espacio AND estado = 'rechazado'"
        );
        if ($res_rech) {
            while ($rr = mysqli_fetch_assoc($res_rech)) {
                $rechazados_ids[] = intval($rr['id_estudiante']);
            }
        }

        // â”€â”€ Estudiantes disponibles para invitar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        // Excluye solo pendientes y aceptados; los que rechazaron SÃ aparecen
        $estudiantes_disponibles = mysqli_query($conn,
            "SELECT id, username, email, google_id FROM usuarios
             WHERE rol_id = 1 AND id NOT IN (
                 SELECT id_estudiante FROM espacio_estudiantes
                 WHERE id_espacio = $id_espacio
                   AND estado IN ('pendiente', 'aceptado')
             ) ORDER BY username"
        );
        if (!$estudiantes_disponibles) $estudiantes_disponibles = false;

        // â”€â”€ Simulaciones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        $simulaciones = mysqli_query($conn, "SELECT id, nombre, descripcion, ruta FROM simulaciones ORDER BY id");
        if (!$simulaciones) $simulaciones = false;
        $simulaciones_lista = [];
        if ($simulaciones) {
            while ($sim_row = mysqli_fetch_assoc($simulaciones)) {
                $simulaciones_lista[] = $sim_row;
            }
        }

        $estudiantes_activos_asignar = [];
        $estudiantes_activos_q = mysqli_query($conn,
            "SELECT u.id, u.username, u.email, u.google_id
             FROM espacio_estudiantes ee
             JOIN usuarios u ON ee.id_estudiante = u.id
             WHERE ee.id_espacio = $id_espacio AND ee.estado = 'aceptado'
             ORDER BY u.username"
        );
        if ($estudiantes_activos_q) {
            while ($est_asig = mysqli_fetch_assoc($estudiantes_activos_q)) {
                $estudiantes_activos_asignar[] = $est_asig;
            }
        }

        // â”€â”€ Tareas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        $tareas_pendientes = mysqli_query($conn,
            "SELECT a.id, s.nombre AS sim_nombre, u.username,
                    a.fecha_asignacion, a.estado
             FROM asignaciones a
             JOIN simulaciones s ON a.id_simulacion = s.id
             JOIN usuarios u ON a.id_estudiante = u.id
             WHERE a.id_docente = $id_docente
               AND a.id_espacio = $id_espacio
               AND a.estado IN ('pendiente','en_progreso')
             ORDER BY a.fecha_asignacion DESC"
        );
        if (!$tareas_pendientes) $tareas_pendientes = false;

        $tareas_completadas = mysqli_query($conn,
            "SELECT a.id, s.nombre AS sim_nombre, u.username,
                    a.fecha_asignacion, a.estado,
                    (SELECT CONCAT(DATE_FORMAT(os.fecha, '%d/%m/%Y %H:%i'), ' - ', os.observacion)
                     FROM observaciones_simulacion os
                     WHERE os.id_asignacion = a.id
                     ORDER BY os.fecha DESC, os.id DESC
                     LIMIT 1) AS observaciones
             FROM asignaciones a
             JOIN simulaciones s ON a.id_simulacion = s.id
             JOIN usuarios u ON a.id_estudiante = u.id
             WHERE a.id_docente = $id_docente
               AND a.id_espacio = $id_espacio
               AND a.estado = 'completada'
             ORDER BY a.fecha_asignacion DESC"
        );
        if (!$tareas_completadas) $tareas_completadas = false;

        $num_pendientes  = ($tareas_pendientes  && !is_bool($tareas_pendientes))
            ? mysqli_num_rows($tareas_pendientes)  : 0;
        $num_completadas = ($tareas_completadas && !is_bool($tareas_completadas))
            ? mysqli_num_rows($tareas_completadas) : 0;
        $num_tareas_total = $num_pendientes + $num_completadas;
    }
}

// â”€â”€ Lista principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if ($id_espacio === 0) {
    $espacios = mysqli_query($conn,
        "SELECT e.id, e.nombre, e.fecha_creacion, e.portada,
                (SELECT COUNT(*) FROM espacio_estudiantes WHERE id_espacio = e.id AND estado = 'aceptado') AS num_miembros,
                (SELECT COUNT(*) FROM asignaciones a WHERE a.id_espacio = e.id AND a.id_docente = $id_docente) AS num_simulaciones
         FROM espacios e
         WHERE e.id_docente = $id_docente
         ORDER BY e.fecha_creacion DESC"
    );
    if (!$espacios) $espacios = false;
}

// â”€â”€ Las 6 imÃ¡genes disponibles para fondos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
$fondos_disponibles = [
    ['ruta' => '../public/media/backgrounds/espacios1.png', 'alt' => 'Bosque tropical'],
    ['ruta' => '../public/media/backgrounds/espacios2.png', 'alt' => 'OcÃ©ano azul'],
    ['ruta' => '../public/media/backgrounds/espacios3.png', 'alt' => 'Pradera verde'],
    ['ruta' => '../public/media/backgrounds/espacios4.png', 'alt' => 'MontaÃ±as nevadas'],
    ['ruta' => '../public/media/backgrounds/espacios5.png', 'alt' => 'Desierto dorado'],
    ['ruta' => '../public/media/backgrounds/espacios6.png', 'alt' => 'Arrecife coral'],
];

// â”€â”€ Helper: URL del avatar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getAvatarUrl(string $email, ?string $google_id): string {
    if (!empty($google_id)) {
        return "https://lh3.googleusercontent.com/a/{$google_id}=s80-c";
    }
    $hash = md5(strtolower(trim($email)));
    return "https://www.gravatar.com/avatar/{$hash}?s=80&d=identicon";
}

// â”€â”€ Helper: badge de estado de miembro â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function estadoBadge(string $estado): string {
    switch ($estado) {
        case 'aceptado':
            return '<span class="member-badge badge-aceptado">Activo</span>';
        case 'pendiente':
            return '<span class="member-badge badge-pendiente">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        Pendiente
                    </span>';
        case 'rechazado':
            return '<span class="member-badge badge-rechazado">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        RechazÃ³
                    </span>';
        default:
            return '';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis espacios EcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../public/css/espacios.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/estados-miembros.css">
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>


</head>
<body>
    <?php include 'fragments/navbar.php'; ?>
    <canvas id="particles"></canvas>

    <main class="classroom-container">

        <?php if ($id_espacio > 0 && isset($espacio_actual)): ?>

        <!-- ====== VISTA DETALLE DEL ESPACIO ====== -->

        <?php if ($mensaje): ?>
            <div class="alert success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                <?php echo $mensaje; ?>
            </div>
        <?php elseif ($error): ?>
            <div class="alert error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <div class="classroom-header-detail"
             <?php if (!empty($espacio_actual['portada'])): ?>
             style="background-image: url('<?php echo htmlspecialchars($espacio_actual['portada']); ?>')"
             <?php endif; ?>>
            <div class="detail-overlay">
                <a href="espacios.php" class="back-button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                    Volver a mis espacios
                </a>
                <div class="detail-title-section">
                    <div class="detail-left">
                        <div class="classroom-icon large">
                            <?php echo strtoupper(substr($espacio_actual['nombre'], 0, 1)); ?>
                        </div>
                        <div>
                            <h1><?php echo htmlspecialchars($espacio_actual['nombre']); ?></h1>
                            <div class="classroom-meta">
                                <span>CÃ³digo del aula: <strong><?php echo strtoupper(substr(md5($espacio_actual['id']), 0, 6)); ?></strong></span>
                                <span>â€¢ Creado el <?php echo date('d/m/Y', strtotime($espacio_actual['fecha_creacion'])); ?></span>
                            </div>
                        </div>
                    </div>
                    <div class="detail-actions">
                        <button class="btn-delete-detail" id="btnEliminarDetalle"
                                data-nombre="<?php echo htmlspecialchars($espacio_actual['nombre']); ?>">
                            <svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></svg>
                            Eliminar espacio
                        </button>
                        <form method="POST" id="formEliminarDetalle" style="display:none;">
                            <input type="hidden" name="id_espacio_eliminar" value="<?php echo $espacio_actual['id']; ?>">
                            <input type="hidden" name="eliminar_espacio" value="1">
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="classroom-grid">

            <!-- â”€â”€ Miembros â”€â”€ -->
            <div class="classroom-card">
                <div class="card-header">
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <h2>Miembros</h2>
                    <span class="badge"><?php echo ($miembros && !is_bool($miembros)) ? mysqli_num_rows($miembros) : 0; ?></span>
                </div>
                <div class="members-list">
                    <?php if ($miembros && mysqli_num_rows($miembros) > 0): ?>
                        <?php while ($m = mysqli_fetch_assoc($miembros)): ?>
                            <?php $avatarUrl = getAvatarUrl($m['email'], $m['google_id']); ?>
                            <div class="member-item estado-<?php echo $m['estado']; ?>">
                                <div class="member-avatar">
                                    <img src="<?php echo htmlspecialchars($avatarUrl); ?>"
                                         alt="<?php echo htmlspecialchars($m['username']); ?>"
                                         onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                                    <span class="avatar-fallback">
                                        <?php echo strtoupper(substr($m['username'], 0, 1)); ?>
                                    </span>
                                </div>
                                <div class="member-info">
                                    <strong><?php echo htmlspecialchars($m['username']); ?></strong>
                                    <span><?php echo htmlspecialchars($m['email']); ?></span>
                                </div>
                                <div class="member-right">
                                    <?php echo estadoBadge($m['estado']); ?>
                                    <button class="btn-remove-member"
                                            data-id="<?php echo $m['id']; ?>"
                                            data-nombre="<?php echo htmlspecialchars($m['username']); ?>"
                                            title="Eliminar del espacio">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                            <line x1="17" y1="11" x2="22" y2="16"/>
                                            <line x1="22" y1="11" x2="17" y2="16"/>
                                        </svg>
                                    </button>
                                    <form method="POST" id="removeMemberForm_<?php echo $m['id']; ?>" style="display:none;">
                                        <input type="hidden" name="id_miembro" value="<?php echo $m['id']; ?>">
                                        <input type="hidden" name="eliminar_miembro" value="1">
                                    </form>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <div class="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dadce0" stroke-width="1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            <p>No hay estudiantes en este espacio</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- â”€â”€ Invitar / Re-invitar estudiantes â”€â”€ -->
            <div class="classroom-card">
                <div class="card-header">
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    </div>
                    <h2>Invitar estudiantes</h2>
                </div>
                <div class="invite-section">
                    <?php if ($estudiantes_disponibles && mysqli_num_rows($estudiantes_disponibles) > 0): ?>
                        <div class="search-box">
                            <input type="text" id="searchStudent" placeholder="Buscar estudiante...">
                        </div>
                        <form method="POST" id="inviteForm">
                            <div class="students-list" id="studentsList">
                                <?php while ($est = mysqli_fetch_assoc($estudiantes_disponibles)): ?>
                                    <?php
                                        $estAvatar    = getAvatarUrl($est['email'], $est['google_id']);
                                        $es_rechazado = in_array(intval($est['id']), $rechazados_ids);
                                    ?>
                                    <label class="student-item">
                                        <input type="checkbox" name="estudiantes[]" value="<?php echo $est['id']; ?>">
                                        <div class="student-avatar">
                                            <img src="<?php echo htmlspecialchars($estAvatar); ?>"
                                                 alt="<?php echo htmlspecialchars($est['username']); ?>"
                                                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                                            <span class="avatar-fallback">
                                                <?php echo strtoupper(substr($est['username'], 0, 1)); ?>
                                            </span>
                                        </div>
                                        <div class="student-info">
                                            <strong>
                                                <?php echo htmlspecialchars($est['username']); ?>
                                                <?php if ($es_rechazado): ?>
                                                    <span class="tag-rechazado">RechazÃ³ antes</span>
                                                <?php endif; ?>
                                            </strong>
                                            <span><?php echo htmlspecialchars($est['email']); ?></span>
                                        </div>
                                    </label>
                                <?php endwhile; ?>
                            </div>
                            <button type="submit" name="invitar" class="btn-primary">Invitar seleccionados</button>
                        </form>
                    <?php else: ?>
                        <div class="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dadce0" stroke-width="1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            <p>Todos los estudiantes ya estÃ¡n en el espacio</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- â”€â”€ Tareas â”€â”€ -->
            <div class="classroom-card full-width">
                <div class="card-header">
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4"/></svg>
                    </div>
                    <h2>Tareas</h2>
                    <span class="badge"><?php echo $num_tareas_total; ?></span>
                </div>
                <div class="tasks-section">
                    <div class="task-tabs">
                        <button class="task-tab active" onclick="switchTab('pending', this)">
                            Pendientes (<?php echo $num_pendientes; ?>)
                        </button>
                        <button class="task-tab" onclick="switchTab('done', this)">
                            Completadas (<?php echo $num_completadas; ?>)
                        </button>
                    </div>
                    <div class="task-content visible" id="tab-pending">
                        <?php if ($tareas_pendientes && mysqli_num_rows($tareas_pendientes) > 0): ?>
                            <?php while ($t = mysqli_fetch_assoc($tareas_pendientes)): ?>
                                <div class="task-item">
                                    <div class="task-icon pending">
                                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                    </div>
                                    <div class="task-info">
                                        <strong><?php echo htmlspecialchars($t['sim_nombre']); ?></strong>
                                        <span>Asignada a <?php echo htmlspecialchars($t['username']); ?> Â· <?php echo date('d/m/Y', strtotime($t['fecha_asignacion'])); ?></span>
                                    </div>
                                    <span class="pill-pending"><?php echo $t['estado'] === 'en_progreso' ? 'En progreso' : 'Pendiente'; ?></span>
                                </div>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <div class="empty-state" style="padding:24px 0">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dadce0" stroke-width="1"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/></svg>
                                <p>No hay tareas pendientes</p>
                            </div>
                        <?php endif; ?>
                    </div>
                    <div class="task-content" id="tab-done">
                        <?php if ($tareas_completadas && mysqli_num_rows($tareas_completadas) > 0): ?>
                            <?php while ($t = mysqli_fetch_assoc($tareas_completadas)): ?>
                                <div class="task-item">
                                    <div class="task-icon done">
                                        <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                                    </div>
                                    <div class="task-info">
                                        <strong><?php echo htmlspecialchars($t['sim_nombre']); ?></strong>
                                        <span>Completada por <?php echo htmlspecialchars($t['username']); ?> Â· <?php echo date('d/m/Y', strtotime($t['fecha_asignacion'])); ?></span>
                                        <?php if (!empty($t['observaciones'])): ?>
                                            <div class="teacher-observations">
                                                <?php foreach (explode('||', $t['observaciones']) as $obs_txt): ?>
                                                    <p><?php echo htmlspecialchars($obs_txt); ?></p>
                                                <?php endforeach; ?>
                                            </div>
                                        <?php else: ?>
                                            <div class="teacher-observations teacher-observations--empty">
                                                <p>Sin observaciones registradas.</p>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                    <span class="pill-done">Completada</span>
                                </div>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <div class="empty-state" style="padding:24px 0">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dadce0" stroke-width="1"><path d="M20 6L9 17l-5-5"/></svg>
                                <p>No hay tareas completadas aÃºn</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- â”€â”€ Asignar simulaciÃ³n â”€â”€ -->
            <div class="classroom-card full-width">
                <div class="card-header">
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24"><path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
                    </div>
                    <h2>Asignar simulaciÃ³n</h2>
                </div>
                <div class="teacher-sim-grid">
                    <?php foreach ($simulaciones_lista as $sim): ?>
                        <?php
                            $sim_id = intval($sim['id']);
                            $sim_icon = $sim_id === 2 ? 'fa-link' : ($sim_id === 3 ? 'fa-flask' : 'fa-water');
                            $sim_tag = $sim_id === 2 ? 'Poblaciones' : ($sim_id === 3 ? 'Impacto' : 'Equilibrio');
                        ?>
                        <button type="button"
                                class="teacher-sim-card sim-theme-<?php echo $sim_id; ?>"
                                data-sim-id="<?php echo $sim_id; ?>"
                                data-sim-name="<?php echo htmlspecialchars($sim['nombre']); ?>"
                                data-sim-description="<?php echo htmlspecialchars($sim['descripcion'] ?? 'Simulacion interactiva de BlueEcoSim'); ?>"
                                data-sim-tag="<?php echo $sim_tag; ?>">
                            <span class="teacher-sim-banner">
                                <i class="fas <?php echo $sim_icon; ?>"></i>
                                <small><?php echo $sim_tag; ?></small>
                            </span>
                            <strong><?php echo htmlspecialchars($sim['nombre']); ?></strong>
                            <p><?php echo htmlspecialchars($sim['descripcion'] ?? 'Simulacion interactiva de BlueEcoSim'); ?></p>
                        </button>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="assign-modal-overlay" id="assignSimulationModal" hidden>
                <div class="assign-modal-card" role="dialog" aria-modal="true" aria-labelledby="assignModalTitle">
                    <button type="button" class="assign-modal-close" id="assignModalClose" aria-label="Cerrar">&times;</button>
                    <span id="assignModalTag">Simulacion</span>
                    <h2 id="assignModalTitle">Asignar simulacion</h2>
                    <p id="assignModalDescription">Selecciona a quienes se les asignara esta tarea.</p>

                    <form method="POST" class="assign-task-form" id="assignTaskForm">
                        <input type="hidden" name="simulacion" id="assignSimulationId">
                        <input type="hidden" name="asignar_simulacion_tarea" value="1">

                        <div class="assign-mode">
                            <label>
                                <input type="radio" name="modo_asignacion" value="todos" checked>
                                <span>Asignar a todos los estudiantes activos</span>
                            </label>
                            <label>
                                <input type="radio" name="modo_asignacion" value="seleccionados">
                                <span>Elegir estudiantes</span>
                            </label>
                        </div>

                        <div class="assign-students" id="assignStudentsList" hidden>
                            <?php if (!empty($estudiantes_activos_asignar)): ?>
                                <?php foreach ($estudiantes_activos_asignar as $est_asig): ?>
                                    <?php $estAvatar = getAvatarUrl($est_asig['email'], $est_asig['google_id']); ?>
                                    <label class="assign-student-row">
                                        <input type="checkbox" name="estudiantes_asignar[]" value="<?php echo intval($est_asig['id']); ?>">
                                        <span class="student-avatar small">
                                            <img src="<?php echo htmlspecialchars($estAvatar); ?>"
                                                 alt="<?php echo htmlspecialchars($est_asig['username']); ?>"
                                                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                                            <span class="avatar-fallback"><?php echo strtoupper(substr($est_asig['username'], 0, 1)); ?></span>
                                        </span>
                                        <span>
                                            <strong><?php echo htmlspecialchars($est_asig['username']); ?></strong>
                                            <small><?php echo htmlspecialchars($est_asig['email']); ?></small>
                                        </span>
                                    </label>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div class="empty-state" style="padding:18px 0">
                                    <p>No hay estudiantes activos para asignar.</p>
                                </div>
                            <?php endif; ?>
                        </div>

                        <button type="submit" class="btn-assign btn-assign-modal">Asignar tarea</button>
                    </form>
                </div>
            </div>

        </div><!-- fin classroom-grid -->

        <?php else: ?>

        <!-- ====== LISTA PRINCIPAL DE ESPACIOS ====== -->
        <div class="classroom-hero">
            <div class="hero-content">
                <h1>Mis espacios</h1>
                <p>Organiza tus clases, invita estudiantes y asigna simulaciones ecolÃ³gicas</p>
            </div>
            <div class="create-space-card">
                <div class="create-form">
                    <input type="text" id="inputNombreEspacio" placeholder="Nombre del espacio, ej. BiologÃ­a 4Â°A">
                    <button type="button" class="btn-create" id="btnAbrirModal">+ Crear espacio</button>
                </div>
                <form method="POST" id="formCrearEspacio" style="display:none;">
                    <input type="hidden" name="nombre_espacio" id="hiddenNombre">
                    <input type="hidden" name="portada" id="hiddenImagen">
                    <input type="hidden" name="crear_espacio" value="1">
                </form>
            </div>
        </div>

        <?php if ($mensaje): ?>
            <div class="alert success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                <?php echo $mensaje; ?>
            </div>
        <?php elseif ($error): ?>
            <div class="alert error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <?php if ($espacios && mysqli_num_rows($espacios) > 0): ?>
            <div class="spaces-grid">
                <?php while ($esp = mysqli_fetch_assoc($espacios)): ?>
                    <div class="space-card"
                         <?php if (!empty($esp['portada'])): ?>
                         style="background-image: url('<?php echo htmlspecialchars($esp['portada']); ?>')"
                         <?php endif; ?>>
                        <div class="space-card-overlay">
                            <div class="space-header">
                                <div class="space-icon">
                                    <?php echo strtoupper(substr($esp['nombre'], 0, 1)); ?>
                                </div>
                                <div class="space-actions">
                                    <button class="btn-delete-space"
                                            data-id="<?php echo $esp['id']; ?>"
                                            data-nombre="<?php echo htmlspecialchars($esp['nombre']); ?>">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                                        </svg>
                                    </button>
                                    <form method="POST" id="deleteForm_<?php echo $esp['id']; ?>" style="display:none;">
                                        <input type="hidden" name="id_espacio_eliminar" value="<?php echo $esp['id']; ?>">
                                        <input type="hidden" name="eliminar_espacio" value="1">
                                    </form>
                                </div>
                            </div>
                            <a href="?id_espacio=<?php echo $esp['id']; ?>" class="space-link">
                                <h2><?php echo htmlspecialchars($esp['nombre']); ?></h2>
                                <div class="space-meta">
                                    <span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                        <?php echo $esp['num_miembros']; ?> miembros
                                    </span>
                                    <span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10a2 2 0 0 1 2 2v14l-7-3-7 3V5a2 2 0 0 1 2-2z"/></svg>
                                        <?php echo $esp['num_simulaciones']; ?> simulacion<?php echo $esp['num_simulaciones'] != 1 ? 'es' : ''; ?>
                                    </span>
                                    <span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7z"/></svg>
                                        <?php echo date('d/m/Y', strtotime($esp['fecha_creacion'])); ?>
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>
        <?php else: ?>
            <div class="empty-hero">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#dadce0" stroke-width="1"><path d="M4 6h16v12H4z"/><path d="M8 12h8"/></svg>
                <h2>No tienes espacios creados</h2>
                <p>Crea tu primer espacio usando el formulario de arriba</p>
            </div>
        <?php endif; ?>

        <?php endif; ?>

    </main>

    <!-- ====== MODAL SELECCIÃ“N DE FONDO ====== -->
    <div id="modalFondo" class="modal-overlay" aria-hidden="true">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div class="modal-header">
                <h2 id="modalTitle">Elige el fondo de tu espacio</h2>
                <button class="modal-close" id="btnCerrarModal" aria-label="Cerrar">&times;</button>
            </div>
            <p class="modal-sub">Selecciona una imagen para personalizar tu espacio</p>
            <div class="fondos-grid">
                <?php foreach ($fondos_disponibles as $fondo): ?>
                    <label class="fondo-item" title="<?php echo htmlspecialchars($fondo['alt']); ?>">
                        <input type="radio" name="fondo_sel" value="<?php echo htmlspecialchars($fondo['ruta']); ?>">
                        <img src="<?php echo htmlspecialchars($fondo['ruta']); ?>"
                             alt="<?php echo htmlspecialchars($fondo['alt']); ?>"
                             loading="lazy">
                        <span class="fondo-check">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                        </span>
                        <span class="fondo-label"><?php echo htmlspecialchars($fondo['alt']); ?></span>
                    </label>
                <?php endforeach; ?>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-modal-cancel" id="btnCancelarModal">Cancelar</button>
                <button type="button" class="btn-modal-confirm" id="btnConfirmarFondo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    Crear espacio
                </button>
            </div>
        </div>
    </div>

    <?php include 'fragments/footer.php'; ?>

<script src="../public/js/burbujas.js" defer></script>
<script src="../public/js/espacios.js" defer></script>
</body>
</html>
