<?php

$servidor = "localhost";
$usuario = "Simulaciones";
$contrasena = "bitesthedust";
$base_datos = "simulador";

$conn = new mysqli($servidor, $usuario, $contrasena, $base_datos);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>