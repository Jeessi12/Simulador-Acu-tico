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