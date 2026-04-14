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
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../CSS/index.css">
<link rel="stylesheet" href="../CSS/navbar-footer.css">
<script src="../JS/index.js" defer></script>
</head>
<body>

<!-- NAVBAR -->
    <div id="navbar-container"><?php include("fragments/navbar.php"); ?></div>
    <div class="spacer"></div>

<section class="hero">
    <div class="hero-text">
        <h1 class="title">
        <span>Sumérgete</span>
        <span>en</span>
  <span>la</span>
  <span>experiencia</span>
  <span class="highlight">acuática</span>
  <span>en </span>
  <span>minutos</span></h1>
        <p>Explora un mundo submarino lleno de vida, modifica ecosistemas y observa cómo el ecosistema responde en tiempo real</p>
        <a href="#" class="cta">Conoce más →</a>
    </div>
    <canvas id="particles"></canvas>
</section>

 <section class="stunning-page-builder">
<div class="container">
    <!-- Encabezado -->
    <div class="section-header">
        <h2 class="section-title">
            Explora el Océano <br>
            <span class="title-gradient">Como Nunca Antes</span>
        </h2>
    </div>

    
<div class="cards-wrapper">
    <!-- Tarjeta 1 -->
    <article class="feature-card">
        <div class="card-image custom-image-1"><img src="../MEDIA/Web/Simula.png" alt="Simulación acuática"></div>
        <h3 class="card-heading">Simula Ecosistemas</h3>
        <p class="card-text">
            Utiliza un simulador acuático para crear, controlar y experimentar con ecosistemas marinos en tiempo real.
        </p>
        <a href="#" class="card-btn">
            Explorar <i class="fas fa-arrow-right"></i>
        </a>
    </article>

    <!-- Tarjeta 2 -->
    <article class="feature-card">
        <div class="card-image custom-image-2"><img src="../MEDIA/Web/Conserva.png" alt="Simulacion acuatica"></div>
        <h3 class="card-heading">Observa y Conserva</h3>
        <p class="card-text">
            Observa resultados y descubre cómo cuidar y proteger el océano mientras aprendes sobre su conservación.
        </p>
        <a href="#" class="card-btn">
            Descubrir <i class="fas fa-arrow-right"></i>
        </a>
    </article>
</div>

</section>

<section class="eco-section">
     <canvas id="particlesSpecies"></canvas>
    <div class="eco-overlay">
        <div class="eco-content">
            <h2>Educación con Simuladores Acuáticos</h2>
            <p>
               En El Salvador, los simuladores acuáticos permiten a los estudiantes explorar ecosistemas marinos y 
               fomentar la conciencia sobre la biodiversidad y su conservación.
            </p>
        </div>
    </div>
</section>

<div id="footer-container"><?php include("fragments/footer.php"); ?></div>

<script src="../JS/session.js" defer></script>
</body>
<<<<<<< HEAD
</html>
=======
</html>
>>>>>>> 76531618231e6e7177efcbb34f9d86dc17c42b75
