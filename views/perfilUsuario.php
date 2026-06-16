<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include __DIR__ . '/../app/models/Conexion.php';
$conexion = new Conexion();
$conn = $conexion->getConnection();

if (!isset($_SESSION['id'])) {
    header("Location: login.php");
    exit();
}

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
                        <h2>🏅 Insignias</h2>
                        <div class="badges-empty">
                            <div class="badge-icon">🌊</div>
                            <p>Aún no has desbloqueado ninguna insignia</p>
                            <span>¡Completa simulaciones para ganar tus primeras medallas!</span>
                        </div>
                    </section>

                </div>

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
</body>
</html>