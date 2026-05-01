<?php
session_start();
include '../PHP/conexion.php';

if (!isset($_SESSION['usuario']) || $_SESSION['rol'] != ROL_ESTUDIANTE) {
    header("Location: login.php?error=locked");
    exit();
}

$id_estudiante = $_SESSION['id'];
$nombre_usuario = $_SESSION['usuario'];

// Marcar como completada si se pulsa el botón
if (isset($_GET['completar']) && is_numeric($_GET['completar'])) {
    $id_asig = intval($_GET['completar']);
    $check = mysqli_query($conn, "SELECT id FROM asignaciones WHERE id = $id_asig AND id_estudiante = $id_estudiante");
    if (mysqli_num_rows($check) > 0) {
        mysqli_query($conn, "UPDATE asignaciones SET estado = 'completada' WHERE id = $id_asig");
    }
    header("Location: asignaciones.php");
    exit();
}

// Obtener todas las asignaciones del estudiante
$asignaciones = mysqli_query($conn,
    "SELECT a.id, a.estado, a.fecha_asignacion, s.nombre, s.descripcion, s.ruta
     FROM asignaciones a
     JOIN simulaciones s ON a.id_simulacion = s.id
     WHERE a.id_estudiante = $id_estudiante
     ORDER BY a.fecha_asignacion DESC"
);

// Calcular progreso
$total = mysqli_num_rows($asignaciones);
$completadas = 0;
$pendientes = [];
$todas = [];
mysqli_data_seek($asignaciones, 0);
while ($tarea = mysqli_fetch_assoc($asignaciones)) {
    if ($tarea['estado'] == 'completada') $completadas++;
    else $pendientes[] = $tarea;
    $todas[] = $tarea;
}
$porcentaje = $total > 0 ? round(($completadas / $total) * 100) : 0;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Asignaciones · Blue EcoSim</title>
    <link rel="stylesheet" href="../CSS/navbar-footer.css">
    <link rel="stylesheet" href="../CSS/asignaciones_estudiante.css">
</head>
<body>
    <canvas id="particles"></canvas>
    <?php include 'fragments/navbar.php'; ?>

    <main class="dashboard-container">
        <!-- Encabezado -->
        <div class="dashboard-hero">
            <div class="hero-content">
                <h1>Bienvenido, <?php echo htmlspecialchars($nombre_usuario); ?></h1>
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
        </div>

        <div class="dashboard-grid">
            <!-- Columna izquierda: simulaciones asignadas -->
            <section class="simulaciones-col">
                <div class="section-header">
                    <h2>🌊 Simulaciones asignadas</h2>
                    <p>Explora tus actividades marinas y accede al simulador de cada asignación.</p>
                </div>

                <?php if (!empty($todas)): ?>
                    <div class="simulaciones-grid">
                        <?php foreach ($todas as $tarea): ?>
                            <article class="simulacion-card">
                                <div class="card-main">
                                    <div class="card-icon">
                                        <i class="fas fa-fish"></i>
                                    </div>
                                    <div class="card-title">
                                        <h3><?php echo htmlspecialchars($tarea['nombre']); ?></h3>
                                        <span class="estado-badge <?php echo $tarea['estado']; ?>">
                                            <?php echo ucfirst($tarea['estado']); ?>
                                        </span>
                                    </div>
                                </div>
                                <p class="descripcion"><?php echo htmlspecialchars($tarea['descripcion'] ?? 'Sin descripción'); ?></p>
                                <div class="fecha-entrega">
                                    <i class="far fa-calendar-alt"></i> Entregas: <?php echo date('d/m/Y', strtotime($tarea['fecha_asignacion'])); ?>
                                </div>
                                <div class="card-actions">
                                    <a href="<?php echo $tarea['ruta']; ?>" class="btn-simular">Entrar ➤</a>
                                    <?php if ($tarea['estado'] != 'completada'): ?>
                                        <a href="?completar=<?php echo $tarea['id']; ?>" class="btn-completar">Completar</a>
                                    <?php endif; ?>
                                </div>
                            </article>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div class="sin-tareas">
                        <i class="fas fa-water"></i>
                        <p>No tienes simulaciones asignadas todavía.</p>
                    </div>
                <?php endif; ?>
            </section>

            <!-- Columna derecha: tareas pendientes y progreso -->
            <aside class="panel-lateral">
                <div class="section-card">
                    <h3>📋 Tareas pendientes</h3>
                    <p class="section-subtitle">Revisa tus próximas acciones y sigue tu progreso en cada simulación.</p>
                    <?php if (!empty($pendientes)): ?>
                        <ul class="tareas-pendientes">
                            <?php foreach ($pendientes as $t): ?>
                                <li>
                                    <strong><?php echo htmlspecialchars($t['nombre']); ?></strong>
                                    <span><?php echo date('d/m/Y', strtotime($t['fecha_asignacion'])); ?></span>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php else: ?>
                        <p class="sin-tareas">¡Estás al día!</p>
                    <?php endif; ?>
                </div>

                <div class="progress-card">
                    <h3>Progreso general</h3>
                    <div class="progress-circle">
                        <svg viewBox="0 0 36 36" class="progress-ring">
                            <path class="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="fill" stroke-dasharray="<?php echo $porcentaje; ?>, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div class="progress-text">
                            <span class="progress-number"><?php echo $porcentaje; ?>%</span>
                            <span class="progress-label">Completado</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </main>

    <?php include 'fragments/footer.php'; ?>
    <script src="../JS/burbujas.js"></script>
</body>
</html>