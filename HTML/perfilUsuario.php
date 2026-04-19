<?php
    // Conexión y sesión
    include("../PHP/conexion.php");

    // Redirigir si no hay sesión iniciada
    if (!isset($_SESSION['id'])) {
        header("Location: login.php");
        exit();
    }

    $userId = $_SESSION['id'];

    // Obtener datos del usuario junto con su rol
    $sql = "SELECT u.id, u.username, u.email, r.rol FROM usuarios u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = ?";
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
    <link rel="icon" href="../MEDIA/Web/logo.png" type="image/png">

    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="../CSS/navbar-footer.css">
    <link rel="stylesheet" href="../CSS/perfilUsuario.css">
</head>
<body>

    <!-- SOLO UN NAVBAR -->
    <div id="navbar-container">
        <?php include("fragments/navbar.php"); ?>
    </div>

    <div class="main-container">
        <main class="profile-container">
            <div class="profile-header">
                <div class="avatar"><?php echo strtoupper(substr($user['username'],0,1)); ?></div>
                <div class="profile-info">
                    <h2><?php echo htmlspecialchars($user['username']); ?></h2>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
                    <p><strong>Rol:</strong> <?php echo htmlspecialchars($user['rol'] ?? 'Usuario'); ?></p>
                </div>
            </div>

            <div class="profile-actions">
                <a href="perfilEditar.php" class="btn btn-primary">Editar perfil</a>
                <a href="../PHP/logout.php" class="btn btn-secondary">Cerrar sesión</a>
            </div>
        </main>
    </div>

    <div id="footer-container">
        <?php include("fragments/footer.php"); ?>
    </div>

    <script src
</html>
