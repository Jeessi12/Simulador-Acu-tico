<?php
if (session_status() === PHP_SESSION_NONE) session_start();
require_once __DIR__ . '/../app/support/AuthRedirect.php';
include __DIR__ . '/../app/models/Conexion.php';
include __DIR__ . '/../app/models/ObservacionesSchema.php';
$conn = (new Conexion())->getConnection();
ensureObservacionesSimulacionTable($conn);

AuthRedirect::requireAuthentication();

if ($_SESSION['rol'] != 1) {
    header("Location: login.php?error=locked");
    exit;
}

$id_estudiante = $_SESSION['id'];
$username      = $_SESSION['usuario'];
$mensaje       = '';
$error         = '';

// ── Marcar simulación como completada ────────────────────────────────────────
if (isset($_GET['completar']) && is_numeric($_GET['completar'])) {
    $id_asig = intval($_GET['completar']);
    $chk = mysqli_query($conn,
        "SELECT id, id_docente, id_estudiante, id_simulacion, id_espacio
         FROM asignaciones
         WHERE id = $id_asig AND id_estudiante = $id_estudiante"
    );
    if (mysqli_num_rows($chk) > 0) {
        $asignacion_actual = mysqli_fetch_assoc($chk);
        $redir_base = 'asignaciones.php';
        if (!empty($asignacion_actual['id_espacio'])) {
            $redir_base .= '?id_espacio=' . intval($asignacion_actual['id_espacio']) . '&msg=';
        } else {
            $redir_base .= '?msg=';
        }
        $obs_chk = mysqli_query($conn,
            "SELECT id
             FROM observaciones_simulacion
             WHERE id_asignacion = $id_asig
               AND id_estudiante = $id_estudiante
             LIMIT 1"
        );
        if ($obs_chk && mysqli_num_rows($obs_chk) > 0) {
            mysqli_query($conn,
                "UPDATE asignaciones
                 SET estado = 'completada'
                 WHERE id = $id_asig AND id_estudiante = $id_estudiante"
            );
            header("Location: " . $redir_base . urlencode('Simulacion completada correctamente.'));
            exit();
        }
        header("Location: " . $redir_base . urlencode('Debes dejar al menos una observacion antes de completar la simulacion.'));
        exit();
    }
    header("Location: asignaciones.php");
    exit();
}

// ── Aceptar / Rechazar invitación ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['responder_inv'])) {
    $id_esp_inv = intval($_POST['id_espacio_inv']);
    $accion_inv = $_POST['accion_inv'] ?? '';
    if ($id_esp_inv > 0 && in_array($accion_inv, ['aceptar', 'rechazar'])) {
        $nuevo_estado = $accion_inv === 'aceptar' ? 'aceptado' : 'rechazado';
        mysqli_query($conn,
            "UPDATE espacio_estudiantes SET estado = '$nuevo_estado'
             WHERE id_espacio = $id_esp_inv AND id_estudiante = $id_estudiante"
        );
        mysqli_query($conn,
            "UPDATE notificaciones SET leida = 1
             WHERE id_usuario = $id_estudiante AND id_espacio = $id_esp_inv AND tipo = 'invitacion'"
        );
        if ($accion_inv === 'rechazar') {
            mysqli_query($conn,
                "UPDATE notificaciones SET eliminado = 1
                 WHERE id_usuario = $id_estudiante AND id_espacio = $id_esp_inv AND tipo = 'invitacion'"
            );
        }
        $msg_redir = $accion_inv === 'aceptar' ? '¡Te uniste al espacio correctamente!' : 'Invitación rechazada.';
        header("Location: asignaciones.php?msg=" . urlencode($msg_redir));
        exit();
    }
}

