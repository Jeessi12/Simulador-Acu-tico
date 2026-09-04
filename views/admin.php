<?php
session_start();
require_once __DIR__ . '/../app/support/AuthRedirect.php';

// Constantes de roles
if (!defined('ROL_ESTUDIANTE')) define('ROL_ESTUDIANTE', 1);
if (!defined('ROL_DOCENTE'))    define('ROL_DOCENTE', 2);
if (!defined('ROL_PERSONAL'))   define('ROL_PERSONAL', 3);
if (!defined('ROL_ADMIN'))      define('ROL_ADMIN', 4);

require_once __DIR__ . '/../app/models/Conexion.php';
$conexion = new Conexion();
$conn = $conexion->getConnection();

AuthRedirect::requireAuthentication();

// Verificar acceso solo para administradores
if ($_SESSION['rol'] != ROL_ADMIN) {
    header("Location: login.php?error=locked");
    exit();
}

$id_admin = $_SESSION['id'];
$mensaje = '';
$error = '';

// ---------- 1. Función para registrar logs ----------
function registrarLog($conn, $usuario_id, $usuario_nombre, $accion, $detalles = '') {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $stmt = $conn->prepare("INSERT INTO logs (usuario_id, usuario_nombre, accion, detalles, ip) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $usuario_id, $usuario_nombre, $accion, $detalles, $ip);
    $stmt->execute();
}

// ---------- 2. Gestión de roles / eliminación de usuarios ----------
if (isset($_POST['cambiar_rol']) && isset($_POST['usuario_id']) && isset($_POST['nuevo_rol'])) {
    $id_usuario = intval($_POST['usuario_id']);
    $nuevo_rol  = intval($_POST['nuevo_rol']);
    $roles_permitidos = [1,2,3,4];
    if (in_array($nuevo_rol, $roles_permitidos)) {
        mysqli_query($conn, "UPDATE usuarios SET rol_id = $nuevo_rol WHERE id = $id_usuario");
        $mensaje = 'Rol actualizado correctamente.';
        registrarLog($conn, $id_admin, $_SESSION['usuario'], "Cambió rol del usuario ID $id_usuario a $nuevo_rol");
    } else {
        $error = 'Rol no válido.';
    }
}

if (isset($_POST['eliminar']) && isset($_POST['usuario_id'])) {
    $id_usuario = intval($_POST['usuario_id']);
    if ($id_usuario == $id_admin) {
        $error = 'No puedes eliminarte a ti mismo.';
    } else {
        mysqli_query($conn, "DELETE FROM usuarios WHERE id = $id_usuario");
        $mensaje = 'Usuario eliminado correctamente.';
        registrarLog($conn, $id_admin, $_SESSION['usuario'], "Eliminó usuario ID $id_usuario");
    }
}

// ---------- 3. Reporte CSV ----------
if (isset($_GET['exportar_csv'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="usuarios_blueecosim.csv"');
    $output = fopen('php://output', 'w');
    fputcsv($output, array('ID', 'Usuario', 'Email', 'Rol', 'Estado', 'Fecha Registro', 'Última Actividad'));
    $csv_query = mysqli_query($conn, "SELECT u.id, u.username, u.email, r.rol, u.estado, u.fecha_registro, u.ultima_actividad FROM usuarios u JOIN roles r ON u.rol_id = r.id ORDER BY u.id");
    while ($row = mysqli_fetch_assoc($csv_query)) {
        fputcsv($output, $row);
    }
    fclose($output);
    exit();
}

// ---------- 4. Configuración del sistema ----------
if (isset($_POST['guardar_config'])) {
    $limite = max(1, min(200, intval($_POST['limite_estudiantes'] ?? 30)));
    $tiempo = max(0, intval($_POST['tiempo_simulacion'] ?? 0));
    $registro = isset($_POST['registro_abierto']) ? 1 : 0;
    $favicon = trim($_POST['favicon_url'] ?? '');

    $settings = [
        'limite_estudiantes_espacio' => (string) $limite,
        'tiempo_simulacion_maximo' => (string) $tiempo,
        'registro_abierto' => (string) $registro,
        'favicon_url' => $favicon,
    ];
    $configStatement = mysqli_prepare(
        $conn,
        'INSERT INTO config (clave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = VALUES(valor)'
    );
    if ($configStatement) {
        foreach ($settings as $settingKey => $settingValue) {
            mysqli_stmt_bind_param($configStatement, 'ss', $settingKey, $settingValue);
            mysqli_stmt_execute($configStatement);
        }
        mysqli_stmt_close($configStatement);
        $mensaje = "Configuración actualizada.";
        registrarLog($conn, $id_admin, $_SESSION['usuario'], "Actualizó configuración del sistema");
    } else {
        $error = 'No fue posible guardar la configuración.';
    }
}

// ---------- 5. Obtener datos para estadísticas ----------
// Usuarios registrados por mes (últimos 6 meses)
$meses = [];
$usuariosPorMes = [];
for ($i = 5; $i >= 0; $i--) {
    $fecha = date('Y-m', strtotime("-$i months"));
    $meses[] = date('M Y', strtotime("-$i months"));
    $result = mysqli_query($conn, "SELECT COUNT(*) AS total FROM usuarios WHERE DATE_FORMAT(fecha_registro, '%Y-%m') = '$fecha'");
    $row = mysqli_fetch_assoc($result);
    $usuariosPorMes[] = $row['total'] ?? 0;
}

// Estadísticas de asignaciones
$stats = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total_asignaciones, SUM(CASE WHEN estado='completada' THEN 1 ELSE 0 END) AS completadas FROM asignaciones"));
$porcentaje_completadas = ($stats['total_asignaciones'] > 0) ? round(($stats['completadas'] / $stats['total_asignaciones']) * 100) : 0;

// Total de espacios y estudiantes únicos en espacios
$total_espacios = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total FROM espacios"))['total'];
$total_estudiantes_espacios = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(DISTINCT id_estudiante) AS total FROM espacio_estudiantes WHERE estado='aceptado'"))['total'];

// Logs (últimos 50)
$logs = mysqli_query($conn, "SELECT * FROM logs ORDER BY fecha DESC LIMIT 50");

// Lista de usuarios completa (para la pestaña Usuarios)
$usuarios_todos = mysqli_query($conn, "SELECT u.id, u.username, u.email, r.rol, u.estado, u.fecha_registro, u.ultima_actividad FROM usuarios u JOIN roles r ON u.rol_id = r.id ORDER BY u.id");

// Obtener configuración actual
$config = [];
$res_config = mysqli_query($conn, "SELECT clave, valor FROM config");
while ($row = mysqli_fetch_assoc($res_config)) {
    $config[$row['clave']] = $row['valor'];
}
$config += [
    'limite_estudiantes_espacio' => '30',
    'tiempo_simulacion_maximo' => '0',
    'registro_abierto' => '1',
    'favicon_url' => '/Simulador-Acu-tico-main/public/media/Web/logo.png',
];

// Obtener pestaña activa (por GET)
$tabsPermitidas = ['dashboard', 'usuarios', 'logs', 'config'];
$tabSolicitada = $_GET['tab'] ?? 'dashboard';
$tab_activa = in_array($tabSolicitada, $tabsPermitidas, true) ? $tabSolicitada : 'dashboard';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración · Blue EcoSim</title>
    <link rel="icon" href="<?php echo htmlspecialchars($config['favicon_url'], ENT_QUOTES, 'UTF-8'); ?>" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/admin.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="admin-page">
    <?php include 'fragments/navbar.php'; ?>
    <canvas id="particles" data-particle-count="160" aria-hidden="true"></canvas>

    <main class="admin-container">
        <div class="admin-header">
            <div class="admin-header-content">
                <h1><i class="fas fa-shield-alt"></i> Panel de Administración</h1>
                <p>Gestiona completamente la plataforma Blue EcoSim</p>
            </div>
        </div>

        <?php if ($mensaje): ?>
            <div class="alert alert-success"><i class="fas fa-check-circle"></i> <?php echo $mensaje; ?></div>
        <?php elseif ($error): ?>
            <div class="alert alert-error"><i class="fas fa-exclamation-triangle"></i> <?php echo $error; ?></div>
        <?php endif; ?>

        <!-- Pestañas de navegación -->
        <div class="admin-tabs">
            <a href="?tab=dashboard" class="admin-tab <?php echo $tab_activa == 'dashboard' ? 'active' : ''; ?>"><i class="fas fa-chart-line"></i> Dashboard</a>
            <a href="?tab=usuarios" class="admin-tab <?php echo $tab_activa == 'usuarios' ? 'active' : ''; ?>"><i class="fas fa-users"></i> Usuarios</a>
            <a href="?tab=logs" class="admin-tab <?php echo $tab_activa == 'logs' ? 'active' : ''; ?>"><i class="fas fa-history"></i> Logs</a>
            <a href="?tab=config" class="admin-tab <?php echo $tab_activa == 'config' ? 'active' : ''; ?>"><i class="fas fa-cogs"></i> Configuración</a>
        </div>

        <!-- ======================== DASHBOARD ======================== -->
        <?php if ($tab_activa == 'dashboard'): ?>
        <div class="admin-stats">
            <div class="stat-card"><i class="fas fa-users"></i><div class="stat-info"><span class="stat-number"><?php echo mysqli_num_rows($usuarios_todos); ?></span><span class="stat-label">Usuarios</span></div></div>
            <div class="stat-card"><i class="fas fa-chalkboard"></i><div class="stat-info"><span class="stat-number"><?php echo $total_espacios; ?></span><span class="stat-label">Espacios</span></div></div>
            <div class="stat-card"><i class="fas fa-tasks"></i><div class="stat-info"><span class="stat-number"><?php echo $stats['total_asignaciones']; ?></span><span class="stat-label">Asignaciones</span></div></div>
            <div class="stat-card"><i class="fas fa-check-circle"></i><div class="stat-info"><span class="stat-number"><?php echo $porcentaje_completadas; ?>%</span><span class="stat-label">Completadas</span></div></div>
        </div>

        <div class="admin-card">
            <div class="admin-card-header"><h2><i class="fas fa-chart-line"></i> Usuarios registrados (últimos 6 meses)</h2></div>
            <div class="admin-card-body"><canvas id="userChart" style="max-height: 300px; width:100%"></canvas></div>
        </div>
        <script>
            new Chart(document.getElementById('userChart'), {
                type: 'line',
                data: { labels: <?php echo json_encode($meses); ?>, datasets: [{ label: 'Nuevos usuarios', data: <?php echo json_encode($usuariosPorMes); ?>, borderColor: '#2d9cdb', backgroundColor: 'rgba(45,156,219,0.1)', tension: 0.3, fill: true }] }
            });
        </script>

        <div class="admin-grid-2">
            <div class="admin-card"><div class="admin-card-header"><h2><i class="fas fa-chalkboard-user"></i> Actividad reciente</h2></div><div class="admin-card-body"><ul class="recent-list"><?php
                $actividad = mysqli_query($conn, "SELECT usuario_nombre, accion, fecha FROM logs ORDER BY fecha DESC LIMIT 10");
                while($a = mysqli_fetch_assoc($actividad)): ?>
                    <li><i class="fas fa-circle" style="font-size: 8px; color: #2d9cdb;"></i> <strong><?php echo htmlspecialchars($a['usuario_nombre']); ?></strong> - <?php echo htmlspecialchars($a['accion']); ?> <span class="date"><?php echo date('d/m/Y H:i', strtotime($a['fecha'])); ?></span></li>
                <?php endwhile; ?>
            </ul></div></div>
            <div class="admin-card"><div class="admin-card-header"><h2><i class="fas fa-download"></i> Reportes</h2></div><div class="admin-card-body"><p>Exporta la base de datos de usuarios en formato CSV.</p><a href="?exportar_csv=1" class="btn-mini" style="display: inline-block; margin-top: 10px;"><i class="fas fa-file-csv"></i> Exportar usuarios</a></div></div>
        </div>
        <?php endif; ?>

        <!-- ======================== USUARIOS ======================== -->
        <?php if ($tab_activa == 'usuarios'): ?>
        <div class="admin-card">
            <div class="admin-card-header">
                <h2><i class="fas fa-user-edit"></i> Listado de Usuarios</h2>
                <span class="badge"><?php echo mysqli_num_rows($usuarios_todos); ?> registros</span>
            </div>
            <div class="admin-card-body">
                <div class="table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Última actividad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while($u = mysqli_fetch_assoc($usuarios_todos)): ?>
                            <tr>
                                <td class="user-cell">
                                    <div class="user-avatar-mini"><?php echo strtoupper(substr($u['username'],0,1)); ?></div>
                                    <?php echo htmlspecialchars($u['username']); ?>
                                </td>
                                <td><?php echo htmlspecialchars($u['email']); ?></td>
                                <td>
                                    <?php
                                    // Icono según el rol
                                    $icono_rol = '';
                                    switch(strtolower($u['rol'])) {
                                        case 'admin':
                                            $icono_rol = '<i class="fas fa-crown"></i> ';
                                            break;
                                        case 'estudiante':
                                            $icono_rol = '<i class="fas fa-graduation-cap"></i> ';
                                            break;
                                        case 'docente':
                                            $icono_rol = '<i class="fas fa-chalkboard-user"></i> ';
                                            break;
                                        default:
                                            $icono_rol = '<i class="fas fa-user"></i> ';
                                    }
                                    ?>
                                    <span class="role-badge role-<?php echo strtolower($u['rol']); ?>">
                                        <?php echo $icono_rol . $u['rol']; ?>
                                    </span>
                                </td>
                                <td><?php echo $u['estado']; ?></td>
                                <td><?php echo $u['ultima_actividad'] ? date('d/m/Y H:i', strtotime($u['ultima_actividad'])) : 'Nunca'; ?></td>
                                <td class="actions-cell">
                                    <form method="post" class="inline-form">
                                        <input type="hidden" name="usuario_id" value="<?php echo $u['id']; ?>">
                                        <select name="nuevo_rol" class="select-small">
                                            <?php 
                                            $roles_opts = mysqli_query($conn, "SELECT id, rol FROM roles"); 
                                            while($r = mysqli_fetch_assoc($roles_opts)): ?>
                                            <option value="<?php echo $r['id']; ?>" <?php echo $r['rol']==$u['rol']?'selected':''; ?>>
                                                <?php echo $r['rol']; ?>
                                            </option>
                                            <?php endwhile; ?>
                                        </select>
                                        <button type="submit" name="cambiar_rol" class="btn-mini">Cambiar</button>
                                    </form>
                                    <form method="post" class="inline-form" onsubmit="return confirm('¿Eliminar usuario permanentemente?')">
                                        <input type="hidden" name="usuario_id" value="<?php echo $u['id']; ?>">
                                        <button type="submit" name="eliminar" class="btn-mini btn-mini-danger">Eliminar</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <!-- ======================== LOGS ======================== -->
        <?php if ($tab_activa == 'logs'): ?>
        <div class="admin-card">
            <div class="admin-card-header"><h2><i class="fas fa-history"></i> Registro de actividad (logs)</h2></div>
            <div class="admin-card-body">
                <div class="table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalles</th><th>IP</th></tr>
                        </thead>
                        <tbody>
                            <?php while($log = mysqli_fetch_assoc($logs)): ?>
                            <tr>
                                <td><?php echo date('d/m/Y H:i:s', strtotime($log['fecha'])); ?></td>
                                <td><?php echo htmlspecialchars($log['usuario_nombre']); ?></td>
                                <td><?php echo htmlspecialchars($log['accion']); ?></td>
                                <td><?php echo htmlspecialchars($log['detalles']); ?></td>
                                <td><?php echo $log['ip']; ?></td>
                            </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <!-- ======================== CONFIGURACIÓN ======================== -->
        <?php if ($tab_activa == 'config'): ?>
        <div class="admin-card">
            <div class="admin-card-header"><h2><i class="fas fa-sliders-h"></i> Configuración del sistema</h2></div>
            <div class="admin-card-body">
                <form method="post" class="config-panel">
                    <div class="config-group">
                        <label>Límite de estudiantes por espacio:</label>
                        <input type="number" name="limite_estudiantes" value="<?php echo intval($config['limite_estudiantes_espacio']); ?>" min="1" max="200" required>
                    </div>
                    <div class="config-group">
                        <label>Tiempo máximo de simulación (segundos, 0 = ilimitado):</label>
                        <input type="number" name="tiempo_simulacion" value="<?php echo max(0, intval($config['tiempo_simulacion_maximo'])); ?>" min="0" required>
                    </div>
                    <div class="config-group">
                        <label class="config-checkbox"><input type="checkbox" name="registro_abierto" value="1" <?php echo $config['registro_abierto'] == '1' ? 'checked' : ''; ?>> <span>Permitir registro de nuevos usuarios</span></label>
                    </div>
                    <div class="config-group">
                        <label>URL del favicon:</label>
                        <input type="text" name="favicon_url" value="<?php echo htmlspecialchars($config['favicon_url'], ENT_QUOTES, 'UTF-8'); ?>">
                    </div>
                    <button type="submit" name="guardar_config" class="btn-guardar-config"><i class="fas fa-save"></i> Guardar configuración</button>
                </form>
            </div>
        </div>
        <?php endif; ?>
    </main>

    <?php include 'fragments/footer.php'; ?>
    <script src="../public/js/burbujas.js" defer></script>
    <script src="../public/js/admin.js" defer></script>
</body>
</html>
