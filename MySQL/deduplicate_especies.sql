-- =============================================================
-- BlueEcoSim - Deduplicacion segura del catalogo de especies
-- Conserva los IDs originales mas antiguos para no invalidar
-- favoritos/notas guardados en el navegador.
-- =============================================================

USE simulador;

START TRANSACTION;

-- Integra la identificacion precisa y los datos locales en el ID historico 4.
UPDATE especies AS destino
JOIN especies AS fuente ON fuente.id = 24
SET
    destino.nombre = 'Tiburón martillo',
    destino.nombre_cientifico = fuente.nombre_cientifico,
    destino.habitat = 'Aguas costeras y pelágicas de Los Cóbanos, 0-275 m',
    destino.descripcion = 'Reconocible por su peculiar cabeza en forma de T, que le proporciona una visión casi completa de 360 grados. En Los Cóbanos se avistan cardúmenes de tiburón martillo en los montes submarinos cercanos, especialmente entre julio y octubre. Es una de las especies más amenazadas del Pacífico oriental por la pesca de aletas. Su presencia indica un ecosistema marino saludable.',
    destino.dieta = 'Carnívoro (rayas, peces, calamares)',
    destino.longevidad = '20-30 años',
    destino.peligro = 'En peligro crítico',
    destino.tamanio = fuente.tamanio,
    destino.peso = fuente.peso,
    destino.reproduccion = 'Vivípara',
    destino.huevos = '15-30 crías por camada',
    destino.depredadores = 'Orcas, tiburones más grandes, humanos',
    destino.temperatura = '20-29 °C',
    destino.salinidad = fuente.salinidad,
    destino.zona_luz = 'Zona fótica',
    destino.profundidad_min = fuente.profundidad_min,
    destino.profundidad_max = fuente.profundidad_max,
    destino.zona_geografica = 'Los Cóbanos, El Salvador',
    destino.map_x = fuente.map_x,
    destino.map_y = fuente.map_y
WHERE destino.id = 4;

-- Conserva las fichas mas completas y toma los modelos 3D correctos.
UPDATE especies AS destino
JOIN especies AS fuente ON fuente.id = 64
SET
    destino.nombre = 'Pez vela del Pacífico',
    destino.model_path = fuente.model_path,
    destino.scale_3d = fuente.scale_3d,
    destino.pos_y = fuente.pos_y,
    destino.rot_y = fuente.rot_y,
    destino.cam_distance = fuente.cam_distance,
    destino.cam_height = fuente.cam_height
WHERE destino.id = 25;

UPDATE especies AS destino
JOIN especies AS fuente ON fuente.id = 66
SET
    destino.nombre = 'Cangrejo moro de roca',
    destino.model_path = fuente.model_path,
    destino.scale_3d = fuente.scale_3d,
    destino.pos_y = fuente.pos_y,
    destino.rot_y = fuente.rot_y,
    destino.cam_distance = fuente.cam_distance,
    destino.cam_height = fuente.cam_height
WHERE destino.id = 34;

UPDATE especies AS destino
JOIN especies AS fuente ON fuente.id = 73
SET
    destino.nombre = 'Cangrejo araña narigón',
    destino.model_path = fuente.model_path,
    destino.scale_3d = fuente.scale_3d,
    destino.pos_y = fuente.pos_y,
    destino.rot_y = fuente.rot_y,
    destino.cam_distance = fuente.cam_distance,
    destino.cam_height = fuente.cam_height
WHERE destino.id = 38;

UPDATE especies SET nombre = 'Langosta de arena' WHERE id = 39;

-- Elimina toda repeticion por nombre cientifico. Los detalles de las copias
-- se eliminan automaticamente mediante las claves foraneas ON DELETE CASCADE.
DELETE duplicada
FROM especies AS duplicada
JOIN especies AS canonica
  ON TRIM(duplicada.nombre_cientifico) = TRIM(canonica.nombre_cientifico)
 AND duplicada.id > canonica.id
WHERE TRIM(duplicada.nombre_cientifico) <> '';

COMMIT;

-- Impide que vuelvan a aparecer especies y detalles duplicados.
SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.statistics
     WHERE table_schema = DATABASE() AND table_name = 'especies'
       AND index_name = 'uq_especies_nombre_cientifico') = 0,
    'ALTER TABLE especies ADD UNIQUE KEY uq_especies_nombre_cientifico (nombre_cientifico)',
    'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.statistics
     WHERE table_schema = DATABASE() AND table_name = 'curiosidades'
       AND index_name = 'uq_curiosidades_especie_orden') = 0,
    'ALTER TABLE curiosidades ADD UNIQUE KEY uq_curiosidades_especie_orden (especie_id, orden)',
    'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
    (SELECT COUNT(*) FROM information_schema.statistics
     WHERE table_schema = DATABASE() AND table_name = 'amenazas'
       AND index_name = 'uq_amenazas_especie_orden') = 0,
    'ALTER TABLE amenazas ADD UNIQUE KEY uq_amenazas_especie_orden (especie_id, orden)',
    'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Verificacion: actualmente deben ser 89 especies y 4 detalles por especie.
SELECT COUNT(*) AS total_especies FROM especies;
SELECT COUNT(*) AS total_curiosidades FROM curiosidades;
SELECT COUNT(*) AS total_amenazas FROM amenazas;

SELECT nombre_cientifico, COUNT(*) AS cantidad
FROM especies
GROUP BY nombre_cientifico
HAVING COUNT(*) > 1;
