<?php
// Variable de usuario para personalizar el chatbot
// La variable ya fue declarada en navbar.php, pero la repetimos por si acaso
$currentUser = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : null;
?>

<?php if (!isset($GLOBALS['chatbot_css_loaded'])): ?>
    <?php $GLOBALS['chatbot_css_loaded'] = true; ?>
    <link rel="stylesheet" href="/Simulador-Acu-tico-main/public/css/chatbot.css">
<?php endif; ?>

<script>
    // Asegurar que currentUserName esté disponible
    if (typeof window.currentUserName === 'undefined') {
        window.currentUserName = <?php echo json_encode($currentUser); ?>;
    }
</script>
<script src="/Simulador-Acu-tico-main/public/js/chatbot.js"></script>