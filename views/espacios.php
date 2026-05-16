<?php
session_start();

// Definir constantes de roles ANTES de usarlas
if (!defined('ROL_ESTUDIANTE')) {
    define('ROL_ESTUDIANTE', 1);
    define('ROL_DOCENTE', 2);
    define('ROL_PERSONAL', 3);
    define('ROL_ADMIN', 4);
}

// Ajustar ruta del conexion.php (desde views/ hacia la raíz)
$ruta_conexion = __DIR__ . '/../app/models/Conexion.php';
if (!file_exists($ruta_conexion)) {
    // Intentar ruta alternativa
    $ruta_conexion = __DIR__ . '/../PHP/conexion.php';
}
include $ruta_conexion;

if (!isset($_SESSION['usuario']) || $_SESSION['rol'] != ROL_DOCENTE) {
    header("Location: login.php?error=locked");
    exit();
}

$id_docente = $_SESSION['id'];
$mensaje = '';
$error = '';

// Crear espacio
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['crear_espacio'])) {
    $nombre = trim($_POST['nombre_espacio']);
    if ($nombre === '') {
        $error = 'El nombre del espacio no puede estar vacío.';
    } else {
        $stmt = mysqli_prepare($conn, "INSERT INTO espacios (nombre, id_docente) VALUES (?, ?)");
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "si", $nombre, $id_docente);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            $mensaje = "Espacio \"$nombre\" creado correctamente.";
        } else {
            $error = 'Error al crear el espacio.';
        }
    }
}

// Eliminar espacio
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['eliminar_espacio'])) {
    $id_eliminar = intval($_POST['id_espacio_eliminar']);
    if ($id_eliminar > 0) {
        $verificar = mysqli_query($conn, "SELECT id, nombre FROM espacios WHERE id = $id_eliminar AND id_docente = $id_docente");
        if ($verificar && mysqli_num_rows($verificar) > 0) {
            $espacio_data = mysqli_fetch_assoc($verificar);
            mysqli_begin_transaction($conn);
            try {
                mysqli_query($conn, "DELETE FROM espacio_estudiantes WHERE id_espacio = $id_eliminar");
                mysqli_query($conn, "DELETE FROM espacios WHERE id = $id_eliminar AND id_docente = $id_docente");
                mysqli_commit($conn);
                $mensaje = "Espacio \"{$espacio_data['nombre']}\" eliminado correctamente.";
            } catch (Exception $e) {
                mysqli_rollback($conn);
                $error = 'Error al eliminar el espacio.';
            }
        } else {
            $error = 'El espacio no existe o no tienes permiso para eliminarlo.';
        }
    }
}

$id_espacio = isset($_GET['id_espacio']) && is_numeric($_GET['id_espacio']) ? intval($_GET['id_espacio']) : 0;

