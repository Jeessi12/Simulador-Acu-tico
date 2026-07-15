-- Permite que varias cuentas compartan el mismo nombre de usuario.
-- El correo electronico permanece como identificador unico.
SET @drop_username_index = IF(
    EXISTS(
        SELECT 1
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = 'usuarios'
          AND index_name = 'username'
    ),
    'ALTER TABLE usuarios DROP INDEX username',
    'SELECT ''El indice unico de username ya fue eliminado'' AS resultado'
);

PREPARE statement FROM @drop_username_index;
EXECUTE statement;
DEALLOCATE PREPARE statement;
