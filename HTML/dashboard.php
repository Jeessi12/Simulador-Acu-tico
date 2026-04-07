<?php 
    include("../PHP/conexion.php");

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
    <title>BlueEcoSim</title>
    <link rel="icon" href="../MEDIA/Web/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../CSS/dashboard.css">
    <link rel="stylesheet" href="../CSS/navbar-footer.css">
</head>
<body>
    <div id="navbar-container"><?php include("fragments/navbar.php"); ?></div>
    <div class='welcome'>
        <h1>
            Bienvenido, Estudiante
        </h1>
    </div>
    <div class="card-grid">
        <article class="tittle-card">
            <h2 class="title">Simulaciones Asignadas</h2>
        </article>
        <div class="cards-wrapper">
            <article class="feature-card">
                <div class='image-wrapper'>
                    <div class="card-image"><img src="../MEDIA/Web/fish.svg" alt="Simulación acuática"></div>
                    <h3 class="card-heading">Tortuga Verde</h3>
                </div>
                <div class="button-wrapper">
                    <a href="notificaciones.php" class="card-btn">
                        Ver Notificación <i class="fas fa-arrow-right"></i>
                    </a>
                    <a href="simulador.php" class="card-btn">
                        Simular <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
                
            </article>
            <article class="feature-card">
                <div class='image-wrapper'>
                    <div class="card-image"><img src="../MEDIA/Web/fish.svg" alt="Simulación acuática"></div>
                    <h3 class="card-heading">Pez Payaso</h3>
                </div>
                <div class="button-wrapper">
                    <a href="notificaciones.php" class="card-btn">
                        Ver Notificación <i class="fas fa-arrow-right"></i>
                    </a>
                    <a href="simulador.php" class="card-btn">
                        Simular <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
            <article class="feature-card">
                <div class='image-wrapper'>
                    <div class="card-image"><img src="../MEDIA/Web/fish.svg" alt="Simulación acuática"></div>
                    <h3 class="card-heading">Orcas</h3>
                </div>
                <div class="button-wrapper">
                    <a href="notificaciones.php" class="card-btn">
                        Ver Notificación <i class="fas fa-arrow-right"></i>
                    </a>
                    <a href="simulador.php" class="card-btn">
                        Simular <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        </div>
    </div>
    <div id="footer-container"><?php include("fragments/footer.php"); ?></div>
</body>