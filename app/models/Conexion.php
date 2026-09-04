<?php

class Conexion {
    private $servidor = "localhost";
    private $usuario = "Simulaciones";
    private $contrasena = "bitesthedust";
    private $base_datos = "simulador";
    private $base_datos_especies = "simulador_especies";

    private $conn;
    private $speciesConn;

    public function getConnection(): mysqli {
        return $this->connect($this->conn, $this->base_datos);
    }

    public function getSpeciesConnection(): mysqli {
        return $this->connect($this->speciesConn, $this->base_datos_especies);
    }

    private function connect(&$connection, string $database): mysqli {
        if ($connection === null) {
            $connection = new mysqli(
                $this->servidor,
                $this->usuario,
                $this->contrasena,
                $database
            );

            if ($connection->connect_error) {
                die(json_encode([
                    'error' => 'Error de conexion: ' . $connection->connect_error
                ]));
            }

            $connection->set_charset('utf8mb4');
        }

        return $connection;
    }
}
