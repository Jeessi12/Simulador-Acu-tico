<?php
include("conexion.php");

if (isset($_POST['rol'])) {

    $nombre = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $rol = $_POST['rol'];

    $roles_validos = [1, 2, 3];

    if (!in_array($rol, $roles_validos)) {
        die("Rol inválido");
    }

    $sql = "INSERT INTO usuarios (username, email, password, rol_id) VALUES (?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $nombre, $email, $password, $rol);

    try {
        $stmt->execute();
        header("Location: ../HTML/login.php?registro=ok");
        exit();
    } catch (mysqli_sql_exception $e) {
        if ($e->getCode() == 1062) {
            header("Location: ../HTML/registro.php?error=duplicado");
        } else {
            echo "Error: " . $e->getMessage();
        }
        exit();
    }
}
?>