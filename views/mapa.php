<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$pageTitle = "Mapa interactivo - Los Cóbanos";
$resourcesCssVersion = filemtime(__DIR__ . '/../public/css/recursos.css');
$mapaCssVersion = filemtime(__DIR__ . '/../public/css/mapa.css');
$resourcesJsVersion = filemtime(__DIR__ . '/../public/js/recursos.js');
$bubblesJsVersion = filemtime(__DIR__ . '/../public/js/burbujas.js');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link rel="preload" href="../public/media/backgrounds/mapa.webp" as="image" type="image/webp">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/recursos.css?v=<?php echo $resourcesCssVersion; ?>">
    <link rel="stylesheet" href="../public/css/mapa.css?v=<?php echo $mapaCssVersion; ?>">
</head>
<body class="recursos-page mapa-page">

<canvas id="particles" aria-hidden="true"></canvas>

<div id="navbar-container">
    <?php include(__DIR__ . '/fragments/navbar.php'); ?>
</div>

<main id="main-content" class="mapa-main">
    <?php include(__DIR__ . '/fragments/mapa-interactivo.php'); ?>
</main>

<div id="footer-container">
    <?php include(__DIR__ . '/fragments/footer.php'); ?>
</div>

<script src="../public/js/recursos.js?v=<?php echo $resourcesJsVersion; ?>" defer></script>
<script src="../public/js/burbujas.js?v=<?php echo $bubblesJsVersion; ?>" defer></script>
<script src="../public/js/session.js" defer></script>
<?php if (!empty($_SESSION['id'])) include __DIR__ . '/fragments/achievement-notifications.php'; ?>

</body>
</html>
