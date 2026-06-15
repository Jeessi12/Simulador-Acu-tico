-- =============================================================
--  BlueEcoSim — Script de base de datos: especies
--  Base de datos: simulador
--  Tablas: especies, curiosidades, amenazas
-- =============================================================

USE simulador;

-- -------------------------------------------------------------
-- TABLA: especies
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS especies (
    id              INT             NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(100)    NOT NULL,
    nombre_cientifico VARCHAR(120)  NOT NULL,
    categoria       VARCHAR(50)     NOT NULL,
    habitat         VARCHAR(255)    NOT NULL,
    descripcion     TEXT            NOT NULL,
    dieta           VARCHAR(150)    NOT NULL,
    longevidad      VARCHAR(60)     NOT NULL,
    peligro         VARCHAR(80)     NOT NULL,
    tamanio         VARCHAR(60)     NOT NULL,
    peso            VARCHAR(60)     NOT NULL,
    reproduccion    VARCHAR(80)     NOT NULL,
    huevos          VARCHAR(100)    NOT NULL,
    depredadores    VARCHAR(150)    NOT NULL,
    temperatura     VARCHAR(60)     NOT NULL,
    salinidad       VARCHAR(80)     NOT NULL,
    zona_luz        VARCHAR(80)     NOT NULL,
    profundidad_min SMALLINT        NOT NULL DEFAULT 0,
    profundidad_max SMALLINT        NOT NULL DEFAULT 0,
    zona_geografica VARCHAR(100)    NOT NULL,
    map_x           SMALLINT        NOT NULL DEFAULT 0,
    map_y           SMALLINT        NOT NULL DEFAULT 0,
    model_path      VARCHAR(255)    NOT NULL,
    scale_3d        DECIMAL(10,4)   NOT NULL DEFAULT 1.0,
    pos_y           DECIMAL(6,3)    NOT NULL DEFAULT 0.0,
    rot_y           DECIMAL(8,4)    NOT NULL DEFAULT 0.0,
    cam_distance    DECIMAL(6,2)    NOT NULL DEFAULT 3.5,
    cam_height      DECIMAL(6,2)    NOT NULL DEFAULT 1.0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- TABLA: curiosidades
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS curiosidades (
    id          INT          NOT NULL AUTO_INCREMENT,
    especie_id  INT          NOT NULL,
    orden       TINYINT      NOT NULL DEFAULT 0,
    icono       VARCHAR(60)  NOT NULL,
    titulo      VARCHAR(100) NOT NULL,
    texto       TEXT         NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (especie_id) REFERENCES especies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- TABLA: amenazas
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS amenazas (
    id          INT          NOT NULL AUTO_INCREMENT,
    especie_id  INT          NOT NULL,
    orden       TINYINT      NOT NULL DEFAULT 0,
    label       VARCHAR(200) NOT NULL,
    nivel       VARCHAR(10)  NOT NULL COMMENT 'high | medium | low',
    PRIMARY KEY (id),
    FOREIGN KEY (especie_id) REFERENCES especies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================
--  DATOS
-- =============================================================

-- Nota: rot_y de id=3 es Math.PI ≈ 3.14159
--       rot_y de id=8 es -25 (valor original en el JS)

INSERT INTO especies
    (id, nombre, nombre_cientifico, categoria, habitat, descripcion, dieta, longevidad, peligro,
     tamanio, peso, reproduccion, huevos, depredadores,
     temperatura, salinidad, zona_luz, profundidad_min, profundidad_max, zona_geografica,
     map_x, map_y,
     model_path, scale_3d, pos_y, rot_y, cam_distance, cam_height)
VALUES

-- 1 · Tortuga verde
(1, 'Tortuga verde', 'Chelonia mydas', 'tortugas',
 'Arrecifes costeros, pastos marinos',
 'La tortuga verde es una de las especies de tortugas marinas más grandes y la única herbívora en su etapa adulta. Realiza migraciones épicas de hasta 2,600 km entre sus áreas de alimentación y anidación.',
 'Herbívora (pastos marinos, algas)', '80-100 años', 'En peligro de extinción',
 '90-120 cm', '80-150 kg', 'Anidación estacional', '100-200 huevos por nidada',
 'Tiburones, cocodrilos, humanos',
 '24 – 30 °C', 'Marina (~35 ppt)', 'Zona fótica', 0, 40, 'Trópicos globales',
 110, 55,
 '../public/media/3D_Models/ridley_turtle_lepidochelys_olivacea.glb',
 1.2, -0.2, -1.57, 3.2, 0.8),

-- 2 · Pez payaso
(2, 'Pez payaso', 'Amphiprioninae', 'peces',
 'Arrecifes de coral (asociado a anémonas)',
 'Famoso por su simbiosis mutualista con anémonas marinas. Todos nacen machos y el dominante se vuelve hembra.',
 'Omnívoro (plancton, algas, restos)', '6-10 años', 'Preocupación menor',
 '8-12 cm', '15-30 g', 'Puesta en anémonas', '100-1000 huevos por ciclo',
 'Peces más grandes, morenas',
 '24 – 28 °C', 'Marina (~35 ppt)', 'Zona fótica', 1, 15, 'Indo-Pacífico',
 165, 52,
 '../public/media/3D_Models/clown_fish_low_poly_animated.glb',
 13.0, -0.1, 1.57, 2.2, 0.5),

-- 3 · Pulpo
(3, 'Pulpo', 'Octopoda', 'moluscos',
 'Mar profundo, arrecifes rocosos',
 'Uno de los invertebrados más inteligentes del planeta. Puede cambiar el color y la textura de su piel.',
 'Carnívoro (crustáceos, peces)', '3-5 años', 'Datos insuficientes',
 '30-90 cm', '3-10 kg', 'Desove único', '100,000-500,000 huevos',
 'Tiburones, delfines, focas',
 '10 – 25 °C', 'Marina (~34 ppt)', 'Zona fótica y mesopelágica', 0, 200, 'Océanos globales',
 95, 40,
 '../public/media/3D_Models/octopus.glb',
 0.1, -1.4, 3.1416, 5.0, 0.6),

-- 4 · Tiburón martillo
(4, 'Tiburón martillo', 'Sphyrnidae', 'peces',
 'Aguas tropicales y templadas',
 'Reconocible por su peculiar cabeza en forma de T que le proporciona visión de 360 grados.',
 'Carnívoro (rayas, peces, calamares)', '20-30 años', 'En peligro crítico',
 '3-6 m', '300-580 kg', 'Vivípara', '10-40 crías por camada',
 'Orcas, humanos',
 '20 – 29 °C', 'Marina (~35 ppt)', 'Zona fótica', 0, 300, 'Trópicos y subtrópicos',
 70, 45,
 '../public/media/3D_Models/hammerhead_shark.glb',
 0.6, -0.2, 1.57, 3.0, 0.7),

-- 5 · Cirujano azul
(5, 'Cirujano azul', 'Paracanthurus hepatus', 'peces',
 'Arrecifes de coral',
 'Pez de color azul eléctrico con distintiva mancha amarilla en la cola.',
 'Herbívoro (algas)', '8-12 años', 'Preocupación menor',
 '20-30 cm', '200-600 g', 'Desove en grupo', 'Miles de huevos flotantes',
 'Tiburones, barracudas',
 '24 – 28 °C', 'Marina (~35 ppt)', 'Zona fótica', 2, 40, 'Indo-Pacífico',
 162, 50,
 '../public/media/3D_Models/hand_painted_surgeon_fish.glb',
 10.0, -0.2, 1.57, 2.8, 0.7),

-- 6 · Caballito de mar
(6, 'Caballito de mar', 'Hippocampus', 'peces',
 'Praderas marinas, manglares',
 'Pez único que nada en posición vertical. El macho es el responsable de la gestación.',
 'Carnívoro (pequeños crustáceos)', '1-4 años', 'Vulnerable',
 '5-15 cm', '5-15 g', 'Gestación masculina', '50-150 crías',
 'Cangrejos, peces grandes',
 '20 – 28 °C', 'Marina (~33-35 ppt)', 'Zona fótica', 0, 30, 'Costas tropicales',
 100, 50,
 '../public/media/3D_Models/seahorse_from_poly_by_google.glb',
 0.005, -0.3, 1.57, 2.8, 0.7),

-- 7 · Delfín nariz de botella
(7, 'Delfín nariz de botella', 'Tursiops truncatus', 'peces',
 'Océano abierto, zonas costeras',
 'Mamífero marino extremadamente inteligente. Vive en manadas y se comunica mediante silbidos.',
 'Carnívoro (peces, calamares)', '40-50 años', 'Preocupación menor',
 '2-4 m', '150-650 kg', 'Vivípara', '1 cría cada 2-3 años',
 'Tiburones, orcas',
 '10 – 32 °C', 'Marina (~35 ppt)', 'Zona fótica', 0, 500, 'Océanos globales',
 75, 42,
 '../public/media/3D_Models/cute_dolphin.glb',
 1.5, -0.3, 1.57, 4.5, 0.8),

-- 8 · Cangrejo ermitaño
(8, 'Cangrejo ermitaño', 'Paguroidea', 'crustaceos',
 'Zonas intermareales, fondos arenosos',
 'Utiliza conchas vacías como refugio. A medida que crece, debe buscar conchas más grandes.',
 'Omnívoro (detritus, algas)', '3-12 años', 'Preocupación menor',
 '5-15 cm', '10-50 g', 'Puesta de huevos', 'Miles de huevos',
 'Pulpos, peces, aves',
 '18 – 27 °C', 'Marina o estuarina', 'Intermareal', 0, 10, 'Costas tropicales',
 100, 55,
 '../public/media/3D_Models/little_hermit_crab.glb',
 33.0, 0.3, -25.0, 2.5, 0.5),

-- 9 · Estrella de mar
(9, 'Estrella de mar', 'Asteroidea', 'moluscos',
 'Fondos rocosos, arenosos',
 'Equinodermo con gran capacidad regenerativa. Puede perder un brazo y volver a crecerlo.',
 'Carnívoro (mejillones, almejas)', '5-35 años', 'Preocupación menor',
 '10-30 cm', '50-500 g', 'Reproducción sexual y asexual', 'Miles de huevos',
 'Gaviotas, nutrias, peces',
 '5 – 25 °C', 'Marina (~35 ppt)', 'Zona bentónica', 0, 200, 'Océanos globales',
 95, 40,
 '../public/media/3D_Models/starfish.glb',
 0.9, -0.1, 0.0, 2.8, 0.5),

-- 10 · Langosta espinosa
(10, 'Langosta espinosa', 'Palinuridae', 'crustaceos',
 'Arrecifes rocosos, fondos duros',
 'Carece de pinzas grandes, usa sus largas antenas para defenderse.',
 'Omnívoro (moluscos, algas)', '15-20 años', 'Preocupación menor',
 '20-40 cm', '0.5-3 kg', 'Puesta de huevos', '50,000-500,000 huevos',
 'Pulpos, peces grandes, humanos',
 '18 – 28 °C', 'Marina (~35 ppt)', 'Zona bentónica', 1, 90, 'Trópicos y subtrópicos',
 80, 50,
 '../public/media/3D_Models/lobster.glb',
 0.15, -0.15, 0.0, 3.0, 0.6),

-- 11 · Mantarraya
(11, 'Mantarraya', 'Mobula birostris', 'peces',
 'Aguas cálidas tropicales',
 'Una de las rayas más grandes del mundo. Filtradora de plancton conocida por sus impresionantes saltos.',
 'Carnívoro (plancton, peces pequeños)', '15-20 años', 'Vulnerable',
 '3-5 m', '500-1500 kg', 'Vivípara', '1-2 crías por camada',
 'Tiburones, orcas',
 '20 – 30 °C', 'Marina (~35 ppt)', 'Zona fótica y epipelágica', 0, 1000, 'Trópicos globales',
 105, 52,
 '../public/media/3D_Models/mantarraya.glb',
 1.5, -0.2, 0.0, 3.2, 0.6),

-- 12 · Caracol cono
(12, 'Caracol cono', 'Conus geographus', 'moluscos',
 'Arenas y arrecifes',
 'Molusco depredador que usa un arpón modificado para inyectar veneno.',
 'Carnívoro (gusanos, peces)', '10-15 años', 'Preocupación menor',
 '10-15 cm', '50-150 g', 'Puesta de huevos', 'Miles de huevos',
 'Peces, tortugas',
 '22 – 30 °C', 'Marina (~35 ppt)', 'Bentónica fótica', 0, 50, 'Indo-Pacífico',
 160, 55,
 '../public/media/3D_Models/cone_snail_shell.glb',
 0.8, -0.1, 0.0, 2.5, 0.5);


-- =============================================================
--  CURIOSIDADES  (4 por especie, orden 1-4)
-- =============================================================

INSERT INTO curiosidades (especie_id, orden, icono, titulo, texto) VALUES

-- Especie 1
(1, 1, 'fa-compass',        'Navegación',    'Detecta el campo magnético terrestre para orientarse en migraciones de miles de km.'),
(1, 2, 'fa-thermometer-half','Temperatura',  'El sexo de las crías depende de la temperatura de incubación de los huevos.'),
(1, 3, 'fa-lungs',          'Apnea',         'Pueden aguantar hasta 7 horas sumergidas mientras descansan.'),
(1, 4, 'fa-seedling',       'Ecosistema',    'Al pastar pastos marinos, los fertilizan y mantienen saludables los arrecifes.'),

-- Especie 2
(2, 1, 'fa-venus-mars',     'Hermafroditismo','Todos nacen machos; el más dominante cambia de sexo al ser hembra del grupo.'),
(2, 2, 'fa-shield-alt',     'Inmunidad',     'Produce una capa de moco que los protege del veneno de la anémona.'),
(2, 3, 'fa-music',          'Comunicación',  'Se comunican con chasquidos y chirriados para establecer jerarquías.'),
(2, 4, 'fa-home',           'Simbiosis',     'La anémona los protege de depredadores; ellos la limpian y la alimentan.'),

-- Especie 3
(3, 1, 'fa-brain',          'Inteligencia',  'Tienen 9 cerebros: uno central y uno en cada tentáculo, que actúan de forma independiente.'),
(3, 2, 'fa-palette',        'Camuflaje',     'Pueden cambiar color, textura y forma en menos de 200 milisegundos.'),
(3, 3, 'fa-tint',           '3 corazones',   'Tienen tres corazones y sangre azul por la hemocianina con cobre.'),
(3, 4, 'fa-unlock',         'Escapistas',    'Pueden escapar de tanques y abrir frascos; resuelven problemas complejos.'),

-- Especie 4
(4, 1, 'fa-eye',            'Visión 360°',   'Su cabeza en forma de T le da visión casi completa alrededor, sin punto ciego arriba.'),
(4, 2, 'fa-magnet',         'Electrorecepción','Detecta campos eléctricos de presas enterradas en la arena mediante ampollas de Lorenzini.'),
(4, 3, 'fa-users',          'Cardúmenes',    'Únicos tiburones que forman grandes grupos de hasta cientos de individuos.'),
(4, 4, 'fa-baby',           'Vivíparos',     'Las crías nacen vivas y completamente formadas, listas para sobrevivir.'),

-- Especie 5
(5, 1, 'fa-cut',            'Espina caudal', 'Tienen una espina afilada en la cola con la que se defienden de depredadores.'),
(5, 2, 'fa-leaf',           'Control de algas','Al pastar algas, permiten el crecimiento de coral y mantienen el arrecife saludable.'),
(5, 3, 'fa-palette',        'Color único',   'Su pigmento azul real es uno de los más raros en peces de arrecife.'),
(5, 4, 'fa-film',           'Fama mundial',  'Popularizado por Dory en Buscando a Nemo, lo que aumentó su demanda en acuarios.'),

-- Especie 6
(6, 1, 'fa-baby',           'Machos gestantes','El único animal donde el macho lleva y da a luz a las crías en su bolsa ventral.'),
(6, 2, 'fa-eye',            'Ojos independientes','Pueden mover cada ojo de forma independiente, como los camaleones.'),
(6, 3, 'fa-anchor',         'Cola prensil',  'Se aferran a corales y algas con su cola para no ser arrastrados por corrientes.'),
(6, 4, 'fa-swimmer',        'Mal nadador',   'Son los peces más lentos del mundo, se mueven por batido de la aleta dorsal.'),

-- Especie 7
(7, 1, 'fa-satellite-dish', 'Ecolocalización','Emiten clicks ultrasónicos y analizan el eco para detectar presas con precisión milimétrica.'),
(7, 2, 'fa-moon',           'Sueño hemisférico','Duermen con medio cerebro a la vez para seguir respirando en superficie.'),
(7, 3, 'fa-id-badge',       'Identidad',     'Cada delfín tiene un silbido único que funciona como su nombre personal.'),
(7, 4, 'fa-heart',          'Empatía',       'Ayudan a compañeros heridos y han rescatado humanos en el mar.'),

-- Especie 8
(8, 1, 'fa-home',           'Casa prestada', 'Usan conchas de gasterópodos vacías; organizan intercambios masivos en cadena.'),
(8, 2, 'fa-hand-rock',      'Sociabilidad',  'Se reúnen en grupos para intercambiar conchas de forma ordenada y pacífica.'),
(8, 3, 'fa-recycle',        'Recicladores',  'Son descomponedores clave; procesan materia orgánica en el sedimento.'),
(8, 4, 'fa-shield-alt',     'Defensa',       'Se retraen dentro de la concha y bloquean la entrada con su pinza más grande.'),

-- Especie 9
(9, 1, 'fa-hand-paper',     'Regeneración',  'Pueden regenerar un brazo perdido en meses; algunos regeneran el cuerpo entero desde un brazo.'),
(9, 2, 'fa-stomach',        'Digestión externa','Expulsan su estómago fuera del cuerpo para digerir presas dentro de sus conchas.'),
(9, 3, 'fa-shoe-prints',    'Sin cerebro',   'No tienen cerebro ni sangre; usan agua de mar a presión para moverse y funcionar.'),
(9, 4, 'fa-eye',            'Ojos en tentáculos','Tienen pequeños fotorreceptores en las puntas de sus brazos para detectar luz.'),

-- Especie 10
(10, 1, 'fa-compass',       'Navegación magnética','Pueden orientarse usando el campo magnético terrestre durante migraciones.'),
(10, 2, 'fa-music',         'Estridulación', 'Producen sonidos frotando sus antenas contra el caparazón para espantar depredadores.'),
(10, 3, 'fa-users',         'Migraciones en fila','Migran en filas de hasta 50 individuos tomados de las antenas del de delante.'),
(10, 4, 'fa-hard-hat',      'Muda',          'Mudan su exoesqueleto para crecer; quedan vulnerables durante horas hasta que se endurece.'),

-- Especie 11
(11, 1, 'fa-brain',         'Mayor cerebro', 'Tienen el mayor cerebro en proporción al cuerpo de todos los peces.'),
(11, 2, 'fa-rocket',        'Saltos',        'Pueden saltar varios metros fuera del agua; aún se desconoce la razón exacta.'),
(11, 3, 'fa-filter',        'Filtración',    'Filtran hasta 30 kg de plancton por hora pasando agua por sus branquias modificadas.'),
(11, 4, 'fa-graduation-cap','Curiosas',      'Se acercan a buzos voluntariamente; parecen mostrar curiosidad hacia humanos.'),

-- Especie 12
(12, 1, 'fa-syringe',       'Veneno letal',  'Produce conotoxinas que atacan el sistema nervioso; no hay antídoto conocido.'),
(12, 2, 'fa-crosshairs',    'Arpón harpaxóforo','Su diente es un arpón retráctil que puede disparar en cualquier dirección.'),
(12, 3, 'fa-pills',         'Medicina',      'Sus conotoxinas son base de Ziconotide, un analgésico más potente que la morfina.'),
(12, 4, 'fa-moon',          'Caza nocturna', 'Son activos de noche; detectan presas con un sifón que analiza partículas en el agua.');


-- =============================================================
--  AMENAZAS  (4 por especie, orden 1-4)
-- =============================================================

INSERT INTO amenazas (especie_id, orden, label, nivel) VALUES

-- Especie 1
(1, 1, 'Captura incidental en redes de pesca',   'high'),
(1, 2, 'Destrucción de playas de anidación',      'high'),
(1, 3, 'Cambio climático y feminización',         'medium'),
(1, 4, 'Contaminación por plásticos',             'medium'),

-- Especie 2
(2, 1, 'Blanqueamiento de coral por calentamiento','high'),
(2, 2, 'Pesca excesiva para acuarios',            'medium'),
(2, 3, 'Contaminación costera',                   'medium'),
(2, 4, 'Turismo sin regulación en arrecifes',     'low'),

-- Especie 3
(3, 1, 'Pesca comercial excesiva',                'high'),
(3, 2, 'Acidificación del océano',                'medium'),
(3, 3, 'Contaminación por microplásticos',        'medium'),
(3, 4, 'Captura incidental',                      'low'),

-- Especie 4
(4, 1, 'Pesca de aletas (finning)',               'high'),
(4, 2, 'Pesca incidental en redes',               'high'),
(4, 3, 'Destrucción de hábitat costero',          'medium'),
(4, 4, 'Cambio climático oceánico',               'medium'),

-- Especie 5
(5, 1, 'Pesca para comercio de acuarios',         'high'),
(5, 2, 'Blanqueamiento de coral',                 'high'),
(5, 3, 'Contaminación marina',                    'medium'),
(5, 4, 'Turismo irresponsable',                   'low'),

-- Especie 6
(6, 1, 'Medicina tradicional y coleccionismo',    'high'),
(6, 2, 'Destrucción de praderas marinas',         'high'),
(6, 3, 'Pesca incidental',                        'medium'),
(6, 4, 'Acuarios y curios marinos',               'medium'),

-- Especie 7
(7, 1, 'Redes de pesca y captura incidental',     'high'),
(7, 2, 'Contaminación acústica submarina',        'medium'),
(7, 3, 'Derrames de petróleo',                    'medium'),
(7, 4, 'Turismo de avistamiento irresponsable',   'low'),

-- Especie 8
(8, 1, 'Recolección de conchas (privación de hogar)','high'),
(8, 2, 'Contaminación de playas',                 'medium'),
(8, 3, 'Captura para comercio de mascotas',       'medium'),
(8, 4, 'Pérdida de hábitat costero',              'low'),

-- Especie 9
(9, 1, 'Coleccionismo y souvenirs marinos',       'high'),
(9, 2, 'Contaminación y acidificación',           'medium'),
(9, 3, 'Enfermedades como el síndrome de marchitamiento','medium'),
(9, 4, 'Alteración de hábitat bentónico',         'low'),

-- Especie 10
(10, 1, 'Sobrepesca y pesca ilegal',              'high'),
(10, 2, 'Destrucción de arrecifes de coral',      'high'),
(10, 3, 'Contaminación costera',                  'medium'),
(10, 4, 'Cambio climático y blanqueamiento',      'medium'),

-- Especie 11
(11, 1, 'Pesca dirigida por branquias (medicina)','high'),
(11, 2, 'Enredamiento en redes de pesca',         'high'),
(11, 3, 'Colisiones con embarcaciones',           'medium'),
(11, 4, 'Contaminación y pérdida de plancton',    'low'),

-- Especie 12
(12, 1, 'Recolección de conchas por coleccionismo','high'),
(12, 2, 'Degradación de arrecifes de coral',      'medium'),
(12, 3, 'Contaminación de sedimentos',            'medium'),
(12, 4, 'Turismo sin regulación',                 'low');

USE simulador;

SELECT COUNT(*) FROM especies;      -- debe dar 12
USE simulador;

SELECT COUNT(*) FROM curiosidades;  -- debe dar 48
USE simulador;

SELECT COUNT(*) FROM amenazas;      -- debe dar 48
USE simulador;

