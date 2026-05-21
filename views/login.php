<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$mensajes = [
    'pendiente_verificacion' => 'Registro exitoso. Revisa tu correo para verificar la cuenta.',
    'verificacion_exitosa'   => '¡Cuenta verificada con éxito! Ya puedes iniciar sesión.',
    'cuenta_no_verificada'   => 'Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.',
];

$clase = 'valid';
if (isset($_GET['mensaje'])) {
    $clave = $_GET['mensaje'];
    $msg   = $mensajes[$clave] ?? '';
    if ($clave === 'cuenta_no_verificada') $clase = 'error';
    if ($msg) echo "<div class='$clase'>$msg</div>";
}

if (isset($_GET['error'])) {
    $errores = [
        'credentials'  => 'Email o contraseña incorrectos.',
        'denied'       => 'Acceso denegado.',
        'google_fallo' => 'Hubo un problema al conectar con Google. Intenta de nuevo.',
    ];
    $msg = $errores[$_GET['error']] ?? 'Error desconocido.';
    echo "<div class='error'>$msg</div>";
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

            <!-- Botón Google directo, sin modal -->
            <div class="social-login">
                <div class="divider"><span>o</span></div>
                <a href="/Simulador-Acu-tico-main/app/controllers/GoogleLoginController.php"
                   class="google-btn">
                    <img src="../public/media/Web/Logo-Google.png" alt="Google logo">
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
<!-- google-role-modal.js eliminado -->

</body>
</html>