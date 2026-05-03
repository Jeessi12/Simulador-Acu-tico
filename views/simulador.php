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
    <title>Simulación Acuática</title>

    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <link rel="stylesheet" href="../public/css/simulador.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body>

<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<div class="spacer"></div>

<main class="container">
    <section class="simulator">

        <div class="sim-header">
            <h2>Ecosistema acuático</h2>

            <div class="status">
                <span><span class="dot active"></span> Activo</span>
                <span><span class="dot clean"></span> Sin contaminación</span>
            </div>

            <button id="expandBtn" class="expand">
                <i class="fa-solid fa-expand"></i>
            </button>
        </div>

        <div class="sim-area" id="simArea"></div>

        <button id="closeFullscreen" class="close-fullscreen">
            <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="observations">
            <input type="text" placeholder="Escribe tus observaciones..." id="obsInput">

            <button id="sendObs">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>

    </section>

    <aside class="panel">

        <div class="card timer-card">
            <h3>Tiempo de simulación</h3>
            <div id="timer">00:00:00</div>

            <div class="controls">
                <button id="start" class="circle green">
                    <i class="fa-solid fa-play"></i>
                </button>

                <button id="pause" class="circle blue">
                    <i class="fa-solid fa-pause"></i>
                </button>

                <button id="reset" class="circle red">
                    <i class="fa-solid fa-rotate-right"></i>
                </button>
            </div>
        </div>

        <div class="card options">
            <div class="option">
                <div class="left">
                    <i class="fa-solid fa-fish"></i>
                    <span>Gestionar especies</span>
                </div>
                <i class="fa-solid fa-chevron-right"></i>
            </div>

            <div class="option">
                <div class="left">
                    <i class="fa-solid fa-gear"></i>
                    <span>Parámetros</span>
                </div>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>

        <div class="card alerts">
            <p class="warning">⚠ Temperatura alta</p>
            <p class="warning">⚠ Bajo oxígeno</p>
            <p class="ok">✔ Ecosistema estable</p>
        </div>

    </aside>
</main>

<div class="spacer"></div>

<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<script src="../public/js/simulador.js"></script>
<script src="../public/js/session.js" defer></script>

</body>
</html>