<?php 
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BlueEcoSim</title>
<link rel="icon" href="../MEDIA/Web/logo.png" type="image/png">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="../CSS/index.css">
<link rel="stylesheet" href="../CSS/navbar-footer.css">

<script src="../JS/burbujas.js" defer></script>
</head>

<body>

<div id="navbar-container"><?php include("fragments/navbar.php"); ?></div>


<section class="hero">
    <div class="hero-text">
        <h1 class="title">
            <span>Sumérgete</span>
            <span>en</span>
            <span>la</span>
            <span>experiencia</span>
            <span class="highlight">acuática</span>
            <span>en</span>
            <span>minutos</span>
        </h1>

        <p>
            Explora un mundo submarino lleno de vida, modifica ecosistemas 
            y observa cómo el ecosistema responde en tiempo real
        </p>

        <a href="#eco" class="cta">Conoce más →</a>
    </div>

    <canvas id="particles"></canvas>
</section>


<section class="eco-section" id="eco">
    <canvas id="particlesSpecies"></canvas>

    <div class="eco-overlay">
        <div class="eco-content">

            <div class="eco-badge">
                <span class="badge-icon">🌊</span> Simulación Educativa
            </div>

            <h2>
                Educación con 
                <span class="eco-highlight">Simuladores Acuáticos</span>
            </h2>

            <p>
                En El Salvador, los simuladores acuáticos permiten a los estudiantes 
                explorar ecosistemas marinos y fomentar la conciencia sobre la 
                biodiversidad y su conservación.
            </p>

            <div class="eco-stats">
                <div class="stat">
                    <span class="stat-number">+5,000</span>
                    <span class="stat-label">Estudiantes</span>
                </div>

                <div class="stat">
                    <span class="stat-number">+150</span>
                    <span class="stat-label">Especies</span>
                </div>

                <div class="stat">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">Interactivo</span>
                </div>
            </div>

            <a href="login.php" class="eco-btn">Únete a nosotros →</a>

        </div>
    </div>
</section>

<div id="footer-container"><?php include("fragments/footer.php"); ?></div>

<script src="../JS/session.js" defer></script>
</body>
</html>