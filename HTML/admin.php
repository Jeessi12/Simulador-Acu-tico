<?php
session_start();
include '../PHP/conexion.php';

if (!isset($_SESSION['usuario']) || $_SESSION['rol'] != ROL_ADMIN) {
    header("Location: login.php?error=locked");
    exit();
}

$mensaje = '';

// Cambiar rol
if (isset($_POST['cambiar_rol']) && isset($_POST['usuario_id']) && isset($_POST['nuevo_rol'])) {
    $id_usuario = intval($_POST['usuario_id']);
    $nuevo_rol  = intval($_POST['nuevo_rol']);
    $roles_permitidos = [1,2,3,4];
    if (in_array($nuevo_rol, $roles_permitidos)) {
        mysqli_query($conn, "UPDATE usuarios SET rol_id = $nuevo_rol WHERE id = $id_usuario");
        $mensaje = 'Rol actualizado.';
    }
}

// Eliminar usuario
if (isset($_POST['eliminar']) && isset($_POST['usuario_id'])) {
    $id_usuario = intval($_POST['usuario_id']);
    mysqli_query($conn, "DELETE FROM usuarios WHERE id = $id_usuario");
    $mensaje = 'Usuario eliminado.';
}

$usuarios = mysqli_query($conn,
    "SELECT u.id, u.username, u.email, r.rol
     FROM usuarios u
     JOIN roles r ON u.rol_id = r.id
     ORDER BY r.rol, u.username"
);

$roles = mysqli_query($conn, "SELECT * FROM roles");
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración · Blue EcoSim</title>
    <link rel="stylesheet" href="../CSS/navbar-footer.css">
    <link rel="stylesheet" href="../CSS/admin.css">
</head>
<body>
    <?php include 'fragments/navbar.php'; ?>

    <main class="contenedor-admin">
        <h1>⚙️ Administración de Usuarios</h1>
        <?php if ($mensaje): ?>
            <div class="alerta exito"><?php echo $mensaje; ?></div>
        <?php endif; ?>

        <table class="tabla-usuarios">
            <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol actual</th>
                    <th>Cambiar rol</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($u = mysqli_fetch_assoc($usuarios)): ?>
                <tr>
                    <td><?php echo htmlspecialchars($u['username']); ?></td>
                    <td><?php echo htmlspecialchars($u['email']); ?></td>
                    <td><?php echo $u['rol']; ?></td>
                    <td>
                        <form method="post" class="form-cambiar">
                            <input type="hidden" name="usuario_id" value="<?php echo $u['id']; ?>">
                            <select name="nuevo_rol">
                                <?php
                                mysqli_data_seek($roles, 0);
                                while ($r = mysqli_fetch_assoc($roles)):
                                ?>
                                    <option value="<?php echo $r['id']; ?>" <?php echo $r['rol'] == $u['rol'] ? 'selected' : ''; ?>>
                                        <?php echo $r['rol']; ?>
                                    </option>
                                <?php endwhile; ?>
                            </select>
                            <button type="submit" name="cambiar_rol" class="btn-cambiar">Cambiar</button>
                        </form>
                    </td>
                    <td>
                        <form method="post" onsubmit="return confirm('¿Eliminar a <?php echo addslashes($u['username']); ?>?');">
                            <input type="hidden" name="usuario_id" value="<?php echo $u['id']; ?>">
                            <button type="submit" name="eliminar" class="btn-eliminar">🗑️ Eliminar</button>
                        </form>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </main>

    <?php include 'fragments/footer.php'; ?>
</body>
</html>