// ── Unirse a espacio por código ──────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['unirse_codigo'])) {
    $codigo = strtoupper(trim($_POST['codigo_aula'] ?? ''));
    if (strlen($codigo) !== 6) {
        $error = 'El código debe tener exactamente 6 caracteres.';
    } else {
        $todos = mysqli_query($conn, "SELECT id, nombre FROM espacios");
        $encontrado = null;
        while ($esp = mysqli_fetch_assoc($todos)) {
            if (strtoupper(substr(md5($esp['id']), 0, 6)) === $codigo) {
                $encontrado = $esp;
                break;
            }
        }
        if (!$encontrado) {
            $error = 'Código no válido. Verifica e intenta de nuevo.';
        } else {
            $id_esp = $encontrado['id'];
            $existe = mysqli_query($conn,
                "SELECT estado FROM espacio_estudiantes
                 WHERE id_espacio = $id_esp AND id_estudiante = $id_estudiante"
            );
            if ($existe && mysqli_num_rows($existe) > 0) {
                $row_e = mysqli_fetch_assoc($existe);
                if ($row_e['estado'] === 'aceptado') {
                    $error = 'Ya eres miembro de este espacio.';
                } elseif ($row_e['estado'] === 'pendiente') {
                    mysqli_query($conn,
                        "UPDATE espacio_estudiantes SET estado = 'aceptado'
                         WHERE id_espacio = $id_esp AND id_estudiante = $id_estudiante"
                    );
                    $mensaje = '¡Te uniste a "' . htmlspecialchars($encontrado['nombre']) . '" correctamente!';
                } else {
                    mysqli_query($conn,
                        "UPDATE espacio_estudiantes SET estado = 'aceptado'
                         WHERE id_espacio = $id_esp AND id_estudiante = $id_estudiante"
                    );
                    $mensaje = '¡Te uniste a "' . htmlspecialchars($encontrado['nombre']) . '" correctamente!';
                }
            } else {
                mysqli_query($conn,
                    "INSERT INTO espacio_estudiantes (id_espacio, id_estudiante, estado)
                     VALUES ($id_esp, $id_estudiante, 'aceptado')"
                );
                $mensaje = '¡Te uniste a "' . htmlspecialchars($encontrado['nombre']) . '" correctamente!';
            }
        }
    }
}

if (isset($_GET['msg']) && $mensaje === '') $mensaje = htmlspecialchars($_GET['msg']);

// ── Invitaciones pendientes ──────────────────────────────────────────────────
$invitaciones_q = mysqli_query($conn,
    "SELECT e.id, e.nombre, e.portada, u.username AS docente_nombre, ee.fecha_union
     FROM espacio_estudiantes ee
     JOIN espacios e  ON ee.id_espacio  = e.id
     JOIN usuarios u  ON e.id_docente   = u.id
     WHERE ee.id_estudiante = $id_estudiante AND ee.estado = 'pendiente'
     ORDER BY ee.fecha_union DESC"
);
$invitaciones = [];
while ($inv = mysqli_fetch_assoc($invitaciones_q)) $invitaciones[] = $inv;

// ── Mis espacios (aceptados) ─────────────────────────────────────────────────
$espacios_q = mysqli_query($conn,
    "SELECT e.id, e.nombre, e.portada, u.username AS docente_nombre,
            (SELECT COUNT(*) FROM asignaciones a2
             WHERE a2.id_espacio = e.id AND a2.id_estudiante = $id_estudiante) AS num_sims
     FROM espacio_estudiantes ee
     JOIN espacios e  ON ee.id_espacio = e.id
     JOIN usuarios u  ON e.id_docente  = u.id
     WHERE ee.id_estudiante = $id_estudiante AND ee.estado = 'aceptado'
     ORDER BY e.fecha_creacion DESC"
);
$mis_espacios = [];
while ($esp = mysqli_fetch_assoc($espacios_q)) $mis_espacios[] = $esp;

