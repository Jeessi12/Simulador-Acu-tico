<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../app/support/AuthRedirect.php';

include __DIR__ . '/../app/models/Conexion.php';
require_once __DIR__ . '/../app/services/AchievementManager.php';
$conexion = new Conexion();
$conn = $conexion->getConnection();

AuthRedirect::requireAuthentication();

if (!defined('ROL_ESTUDIANTE')) {
    define('ROL_ESTUDIANTE', 1);
    define('ROL_DOCENTE',    2);
    define('ROL_PERSONAL',   3);
    define('ROL_ADMIN',      4);
}

if (!function_exists('getRoleAvatarSrc')) {
    function getRoleAvatarSrc(?int $rol): string {
        switch ($rol) {
            case ROL_ESTUDIANTE:
                return '/Simulador-Acu-tico-main/public/media/Web/estudiante.png';
            case ROL_DOCENTE:
                return '/Simulador-Acu-tico-main/public/media/Web/docente.png';
            case ROL_PERSONAL:
                return '/Simulador-Acu-tico-main/public/media/Web/usuario.png';
            default:
                return '/Simulador-Acu-tico-main/public/media/Web/icon.jpeg';
        }
    }
}

if (!function_exists('getProfileInfo')) {
    function getProfileInfo(?int $rol): array {
        switch ($rol) {
            case ROL_ESTUDIANTE:
                return [
                    'titulo' => 'Estudiante BlueEcoSim',
                    'desc'   => 'Explorador del mundo acuático en formación. Participas en simulaciones interactivas para aprender sobre ecosistemas marinos y desarrollar conciencia ambiental.',
                    'items'  => [
                        ['label' => 'Área',     'value' => 'Ciencias del mar'],
                        ['label' => 'Objetivo', 'value' => 'Completar todas las asignaciones'],
                        ['label' => 'Nivel',    'value' => 'Principiante'],
                    ],
                ];
            case ROL_DOCENTE:
                return [
                    'titulo' => 'Docente BlueEcoSim',
                    'desc'   => 'Guía y formador de nuevos exploradores marinos. Diseñas y asignas actividades de simulación para que tus estudiantes descubran los ecosistemas acuáticos.',
                    'items'  => [
                        ['label' => 'Función',  'value' => 'Gestión de asignaciones'],
                        ['label' => 'Rol',      'value' => 'Facilitador de aprendizaje'],
                        ['label' => 'Acceso',   'value' => 'Seguimiento de estudiantes'],
                    ],
                ];
            case ROL_PERSONAL:
                return [
                    'titulo' => 'Personal de Apoyo',
                    'desc'   => 'Miembro del equipo de soporte de BlueEcoSim. Contribuyes al funcionamiento de la plataforma y brindas asistencia a la comunidad educativa.',
                    'items'  => [
                        ['label' => 'Función',  'value' => 'Soporte y administración'],
                        ['label' => 'Acceso',   'value' => 'Panel de gestión'],
                        ['label' => 'Área',     'value' => 'Operaciones internas'],
                    ],
                ];
            default:
                return [
                    'titulo' => 'Usuario BlueEcoSim',
                    'desc'   => 'Bienvenido a BlueEcoSim. Tienes acceso general a la plataforma y puedes explorar el contenido disponible sobre ecosistemas acuáticos.',
                    'items'  => [
                        ['label' => 'Acceso',  'value' => 'Contenido general'],
                        ['label' => 'Modo',    'value' => 'Exploración libre'],
                        ['label' => 'Estado',  'value' => 'Usuario registrado'],
                    ],
                ];
        }
    }
}

$userId      = $_SESSION['id'];
$avatarSrc   = getRoleAvatarSrc($_SESSION['rol'] ?? null);
$profileInfo = getProfileInfo($_SESSION['rol'] ?? null);

$sql = "SELECT u.id, u.username, u.email, r.rol 
        FROM usuarios u 
        LEFT JOIN roles r ON u.rol_id = r.id 
        WHERE u.id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();
