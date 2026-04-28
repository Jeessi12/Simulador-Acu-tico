<<<<<<< HEAD
-- 1. Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS simulador;
USE simulador;

-- 2. Eliminar el usuario si ya existía (evita errores)
DROP USER IF EXISTS 'Simulaciones'@'localhost';

-- 3. Crear el usuario de la aplicación
=======
CREATE DATABASE simulador;
USE simulador;
>>>>>>> 798a701f32e177c592e53a265113b3087c7cb5ee
CREATE USER 'Simulaciones'@'localhost' IDENTIFIED BY 'bitesthedust';
GRANT ALL PRIVILEGES ON simulador.* TO 'Simulaciones'@'localhost';
FLUSH PRIVILEGES;

<<<<<<< HEAD
-- 4. Tabla de roles
=======
>>>>>>> 798a701f32e177c592e53a265113b3087c7cb5ee
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(50) NOT NULL
);

INSERT INTO roles (rol) VALUES 
('Estudiante'),
('Docente'),
('Personal'),
('Admin');

<<<<<<< HEAD
-- 5. Tabla de usuarios
=======
>>>>>>> 798a701f32e177c592e53a265113b3087c7cb5ee
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    rol_id INT DEFAULT 1,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
<<<<<<< HEAD
);

-- 6. Tabla de simulaciones disponibles
CREATE TABLE simulaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ruta VARCHAR(255)
);

INSERT INTO simulaciones (nombre, descripcion, ruta) VALUES
('Ecosistema básico',       'Arrecife de coral con especies comunes', 'simulador.php?id=1'),
('Cadena alimenticia',      'Relación depredador-presa en el océano', 'simulador.php?id=2'),
('Contaminación marina',    'Efectos de residuos en el ecosistema',   'simulador.php?id=3');

-- 7. Tabla de asignaciones (docente → estudiante + simulación)
CREATE TABLE asignaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_docente INT NOT NULL,
    id_estudiante INT NOT NULL,
    id_simulacion INT NOT NULL,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente','en_progreso','completada') DEFAULT 'pendiente',
    FOREIGN KEY (id_docente)    REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_estudiante) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_simulacion) REFERENCES simulaciones(id) ON DELETE CASCADE
);

-- 8. Tabla de notificaciones (con todas las columnas nuevas)
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje TEXT NOT NULL,
    leida TINYINT DEFAULT 0,
    destacado TINYINT DEFAULT 0,
    archivado TINYINT DEFAULT 0,
    eliminado TINYINT DEFAULT 0,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 9. Tabla de espacios (creados por el docente)
CREATE TABLE espacios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_docente INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_docente) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 10. Tabla de relación espacio - estudiantes
CREATE TABLE espacio_estudiantes (
    id_espacio INT NOT NULL,
    id_estudiante INT NOT NULL,
    fecha_union DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_espacio, id_estudiante),
    FOREIGN KEY (id_espacio) REFERENCES espacios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_estudiante) REFERENCES usuarios(id) ON DELETE CASCADE
=======
>>>>>>> 798a701f32e177c592e53a265113b3087c7cb5ee
);