if ($id_espacio > 0) {
    $espacio_query = mysqli_query($conn, "SELECT * FROM espacios WHERE id = $id_espacio AND id_docente = $id_docente");
    if (!$espacio_query || mysqli_num_rows($espacio_query) === 0) {
        $error = 'El espacio no existe o no tienes acceso.';
        $id_espacio = 0;
    } else {
        $espacio_actual = mysqli_fetch_assoc($espacio_query);

        // Invitar estudiantes
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['invitar'])) {
            $seleccionados = $_POST['estudiantes'] ?? [];
            if (empty($seleccionados)) {
                $error = 'Selecciona al menos un estudiante.';
            } else {
                $stmt = mysqli_prepare($conn, "INSERT IGNORE INTO espacio_estudiantes (id_espacio, id_estudiante) VALUES (?, ?)");
                if ($stmt) {
                    foreach ($seleccionados as $id_est) {
                        $id_est = intval($id_est);
                        mysqli_stmt_bind_param($stmt, "ii", $id_espacio, $id_est);
                        mysqli_stmt_execute($stmt);
                    }
                    mysqli_stmt_close($stmt);
                    $mensaje = 'Estudiantes invitados correctamente.';
                } else {
                    $error = 'Error al invitar estudiantes.';
                }
            }
        }

        // Asignar simulación a todo el espacio
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['asignar_espacio'])) {
            $id_simulacion = intval($_POST['simulacion']);
            if ($id_simulacion <= 0) {
                $error = 'Elige una simulación.';
            } else {
                $miembros = mysqli_query($conn, "SELECT id_estudiante FROM espacio_estudiantes WHERE id_espacio = $id_espacio");
                if (!$miembros || mysqli_num_rows($miembros) === 0) {
                    $error = 'El espacio no tiene estudiantes.';
                } else {
                    $sim_nombre = '';
                    $sim_query = mysqli_query($conn, "SELECT nombre FROM simulaciones WHERE id = $id_simulacion");
                    if ($sim_query && $sim_row = mysqli_fetch_assoc($sim_query)) {
                        $sim_nombre = $sim_row['nombre'];
                    }

                    $stmt_a = mysqli_prepare($conn, "INSERT INTO asignaciones (id_docente, id_estudiante, id_simulacion) VALUES (?, ?, ?)");
                    $stmt_n = mysqli_prepare($conn, "INSERT INTO notificaciones (id_usuario, mensaje) VALUES (?, ?)");

                    if ($stmt_a && $stmt_n) {
                        while ($m = mysqli_fetch_assoc($miembros)) {
                            $id_est = $m['id_estudiante'];
                            mysqli_stmt_bind_param($stmt_a, "iii", $id_docente, $id_est, $id_simulacion);
                            mysqli_stmt_execute($stmt_a);
                            $msg = "Nueva simulación en el espacio: " . $sim_nombre;
                            mysqli_stmt_bind_param($stmt_n, "is", $id_est, $msg);
                            mysqli_stmt_execute($stmt_n);
                        }
                        mysqli_stmt_close($stmt_a);
                        mysqli_stmt_close($stmt_n);
                        $mensaje = 'Simulación asignada a todos los miembros.';
                    } else {
                        $error = 'Error al preparar las consultas de asignación.';
                    }
                }
            }
        }

        // Miembros actuales
        $miembros = mysqli_query($conn,
            "SELECT u.id, u.username, u.email
             FROM espacio_estudiantes ee
             JOIN usuarios u ON ee.id_estudiante = u.id
             WHERE ee.id_espacio = $id_espacio
             ORDER BY u.username"
        );
        if (!$miembros) $miembros = false;

        // Estudiantes aún no invitados
        $estudiantes_disponibles = mysqli_query($conn,
            "SELECT id, username, email FROM usuarios
             WHERE rol_id = 1 AND id NOT IN (
                 SELECT id_estudiante FROM espacio_estudiantes WHERE id_espacio = $id_espacio
             ) ORDER BY username"
        );
        if (!$estudiantes_disponibles) $estudiantes_disponibles = false;

        // Simulaciones para asignar
        $simulaciones = mysqli_query($conn, "SELECT id, nombre FROM simulaciones ORDER BY nombre");
        if (!$simulaciones) $simulaciones = false;
    }
}

