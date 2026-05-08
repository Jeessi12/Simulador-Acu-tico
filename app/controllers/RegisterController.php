<?php
require_once __DIR__ . "/../models/Conexion.php";

// Autocarga de PHPMailer (instalado con Composer)
require_once __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ========== CONFIGURACIÓN SMTP ==========
// ⚠️ CAMBIA ESTOS VALORES POR LOS REALES
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'correo@gmail.com');          // ← CORREO DE BLUE ECOSIM
define('SMTP_PASS', 'cambiar por contra real');  // ← CONTRASEÑA DE APLICACIÓN (16 caracteres sin espacios)
define('SMTP_PORT', 587);
define('FROM_EMAIL', SMTP_USER);
define('FROM_NAME', 'Blue EcoSim');

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['rol'])) {

    $nombre   = trim($_POST['username']);
    $email    = trim($_POST['email']);
    $password = $_POST['password'];
    $rol      = intval($_POST['rol']);

    $roles_validos = [1, 2, 3]; // Estudiante, Docente, Personal
    if (!in_array($rol, $roles_validos)) {
        die("Rol inválido");
    }

    // 1. Verificar duplicados por email o username
    $stmt = $conn->prepare("SELECT id, email, username FROM usuarios WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $email, $nombre);
    $stmt->execute();
    $result = $stmt->get_result();

    $error = '';
    if ($result->num_rows > 0) {
        $dupEmail = false;
        $dupUser  = false;
        while ($row = $result->fetch_assoc()) {
            if ($row['email'] === $email) $dupEmail = true;
            if ($row['username'] === $nombre) $dupUser = true;
        }
        if ($dupEmail && $dupUser) $error = 'ambos';
        elseif ($dupEmail) $error = 'email_duplicado';
        else $error = 'username_duplicado';

        header("Location: /Simulador-Acu-tico-main/views/registro.php?error=$error");
        exit();
    }

    // 2. Insertar usuario con estado pendiente
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $estado = 'pendiente';
    $stmt = $conn->prepare("INSERT INTO usuarios (email, username, password, rol_id, estado) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssis", $email, $nombre, $passwordHash, $rol, $estado);
    if (!$stmt->execute()) {
        header("Location: /Simulador-Acu-tico-main/views/registro.php?error=desconocido");
        exit();
    }
    $id_usuario = $stmt->insert_id;

    // 3. Generar token de verificación (válido 24 horas)
    $token = bin2hex(random_bytes(32));
    $expira = date('Y-m-d H:i:s', strtotime('+24 hours'));
    $stmt = $conn->prepare("INSERT INTO verificaciones (id_usuario, token, expira) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $id_usuario, $token, $expira);
    $stmt->execute();

    // 4. Enviar correo de verificación
    $enlace = "http://localhost/Simulador-Acu-tico-main/views/verify.php?token=$token";
    $asunto = "Verifica tu cuenta de Blue EcoSim";
    $cuerpo = "
        <h2>¡Bienvenido a Blue EcoSim, $nombre!</h2>
        <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente botón:</p>
        <p><a href='$enlace' style='display:inline-block;padding:10px 20px;background:#3b5b8c;color:white;border-radius:6px;text-decoration:none;'>Verificar cuenta</a></p>
        <p>O copia y pega esta URL en tu navegador:</p>
        <p>$enlace</p>
        <p>Este enlace expirará en 24 horas.</p>
    ";

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;

        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        $mail->addAddress($email, $nombre);
        $mail->CharSet = 'UTF-8';

        $mail->isHTML(true);
        $mail->Subject = $asunto;
        $mail->Body    = $cuerpo;
        $mail->AltBody = strip_tags(str_replace('<br>', "\n", $cuerpo));

        $mail->send();

        // Éxito: redirigir a login con mensaje
        header("Location: /Simulador-Acu-tico-main/views/login.php?mensaje=pendiente_verificacion");
        exit();
    } catch (Exception $e) {
        // Si falla el envío, eliminar el usuario para no dejar cuentas huérfanas
        $conn->query("DELETE FROM usuarios WHERE id = $id_usuario");
        header("Location: /Simulador-Acu-tico-main/views/registro.php?error=envio_correo");
        exit();
    }
}
?>