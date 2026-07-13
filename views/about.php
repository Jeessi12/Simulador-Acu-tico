<?php 
    if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../app/support/AchievementPageTracker.php';
AchievementPageTracker::track('about');
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Simulación Acuática</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link rel="stylesheet" href="../public/css/about.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body>

    <div id="navbar-container"><?php include("fragments/navbar.php"); ?></div>

    <section class="hero">
    <div class="hero-content">
        <h1>Blue EcoSim</h1>

        <p>
            Blue EcoSim es un simulador interactivo de ecosistemas marinos creado por estudiantes con fines educativos.
            Permite experimentar con diferentes parámetros del entorno para observar cómo cambian las especies y el equilibrio del ecosistema.
        </p>

        <div class="hero-buttons">
            <span>Interactivo</span>
            <span>Educativo</span>
            <span>Exploratorio</span>
        </div>
    </div>
</section>  <!-- SIMULADOR -->
       
    <div id="footer-container"><?php include("fragments/footer.php"); ?></div>

    <script src="../JS/session.js" defer></script>
<canvas id="particles"></canvas>
<script src="/Simulador-Acu-tico-main/public/js/burbujas.js" defer></script>
<?php if (!empty($_SESSION['id'])) include __DIR__ . '/fragments/achievement-notifications.php'; ?>
</body>

</html>