// Para la lista principal, obtener espacios del docente
if ($id_espacio === 0) {
    $espacios = mysqli_query($conn,
        "SELECT e.id, e.nombre, e.fecha_creacion,
                (SELECT COUNT(*) FROM espacio_estudiantes WHERE id_espacio = e.id) AS num_miembros
         FROM espacios e
         WHERE e.id_docente = $id_docente
         ORDER BY e.fecha_creacion DESC"
    );
    if (!$espacios) $espacios = false;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Espacios · Blue EcoSim</title>
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/espacios.css">
    <!-- SweetAlert2 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <!-- SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <canvas id="particles"></canvas>
    <?php include 'fragments/navbar.php'; ?>

    <main class="main-container">
        <?php if ($id_espacio > 0 && isset($espacio_actual)): ?>
            <!-- VISTA INTERIOR DEL ESPACIO -->
            <div class="espacio-detalle">
                <a href="espacios.php" class="volver">← Mis espacios</a>
                
                <div class="detalle-header">
                    <div>
                        <h1><?php echo htmlspecialchars($espacio_actual['nombre']); ?></h1>
                        <p class="subtitulo">Creado el <?php echo date('d/m/Y', strtotime($espacio_actual['fecha_creacion'])); ?></p>
                    </div>
                    <form method="POST" class="form-eliminar-espacio" id="formEliminarDetalle">
                        <input type="hidden" name="id_espacio_eliminar" value="<?php echo $espacio_actual['id']; ?>">
                        <input type="hidden" name="eliminar_espacio" value="1">
                        <button type="button" class="btn-eliminar" id="btnEliminarDetalle">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                            </svg>
                            <span>Eliminar espacio</span>
                        </button>
                    </form>
                </div>

                <?php if ($mensaje): ?>
                    <div class="alerta exito"><?php echo $mensaje; ?></div>
                <?php elseif ($error): ?>
                    <div class="alerta error"><?php echo $error; ?></div>
                <?php endif; ?>

                <div class="dos-columnas">
                    <section class="panel">
                        <h2>👥 Miembros (<?php echo ($miembros && !is_bool($miembros)) ? mysqli_num_rows($miembros) : 0; ?>)</h2>
                        <?php if ($miembros && mysqli_num_rows($miembros) > 0): ?>
                            <ul class="lista-miembros">
                                <?php while ($m = mysqli_fetch_assoc($miembros)): ?>
                                    <li><?php echo htmlspecialchars($m['username'] . ' (' . $m['email'] . ')'); ?></li>
                                <?php endwhile; ?>
                            </ul>
                        <?php else: ?>
                            <p class="vacio">No hay estudiantes en este espacio.</p>
                        <?php endif; ?>
                    </section>

                    <section class="panel">
                        <h2>📩 Invitar estudiantes</h2>
                        <?php if ($estudiantes_disponibles && mysqli_num_rows($estudiantes_disponibles) > 0): ?>
                            <form method="POST" class="form-invitar">
                                <div class="lista-check">
                                    <?php while ($est = mysqli_fetch_assoc($estudiantes_disponibles)): ?>
                                        <label>
                                            <input type="checkbox" name="estudiantes[]" value="<?php echo $est['id']; ?>">
                                            <?php echo htmlspecialchars($est['username'] . ' (' . $est['email'] . ')'); ?>
                                        </label>
                                    <?php endwhile; ?>
                                </div>
                                <button type="submit" name="invitar" class="btn-principal">Invitar seleccionados</button>
                            </form>
                        <?php else: ?>
                            <p class="vacio">Todos los estudiantes ya están en el espacio.</p>
                        <?php endif; ?>
                    </section>
                </div>

                <section class="panel">
                    <h2>📋 Asignar simulación a todo el espacio</h2>
                    <form method="POST" class="form-asignar">
                        <label>Simulación:</label>
                        <select name="simulacion" required>
                            <option value="">-- Selecciona --</option>
                            <?php if ($simulaciones): ?>
                                <?php while ($sim = mysqli_fetch_assoc($simulaciones)): ?>
                                    <option value="<?php echo $sim['id']; ?>"><?php echo htmlspecialchars($sim['nombre']); ?></option>
                                <?php endwhile; ?>
                            <?php endif; ?>
                        </select>
                        <button type="submit" name="asignar_espacio" class="btn-principal">✅ Asignar a todos</button>
                    </form>
                </section>
            </div>

        <?php else: ?>
            <!-- LISTA DE ESPACIOS MEJORADA -->
            <div class="classroom-header">
                <h1>📚 Mis Espacios</h1>
                <p>Crea y gestiona tus aulas virtuales para asignar simulaciones</p>
            </div>

            <section class="crear-espacio">
                <h2>✨ Crear nuevo espacio</h2>
                <form method="POST" class="form-crear">
                    <input type="text" name="nombre_espacio" placeholder="Ej. Biología Marina · 4° Año" required>
                    <button type="submit" name="crear_espacio" class="btn-principal">+ Crear espacio</button>
                </form>
            </section>

            <?php if ($mensaje): ?>
                <div class="alerta exito"><?php echo $mensaje; ?></div>
            <?php elseif ($error): ?>
                <div class="alerta error"><?php echo $error; ?></div>
            <?php endif; ?>

            <?php if ($espacios && mysqli_num_rows($espacios) > 0): ?>
                <div class="espacios-grid">
                    <?php
                    $colores = ['#4285f4', '#34a853', '#fbbc05', '#ea4335', '#46bdc6', '#7c4dff', '#f06292', '#4db6ac'];
                    $i = 0;
                    while ($esp = mysqli_fetch_assoc($espacios)):
                        $color = $colores[$i % count($colores)];
                        $i++;
                        $nombre_espacio_js = addslashes(htmlspecialchars($esp['nombre']));
                    ?>
                        <div class="espacio-card-wrapper">
                            <a href="?id_espacio=<?php echo $esp['id']; ?>" class="espacio-card" style="background-color: <?php echo $color; ?>;">
                                <div class="card-content">
                                    <h2><?php echo htmlspecialchars($esp['nombre']); ?></h2>
                                    <p class="card-meta">
                                        <span><?php echo $esp['num_miembros']; ?> miembros</span> &middot;
                                        <span><?php echo date('d/m/Y', strtotime($esp['fecha_creacion'])); ?></span>
                                    </p>
                                </div>
                                <div class="card-avatar">
                                    <?php echo strtoupper(substr($esp['nombre'], 0, 2)); ?>
                                </div>
                            </a>
                            <!-- BOTÓN ELIMINAR CON ALERTA DE PRECAUCIÓN -->
                            <form method="POST" class="form-eliminar-card" id="formEliminar_<?php echo $esp['id']; ?>">
                                <input type="hidden" name="id_espacio_eliminar" value="<?php echo $esp['id']; ?>">
                                <input type="hidden" name="eliminar_espacio" value="1">
                                <button type="button" class="btn-eliminar-card btn-eliminar-espacio" title="Eliminar espacio" data-nombre="<?php echo $nombre_espacio_js; ?>" data-id="<?php echo $esp['id']; ?>">
                                    <svg class="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                                    </svg>
                                    <span class="btn-text">Eliminar</span>
                                </button>
                            </form>
                        </div>
                    <?php endwhile; ?>
                </div>
            <?php else: ?>
                <div class="vacio-estado">
                    <div class="vacio-icono">📭</div>
                    <h2>No has creado ningún espacio todavía</h2>
                    <p>Crea tu primer espacio y comienza a organizar simulaciones</p>
                </div>
            <?php endif; ?>

        <?php endif; ?>
    </main>

    <?php include 'fragments/footer.php'; ?>
    <script src="../JS/burbujas_fondo.js"></script>
    
    <script>
    // Función para mostrar alerta de confirmación con SweetAlert2
    function mostrarAlertaEliminar(nombreEspacio, formularioId) {
        Swal.fire({
            title: '¿Eliminar espacio?',
            html: `
                <div style="text-align: left;">
                    <p style="margin-bottom: 15px;">Estás a punto de eliminar el espacio:</p>
                    <p style="font-size: 1.2rem; font-weight: bold; color: #dc2626; margin-bottom: 20px;">"${nombreEspacio}"</p>
                    <p style="margin-bottom: 10px;"><span style="color: #ea580c;">⚠️ Advertencia:</span> Esta acción <strong>NO SE PUEDE DESHACER</strong>.</p>
                    <ul style="margin-left: 20px; margin-top: 10px; color: #6b7280;">
                        <li>✓ Se eliminarán todos los miembros del espacio</li>
                        <li>✓ Se perderán todas las asignaciones</li>
                        <li>✓ Los estudiantes perderán acceso al espacio</li>
                    </ul>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: '🗑️ Sí, eliminar espacio',
            cancelButtonText: '❌ Cancelar',
            reverseButtons: true,
            backdrop: true,
            allowOutsideClick: false,
            allowEscapeKey: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Mostrar loading
                Swal.fire({
                    title: 'Eliminando espacio...',
                    text: 'Por favor espera un momento',
                    icon: 'info',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                // Enviar el formulario
                document.getElementById(formularioId).submit();
            }
        });
    }

    // Event listeners para los botones de eliminar en las cards
    document.addEventListener('DOMContentLoaded', function() {
        // Botones de eliminar en las cards
        const botonesEliminar = document.querySelectorAll('.btn-eliminar-espacio');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const nombreEspacio = this.getAttribute('data-nombre');
                const espacioId = this.getAttribute('data-id');
                const formularioId = `formEliminar_${espacioId}`;
                mostrarAlertaEliminar(nombreEspacio, formularioId);
            });
        });

        // Botón de eliminar en el detalle del espacio
        const btnEliminarDetalle = document.getElementById('btnEliminarDetalle');
        if (btnEliminarDetalle) {
            btnEliminarDetalle.addEventListener('click', function(e) {
                e.preventDefault();
                const nombreEspacio = '<?php echo addslashes(htmlspecialchars($espacio_actual['nombre'] ?? '')); ?>';
                Swal.fire({
                    title: '¿Eliminar espacio?',
                    html: `
                        <div style="text-align: left;">
                            <p style="margin-bottom: 15px;">Estás a punto de eliminar el espacio:</p>
                            <p style="font-size: 1.2rem; font-weight: bold; color: #dc2626; margin-bottom: 20px;">"${nombreEspacio}"</p>
                            <p style="margin-bottom: 10px;"><span style="color: #ea580c;">⚠️ Advertencia:</span> Esta acción <strong>NO SE PUEDE DESHACER</strong>.</p>
                            <ul style="margin-left: 20px; margin-top: 10px; color: #6b7280;">
                                <li>✓ Se eliminarán todos los miembros del espacio</li>
                                <li>✓ Se perderán todas las asignaciones</li>
                                <li>✓ Los estudiantes perderán acceso al espacio</li>
                            </ul>
                        </div>
                    `,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#dc2626',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: '🗑️ Sí, eliminar espacio',
                    cancelButtonText: '❌ Cancelar',
                    reverseButtons: true,
                    backdrop: true,
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Eliminando espacio...',
                            text: 'Por favor espera un momento',
                            icon: 'info',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        document.getElementById('formEliminarDetalle').submit();
                    }
                });
            });
        }
    });
    </script>
</body>
</html>