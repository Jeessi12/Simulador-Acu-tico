<?php
session_start();
include '../PHP/conexion.php';

if (!isset($_SESSION['usuario']) || $_SESSION['rol'] != ROL_ESTUDIANTE) {
    exit('Acceso no autorizado');
}

$id_usuario = $_SESSION['id'];
$filtro = $_GET['filtro'] ?? 'recibidos';
$pagina = isset($_GET['pagina']) && is_numeric($_GET['pagina']) ? intval($_GET['pagina']) : 1;
$por_pagina = 5;
$offset = ($pagina - 1) * $por_pagina;
$search = $_GET['search'] ?? '';

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

$total_query = mysqli_query($conn, "SELECT COUNT(*) AS total FROM notificaciones $where");
$total_row = mysqli_fetch_assoc($total_query);
$total_notis = $total_row['total'];
$total_paginas = ceil($total_notis / $por_pagina);

$notificaciones = mysqli_query($conn,
    "SELECT id, mensaje, leida, destacado, fecha
     FROM notificaciones
     $where
     ORDER BY fecha DESC
     LIMIT $offset, $por_pagina"
);

if (mysqli_num_rows($notificaciones) > 0):
    while ($noti = mysqli_fetch_assoc($notificaciones)):
        $de = (strpos($noti['mensaje'], 'Nueva simulación') !== false) ? 'Docente' : 'Sistema';
        $unread = $noti['leida'] ? '' : 'unread';
        $destacada = $noti['destacado'] ? 'destacada' : '';
        ?>
        <div class="row <?php echo "$unread $destacada"; ?>" data-id="<?php echo $noti['id']; ?>">
            <span class="checkbox-cell"><input type="checkbox" name="ids[]" value="<?php echo $noti['id']; ?>" class="notif-checkbox"></span>
            <span class="from-cell"><i class="fas fa-user-circle"></i> <?php echo htmlspecialchars($de); ?></span>
            <span class="subject-cell"><?php echo htmlspecialchars($noti['mensaje']); ?></span>
            <span class="date-cell"><i class="far fa-clock"></i> <?php echo date('d/m/Y', strtotime($noti['fecha'])); ?></span>
        </div>
        <?php
    endwhile;
else:
    ?>
    <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No hay notificaciones</p>
        <span>Aquí aparecerán las notificaciones de tus simulaciones.</span>
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
?>