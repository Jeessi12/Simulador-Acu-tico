<?php

require_once __DIR__ . '/../../app/services/AchievementManager.php';

$achievementNotifications = AchievementManager::consumePendingNotifications();
$achievementCsrfToken = AchievementManager::csrfToken();
$achievementNotificationAssetVersion = filemtime(__DIR__ . '/../../public/js/achievements.js');
?>
<link rel="stylesheet" href="/Simulador-Acu-tico-main/public/css/achievements.css?v=<?php echo $achievementNotificationAssetVersion; ?>">
<div id="achievement-toast-region"
     class="achievement-toast-region"
     aria-live="polite"
     aria-label="Notificaciones de logros"></div>
<script id="achievement-pending-data" type="application/json"><?php
    echo json_encode(
        $achievementNotifications,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP
    );
?></script>
<script>
    window.BLUEECO_ACHIEVEMENT_CSRF = <?php echo json_encode($achievementCsrfToken); ?>;
</script>
<script src="/Simulador-Acu-tico-main/public/js/achievements.js?v=<?php echo $achievementNotificationAssetVersion; ?>" defer></script>
