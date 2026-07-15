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
$showcaseCssVersion = filemtime(__DIR__ . '/../public/build/simuladores-showcase/simuladores-showcase.css');
$showcaseJsVersion = filemtime(__DIR__ . '/../public/build/simuladores-showcase/simuladores-showcase.js');
$sessionJsVersion = filemtime(__DIR__ . '/../public/js/session.js');
$bubblesJsVersion = filemtime(__DIR__ . '/../public/js/burbujas.js');
$displayName = htmlspecialchars($_SESSION['usuario'], ENT_QUOTES, 'UTF-8');
$userRole = (int) ($_SESSION['rol'] ?? 0);
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
    <link rel="stylesheet" href="../public/build/simuladores-showcase/simuladores-showcase.css?v=<?php echo $showcaseCssVersion; ?>">

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

<canvas id="particles" class="simulations-particles" aria-hidden="true"></canvas>

<div class="app-frame">
    <main class="selector-shell">
        <div class="hero-stage">
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
                <img src="../public/media/backgrounds/Simuladores-bg.webp" alt="Ilustración original de un ecosistema marino virtual" loading="eager">
                <div class="visual-shade" aria-hidden="true"></div>
                <div class="vector-wave vector-wave-back" aria-hidden="true"></div>
                <div class="vector-wave vector-wave-front" aria-hidden="true"></div>
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
        </div>

        <div id="simuladores-showcase" data-user-role="<?php echo $userRole; ?>"></div>
    </main>
</div>

<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<script src="../public/js/burbujas.js?v=<?php echo $bubblesJsVersion; ?>" defer></script>
<script src="../public/js/simuladores.js?v=<?php echo $selectorJsVersion; ?>" defer></script>
<script type="module" src="../public/build/simuladores-showcase/simuladores-showcase.js?v=<?php echo $showcaseJsVersion; ?>"></script>
<script src="../public/js/session.js?v=<?php echo $sessionJsVersion; ?>" defer></script>
<?php include __DIR__ . '/fragments/achievement-notifications.php'; ?>
</body>
</html>
