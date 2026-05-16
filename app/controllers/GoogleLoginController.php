<?php
session_start();

$clientID = 'tu_client_id_aqui';
$clientSecret = 'tu_client_secret_aqui';
$redirectUri = 'http://localhost/Simulador-Acu-tico-main/views/google-callback.php';

// Construir URL de autenticación de Google manualmente
$authUrl = 'https://accounts.google.com/o/oauth2/auth?' . http_build_query([
    'client_id'     => $clientID,
    'redirect_uri'  => $redirectUri,
    'response_type' => 'code',
    'scope'         => 'email profile',
    'access_type'   => 'online',
    'prompt'        => 'select_account'
]);

header('Location: ' . $authUrl);
exit;