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
    <title>Registro | BlueEcoSim</title>

    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/registro.css">
</head>

<body>

<div id="navbar-container">
    <?php include(__DIR__ . "/fragments/navbar.php"); ?>
</div>

<div class="spacer"></div>

<div class="container" id="container">
    <div class="form-wrapper register-wrapper" id="registerWrapper">
        <div class="form-container">

            <h1 class="form-title">Comienza tu inmersión</h1>

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

                <p>
                    Completa tus datos y selecciona el tipo de cuenta en el siguiente paso.
                </p>

                <input type="hidden" name="rol" id="roleInput" value="">

                <button type="button" id="open-role-modal" class="btn-submit">
                    Registrar
                </button>

                <p class="switch-link">
                    ¿Ya tienes una cuenta?
                    <a href="/Simulador-Acu-tico-main/views/login.php">
                        Inicia Sesión
                    </a>
                </p>
            </form>

            <div class="modal-overlay" id="role-modal" aria-hidden="true">
                <div class="modal-card">
                    <button type="button" class="close-modal" id="close-role-modal">
                        &times;
                    </button>

                    <h2>Elige tu tipo de cuenta</h2>
                    <p>Selecciona una opción para completar el registro.</p>

                    <div class="role-card-grid">
                        <button type="button" class="role-card" data-role="1">
                            Cuenta de Estudiante
                        </button>
                        <button type="button" class="role-card" data-role="2">
                            Cuenta de Docente
                        </button>
                        <button type="button" class="role-card" data-role="3">
                            Cuenta Personal
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<canvas id="particles"></canvas>

<script src="/Simulador-Acu-tico-main/public/js/burbujas.js" defer></script>
<script src="/Simulador-Acu-tico-main/public/js/registro.js" defer></script>

</body>
</html>