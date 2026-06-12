<?php

class Conexion {
    private $servidor  = "localhost";
    private $usuario   = "Simulaciones";
    private $contrasena = "bitesthedust";
    private $base_datos = "simulador";

    private $conn;

    public function getConnection(): mysqli {
        if ($this->conn === null) {
            $this->conn = new mysqli(
                $this->servidor,
                $this->usuario,
                $this->contrasena,
                $this->base_datos
            );

            if ($this->conn->connect_error) {
                die(json_encode([
                    'error' => 'Error de conexión: ' . $this->conn->connect_error
                ]));
            }

            $this->conn->set_charset('utf8mb4');
        }

        return $this->conn;
    }
}