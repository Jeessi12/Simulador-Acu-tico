<?php
session_start();

require_once __DIR__ . "/../models/Conexion.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM usuarios WHERE email = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($user = $resultado->fetch_assoc()) {

        if (password_verify($password, $user['password'])) {

            $_SESSION['usuario'] = $user['username'];
            $_SESSION['rol'] = $user['rol_id'];
            $_SESSION['id'] = $user['id'];

            header("Location: /Simulador-Acu-tico-main/views/index.php");
            exit();

        } else {
            header("Location: /Simulador-Acu-tico-main/views/login.php?error=credentials");
            exit();
        }

    } else {
        header("Location: /Simulador-Acu-tico-main/views/login.php?error=credentials");
        exit();
    }
}
?>