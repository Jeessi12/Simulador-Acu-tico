<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['usuario'])) {
    header("Location: login.php?error=locked");
    exit;
}

$selectorCssVersion = filemtime(__DIR__ . '/../public/css/simuladores.css');
$selectorJsVersion = filemtime(__DIR__ . '/../public/js/simuladores.js');
$sessionJsVersion = filemtime(__DIR__ . '/../public/js/session.js');
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simuladores | BlueEcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/simuladores.css?v=<?php echo $selectorCssVersion; ?>">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body>
<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<main class="selector-shell">
    <section class="selector-hero" aria-labelledby="selectorTitle">
        <span>Simuladores disponibles</span>
        <h1 id="selectorTitle">Elige una experiencia acuática</h1>
        <p>Selecciona un escenario, revisa sus datos en la ventana flotante y entra directamente a la simulación.</p>
    </section>

    <section class="classroom-grid" aria-label="Lista de simuladores">
        <button class="classroom-card reef" type="button" data-simulation="1">
            <div class="card-banner">
                <i class="fa-solid fa-water" aria-hidden="true"></i>
                <span>Equilibrio</span>
            </div>
            <div class="card-body">
                <h2>Arrecife de Los Cóbanos</h2>
                <p>Observa especies marinas en un ecosistema saludable y estable.</p>
            </div>
        </button>

        <button class="classroom-card chain" type="button" data-simulation="2">
            <div class="card-banner">
                <i class="fa-solid fa-link" aria-hidden="true"></i>
                <span>Poblaciones</span>
            </div>
            <div class="card-body">
                <h2>Cadena alimenticia</h2>
                <p>Analiza cómo cambia el ecosistema al modificar poblaciones.</p>
            </div>
        </button>

        <button class="classroom-card impact" type="button" data-simulation="3">
            <div class="card-banner">
                <i class="fa-solid fa-flask" aria-hidden="true"></i>
                <span>Impacto</span>
            </div>
            <div class="card-body">
                <h2>Contaminación marina</h2>
                <p>Comprueba cómo la contaminación afecta oxígeno, salud y bienestar.</p>
            </div>
        </button>
    </section>
</main>

<div class="sim-info-modal" id="simInfoModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" hidden>
    <div class="modal-panel">
        <button class="modal-close" id="closeModal" type="button" aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <div class="modal-icon" id="modalIcon">
            <i class="fa-solid fa-water" aria-hidden="true"></i>
        </div>
        <span id="modalTag">Equilibrio</span>
        <h2 id="modalTitle">Arrecife de Los Cóbanos</h2>
        <p id="modalDescription">Observa especies marinas en un ecosistema saludable y estable.</p>
        <div class="modal-facts" id="modalFacts"></div>
        <button class="modal-start" id="startSelectedSimulation" type="button">
            <i class="fa-solid fa-play" aria-hidden="true"></i>
            Iniciar simulación
        </button>
    </div>
</div>

<script src="../public/js/simuladores.js?v=<?php echo $selectorJsVersion; ?>" defer></script>
<script src="../public/js/session.js?v=<?php echo $sessionJsVersion; ?>" defer></script>
</body>
</html>
