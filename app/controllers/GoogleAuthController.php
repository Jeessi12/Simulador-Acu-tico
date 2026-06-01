<?php
session_start();
require_once __DIR__ . '/../models/Conexion.php';

$clientID = 'aqui va el secreto';
$clientSecret = 'aqui va el secreto';
$redirectUri  = 'http://localhost/Simulador-Acu-tico-main/views/google-callback.php';

// Si no hay código, volver al login
if (!isset($_GET['code'])) {
    header("Location: login.php");
    exit;
}

// Intercambiar código por token vía cURL
$tokenUrl   = 'https://oauth2.googleapis.com/token';
$postFields = [
    'code'          => $_GET['code'],
    'client_id'     => $clientID,
    'client_secret' => $clientSecret,
    'redirect_uri'  => $redirectUri,
    'grant_type'    => 'authorization_code'
];

$ch = curl_init($tokenUrl);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query($postFields),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
]);
$response = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    header("Location: login.php?error=google_fallo");
    exit;
}

$tokenData   = json_decode($response, true);
$accessToken = $tokenData['access_token'];

// Obtener información del usuario
$ch = curl_init('https://www.googleapis.com/oauth2/v2/userinfo');
curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $accessToken],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
]);
$userResponse = curl_exec($ch);
$httpCode     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    header("Location: login.php?error=google_fallo");
    exit;
}

$userInfo = json_decode($userResponse, true);
$googleId = $userInfo['id'];
$email    = $userInfo['email'];
$nombre   = $userInfo['name'];

// 1. Buscar por google_id
$stmt = $conn->prepare("SELECT id, username, rol_id FROM usuarios WHERE google_id = ?");
$stmt->bind_param("s", $googleId);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    $_SESSION['usuario'] = $user['username'];
    $_SESSION['rol']     = $user['rol_id'];
    $_SESSION['id']      = $user['id'];
    header("Location: index.php");
    exit;
}

// 2. Buscar por email para vincular cuenta existente
$stmt = $conn->prepare("SELECT id, username, rol_id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$resultEmail = $stmt->get_result();

if ($userByEmail = $resultEmail->fetch_assoc()) {
    $update = $conn->prepare("UPDATE usuarios SET google_id = ? WHERE id = ?");
    $update->bind_param("si", $googleId, $userByEmail['id']);
    $update->execute();

    $_SESSION['usuario'] = $userByEmail['username'];
    $_SESSION['rol']     = $userByEmail['rol_id'];
    $_SESSION['id']      = $userByEmail['id'];
    header("Location: index.php");
    exit;
}

// 3. No existe — guardar datos de Google en sesión y redirigir al registro
$_SESSION['google_prefill'] = [
    'google_id' => $googleId,
    'email'     => $email,
    'nombre'    => $nombre,
];
header("Location: /Simulador-Acu-tico-main/views/registro.php?mensaje=google_no_registrado");
exit;