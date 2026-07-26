<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../app/support/AchievementPageTracker.php';
AchievementPageTracker::track('resources');

$pageTitle = "Recursos - Los Cóbanos";
$resourcesCssVersion = filemtime(__DIR__ . '/../public/css/recursos.css');
$resourcesJsVersion = filemtime(__DIR__ . '/../public/js/recursos.js');
$bubblesJsVersion = filemtime(__DIR__ . '/../public/js/burbujas.js');
$timelineCssVersion = filemtime(__DIR__ . '/../public/build/recursos-timeline/recursos-timeline.css');
$timelineJsVersion = filemtime(__DIR__ . '/../public/build/recursos-timeline/recursos-timeline.js');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/recursos.css?v=<?php echo $resourcesCssVersion; ?>">
</head>
<body class="recursos-page">

<canvas id="particles"></canvas>

<div id="navbar-container">
    <?php include(__DIR__ . '/fragments/navbar.php'); ?>
</div>

<main id="main-content">

    <!-- SECCIÓN HERO -->
    <section class="resources-hero">
        <div class="resources-hero-image" aria-hidden="true"></div>
        <canvas id="particlesHero"></canvas>
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <span class="hero-badge">
                <i class="fa-solid fa-water"></i> Centro de investigación marina
            </span>
            <h1>Los Cóbanos</h1>
            <p class="hero-subtitle">Explora la historia, biodiversidad y conservación de uno de los arrecifes más importantes del Pacífico centroamericano.</p>
            <div class="hero-metrics" aria-label="Resumen de recursos">
                <span><strong>183+</strong> registros</span>
                <span><strong>5</strong> hitos</span>
            </div>
        </div>
        <div class="hero-scroll-indicator"><span></span></div>
    </section>

    <!-- SECCIÓN LÍNEA DE TIEMPO ORBITAL -->
    <section class="content-section timeline-reference-design" id="timeline-section">
        <div class="timeline-split-layout">
            <aside class="timeline-context" aria-labelledby="timeline-title">
                <span class="timeline-context-kicker"><i class="fa-solid fa-clock-rotate-left"></i> Memoria de conservación</span>
                <h2 id="timeline-title">Línea del<br><span>Tiempo</span></h2>
                <div class="timeline-context-line" aria-hidden="true"></div>
                <p>Descubre los acontecimientos más importantes en la historia de conservación de Los Cóbanos.</p>
                <div class="timeline-context-note">
                    <i class="fa-solid fa-compass" aria-hidden="true"></i>
                    <div>
                        <strong>Explora cada hito</strong>
                        <span>Selecciona un punto de la órbita para conocer su contexto, impacto y relación con otros momentos clave.</span>
                    </div>
                </div>
            </aside>

            <div class="timeline-interactive-column">
                <div id="recursos-orbital-timeline" aria-label="Línea del tiempo interactiva de Los Cóbanos">
                    <noscript>Activa JavaScript para explorar la línea del tiempo interactiva.</noscript>
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN CARRUSEL DE BIODIVERSIDAD -->
    <section class="content-section" id="biodiversity-section">
        <div class="section-header-center">
            <h2>Biodiversidad marina</h2>
            <div class="biodiversity-wave-divider" aria-hidden="true"><i class="fa-solid fa-water"></i></div>
            <p>Explora la riqueza de vida que habita en Los Cóbanos.</p>
        </div>

        <div id="recursos-focus-rail">
            <noscript>Activa JavaScript para explorar el carrusel de biodiversidad.</noscript>
        </div>
    </section>


    <!-- SECCIÓN BIBLIOTECA DE DOCUMENTOS -->
    <section class="content-section" id="docs">
        <div class="section-header-left docs-classic-header">
            <h2>Biblioteca de documentos</h2>
            <p>Descarga los documentos y datos utilizados dentro del sitio, seleccionados a partir de fuentes institucionales, técnicas y científicas creíbles.</p>
        </div>

        <div class="docs-grid-fluid">
            <article class="doc-card-fluid">
                <div class="doc-cover-bar blue"></div>
                <div class="doc-body-fluid">
                    <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                    <h3>Plan de Manejo del Área Natural Protegida Los Cóbanos</h3>
                    <p>Lineamientos de conservación, zonificación y uso responsable del área marina costera.</p>
                    <div class="doc-actions-fluid">
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>

            <article class="doc-card-fluid">
                <div class="doc-cover-bar teal"></div>
                <div class="doc-body-fluid">
                    <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                    <h3>Biodiversidad Marina de Los Cóbanos</h3>
                    <p>Resumen de especies registradas, hábitats principales y prioridades de monitoreo.</p>
                    <div class="doc-actions-fluid">
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>

            <article class="doc-card-fluid">
                <div class="doc-cover-bar green"></div>
                <div class="doc-body-fluid">
                    <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                    <h3>Monitoreo de Tortugas Marinas en Los Cóbanos</h3>
                    <p>Ficha educativa sobre rutas, anidación, amenazas y acciones comunitarias.</p>
                    <div class="doc-actions-fluid">
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>

            <article class="doc-card-fluid">
                <div class="doc-cover-bar coral"></div>
                <div class="doc-body-fluid">
                    <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                    <h3>Guía de Buenas Prácticas para el Turismo Marino</h3>
                    <p>Recomendaciones para visitas, buceo, navegación y observación de vida marina.</p>
                    <div class="doc-actions-fluid">
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>
        </div>
    </section>

</main>

<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<!-- SCRIPTS DE TU PROYECTO ORIGINAL -->
<script src="../public/js/burbujas.js?v=<?php echo $bubblesJsVersion; ?>" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
<script src="../public/js/recursos.js?v=<?php echo $resourcesJsVersion; ?>" defer></script>
<script src="../public/js/session.js" defer></script>
<link rel="stylesheet" href="../public/build/recursos-timeline/recursos-timeline.css?v=<?php echo $timelineCssVersion; ?>">
<script type="module" src="../public/build/recursos-timeline/recursos-timeline.js?v=<?php echo $timelineJsVersion; ?>"></script>
<?php if (!empty($_SESSION['id'])) include __DIR__ . '/fragments/achievement-notifications.php'; ?>

</body>
</html>