// ── Simulaciones asignadas ───────────────────────────────────────────────────
$sims_q = mysqli_query($conn,
    "SELECT a.id,
            a.estado,
            a.fecha_asignacion,
            a.id_espacio,
            s.nombre AS sim_nombre, s.descripcion, s.ruta,
            e.nombre AS espacio_nombre,
            (SELECT COUNT(*) FROM observaciones_simulacion os
             WHERE os.id_estudiante = $id_estudiante
               AND os.id_asignacion = a.id) AS observaciones_count,
            (SELECT os.observacion
             FROM observaciones_simulacion os
             WHERE os.id_estudiante = $id_estudiante
               AND os.id_asignacion = a.id
             ORDER BY os.fecha DESC, os.id DESC
             LIMIT 1) AS ultima_observacion,
            (SELECT DATE_FORMAT(os.fecha, '%d/%m/%Y %H:%i')
             FROM observaciones_simulacion os
             WHERE os.id_estudiante = $id_estudiante
               AND os.id_asignacion = a.id
             ORDER BY os.fecha DESC, os.id DESC
             LIMIT 1) AS ultima_observacion_fecha
     FROM asignaciones a
     JOIN simulaciones s ON a.id_simulacion = s.id
     LEFT JOIN espacios e ON a.id_espacio = e.id
     WHERE a.id_estudiante = $id_estudiante
     ORDER BY a.fecha_asignacion DESC"
);
$simulaciones = [];
$simulaciones_por_espacio = [];
$completadas  = 0;
while ($f = mysqli_fetch_assoc($sims_q)) {
    $simulaciones[] = $f;
    if (!empty($f['id_espacio'])) {
        $simulaciones_por_espacio[intval($f['id_espacio'])][] = $f;
    }
    if ($f['estado'] === 'completada') $completadas++;
}
$total      = count($simulaciones);
$porcentaje = $total > 0 ? round(($completadas / $total) * 100) : 0;
$pendientes_count = $total - $completadas;

$id_espacio_detalle = isset($_GET['id_espacio']) && is_numeric($_GET['id_espacio'])
    ? intval($_GET['id_espacio'])
    : 0;
