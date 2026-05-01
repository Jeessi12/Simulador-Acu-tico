<?php 
include __DIR__ . '/../app/models/Conexion.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Verificar sesión
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] != 1) {
    header("Location: login.php?error=locked");
    exit;
}

$id_estudiante = $_SESSION['id'];
$username = $_SESSION['usuario'];
$rol_id = $_SESSION['rol'] ?? 1;

// MARCAR COMO COMPLETADA
if (isset($_GET['completar']) && is_numeric($_GET['completar'])) {
    $id_asig = intval($_GET['completar']);

    $check = mysqli_query($conn, "
        SELECT id 
        FROM asignaciones 
        WHERE id = $id_asig 
        AND id_estudiante = $id_estudiante
    ");

    if (mysqli_num_rows($check) > 0) {
        mysqli_query($conn, "
            UPDATE asignaciones 
            SET estado = 'completada' 
            WHERE id = $id_asig
        ");
    }

    header("Location: asignaciones.php");
    exit();
}

// OBTENER SIMULACIONES DESDE BD
$query = mysqli_query($conn, "
    SELECT a.id, a.estado, a.fecha_asignacion,
           s.nombre, s.descripcion, s.ruta
    FROM asignaciones a
    JOIN simulaciones s ON a.id_simulacion = s.id
    WHERE a.id_estudiante = $id_estudiante
    ORDER BY a.fecha_asignacion DESC
");

$simulaciones_asignadas = [];
$tareas_pendientes = [];
$completadas = 0;

while ($fila = mysqli_fetch_assoc($query)) {
    $simulaciones_asignadas[] = $fila;

    if ($fila['estado'] === 'completada') {
        $completadas++;
    } else {
        $tareas_pendientes[] = $fila;
    }
}

$total = count($simulaciones_asignadas);
$porcentaje = $total > 0 ? round(($completadas / $total) * 100) : 0;
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asignaciones | BlueEcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/asignaciones.css">
    <script src="../public/js/burbujas.js" defer></script>
</head>
<body>

<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<div class="spacer"></div>
<canvas id="particles"></canvas>

<main class="asignaciones-container">

    <!-- HERO -->
    <section class="dashboard-hero">
        <div class="hero-content">
            <h1>Bienvenido, <?php echo htmlspecialchars($username); ?></h1>
            <p>Gestiona tus simulaciones acuáticas y revisa tus tareas pendientes con un estilo más claro y moderno.</p>
        </div>

        <div class="hero-widgets">
            <div class="hero-widget">
                <span class="widget-label">Simulaciones</span>
                <strong><?php echo $total; ?></strong>
            </div>

            <div class="hero-widget">
                <span class="widget-label">Completadas</span>
                <strong><?php echo $completadas; ?></strong>
            </div>
        </div>
    </section>

    <div class="dashboard-grid">

        <!-- IZQUIERDA -->
        <section class="simulaciones-panel section-card">
            <div class="panel-header">
                <h2>🌊 Simulaciones asignadas</h2>
                <p>Explora tus actividades marinas y accede al simulador de cada asignación.</p>
            </div>

            <?php if (!empty($simulaciones_asignadas)): ?>
                <div class="simulaciones-grid">
                    <?php foreach ($simulaciones_asignadas as $simulacion): ?>
                    <article class="simulacion-card">
                        <div class="card-main">
                            <div class="card-icon">
                                <i class="fas fa-fish"></i>
                            </div>

                            <div class="card-title">
                                <h3><?php echo htmlspecialchars($simulacion['nombre']); ?></h3>
                                <span class="estado-badge">
                                    <?php echo ucfirst($simulacion['estado']); ?>
                                </span>
                            </div>
                        </div>

                        <p class="descripcion">
                            <?php echo htmlspecialchars($simulacion['descripcion'] ?? 'Sin descripción'); ?>
                        </p>

                        <div class="fecha-entrega">
                            <i class="fas fa-calendar-alt"></i>
                            Entrega:
                            <?php echo date('d/m/Y', strtotime($simulacion['fecha_asignacion'])); ?>
                        </div>

                        <div class="card-actions">
                            <a href="<?php echo $simulacion['ruta']; ?>" class="btn-simular">
                                Entrar ➤
                            </a>

                            <?php if ($simulacion['estado'] !== 'completada'): ?>
                                <a href="?completar=<?php echo $simulacion['id']; ?>" class="btn-simular">
                                    Completar
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

        <!-- DERECHA -->
        <aside class="sidebar-panel">
            <div class="section-card tareas-panel">
                <div class="panel-header">
                    <h2>📋 Tareas pendientes</h2>
                    <p>Revisa tus próximas acciones y sigue tu progreso en cada simulación.</p>
                </div>

                <div class="tareas-lista">
                    <?php if (!empty($tareas_pendientes)): ?>
                        <?php foreach ($tareas_pendientes as $tarea): ?>
                        <div class="tarea-item">
                            <div class="tarea-info">
                                <span class="tarea-nombre">
                                    <?php echo htmlspecialchars($tarea['nombre']); ?>
                                </span>

                                <span class="tarea-fecha">
                                    <?php echo date('d/m/Y', strtotime($tarea['fecha_asignacion'])); ?>
                                </span>
                            </div>

                            <a href="?completar=<?php echo $tarea['id']; ?>" class="tarea-accion">
                                <i class="fas fa-check"></i>
                            </a>
                        </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="no-tareas">
                            <p>¡Estás al día!</p>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- PROGRESO IGUAL AL ORIGINAL -->
                <div class="progress-card">
                    <h3>Progreso general</h3>

                    <div class="progress-circle">
                        <svg viewBox="0 0 36 36" class="progress-ring">
                            <path class="bg"
                                d="M18 2.0845
                                   a 15.9155 15.9155 0 0 1 0 31.831
                                   a 15.9155 15.9155 0 0 1 0 -31.831" />

                            <path class="fill"
                                stroke-dasharray="<?php echo $porcentaje; ?>, 100"
                                d="M18 2.0845
                                   a 15.9155 15.9155 0 0 1 0 31.831
                                   a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>

                        <div class="progress-text">
                            <span class="progress-number"><?php echo $porcentaje; ?>%</span>
                            <span class="progress-label">Completado</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

    </div>
</main>

<div id="footer-container">
    <?php include("fragments/footer.php"); ?>
</div>

</body>
</html>