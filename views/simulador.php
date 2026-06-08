<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['usuario'])) {
    header("Location: login.php?error=locked");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulación Acuática</title>

    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <!-- Estilos propios -->
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/simulador.css">

    <!-- Tipografía -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

    <!-- Iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <style>
        #godot-canvas {
            position: relative;
            width: 100%;
            height: 100%;
            background: black;
        }
        
        #godot-canvas canvas {
            width: 100% !important;
            height: 100% !important;
            display: block;
        }
    </style>
</head>

<body>

<!-- Navbar -->
<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<div class="spacer"></div>

<main class="container">

    <!-- ===== SIMULADOR (izquierda) ===== -->
    <section class="simulator" aria-label="Simulador de ecosistema acuático">

        <div class="sim-header">
            <h2>Ecosistema acuático</h2>

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
        </div>

        <!-- Canvas donde Godot renderiza -->
        <div class="sim-area">
            <div id="godot-canvas" role="img" aria-label="Simulación 3D del ecosistema acuático"></div>
        </div>

        <!-- Botón salir de fullscreen (visible sólo en ese modo) -->
        <button id="closeFullscreen" class="close-fullscreen" title="Salir de pantalla completa" aria-label="Cerrar pantalla completa">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>

        <!-- Campo de observaciones -->
        <div class="observations">
            <label for="obsInput" class="sr-only">Escribe tus observaciones</label>
            <input
                type="text"
                id="obsInput"
                placeholder="Escribe tus observaciones..."
                autocomplete="off"
                maxlength="300"
            >
            <button id="sendObs" title="Enviar observación" aria-label="Enviar observación">
                <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
            </button>
        </div>

    </section>

    <!-- ===== PANEL LATERAL (derecha) ===== -->
    <aside class="panel" aria-label="Panel de control">

        <!-- Temporizador -->
        <div class="card timer-card">
            <h3>Tiempo de simulación</h3>
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
            <h3>🌊 Parámetros del agua</h3>

            <!-- Temperatura -->
            <div class="control-group">
                <label for="tempSlider">
                    🌡️ Temperatura
                    <span class="val-display"><span id="tempVal">24</span> °C</span>
                </label>
                <input
                    type="range"
                    id="tempSlider"
                    min="15" max="35" step="0.5" value="24"
                    aria-label="Temperatura del agua"
                    aria-valuemin="15" aria-valuemax="35" aria-valuenow="24"
                >
                <div class="range-hint">Óptimo: 22–28 °C</div>
            </div>

            <!-- Salinidad -->
            <div class="control-group">
                <label for="salSlider">
                    🧂 Salinidad
                    <span class="val-display"><span id="salVal">35</span> PSU</span>
                </label>
                <input
                    type="range"
                    id="salSlider"
                    min="30" max="40" step="0.5" value="35"
                    aria-label="Salinidad del agua"
                    aria-valuemin="30" aria-valuemax="40" aria-valuenow="35"
                >
                <div class="range-hint">Óptimo: 32–38 PSU</div>
            </div>

            <!-- Oxígeno -->
            <div class="control-group">
                <label for="oxSlider">
                    💨 Oxígeno
                    <span class="val-display"><span id="oxVal">6</span> mg/L</span>
                </label>
                <input
                    type="range"
                    id="oxSlider"
                    min="4" max="10" step="0.2" value="6"
                    aria-label="Nivel de oxígeno"
                    aria-valuemin="4" aria-valuemax="10" aria-valuenow="6"
                >
                <div class="range-hint">Óptimo: 5–8 mg/L</div>
            </div>
        </div>

        <!-- Acciones rápidas -->
        <div class="card options">
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

        <!-- Alertas del ecosistema (actualizadas dinámicamente por JS) -->
        <div class="card alerts" aria-live="polite" aria-label="Alertas del ecosistema">
            <p class="ok">✔ Ecosistema estable</p>
        </div>

    </aside>
</main>

<div class="spacer"></div>

<!-- Footer -->
<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<!--
    ORDEN DE CARGA CORRECTO:
    1. Engine de Godot (sin defer para que esté disponible cuando simulador.js lo necesite)
    2. simulador.js (defer: se ejecuta al terminar el HTML, con Engine ya disponible)
    3. session.js (defer: gestión de sesión, independiente)
    
    Nota: Todo el código JavaScript ha sido movido a public/js/simulador.js
-->
<script src="../public/godot/index.js"></script>
<script src="../public/js/simulador.js" defer></script>
<script src="../public/js/session.js" defer></script>

<!-- Clase utilitaria para screen readers -->
<style>
.sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
}
</style>

</body>
</html>