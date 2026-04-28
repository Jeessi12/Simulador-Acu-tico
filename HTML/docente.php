<?php
session_start();
include '../PHP/conexion.php';

if (!isset($_SESSION['usuario']) || $_SESSION['rol'] != ROL_DOCENTE) {
    header("Location: login.php?error=locked");
    exit();
}

$id_docente = $_SESSION['id'];
$mensaje    = '';
$error      = '';

$estudiantes = mysqli_query($conn,
    "SELECT id, username, email FROM usuarios WHERE rol_id = " . ROL_ESTUDIANTE . " ORDER BY username"
);
$simulaciones = mysqli_query($conn,
    "SELECT id, nombre, descripcion FROM simulaciones ORDER BY nombre"
);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['asignar'])) {
    $id_simulacion = intval($_POST['simulacion']);
    $seleccionados = $_POST['estudiantes'] ?? [];

    if (empty($seleccionados)) {
        $error = 'Selecciona al menos un estudiante.';
    } elseif ($id_simulacion <= 0) {
        $error = 'Elige una simulación.';
    } else {
        $sim_nombre = '';
        $sim_query = mysqli_query($conn, "SELECT nombre FROM simulaciones WHERE id = $id_simulacion");
        if ($sim_row = mysqli_fetch_assoc($sim_query)) {
            $sim_nombre = $sim_row['nombre'];
        }

        $stmt_a = mysqli_prepare($conn,
            "INSERT INTO asignaciones (id_docente, id_estudiante, id_simulacion) VALUES (?, ?, ?)"
        );
        $stmt_n = mysqli_prepare($conn,
            "INSERT INTO notificaciones (id_usuario, mensaje) VALUES (?, ?)"
        );

        foreach ($seleccionados as $id_est) {
            $id_est = intval($id_est);
            mysqli_stmt_bind_param($stmt_a, "iii", $id_docente, $id_est, $id_simulacion);
            mysqli_stmt_execute($stmt_a);

            $mensaje_noti = "Nueva simulación asignada: " . $sim_nombre;
            mysqli_stmt_bind_param($stmt_n, "is", $id_est, $mensaje_noti);
            mysqli_stmt_execute($stmt_n);
        }

        mysqli_stmt_close($stmt_a);
        mysqli_stmt_close($stmt_n);
        $mensaje = 'Asignación guardada correctamente.';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asignar Simulación · Blue EcoSim</title>
    <link rel="stylesheet" href="../CSS/navbar-footer.css">
    <link rel="stylesheet" href="../CSS/docente.css">
</head>
<body>
    <canvas id="particles"></canvas>
    <?php include 'fragments/navbar.php'; ?>

    <main class="contenedor-docente">
        <h1>📋 Asignar simulaciones</h1>
        <p class="subtitulo">Elige una simulación y los estudiantes que la recibirán</p>

        <?php if ($mensaje): ?>
            <div class="alerta exito"><?php echo $mensaje; ?></div>
        <?php elseif ($error): ?>
            <div class="alerta error"><?php echo $error; ?></div>
        <?php endif; ?>

        <form method="POST" id="form-asignar">
            <div class="campo">
                <label for="simulacion">🌊 Simulación:</label>
                <select name="simulacion" id="simulacion" required>
                    <option value="">-- Selecciona --</option>
                    <?php while ($sim = mysqli_fetch_assoc($simulaciones)): ?>
                        <option value="<?php echo $sim['id']; ?>">
                            <?php echo htmlspecialchars($sim['nombre'] . ' – ' . $sim['descripcion']); ?>
                        </option>
                    <?php endwhile; ?>
                </select>
            </div>

            <div class="campo">
                <label>🐠 Estudiantes registrados:</label>
                <div class="lista-estudiantes" id="lista-estudiantes">
                    <?php if (mysqli_num_rows($estudiantes) > 0): ?>
                        <?php while ($est = mysqli_fetch_assoc($estudiantes)): ?>
                            <label>
                                <input type="checkbox" name="estudiantes[]" value="<?php echo $est['id']; ?>">
                                <?php echo htmlspecialchars($est['username'] . ' (' . $est['email'] . ')'); ?>
                            </label>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <p class="sin-estudiantes">No hay estudiantes registrados.</p>
                    <?php endif; ?>
                </div>
                <div class="info-ayuda">💡 Marca varios estudiantes a la vez.</div>
            </div>

            <button type="submit" name="asignar" class="boton-asignar">✅ Asignar simulación</button>
        </form>
    </main>

    <?php include 'fragments/footer.php'; ?>
    <script src="../JS/burbujas.js"></script>
    <script src="../JS/docente.js"></script>
</body>
</html>