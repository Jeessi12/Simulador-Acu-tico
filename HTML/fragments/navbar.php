<nav class="navbar">
    <div class="nav-left">
        <img src="../MEDIA/Web/logo.png" class="logo" alt="BlueEcoSim logo">
        <div class="nav-links">
            <a href="index.php">INICIO</a>
            <a href="simulador.php">SIMULACION</a>
            <a href="especies.php">ESPECIES</a>
            <a href="asignaciones.php">ASIGNACIONES</a>
        </div>
    </div>

   <div class="nav-right" id="navRight">
         <?php 
                if (isset($_SESSION['usuario'])): ?>
                <div class="user-buttons" id="userButtons">
                    <a href="perfilUsuario.php" class="user-name" id="userNameDisplay" style="text-decoration: none;">👤 <?php echo $_SESSION['usuario']?> </a>
                    <a href="../PHP/logout.php" class="btn btn-secondary" style="text-decoration: none;">Cerrar Sesión</a>
                </div>
            <?php else: ?>
                <div class="auth-buttons" id="authButtons">
                    <a href="login.php" class="btn btn-primary" style="text-decoration: none;">Iniciar Sesión</a>
                    <a href="registro.php" class="btn btn-secondary" style="text-decoration: none;">Registrate</a>
                </div>
            <?php endif; ?>
    </div>
</nav>