<?php
require_once __DIR__ . '/../app/models/Conexion.php';
require_once __DIR__ . '/../app/support/AuthRedirect.php';
require_once __DIR__ . '/../app/support/AchievementPageTracker.php';
$conexion = new Conexion();
$conn = $conexion->getConnection();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_GET['token'])) {
    header("Location: login.php");
    exit;
}

$token = $_GET['token'];

// Buscar token vigente
$stmt = $conn->prepare("SELECT v.id_usuario, v.expira, u.id FROM verificaciones v
                        JOIN usuarios u ON v.id_usuario = u.id
                        WHERE v.token = ? AND u.estado = 'pendiente'");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

$error = '';
if ($row = $result->fetch_assoc()) {
    $ahora = date('Y-m-d H:i:s');
    if ($row['expira'] < $ahora) {
        // Token expirado → eliminar
        $conn->query("DELETE FROM verificaciones WHERE token = '$token'");
        $error = 'expirado';
    } else {
        // Activar cuenta
        $id_usuario = $row['id'];
        $conn->query("UPDATE usuarios SET estado = 'activo' WHERE id = $id_usuario");
        // Eliminar token usado
        $conn->query("DELETE FROM verificaciones WHERE token = '$token'");

        // ===== INICIAR SESIÓN AUTOMÁTICAMENTE =====
        $stmtUser = $conn->prepare("SELECT username, rol_id FROM usuarios WHERE id = ?");
        $stmtUser->bind_param("i", $id_usuario);
        $stmtUser->execute();
        $userData = $stmtUser->get_result()->fetch_assoc();

        if ($userData) {
            $_SESSION['usuario'] = $userData['username'];
            $_SESSION['rol']     = $userData['rol_id'];
            $_SESSION['id']      = $id_usuario;

            AchievementPageTracker::recordLogin($conn, (int) $id_usuario);

            // Redirigir al index con sesión iniciada
            AuthRedirect::redirectAfterAuthentication(
                null,
                '/Simulador-Acu-tico-main/views/index.php?verificacion=ok'
            );
        } else {
            // Por si acaso no encuentra al usuario (no debería ocurrir)
            header("Location: login.php?mensaje=verificacion_exitosa");
            exit;
        }
    }
} else {
    $error = 'invalido';
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <title>Verificación · Blue EcoSim</title>
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/verify.css">
</head>
<body>
    <div id="navbar-container">
        <?php include(__DIR__ . "/fragments/navbar.php"); ?>
    </div>
    <main class="verify-main">
    <div class="mensaje">
        <?php if ($error === 'expirado'): ?>
            <h2>⏰ Enlace expirado</h2>
            <p>El enlace de verificación ha caducado. Por favor, vuelve a registrarte.</p>
            <a href="registro.php" class="btn">Ir al registro</a>
        <?php elseif ($error === 'invalido'): ?>
            <h2>❌ Enlace inválido</h2>
            <p>El enlace no es válido o la cuenta ya ha sido activada.</p>
            <a href="login.php" class="btn">Ir al login</a>
        <?php endif; ?>
    </div>
    </main>

    <div id="footer-container">
        <?php include(__DIR__ . "/fragments/footer.php"); ?>
    </div>
</body>
</html>
