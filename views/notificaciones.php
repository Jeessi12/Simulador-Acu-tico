<?php
session_start();
include __DIR__ . '/../app/models/conexion.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!defined('ROL_ESTUDIANTE')) {
    define('ROL_ESTUDIANTE', 1);
    define('ROL_DOCENTE', 2);
    define('ROL_PERSONAL', 3);
    define('ROL_ADMIN', 4);
}

if (!isset($_SESSION['usuario']) || $_SESSION['rol'] != ROL_ESTUDIANTE) {
    header("Location: login.php?error=locked");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=dev    ice-width, initial-scale=1.0">
    <title>Notificaciones · Blue EcoSim</title>
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/notificaciones.css">
</head>
<body>
    <!-- Canvas de burbujas estilo index, más pequeñas y sin explotar -->
    <canvas id="particles"></canvas>

    <?php include 'fragments/navbar.php'; ?>

    <div class="spacer"></div>
    <div class="container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <i class="fas fa-bell"></i>
                <h2>Notificaciones</h2>
            </div>
            <ul>
                <li class="active"><a href="#" data-filtro="recibidos"><i class="fas fa-inbox"></i> Recibidos</a></li>
                <li><a href="#" data-filtro="destacados"><i class="fas fa-star"></i> Destacados</a></li>
                <li><a href="#" data-filtro="no_leidos"><i class="fas fa-envelope"></i> Sin leer</a></li>
                <li><a href="#" data-filtro="papelera"><i class="fas fa-trash"></i> Papelera</a></li>
                <li><a href="#" data-filtro="archivados"><i class="fas fa-archive"></i> Archivados</a></li>
            </ul>
        </aside>

        <main class="main" id="main-content">
            <!-- El JS carga aquí la cabecera, la lista y la paginación -->
        </main>
    </div>

    <?php include 'fragments/footer.php'; ?>

    <!-- Burbujas pequeñas, sin explotar, iguales a las del index -->
    <script src="../JS/burbujas_fondo.js"></script>
    <!-- Lógica AJAX para filtros, búsqueda y acciones -->
    <script src="../JS/notificaciones.js"></script>
</body>
</html>