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
    <title>Especies Marinas | BlueEcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <!-- Fuentes -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <!-- ImportMap Three.js -->
    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.128.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.128.0/examples/jsm/"
            }
        }
    </script>

    <!-- Estilos -->
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/especies.css">
</head>
<body>

<!-- Navbar -->
<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<!-- Burbujas de fondo -->
<canvas id="particles"></canvas>

<!-- Wrapper: agrupa layout + footer para flujo correcto -->
<div class="page-wrapper">
<!-- Layout principal: sidebar + contenido -->
<div class="app-layout">

    <!-- ===== SIDEBAR ===== -->
    <nav class="sidebar" id="appSidebar">
        <div class="sidebar-logo">
            <i class="fas fa-water" style="font-size:1.8rem; color:#2d9cdb;"></i>
            <span>BlueEcoSim</span>
        </div>

        <div class="sidebar-section">Explorar</div>
        <button class="sidebar-item active" id="navInicio" onclick="showView('home')">
            <i class="fas fa-th-large"></i>
            <span>Catálogo</span>
        </button>

        <div class="sidebar-divider"></div>
        <div class="sidebar-section">Mi espacio</div>

        <button class="sidebar-item" id="navFavoritos" onclick="showView('favorites')">
            <i class="fas fa-heart"></i>
            <span>Favoritos</span>
        </button>
        <button class="sidebar-item" id="navNotas" onclick="showView('notes')">
            <i class="fas fa-sticky-note"></i>
            <span>Notas</span>
        </button>
    </nav>

    <!-- ===== CONTENIDO PRINCIPAL ===== -->
    <div class="main-content">

        <!-- VISTA: CATÁLOGO HOME -->
        <div class="view-section active" id="view-home">
            <div class="home-header">
                <div class="hero-title">
                    <h1><i class="fas fa-fish"></i> Especies Marinas</h1>
                    <p>Descubre la biodiversidad oceánica de BlueEcoSim</p>
                </div>

                <!-- Búsqueda -->
                <div class="top-search-bar">
                    <div class="search-pill">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Buscar por nombre, nombre científico, hábitat...">
                    </div>
                </div>

                <!-- Filtros de categoría -->
                <div class="filter-tabs-row" id="filterTabs">
                    <button class="ftab active" data-category="todos">🌊 Todos</button>
                    <button class="ftab" data-category="peces">🐟 Peces</button>
                    <button class="ftab" data-category="tortugas">🐢 Tortugas</button>
                    <button class="ftab" data-category="crustaceos">🦞 Crustáceos</button>
                    <button class="ftab" data-category="moluscos">🐚 Moluscos</button>
                </div>
            </div>

            <!-- Grid de tarjetas -->
            <div id="speciesGrid" class="species-grid-home"></div>

            <!-- Sin resultados -->
            <div id="noResults" class="no-results" style="display:none;">
                <i class="fas fa-water"></i>
                <h3>No se encontraron especies</h3>
                <p>Intenta con otro término o categoría</p>
            </div>
        </div>

        <!-- VISTA: DETALLE DE ESPECIE -->
        <div class="view-section" id="view-detail">
            <div class="detail-view">
                <button class="back-btn" onclick="showView('home')">
                    <i class="fas fa-arrow-left"></i> Volver al catálogo
                </button>

                <!-- Zona superior: 3D + info -->
                <div class="detail-top-area">
                    <div class="detail-3d-panel" id="detail3dPanel">
                        <div id="detail3dContainer"></div>
                        <div class="detail-species-badge" id="detailBadge"></div>
                    </div>
                    <div class="detail-info-sidebar" id="detailInfoSidebar"></div>
                </div>

                <!-- Zona inferior: datos extra -->
                <div class="detail-bottom-area" id="detailBottomArea"></div>
            </div>
        </div>

        <!-- VISTA: FAVORITOS -->
        <div class="view-section" id="view-favorites">
            <div class="section-header">
                <h2><i class="fas fa-heart" style="color:#d45a7a;"></i> Mis Favoritos</h2>
                <p>Especies que has guardado durante esta sesión</p>
            </div>
            <div class="favorites-grid-wrap">
                <div id="favoritesGrid" class="species-grid-home"></div>
                <div id="noFavorites" class="no-results no-results-centered" style="display:none;">
                    <i class="fas fa-heart-broken"></i>
                    <h3>Aún no tienes favoritos</h3>
                    <p>Explora las especies y pulsa el corazón para guardarlas</p>
                </div>
            </div>
        </div>

        <!-- VISTA: NOTAS -->
        <div class="view-section" id="view-notes">
            <div class="notes-header">
                <h2><i class="fas fa-sticky-note" style="color:#2d9cdb;"></i> Mis Notas</h2>
                <button class="btn-add-note" id="addNoteBtn">
                    <i class="fas fa-plus"></i> Nueva nota
                </button>
            </div>
            <div class="notes-grid" id="notesContainer"></div>
        </div>

    </div><!-- fin .main-content -->
</div><!-- fin .app-layout -->

<!-- Footer dentro del page-wrapper -->
<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

</div><!-- fin .page-wrapper -->

<script src="../public/js/burbujas.js" defer></script>
<script type="module" src="../public/js/especies.js"></script>
<script src="../public/js/session.js" defer></script>

</body>
</html>