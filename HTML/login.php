<?php 
    include("conexion.php");
    session_start();

    if (isset($_SESSION['usuario'])) {
        header("Location: dashboard.php");
        exit;
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | BlueEcoSims</title>
    <link rel="stylesheet" href="../CSS/navbar-footer.css">
    <link rel="stylesheet" href="../CSS/login.css">
    <link rel="icon" href="../MEDIA/Web/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>

    <!-- NAVBAR -->
    <div id="navbar-container"><?php include("fragments/navbar.php"); ?></div>
    <div class="spacer"></div>

    <!-- LOGIN -->
    <div class="container" id="container">
        <div class="form-wrapper login-wrapper" id="loginWrapper">
            <div class="form-container">
                <h1 class="form-title">Bienvenido</h1>
                <p class="form-subtitle">Continua con tu exploración al mundo marino</p>

                <form class="login-form" action="../PHP/login.php" method="post">

                    <div class="campo">
                        <label for="login-email">Email</label>
                        <input type="email" id="login-email" name="email" placeholder="Ingrese su correo electrónico" required>
                        <div class="linea"></div>
                    </div>

                    <div class="campo">
                        <label for="login-password">Contraseña</label>
                        <input type="password" id="login-password" name="password" placeholder="Ingrese su contraseña" required>
                        <div class="linea"></div>
                    </div>

                    <button type="submit" class="btn-submit">Iniciar sesión</button>

                    <p class="switch-link">
                        ¿No tienes una cuenta? 
                        <a href="registro.php">Regístrate</a>
                    </p>

                </form>
            </div>
        </div>
    </div>
    <?php
        if (isset($_GET['error'])) {
            if ($_GET['error'] == 'credentials') {
                echo "<div class='error'>ERROR: Datos no coinciden...</div>";
            }
            if ($_GET['error'] == 'empty') {
                echo "<div class='error'>ERROR: Datos vacíos...</div>";
            }
            if ($_GET['error'] == 'locked') {
                echo "<div class='error'>ERROR: Primero deberías iniciar sesión...</div>";
            }
        }
        if (isset($_GET['registro'])) {
            if ($_GET['registro'] == 'ok') {
                echo "<div class='valid'>Usuario registrado con éxito</div>";
            }
        }
    ?>
    <div id="footer-container"><?php include("fragments/footer.php"); ?></div>

    <canvas id="bubblesCanvas"></canvas>


</body>
</html>