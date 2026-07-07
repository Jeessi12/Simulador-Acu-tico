<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['usuario'])) {
    header("Location: login.php?error=locked");
    exit;
}

$assignmentId = 0;
$initialObservations = [];
if (isset($_GET['asignacion']) && is_numeric($_GET['asignacion']) && isset($_SESSION['id'])) {
    include __DIR__ . '/../app/models/Conexion.php';
    include __DIR__ . '/../app/models/ObservacionesSchema.php';
    $conn = (new Conexion())->getConnection();
    ensureObservacionesSimulacionTable($conn);
    $requestedAssignment = intval($_GET['asignacion']);
    $studentId = intval($_SESSION['id']);
    $stmtAssignment = mysqli_prepare($conn, "SELECT id FROM asignaciones WHERE id = ? AND id_estudiante = ? LIMIT 1");
    mysqli_stmt_bind_param($stmtAssignment, "ii", $requestedAssignment, $studentId);
    mysqli_stmt_execute($stmtAssignment);
    $assignmentResult = mysqli_stmt_get_result($stmtAssignment);
    if ($assignmentResult && mysqli_num_rows($assignmentResult) > 0) {
        $assignmentId = $requestedAssignment;
        $stmtObservations = mysqli_prepare($conn,
            "SELECT observacion, DATE_FORMAT(fecha, '%d/%m/%Y %H:%i') AS fecha
             FROM observaciones_simulacion
             WHERE id_asignacion = ? AND id_estudiante = ?
             ORDER BY fecha DESC"
        );
        mysqli_stmt_bind_param($stmtObservations, "ii", $assignmentId, $studentId);
        mysqli_stmt_execute($stmtObservations);
        $observationsResult = mysqli_stmt_get_result($stmtObservations);
        if ($observationsResult) {
            while ($obs = mysqli_fetch_assoc($observationsResult)) {
                $initialObservations[] = [
                    'usuario' => $_SESSION['usuario'] ?? 'Estudiante',
                    'fecha' => $obs['fecha'],
                    'observacion' => $obs['observacion']
                ];
            }
        }
        mysqli_stmt_close($stmtObservations);
    }
    mysqli_stmt_close($stmtAssignment);
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulación Acuática | BlueEcoSim</title>

    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <?php
        $simCssVersion = filemtime(__DIR__ . '/../public/css/simulador.css');
        $simJsVersion = filemtime(__DIR__ . '/../public/js/simulador.js');
        $bubbleJsVersion = filemtime(__DIR__ . '/../public/js/burbujas.js');
        $sessionJsVersion = filemtime(__DIR__ . '/../public/js/session.js');
    ?>

    <!-- Estilos propios -->
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/simulador.css?v=<?php echo $simCssVersion; ?>">

    <!-- Tipografía -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <!--
        Godot exporta sus archivos a /public/godot/:
          index.js   → el Engine (carga .wasm y .pck)
          index.wasm → binario compilado
          index.pck  → paquete del juego / escenas
          index.audio.worklet.js, index.audio.position.worklet.js → audio worklets

        index.js se carga en el <head> SIN defer para que la clase Engine
        esté disponible globalmente cuando simulador.js la invoque.
        No usar async ni defer aquí.
    -->
    <script src="../public/godot/index.js"></script>
    <?php
        $appBase = dirname(dirname($_SERVER['SCRIPT_NAME']));
        if ($appBase === '/' || $appBase === '\\') {
            $appBase = '';
        }
    ?>
    <script>
        window.APP_BASE = '<?php echo $appBase; ?>';
        window.ASSIGNMENT_ID = <?php echo intval($assignmentId); ?>;
        window.CURRENT_USER_NAME = <?php echo json_encode($_SESSION['usuario'] ?? 'Estudiante', JSON_UNESCAPED_UNICODE); ?>;
        window.INITIAL_OBSERVATIONS = <?php echo json_encode($initialObservations, JSON_UNESCAPED_UNICODE); ?>;
    </script>
</head>

<body>

<!-- Navbar -->
<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<div class="spacer"></div>

<main class="container">

    <!-- ===== SIMULADOR (izquierda) ===== -->
    <section class="simulator">
        <canvas id="particles"></canvas>

        <!-- Header -->
        <div class="sim-header">
            <h2 id="simTitle">Ecosistema acuático</h2>

            <div class="status" aria-live="polite">
                <span>
                    <span class="dot active" aria-hidden="true"></span>
                    Activo
                </span>
                <span>
                    <span class="dot clean" aria-hidden="true"></span>
                    Sin contaminación
                </span>
            </div>

            <button id="expandBtn" class="expand" title="Pantalla completa" aria-label="Expandir a pantalla completa">
                <i class="fa-solid fa-expand" aria-hidden="true"></i>
            </button>
            <button id="returnToSelector" class="return-selector" type="button" title="Volver al selector" aria-label="Volver al selector de simuladores">
                <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                <span>Volver</span>
            </button>
        </div>

        <!--
            Zona de renderizado de Godot.
            #godot-canvas es un <div> contenedor — simulador.js crea el <canvas>
            real dentro de él dinámicamente, lo que permite que Godot tenga
            control total del elemento y lo redimensione con canvasResizePolicy: 2.
        -->
        <div class="sim-area">
            <div class="sim-preview-panel" aria-live="polite">
                <span class="preview-kicker">Vista actual</span>
                <strong id="currentSimName">Ecosistema Basico</strong>
                <span id="currentSpeciesName">Pez Lora Gigante</span>
                <p id="currentSimDescription">Arrecife de Los Cobanos en equilibrio, con ciclo de vida y aparicion de tortugas.</p>
            </div>
            <div id="godot-canvas" role="img" aria-label="Simulación 3D del ecosistema acuático"></div>
        </div>

        <!-- Botón salir fullscreen (visible solo en modo fullscreen vía CSS) -->
        <button id="closeFullscreen" class="close-fullscreen" title="Salir de pantalla completa" aria-label="Cerrar pantalla completa">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>

        <!-- Observaciones -->
        <div class="observations">
            <label for="obsInput" class="sr-only">Escribe tus observaciones</label>
            <input
                type="text"
                id="obsInput"
                placeholder="Escribe tus observaciones del ecosistema…"
                autocomplete="off"
                maxlength="300"
            >
            <button id="sendObs" title="Enviar observación" aria-label="Enviar observación">
                <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
            </button>
        </div>
        <div class="observation-thread" id="observationThread" aria-live="polite"></div>

    </section>

    <!-- ===== PANEL LATERAL (derecha) ===== -->
    <aside class="panel" aria-label="Panel de control">

        <!-- Selector de especies -->
        <div class="card species-switcher">
            <h3><i class="fa-solid fa-fish" style="margin-right:6px;opacity:.6;"></i>Especie de prueba</h3>

            <div class="species-options" aria-label="Especies disponibles">
                <button class="species-chip active" type="button" data-species="pez_lora_gigante">Pez Lora</button>
                <button class="species-chip" type="button" data-species="pez_angel_real">Pez Angel</button>
                <button class="species-chip" type="button" data-species="tortuga_carey">Tortuga Carey</button>
            </div>
        </div>

        <!-- Temporizador -->
        <div class="card timer-card">
            <h3><i class="fa-regular fa-clock" style="margin-right:6px;opacity:.6;"></i>Tiempo de simulación</h3>
            <div id="timer" role="timer" aria-live="off" aria-label="Tiempo transcurrido">00:00:00</div>
            <div class="controls">
                <button id="start" class="circle green" title="Iniciar" aria-label="Iniciar temporizador">
                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                </button>
                <button id="pause" class="circle blue" title="Pausar" aria-label="Pausar temporizador">
                    <i class="fa-solid fa-pause" aria-hidden="true"></i>
                </button>
                <button id="reset" class="circle red" title="Reiniciar" aria-label="Reiniciar temporizador">
                    <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
                </button>
            </div>
        </div>

        <!-- Parámetros ambientales -->
        <div class="card environmental-controls">
            <h3><i class="fa-solid fa-droplet" style="margin-right:6px;opacity:.6;"></i>Parámetros del agua</h3>

            <div class="control-group">
                <label for="tempSlider">
                    🌡️ Temperatura
                    <span class="val-display"><span id="tempVal">24</span> °C</span>
                </label>
                <input type="range" id="tempSlider"
                    min="15" max="35" step="0.5" value="24"
                    aria-label="Temperatura del agua"
                    aria-valuemin="15" aria-valuemax="35" aria-valuenow="24">
                <div class="range-hint">Óptimo: 22 – 28 °C</div>
            </div>

            <div class="control-group">
                <label for="salSlider">
                    🧂 Salinidad
                    <span class="val-display"><span id="salVal">35</span> PSU</span>
                </label>
                <input type="range" id="salSlider"
                    min="30" max="40" step="0.5" value="35"
                    aria-label="Salinidad del agua"
                    aria-valuemin="30" aria-valuemax="40" aria-valuenow="35">
                <div class="range-hint">Óptimo: 32 – 38 PSU</div>
            </div>

            <div class="control-group">
                <label for="oxSlider">
                    💨 Oxígeno disuelto
                    <span class="val-display"><span id="oxVal">6</span> mg/L</span>
                </label>
                <input type="range" id="oxSlider"
                    min="4" max="10" step="0.2" value="6"
                    aria-label="Nivel de oxígeno"
                    aria-valuemin="4" aria-valuemax="10" aria-valuenow="6">
                <div class="range-hint">Óptimo: 5 – 8 mg/L</div>
            </div>

            <div class="control-group">
                <label for="healthSlider">
                    Salud del ecosistema
                    <span class="val-display"><span id="healthVal">95</span>%</span>
                </label>
                <input type="range" id="healthSlider"
                    min="0" max="100" step="1" value="95"
                    aria-label="Salud del ecosistema"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="95">
                <div class="range-hint">Sobre 90% por 20 segundos atrae Tortugas Carey</div>
            </div>
        </div>

        <!-- Acciones rápidas -->
        <div class="card" id="pollutionControl" hidden>
            <h3><i class="fa-solid fa-flask" style="margin-right:6px;opacity:.6;"></i>Contaminacion</h3>
            <div class="control-group">
                <label for="pollutionSlider">
                    Nivel de contaminacion
                    <span class="val-display"><span id="pollutionVal">0</span>%</span>
                </label>
                <input type="range" id="pollutionSlider"
                    min="0" max="100" step="1" value="0"
                    aria-label="Nivel de contaminacion"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                <div class="range-hint">Simula hipoxia, escorrentia y agua turbia</div>
            </div>
        </div>

        <div class="card" id="populationControls" hidden>
            <h3><i class="fa-solid fa-users-line" style="margin-right:6px;opacity:.6;"></i>Poblaciones</h3>
            <div id="populationControlList"></div>
        </div>

        <div class="card options">
            <h3><i class="fa-solid fa-bolt" style="margin-right:6px;opacity:.6;"></i>Acciones</h3>

            <div class="option" role="button" tabindex="0" aria-label="Gestionar especies">
                <div class="left">
                    <i class="fa-solid fa-fish" aria-hidden="true"></i>
                    <span>Gestionar especies</span>
                </div>
                <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
            </div>

            <div class="option" role="button" tabindex="0" aria-label="Ver parámetros avanzados">
                <div class="left">
                    <i class="fa-solid fa-gear" aria-hidden="true"></i>
                    <span>Parámetros avanzados</span>
                </div>
                <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
            </div>
        </div>

        <!-- Alertas — actualizadas dinámicamente por JS al mover sliders -->
        <div class="card alerts" aria-live="polite" aria-label="Alertas del ecosistema">
            <h3><i class="fa-solid fa-wave-square" style="margin-right:6px;opacity:.6;"></i>Estado del ecosistema</h3>
            <p class="ok">✔ Todos los parámetros en rango óptimo</p>
        </div>

        <!-- Estado biológico — actualizado por Godot vía onGodotStats -->
        <div class="card" id="bio-stats" aria-label="Estado biológico de la especie">
            <h3>
                <i class="fa-solid fa-heart-pulse" style="margin-right:6px;opacity:.6;"></i>
                Estado biológico
            </h3>

            <div class="stat-row">
                <span class="stat-label">❤️ Salud</span>
                <span class="stat-value" id="health-val">—</span>
            </div>

            <div class="stat-row">
                <span class="stat-label">⚡ Estrés</span>
                <span class="stat-value" id="stress-val">—</span>
            </div>

            <div class="stat-row">
                <span class="stat-label">🌟 Bienestar</span>
                <span class="stat-value" id="wellbeing-val">—</span>
            </div>

            <div class="stat-row">
                <span class="stat-label">🔬 Etapa</span>
                <span class="stat-value" id="stage-val">—</span>
            </div>

            <div class="stat-row">
                <span class="stat-label">Edad</span>
                <span class="stat-value" id="age-val">-</span>
            </div>

            <div class="stat-row">
                <span class="stat-label">Desarrollo</span>
                <span class="stat-value" id="growth-val">-</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🐠 Población</span>
                <span class="stat-value" id="population-val">—</span>
            </div>
        </div>  
    </aside>
</main>

<div class="spacer"></div>

<!-- Footer -->
<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<!--
    ORDEN DE CARGA:
    1. index.js (Godot Engine) → ya está en el <head> sin defer
    2. simulador.js (defer) → se ejecuta tras parsear el HTML completo,
       con Engine ya disponible y el DOM listo
    3. burbujas.js (defer) → independiente, no interfiere con Godot
    4. session.js (defer) → gestión de sesión, independiente
-->
<script src="../public/js/simulador.js?v=<?php echo $simJsVersion; ?>" defer></script>
<script src="../public/js/burbujas.js?v=<?php echo $bubbleJsVersion; ?>"  defer></script>
<script src="../public/js/session.js?v=<?php echo $sessionJsVersion; ?>"   defer></script>

</body>
</html>
