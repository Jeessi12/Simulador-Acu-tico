<?php
$servidor = "localhost";
$usuario = "Simulaciones";
$contrasena = "bitesthedust";
$base_datos = "simulador";

$conn = new mysqli($servidor, $usuario, $contrasena, $base_datos);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Iniciar sesión SOLO si no existe
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Roles del sistema (coinciden con la tabla 'roles')
define('ROL_ESTUDIANTE', 1);
define('ROL_DOCENTE',    2);
define('ROL_PERSONAL',   3);
define('ROL_ADMIN',      4);
?>