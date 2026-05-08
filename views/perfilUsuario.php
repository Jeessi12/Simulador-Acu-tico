<?php
// Iniciar sesión correctamente
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Conexión
include __DIR__ . '/../app/models/Conexion.php';

// Verificar sesión
if (!isset($_SESSION['id'])) {
    header("Location: login.php");
    exit();
}

$userId = $_SESSION['id'];

// Consulta segura
$sql = "SELECT u.id, u.username, u.email, r.rol 
        FROM usuarios u 
        LEFT JOIN roles r ON u.rol_id = r.id 
        WHERE u.id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();
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
            <!-- Banner fijo -->
            <div class="profile-banner">
                <div class="banner-overlay"></div>
                <div class="banner-texture"></div>
            </div>

           <div class="profile-avatar">
            <img src="../public/media/Web/icon.jpeg" alt="Avatar">
    <div class="avatar-ring"></div>
</div>

            <div class="profile-card">

                <!-- Datos básicos -->
                <div class="profile-details">
                    <div class="detail-item">
                        <div class="detail-icon">📧</div>
                        <div>
                            <strong>Email</strong>
                            <span><?php echo htmlspecialchars($user['email']); ?></span>
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

                <!-- Secciones informativas -->
                <div class="profile-sections">
                    <section class="profile-box">
                        <h2>🌟 Sobre mí</h2>
                        <p>Aventurero apasionado por el océano y sus misterios. Disfruto explorando simulaciones acuáticas interactivas y aprendiendo cómo proteger los ecosistemas marinos.</p>
                        <ul class="profile-list">
                            <li><strong>🌊 Interés:</strong> Biodiversidad marina</li>
                            <li><strong>🎯 Objetivo:</strong> Completar todas las asignaciones</li>
                            <li><strong>🏆 Experiencia:</strong> Nivel principiante</li>
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
                     <a href="#" class="btn-edit">✏️ Editar perfil</a>
                     <a href="/Simulador-Acu-tico-main//app/Controllers/LogoutController.php" class="btn-logout">🚪 Cerrar sesión</a>
                </div>
            </div>
        </main>
    </div>

    <div id="footer-container">
        <?php include("fragments/footer.php"); ?>
    </div>

</body>
</html>