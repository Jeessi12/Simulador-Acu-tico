<?php 
    include("../PHP/conexion.php");

    // Iniciar sesión solo si no está iniciada
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Verificar si el usuario está logueado
    if (!isset($_SESSION['usuario'])) {
        header("Location: login.php?error=locked");
        exit;
    }

    // Obtener datos de sesión
    $rol_id = $_SESSION['rol'] ?? 1;
    $username = $_SESSION['usuario'];
    
    // Simulaciones asignadas
    $simulaciones_asignadas = [
        ['id' => 1, 'nombre' => 'Tortuga Verde', 'descripcion' => 'Estudio del hábitat y comportamiento de la tortuga verde en arrecifes costeros.', 'estado' => 'pendiente', 'fecha_entrega' => '2025-04-20'],
        ['id' => 2, 'nombre' => 'Pez Payaso', 'descripcion' => 'Análisis de la simbiosis entre el pez payaso y las anémonas marinas.', 'estado' => 'en_progreso', 'fecha_entrega' => '2025-04-25'],
        ['id' => 3, 'nombre' => 'Orcas', 'descripcion' => 'Estudio de la estructura social y patrones de caza de las orcas.', 'estado' => 'pendiente', 'fecha_entrega' => '2025-05-01'],
        ['id' => 4, 'nombre' => 'Arrecife de Coral', 'descripcion' => 'Simulación del impacto del calentamiento global en arrecifes coralinos.', 'estado' => 'completada', 'fecha_entrega' => '2025-04-10'],
        ['id' => 5, 'nombre' => 'Mantarraya', 'descripcion' => 'Estudio de migración y alimentación de la mantarraya gigante.', 'estado' => 'pendiente', 'fecha_entrega' => '2025-05-05']
    ];
    
    // Filtrar tareas pendientes
    $tareas_pendientes = array_filter($simulaciones_asignadas, function($sim) {
        return $sim['estado'] === 'pendiente' || $sim['estado'] === 'en_progreso';
    });
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asignaciones | BlueEcoSim</title>
    <link rel="icon" href="../MEDIA/Web/logo.png" type="image/png">
    
    <!-- Fuentes -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    <!-- Estilos -->
    <link rel="stylesheet" href="../CSS/navbar-footer.css">
    <link rel="stylesheet" href="../CSS/asignaciones.css">
