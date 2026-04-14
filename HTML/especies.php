<?php 
    include("../PHP/conexion.php");

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Verificar sesión
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
    <title>Especies Marinas | BlueEcoSim</title>
    <link rel="icon" href="../MEDIA/Web/logo.png" type="image/png">
    
    <!-- Fuentes -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    <!-- IMPORTMAP para Three.js (OBLIGATORIO) -->
    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.128.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.128.0/examples/jsm/"
            }
        }
    </script>
    
    <!-- Estilos -->
    <link rel="stylesheet" href="../CSS/navbar-footer.css">
    <link rel="stylesheet" href="../CSS/especies.css">
</head>
<body>

    <!-- NAVBAR -->
    <div id="navbar-container"><?php include("fragments/navbar.php"); ?></div>
    <div class="spacer"></div>

    <!-- Canvas de burbujas decorativas -->
    <canvas id="bubblesCanvas"></canvas>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="species-container">
        <div class="hero-species">
            <h1><i class="fas fa-fish"></i> Especies Marinas</h1>
            <p>Descubre la biodiversidad oceánica en 3D</p>
        </div>

        <div class="filter-bar">
            <div class="search-wrapper">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Buscar especie marina...">
            </div>
            <div class="filter-tabs" id="filterTabs">
                <button class="filter-btn active" data-category="todos">Todos</button>
                <button class="filter-btn" data-category="peces">Peces</button>
                <button class="filter-btn" data-category="tortugas">Tortugas</button>
                <button class="filter-btn" data-category="crustaceos">Crustáceos</button>
                <button class="filter-btn" data-category="moluscos">Moluscos</button>
            </div>
        </div>

        <div id="speciesGrid" class="species-grid">
            <!-- Las tarjetas se generan dinámicamente con JS -->
        </div>

        <div id="noResults" class="no-results" style="display: none;">
            <i class="fas fa-water"></i>
            <h3>No se encontraron especies</h3>
            <p>Intenta con otro término o categoría</p>
        </div>
    </main>

    <div class="spacer"></div>

    <!-- FOOTER -->
    <div id="footer-container"><?php include("fragments/footer.php"); ?></div>

    <!-- Scripts - IMPORTANTE: type="module" -->
    <script type="module" src="../JS/especies.js"></script>
    <script src="../JS/session.js" defer></script>
</body>
</html>