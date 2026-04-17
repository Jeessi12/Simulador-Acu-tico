<?php 
    include("../PHP/conexion.php");

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

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
    <title>Registro | BlueEcoSims</title>
    <link rel="icon" href="/MEDIA/Web/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="../CSS/navbar-footer.css">
    <link rel="stylesheet" href="../CSS/registro.css">
</head>

<body>


    <div id="navbar-container"><?php include("fragments/navbar.php"); ?></div>
    <div class="spacer"></div>


    <div class="container" id="container">
        <div class="form-wrapper register-wrapper" id="registerWrapper">
            <div class="form-container">

                <h1 class="form-title">Comienza tu inmersión</h1>
                

                <form class="register-form" action="../PHP/registro.php" method="post">

                    <div class="campo">
                        <label for="reg-email">Email</label>
                        <input type="email" id="reg-email" name="email" placeholder="Ingrese su correo electrónico" required>
                        <div class="linea"></div>
                    </div>

                    <div class="campo">
                        <label for="reg-username">Nombre de usuario</label>
                        <input type="text" id="reg-username" name="username" placeholder="Ingrese su nombre de usuario" required>
                        <div class="linea"></div>
                    </div>

                    <div class="campo">
                        <label for="reg-password">Contraseña</label>
                        <input type="password" id="reg-password" name="password" placeholder="Ingrese su contraseña" required>
                        <div class="linea"></div>
                    </div>

                    <div class="campo">
                        <label for="reg-confirm">Confirmar contraseña</label>
                        <input type="password" id="reg-confirm" name="confirm" placeholder="Confirme su contraseña" required>
                        <div class="linea"></div>
                    </div>
                    
                    <p>
                        ¿Cómo quieres registrarte? 
                    </p>
                    <button type="submit" name="rol" class="btn-submit" value="1">Cuenta de Estudiante</button>
                    <button type="submit" name="rol" class="btn-submit" value="2">Cuenta de Docente</button>
                    <button type="submit" name="rol" class="btn-submit" value="3">Cuenta Personal</button>

                    <p class="switch-link">
                        ¿Ya tienes una cuenta? 
                        <a href="login.php">Inicia Sesión</a>
                    </p>

                </form>
                
            </div>
        </div>
    </div>
    <?php
        if (isset($_GET['error'])) {
            if ($_GET['error'] == 'duplicado') {
                echo "<div class='error'>ERROR: Ya hay un usuario registrado con esos datos...</div>";
            }
        }
    ?>
    <div id="footer-container"><?php include("fragments/footer.php"); ?></div>

    <canvas id="particles"></canvas>
    <script src="../JS/burbujas.js" defer></script>

</body>
</html>