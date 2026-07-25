<?php
$currentUser = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : null;
?>
<?php if (!isset($GLOBALS['chatbot_css_loaded'])): ?>
    <?php $GLOBALS['chatbot_css_loaded'] = true; ?>
    <link rel="stylesheet" href="../public/css/chatbot.css?v=20260724-4">
<?php endif; ?>
<script>
    if (typeof window.currentUserName === 'undefined') {
        window.currentUserName = <?php echo json_encode($currentUser); ?>;
    }
</script>
<script src="../public/js/chatbot.js?v=20260724-4"></script>