$user   = $result->fetch_assoc();

$achievementManager = new AchievementManager($conn);
$achievementData = $achievementManager->getUserAchievements((int) $userId);
$achievementTotals = $achievementData['totals'];
$achievementCompletion = $achievementTotals['total'] > 0
    ? (int) round(($achievementTotals['unlocked'] / $achievementTotals['total']) * 100)
    : 0;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil de usuario - BlueEcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/perfilUsuario.css">
</head>
<body>

    <div id="navbar-container">
        <?php include("fragments/navbar.php"); ?>
    </div>

    <div class="main-container">
        <main class="profile-container">
            <div class="profile-banner">
                <div class="banner-overlay"></div>
                <div class="banner-texture"></div>
            </div>

            <div class="profile-avatar">
                <img src="<?php echo htmlspecialchars($avatarSrc); ?>" alt="Avatar">
                <div class="avatar-ring"></div>
            </div>

            <div class="profile-card">

                <div class="profile-details">
                    <div class="detail-item">
                        <div class="detail-icon">📧</div>
                        <div>
                            <strong>Email</strong>
                            <span><?php echo htmlspecialchars($user['email'] ?? ''); ?></span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">⭐</div>
                        <div>
                            <strong>Rol</strong>
                            <span><?php echo htmlspecialchars($user['rol'] ?? 'Explorador Marino'); ?></span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">📅</div>
                        <div>
                            <strong>Último acceso</strong>
                            <span><?php echo date('d/m/Y'); ?></span>
                        </div>
                    </div>
                </div>

                <div class="profile-sections">

                    <section class="profile-box">
                        <h2><?php echo htmlspecialchars($profileInfo['titulo']); ?></h2>
                        <p><?php echo htmlspecialchars($profileInfo['desc']); ?></p>
                        <ul class="profile-list">
                            <?php foreach ($profileInfo['items'] as $item): ?>
                                <li>
                                    <strong><?php echo htmlspecialchars($item['label']); ?>:</strong>
                                    <?php echo htmlspecialchars($item['value']); ?>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </section>

                    <section class="profile-box profile-box-alt">
                        <h2>🏅 Progreso de explorador</h2>
                        <div class="achievement-overview">
                            <div class="achievement-ring" style="--achievement-progress: <?php echo $achievementCompletion; ?>%;">
                                <span><?php echo $achievementCompletion; ?>%</span>
                            </div>
                            <div class="achievement-overview-copy">
                                <strong><?php echo $achievementTotals['unlocked']; ?> de <?php echo $achievementTotals['total']; ?> logros</strong>
                                <span><?php echo $achievementTotals['xp']; ?> XP obtenidos</span>
                                <p>Cada actividad educativa acerca tu expedición a la siguiente insignia.</p>
                            </div>
                        </div>
                    </section>

                </div>

                <section class="achievements-section" aria-labelledby="achievements-title">
                    <div class="achievements-heading">
                        <div>
                            <span class="achievements-kicker">Bitácora de progreso</span>
                            <h2 id="achievements-title">Logros e insignias</h2>
                            <p>Explora, aprende y experimenta para completar tu colección marina.</p>
                        </div>
                        <div class="achievements-summary" aria-label="Resumen de logros">
                            <span><strong><?php echo $achievementTotals['unlocked']; ?></strong> desbloqueados</span>
                            <span><strong><?php echo $achievementTotals['xp']; ?></strong> XP</span>
                        </div>
                    </div>

                    <div class="achievement-filters" role="group" aria-label="Filtrar logros por categoría">
                        <button type="button" class="achievement-filter is-active" data-achievement-filter="all" aria-pressed="true">Todos</button>
                        <?php foreach ($achievementData['categories'] as $category): ?>
                            <button type="button"
                                    class="achievement-filter"
                                    data-achievement-filter="<?php echo htmlspecialchars($category['code']); ?>"
                                    aria-pressed="false">
                                <span aria-hidden="true"><?php echo htmlspecialchars($category['icon']); ?></span>
                                <?php echo htmlspecialchars($category['name']); ?>
                            </button>
                        <?php endforeach; ?>
                    </div>

                    <div class="achievement-grid" id="achievementGrid">
                        <?php foreach ($achievementData['categories'] as $category): ?>
                            <?php foreach ($category['achievements'] as $achievement): ?>
                                <?php
                                    $isUnlocked = $achievement['status'] === 'unlocked';
                                    $earnedDate = $isUnlocked && $achievement['unlocked_at']
                                        ? (new DateTimeImmutable($achievement['unlocked_at']))->format('d/m/Y')
                                        : null;
                                ?>
                                <article class="achievement-card <?php echo $isUnlocked ? 'is-unlocked' : 'is-locked'; ?>"
                                         data-achievement-category="<?php echo htmlspecialchars($category['code']); ?>">
                                    <div class="achievement-card__topline">
                                        <span class="achievement-card__category"><?php echo htmlspecialchars($category['name']); ?></span>
                                        <span class="achievement-level achievement-level--<?php echo strtolower(htmlspecialchars($achievement['level'])); ?>">
                                            <?php echo htmlspecialchars($achievement['level']); ?>
                                        </span>
                                    </div>
                                    <div class="achievement-card__body">
                                        <div class="achievement-card__badge" aria-hidden="true">
                                            <span><?php echo htmlspecialchars($achievement['icon']); ?></span>
                                            <?php if ($isUnlocked): ?><i>✓</i><?php else: ?><i>🔒</i><?php endif; ?>
                                        </div>
                                        <div class="achievement-card__copy">
                                            <h3><?php echo htmlspecialchars($achievement['name']); ?></h3>
                                            <p><?php echo htmlspecialchars($achievement['description']); ?></p>
                                        </div>
                                    </div>
                                    <div class="achievement-card__progress">
                                        <div class="achievement-progress-label">
                                            <span><?php echo $isUnlocked ? 'Completado' : 'Progreso'; ?></span>
                                            <strong><?php echo htmlspecialchars($achievement['progress_label']); ?></strong>
                                        </div>
                                        <div class="achievement-progress-track"
                                             role="progressbar"
                                             aria-label="Progreso de <?php echo htmlspecialchars($achievement['name']); ?>"
                                             aria-valuemin="0"
                                             aria-valuemax="100"
                                             aria-valuenow="<?php echo (int) $achievement['progress_percent']; ?>">
                                            <span style="width: <?php echo (int) $achievement['progress_percent']; ?>%"></span>
                                        </div>
                                    </div>
                                    <footer class="achievement-card__footer">
                                        <span><?php echo $earnedDate ? 'Obtenido el ' . $earnedDate : 'Aún bloqueado'; ?></span>
                                        <strong>+<?php echo (int) $achievement['xp_reward']; ?> XP</strong>
                                    </footer>
                                </article>
                            <?php endforeach; ?>
                        <?php endforeach; ?>
                    </div>
                    <p class="achievement-filter-empty" id="achievementFilterEmpty" hidden>No hay logros en esta categoría.</p>
                </section>

                <div class="profile-actions">
                    <a href="/Simulador-Acu-tico-main//app/Controllers/LogoutController.php" class="btn-logout">🚪 Cerrar sesión</a>
                </div>

            </div>
        </main>
    </div>

    <div id="footer-container">
        <?php include("fragments/footer.php"); ?>
    </div>
<canvas id="particles"></canvas>
<script src="/Simulador-Acu-tico-main/public/js/burbujas.js" defer></script>
<script src="/Simulador-Acu-tico-main/public/js/profile-achievements.js" defer></script>
<?php include __DIR__ . '/fragments/achievement-notifications.php'; ?>
</body>
</html>
