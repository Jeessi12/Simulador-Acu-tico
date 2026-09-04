<?php
if (session_status() === PHP_SESSION_NONE) session_start();
include __DIR__ . '/../app/models/Conexion.php';
require_once __DIR__ . '/../app/support/SpaceCapacity.php';
$conn = (new Conexion())->getConnection();

if (!defined('ROL_ESTUDIANTE')) define('ROL_ESTUDIANTE', 1);

if (!isset($_SESSION['id']) || $_SESSION['rol'] != ROL_ESTUDIANTE) {
    exit('Acceso no autorizado');
}

$id_usuario = $_SESSION['id'];
$filtro     = $_GET['filtro'] ?? 'recibidos';
$pagina     = isset($_GET['pagina']) && is_numeric($_GET['pagina']) ? intval($_GET['pagina']) : 1;
$por_pagina = 5;
$offset     = ($pagina - 1) * $por_pagina;
$search     = $_GET['search'] ?? '';

// ── Aceptar invitación a espacio ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['aceptar_invitacion'])) {
    $id_espacio_inv = intval($_POST['id_espacio_inv']);
    $id_notif       = intval($_POST['id_notif']);
    if ($id_espacio_inv > 0) {
        $joinResult = acceptStudentIntoSpace($conn, $id_espacio_inv, $id_usuario, true);
        if ($joinResult['ok']) {
            mysqli_query($conn,
                "UPDATE notificaciones SET leida = 1, tipo = 'general'
                 WHERE id = $id_notif AND id_usuario = $id_usuario"
            );
            exit(json_encode(['ok' => true]));
        }

        $message = $joinResult['status'] === 'capacity_reached'
            ? 'Este espacio alcanzo el limite de ' . $joinResult['limit'] . ' estudiantes.'
            : 'No fue posible unirte al espacio. Intenta de nuevo.';
        exit(json_encode(['ok' => false, 'message' => $message]));
    }
    exit(json_encode(['ok' => false, 'message' => 'El espacio no es valido.']));
}

// ── Rechazar invitación a espacio ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['rechazar_invitacion'])) {
    $id_espacio_inv = intval($_POST['id_espacio_inv']);
    $id_notif       = intval($_POST['id_notif']);
    if ($id_espacio_inv > 0) {
        mysqli_query($conn,
            "UPDATE espacio_estudiantes
             SET estado = 'rechazado'
             WHERE id_espacio = $id_espacio_inv AND id_estudiante = $id_usuario"
        );
        mysqli_query($conn,
            "UPDATE notificaciones SET leida = 1, eliminado = 1
             WHERE id = $id_notif AND id_usuario = $id_usuario"
        );
    }
    exit(json_encode(['ok' => true]));
}

// ── Acciones masivas (marcar, archivar, eliminar, restaurar) ─────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ids = array_map('intval', $_POST['ids'] ?? []);
    if (!empty($ids)) {
        $lista = implode(',', $ids);
        $base  = "WHERE id IN ($lista) AND id_usuario = $id_usuario";
        if (isset($_POST['marcar_leidas']))    mysqli_query($conn, "UPDATE notificaciones SET leida = 1 $base");
        if (isset($_POST['marcar_destacadas'])) {
            $res = mysqli_query($conn, "SELECT destacado FROM notificaciones WHERE id = {$ids[0]} AND id_usuario = $id_usuario");
            $row = mysqli_fetch_assoc($res);
            $val = $row ? ($row['destacado'] ? 0 : 1) : 1;
            mysqli_query($conn, "UPDATE notificaciones SET destacado = $val $base");
        }
        if (isset($_POST['archivar']))   mysqli_query($conn, "UPDATE notificaciones SET archivado = 1 $base");
        if (isset($_POST['eliminar']))   mysqli_query($conn, "UPDATE notificaciones SET eliminado = 1 $base");
        if (isset($_POST['restaurar']))  mysqli_query($conn, "UPDATE notificaciones SET eliminado = 0, archivado = 0 $base");
    }
}

// ── WHERE según filtro ───────────────────────────────────────────────────────
$where = "WHERE id_usuario = $id_usuario";
switch ($filtro) {
    case 'recibidos':  $where .= " AND eliminado = 0 AND archivado = 0"; break;
    case 'destacados': $where .= " AND destacado = 1 AND eliminado = 0"; break;
    case 'no_leidos':  $where .= " AND leida = 0 AND eliminado = 0 AND archivado = 0"; break;
    case 'papelera':   $where .= " AND eliminado = 1"; break;
    case 'archivados': $where .= " AND archivado = 1 AND eliminado = 0"; break;
    default:           $where .= " AND eliminado = 0 AND archivado = 0";
}

