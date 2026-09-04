<?php
if (!defined('ROL_ESTUDIANTE')) {
    define('ROL_ESTUDIANTE', 1);
    define('ROL_DOCENTE',    2);
    define('ROL_PERSONAL',   3);
    define('ROL_ADMIN',      4);
}


if (!function_exists('getRoleAvatarSrc')) {
    function getRoleAvatarSrc(?int $rol): string {
        switch ($rol) {
            case ROL_ESTUDIANTE:
                return '/Simulador-Acu-tico-main/public/media/Web/estudiante.png';
            case ROL_DOCENTE:
                return '/Simulador-Acu-tico-main/public/media/Web/docente.png';
            case ROL_PERSONAL:
                return '/Simulador-Acu-tico-main/public/media/Web/usuario.png';
            default:
                return '/Simulador-Acu-tico-main/public/media/Web/icon.jpeg';
        }
    }
}
?>

<script>
    (function () {
        const savedTheme = localStorage.getItem('blueEcoThemeManual');
        const useDark = savedTheme === 'dark';

        document.documentElement.classList.toggle('dark-mode', useDark);
        document.documentElement.dataset.theme = useDark ? 'dark' : 'light';

        if (document.body) {
            document.body.classList.toggle('dark-mode', useDark);
        }

        if (!/\/(?:index\.php)?(?:[?#].*)?$/.test(window.location.pathname)) {
            document.documentElement.classList.add('non-index-page');
        }

        const pageName = (window.location.pathname.split('/').pop() || '').replace('.php', '');
        if (pageName) {
            document.documentElement.classList.add('page-' + pageName);
        }
    })();
</script>
<link rel="stylesheet" href="/Simulador-Acu-tico-main/public/css/dark-mode.css?v=20260624">
<link rel="stylesheet" href="/Simulador-Acu-tico-main/public/css/section-polish.css?v=20260624-6">

<nav class="navbar">
    <div class="nav-left">
        <img src="../public/media/Web/logo.png" class="logo" alt="BlueEcoSim logo">

        <div class="nav-links">
            <a href="index.php">INICIO</a>
            <a href="simuladores.php"<?php if (!isset($_SESSION['usuario'])): ?> data-requires-auth="true" data-auth-feature="las simulaciones"<?php endif; ?>>SIMULACION</a>
            <a href="especies.php"<?php if (!isset($_SESSION['usuario'])): ?> data-requires-auth="true" data-auth-feature="el catálogo de especies"<?php endif; ?>>ESPECIES</a>
            <a href="recursos.php">RECURSOS</a>
            <a href="mapa.php">MAPA</a>

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
        <button type="button" class="icon-btn theme-toggle" id="darkModeBtn" title="Activar modo oscuro" aria-label="Activar modo oscuro" aria-pressed="false">
            <i class="fa-solid fa-moon"></i>
        </button>

        <button type="button" class="icon-btn" id="langBtn" title="Cambiar idioma" aria-label="Cambiar idioma" aria-pressed="false">
            <i class="fa-solid fa-language"></i>
        </button>

        <?php if (isset($_SESSION['usuario'])): ?>
            <div class="user-actions" id="userActions">
                <a href="/Simulador-Acu-tico-main/views/perfilUsuario.php" class="user-avatar"
                   title="Perfil de <?php echo htmlspecialchars($_SESSION['usuario']); ?>">
                    <img src="<?php echo htmlspecialchars(getRoleAvatarSrc($_SESSION['rol'] ?? null)); ?>" alt="Avatar de perfil">
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

<?php if (!isset($_SESSION['usuario'])): ?>
    <div class="auth-gate" id="authGate" hidden aria-hidden="true">
        <div class="auth-gate__backdrop" data-auth-modal-close></div>

        <section
            class="auth-gate__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="authGateTitle"
            aria-describedby="authGateDescription"
            tabindex="-1"
        >
            <button
                type="button"
                class="auth-gate__close"
                data-auth-modal-close
                aria-label="Cerrar ventana"
                title="Cerrar"
            >
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>

            <div class="auth-gate__visual" aria-hidden="true">
                <span class="auth-gate__bubble auth-gate__bubble--one"></span>
                <span class="auth-gate__bubble auth-gate__bubble--two"></span>
                <span class="auth-gate__bubble auth-gate__bubble--three"></span>
                <div class="auth-gate__logo-wrap">
                    <img src="/Simulador-Acu-tico-main/public/media/Web/logo.png" alt="">
                </div>
            </div>

            <div class="auth-gate__content">
                <span class="auth-gate__eyebrow">
                    <i class="fa-solid fa-lock" aria-hidden="true"></i>
                    Acceso protegido
                </span>
                <h2 id="authGateTitle">Continúa tu experiencia en BlueEcoSim</h2>
                <p id="authGateDescription">
                    Para continuar con <strong data-auth-feature-label>este apartado</strong>, necesitas iniciar sesión o crear una cuenta.
                </p>

                <div class="auth-gate__actions">
                    <a class="auth-gate__action auth-gate__action--primary" href="/Simulador-Acu-tico-main/views/login.php">
                        Iniciar sesión
                        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </a>
                    <a class="auth-gate__action auth-gate__action--secondary" href="/Simulador-Acu-tico-main/views/registro.php">
                        Registrarse
                    </a>
                </div>
            </div>
        </section>
    </div>

    <script src="/Simulador-Acu-tico-main/public/js/auth-modal.js?v=20260803" defer></script>
<?php endif; ?>

<script src="/Simulador-Acu-tico-main/public/js/theme-toggle.js" defer></script>
<script src="/Simulador-Acu-tico-main/public/js/translator.js" defer></script>
