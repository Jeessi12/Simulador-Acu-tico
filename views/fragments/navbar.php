<?php
if (!defined('ROL_ESTUDIANTE')) {
    define('ROL_ESTUDIANTE', 1);
    define('ROL_DOCENTE',    2);
    define('ROL_PERSONAL',   3);
    define('ROL_ADMIN',      4);
}
?>

<nav class="navbar">
    <div class="nav-left">
        <img src="../public/media/Web/logo.png" class="logo" alt="BlueEcoSim logo">

        <div class="nav-links">
            <a href="index.php">INICIO</a>
            <a href="simulador.php">SIMULACION</a>
            <a href="especies.php">ESPECIES</a>

            <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] == ROL_ESTUDIANTE): ?>
                <a href="asignaciones.php">ASIGNACIONES</a>
            <?php endif; ?>

            <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] == ROL_DOCENTE): ?>
                <a href="espacios.php">ESPACIOS</a>
            <?php endif; ?>

            <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] == ROL_ADMIN): ?>
                <a href="admin.php">ADMINISTRAR</a>
            <?php endif; ?>
        </div>
    </div>

    <div class="nav-right" id="navRight">
        <?php if (isset($_SESSION['usuario'])): ?>
            <div class="user-actions" id="userActions">
                <button type="button" class="icon-btn" id="darkModeBtn" title="Modo oscuro">
                    <i class="fa-solid fa-moon"></i>
                </button>

                <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] == ROL_ESTUDIANTE): ?>
                    <a href="notificaciones.php" class="icon-btn" title="Notificaciones">
                        <i class="fa-solid fa-bell"></i>
                    </a>
                <?php endif; ?>

                <button type="button" class="icon-btn" id="langBtn" title="Cambio de idioma">
                    <i class="fa-solid fa-language"></i>
                </button>

                <a href="/Simulador-Acu-tico-main/views/perfilUsuario.php" class="user-avatar"
                   title="Perfil de <?php echo htmlspecialchars($_SESSION['usuario']); ?>">
                    <img src="/Simulador-Acu-tico-main/public/media/Web/icon.jpeg" alt="Avatar de perfil">
                </a>

                <a href="/Simulador-Acu-tico-main/app/controllers/LogoutController.php" class="btn btn-secondary logout-btn">
                    Cerrar Sesión
                </a>
            </div>
        <?php else: ?>
            <div class="auth-buttons" id="authButtons">
                <a href="/Simulador-Acu-tico-main/views/login.php" class="btn btn-primary" style="text-decoration: none;">
                    Iniciar Sesión
                </a>

                <a href="/Simulador-Acu-tico-main/views/registro.php" class="btn btn-secondary" style="text-decoration: none;">
                    Registrate
                </a>
            </div>
        <?php endif; ?>
    </div>
</nav>