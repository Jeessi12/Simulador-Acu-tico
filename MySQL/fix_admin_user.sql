-- ============================================================
-- NUEVA INSERCIÓN: Admin con los nuevos datos
-- Email: blueecosim67@gmail.com
-- Username: Blue_EcoSim2026
-- Contraseña: 1 (se usará el hash correspondiente)
-- Base de datos: simulador
-- ============================================================
USE simulador;

-- Desactivar safe mode temporalmente
SET SQL_SAFE_UPDATES = 0;

-- 1. ELIMINAR el admin anterior
DELETE FROM usuarios WHERE username = 'admin' OR email = 'blueecosim67@gmail.com';

-- 2. INSERTAR el nuevo admin
-- NOTA: El password hash es para la contraseña "1"
INSERT INTO usuarios (email, username, password, rol_id, estado) 
VALUES (
    'blueecosim67@gmail.com',
    'Blue_EcoSim2026',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Hash para contraseña: "1"
    4,  -- rol_id = 4 (Admin)
    'activo'
);

-- Volver a activar safe mode
SET SQL_SAFE_UPDATES = 1;

-- Verificar la inserción
SELECT id, email, username, rol_id, estado 
FROM usuarios 
WHERE email = 'blueecosim67@gmail.com' OR username = 'Blue_EcoSim2026';		


USE simulador;

-- Ver qué usuario admin existe actualmente
SELECT id, email, username, password, rol_id, estado 
FROM usuarios 
WHERE email = 'blueecosim67@gmail.com' OR username = 'Blue_EcoSim2026';

USE simulador;
SET SQL_SAFE_UPDATES = 0;

-- Actualizar la contraseña del admin con el hash correcto
UPDATE usuarios 
SET password = '$2y$10$77CQm.aKbGZIesA73BIjZeQzVdtwqQx.Yos89ob0iRowvrQmUiAxK'
WHERE email = 'blueecosim67@gmail.com';

SET SQL_SAFE_UPDATES = 1;

-- Verificar que se actualizó correctamente
SELECT id, email, username, rol_id, estado 
FROM usuarios 
WHERE email = 'blueecosim67@gmail.com';

-- ============================================================
-- BLUE ECOSIM — Setup completo para admin.php
-- Ejecutar en phpMyAdmin → pestaña SQL
-- Autor: generado para Simulador-Acuático-main
-- ============================================================

USE simulador;

-- ============================================================
-- 1. COLUMNAS FALTANTES EN TABLA usuarios
-- ============================================================
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS fecha_registro   DATETIME DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS ultima_actividad DATETIME NULL;

-- ============================================================
-- 2. TABLA logs
-- ============================================================
CREATE TABLE IF NOT EXISTS logs (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id     INT          NULL,
    usuario_nombre VARCHAR(100) NULL,
    accion         VARCHAR(255) NOT NULL,
    detalles       TEXT         NULL,
    ip             VARCHAR(45)  NULL,
    fecha          DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Por si la tabla ya existía pero sin la columna usuario_nombre
ALTER TABLE logs
    ADD COLUMN IF NOT EXISTS usuario_nombre VARCHAR(100) NULL AFTER usuario_id;

-- ============================================================
-- 3. TABLA config
-- ============================================================
CREATE TABLE IF NOT EXISTS config (
    clave       VARCHAR(100) PRIMARY KEY,
    valor       TEXT         NOT NULL,
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO config (clave, valor, descripcion) VALUES
    ('limite_estudiantes_espacio', '30',          'Número máximo de estudiantes por espacio'),
    ('tiempo_simulacion_maximo',   '0',           'Tiempo máximo en segundos (0 = sin límite)'),
    ('registro_abierto',           '1',           'Permitir registro de nuevos usuarios (1=Si, 0=No)'),
    ('modo_mantenimiento',         '0',           'Modo mantenimiento (1=Activo, 0=Inactivo)'),
    ('logo_url',    '/Simulador-Acu-tico-main/public/media/Web/logo.png', 'URL del logo'),
    ('favicon_url', '/Simulador-Acu-tico-main/public/media/Web/logo.png', 'URL del favicon');

-- ============================================================
-- 4. TABLA sesiones_activas
-- ============================================================
CREATE TABLE IF NOT EXISTS sesiones_activas (
    id           VARCHAR(128) PRIMARY KEY,
    usuario_id   INT          NOT NULL,
    ip           VARCHAR(45),
    user_agent   TEXT,
    ultimo_acceso DATETIME,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

USE simulador;
ALTER TABLE logs ADD COLUMN detalles TEXT NULL AFTER accion;

-- ============================================================
-- 5. VERIFICACIÓN FINAL
-- ============================================================
SELECT 'usuarios'         AS tabla, COUNT(*) AS columnas FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='simulador' AND TABLE_NAME='usuarios'
UNION ALL
SELECT 'logs',             COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='simulador' AND TABLE_NAME='logs'
UNION ALL
SELECT 'config',           COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='simulador' AND TABLE_NAME='config'
UNION ALL
SELECT 'sesiones_activas', COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='simulador' AND TABLE_NAME='sesiones_activas';