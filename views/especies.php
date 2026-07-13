<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../app/support/AuthRedirect.php';
AuthRedirect::requireAuthentication();
require_once __DIR__ . '/../app/support/AchievementPageTracker.php';
AchievementPageTracker::track('species');

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Especies Marinas | BlueEcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <!-- Fuentes — Syne (títulos) + DM Sans (cuerpo) -->
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
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

<!-- Wrapper -->
<div class="page-wrapper">
<div class="app-layout">

    <!-- ===== SIDEBAR ===== -->
    <nav class="sidebar" id="appSidebar">
        <div class="sidebar-logo">
            <i class="fas fa-water"></i>
        </div>

        <button class="sidebar-item active" id="navInicio" onclick="showView('home')" data-tooltip="Catálogo">
            <i class="fas fa-th-large"></i>
            <span>Catálogo</span>
        </button>

        <div class="sidebar-divider"></div>

        <button class="sidebar-item" id="navFavoritos" onclick="showView('favorites')" data-tooltip="Favoritos">
            <i class="fas fa-heart"></i>
            <span>Favoritos</span>
        </button>
        <button class="sidebar-item" id="navNotas" onclick="showView('notes')" data-tooltip="Notas">
            <i class="fas fa-sticky-note"></i>
            <span>Notas</span>
        </button>
    </nav>

    <!-- ===== CONTENIDO ===== -->
    <div class="main-content">

        <!-- CATÁLOGO HOME -->
        <div class="view-section active" id="view-home">
            <div class="home-header">
                <div class="hero-title">
                    <h1>Especies Marinas</h1>
                    <p>Explora, aprende y conecta con la vida bajo el mar</p>
                </div>

                <div class="top-search-bar">
                    <div class="search-pill">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Buscar por nombre, nombre científico, hábitat…">
                    </div>
                </div>

                <div class="filter-tabs-row" id="filterTabs">
                    <button class="ftab active" data-category="todos">🌊 Todos</button>
                    <button class="ftab" data-category="peces">🐟 Peces</button>
                    <button class="ftab" data-category="tortugas">🐢 Tortugas</button>
                    <button class="ftab" data-category="crustaceos">🦞 Crustáceos</button>
                    <button class="ftab" data-category="moluscos">🐚 Moluscos</button>
                </div>
            </div>

            <div id="speciesGrid" class="species-grid-home"></div>

            <div id="noResults" class="no-results" style="display:none;">
                <i class="fas fa-water"></i>
                <h3>No se encontraron especies</h3>
                <p>Intenta con otro término o categoría</p>
            </div>
        </div>

        <!-- DETALLE DE ESPECIE -->
        <div class="view-section" id="view-detail">
            <div class="detail-view">
                <div class="spacer"></div>
                <button class="back-btn" onclick="showView('home')">
                    <i class="fas fa-arrow-left"></i> Volver al catálogo
                </button>

                <div class="detail-top-area">
                    <div class="detail-3d-panel" id="detail3dPanel">
                        <div id="detail3dContainer"></div>
                        <div class="detail-species-badge" id="detailBadge"></div>
                    </div>
                    <div class="detail-info-sidebar" id="detailInfoSidebar"></div>
                </div>

                <div class="detail-bottom-area" id="detailBottomArea"></div>
            </div>
        </div>

        <!-- FAVORITOS -->
        <div class="view-section" id="view-favorites">
            <div class="section-header">
                <h2><i class="fas fa-heart" style="color:#d45a7a;"></i> Mis Favoritos</h2>
            </div>
            <div class="favorites-grid-wrap">
                <div id="favoritesGrid" class="species-grid-home"></div>
                <div id="noFavorites"></div>
            </div>
        </div>

        <!-- NOTAS -->
        <div class="view-section" id="view-notes">
            <div class="notes-header">
                <h2><i class="fas fa-sticky-note" style="color:#2d9cdb;"></i> Mis Notas</h2>
                <button class="btn-add-note" id="addNoteBtn">
                    <i class="fas fa-plus"></i> Nueva nota
                </button>
            </div>
            <div id="notesContainer" class="notes-container"></div>
        </div>

    </div><!-- fin .main-content -->
</div><!-- fin .app-layout -->

<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

</div><!-- fin .page-wrapper -->

