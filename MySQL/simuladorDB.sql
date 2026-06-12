-- ============================================================
-- 1. Eliminar la base de datos si existe (CUIDADO: borra todo)
-- ============================================================
DROP DATABASE IF EXISTS simulador;

-- ============================================================
-- 2. Crear la base de datos
-- ============================================================
CREATE DATABASE simulador;
USE simulador;

-- ============================================================
-- 3. Eliminar el usuario si ya existía (evita errores)
-- ============================================================
DROP USER IF EXISTS 'Simulaciones'@'localhost';

-- ============================================================
-- 4. Crear el usuario de la aplicación
-- ============================================================
CREATE USER 'Simulaciones'@'localhost' IDENTIFIED BY 'bitesthedust';
GRANT ALL PRIVILEGES ON simulador.* TO 'Simulaciones'@'localhost';
FLUSH PRIVILEGES;

-- ============================================================
-- 5. Tabla de roles
-- ============================================================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(50) NOT NULL
);

INSERT INTO roles (rol) VALUES 
('Estudiante'),
('Docente'),
('Personal'),
('Admin');

-- ============================================================
-- 6. Tabla de usuarios (con google_id, estado y nuevas columnas)
-- ============================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    google_id VARCHAR(180) UNIQUE NULL,
    rol_id INT DEFAULT 1,
    estado ENUM('pendiente','activo','bloqueado') NOT NULL DEFAULT 'pendiente',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_actividad DATETIME DEFAULT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- ============================================================
-- 7. Tabla de verificaciones de correo electrónico
-- ============================================================
CREATE TABLE verificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    expira DATETIME NOT NULL,
    creado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- 8. Tabla de simulaciones disponibles
-- ============================================================
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

-- ============================================================
-- 9. Tabla de asignaciones (docente → estudiante + simulación)
-- ============================================================
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

-- ============================================================
-- 10. Tabla de notificaciones
-- ============================================================
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

-- ============================================================
-- 11. Tabla de espacios (creados por el docente)
-- ============================================================
CREATE TABLE espacios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_docente INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_docente) REFERENCES usuarios(id) ON DELETE CASCADE
);
ALTER TABLE espacios ADD portada VARCHAR(255) DEFAULT 'default.jpg';

-- ============================================================
-- 12. Tabla de relación espacio - estudiantes
-- ============================================================
CREATE TABLE espacio_estudiantes (
    id_espacio INT NOT NULL,
    id_estudiante INT NOT NULL,
    fecha_union DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_espacio, id_estudiante),
    FOREIGN KEY (id_espacio) REFERENCES espacios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_estudiante) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- 13. Agregar columnas adicionales a tablas existentes
-- ============================================================
ALTER TABLE asignaciones ADD COLUMN id_espacio INT NULL DEFAULT NULL;
ALTER TABLE espacio_estudiantes ADD COLUMN estado ENUM('pendiente','aceptado','rechazado') NOT NULL DEFAULT 'aceptado';
ALTER TABLE notificaciones ADD COLUMN tipo VARCHAR(30) NOT NULL DEFAULT 'general';
ALTER TABLE notificaciones ADD COLUMN id_espacio INT NULL DEFAULT NULL;
ALTER TABLE notificaciones ADD FOREIGN KEY (id_espacio) REFERENCES espacios(id) ON DELETE CASCADE;

-- ============================================================
-- 14. Tabla de logs (registro de actividad del sistema)
-- ============================================================
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    usuario_nombre VARCHAR(100),
    accion VARCHAR(255) NOT NULL,
    detalles TEXT,
    ip VARCHAR(45),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 15. Tabla de configuración del sistema
-- ============================================================
CREATE TABLE config (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL,
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO config (clave, valor, descripcion) VALUES
('limite_estudiantes_espacio', '30', 'Número máximo de estudiantes por espacio'),
('tiempo_simulacion_maximo', '0', 'Tiempo máximo en segundos (0 = sin límite)'),
('registro_abierto', '1', 'Permitir registro de nuevos usuarios (1=Si, 0=No)'),
('modo_mantenimiento', '0', 'Modo mantenimiento (1=Activo, 0=Inactivo)'),
('logo_url', '/Simulador-Acu-tico-main/public/media/Web/logo.png', 'URL del logo'),
('favicon_url', '/Simulador-Acu-tico-main/public/media/Web/logo.png', 'URL del favicon');

-- ============================================================
-- 16. Tabla de sesiones activas (para forzar cierre de sesión)
-- ============================================================
CREATE TABLE sesiones_activas (
    id VARCHAR(128) PRIMARY KEY,
    usuario_id INT NOT NULL,
    ip VARCHAR(45),
    user_agent TEXT,
    ultimo_acceso DATETIME,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 17. Insertar un administrador por defecto (contraseña: 1)
-- ============================================================
INSERT INTO usuarios (email, username, password, rol_id, estado, fecha_registro) VALUES
('blueecosim67@gmail.com', 'Blue_EcoSim2026', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, 'activo', NOW())
ON DUPLICATE KEY UPDATE id = id;