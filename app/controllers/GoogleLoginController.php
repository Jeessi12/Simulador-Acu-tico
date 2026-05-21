<?php
session_start();

$clientID = 'aqui va el id';
$clientSecret = 'aqui va el secreto';
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