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
                    <h3>Plan de Manejo del Área Natural Protegida y Sitio Ramsar Complejo Los Cóbanos, Sonsonate 2021-2025</h3>
                    <p><strong>MARN · 2021 · 125 páginas.</strong> Plan oficial de zonificación, conservación, uso sostenible, pesca, turismo y manejo de los ecosistemas del Complejo Los Cóbanos.</p>
                    <div class="doc-actions-fluid">
                        <a href="https://cidoc.ambiente.gob.sv/documento/plan-de-manejo-del-area-natural-protegida-y-sitio-ramsar-complejo-los-cobanos-sonsonate-2021-2025/" target="_blank" rel="noopener noreferrer" class="doc-btn-action view" aria-label="Ver ficha oficial del plan de manejo"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="https://cidoc.ambiente.gob.sv/download/plan-de-manejo-del-area-natural-protegida-y-sitio-ramsar-complejo-los-cobanos-sonsonate-2021-2025/?wpdmdl=12247" target="_blank" rel="noopener noreferrer" class="doc-btn-action download" aria-label="Descargar plan de manejo desde MARN"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>

            <article class="doc-card-fluid">
                <div class="doc-cover-bar teal"></div>
                <div class="doc-body-fluid">
                    <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                    <h3>FIR para el Sitio núm. 2419, Complejo Los Cóbanos, El Salvador</h3>
                    <p><strong>MARN · 23 páginas.</strong> Ficha oficial Ramsar con ubicación, humedales, biodiversidad, servicios ecosistémicos, amenazas, monitoreo y medidas de conservación del sitio.</p>
                    <div class="doc-actions-fluid">
                        <a href="https://simacc.ambiente.gob.sv/storage/ecosistema_documentos/26/P4d00Vg0zxUo6B7DOZtbVqzhKsyerah5tY4Cw5bQ.pdf" target="_blank" rel="noopener noreferrer" class="doc-btn-action view" aria-label="Ver ficha Ramsar de Los Cóbanos"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="https://simacc.ambiente.gob.sv/storage/ecosistema_documentos/26/P4d00Vg0zxUo6B7DOZtbVqzhKsyerah5tY4Cw5bQ.pdf" download target="_blank" rel="noopener noreferrer" class="doc-btn-action download" aria-label="Descargar ficha Ramsar de Los Cóbanos"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>

            <article class="doc-card-fluid">
                <div class="doc-cover-bar green"></div>
                <div class="doc-body-fluid">
                    <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                    <h3>Acuerdo 257: Listado Oficial de Especies de Vida Silvestre Amenazadas y en Peligro de Extinción</h3>
                    <p><strong>MARN · 2023 · 24 páginas.</strong> Referencia normativa nacional para comprobar qué especies poseen categoría de amenaza o peligro de extinción en El Salvador.</p>
                    <div class="doc-actions-fluid">
                        <a href="https://cidoc.ambiente.gob.sv/documento/acuerdo-257-listado-oficial-de-especies-de-vida-silvestre-amenazadas-y-en-peligro-de-extincion/" target="_blank" rel="noopener noreferrer" class="doc-btn-action view" aria-label="Ver ficha oficial del Acuerdo 257"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="https://cidoc.ambiente.gob.sv/download/acuerdo-257-listado-oficial-de-especies-de-vida-silvestre-amenazadas-y-en-peligro-de-extincion/?wpdmdl=12085" target="_blank" rel="noopener noreferrer" class="doc-btn-action download" aria-label="Descargar Acuerdo 257 desde MARN"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>

            <article class="doc-card-fluid">
                <div class="doc-cover-bar coral"></div>
                <div class="doc-body-fluid">
                    <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                    <h3>Programa Nacional de Conservación de Tortugas Marinas</h3>
                    <p><strong>MARN · 2024 · 39 páginas.</strong> Programa nacional sobre educación ambiental, conservación de ecosistemas, investigación, monitoreo, manejo y gobernanza de tortugas marinas.</p>
                    <div class="doc-actions-fluid">
                        <a href="https://cidoc.ambiente.gob.sv/documento/programa-nacional-de-conservacion-de-tortugas-marinas/" target="_blank" rel="noopener noreferrer" class="doc-btn-action view" aria-label="Ver ficha oficial del programa de tortugas marinas"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="https://cidoc.ambiente.gob.sv/download/programa-nacional-de-conservacion-de-tortugas-marinas/?wpdmdl=12851" target="_blank" rel="noopener noreferrer" class="doc-btn-action download" aria-label="Descargar programa de tortugas marinas desde MARN"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>

            <article class="doc-card-fluid">
                <div class="doc-cover-bar blue"></div>
                <div class="doc-body-fluid">
                    <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                    <h3>Cetáceos: diversidad, importancia y buenas prácticas para su conservación</h3>
                    <p><strong>MARN, USAID, GOAL y Humane Society International · 2020 · 45 páginas.</strong> Módulo educativo sobre ballenas y delfines, amenazas, conservación y los cetáceos del Área Natural Protegida Complejo Los Cóbanos.</p>
                    <div class="doc-actions-fluid">
                        <a href="https://cidoc.ambiente.gob.sv/documento/cetaceos-diversidad-importancia-y-buenas-practicas-para-su-conservacion/" target="_blank" rel="noopener noreferrer" class="doc-btn-action view" aria-label="Ver ficha oficial del módulo sobre cetáceos"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="https://cidoc.ambiente.gob.sv/download/cetaceos-diversidad-importancia-y-buenas-practicas-para-su-conservacion/?wpdmdl=12411" target="_blank" rel="noopener noreferrer" class="doc-btn-action download" aria-label="Descargar módulo sobre cetáceos desde MARN"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>

            <article class="doc-card-fluid">
                <div class="doc-cover-bar teal"></div>
                <div class="doc-body-fluid">
                    <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                    <h3>Programas de estudio de Ciencia y Tecnología, III ciclo</h3>
                    <p><strong>MINEDUCYT · 92 páginas.</strong> Marco educativo nacional que incluye oceanografía, dinámica costera, ecosistemas marino-costeros, biología marina, contaminación oceánica y uso de simuladores.</p>
                    <div class="doc-actions-fluid">
                        <a href="https://www.mined.gob.sv/materiales/2026/CIENCIA_Y_TECNOLOGIA/1.%20Programas%20de%20estudio/Programas%20de%20estudio_Ciencia%20y%20Tecnolog%C3%ADa_III%20ciclo.pdf" target="_blank" rel="noopener noreferrer" class="doc-btn-action view" aria-label="Ver programa de Ciencia y Tecnología de MINEDUCYT"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="https://www.mined.gob.sv/materiales/2026/CIENCIA_Y_TECNOLOGIA/1.%20Programas%20de%20estudio/Programas%20de%20estudio_Ciencia%20y%20Tecnolog%C3%ADa_III%20ciclo.pdf" download target="_blank" rel="noopener noreferrer" class="doc-btn-action download" aria-label="Descargar programa de Ciencia y Tecnología de MINEDUCYT"><i class="fa-solid fa-download"></i></a>
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
<script src="../public/js/recursos.js?v=<?php echo $resourcesJsVersion; ?>" defer></script>
<script src="../public/js/session.js" defer></script>
<link rel="stylesheet" href="../public/build/recursos-timeline/recursos-timeline.css?v=<?php echo $timelineCssVersion; ?>">
<script type="module" src="../public/build/recursos-timeline/recursos-timeline.js?v=<?php echo $timelineJsVersion; ?>"></script>
<?php if (!empty($_SESSION['id'])) include __DIR__ . '/fragments/achievement-notifications.php'; ?>

</body>
</html>