</head>
<body>

    <!-- NAVBAR (incluido desde fragments) -->
    <div id="navbar-container"><?php include("fragments/navbar.php"); ?></div>
    <div class="spacer"></div>

    <!-- Canvas de burbujas decorativas -->
    <canvas id="bubblesCanvas"></canvas>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="asignaciones-container">
        
        <!-- Encabezado de bienvenida -->
        <div class="welcome-header">
            <div class="welcome-content">
                <h1><i class="fas fa-graduation-cap"></i> Bienvenido, <?php echo htmlspecialchars($username); ?></h1>
                <p>Gestiona tus simulaciones acuáticas y da seguimiento a tus tareas asignadas</p>
            </div>
            <div class="stats-cards">
                <div class="stat-card">
                    <i class="fas fa-tasks"></i>
                    <div class="stat-info">
                        <span class="stat-number"><?php echo count($tareas_pendientes); ?></span>
                        <span class="stat-label">Tareas Pendientes</span>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-check-circle"></i>
                    <div class="stat-info">
                        <span class="stat-number"><?php echo count(array_filter($simulaciones_asignadas, fn($s) => $s['estado'] === 'completada')); ?></span>
                        <span class="stat-label">Completadas</span>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <div class="stat-info">
                        <span class="stat-number">Próxima</span>
                        <span class="stat-label">Entrega: <?php echo date('d/m', strtotime($tareas_pendientes[0]['fecha_entrega'] ?? '2025-05-01')); ?></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sección: Simulaciones Asignadas -->
        <div class="section-card">
            <div class="section-header">
                <h2><i class="fas fa-water"></i> Simulaciones Asignadas</h2>
                <p>Explora y completa las simulaciones marinas asignadas para tu curso</p>
            </div>
            
            <div class="simulaciones-grid" id="simulacionesGrid">
                <?php foreach ($simulaciones_asignadas as $simulacion): ?>
                <article class="simulacion-card" data-id="<?php echo $simulacion['id']; ?>" data-estado="<?php echo $simulacion['estado']; ?>">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-fish"></i>
                        </div>
                        <div class="estado-badge estado-<?php echo $simulacion['estado']; ?>">
                            <?php 
                                $estados = [
                                    'pendiente' => '⏳ Pendiente',
                                    'en_progreso' => '🔄 En Progreso',
                                    'completada' => '✅ Completada'
                                ];
                                echo $estados[$simulacion['estado']];
                            ?>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3><?php echo htmlspecialchars($simulacion['nombre']); ?></h3>
                        <p class="descripcion"><?php echo htmlspecialchars($simulacion['descripcion']); ?></p>
                        <div class="fecha-entrega">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Fecha límite: <?php echo date('d/m/Y', strtotime($simulacion['fecha_entrega'])); ?></span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn-notificacion" data-simulacion="<?php echo $simulacion['nombre']; ?>">
                            <i class="fas fa-bell"></i> Ver Notificación
                        </button>
                        <button class="btn-simular" data-simulacion-id="<?php echo $simulacion['id']; ?>" data-simulacion-nombre="<?php echo $simulacion['nombre']; ?>">
                            <i class="fas fa-play"></i> Simular
                        </button>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Sección: Tareas Pendientes (sidebar derecha) -->
        <div class="two-columns">
            <div class="main-content">
                <!-- Aquí iría contenido adicional si es necesario -->
            </div>
            
            <aside class="tareas-sidebar">
                <div class="section-card">
                    <div class="section-header">
                        <h2><i class="fas fa-list-check"></i> Tareas Pendientes</h2>
                        <p>Lo que necesitas completar esta semana</p>
                    </div>
                    
                    <div class="tareas-lista" id="tareasLista">
                        <?php if (count($tareas_pendientes) > 0): ?>
                            <?php foreach ($tareas_pendientes as $tarea): ?>
                            <div class="tarea-item" data-id="<?php echo $tarea['id']; ?>">
                                <div class="tarea-checkbox">
                                    <input type="checkbox" id="tarea_<?php echo $tarea['id']; ?>" <?php echo $tarea['estado'] === 'completada' ? 'checked' : ''; ?>>
                                    <label for="tarea_<?php echo $tarea['id']; ?>"></label>
                                </div>
                                <div class="tarea-info">
                                    <span class="tarea-nombre"><?php echo htmlspecialchars($tarea['nombre']); ?></span>
                                    <span class="tarea-fecha">📅 <?php echo date('d/m/Y', strtotime($tarea['fecha_entrega'])); ?></span>
                                </div>
                                <button class="tarea-accion" data-simulacion-id="<?php echo $tarea['id']; ?>">
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div class="no-tareas">
                                <i class="fas fa-check-circle"></i>
                                <p>¡No hay tareas pendientes!</p>
                                <span>Todas tus simulaciones están completadas</span>
                            </div>
                        <?php endif; ?>
                    </div>
                    
                    <div class="ver-todo">
                        <a href="#" id="verTodoBtn" class="ver-todo-link">
                            Ver todo <i class="fas fa-chevron-right"></i>
                        </a>
                    </div>
                </div>
                
                <!-- Progreso general -->
                <div class="section-card progress-card">
                    <div class="section-header">
                        <h2><i class="fas fa-chart-line"></i> Progreso General</h2>
                    </div>
                    <?php 
                        $total = count($simulaciones_asignadas);
                        $completadas = count(array_filter($simulaciones_asignadas, fn($s) => $s['estado'] === 'completada'));
                        $porcentaje = $total > 0 ? round(($completadas / $total) * 100) : 0;
                    ?>
                    <div class="progress-circle" data-progress="<?php echo $porcentaje; ?>">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e7ef" stroke-width="8"/>
                            <circle class="progress-fill" cx="50" cy="50" r="45" fill="none" stroke="#1e6f9f" stroke-width="8" 
                                    stroke-dasharray="283" stroke-dashoffset="<?php echo 283 - ($porcentaje * 2.83); ?>"/>
                        </svg>
                        <div class="progress-text">
                            <span class="progress-number"><?php echo $porcentaje; ?>%</span>
                            <span class="progress-label">Completado</span>
                        </div>
                    </div>
                    <div class="progress-stats">
                        <div class="stat-detail">
                            <span class="stat-value"><?php echo $completadas; ?></span>
                            <span class="stat-desc">Completadas</span>
                        </div>
                        <div class="stat-detail">
                            <span class="stat-value"><?php echo $total - $completadas; ?></span>
                            <span class="stat-desc">Pendientes</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
        
        <!-- Sección de observaciones recientes -->
        <div class="section-card observaciones-card">
            <div class="section-header">
                <h2><i class="fas fa-comment-dots"></i> Observaciones Recientes</h2>
                <p>Tus notas y comentarios en simulaciones</p>
            </div>
            <div class="observaciones-lista" id="observacionesLista">
                <div class="observacion-item">
                    <div class="observacion-header">
                        <span class="simulacion-nombre">Tortuga Verde</span>
                        <span class="observacion-fecha">Hace 2 días</span>
                    </div>
                    <p class="observacion-texto">Excelente comportamiento en el arrecife, se observó alimentación de pastos marinos.</p>
                </div>
                <div class="observacion-item">
                    <div class="observacion-header">
                        <span class="simulacion-nombre">Pez Payaso</span>
                        <span class="observacion-fecha">Hace 5 días</span>
                    </div>
                    <p class="observacion-texto">Interacción simbiótica con anémonas registrada. Parámetros de temperatura óptimos.</p>
                </div>
            </div>
            <div class="observacion-input">
                <textarea id="nuevaObservacion" placeholder="Escribe una nueva observación..."></textarea>
                <button id="guardarObservacionBtn" class="btn-guardar">
                    <i class="fas fa-paper-plane"></i> Guardar
                </button>
            </div>
        </div>
    </main>

    <div class="spacer"></div>
    
    <!-- FOOTER -->
    <div id="footer-container"><?php include("fragments/footer.php"); ?></div>

    <!-- Scripts -->
    <script src="../JS/asignaciones.js"></script>
    <script src="../JS/session.js" defer></script>

</body>
</html>