<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../app/support/AuthRedirect.php';

AuthRedirect::requireAuthentication();
require_once __DIR__ . '/../app/support/AchievementPageTracker.php';
AchievementPageTracker::track('simulations');

$selectorCssVersion = filemtime(__DIR__ . '/../public/css/simuladores.css');
$selectorJsVersion = filemtime(__DIR__ . '/../public/js/simuladores.js');
$sessionJsVersion = filemtime(__DIR__ . '/../public/js/session.js');
$displayName = htmlspecialchars($_SESSION['usuario'], ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#eaf5fb">
    <title>Laboratorio de simulación | BlueEcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/simuladores.css?v=<?php echo $selectorCssVersion; ?>">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body class="simulator-hub">
<div class="ambient ambient-one" aria-hidden="true"></div>
<div class="ambient ambient-two" aria-hidden="true"></div>

<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<div class="app-frame">
    <main class="selector-shell">
        <header class="workspace-toolbar" aria-label="Herramientas del laboratorio">
            <div class="workspace-title">
                <span class="status-light" aria-hidden="true"></span>
                <div>
                    <strong>Laboratorio virtual</strong>
                    <small>Entorno de aprendizaje activo</small>
                </div>
            </div>

            <label class="search-field" for="simulatorSearch">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <input id="simulatorSearch" type="search" placeholder="Buscar simulador..." autocomplete="off">
                <kbd>Ctrl K</kbd>
            </label>

            <div class="toolbar-actions">
                <a href="perfilUsuario.php" class="profile-chip" aria-label="Abrir perfil de <?php echo $displayName; ?>">
                    <span class="profile-copy"><small>Sesión activa</small><strong><?php echo $displayName; ?></strong></span>
                    <span class="profile-initial" aria-hidden="true"><?php echo htmlspecialchars(mb_strtoupper(mb_substr($_SESSION['usuario'], 0, 1)), ENT_QUOTES, 'UTF-8'); ?></span>
                </a>
            </div>
        </header>

        <section class="selector-hero reveal" aria-labelledby="selectorTitle">
            <div class="hero-copy">
                <span class="eyebrow"><i class="fa-solid fa-sparkles" aria-hidden="true"></i> Explora · Experimenta · Comprende</span>
                <h1 id="selectorTitle">El océano se entiende mejor cuando <em>cobra vida.</em></h1>
                <p>Experimenta con ecosistemas digitales, observa relaciones invisibles y descubre cómo cada decisión transforma el equilibrio marino.</p>
                <div class="hero-actions">
                    <button class="primary-action ripple-button" type="button" data-quick-start="1">
                        Explorar simuladores <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="hero-trust" aria-label="Resumen del laboratorio">
                    <span><strong>3</strong> escenarios interactivos</span>
                    <span><strong>100%</strong> aprendizaje práctico</span>
                </div>
            </div>

            <div class="hero-visual" aria-label="Vista previa de un ecosistema marino virtual">
                <img src="../public/media/edited/Simulador.jpg" alt="Ilustración original de un ecosistema marino virtual" loading="eager">
                <div class="visual-shade" aria-hidden="true"></div>
                <div class="live-pill"><span></span> Ecosistema en línea</div>
                <div class="water-metric metric-temperature">
                    <i class="fa-solid fa-temperature-half" aria-hidden="true"></i>
                    <div><small>Temperatura</small><strong>26.4 °C</strong></div>
                </div>
                <div class="water-metric metric-health">
                    <div class="metric-ring"><span>94</span></div>
                    <div><small>Salud ambiental</small><strong>Óptima</strong></div>
                </div>
            </div>
        </section>

        <section class="library-section" id="simulatorLibrary" aria-labelledby="libraryTitle">
            <div class="section-heading reveal">
                <div>
                    <span class="section-kicker">Biblioteca de experiencias</span>
                    <h2 id="libraryTitle">Selecciona un escenario</h2>
                    <p>Cada entorno responde en tiempo real a tus decisiones.</p>
                </div>
                <div class="filter-chips" aria-label="Filtros de simuladores">
                    <button class="filter-chip active" type="button" data-filter="all" aria-pressed="true">Todos</button>
                    <button class="filter-chip" type="button" data-filter="equilibrio" aria-pressed="false">Equilibrio</button>
                    <button class="filter-chip" type="button" data-filter="impacto" aria-pressed="false">Impacto</button>
                </div>
            </div>

            <div class="classroom-grid" aria-label="Lista de simuladores">
                <button class="classroom-card reef reveal" type="button" data-simulation="1" data-category="equilibrio" data-search="arrecife los cobanos equilibrio ecosistema saludable">
                    <span class="card-media" aria-hidden="true">
                        <span class="card-orbit orbit-one"></span><span class="card-orbit orbit-two"></span>
                        <i class="fa-solid fa-water card-symbol"></i>
                        <span class="card-number">01</span>
                        <span class="card-status"><i class="fa-solid fa-circle"></i> Nivel inicial</span>
                    </span>
                    <span class="card-content">
                        <span class="card-topline"><span>Equilibrio natural</span><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>
                        <strong>Arrecife de Los Cóbanos</strong>
                        <span class="card-description">Observa especies marinas dentro de un ecosistema saludable, estable y lleno de conexiones.</span>
                        <span class="card-meta">
                            <span><i class="fa-regular fa-clock" aria-hidden="true"></i> 8–12 min</span>
                            <span><i class="fa-solid fa-sliders" aria-hidden="true"></i> 4 variables</span>
                        </span>
                    </span>
                </button>

                <button class="classroom-card chain reveal" type="button" data-simulation="2" data-category="equilibrio" data-search="cadena alimenticia poblaciones red trofica especies">
                    <span class="card-media" aria-hidden="true">
                        <span class="card-orbit orbit-one"></span><span class="card-orbit orbit-two"></span>
                        <i class="fa-solid fa-link card-symbol"></i>
                        <span class="card-number">02</span>
                        <span class="card-status"><i class="fa-solid fa-circle"></i> Nivel intermedio</span>
                    </span>
                    <span class="card-content">
                        <span class="card-topline"><span>Dinámica de poblaciones</span><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>
                        <strong>Cadena alimenticia</strong>
                        <span class="card-description">Modifica poblaciones y descubre cómo una pequeña variación recorre toda la red trófica.</span>
                        <span class="card-meta">
                            <span><i class="fa-regular fa-clock" aria-hidden="true"></i> 12–18 min</span>
                            <span><i class="fa-solid fa-sliders" aria-hidden="true"></i> 7 variables</span>
                        </span>
                    </span>
                </button>

                <button class="classroom-card impact reveal" type="button" data-simulation="3" data-category="impacto" data-search="contaminacion marina impacto oxigeno salud ambiente">
                    <span class="card-media" aria-hidden="true">
                        <span class="card-orbit orbit-one"></span><span class="card-orbit orbit-two"></span>
                        <i class="fa-solid fa-flask card-symbol"></i>
                        <span class="card-number">03</span>
                        <span class="card-status"><i class="fa-solid fa-circle"></i> Nivel avanzado</span>
                    </span>
                    <span class="card-content">
                        <span class="card-topline"><span>Presión ambiental</span><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>
                        <strong>Contaminación marina</strong>
                        <span class="card-description">Comprueba cómo la contaminación altera el oxígeno, la salud y el bienestar biológico.</span>
                        <span class="card-meta">
                            <span><i class="fa-regular fa-clock" aria-hidden="true"></i> 10–15 min</span>
                            <span><i class="fa-solid fa-sliders" aria-hidden="true"></i> 3 variables</span>
                        </span>
                    </span>
                </button>
            </div>

            <div class="empty-results" id="emptyResults" hidden>
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <h3>No encontramos ese escenario</h3>
                <p>Prueba con “arrecife”, “poblaciones” o “contaminación”.</p>
            </div>
        </section>

        <section class="learning-strip reveal" aria-label="Beneficios del laboratorio virtual">
            <div class="learning-intro">
                <span class="section-kicker">Aprendizaje inmersivo</span>
                <h2>Decide, observa y vuelve a intentar.</h2>
            </div>
            <div class="learning-points">
                <article><i class="fa-solid fa-wave-square" aria-hidden="true"></i><div><strong>Respuesta inmediata</strong><span>Visualiza cada cambio al instante.</span></div></article>
                <article><i class="fa-solid fa-shield-halved" aria-hidden="true"></i><div><strong>Entorno seguro</strong><span>Experimenta sin consecuencias reales.</span></div></article>
                <article><i class="fa-solid fa-chart-line" aria-hidden="true"></i><div><strong>Datos con propósito</strong><span>Interpreta relaciones ambientales.</span></div></article>
            </div>
        </section>
    </main>
</div>

<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<div class="sim-info-modal" id="simInfoModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalDescription" hidden>
    <div class="modal-panel">
        <button class="modal-close" id="closeModal" type="button" aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <div class="modal-header">
            <div class="modal-icon" id="modalIcon"><i class="fa-solid fa-water" aria-hidden="true"></i></div>
            <span id="modalTag">Equilibrio</span>
        </div>
        <h2 id="modalTitle">Arrecife de Los Cóbanos</h2>
        <p id="modalDescription">Observa especies marinas en un ecosistema saludable y estable.</p>
        <div class="modal-facts" id="modalFacts"></div>
        <div class="modal-actions">
            <button class="modal-secondary" id="cancelModal" type="button">Ahora no</button>
            <button class="modal-start ripple-button" id="startSelectedSimulation" type="button">
                Iniciar simulación <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </button>
        </div>
    </div>
</div>

<script src="../public/js/simuladores.js?v=<?php echo $selectorJsVersion; ?>" defer></script>
<script src="../public/js/session.js?v=<?php echo $sessionJsVersion; ?>" defer></script>
<?php include __DIR__ . '/fragments/achievement-notifications.php'; ?>
</body>
</html>
