<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (isset($_SESSION['usuario'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | BlueEcoSim</title>

    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/login.css">

    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>

<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<div class="spacer"></div>

<div class="container" id="container">
    <div class="form-wrapper login-wrapper" id="loginWrapper">
        <div class="form-container">
            <h1 class="form-title">Bienvenido</h1>
            <p class="form-subtitle">Continua con tu exploración al mundo marino</p>

            <form class="login-form"
                  action="/Simulador-Acu-tico-main/app/controllers/AuthController.php"
                  method="post">

                <div class="campo">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" name="email"
                           placeholder="Ingrese su correo electrónico" required>
                    <div class="linea"></div>
                </div>

                <div class="campo">
                    <label for="login-password">Contraseña</label>
                    <input type="password" id="login-password" name="password"
                           placeholder="Ingrese su contraseña" required>
                    <div class="linea"></div>
                </div>

                <button type="submit" class="btn-submit">Iniciar sesión</button>

                <p class="switch-link">
                    ¿No tienes una cuenta?
                    <a href="/Simulador-Acu-tico-main/views/registro.php">Regístrate</a>
                </p>

            </form>

            <!-- BOTÓN DE GOOGLE -->
            <div class="social-login">
                <div class="divider"><span>o</span></div>
                <a href="google-login.php" class="google-btn">
                <img src="../public/media/Web/google-icon.svg" alt="Google logo">
                Iniciar sesión con Google
                </a>
            </div>

        </div>
    </div>
</div>

<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<canvas id="particles"></canvas>
<script src="/Simulador-Acu-tico-main/public/js/burbujas.js" defer></script>

</body>
</html>