if ($search !== '') {
    $search_esc = mysqli_real_escape_string($conn, $search);
    $where .= " AND mensaje LIKE '%$search_esc%'";
}

// ── Paginación ───────────────────────────────────────────────────────────────
$total_query  = mysqli_query($conn, "SELECT COUNT(*) AS total FROM notificaciones $where");
$total_row    = mysqli_fetch_assoc($total_query);
$total_notis  = $total_row['total'];
$total_paginas = ceil($total_notis / $por_pagina);

$notificaciones = mysqli_query($conn,
    "SELECT id, mensaje, leida, destacado, fecha, tipo, id_espacio
     FROM notificaciones
     $where
     ORDER BY fecha DESC
     LIMIT $offset, $por_pagina"
);

// ── Renderizado ──────────────────────────────────────────────────────────────
if (mysqli_num_rows($notificaciones) > 0):
    while ($noti = mysqli_fetch_assoc($notificaciones)):
        $es_invitacion = ($noti['tipo'] === 'invitacion' && !empty($noti['id_espacio']));

        // Verificar si ya fue respondida (estado en espacio_estudiantes)
        $ya_respondida = false;
        $estado_inv    = '';
        if ($es_invitacion) {
            $chk = mysqli_query($conn,
                "SELECT estado FROM espacio_estudiantes
                 WHERE id_espacio = {$noti['id_espacio']} AND id_estudiante = $id_usuario"
            );
            if ($chk && $row_chk = mysqli_fetch_assoc($chk)) {
                $estado_inv   = $row_chk['estado'];
                $ya_respondida = ($estado_inv !== 'pendiente');
            }
        }

        $de       = $es_invitacion ? 'Docente' : (strpos($noti['mensaje'], 'Nueva simulación') !== false ? 'Docente' : 'Sistema');
        $unread   = $noti['leida']    ? '' : 'unread';
        $destacada = $noti['destacado'] ? 'destacada' : '';
        ?>
        <div class="row <?php echo "$unread $destacada"; ?><?php echo $es_invitacion ? ' invitacion-row' : ''; ?>"
             data-id="<?php echo $noti['id']; ?>">

            <span class="checkbox-cell">
                <input type="checkbox" name="ids[]" value="<?php echo $noti['id']; ?>" class="notif-checkbox">
            </span>

            <span class="from-cell">
                <i class="fas <?php echo $es_invitacion ? 'fa-chalkboard-teacher' : 'fa-user-circle'; ?>"></i>
                <?php echo htmlspecialchars($de); ?>
            </span>

            <span class="subject-cell">
                <?php if ($es_invitacion): ?>
                    <span class="inv-badge">Invitación</span>
                <?php endif; ?>
                <?php echo htmlspecialchars($noti['mensaje']); ?>

                <?php if ($es_invitacion && !$ya_respondida): ?>
                    <span class="inv-actions">
                        <button class="btn-aceptar-inv"
                                data-notif="<?php echo $noti['id']; ?>"
                                data-espacio="<?php echo $noti['id_espacio']; ?>">
                            ✔ Aceptar
                        </button>
                        <button class="btn-rechazar-inv"
                                data-notif="<?php echo $noti['id']; ?>"
                                data-espacio="<?php echo $noti['id_espacio']; ?>">
                            ✖ Rechazar
                        </button>
                    </span>
                <?php elseif ($es_invitacion && $ya_respondida): ?>
                    <span class="inv-estado inv-estado--<?php echo $estado_inv; ?>">
                        <?php echo $estado_inv === 'aceptado' ? '✔ Aceptado' : '✖ Rechazado'; ?>
                    </span>
                <?php endif; ?>
            </span>

            <span class="date-cell">
                <i class="far fa-clock"></i>
                <?php echo date('d/m/Y', strtotime($noti['fecha'])); ?>
            </span>
        </div>
        <?php
    endwhile;
else:
    ?>
    <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No hay notificaciones</p>
        <span>Aquí aparecerán tus simulaciones e invitaciones.</span>
    </div>
    <?php
endif;

if ($total_paginas > 1):
    ?>
    <div class="pagination">
        <?php if ($pagina > 1): ?>
            <a href="#" class="page-btn" data-page="<?php echo $pagina - 1; ?>">&laquo; Anterior</a>
        <?php endif; ?>
        <span class="page-info">Página <?php echo $pagina; ?> de <?php echo $total_paginas; ?></span>
        <?php if ($pagina < $total_paginas): ?>
            <a href="#" class="page-btn" data-page="<?php echo $pagina + 1; ?>">Siguiente &raquo;</a>
        <?php endif; ?>
    </div>
    <?php
endif;
