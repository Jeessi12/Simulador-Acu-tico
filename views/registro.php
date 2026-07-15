<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$errores = [
    'email_duplicado'    => 'Este correo electrónico ya está registrado.',
    'envio_correo'       => 'No se pudo enviar el correo de verificación. Inténtalo de nuevo.',
    'error_registro'     => 'No se pudo completar el registro. Inténtalo nuevamente.',
    'desconocido'        => 'Error desconocido al registrar. Intenta más tarde.'
];
$error_msg = '';
if (isset($_GET['error']) && isset($errores[$_GET['error']])) {
    $error_msg = $errores[$_GET['error']];
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
    <title>Registro | BlueEcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/registro.css">
    <link rel="stylesheet" href="../public/build/auth-loaders/auth-loaders.css">
</head>
<body>

<!-- Video de fondo -->
<video id="bg-video" autoplay muted loop playsinline>
    <source src="../public/media/backgrounds/registro.mp4" type="video/mp4">
</video>
<div id="bg-video-overlay"></div>

<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<div class="container" id="container">
    <div class="form-wrapper register-wrapper" id="registerWrapper">
        <div class="form-container">

            <h1 class="form-title">Comienza tu inmersión</h1>

            <?php if ($error_msg): ?>
                <div class="error"><?php echo $error_msg; ?></div>
            <?php endif; ?>

            <form class="register-form"
                  action="/Simulador-Acu-tico-main/app/controllers/RegisterController.php"
                  method="post">

                <div class="campo">
                    <label for="reg-email">Email</label>
                    <input type="email" id="reg-email" name="email"
                           placeholder="Ingrese su correo electrónico" required>
                    <div class="linea"></div>
                </div>

                <div class="campo">
                    <label for="reg-username">Nombre de usuario</label>
                    <input type="text" id="reg-username" name="username"
                           placeholder="Ingrese su nombre de usuario" required>
                    <div class="linea"></div>
                </div>

                <div class="campo">
                    <label for="reg-password">Contraseña</label>
                    <input type="password" id="reg-password" name="password"
                           placeholder="Ingrese su contraseña" required>
                    <div class="linea"></div>
                </div>

                <div class="campo">
                    <label for="reg-confirm">Confirmar contraseña</label>
                    <input type="password" id="reg-confirm" name="confirm"
                           placeholder="Confirme su contraseña" required>
                    <div class="linea"></div>
                </div>

                <!-- Selector de rol integrado -->
                <div class="campo">
                    <label>¿Cuál es tu rol?</label>
                    <div class="rol-selector">
                        <div class="rol-opcion" data-rol="1">
                            <i class="fa-solid fa-user-graduate rol-icono"></i>
                            <span class="rol-nombre">Academico</span>
                            <span class="rol-desc">Soy estudiante</span>
                        </div>
                        <div class="rol-opcion" data-rol="2">
                            <i class="fa-solid fa-chalkboard-user rol-icono"></i>
                            <span class="rol-nombre">Guía</span>
                            <span class="rol-desc">Soy docente</span>
                        </div>
                        <div class="rol-opcion" data-rol="3">
                            <i class="fa-solid fa-fish rol-icono"></i>
                            <span class="rol-nombre">Explorador</span>
                            <span class="rol-desc">Uso personal</span>
                        </div>
                    </div>
                    <p class="rol-error" id="rolError">Selecciona un tipo de cuenta para continuar.</p>
                </div>

                <input type="hidden" name="rol" id="roleInput" value="">

                <button type="submit" class="btn-submit">
                    <span class="auth-submit__label">Registrar</span>
                    <span class="auth-submit__loader"
                          data-wave-loader="Creando cuenta..."
                          role="status"
                          aria-live="polite"></span>
                </button>

                <p class="switch-link">
                    ¿Ya tienes una cuenta?
                    <a href="/Simulador-Acu-tico-main/views/login.php">Inicia Sesión</a>
                </p>
            </form>

        </div>
    </div>
</div>

<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<canvas id="particles"></canvas>

<script src="/Simulador-Acu-tico-main/public/js/burbujas.js" defer></script>
<script src="/Simulador-Acu-tico-main/public/js/registro.js" defer></script>
<script type="module" src="/Simulador-Acu-tico-main/public/build/auth-loaders/auth-loaders.js"></script>

</body>
</html>