<style id="species-dark-mode-final-fix">
    body.dark-mode #view-detail .detail-info-sidebar,
    body.dark-mode #view-detail .detail-top-area > .detail-info-sidebar,
    body.dark-mode #view-detail #interactivePanelSlot,
    body.dark-mode #view-detail .interact-content,
    body.dark-mode #view-detail .interact-pane,
    body.dark-mode #view-detail .habitat-map-wrap,
    body.dark-mode #view-detail .detail-title-row,
    body.dark-mode #view-detail .detail-stats-grid,
    body.dark-mode #view-detail .detail-actions {
        background: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
    }

    body.dark-mode #view-detail .detail-interactive-panel {
        background: linear-gradient(145deg, rgba(8, 35, 58, 0.96), rgba(4, 21, 34, 0.96)) !important;
        border: 1px solid rgba(125, 249, 240, 0.28) !important;
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34) !important;
        backdrop-filter: blur(10px) saturate(1.05) !important;
    }

    body.dark-mode #view-detail .detail-header-block,
    body.dark-mode #view-detail .detail-desc-block,
    body.dark-mode #view-detail .detail-stat-card,
    body.dark-mode #view-detail .habitat-info-row,
    body.dark-mode #view-detail .curiosity-card,
    body.dark-mode #view-detail .threat-item,
    body.dark-mode #view-detail .sci-data-item,
    body.dark-mode #view-detail .back-btn,
    body.dark-mode #view-detail .floating-chip,
    body.dark-mode #view-detail .interact-tabs,
    body.dark-mode #view-detail .interact-tab,
    body.dark-mode #view-detail .btn-action.secondary {
        background: linear-gradient(145deg, #08233a 0%, #041522 100%) !important;
        border-color: rgba(125, 249, 240, 0.32) !important;
        color: #ffffff !important;
        -webkit-text-fill-color: #ffffff !important;
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34) !important;
    }

    body.dark-mode #view-detail .interact-tab.active,
    body.dark-mode #view-detail .interact-tab:hover {
        background: #0b304f !important;
        border-bottom-color: #7df9f0 !important;
    }

    body.dark-mode #view-detail .detail-header-block *,
    body.dark-mode #view-detail .detail-desc-block *,
    body.dark-mode #view-detail .detail-stat-card *,
    body.dark-mode #view-detail .habitat-info-row *,
    body.dark-mode #view-detail .curiosity-card *,
    body.dark-mode #view-detail .threat-item *,
    body.dark-mode #view-detail .sci-data-item *,
    body.dark-mode #view-detail .back-btn *,
    body.dark-mode #view-detail .floating-chip *,
    body.dark-mode #view-detail .interact-tabs *,
    body.dark-mode #view-detail .btn-action.secondary *,
    body.dark-mode #view-detail .detail-species-name,
    body.dark-mode #view-detail .detail-scientific,
    body.dark-mode #view-detail .detail-desc-block p,
    body.dark-mode #view-detail .detail-stat-label,
    body.dark-mode #view-detail .detail-stat-value,
    body.dark-mode #view-detail .detail-stat-sub,
    body.dark-mode #view-detail .habitat-info-row span,
    body.dark-mode #view-detail .habitat-info-row strong,
    body.dark-mode #view-detail .curiosity-text,
    body.dark-mode #view-detail .curiosity-text strong,
    body.dark-mode #view-detail .curiosity-text span,
    body.dark-mode #view-detail .threat-label,
    body.dark-mode #view-detail .threat-level,
    body.dark-mode #view-detail .sci-data-value,
    body.dark-mode #view-detail .sci-data-label {
        color: #ffffff !important;
        -webkit-text-fill-color: #ffffff !important;
        opacity: 1 !important;
        text-shadow: none !important;
    }

    body.dark-mode #view-detail .detail-species-name,
    body.dark-mode #view-detail .sci-data-value {
        background: none !important;
        background-clip: border-box !important;
        -webkit-background-clip: border-box !important;
    }

    body.dark-mode #view-detail .detail-header-block div[style*="background"],
    body.dark-mode #view-detail .detail-header-block div[style*="background"] *,
    body.dark-mode #view-detail .danger-badge,
    body.dark-mode #view-detail .threat-level {
        background: rgba(125, 249, 240, 0.14) !important;
        border-color: rgba(125, 249, 240, 0.24) !important;
        color: #ffffff !important;
        -webkit-text-fill-color: #ffffff !important;
    }
</style>

<script src="../public/js/burbujas.js" defer></script>
<script type="module" src="../public/js/especies.js"></script>
<script src="../public/js/session.js" defer></script>
<?php include __DIR__ . '/fragments/achievement-notifications.php'; ?>

</body>
</html>