$espacio_detalle = null;
$simulaciones_detalle = [];
if ($id_espacio_detalle > 0) {
    $espacio_detalle_q = mysqli_query($conn,
        "SELECT e.id, e.nombre, e.portada, e.fecha_creacion, u.username AS docente_nombre
         FROM espacio_estudiantes ee
         JOIN espacios e ON ee.id_espacio = e.id
         JOIN usuarios u ON e.id_docente = u.id
         WHERE ee.id_estudiante = $id_estudiante
           AND ee.estado = 'aceptado'
           AND e.id = $id_espacio_detalle
         LIMIT 1"
    );
    if ($espacio_detalle_q && mysqli_num_rows($espacio_detalle_q) > 0) {
        $espacio_detalle = mysqli_fetch_assoc($espacio_detalle_q);
        $simulaciones_detalle = $simulaciones_por_espacio[$id_espacio_detalle] ?? [];
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis espacios | EcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/asignaciones.css">
</head>
<body>

<?php include(__DIR__ . "/fragments/navbar.php"); ?>
<div class="spacer"></div>

<main class="asignaciones-container">

    <!-- ALERTAS -->
    <?php if ($mensaje): ?>
        <div class="eco-alert eco-alert--success">
            <i class="fas fa-check-circle"></i> <?php echo $mensaje; ?>
        </div>
    <?php elseif ($error): ?>
        <div class="eco-alert eco-alert--error">
            <i class="fas fa-exclamation-circle"></i> <?php echo $error; ?>
        </div>
    <?php endif; ?>

    <?php if ($espacio_detalle): ?>
    <?php
        $detalle_total = count($simulaciones_detalle);
        $detalle_completadas = 0;
        foreach ($simulaciones_detalle as $sim_detalle_count) {
            if ($sim_detalle_count['estado'] === 'completada') $detalle_completadas++;
        }
        $detalle_pendientes = $detalle_total - $detalle_completadas;
        $codigo_aula = strtoupper(substr(md5($espacio_detalle['id']), 0, 6));
    ?>
    <section class="student-space-hero"
             <?php if (!empty($espacio_detalle['portada'])): ?>
             style="background-image:url('<?php echo htmlspecialchars($espacio_detalle['portada']); ?>')"
             <?php endif; ?>>
        <a href="asignaciones.php" class="student-space-back">
            <i class="fas fa-chevron-left"></i>
            Volver a mis espacios
        </a>
        <div class="student-space-title">
            <div class="student-space-initial"><?php echo strtoupper(substr($espacio_detalle['nombre'], 0, 1)); ?></div>
            <div>
                <h1><?php echo htmlspecialchars($espacio_detalle['nombre']); ?></h1>
                <p>
                    <span>Docente: <?php echo htmlspecialchars($espacio_detalle['docente_nombre']); ?></span>
                    <span>Codigo del aula: <strong><?php echo $codigo_aula; ?></strong></span>
                </p>
            </div>
        </div>
    </section>

    <section class="student-space-summary">
        <div class="student-summary-card">
            <span>Total</span>
            <strong><?php echo $detalle_total; ?></strong>
        </div>
        <div class="student-summary-card ok">
            <span>Completadas</span>
            <strong><?php echo $detalle_completadas; ?></strong>
        </div>
        <div class="student-summary-card warn">
            <span>Pendientes</span>
            <strong><?php echo $detalle_pendientes; ?></strong>
        </div>
    </section>

    <section class="section-card student-space-tasks">
        <div class="panel-header">
            <h2><i class="fas fa-list-check"></i> Simulaciones de esta clase</h2>
            <p>Entra a tus actividades desde aqui y revisa tu comentario guardado.</p>
        </div>
        <?php if (!empty($simulaciones_detalle)): ?>
        <div class="simulaciones-grid student-space-grid">
            <?php foreach ($simulaciones_detalle as $sim): ?>
            <?php
                $simRuta = $sim['ruta'] ?? 'simulador.php';
                $separator = strpos($simRuta, '?') !== false ? '&' : '?';
                $simRutaAsignada = $simRuta . $separator . 'asignacion=' . intval($sim['id']) . '&start=1';
            ?>
            <article class="simulacion-card">
                <div class="card-main">
                    <div class="card-icon"><i class="fas fa-water"></i></div>
                    <div class="card-title">
                        <h3><?php echo htmlspecialchars($sim['sim_nombre']); ?></h3>
                        <span class="estado-badge estado-badge--<?php echo $sim['estado']; ?>">
                            <?php
                            echo match($sim['estado']) {
                                'completada'  => 'Completada',
                                'en_progreso' => 'En progreso',
                                default       => 'Pendiente'
                            };
                            ?>
                        </span>
                    </div>
                </div>
                <p class="descripcion"><?php echo htmlspecialchars($sim['descripcion'] ?? 'Sin descripcion'); ?></p>
                <div class="fecha-entrega">
                    <i class="fas fa-calendar-alt"></i>
                    <?php echo date('d/m/Y', strtotime($sim['fecha_asignacion'])); ?>
                </div>
                <div class="sim-espacio-tag observaciones-tag">
                    <i class="fas fa-comment-dots"></i>
                    <?php echo intval($sim['observaciones_count'] ?? 0); ?> observacion<?php echo intval($sim['observaciones_count'] ?? 0) === 1 ? '' : 'es'; ?>
                </div>
                <?php if (!empty($sim['ultima_observacion'])): ?>
                <div class="student-comment-preview">
                    <div class="student-comment-avatar" aria-hidden="true">
                        <?php echo strtoupper(substr($username, 0, 1)); ?>
                    </div>
                    <div class="student-comment-body">
                        <div class="student-comment-meta">
                            <strong><?php echo htmlspecialchars($username); ?></strong>
                            <span><?php echo htmlspecialchars($sim['ultima_observacion_fecha'] ?? ''); ?></span>
                        </div>
                        <p><?php echo htmlspecialchars($sim['ultima_observacion']); ?></p>
                    </div>
                </div>
                <?php endif; ?>
                <div class="card-actions">
                    <a href="<?php echo htmlspecialchars($simRutaAsignada); ?>" class="btn-simular">
                        Entrar <i class="fas fa-arrow-right"></i>
                    </a>
                    <?php if ($sim['estado'] !== 'completada'): ?>
                    <a href="?completar=<?php echo $sim['id']; ?>" class="btn-completar">
                        <i class="fas fa-check"></i> Completar
                    </a>
                    <?php endif; ?>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
        <?php else: ?>
        <div class="no-tareas">
            <i class="fas fa-water"></i>
            <p>Esta clase aun no tiene simulaciones asignadas.</p>
        </div>
        <?php endif; ?>
    </section>
    <?php else: ?>

    <!-- HERO -->
    <section class="dashboard-hero">
         <canvas id="particles"></canvas>
        <div class="hero-content">
            <h1>Bienvenido, <?php echo htmlspecialchars($username); ?></h1>
            <p>Gestiona tus espacios, acepta invitaciones y accede a tus simulaciones ecológicas.</p>
        </div>
        <div class="hero-widgets">
            <div class="hero-widget">
                <span class="widget-label">Espacios</span>
                <strong><?php echo count($mis_espacios); ?></strong>
            </div>
            <div class="hero-widget">
                <span class="widget-label">Simulaciones</span>
                <strong><?php echo $total; ?></strong>
            </div>
            <div class="hero-widget">
                <span class="widget-label">Completadas</span>
                <strong><?php echo $completadas; ?></strong>
            </div>
            <?php if (!empty($invitaciones)): ?>
            <div class="hero-widget hero-widget--alert">
                <span class="widget-label">Invitaciones</span>
                <strong><?php echo count($invitaciones); ?></strong>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <div class="dashboard-grid">

        <!-- ══════════════════════════════════════════
             COLUMNA IZQUIERDA
             ══════════════════════════════════════════ -->
        <div class="left-col">

            <!-- Invitaciones pendientes -->
            <?php if (!empty($invitaciones)): ?>
            <section class="section-card invitaciones-panel">
                <div class="panel-header">
                    <h2>
                        <i class="fas fa-envelope-open-text"></i>
                        Invitaciones pendientes
                        <span class="badge-count"><?php echo count($invitaciones); ?></span>
                    </h2>
                    <p>Tu docente te invitó a estos espacios.</p>
                </div>
                <div class="invitaciones-lista">
                    <?php foreach ($invitaciones as $inv): ?>
                    <div class="inv-card">
                        <div class="inv-card-icon"
                             <?php if (!empty($inv['portada'])): ?>
                             style="background-image:url('<?php echo htmlspecialchars($inv['portada']); ?>')"
                             <?php endif; ?>>
                            <?php echo strtoupper(substr($inv['nombre'], 0, 1)); ?>
                        </div>
                        <div class="inv-card-info">
                            <strong><?php echo htmlspecialchars($inv['nombre']); ?></strong>
                            <span><i class="fas fa-chalkboard-teacher"></i> <?php echo htmlspecialchars($inv['docente_nombre']); ?></span>
                        </div>
                        <form method="POST" class="inv-card-actions">
                            <input type="hidden" name="id_espacio_inv" value="<?php echo $inv['id']; ?>">
                            <input type="hidden" name="responder_inv"  value="1">
                            <button type="submit" name="accion_inv" value="aceptar" class="btn-inv btn-inv--aceptar">
                                <i class="fas fa-check"></i> Aceptar
                            </button>
                            <button type="submit" name="accion_inv" value="rechazar" class="btn-inv btn-inv--rechazar">
                                <i class="fas fa-times"></i> Rechazar
                            </button>
                        </form>
                    </div>
                    <?php endforeach; ?>
                </div>
            </section>
            <?php endif; ?>

            <!-- Unirse por código -->
            <section class="section-card codigo-panel" id="unirse-clase">
                <div class="panel-header">
                    <h2><i class="fas fa-key"></i> Unirse a un espacio</h2>
                    <p>Ingresa el código de 6 caracteres que te dio tu docente.</p>
                </div>
                <form method="POST" class="codigo-form" id="codigoForm">
                    <div class="codigo-inputs" id="codigoInputs">
                        <?php for ($i = 0; $i < 6; $i++): ?>
                            <input type="text"
                                   maxlength="1"
                                   class="codigo-char"
                                   data-index="<?php echo $i; ?>"
                                   autocomplete="off"
                                   inputmode="text"
                                   style="text-transform:uppercase">
                        <?php endfor; ?>
                        <input type="hidden" name="codigo_aula" id="codigoAulaHidden">
                    </div>
                    <button type="submit" name="unirse_codigo" class="btn-unirse">
                        <i class="fas fa-door-open"></i> Unirse al espacio
                    </button>
                </form>
            </section>

            <!-- Mis espacios -->
            <section class="section-card espacios-panel">
                <div class="panel-header">
                    <h2><i class="fas fa-chalkboard"></i> Mis espacios</h2>
                    <p>Clases en las que participas actualmente.</p>
                </div>
                <?php if (!empty($mis_espacios)): ?>
                <div class="espacios-grid">
                    <?php foreach ($mis_espacios as $esp): ?>
                    <div class="espacio-card"
                         role="link"
                         tabindex="0"
                         onclick="window.location.href='asignaciones.php?id_espacio=<?php echo intval($esp['id']); ?>'"
                         onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.location.href='asignaciones.php?id_espacio=<?php echo intval($esp['id']); ?>'; }"
                         <?php if (!empty($esp['portada'])): ?>
                         style="background-image:url('<?php echo htmlspecialchars($esp['portada']); ?>')"
                         <?php endif; ?>>
                        <div class="espacio-card-overlay">
                            <div class="espacio-card-icon">
                                <?php echo strtoupper(substr($esp['nombre'], 0, 1)); ?>
                            </div>
                            <div class="espacio-card-info">
                                <strong><?php echo htmlspecialchars($esp['nombre']); ?></strong>
                                <span>
                                    <i class="fas fa-chalkboard-teacher"></i>
                                    <?php echo htmlspecialchars($esp['docente_nombre']); ?>
                                </span>
                                <span>
                                    <i class="fas fa-tasks"></i>
                                    <?php echo $esp['num_sims']; ?> simulación<?php echo $esp['num_sims'] != 1 ? 'es' : ''; ?>
                                </span>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php else: ?>
                <div class="no-tareas">
                    <i class="fas fa-chalkboard"></i>
                    <p>Aún no perteneces a ningún espacio.</p>
                    <span>Ingresa un código o espera la invitación de tu docente.</span>
                </div>
                <?php endif; ?>
            </section>

        </div><!-- fin left-col -->

        <!-- ══════════════════════════════════════════
             COLUMNA DERECHA
             ══════════════════════════════════════════ -->
        <aside class="sidebar-panel">

            <!-- Progreso -->
            <div class="section-card tareas-panel">
                <div class="panel-header">
                    <h2><i class="fas fa-chart-pie"></i> Progreso general</h2>
                </div>
                <div class="progress-card">
                    <div class="progress-circle">
                        <svg viewBox="0 0 36 36" class="progress-ring">
                            <path class="bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831
                                   a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="fill"
                                stroke-dasharray="<?php echo $porcentaje; ?>, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831
                                   a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        </svg>
                        <div class="progress-text">
                            <span class="progress-number"><?php echo $porcentaje; ?>%</span>
                            <span class="progress-label">Completado</span>
                        </div>
                    </div>
                    <div class="progress-stats">
                        <div class="progress-stat">
                            <span class="stat-val"><?php echo $total; ?></span>
                            <span class="stat-label">Total</span>
                        </div>
                        <div class="progress-stat progress-stat--ok">
                            <span class="stat-val"><?php echo $completadas; ?></span>
                            <span class="stat-label">Listas</span>
                        </div>
                        <div class="progress-stat progress-stat--warn">
                            <span class="stat-val"><?php echo $pendientes_count; ?></span>
                            <span class="stat-label">Pendientes</span>
                        </div>
                    </div>
                </div>

                <!-- Tareas pendientes (lista rápida) -->
                <div class="panel-header" style="margin-top:1.5rem">
                    <h2><i class="fas fa-list-check"></i> Pendientes</h2>
                </div>
                <div class="tareas-lista">
                    <?php
                    $hay_pendientes = false;
                    foreach ($simulaciones as $sim):
                        if ($sim['estado'] === 'completada') continue;
                        $hay_pendientes = true;
                    ?>
                    <div class="tarea-item">
                        <div class="tarea-info">
                            <span class="tarea-nombre"><?php echo htmlspecialchars($sim['sim_nombre']); ?></span>
                            <?php if (!empty($sim['espacio_nombre'])): ?>
                            <span class="tarea-espacio"><?php echo htmlspecialchars($sim['espacio_nombre']); ?></span>
                            <?php endif; ?>
                            <span class="tarea-fecha"><?php echo date('d/m/Y', strtotime($sim['fecha_asignacion'])); ?></span>
                        </div>
                        <a href="?completar=<?php echo $sim['id']; ?>" class="tarea-accion" title="Marcar completada">
                            <i class="fas fa-check"></i>
                        </a>
                    </div>
                    <?php endforeach; ?>
                    <?php if (!$hay_pendientes): ?>
                    <div class="no-tareas" style="padding:16px 0">
                        <p>¡Estás al día! 🎉</p>
                    </div>
                    <?php endif; ?>
                </div>
            </div>

        </aside>

    </div><!-- fin dashboard-grid -->

    <!-- ══════════════════════════════════════════
         SIMULACIONES — ancho completo, fuera del grid
         ══════════════════════════════════════════ -->
    <section class="section-card simulaciones-panel">
        <div class="panel-header">
            <h2><i class="fas fa-fish"></i> Simulaciones asignadas</h2>
            <p>Accede a tus actividades y registra tu avance.</p>
        </div>
        <?php if (!empty($simulaciones)): ?>
        <div class="simulaciones-grid">
            <?php foreach ($simulaciones as $sim): ?>
            <?php
                $simRuta = $sim['ruta'] ?? 'simulador.php';
                $separator = strpos($simRuta, '?') !== false ? '&' : '?';
                $simRutaAsignada = $simRuta . $separator . 'asignacion=' . intval($sim['id']) . '&start=1';
            ?>
            <article class="simulacion-card">
                <div class="card-main">
                    <div class="card-icon">
                        <i class="fas fa-water"></i>
                    </div>
                    <div class="card-title">
                        <h3><?php echo htmlspecialchars($sim['sim_nombre']); ?></h3>
                        <span class="estado-badge estado-badge--<?php echo $sim['estado']; ?>">
                            <?php
                            echo match($sim['estado']) {
                                'completada'  => 'Completada',
                                'en_progreso' => 'En progreso',
                                default       => 'Pendiente'
                            };
                            ?>
                        </span>
                    </div>
                </div>
                <?php if (!empty($sim['espacio_nombre'])): ?>
                <div class="sim-espacio-tag">
                    <i class="fas fa-chalkboard"></i>
                    <?php echo htmlspecialchars($sim['espacio_nombre']); ?>
                </div>
                <?php endif; ?>
                <p class="descripcion">
                    <?php echo htmlspecialchars($sim['descripcion'] ?? 'Sin descripción'); ?>
                </p>
                <div class="fecha-entrega">
                    <i class="fas fa-calendar-alt"></i>
                    <?php echo date('d/m/Y', strtotime($sim['fecha_asignacion'])); ?>
                </div>
                <div class="sim-espacio-tag observaciones-tag">
                    <i class="fas fa-comment-dots"></i>
                    <?php echo intval($sim['observaciones_count'] ?? 0); ?> observacion<?php echo intval($sim['observaciones_count'] ?? 0) === 1 ? '' : 'es'; ?>
                </div>
                <?php if (!empty($sim['ultima_observacion'])): ?>
                <div class="student-comment-preview">
                    <div class="student-comment-avatar" aria-hidden="true">
                        <?php echo strtoupper(substr($username, 0, 1)); ?>
                    </div>
                    <div class="student-comment-body">
                        <div class="student-comment-meta">
                            <strong><?php echo htmlspecialchars($username); ?></strong>
                            <span><?php echo htmlspecialchars($sim['ultima_observacion_fecha'] ?? ''); ?></span>
                        </div>
                        <p><?php echo htmlspecialchars($sim['ultima_observacion']); ?></p>
                    </div>
                </div>
                <?php endif; ?>
                <div class="card-actions">
                    <a href="<?php echo htmlspecialchars($simRutaAsignada); ?>" class="btn-simular">
                        Entrar <i class="fas fa-arrow-right"></i>
                    </a>
                    <?php if ($sim['estado'] !== 'completada'): ?>
                    <a href="?completar=<?php echo $sim['id']; ?>" class="btn-completar">
                        <i class="fas fa-check"></i> Completar
                    </a>
                    <?php endif; ?>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
        <?php else: ?>
        <div class="no-tareas">
            <i class="fas fa-water"></i>
            <p>No tienes simulaciones asignadas todavía.</p>
        </div>
        <?php endif; ?>
    </section>

<?php endif; ?>
</main>

<?php include("fragments/footer.php"); ?>
<script src="../public/js/burbujas.js" defer></script>
<script src="../public/js/asignaciones.js" defer></script>

</body>
</html>
