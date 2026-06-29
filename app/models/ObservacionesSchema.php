<?php

function ensureObservacionesSimulacionTable(mysqli $conn): void {
    mysqli_query($conn, "
        CREATE TABLE IF NOT EXISTS observaciones_simulacion (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_asignacion INT NOT NULL,
            id_estudiante INT NOT NULL,
            observacion TEXT NOT NULL,
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_asignacion) REFERENCES asignaciones(id) ON DELETE CASCADE,
            FOREIGN KEY (id_estudiante) REFERENCES usuarios(id) ON DELETE CASCADE,
            INDEX idx_observaciones_asignacion (id_asignacion),
            INDEX idx_observaciones_estudiante (id_estudiante)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
}
