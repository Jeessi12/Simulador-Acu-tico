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
 1.2, -0.2, 1.57, 3.2, 0.8),


(2, 'Botete bonito' , 'Canthigaster punctatissima', 'peces',
 'Arrecifes rocosos y coralinos de Los Cobanos, 1-30 m',
 'Pez globo de pequeño tamaño con cuerpo redondeado y hocico prominente que le da su nombre. Es de color marron con puntos blancos brillantes y lineas azules alrededor de los ojos. A diferencia de otros peces globo, tiene espinas fijas que siempre estan erectas. Es un pez curioso que nada lentamente entre las rocas y corales en busca de alimento. Posee tetrodotoxina en sus organos, lo que lo hace toxico para depredadores.',
 'Omnivora (algas, esponjas, crustaceos, gusanos)', '3-5 anos', 'Preocupacion menor',
 '8-12 cm', '30-80 g', 'Puesta de huevos demersales en nido', 'Cientos de huevos',
 'Peces grandes, morenas (inmunes a toxina)',
 '22 - 28 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/botete.glb',
 1.0, -0.1, 1.57, 2.5, 0.6),



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
 1.0, -1.4, 3.1416, 5.0, 0.6),

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


(5, 'Jurel Toro', 'Caranx caballus', 'peces',
 'Aguas costeras abiertas y arrecifes de Los Cobanos, 1-50 m',
 'Pez de cuerpo robusto y comprimido, de color plateado con tonos azul-verdosos en el dorso. Es un depredador rapido y agresivo que caza en cardumenes. Su nombre "toro" viene de su fuerza y tenacidad al ser capturado. Es uno de los peces mas importantes para la pesca deportiva y artesanal en Los Cobanos. Se alimenta de peces pequeños y crustaceos, y puede formar grandes cardumenes cerca de la superficie.',
 'Carnivora (peces pequeños, crustaceos, calamares)', '10-15 anos', 'Preocupacion menor',
 '40-80 cm', '2-8 kg', 'Puesta de huevos pelagicos', 'Miles de huevos',
 'Tiburones, peces grandes, humanos',
 '20 - 30 C', 'Marina (~35 ppt)', 'Epipelagica', 1, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/jack.glb',
 1.5, -0.15, 0.0, 3.0, 0.7),


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

-- 7 · Delfín nariz de botella  ← model_path, scale, pos_y corregidos desde JS
(7, 'Delfín nariz de botella', 'Tursiops truncatus', 'peces',
 'Océano abierto, zonas costeras',
 'Mamífero marino extremadamente inteligente. Vive en manadas y se comunica mediante silbidos.',
 'Carnívoro (peces, calamares)', '40-50 años', 'Preocupación menor',
 '2-4 m', '150-650 kg', 'Vivípara', '1 cría cada 2-3 años',
 'Tiburones, orcas',
 '10 – 32 °C', 'Marina (~35 ppt)', 'Zona fótica', 0, 500, 'Océanos globales',
 75, 42,
 '../public/media/3D_Models/delfin.glb',
 6.0, -0.1, 1.57, 4.5, 0.8),


-- 8 · Jaiba Roja del Pacífico
(8, 'Jaiba Roja del Pacifico', 'Cronius ruber', 'crustaceos',
 'Arrecifes rocosos y fondos arenosos de Los Cobanos, 0-30 m',
 'Cangrejo nadador de caparazon rojo intenso con manchas mas oscuras, muy llamativo en el arrecife. Sus patas traseras aplanadas en forma de paleta le permiten nadar activamente entre rocas y arena. Es un depredador activo que caza pequeños peces y crustaceos. En Los Cobanos es abundante en fondos mixtos de roca y arena, siendo una especie clave en la cadena alimenticia del arrecife.',
 'Carnivora (peces pequeños, crustaceos, moluscos)', '3-5 anos', 'Preocupacion menor',
 '8-15 cm', '100-300 g', 'Puesta de huevos en abdomen', 'Miles de huevos',
 'Pulpos, peces grandes, humanos',
 '20 - 30 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 0, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/jaibaroja.glb',
 2.5, -0.15, -1.57, 3.0, 0.6),
 

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

-- 10 · Camarón Mantis del Pacífico
(10, 'Camaron Mantis del Pacifico', 'Squilla aculeata', 'crustaceos',
 'Fondos arenosos y fangosos de Los Cobanos, 1-40 m',
 'Crustaceo depredador con apendices raptoriales en forma de garrote que usa para golpear a sus presas con una fuerza brutal. Su golpe es tan rapido que genera cavitacion en el agua, produciendo una onda de choque y luz. Es uno de los golpeadores mas poderosos del reino animal. En Los Cobanos excava madrigueras en fondos blandos y es un depredador temido por otros crustaceos y peces pequeños.',
 'Carnivora (cangrejos, camarones, peces pequeños, moluscos)', '4-6 anos', 'Preocupacion menor',
 '10-20 cm', '50-150 g', 'Puesta de huevos en madriguera', 'Miles de huevos',
 'Pulpos, peces grandes, humanos',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona bentonica', 1, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/mantis_shrimp.glb',
 1.5, -0.1, 0.0, 2.8, 0.6),

-- 11 · Mantarraya  ← scale, pos_y, rot_y, cam_distance, cam_height corregidos desde JS
(11, 'Mantarraya', 'Mobula birostris', 'peces',
 'Aguas cálidas tropicales',
 'Una de las rayas más grandes del mundo. Filtradora de plancton conocida por sus impresionantes saltos.',
 'Carnívoro (plancton, peces pequeños)', '15-20 años', 'Vulnerable',
 '3-5 m', '500-1500 kg', 'Vivípara', '1-2 crías por camada',
 'Tiburones, orcas',
 '20 – 30 °C', 'Marina (~35 ppt)', 'Zona fótica y epipelágica', 0, 1000, 'Trópicos globales',
 105, 52,
 '../public/media/3D_Models/mantarraya.glb',
 4.5, -0.1, 1.57, 4.5, 0.8),

-- 12 · Caracol cono  ← model_path, scale, rot_y, cam_distance, cam_height corregidos desde JS
(12, 'Caracol cono', 'Conus geographus', 'moluscos',
 'Arenas y arrecifes',
 'Molusco depredador que usa un arpón modificado para inyectar veneno.',
 'Carnívoro (gusanos, peces)', '10-15 años', 'Preocupación menor',
 '10-15 cm', '50-150 g', 'Puesta de huevos', 'Miles de huevos',
 'Peces, tortugas',
 '22 – 30 °C', 'Marina (~35 ppt)', 'Bentónica fótica', 0, 50, 'Indo-Pacífico',
 160, 55,
 '../public/media/3D_Models/cone.glb',
 4.0, -0.1, 1.57, 4.5, 0.8),

-- 13 · Pez Ángel Real
(13, 'Pez Angel Real', 'Holacanthus passer', 'peces',
 'Arrecifes rocosos de Los Cobanos, zona intermareal y submareal hasta 80 m',
 'El pez angel rey del Pacifico oriental. Los juveniles son de color negro con rayas blancas curvas y prestan servicio como limpiadores de otros peces. Los adultos exhiben un cuerpo azul marino con una llamativa barra blanca vertical y aletas color naranja-amarillo. Es un habitante emblematico de los arrecifes de Los Cobanos, donde se le observa en solitario o en parejas entre los 3 y 80 metros de profundidad.',
 'Omnivoro (esponjas, algas, tunicados, pequeños invertebrados)', '15-20 anos', 'Preocupacion menor',
 '25-35 cm', '400-700 g', 'Desove pelagico en pareja', 'Miles de huevos flotantes por desove',
 'Tiburones, peces grandes de arrecife',
 '22 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 3, 80, 'Los Cobanos, El Salvador',
 93, 47,
 '../public/media/3D_Models/clown_fish_low_poly_animated.glb',
 13.0, -0.1, 1.57, 2.2, 0.5),

-- 14 · Burrita Azul
(14, 'Burrita Azul', 'Abudefduf troschelii', 'peces',
 'Zona intermareal rocosa y arrecifes someros de Los Cobanos, 0-15 m',
 'Conocida como burrita o sargento del Pacifico oriental. Su cuerpo plateado-azulado porta cinco barras negras verticales caracteristicas. Forma cardumenes activos en la columna de agua sobre arrecifes rocosos y pozas de marea. Es uno de los peces mas visibles y abundantes en la zona de arrecife de Los Cobanos.',
 'Omnivoro (zooplancton, algas filamentosas, pequeños invertebrados)', '5-8 anos', 'Preocupacion menor',
 '12-20 cm', '60-150 g', 'Puesta adherida al sustrato cuidada por el macho', '200-1000 huevos por nidada',
 'Peces de arrecife medianos, aves marinas',
 '23 - 30 C', 'Marina (~34 ppt)', 'Zona fotica', 0, 15, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/blue fish.glb',
 3.0, -0.2, 1.57, 2.8, 0.7),

-- 15 · Burrita Negra
(15, 'Burrita Negra', 'Abudefduf concolor', 'peces',
 'Pozas de marea y rompientes rocosas de Los Cobanos, 0-10 m',
 'Prima cercana de la burrita azul, presenta un tono gris oscuro uniforme con leve iridiscencia. Habita zonas de rompiente y pozas de marea expuestas donde tolera corrientes fuertes y variaciones de temperatura. En Los Cobanos es frecuente en la franja intermareal rocosa.',
 'Herbivoro-omnivoro (algas filamentosas, detritus, pequeños invertebrados)', '4-7 anos', 'Preocupacion menor',
 '10-16 cm', '40-100 g', 'Puesta adherida a roca cuidada por el macho', '300-800 huevos por nidada',
 'Peces carnivoros de arrecife, aves marinas costeras',
 '23 - 31 C', 'Marina o ligeramente hipersalina', 'Zona intermareal y fotica', 0, 10, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/blue fish.glb',
 3.0, -0.2, 1.57, 2.8, 0.7),

-- 16 · Damisela de Acapulco
(16, 'Damisela de Acapulco', 'Stegastes acapulcoensis', 'peces',
 'Arrecifes rocosos y zonas de coral somero de Los Cobanos, 1-20 m',
 'Pequeno pez muy territorial que defiende activamente su jardin de algas frente a cualquier intruso incluyendo buceadores. Es abundante en los fondos rocosos entre 1 y 15 metros de Los Cobanos donde cultiva parches de algas como fuente de alimento exclusiva.',
 'Herbivoro (algas cultivadas en su territorio)', '5-10 anos', 'Preocupacion menor',
 '10-14 cm', '30-70 g', 'Puesta en sustrato duro cuidada por el macho', '100-500 huevos por nidada',
 'Peces carnivoros medianos, morenas',
 '23 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 20, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/blue fish.glb',
 3.0, -0.2, 1.57, 2.8, 0.7),

-- 17 · Damisela Azul
(17, 'Damisela Azul', 'Chromis atrilobata', 'peces',
 'Aguas abiertas sobre arrecifes rocosos de Los Cobanos, 2-30 m',
 'Una de las damiselas mas vistosas del Pacifico oriental. Color azul brillante uniforme con aleta caudal bifida que forma una caracteristica V. En Los Cobanos se observan grandes grupos filtrando zooplancton a media agua sobre cabezos rocosos.',
 'Zooplanctivoro (copepodos, larvas de invertebrados)', '5-8 anos', 'Preocupacion menor',
 '8-14 cm', '20-60 g', 'Puesta pelagica', 'Miles de huevos por ciclo reproductivo',
 'Peces pelagicos (pargo, jurel), cormoranes',
 '22 - 29 C', 'Marina (~34 ppt)', 'Zona fotica y epipelagica', 2, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/blue fish.glb',
 3.0, -0.2, 1.57, 2.8, 0.7),

-- 18 · Pez Cirujano de Cola Amarilla
(18, 'Pez Cirujano de Cola Amarilla', 'Prionurus punctatus', 'peces',
 'Arrecifes rocosos y zonas de corriente de Los Cobanos, 3-50 m',
 'Cirujano endemico del Pacifico oriental. Cuerpo gris oscuro con multiples puntos negros y una distintiva aleta caudal amarilla brillante. Tiene tres escalpelos en lugar de uno. Forma cardumenes densos que pastan sobre superficies rocosas repletas de algas en Los Cobanos.',
 'Herbivoro (algas bentonicas, diatomeas)', '10-15 anos', 'Preocupacion menor',
 '40-60 cm', '1-2.5 kg', 'Desove pelagico en grupo', 'Miles de huevos microscopicos',
 'Tiburones de arrecife, jureles grandes',
 '22 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 3, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/blue fish.glb',
 3.0, -0.2, 1.57, 2.8, 0.7),

-- 19 · Pez Cirujano de Aleta Amarilla
(19, 'Pez Cirujano de Aleta Amarilla', 'Acanthurus xanthopterus', 'peces',
 'Arrecifes rocosos profundos y fondos arenosos de Los Cobanos, 5-90 m',
 'El cirujano de mayor tamano del Pacifico oriental. Cuerpo ovalado de color gris-azulado con aletas pectorales amarillas y un anillo anaranjado alrededor del ojo. En Los Cobanos se le encuentra en fondos mixtos de roca y arena entre 10 y 60 metros.',
 'Herbivoro-detritivo (algas, diatomeas, detritus organico)', '12-18 anos', 'Preocupacion menor',
 '50-70 cm', '2-4 kg', 'Desove pelagico en grupo durante luna llena', 'Miles de huevos por ciclo',
 'Tiburones, jureles, peces pelagicos grandes',
 '20 - 28 C', 'Marina (~34 ppt)', 'Zona fotica y mesofotica', 5, 90, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/blue fish.glb',
 3.0, -0.2, 1.57, 2.8, 0.7),

-- 20 · Roncador Gris
(20, 'Roncador Gris', 'Haemulon steindachneri', 'peces',
 'Arrecifes rocosos y fondos mixtos de Los Cobanos, 5-40 m',
 'Pez conocido por el caracteristico sonido de grunido que produce al frotar sus dientes faringeos. En Los Cobanos forma bancos densos bajo salientes rocosos durante el dia y caza en fondos blandos de noche. Son importantes para la pesca artesanal de la comunidad.',
 'Carnivoro nocturno (pequeños crustaceos, gusanos, moluscos)', '8-12 anos', 'Preocupacion menor',
 '25-35 cm', '300-600 g', 'Desove pelagico estacional', 'Miles de huevos flotantes',
 'Peces grandes de arrecife, tiburones costeros',
 '22 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 5, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/clown_fish_low_poly_animated.glb',
 13.0, -0.1, 1.57, 2.2, 0.5),

-- 21 · Pargo Amarillo
(21, 'Pargo Amarillo', 'Lutjanus argentiventris', 'peces',
 'Arrecifes rocosos y manglares de Los Cobanos, 5-60 m',
 'Uno de los pargos mas llamativos del Pacifico oriental. Lomo rosado-rojizo con vientre y aletas de color amarillo brillante. En Los Cobanos es una de las especies de mayor valor para la pesca artesanal local. Los adultos forman grupos en cuevas y oquedades del arrecife durante el dia.',
 'Carnivoro (peces pequeños, crustaceos, cefalopodos)', '15-20 anos', 'Preocupacion menor',
 '30-60 cm', '0.5-3.5 kg', 'Desove pelagico en grupo', 'Cientos de miles de huevos',
 'Tiburones costeros, peces pelagicos grandes, humanos',
 '22 - 30 C', 'Marina (~34 ppt)', 'Zona fotica', 5, 60, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/clown_fish_low_poly_animated.glb',
 13.0, -0.1, 1.57, 2.2, 0.5),

-- 22 · Cabrilla Loro
(22, 'Cabrilla Loro', 'Serranus psittacinus', 'peces',
 'Fondos rocosos y coralinos de Los Cobanos, 3-50 m',
 'Pequeño serranido hermafrodita simultaneo, lo que significa que un mismo individuo puede funcionar como macho y hembra al mismo tiempo. Es un depredador de emboscada abundante en fondos rocosos entre 5 y 30 metros de Los Cobanos.',
 'Carnivoro (pequeños peces, camarones, cangrejos)', '6-10 anos', 'Preocupacion menor',
 '10-20 cm', '50-200 g', 'Hermafrodita simultaneo - desove pelagico', 'Miles de huevos por ciclo',
 'Peces de arrecife medianos, morenas, pulpos',
 '22 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 3, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/clown_fish_low_poly_animated.glb',
 13.0, -0.1, 1.57, 2.2, 0.5),

-- 23 · Tiburón Ballena
(23, 'Tiburon Ballena', 'Rhincodon typus', 'peces',
 'Aguas pelagicas y zonas costeras de Los Cobanos, 0-700 m',
 'El pez mas grande del mundo. A pesar de su enorme tamano es completamente inofensivo para los humanos. Filtra agua para alimentarse de plancton y peces pequenos. En Los Cobanos se avistan individuos entre junio y octubre, atraidos por la alta productividad oceanica del Pacifico salvadoreno. Es uno de los avistamientos mas espectaculares del buceo en la zona.',
 'Filtrador (plancton, huevos de peces, krill)', '70-100 anos', 'En peligro de extincion',
 '5-12 m', '5000-20000 kg', 'Ovipara-ovovivipara', '300 crias por camada',
 'Orcas (juveniles), humanos',
 '21 - 30 C', 'Marina (~34 ppt)', 'Zona fotica y epipelagica', 0, 700, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hammerhead_shark.glb',
 0.6, -0.2, 1.57, 3.0, 0.7),

-- 24 · Tiburón Martillo
(24, 'Tiburon Martillo', 'Sphyrna lewini', 'peces',
 'Aguas costeras y pelagicas de Los Cobanos, 0-275 m',
 'Reconocible por su peculiar cabeza en forma de T que le proporciona vision casi completa de 360 grados. En Los Cobanos se avistan cardumenes de tiburon martillo en los montes submarinos cercanos, especialmente entre julio y octubre. Es una de las especies mas amenazadas del Pacifico oriental por la pesca de aletas. Su presencia es indicador de un ecosistema marino saludable.',
 'Carnivoro (rayas, peces, calamares)', '20-30 anos', 'En peligro critico',
 '3-4 m', '150-300 kg', 'Vivipara', '15-30 crias por camada',
 'Orcas, tiburones mas grandes, humanos',
 '20 - 29 C', 'Marina (~35 ppt)', 'Zona fotica', 0, 275, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hammerhead_shark.glb',
 0.6, -0.2, 1.57, 3.0, 0.7),

-- 25 · Pez Vela del Pacífico
(25, 'Pez Vela del Pacifico', 'Istiophorus platypterus', 'peces',
 'Aguas pelagicas del Pacifico frente a Los Cobanos, 0-200 m',
 'El pez mas rapido del oceano, capaz de alcanzar 110 km/h. Su caracteristica aleta dorsal en forma de vela se despliega para acorralar cardumenes de peces pequenos. Frente a Los Cobanos es objetivo de la pesca deportiva de altura, siendo El Salvador uno de los destinos mas reconocidos del mundo para su captura y liberacion. Se avista frecuentemente desde embarcaciones entre noviembre y abril.',
 'Carnivoro (sardinas, anchoas, calamares)', '10-15 anos', 'Preocupacion menor',
 '2-3.5 m', '50-100 kg', 'Desove pelagico', 'Millones de huevos por temporada',
 'Tiburones grandes, orcas, humanos',
 '22 - 30 C', 'Marina (~34 ppt)', 'Zona epipelagica', 0, 200, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hammerhead_shark.glb',
 0.6, -0.2, 1.57, 3.0, 0.7),

-- 26 · Tortuga Carey
(26, 'Tortuga Carey', 'Eretmochelys imbricata', 'tortugas',
 'Arrecifes de coral y zonas rocosas de Los Cobanos, 0-30 m',
 'Una de las tortugas marinas mas amenazadas del mundo. Su caparazon con escamas superpuestas en forma de sierra es unico entre las tortugas marinas. En Los Cobanos se le observa buscando esponjas entre los arrecifes rocosos. Cumple un rol ecologico critico al controlar las poblaciones de esponjas en el arrecife, permitiendo el crecimiento del coral.',
 'Carnivora (esponjas, medusas, moluscos)', '30-50 anos', 'En peligro critico',
 '60-90 cm', '45-70 kg', 'Anidacion nocturna estacional', '130-160 huevos por nidada',
 'Tiburones, cocodrilos, humanos',
 '24 - 30 C', 'Marina (~35 ppt)', 'Zona fotica', 0, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/carey.glb',
 4, -0.2, -1.57, 3.2, 0.8),

-- 27 · Tortuga Golfina
(27, 'Tortuga Golfina', 'Lepidochelys olivacea', 'tortugas',
 'Aguas costeras y playas de anidacion de Los Cobanos, 0-50 m',
 'La tortuga marina mas abundante del mundo y la mas pequena. Conocida por sus arribadas masivas donde miles de hembras anidan simultaneamente en la misma playa en una sola noche. En El Salvador anida en las playas cercanas a Los Cobanos. Su nombre golfina viene del Golfo de Mexico aunque habita todos los oceanos tropicales.',
 'Omnivora (medusas, crustaceos, algas, peces pequenos)', '50-60 anos', 'Vulnerable',
 '60-75 cm', '35-50 kg', 'Arribadas masivas nocturnas', '100-110 huevos por nidada',
 'Tiburones, coyotes, humanos',
 '24 - 32 C', 'Marina (~35 ppt)', 'Zona fotica', 0, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/ridley_turtle_lepidochelys_olivacea.glb',
 1.2, -0.2, -1.57, 3.2, 0.8),

-- 28 · Tortuga Prieta
(28, 'Tortuga Prieta', 'Chelonia mydas agassizii', 'tortugas',
 'Pastos marinos y arrecifes rocosos de Los Cobanos, 0-40 m',
 'Subespecie del Pacifico oriental de la tortuga verde. De coloracion mas oscura que su pariente del Atlantico, de ahi su nombre popular. Es la unica tortuga marina herbivora en su etapa adulta. En Los Cobanos pasta los pastos marinos y algas de los fondos someros. Sus migraciones pueden superar los 2000 km entre las areas de alimentacion y las playas de anidacion.',
 'Herbivora adulta (pastos marinos, algas)', '70-80 anos', 'En peligro de extincion',
 '80-100 cm', '70-130 kg', 'Anidacion estacional nocturna', '100-120 huevos por nidada',
 'Tiburones, orcas, humanos',
 '23 - 30 C', 'Marina (~34 ppt)', 'Zona fotica', 0, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/ridley_turtle_lepidochelys_olivacea.glb',
 1.2, -0.2, -1.57, 3.2, 0.8),

-- 29 · Tortuga Baula
(29, 'Tortuga Baula', 'Dermochelys coriacea', 'tortugas',
 'Aguas pelagicas y costeras frente a Los Cobanos, 0-1000 m',
 'La tortuga marina mas grande y la que bucea mas profundo, alcanzando 1000 metros. A diferencia de las demas tortugas no tiene caparazon duro sino una piel correosa con crestas longitudinales. Se alimenta casi exclusivamente de medusas. Frente a Los Cobanos se avistan individuos durante sus migraciones transoceanicas. Esta en peligro critico de extincion a nivel global.',
 'Carnivora (medusas, sifonoforos)', '45-50 anos', 'Vulnerable',
 '140-180 cm', '300-700 kg', 'Anidacion nocturna en playas tropicales', '60-110 huevos por nidada',
 'Tiburones grandes, orcas, humanos',
 '20 - 32 C', 'Marina (~35 ppt)', 'Zona fotica y batipelagica', 0, 1000, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/ridley_turtle_lepidochelys_olivacea.glb',
 1.2, -0.2, -1.57, 3.2, 0.8),

-- 30 · Langosta Espinosa del Pacífico
(30, 'Langosta Espinosa del Pacifico', 'Panulirus gracilis', 'crustaceos',
 'Arrecifes rocosos y grietas de Los Cobanos, 1-60 m',
 'La langosta mas comun de los arrecifes rocosos de Los Cobanos. Carece de pinzas grandes y usa sus largas antenas espinosas para defenderse de depredadores. De noche sale de sus refugios a cazar. Es el crustaceo de mayor valor comercial para la pesca artesanal de Los Cobanos y esta sujeta a veda estacional para proteger su reproduccion.',
 'Omnivora (moluscos, erizos, algas, detritus)', '15-20 anos', 'Preocupacion menor',
 '25-45 cm', '0.5-4 kg', 'Puesta de huevos en abdomen', '50000-500000 huevos',
 'Pulpos, peces grandes, humanos',
 '20 - 29 C', 'Marina (~35 ppt)', 'Zona bentonica', 1, 60, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/langosta.glb',
 4.0, -0.15, 0.0, 3.0, 0.6),

-- 31 · Cangrejo Ermitaño
(31, 'Cangrejo Ermitano', 'Coenobita compressus', 'crustaceos',
 'Zona intermareal y playas de Los Cobanos, 0-5 m',
 'El cangrejo ermitano terrestre mas comun de las costas del Pacifico de El Salvador. A diferencia de los ermitanos marinos, pasa la mayor parte de su vida fuera del agua aunque necesita humedad. Usa conchas vacias de caracol como refugio y las cambia conforme crece. En Los Cobanos forma grandes grupos en la zona de playa y rompiente, siendo un personaje tipico del paisaje costero.',
 'Omnivoro (detritus, algas, frutos, carroña)', '10-15 anos', 'Preocupacion menor',
 '3-10 cm', '5-30 g', 'Puesta de huevos en el mar', 'Miles de huevos',
 'Aves costeras, peces, cangrejos mayores',
 '22 - 32 C', 'Semiterestre, tolera salobre', 'Intermareal y terrestre', 0, 5, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hermit crab.glb',
 2.3, -0.1, -25.0, 2.5, 0.5),

-- 32 · Cangrejo Porcelana
(32, 'Cangrejo Porcelana', 'Petrolisthes armatus', 'crustaceos',
 'Zona intermareal rocosa y arrecifes someros de Los Cobanos, 0-10 m',
 'Pequeno cangrejo aplanado que vive bajo piedras y en grietas del intermareal rocoso. A pesar de su nombre no es un verdadero cangrejo sino un anomuro, mas relacionado con las langostas. Filtra particulas organicas del agua con sus apendices plumosos. En Los Cobanos es extremadamente abundante bajo cualquier piedra del intermareal, siendo una fuente de alimento clave para peces y aves.',
 'Filtrador (particulas organicas, plancton)', '2-3 anos', 'Preocupacion menor',
 '1-3 cm', '1-5 g', 'Puesta de huevos en abdomen', 'Cientos de huevos por hembra',
 'Peces de intermareal, aves costeras, pulpos',
 '20 - 32 C', 'Marina o ligeramente salobre', 'Intermareal', 0, 10, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hermit crab.glb',
 2.3, -0.1, -25.0, 2.5, 0.5),

-- 33 · Cangrejo Fantasma
(33, 'Cangrejo Fantasma', 'Ocypode occidentalis', 'crustaceos',
 'Playas arenosas y zona supramareal de Los Cobanos, 0-1 m',
 'Corredor veloz de las playas arenosas de Los Cobanos. Su nombre viene de su capacidad para desaparecer instantaneamente en madrigueras que excava en la arena. De color arena que lo camufla perfectamente. Es activo principalmente al amanecer y al atardecer. Juega un papel importante como limpiador de playas al consumir restos organicos y huevos de tortugas no viables.',
 'Omnivoro (detritus, carroña, huevos, insectos)', '3-5 anos', 'Preocupacion menor',
 '3-6 cm', '10-40 g', 'Puesta de huevos en el mar', 'Miles de huevos larvarios',
 'Aves costeras, mapaches, zorros',
 '24 - 34 C', 'Semiterestre, tolera sal', 'Supramareal', 0, 1, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hermit crab.glb',
 2.3, -0.1, -25.0, 2.5, 0.5),

-- 34 · Cangrejo Moro
(34, 'Cangrejo Moro', 'Grapsus grapsus', 'crustaceos',
 'Rompiente rocosa e intermareal de Los Cobanos, 0-3 m',
 'El cangrejo mas llamativo de las rocas costeras de Los Cobanos. De color rojo-naranja brillante en adultos y negro en juveniles. Extraordinariamente agil, corre en todas direcciones por las rocas mojadas de la rompiente. Se alimenta principalmente de algas pero tambien de carroña y animales pequeños. Es el cangrejo mas fotografiado de las costas del Pacifico de El Salvador.',
 'Omnivoro (algas, detritus, carroña, invertebrados)', '5-8 anos', 'Preocupacion menor',
 '5-10 cm', '30-150 g', 'Puesta de huevos en el mar', 'Miles de huevos',
 'Pulpos, aves costeras, peces grandes',
 '22 - 32 C', 'Marina o salobre', 'Intermareal rocoso', 0, 3, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hermit crab.glb',
 2.3, -0.1, -25.0, 2.5, 0.5),

-- 35 · Camarón Pistola
(35, 'Camaron Pistola', 'Alpheus californiensis', 'crustaceos',
 'Fondos arenosos y grietas de arrecife de Los Cobanos, 1-30 m',
 'Produce uno de los sonidos mas fuertes del oceano con su pinza especializada, generando una burbuja de cavitacion que aturde o mata a sus presas. El chasquido puede alcanzar 218 decibelios. En Los Cobanos vive en grietas del arrecife y fondos arenosos, a menudo en simbiosis con gobios que le avisan de depredadores mientras el camaron excava y mantiene la madriguera compartida.',
 'Carnivoro (pequeños crustaceos, gusanos, peces pequenos)', '3-5 anos', 'Preocupacion menor',
 '3-6 cm', '2-8 g', 'Puesta de huevos en abdomen', 'Cientos de huevos por hembra',
 'Peces de arrecife, pulpos, peces gobio',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hermit crab.glb',
 2.3, -0.1, -25.0, 2.5, 0.5),

-- 36 · Camarón Limpiador
(36, 'Camaron Limpiador', 'Lysmata californica', 'crustaceos',
 'Grietas y salientes de arrecife rocoso de Los Cobanos, 3-40 m',
 'Opera estaciones de limpieza en el arrecife donde los peces hacen fila para ser desparasitados. Agita sus largas antenas blancas para anunciarse. Incluso los peces depredadores como las morenas respetan la tregua en la estacion de limpieza. En Los Cobanos es comun en grietas sombreadas entre 5 y 25 metros, siendo un actor clave en la salud del ecosistema del arrecife.',
 'Carnivoro (parasitos, tejido muerto, bacterias)', '2-3 anos', 'Preocupacion menor',
 '3-5 cm', '1-5 g', 'Hermafrodita simultaneo, puesta en abdomen', 'Cientos de huevos por ciclo',
 'Peces carnivoros (fuera de la estacion de limpieza), pulpos',
 '18 - 28 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 3, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hermit crab.glb',
 2.3, -0.1, -25.0, 2.5, 0.5),

-- 37 · Jaiba Azul del Pacífico
(37, 'Jaiba Azul del Pacifico', 'Callinectes arcuatus', 'crustaceos',
 'Fondos arenosos, estuarios y zonas costeras de Los Cobanos, 0-30 m',
 'Cangrejo nadador de gran importancia para la pesca artesanal de Los Cobanos. Sus patas traseras aplanadas en forma de paleta le permiten nadar activamente. Habita tanto aguas marinas como estuarinas y tolera grandes variaciones de salinidad. Es capturado con nasas y redes por pescadores locales. Su carne es muy apreciada en la gastronomia salvadorena.',
 'Omnivoro (peces, moluscos, detritus, algas)', '3-4 anos', 'Preocupacion menor',
 '10-20 cm', '100-400 g', 'Puesta de huevos en estuarios', '2000000 huevos por hembra',
 'Peces grandes, aves costeras, humanos',
 '20 - 32 C', 'Marina a estuarina (5-35 ppt)', 'Zona bentonica fotica', 0, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hermit crab.glb',
 2.3, -0.1, -25.0, 2.5, 0.5),

-- 38 · Cangrejo Araña
(38, 'Cangrejo Arana', 'Stenorhynchus debilis', 'crustaceos',
 'Arrecifes rocosos y fondos de algas de Los Cobanos, 3-50 m',
 'Cangrejo de patas largas y cuerpo triangular pequeno. Se camufla con esponjas, algas e hidroides que pega sobre su caparazon con sus quelas, creando un disfraz vivo que renueva constantemente. En Los Cobanos es frecuente en fondos con buena cobertura de invertebrados entre 5 y 30 metros. Permanece casi inmovil durante el dia confiando en su camuflaje.',
 'Carnivoro (invertebrados pequenos, detritus)', '2-4 anos', 'Preocupacion menor',
 '3-8 cm', '5-20 g', 'Puesta de huevos en abdomen', 'Miles de huevos por hembra',
 'Peces de arrecife, pulpos, estrellas de mar',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 3, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hermit crab.glb',
 2.3, -0.1, -25.0, 2.5, 0.5),

-- 39 · Langostina de Arena
(39, 'Langostina de Arena', 'Scyllarides astori', 'crustaceos',
 'Fondos arenosos y rocosos de Los Cobanos, 10-100 m',
 'Langosta zapatilla del Pacifico oriental, reconocible por su cuerpo aplanado y sus antenas en forma de paleta. Carece de pinzas y se camufla en fondos arenosos durante el dia. De noche caza activamente moluscos y erizos. En Los Cobanos se le encuentra en fondos mixtos entre 15 y 60 metros. Esta sujeta a presion pesquera por su carne muy apreciada en mercados locales.',
 'Carnivora (moluscos, erizos, crustaceos)', '10-15 anos', 'Datos insuficientes',
 '20-35 cm', '0.3-1.5 kg', 'Puesta de huevos en abdomen', 'Miles de huevos',
 'Pulpos, peces grandes, humanos',
 '18 - 28 C', 'Marina (~35 ppt)', 'Zona bentonica', 10, 100, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/langosta.glb',
 4.0, -0.15, 0.0, 3.0, 0.6),
 
 
-- 40 · Bailarina de Mar
(40, 'Bailarina de Mar', 'Elysia diomedea', 'moluscos',
 'Fondos rocosos y praderas de algas de Los Cobanos, 0-10 m',
 'Babosa marina de increible colorido que recibe su nombre por sus graciosos movimientos al nadar. Es un molusco gasterópodo que practica la cleptoplastia: retiene los cloroplastos de las algas que consume y los utiliza para realizar fotosíntesis durante semanas, siendo uno de los pocos animales con capacidad fotosintética. En Los Cobanos es avistada entre rocas y algas en aguas someras.',
 'Herbivora (algas filamentosas, especialmente algas verdes)', '1-2 anos', 'Preocupacion menor',
 '3-8 cm', '2-10 g', 'Hermafrodita, puesta de huevos en espiral', 'Cientos de huevos en cintas',
 'Peces pequeños, cangrejos, estrellas de mar',
 '20 - 28 C', 'Marina (~34 ppt)', 'Zona fotica', 0, 10, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/bailarina.glb',
 3.0, -0.1, -1.57, 2.5, 0.6),
 


-- 41 · Nudibranquio
(41, 'Nudibranquio', 'Dolabrifera dolabrifera', 'moluscos',
 'Arrecifes rocosos y grietas de Los Cobanos, 0-20 m',
 'Babosa marina con branquias externas en forma de plumas que le dan su nombre. Su cuerpo es aplanado y de color variable entre marrón, verde y gris, imitando perfectamente el sustrato rocoso donde vive. Es un experto en camuflaje que pasa desapercibido entre las algas y las rocas. Se alimenta de hidroides y briozoos, y almacena sus toxinas para defenderse de depredadores.',
 'Carnivora (hidroides, briozoos, ascidias)', '1-3 anos', 'Preocupacion menor',
 '3-7 cm', '2-15 g', 'Hermafrodita, puesta de huevos en masa', 'Miles de huevos en masa gelatinosa',
 'Peces de arrecife, cangrejos',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 0, 20, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/sea_slug.glb',
 1.0, -0.1, 0.0, 2.5, 0.6),

-- 42 · Pulpo de Roca del Pacífico
(42, 'Pulpo de Roca del Pacifico', 'Octopus bimaculatus', 'moluscos',
 'Arrecifes rocosos y grietas de Los Cobanos, 1-50 m',
 'Pulpo de tamaño mediano caracterizado por dos manchas azuladas en forma de ocelos a ambos lados de la cabeza. Es una de las especies de pulpo mas estudiadas del Pacifico oriental. Inteligente y curioso, utiliza su agilidad para cazar y escapar de depredadores. En Los Cobanos habita en grietas y oquedades del arrecife, siendo un depredador clave del ecosistema.',
 'Carnivora (cangrejos, langostas, moluscos, peces pequeños)', '2-3 anos', 'Preocupacion menor',
 '40-70 cm (envergadura)', '0.5-2.5 kg', 'Puesta de huevos en madriguera', '100000-500000 huevos',
 'Morenas, tiburones pequeños, lobos marinos, humanos',
 '18 - 28 C', 'Marina (~35 ppt)', 'Zona fotica bentonica', 1, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/octopus.glb',
 1.8, -0.15, 0.0, 3.0, 0.7),

-- 43 · Caracol Cono
(43, 'Caracol Cono', 'Conus princeps', 'moluscos',
 'Arrecifes rocosos y fondos arenosos de Los Cobanos, 1-30 m',
 'Caracol depredador de concha cónica con dibujos característicos en marrón y blanco. Posee un diente radular modificado en forma de arpón que inyecta una potente toxina neurotóxica para paralizar a sus presas. Es el caracol cono mas grande del Pacifico oriental y su toxina es objeto de estudio farmacológico. En Los Cobanos se le encuentra en fondos mixtos entre rocas y arena.',
 'Carnivora (gusanos marinos, otros moluscos, peces pequeños)', '5-10 anos', 'Preocupacion menor',
 '8-15 cm', '50-200 g', 'Puesta de huevos en capsulas', 'Decenas de huevos por capsula',
 'Peces grandes, cangrejos',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/shell.glb',
 1.5, -0.1, 0.0, 2.5, 0.5),

-- 44 · Caracol Murex
(44, 'Caracol Murex', 'Hexaplex princeps', 'moluscos',
 'Arrecifes rocosos y fondos de concha de Los Cobanos, 1-40 m',
 'Caracol de concha robusta con espinas y varices características de la familia Muricidae. Su concha de color blanco-crema con bandas marrones es muy apreciada por coleccionistas. Es un depredador activo que perfora conchas de otros moluscos con su rádula para alimentarse. En Los Cobanos es frecuente en fondos duros donde acecha a sus presas, especialmente bivalvos.',
 'Carnivora (bivalvos, otros caracoles, gusanos)', '5-8 anos', 'Preocupacion menor',
 '7-15 cm', '100-300 g', 'Puesta de huevos en capsulas', 'Miles de huevos',
 'Peces grandes, cangrejos, humanos',
 '20 - 30 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/shell.glb',
 1.5, -0.1, 0.0, 2.5, 0.5),

-- 45 · Cambute del Pacífico
(45, 'Cambute del Pacifico', 'Lobatus galeatus', 'moluscos',
 'Fondos arenosos y praderas de pastos marinos de Los Cobanos, 1-30 m',
 'Caracol de gran tamaño con concha robusta y labio ensanchado característico de los caracoles reina. Es el molusco gasterópodo mas grande de Los Cobanos. Su concha de gran valor comercial es usada en artesanía y su carne en alimentación. Habita fondos arenosos donde pasta algas y detritos. Lento pero efectivo, es un herbivoro que juega rol en el equilibrio del ecosistema.',
 'Herbivora (algas, pastos marinos, detritus)', '10-20 anos', 'Vulnerable',
 '15-25 cm', '0.5-2 kg', 'Puesta de huevos en cintas', 'Miles de huevos',
 'Peces grandes, pulpos, humanos',
 '20 - 30 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/shell.glb',
 1.5, -0.1, 0.0, 2.5, 0.5),

-- 46 · Ostra de Roca
(46, 'Ostra de Roca', 'Striostrea prismatica', 'moluscos',
 'Arrecifes rocosos y zona intermareal de Los Cobanos, 0-15 m',
 'Ostra de concha gruesa y prismática que se fija firmemente a rocas y otros sustratos duros formando bancos. Es una especie clave en la estructura del arrecife porque crea sustrato para otros organismos. En Los Cobanos forma densos agrupamientos en la zona intermareal y submareal somera. Es explotada por pescadores locales para su consumo y tiene un papel vital en la filtración del agua.',
 'Filtrador (plancton, particulas organicas en suspension)', '5-10 anos', 'Preocupacion menor',
 '5-12 cm', '100-400 g', 'Puesta de huevos y esperma en el agua', 'Millones de huevos',
 'Estrellas de mar, caracoles depredadores, aves costeras, humanos',
 '18 - 32 C', 'Marina a estuarina (25-35 ppt)', 'Zona fotica', 0, 15, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/clam.glb',
 1.2, -0.1, 0.0, 2.5, 0.5),

-- 47 · Almeja del Pacífico
(47, 'Almeja del Pacifico', 'Periglypta mactrae', 'moluscos',
 'Fondos arenosos y barrosos de Los Cobanos, 1-25 m',
 'Almeja de concha gruesa y ovalada con finas líneas concéntricas de color blanco-crema. Habita fondos arenosos donde se entierra parcialmente y filtra el agua para alimentarse. Es un bivalvo importante para la pesca artesanal de Los Cobanos. Su carne es apreciada para sopas y ceviches. Es sensible a la contaminación de los sedimentos y a la pesca sin regulación.',
 'Filtrador (plancton, bacterias, particulas organicas)', '5-12 anos', 'Preocupacion menor',
 '6-12 cm', '50-200 g', 'Puesta de huevos y esperma en el agua', 'Miles de huevos',
 'Estrellas de mar, caracoles depredadores, peces, humanos',
 '18 - 30 C', 'Marina a estuarina (20-35 ppt)', 'Zona fotica bentonica', 1, 25, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/clam.glb',
 1.2, -0.1, 0.0, 2.5, 0.5),

-- 48 · Chitón
(48, 'Chiton', 'Chiton articulatus', 'moluscos',
 'Zona intermareal rocosa de Los Cobanos, 0-3 m',
 'Molusco primitivo de concha formada por ocho placas articuladas que le permiten enrollarse para protegerse. Se adhiere firmemente a las rocas de la zona intermareal usando su pie musculoso. Es un herbivoro que raspa algas de las rocas con su rádula. En Los Cobanos es abundante en la zona de rompiente, siendo un componente característico del intermareal rocoso.',
 'Herbivora (algas, diatomeas, biofilm)', '3-5 anos', 'Preocupacion menor',
 '3-6 cm', '10-40 g', 'Puesta de huevos y esperma en el agua', 'Miles de huevos',
 'Aves costeras, cangrejos, estrellas de mar, humanos',
 '18 - 32 C', 'Marina (~34 ppt)', 'Intermareal', 0, 3, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/snail.glb',
 1.5, -0.1, 0.0, 2.5, 0.5),

-- 49 · Calamar Dedal
(49, 'Calamar Dedal', 'Lolliguncula panamensis', 'moluscos',
 'Aguas costeras abiertas frente a Los Cobanos, 1-50 m',
 'Calamar pequeño de cuerpo corto y robusto, de aspecto que recuerda a un dedal. Es el calamar mas común en aguas someras del Pacifico de El Salvador. Forma cardúmenes que se desplazan rapidamente en aguas abiertas. Es una presa clave para peces depredadores y aves marinas. Su captura es estacional y se usa principalmente como carnada para pesca deportiva.',
 'Carnivora (peces pequeños, crustáceos, otros calamares)', '1-2 anos', 'Preocupacion menor',
 '8-15 cm (total)', '20-80 g', 'Puesta de huevos en capsulas gelatinosas', '100-300 huevos',
 'Peces grandes, tiburones, aves marinas, lobos marinos, humanos',
 '20 - 30 C', 'Marina (~35 ppt)', 'Zona fotica', 1, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/squid.glb',
 1.5, -0.1, 0.0, 2.5, 0.6),

-- 50 · Pez Lora Gigante
(50, 'Pez Lora Gigante', 'Scarus perrico', 'peces',
 'Arrecifes rocosos y coralinos de Los Cobanos, 1-30 m',
 'El pez loro mas grande del Pacifico oriental. De colores vibrantes que varian con la edad y el sexo, los machos adultos son azul-verdes y las hembras marrones o rojizas. Posee un pico fusionado similar al de un loro que usa para raspar algas y coral muerto de las rocas. Es el principal productor de arena en el arrecife, ya que tritura el coral y lo excreta como arena fina.',
 'Herbivora (algas, corales muertos, biofilm)', '10-15 anos', 'Preocupacion menor',
 '40-70 cm', '1.5-5 kg', 'Hermafrodita protoginico (hembra->macho)', 'Miles de huevos pelagicos',
 'Tiburones, morenas, peces grandes, humanos',
 '22 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/parrotfish.glb',
 1.5, -0.15, 0.0, 3.0, 0.7),

-- 51 · Pez Piedra o Escorpión
(51, 'Pez Piedra o Escorpion', 'Scorpaena mystes', 'peces',
 'Arrecifes rocosos y fondos de cascajo de Los Cobanos, 1-40 m',
 'Maestro del camuflaje, parece una roca cubierta de algas. De coloracion variable entre rojo, marron y verde, con apendices carnosos que imitan algas. Sus aletas dorsales tienen espinas venenosas que pueden causar dolor intenso y reacciones sistemica. Embosca a sus presas con una succion rapidisima. En Los Cobanos es frecuente en fondos rocosos con cobertura de algas.',
 'Carnivora (peces pequeños, crustaceos)', '5-10 anos', 'Preocupacion menor',
 '20-40 cm', '0.3-1.5 kg', 'Puesta de huevos en masa gelatinosa', 'Miles de huevos',
 'Morenas, tiburones, peces grandes',
 '18 - 28 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/stonefish.glb',
 1.2, -0.15, 0.0, 2.8, 0.6),

-- 52 · Murena Verde
(52, 'Murena Verde', 'Gymnothorax castaneus', 'peces',
 'Grietas y oquedades de arrecifes rocosos de Los Cobanos, 1-40 m',
 'Morena de gran tamaño con cuerpo de color verde-marron uniforme, sin patrones. Es una depredadora nocturna que pasa el dia escondida en grietas con la cabeza asomando y la boca abierta para respirar. Tiene una segunda mandibula faringea que se proyecta hacia adelante para atrapar presas. En Los Cobanos es la morena mas comun y temida por pescadores por su mordida poderosa.',
 'Carnivora (peces, pulpos, crustaceos)', '15-25 anos', 'Preocupacion menor',
 '60-120 cm', '1.5-6 kg', 'Puesta de huevos pelagicos', 'Miles de huevos',
 'Tiburones, peces grandes',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/moray_eel.glb',
 1.2, -0.1, 0.0, 2.8, 0.6),

-- 53 · Pez Mariposa de Nariz Larga
(53, 'Pez Mariposa de Nariz Larga', 'Forcipiger flavissimus', 'peces',
 'Arrecifes rocosos y coralinos de Los Cobanos, 1-30 m',
 'Pez de increible colorido con un hocico extremadamente alargado y delgado que usa para alcanzar presas en grietas estrechas. Cuerpo amarillo brillante con cabeza negra y banda blanca. Es una de las especies mas llamativas de Los Cobanos. Se mueve en parejas y es territorial, defendiendo su area de alimentacion. Es un indicador de salud del arrecife.',
 'Carnivora (pequeños crustaceos, huevos, poliquetos)', '5-8 anos', 'Preocupacion menor',
 '10-20 cm', '20-60 g', 'Pareja monogama, puesta pelagica', 'Miles de huevos',
 'Peces grandes, morenas',
 '22 - 28 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/butterflyfish.glb',
 1.2, -0.1, 0.0, 2.5, 0.6),

-- 54 · Pez Halcón Coralino
(54, 'Pez Halcon Coralino', 'Cirrhitichthys oxycephalus', 'peces',
 'Arrecifes rocosos y coralinos de Los Cobanos, 1-30 m',
 'Pez de cuerpo robusto con patron de camuflaje que imita el coral. Tiene una mancha oscura en la aleta dorsal que usa como señuelo para atraer presas, y pequenos apendices carnosos en la aleta dorsal que le dan su nombre. Es un emboscador que espera pacientemente sobre el coral para lanzarse sobre crustaceos y peces pequeños. Es territorial y defiende su roca.',
 'Carnivora (crustaceos, peces pequeños)', '5-10 anos', 'Preocupacion menor',
 '6-12 cm', '10-30 g', 'Puesta de huevos pelagicos', 'Miles de huevos',
 'Peces grandes, morenas',
 '22 - 28 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hawkfish.glb',
 1.0, -0.1, 0.0, 2.5, 0.6),

-- 55 · Mero Guasa
(55, 'Mero Guasa', 'Epinephelus quinquefasciatus', 'peces',
 'Arrecifes rocosos y oquedades de Los Cobanos, 1-60 m',
 'Mero de gran tamaño con cuerpo robusto y coloracion marron con cinco bandas oscuras verticales. Es un depredador de emboscada que pasa el dia en oquedades y sale al atardecer a cazar. Es hermafrodita protoginico: todas las hembras pueden transformarse en machos. Es una especie clave en el arrecife pero esta muy presionada por la pesca deportiva y comercial.',
 'Carnivora (peces, crustaceos, pulpos)', '15-25 anos', 'Vulnerable',
 '50-100 cm', '5-25 kg', 'Hermafrodita protoginico', 'Miles de huevos',
 'Tiburones, humanos',
 '20 - 28 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 60, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/grouper.glb',
 1.5, -0.15, 0.0, 3.0, 0.7),

-- 56 · Pez Globo de Puntos Blancos
(56, 'Pez Globo de Puntos Blancos', 'Arothron hispidus', 'peces',
 'Arrecifes rocosos y fondos de algas de Los Cobanos, 1-30 m',
 'Pez globo de cuerpo inflable cubierto de pequenas espinas y puntos blancos sobre fondo marron-grisaceo. Cuando se siente amenazado se infla como un globo para parecer mas grande y mostrar sus espinas. Posee tetrodotoxina, una neurotoxina letal, en sus organos internos. En Los Cobanos es comun en fondos de algas y arrecifes, donde pasta algas e invertebrados.',
 'Omnivora (algas, esponjas, crustaceos, moluscos)', '5-10 anos', 'Preocupacion menor',
 '20-45 cm', '0.5-2 kg', 'Puesta de huevos demersales', 'Miles de huevos',
 'Tiburones, peces grandes (inmunes a toxina)',
 '22 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/pufferfish.glb',
 1.5, -0.15, 0.0, 2.8, 0.6),

-- 57 · Pez Corneta
(57, 'Pez Corneta', 'Fistularia commersonii', 'peces',
 'Aguas costeras abiertas y arrecifes de Los Cobanos, 1-50 m',
 'Pez de cuerpo extremadamente alargado en forma de tubo, con un hocico largo terminado en boca pequena. Nada casi verticalmente entre los arrecifes, camuflado entre las algas y corales. Tiene una linea dorsal de color azul brillante que lo hace inconfundible. Es un depredador de acecho que se acerca lentamente a sus presas antes de lanzar su hocico como un arpon.',
 'Carnivora (peces pequeños, crustaceos)', '5-10 anos', 'Preocupacion menor',
 '50-100 cm', '0.2-1 kg', 'Puesta de huevos pelagicos', 'Miles de huevos',
 'Peces grandes, tiburones',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/cornetfish.glb',
 1.5, -0.1, 0.0, 3.0, 0.6),

-- 58 · Pez Timón Amarillo
(58, 'Pez Timon Amarillo', 'Kyphosus analogus', 'peces',
 'Arrecifes rocosos y praderas de algas de Los Cobanos, 1-25 m',
 'Pez plateado con tonos amarillos y lineas longitudinales, de cuerpo alto y comprimido. Forma cardumenes que pastan algas en los arrecifes rocosos. Es herbivoro y juega un rol importante controlando el crecimiento de algas en el arrecife. Su nombre viene de su habilidad para nadar cerca de la superficie con la aleta dorsal erecta como un timon. Es frecuente en Los Cobanos.',
 'Herbivora (algas, pastos marinos)', '5-10 anos', 'Preocupacion menor',
 '30-50 cm', '0.5-2 kg', 'Puesta de huevos pelagicos', 'Miles de huevos',
 'Tiburones, peces grandes, humanos',
 '20 - 30 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 25, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/sea_chub.glb',
 1.2, -0.1, 0.0, 2.8, 0.6),

-- 59 · Ídolo Moro
(59, 'Idolo Moro', 'Zanclus cornutus', 'peces',
 'Arrecifes rocosos y coralinos de Los Cobanos, 1-30 m',
 'Uno de los peces mas bellos del arrecife, con cuerpo blanco y negro con franjas amarillas y una prolongacion en forma de cuerno en la frente. Es el unico miembro de su familia y es iconico en los arrecifes del Pacifico. Se alimenta de esponjas, tunicados y algas. En Los Cobanos es comun en parejas o pequenos grupos, siendo muy buscado por acuaristas aunque dificil de mantener.',
 'Omnivora (esponjas, tunicados, algas, detritus)', '5-10 anos', 'Preocupacion menor',
 '15-25 cm', '100-300 g', 'Pareja monogama, puesta pelagica', 'Miles de huevos',
 'Morenas, peces grandes',
 '22 - 28 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/moorish_idol.glb',
 1.2, -0.1, 0.0, 2.5, 0.6),

-- 60 · Pez Lagarto del Pacífico
(60, 'Pez Lagarto del Pacifico', 'Synodus lucioceps', 'peces',
 'Fondos arenosos y de cascajo de Los Cobanos, 1-50 m',
 'Pez de cuerpo alargado con cabeza de reptil y grandes ojos. Se entierra parcialmente en la arena dejando solo los ojos y la boca expuestos para emboscar a sus presas. Es un depredador extremadamente rapido que se lanza verticalmente para capturar peces que pasan. En Los Cobanos es comun en fondos arenosos y de cascajo entre 5 y 30 metros.',
 'Carnivora (peces pequeños, crustaceos)', '5-10 anos', 'Preocupacion menor',
 '30-50 cm', '0.3-1 kg', 'Puesta de huevos pelagicos', 'Miles de huevos',
 'Peces grandes, tiburones',
 '18 - 28 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/lizardfish.glb',
 1.2, -0.1, 0.0, 2.8, 0.6),

-- 61 · Chame
(61, 'Chame', 'Dormitator latifrons', 'peces',
 'Estuarios, manglares y desembocaduras de rios cerca de Los Cobanos, 0-5 m',
 'Pez de cuerpo robusto y cabeza grande que habita aguas salobres y dulces. Es un pez que respira aire gracias a un organo suprabranquial, permitiendole sobrevivir en aguas con bajo oxigeno. Es el pez mas consumido en la cocina tradicional salvadorena, especialmente en sopa de chame. En Los Cobanos se pesca en los estuarios y manglares cercanos.',
 'Omnivora (insectos, crustaceos, detritus, algas)', '5-8 anos', 'Preocupacion menor',
 '20-40 cm', '0.2-1 kg', 'Puesta de huevos en aguas dulces/salobres', 'Miles de huevos',
 'Peces grandes, aves, humanos',
 '20 - 32 C', 'Dulce a salobre (0-20 ppt)', 'Epipelagica', 0, 5, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/bigmouth_sleeper.glb',
 1.2, -0.1, 0.0, 2.5, 0.6),

-- 62 · Pez Cornudo
(62, 'Pez Cornudo', 'Bodianus diplotaenia', 'peces',
 'Arrecifes rocosos y fondos de cascajo de Los Cobanos, 1-40 m',
 'Pez de la familia de los labridos con cuerpo alargado y colores brillantes que cambian con la edad. Los juveniles son negros con rayas blancas; los adultos son azul-violeta con franjas amarillas. Los machos grandes desarrollan una protuberancia en la frente de ahi su nombre. Es un depredador que usa su hocico alargado para alcanzar presas en grietas.',
 'Carnivora (crustaceos, moluscos, erizos, peces pequeños)', '5-10 anos', 'Preocupacion menor',
 '25-45 cm', '0.5-2 kg', 'Hermafrodita protoginico', 'Miles de huevos',
 'Morenas, peces grandes',
 '20 - 28 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hogfish.glb',
 1.2, -0.1, 0.0, 2.8, 0.6),

-- 63 · Raya Águila
(63, 'Raya Aguila', 'Aetobatus laticeps', 'peces',
 'Aguas costeras abiertas y arrecifes de Los Cobanos, 1-50 m',
 'Raya de gran tamaño con cabeza prominente y discos pectorales en forma de ala. De color negro con puntos blancos en el dorso y vientre blanco. Se desplaza con gracia ondulando sus alas pectorales, pareciendo volar bajo el agua. Se alimenta de moluscos y crustaceos que encuentra en el fondo. En Los Cobanos se observa en cardumenes durante las mareas altas.',
 'Carnivora (moluscos, crustaceos, peces pequeños)', '10-15 anos', 'Vulnerable',
 '100-200 cm (envergadura)', '30-80 kg', 'Vivipara aplacental', '3-4 crias por camada',
 'Tiburones, orcas, humanos',
 '20 - 30 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/eagle_ray.glb',
 1.5, -0.2, 0.0, 3.5, 0.7),

-- 64 · Pez Vela del Pacífico
(64, 'Pez Vela del Pacifico', 'Istiophorus platypterus', 'peces',
 'Aguas pelagicas frente a Los Cobanos, 1-200 m',
 'Uno de los peces mas veloces del oceano, capaz de alcanzar 110 km/h. Su enorme aleta dorsal en forma de vela se pliega en una ranura cuando nada rapidamente. Es un depredador de aguas abiertas que usa su pico para aturdir y capturar cardumenes. En Los Cobanos se avistan ejemplares durante la temporada de pesca deportiva, siendo una de las especies mas codiciadas.',
 'Carnivora (peces pelagicos, calamares)', '5-10 anos', 'Preocupacion menor',
 '200-300 cm', '30-60 kg', 'Puesta de huevos pelagicos', 'Millones de huevos',
 'Tiburones, orcas, humanos',
 '22 - 30 C', 'Marina (~35 ppt)', 'Epipelagica', 1, 200, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/sailfish.glb',
 1.8, -0.15, 0.0, 4.0, 0.8),

-- 65 · Cangrejo de Piedra del Pacífico
(65, 'Cangrejo de Piedra del Pacifico', 'Menippe frontalis', 'crustaceos',
 'Arrecifes rocosos y oquedades de Los Cobanos, 1-30 m',
 'Cangrejo de gran tamaño con caparazon duro y robusto, de color marron-rojizo. Posee pinzas masivas y asimetricas, una mas grande para triturar y otra mas pequena para manipular. Es un depredador clave en el arrecife, alimentandose de moluscos de concha dura y erizos. En Los Cobanos habita en oquedades del arrecife rocoso y es muy apreciado en la gastronomia local.',
 'Carnivora (moluscos, erizos, cangrejos pequeños, carrona)', '8-12 anos', 'Preocupacion menor',
 '8-15 cm', '0.3-1 kg', 'Puesta de huevos en abdomen', 'Miles de huevos',
 'Pulpos, peces grandes, humanos',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona bentonica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.5, -0.15, 0.0, 3.0, 0.6),

-- 66 · Cangrejo Moro de Roca
(66, 'Cangrejo Moro de Roca', 'Grapsus grapsus', 'crustaceos',
 'Zona intermareal rocosa y rompiente de Los Cobanos, 0-5 m',
 'Cangrejo de colores brillantes que va del naranja al rojo oscuro, con caparazon aplanado. Es el cangrejo mas agil de la zona de rompiente, capaz de correr en cualquier direccion sobre rocas mojadas. Los juveniles son negros y los adultos adquieren colores vivos con la madurez. Se alimenta de algas y detritus, siendo importante para mantener las rocas limpias.',
 'Omnivora (algas, detritus, carrona, invertebrados pequeños)', '5-8 anos', 'Preocupacion menor',
 '5-10 cm', '30-150 g', 'Puesta de huevos en el mar', 'Miles de huevos',
 'Pulpos, aves costeras, peces grandes',
 '22 - 32 C', 'Marina (~34 ppt)', 'Intermareal', 0, 5, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.5, -0.15, 0.0, 3.0, 0.6),

-- 67 · Cangrejo de Pinzas Rojas
(67, 'Cangrejo de Pinzas Rojas', 'Leptodius cookae', 'crustaceos',
 'Zona intermareal y pozas de marea de Los Cobanos, 0-3 m',
 'Cangrejo de pequeño tamaño con pinzas de color rojo intenso que contrastan con su caparazon marron-grisaceo. Es abundante bajo piedras y en grietas del intermareal. Es un omnivoro oportunista que se alimenta de lo que encuentra. Su coloracion roja en las pinzas es una señal de advertencia para depredadores. Es una especie clave en las pozas de marea.',
 'Omnivora (algas, detritus, invertebrados pequeños)', '2-4 anos', 'Preocupacion menor',
 '2-4 cm', '2-10 g', 'Puesta de huevos en abdomen', 'Cientos de huevos',
 'Peces de intermareal, aves, pulpos',
 '20 - 32 C', 'Marina (~34 ppt)', 'Intermareal', 0, 3, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.5, -0.15, 0.0, 3.0, 0.6),

-- 68 · Camarón de Presión de Panamá
(68, 'Camaron de Presion de Panama', 'Alpheus panamensis', 'crustaceos',
 'Fondos arenosos y grietas de arrecife de Los Cobanos, 1-30 m',
 'Camaron con una pinza enorme especializada que produce un chasquido de cavitacion para aturdir presas. Vive en simbiosis con peces gobios que le advierten de depredadores. Es una especie hermana del camaron pistola californiano pero con distribucion panameña. En Los Cobanos es comun en fondos arenosos con conchas y en grietas del arrecife somero.',
 'Carnivora (pequeños crustaceos, gusanos)', '3-5 anos', 'Preocupacion menor',
 '3-5 cm', '2-5 g', 'Puesta de huevos en abdomen', 'Cientos de huevos',
 'Peces de arrecife, pulpos',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/shrimp.glb',
 2.0, -0.1, 0.0, 2.5, 0.6),

-- 69 · Cangrejo Ermitaño de Cabo
(69, 'Cangrejo Ermitano de Cabo', 'Calcinus obscurus', 'crustaceos',
 'Zona intermareal y submareal somero de Los Cobanos, 0-10 m',
 'Cangrejo ermitaño de color oscuro con patas anilladas y ojos en largos pedunculos. Usa conchas de caracol como refugio, prefiriendo las de la familia Neritidae. Es muy comun en la zona intermareal de Los Cobanos, especialmente en pozas de marea y grietas rocosas. Se alimenta de detritus y algas, siendo un importante reciclador de nutrientes en el intermareal.',
 'Omnivora (detritus, algas, carrona)', '3-5 anos', 'Preocupacion menor',
 '2-4 cm', '2-10 g', 'Puesta de huevos en el mar', 'Miles de huevos',
 'Peces, aves costeras, cangrejos mayores',
 '20 - 32 C', 'Marina (~34 ppt)', 'Intermareal y fotica', 0, 10, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/hermit_crab.glb',
 2.0, -0.1, 0.0, 2.5, 0.6),

-- 70 · Cangrejo Nadador de Arena
(70, 'Cangrejo Nadador de Arena', 'Portunus asper', 'crustaceos',
 'Fondos arenosos y de cascajo de Los Cobanos, 1-30 m',
 'Cangrejo de caparazon aplanado con patas traseras en forma de paleta que le permiten nadar activamente. Es de color marron-arenoso con manchas mas oscuras que lo camuflan en el fondo. Es un depredador activo y rapido que caza en fondos arenosos. En Los Cobanos es comun en fondos de arena y cascajo, siendo capturado por pescadores artesanales.',
 'Carnivora (peces pequeños, moluscos, crustaceos)', '3-5 anos', 'Preocupacion menor',
 '8-15 cm', '100-300 g', 'Puesta de huevos en abdomen', 'Miles de huevos',
 'Peces grandes, pulpos, humanos',
 '20 - 30 C', 'Marina (~34 ppt)', 'Zona bentonica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.5, -0.15, 0.0, 3.0, 0.6),

-- 71 · Cangrejo Esponja
(71, 'Cangrejo Esponja', 'Dromia erythropus', 'crustaceos',
 'Arrecifes rocosos y fondos de cascajo de Los Cobanos, 1-40 m',
 'Cangrejo que usa sus dos ultimas patas para sostener una esponja viva sobre su caparazon como camuflaje y defensa. La esponja crece sobre el cangrejo, proporcionandole un disfraz perfecto. Es un cangrejo de cuerpo redondeado y patas cortas, poco agil comparado con otros cangrejos. En Los Cobanos es frecuente en arrecifes con esponjas y en fondos de cascajo.',
 'Omnivora (esponjas, detritus, algas, invertebrados)', '5-8 anos', 'Preocupacion menor',
 '4-8 cm', '30-100 g', 'Puesta de huevos en abdomen', 'Miles de huevos',
 'Pulpos, peces grandes',
 '20 - 28 C', 'Marina (~34 ppt)', 'Zona bentonica', 1, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.5, -0.15, 0.0, 3.0, 0.6),

-- 72 · Cangrejo Violinista
(72, 'Cangrejo Violinista', 'Uca princeps', 'crustaceos',
 'Playas fangosas y estuarios cerca de Los Cobanos, 0-2 m',
 'Cangrejo con una pinza desproporcionadamente grande que los machos usan para atraer hembras y defender territorio. Su nombre viene del movimiento de la pinza que parece estar tocando un violin. Los machos tienen una pinza gigante y otra normal; las hembras tienen ambas pequenas. En Los Cobanos es abundante en playas fangosas y manglares cercanos.',
 'Omnivora (detritus, algas, bacterias del fango)', '2-3 anos', 'Preocupacion menor',
 '2-4 cm', '5-20 g', 'Puesta de huevos en el mar', 'Miles de huevos',
 'Aves costeras, peces, cangrejos mayores',
 '22 - 34 C', 'Salobre a dulce (0-30 ppt)', 'Intermareal fangoso', 0, 2, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.0, -0.1, 0.0, 2.5, 0.6),

-- 73 · Cangrejo Araña Narigón
(73, 'Cangrejo Arana Narigon', 'Stenorhynchus debilis', 'crustaceos',
 'Arrecifes rocosos y fondos de algas de Los Cobanos, 3-50 m',
 'Cangrejo de patas extremadamente largas y cuerpo triangular. Se cubre de algas, esponjas e hidroides para camuflarse, fijandolos a su caparazon con sus quelas. Es un maestro del disfraz que permanece inmóvil durante el dia. En Los Cobanos es frecuente entre rocas y algas donde su camuflaje lo hace casi invisible. Es un depredador de pequeños invertebrados.',
 'Carnivora (invertebrados pequeños, detritus)', '2-4 anos', 'Preocupacion menor',
 '3-8 cm', '5-20 g', 'Puesta de huevos en abdomen', 'Miles de huevos',
 'Peces de arrecife, pulpos',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 3, 50, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.5, -0.15, 0.0, 3.0, 0.6),

-- 74 · Langosta de Arena
(74, 'Langosta de Arena', 'Scyllarides astori', 'crustaceos',
 'Fondos arenosos y rocosos de Los Cobanos, 10-100 m',
 'Langosta aplanada con antenas en forma de paleta, sin pinzas. Su cuerpo es de color marron-arenoso que le permite camuflarse en el fondo. Es nocturna: de dia permanece enterrada en la arena y de noche sale a cazar moluscos y erizos. En Los Cobanos se encuentra en fondos mixtos de arena y roca entre 15 y 60 metros, siendo apreciada por su carne.',
 'Carnivora (moluscos, erizos, crustaceos)', '10-15 anos', 'Datos insuficientes',
 '20-35 cm', '0.3-1.5 kg', 'Puesta de huevos en abdomen', 'Miles de huevos',
 'Pulpos, peces grandes, humanos',
 '18 - 28 C', 'Marina (~35 ppt)', 'Zona bentonica', 10, 100, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/langosta.glb',
 4.0, -0.15, 0.0, 3.0, 0.6),

-- 75 · Cangrejo de Coral
(75, 'Cangrejo de Coral', 'Trapezia ferruginea', 'crustaceos',
 'Arrecifes coralinos de Los Cobanos, 1-30 m',
 'Cangrejo de pequeño tamaño que vive exclusivamente asociado a corales, especialmente del genero Pocillopora. Es un mutualista: defiende al coral de depredadores como estrellas de mar, y el coral le proporciona refugio y alimento. Su caparazon liso y colores que imitan el coral lo hacen casi invisible. En Los Cobanos es comun en arrecifes de coral.',
 'Carnivora (plancton, detritus, invertebrados pequeños)', '3-5 anos', 'Preocupacion menor',
 '1-3 cm', '1-5 g', 'Puesta de huevos en abdomen', 'Cientos de huevos',
 'Peces de arrecife, pulpos',
 '22 - 28 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.0, -0.1, 0.0, 2.5, 0.6),

-- 76 · Cangrejo Decorador
(76, 'Cangrejo Decorador', 'Podochela hemphilli', 'crustaceos',
 'Arrecifes rocosos y fondos de algas de Los Cobanos, 1-40 m',
 'Cangrejo de patas extremadamente largas y cuerpo pequeño que se cubre de algas y otros organismos para camuflarse. Su habilidad para decorarse con el material disponible es asombrosa: pega algas, esponjas, hidroides y briozoos en su caparazon. Es casi invisible cuando esta inmóvil entre las algas. En Los Cobanos es comun en fondos con algas y en arrecifes.',
 'Omnivora (algas, detritus, invertebrados pequeños)', '2-4 anos', 'Preocupacion menor',
 '2-6 cm', '2-15 g', 'Puesta de huevos en abdomen', 'Miles de huevos',
 'Peces, pulpos',
 '20 - 28 C', 'Marina (~34 ppt)', 'Zona bentonica', 1, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.5, -0.15, 0.0, 3.0, 0.6),

-- 77 · Camarón Camello
(77, 'Camaron Camello', 'Rhynchocinetes typus', 'crustaceos',
 'Grietas y oquedades de arrecifes rocosos de Los Cobanos, 3-40 m',
 'Camaron de cuerpo alargado con un rostro prominente y articulado que puede mover hacia arriba y abajo. Es de color rojo con bandas blancas, muy llamativo. Es nocturno: de dia se esconde en grietas y de noche sale a alimentarse. En Los Cobanos es frecuente en arrecifes rocosos con buena cobertura de grietas y oquedades entre 5 y 25 metros.',
 'Omnivora (detritus, plancton, invertebrados pequeños)', '2-4 anos', 'Preocupacion menor',
 '4-8 cm', '5-20 g', 'Puesta de huevos en abdomen', 'Cientos de huevos',
 'Peces de arrecife, pulpos',
 '20 - 28 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 3, 40, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/shrimp.glb',
 2.0, -0.1, 0.0, 2.5, 0.6),

-- 78 · Percebe de Roca
(78, 'Percebe de Roca', 'Megabalanus coccopoma', 'crustaceos',
 'Rocas de la zona intermareal y submareal de Los Cobanos, 0-10 m',
 'Percebe de gran tamaño con caparazon de color rosa-blanco y forma conica. Es un crustaceo filtrador que permanece fijo a las rocas, filtrando el agua con sus apendices. Forma densos agrupamientos en la zona de rompiente y submareal somero. Es el percebe mas grande del Pacifico oriental y es indicador de aguas ricas en nutrientes. En Los Cobanos cubre grandes areas de roca.',
 'Filtrador (plancton, particulas organicas)', '5-10 anos', 'Preocupacion menor',
 '5-15 cm', '50-200 g', 'Hermafrodita, fertilizacion cruzada', 'Miles de larvas',
 'Estrellas de mar, caracoles, aves costeras, humanos',
 '18 - 30 C', 'Marina (~34 ppt)', 'Intermareal y fotica', 0, 10, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/barnacle.glb',
 2.0, -0.1, 0.0, 2.5, 0.6),

-- 79 · Cangrejo Terrestre del Manglar
(79, 'Cangrejo Terrestre del Manglar', 'Cardisoma crassum', 'crustaceos',
 'Manglares y zonas costeras humedas cerca de Los Cobanos, 0-5 m',
 'Cangrejo de gran tamaño que excava madrigueras profundas en el manglar. Coloracion azulada en adultos, con caparazon liso. Pasa la mayor parte de su vida en tierra pero debe regresar al mar para reproducirse. Es un omnivoro que se alimenta de hojas, frutos, insectos y carrona. En Los Cobanos es abundante en manglares y bosques de galeria cercanos.',
 'Omnivora (hojas, frutos, insectos, carrona, detritus)', '5-8 anos', 'Preocupacion menor',
 '8-15 cm', '0.2-1 kg', 'Puesta de huevos en el mar', 'Miles de huevos',
 'Aves, mamiferos, humanos',
 '22 - 34 C', 'Terrestre (humedo)', 'Supramareal', 0, 5, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/crab.glb',
 2.5, -0.15, 0.0, 3.0, 0.6),

-- 80 · Nudibranquio de Rayas Negras
(80, 'Nudibranquio de Rayas Negras', 'Elysia crispata', 'moluscos',
 'Arrecifes rocosos y praderas de algas de Los Cobanos, 0-15 m',
 'Babosa marina de color verde esmeralda con rayas negras y bordes ondulados que le dan apariencia de lechuga. Practica cleptoplastia, reteniendo cloroplastos de algas para hacer fotosintesis. Es una especie espectacular visualmente que se desplaza lentamente sobre algas y rocas. En Los Cobanos es avistada en arrecifes someros con buena cobertura de algas verdes.',
 'Herbivora (algas verdes, especialmente del genero Halimeda)', '1-2 anos', 'Preocupacion menor',
 '3-6 cm', '2-8 g', 'Hermafrodita, puesta de huevos en cinta', 'Cientos de huevos',
 'Peces pequeños, cangrejos',
 '20 - 28 C', 'Marina (~34 ppt)', 'Zona fotica', 0, 15, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/sea_slug.glb',
 1.0, -0.1, 0.0, 2.5, 0.6),

-- 81 · Lapa Gigante de México
(81, 'Lapa Gigante de Mexico', 'Patella mexicana', 'moluscos',
 'Zona intermareal rocosa de Los Cobanos, 0-2 m',
 'Lapa de gran tamaño con concha conica de color marron-grisaceo y bordes irregulares. Se adhiere fuertemente a las rocas en la zona de rompiente, soportando el embate de las olas. Es herbivora y raspa algas de las rocas con su radula. Es una especie importante en el ecosistema intermareal porque mantiene limpias las rocas de algas. En Los Cobanos es comun en rocas expuestas.',
 'Herbivora (algas, diatomeas, biofilm)', '5-10 anos', 'Preocupacion menor',
 '5-10 cm', '50-150 g', 'Puesta de huevos en el agua', 'Miles de huevos',
 'Aves costeras, estrellas de mar, humanos',
 '18 - 32 C', 'Marina (~34 ppt)', 'Intermareal', 0, 2, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/snail.glb',
 1.5, -0.1, 0.0, 2.5, 0.5),

-- 82 · Pulpo de Pozas
(82, 'Pulpo de Pozas', 'Octopus oculifer', 'moluscos',
 'Pozas de marea y zona intermareal rocosa de Los Cobanos, 0-5 m',
 'Pulpo de pequeño tamaño adaptado a las duras condiciones de las pozas de marea. Tiene manchas oceladas que usa para confundir depredadores. Es nocturno y se esconde en grietas durante el dia. Es inteligente y curioso, capaz de abrir conchas y escapar de contenedores. En Los Cobanos es comun en pozas de marea y bajo rocas del intermareal.',
 'Carnivora (cangrejos, moluscos, gusanos)', '2-3 anos', 'Preocupacion menor',
 '20-30 cm (envergadura)', '50-200 g', 'Puesta de huevos en madriguera', 'Cientos de huevos',
 'Aves costeras, peces, cangrejos mayores',
 '18 - 30 C', 'Marina (~34 ppt)', 'Intermareal', 0, 5, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/octopus.glb',
 1.5, -0.1, 0.0, 2.5, 0.6),

-- 83 · Ostra Perlífera del Pacífico
(83, 'Ostra Perlífera del Pacifico', 'Pinctada mazatlanica', 'moluscos',
 'Arrecifes rocosos de Los Cobanos, 1-25 m',
 'Ostra de gran tamaño que produce perlas de calidad en el Pacifico oriental. Su concha es gruesa, de color plateado con reflejos nacarados en el interior. Se fija a rocas y sustratos duros en arrecifes. Es una especie de alto valor por su capacidad de producir perlas y su nacre. En Los Cobanos es rara y esta protegida por su valor comercial, aunque se han registrado poblaciones.',
 'Filtrador (plancton, particulas organicas)', '15-25 anos', 'Vulnerable',
 '10-20 cm', '0.5-2 kg', 'Puesta de huevos y esperma en el agua', 'Millones de huevos',
 'Estrellas de mar, caracoles depredadores, humanos',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 25, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/clam.glb',
 1.5, -0.1, 0.0, 2.5, 0.5),

-- 84 · Caracol Sombrero Chino
(84, 'Caracol Sombrero Chino', 'Crucibulum scutellatum', 'moluscos',
 'Arrecifes rocosos y fondos de cascajo de Los Cobanos, 1-20 m',
 'Caracol con concha aplanada en forma de sombrero chino, de color blanco-grisaceo con bordes irregulares. Se fija a rocas y conchas de otros moluscos. Se alimenta filtrando particulas y detritus del agua. Su forma aplanada le permite resistir corrientes y oleaje. En Los Cobanos es comun en fondos rocosos y de cascajo donde se camufla entre las rocas.',
 'Filtrador (plancton, detritus, particulas organicas)', '3-5 anos', 'Preocupacion menor',
 '3-6 cm', '10-30 g', 'Puesta de huevos en capsulas', 'Decenas de huevos',
 'Estrellas de mar, caracoles depredadores',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 20, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/snail.glb',
 1.2, -0.1, 0.0, 2.5, 0.5),

-- 85 · Caracol Porcelana
(85, 'Caracol Porcelana', 'Pseudozonaria arabicula', 'moluscos',
 'Arrecifes rocosos y fondos de cascajo de Los Cobanos, 1-20 m',
 'Caracol de concha lisa y brillante de color blanco con bandas y puntos marrones, semejante a una porcelana. Es de tamaño pequeño y habita bajo piedras y en grietas. Es nocturno y se alimenta de detritus y algas. Su concha es muy apreciada por coleccionistas. En Los Cobanos es comun en fondos rocosos y de cascajo, especialmente en zonas con algas.',
 'Omnivora (algas, detritus, diatomeas)', '3-5 anos', 'Preocupacion menor',
 '2-4 cm', '5-15 g', 'Puesta de huevos en capsulas', 'Decenas de huevos',
 'Peces de arrecife, cangrejos',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 20, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/snail.glb',
 1.0, -0.1, 0.0, 2.5, 0.5),

-- 86 · Caracol Oliva de Puntos
(86, 'Caracol Oliva de Puntos', 'Oliva spicata', 'moluscos',
 'Fondos arenosos de Los Cobanos, 1-30 m',
 'Caracol de concha brillante en forma de oliva, de color marron con puntos blancos. Es un depredador carroñero que se entierra en la arena durante el dia y sale de noche a alimentarse. Su concha pulida y brillante es muy apreciada por coleccionistas. En Los Cobanos es comun en fondos arenosos y de arena concha, donde se desplaza con rapidez.',
 'Carnivora (carrona, moluscos, gusanos)', '5-10 anos', 'Preocupacion menor',
 '3-6 cm', '10-30 g', 'Puesta de huevos en capsulas', 'Decenas de huevos',
 'Peces grandes, cangrejos, humanos',
 '20 - 30 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/snail.glb',
 1.2, -0.1, 0.0, 2.5, 0.5),

-- 87 · Liebre de Mar Gigante
(87, 'Liebre de Mar Gigante', 'Aplysia dactylomela', 'moluscos',
 'Fondos de algas y praderas marinas de Los Cobanos, 1-15 m',
 'Babosa marina de gran tamaño con cuerpo blando y carnoso, de color marron-verdoso con manchas oscuras. Tiene dos tentaculos en la cabeza que parecen orejas de liebre, de ahi su nombre. Puede liberar una tinta purpura para confundir depredadores. Se alimenta de algas y es importante en el control de algas en el arrecife. En Los Cobanos es comun en fondos de algas.',
 'Herbivora (algas, especialmente algas rojas y verdes)', '2-3 anos', 'Preocupacion menor',
 '15-30 cm', '0.2-1 kg', 'Hermafrodita, puesta en cintas gelatinosas', 'Miles de huevos',
 'Peces grandes, pulpos, estrellas de mar',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 15, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/sea_hare.glb',
 1.5, -0.15, 0.0, 2.8, 0.6),

-- 88 · Caracol Corona del Pacífico
(88, 'Caracol Corona del Pacifico', 'Melongena patula', 'moluscos',
 'Fondos fangosos y estuarios de Los Cobanos, 1-20 m',
 'Caracol de concha robusta con espinas en la vuelta y coloracion marron con bandas. Es un depredador de bivalvos y carroñero. Su concha tiene un característico canal sifonal alargado. Habita fondos fangosos y estuarios cerca de la costa. En Los Cobanos es comun en desembocaduras de rios y zonas fangosas, donde se alimenta de almejas y detritus.',
 'Carnivora (bivalvos, carrona)', '5-8 anos', 'Preocupacion menor',
 '5-10 cm', '50-150 g', 'Puesta de huevos en capsulas', 'Decenas de huevos',
 'Peces grandes, humanos',
 '20 - 32 C', 'Marina a salobre (15-35 ppt)', 'Zona bentonica', 1, 20, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/snail.glb',
 1.5, -0.1, 0.0, 2.5, 0.5),

-- 89 · Almeja de Sifón
(89, 'Almeja de Sifon', 'Chione fluctifraga', 'moluscos',
 'Fondos arenosos y fangosos de Los Cobanos, 1-15 m',
 'Almeja de concha gruesa y ovalada, de color blanco-grisaceo con lineas concentricas. Tiene un sifon largo que sobresale del fondo para filtrar agua y alimentarse. Es un bivalvo importante en la cadena alimenticia, siendo presa de peces y aves. En Los Cobanos es comun en fondos arenosos y fangosos, y es explotada por pescadores artesanales.',
 'Filtrador (plancton, particulas organicas)', '5-10 anos', 'Preocupacion menor',
 '3-6 cm', '20-60 g', 'Puesta de huevos y esperma en el agua', 'Miles de huevos',
 'Estrellas de mar, caracoles, peces, aves, humanos',
 '18 - 30 C', 'Marina a salobre (20-35 ppt)', 'Zona fotica bentonica', 1, 15, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/clam.glb',
 1.0, -0.1, 0.0, 2.5, 0.5),

-- 90 · Nudibranquio de Orla Dorada
(90, 'Nudibranquio de Orla Dorada', 'Glossodoris sedna', 'moluscos',
 'Arrecifes rocosos de Los Cobanos, 1-25 m',
 'Nudibranquio de cuerpo blanco con un borde dorado-anaranjado y branquias tambien doradas. Es una especie colorida y vistosa que contrasta con el fondo rocoso. Se alimenta de esponjas y acumula sus toxinas para defenderse. En Los Cobanos es avistado en arrecifes rocosos con buena cobertura de esponjas y algas entre 5 y 20 metros.',
 'Carnivora (esponjas)', '1-2 anos', 'Preocupacion menor',
 '3-6 cm', '5-15 g', 'Hermafrodita, puesta en espiral', 'Cientos de huevos',
 'Peces pequeños, cangrejos',
 '20 - 28 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 25, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/sea_slug.glb',
 1.0, -0.1, 0.0, 2.5, 0.6),

-- 91 · Caracol Turbante
(91, 'Caracol Turbante', 'Turbo saxosus', 'moluscos',
 'Arrecifes rocosos y fondos de algas de Los Cobanos, 1-30 m',
 'Caracol de concha gruesa y redondeada, de forma turbante, de color marron-rojizo con bandas. Tiene una abertura redonda con operculo calcareo que cierra herméticamente la concha. Es herbivoro y pasta algas de las rocas. Su operculo es usado en artesania. En Los Cobanos es comun en arrecifes rocosos con algas, especialmente en zonas con corriente.',
 'Herbivora (algas, biofilm)', '5-10 anos', 'Preocupacion menor',
 '4-8 cm', '30-100 g', 'Puesta de huevos en masa gelatinosa', 'Miles de huevos',
 'Peces grandes, cangrejos, humanos',
 '20 - 29 C', 'Marina (~34 ppt)', 'Zona fotica bentonica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/snail.glb',
 1.5, -0.1, 0.0, 2.5, 0.5),

-- 92 · Callo de Hacha
(92, 'Callo de Hacha', 'Atrina maura', 'moluscos',
 'Fondos arenosos y fangosos de Los Cobanos, 1-30 m',
 'Almeja de gran tamaño con concha en forma de abanico o hacha, de color marron-negruzco. Vive semienterrada en la arena con la parte posterior de la concha expuesta. Es un filtrador eficiente que bombea grandes cantidades de agua. Su musculo aductor (callo) es muy apreciado en gastronomia. En Los Cobanos es objetivo de pesca artesanal por su carne.',
 'Filtrador (plancton, particulas organicas)', '10-15 anos', 'Preocupacion menor',
 '15-30 cm', '0.5-2 kg', 'Puesta de huevos y esperma en el agua', 'Millones de huevos',
 'Estrellas de mar, caracoles, peces, humanos',
 '18 - 30 C', 'Marina (~34 ppt)', 'Zona bentonica', 1, 30, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/clam.glb',
 1.5, -0.15, 0.0, 2.8, 0.6),

-- 93 · Caracol del Tinte
(93, 'Caracol del Tinte', 'Plicopurpura pansa', 'moluscos',
 'Zona intermareal rocosa de Los Cobanos, 0-3 m',
 'Caracol de concha robusta con costillas y coloracion marron-grisacea. Es famoso por producir un tinte purpura que era usado por culturas precolombinas para teñir textiles. El tinte se extrae de una glandula cerca del sifon y cambia de amarillo a purpura al exponerse al sol. En Los Cobanos es comun en rocas del intermareal, aunque su poblacion ha disminuido por recoleccion.',
 'Carnivora (bivalvos, otros caracoles)', '5-8 anos', 'Preocupacion menor',
 '3-6 cm', '20-50 g', 'Puesta de huevos en capsulas', 'Decenas de huevos',
 'Aves costeras, cangrejos, humanos',
 '18 - 32 C', 'Marina (~34 ppt)', 'Intermareal', 0, 3, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/snail.glb',
 1.2, -0.1, 0.0, 2.5, 0.5),

-- 94 · Calamar de Lanza
(94, 'Calamar de Lanza', 'Doryteuthis opalescens', 'moluscos',
 'Aguas costeras abiertas frente a Los Cobanos, 1-100 m',
 'Calamar de tamaño mediano con cuerpo alargado y aletas en forma de lanza. Es una especie pelagica que forma cardumenes y realiza migraciones verticales diarias. Se alimenta de peces y crustaceos, y es presa de numerosos depredadores. Es de gran importancia comercial en la pesca de California. En Los Cobanos se avistan cardumenes durante temporadas especificas.',
 'Carnivora (peces pequeños, crustaceos, otros calamares)', '1-2 anos', 'Preocupacion menor',
 '15-25 cm (total)', '50-200 g', 'Puesta de huevos en masas gelatinosas', 'Miles de huevos',
 'Peces grandes, tiburones, aves marinas, lobos marinos, humanos',
 '12 - 24 C', 'Marina (~34 ppt)', 'Zona fotica', 1, 100, 'Los Cobanos, El Salvador',
 92, 47,
 '../public/media/3D_Models/squid.glb',
 1.5, -0.1, 0.0, 2.5, 0.6);
 
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
(2, 1, 'fa-nose', 'Narigon', 'Su hocico prominente y puntiagudo le da su nombre comun.'),
(2, 2, 'fa-spider', 'Espinas fijas', 'A diferencia de otros peces globo, sus espinas siempre estan erectas.'),
(2, 3, 'fa-spot', 'Puntos brillantes', 'Su cuerpo marron con puntos blancos brillantes lo hace inconfundible.'),
(2, 4, 'fa-skull', 'Tetrodotoxina', 'Posee tetrodotoxina en sus organos, una neurotoxina letal para depredadores.'),
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
(5, 1, 'fa-bull', 'El Toro del mar', 'Su nombre viene de su fuerza y tenacidad al ser capturado, luchando como un toro.'),
(5, 2, 'fa-users', 'Cardumenes', 'Forma grandes cardumenes que cazan coordinadamente, rodeando a sus presas.'),
(5, 3, 'fa-rocket', 'Rapido', 'Es un depredador extremadamente rapido que puede alcanzar altas velocidades.'),
(5, 4, 'fa-trophy', 'Pesca deportiva', 'Es una de las especies mas codiciadas por la pesca deportiva en El Salvador.'),

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

-- 8 · Jaiba Roja del Pacífico
(8, 1, 'fa-palette', 'Color rojo intenso', 'Su caparazon rojo brillante lo hace inconfundible en el arrecife de Los Cobanos.'),
(8, 2, 'fa-swimmer', 'Nadador activo', 'Sus patas traseras en paleta le permiten nadar agilmente entre rocas y arena.'),
(8, 3, 'fa-fighter-jet', 'Depredador rapido', 'Es un cazador activo que persigue a sus presas con gran velocidad.'),
(8, 4, 'fa-utensils', 'Pesca local', 'Es capturado por pescadores artesanales de Los Cobanos por su carne apreciada.'),

-- Especie 9
(9, 1, 'fa-hand-paper',     'Regeneración',  'Pueden regenerar un brazo perdido en meses; algunos regeneran el cuerpo entero desde un brazo.'),
(9, 2, 'fa-stomach',        'Digestión externa','Expulsan su estómago fuera del cuerpo para digerir presas dentro de sus conchas.'),
(9, 3, 'fa-shoe-prints',    'Sin cerebro',   'No tienen cerebro ni sangre; usan agua de mar a presión para moverse y funcionar.'),
(9, 4, 'fa-eye',            'Ojos en tentáculos','Tienen pequeños fotorreceptores en las puntas de sus brazos para detectar luz.'),


-- 10 · Camarón Mantis del Pacífico
(10, 1, 'fa-fist-raised', 'Golpeador brutal', 'Su golpe es tan rapido que genera cavitacion y luz en el agua.'),
(10, 2, 'fa-sun', 'Cavitacion', 'El golpe produce burbujas que colapsan generando temperaturas similares al sol.'),
(10, 3, 'fa-rocket', 'Velocidad', 'Su golpe alcanza 80 km/h, comparable a una bala de calibre 22.'),
(10, 4, 'fa-eye', 'Vision increible', 'Tiene los ojos mas complejos del reino animal, con 12-16 tipos de fotorreceptores.'),

-- Especie 11
(11, 1, 'fa-brain',         'Mayor cerebro', 'Tienen el mayor cerebro en proporción al cuerpo de todos los peces.'),
(11, 2, 'fa-rocket',        'Saltos',        'Pueden saltar varios metros fuera del agua; aún se desconoce la razón exacta.'),
(11, 3, 'fa-filter',        'Filtración',    'Filtran hasta 30 kg de plancton por hora pasando agua por sus branquias modificadas.'),
(11, 4, 'fa-graduation-cap','Curiosas',      'Se acercan a buzos voluntariamente; parecen mostrar curiosidad hacia humanos.'),

-- Especie 12
(12, 1, 'fa-syringe',       'Veneno letal',  'Produce conotoxinas que atacan el sistema nervioso; no hay antídoto conocido.'),
(12, 2, 'fa-crosshairs',    'Arpón harpaxóforo','Su diente es un arpón retráctil que puede disparar en cualquier dirección.'),
(12, 3, 'fa-pills',         'Medicina',      'Sus conotoxinas son base de Ziconotide, un analgésico más potente que la morfina.'),
(12, 4, 'fa-moon',          'Caza nocturna', 'Son activos de noche; detectan presas con un sifón que analiza partículas en el agua.'),

-- 13 · Pez Ángel Real
(13, 1, 'fa-magic',          'Cambio de color',          'Los juveniles son negros con rayas blancas y azules; al madurar cambian completamente de patron.'),
(13, 2, 'fa-broom',          'Estacion limpieza',        'Los jovenes limpian parasitos de peces grandes, incluyendo tiburones, en estaciones fijas del arrecife.'),
(13, 3, 'fa-venus-mars',     'Harem',                    'Vive en grupos de un macho con varias hembras; si el macho muere, la hembra dominante cambia de sexo.'),
(13, 4, 'fa-map-marker-alt', 'Endemico regional',        'Especie exclusiva del Pacifico oriental: desde Baja California hasta Peru, con alta densidad en Los Cobanos.'),

-- 14 · Burrita Azul
(14, 1, 'fa-shield-alt',     'Padre guardian',           'El macho cuida el nido con agresividad, atacando incluso a buzos que se acerquen demasiado.'),
(14, 2, 'fa-fish',           'Poza de marea',            'Sobreviven variaciones extremas de temperatura y salinidad en pozas que se calientan bajo el sol tropical.'),
(14, 3, 'fa-fish',           'Cardumen activo',          'Forman densos cardumenes que confunden a los depredadores con movimientos sincronizados.'),
(14, 4, 'fa-seedling',       'Red trofica clave',        'Enlazan el plancton con depredadores mayores, siendo uno de los peces mas abundantes del arrecife.'),

-- 15 · Burrita Negra
(15, 1, 'fa-fire',           'Termo-resistente',         'Tolera temperaturas de pozas de marea que superan los 35 grados en verano, inusual para un pez marino.'),
(15, 2, 'fa-fist-raised',    'Territorial',              'Defiende pequeños territorios en la rompiente incluso frente a cangrejos moro y erizos.'),
(15, 3, 'fa-recycle',        'Detritivo',                'Consume detritus organico acumulado en grietas, contribuyendo al reciclaje de nutrientes en el intermareal.'),
(15, 4, 'fa-eye',            'Criptica',                 'Su color oscuro la camufla entre las rocas cubiertas de algas negras en la zona de rompiente.'),

-- 16 · Damisela de Acapulco
(16, 1, 'fa-leaf',           'Granjero del mar',         'Cultiva un parche exclusivo de algas removiendo todo lo demas; es uno de los pocos peces agricultores.'),
(16, 2, 'fa-fist-raised',    'Sin miedo',                'Ataca con mordiscos a cualquier intruso, incluyendo pulpos, morenas y buzos humanos.'),
(16, 3, 'fa-baby',           'Padre protector',          'El macho ventila los huevos con sus aletas y los defiende hasta la eclosion.'),
(16, 4, 'fa-map-marker-alt', 'Especie centinela',        'Su abundancia en Los Cobanos es indicador de la salud del arrecife rocoso somero.'),

-- 17 · Damisela Azul
(17, 1, 'fa-palette',        'Azul neon',                'Su pigmentacion azul brillante proviene de pigmentos estructurales en las escamas, no de pigmentos quimicos.'),
(17, 2, 'fa-layer-group',    'Cardumen estrategico',     'Nadan a media agua en grupos compactos: los de los bordes regresan al centro cuando detectan depredadores.'),
(17, 3, 'fa-compass',        'Orientacion solar',        'Usan la posicion del sol como brujula para regresar al mismo coral al anochecer.'),
(17, 4, 'fa-chart-line',     'Bioindicadora',            'La abundancia de damiselas azules refleja la disponibilidad de zooplancton, indicando productividad oceanica.'),

-- 18 · Pez Cirujano de Cola Amarilla
(18, 1, 'fa-cut',            'Triple escalpelo',         'Posee tres espinas caudales en lugar de una sola; las usa para defenderse agitando la cola.'),
(18, 2, 'fa-users',          'Cardumen herbivoro',       'Pasta en grupos de hasta 200 individuos, arrasando parches de algas en minutos.'),
(18, 3, 'fa-seedling',       'Jardinero del mar',        'Su pastoreo en grupo controla el crecimiento de algas que sofocarian el coral.'),
(18, 4, 'fa-map-marker-alt', 'Endemico Pacifico',        'Solo existe en el Pacifico oriental tropical; Los Cobanos es uno de sus puntos de mayor densidad.'),

-- 19 · Pez Cirujano de Aleta Amarilla
(19, 1, 'fa-moon',           'Desove lunar',             'Se reproduce en sincronia con la luna llena: miles de individuos desovan simultaneamente al atardecer.'),
(19, 2, 'fa-tint',           'Estratos profundos',       'Explota recursos de algas en fondos de 30-80 m que otras especies no alcanzan.'),
(19, 3, 'fa-baby',           'Larvas pelagicas',         'Sus larvas pasan semanas a la deriva oceanica antes de asentarse en arrecifes rocosos.'),
(19, 4, 'fa-weight-hanging', 'El mas grande',            'Es el cirujano de mayor talla del Pacifico oriental, superando los 70 cm y 4 kg.'),

-- 20 · Roncador Gris
(20, 1, 'fa-volume-up',      'El que grune',             'Produce sonidos de grunido frotando los dientes faringeos; comunicacion social en el cardumen.'),
(20, 2, 'fa-moon',           'Cazador nocturno',         'Durante el dia se refugia en grupo bajo rocas; de noche sale a cazar en fondos blandos.'),
(20, 3, 'fa-users',          'Bancos diurnos',           'Forman bancos de cientos de individuos inmoviles bajo cornisas rocosas, espectaculo iconico de Los Cobanos.'),
(20, 4, 'fa-anchor',         'Pesca artesanal',          'Recurso pesquero historico de la comunidad de Los Cobanos, capturado con linea desde panga.'),

-- 21 · Pargo Amarillo
(21, 1, 'fa-map-marked-alt', 'Doble habitat',            'Los juveniles crecen en manglares y al madurar migran al arrecife rocoso: conectan ecosistemas.'),
(21, 2, 'fa-star',           'Color de alerta',          'El amarillo brillante de las aletas advierte a depredadores de su agilidad para escapar.'),
(21, 3, 'fa-anchor',         'Pesca artesanal',          'Especie de mayor valor comercial para los pescadores artesanales de Los Cobanos.'),
(21, 4, 'fa-building',       'Oquedades',                'Descansa en cuevas y grietas del arrecife durante el dia en grupos de 5-20 individuos.'),

-- 22 · Cabrilla Loro
(22, 1, 'fa-venus-mars',     'Hermafrodita simultaneo',  'Un mismo individuo produce ovulos y esperma al mismo tiempo; pueden autofecundarse en aislamiento.'),
(22, 2, 'fa-crosshairs',     'Depredador emboscada',     'Permanece inmovil durante horas imitando el fondo rocoso; lanza un ataque relampago en milisegundos.'),
(22, 3, 'fa-palette',        'Patron unico',             'Su coloracion anaranjada y blanca es un caso de aposematismo: aviso de que es dificil de capturar.'),
(22, 4, 'fa-seedling',       'Indicadora bentonica',     'Su densidad en el arrecife es proporcional a la cobertura de esponjas e invertebrados sesiles.'),

-- 23 · Tiburón Ballena
(23, 1, 'fa-ruler',          'El mas grande',      'Es el pez mas grande del mundo, superando los 12 metros y 20 toneladas.'),
(23, 2, 'fa-filter',         'Filtrador',          'Filtra hasta 6000 litros de agua por hora para obtener su alimento de plancton.'),
(23, 3, 'fa-id-card',        'Huellas unicas',     'Los patrones de puntos blancos de cada individuo son unicos, como huellas digitales.'),
(23, 4, 'fa-map-marker-alt', 'Los Cobanos',        'Se avistan frente a Los Cobanos entre junio y octubre por la alta productividad oceanica.'),

-- 24 · Tiburón Martillo
(24, 1, 'fa-eye',            'Vision 360',         'Su cabeza en forma de T le da vision casi completa alrededor sin punto ciego arriba.'),
(24, 2, 'fa-magnet',         'Electrorecepcion',   'Detecta campos electricos de presas enterradas en la arena mediante ampollas de Lorenzini.'),
(24, 3, 'fa-users',          'Cardumenes',         'Forman cardumenes de cientos de individuos en los montes submarinos de Los Cobanos.'),
(24, 4, 'fa-baby',           'Viviparos',          'Las crias nacen vivas y completamente formadas, listas para sobrevivir desde el primer dia.'),

-- 25 · Pez Vela
(25, 1, 'fa-tachometer-alt', 'El mas rapido',      'Alcanza 110 km/h, siendo el pez mas rapido del oceano, mas veloz que un guepardo.'),
(25, 2, 'fa-fan',            'La vela',            'Despliega su aleta dorsal para acorralar cardumenes de peces pequeños en grupo.'),
(25, 3, 'fa-trophy',         'Pesca deportiva',    'El Salvador es uno de los mejores destinos del mundo para pesca deportiva de pez vela.'),
(25, 4, 'fa-heart',          'Captura y libera',   'La mayoria de pescadores deportivos lo liberan vivo tras la captura para conservar la especie.'),

-- 26 · Tortuga Carey
(26, 1, 'fa-utensils',       'Comedora de esponjas', 'Es la unica tortuga marina especializada en comer esponjas, que son toxicas para otros animales.'),
(26, 2, 'fa-fingerprint',    'Caparazon unico',      'Sus escamas superpuestas en sierra son unicas entre todas las tortugas marinas del mundo.'),
(26, 3, 'fa-seedling',       'Rol en el arrecife',   'Al controlar las esponjas permite que el coral crezca; sin ella los arrecifes se sofocarian.'),
(26, 4, 'fa-moon',           'Anidacion nocturna',   'Sale al amanecer a anidar en las mismas playas donde nacio, guiada por el campo magnetico.'),

-- 27 · Tortuga Golfina
(27, 1, 'fa-users',          'Arribadas masivas',    'Miles de hembras anidan la misma noche en la misma playa en un evento llamado arribada.'),
(27, 2, 'fa-compass',        'Navegacion magnetica', 'Regresa exactamente a la playa donde nacio usando el campo magnetico terrestre como GPS.'),
(27, 3, 'fa-thermometer-half','Sexo por temperatura','La temperatura de incubacion determina el sexo: mas calor produce mas hembras.'),
(27, 4, 'fa-map-marker-alt', 'El Salvador',          'Las playas de El Salvador son importantes sitios de anidacion de golfina en el Pacifico.'),

-- 28 · Tortuga Prieta
(28, 1, 'fa-leaf',           'Herbivora adulta',     'De joven come de todo pero al madurar se vuelve completamente herbivora, unica entre las tortugas.'),
(28, 2, 'fa-seedling',       'Jardinera del mar',    'Al pastar pastos marinos los fertiliza con sus excrementos, manteniendo saludables los fondos.'),
(28, 3, 'fa-lungs',          'Apnea record',         'Puede permanecer sumergida hasta 7 horas mientras duerme en el fondo marino.'),
(28, 4, 'fa-route',          'Migraciones epicas',   'Migra mas de 2000 km entre sus areas de alimentacion en Los Cobanos y las playas de anidacion.'),

-- 29 · Tortuga Baula
(29, 1, 'fa-ruler',          'La mas grande',        'Es la tortuga marina mas grande del mundo, superando 180 cm y 700 kg.'),
(29, 2, 'fa-arrow-down',     'Buceadora record',     'Puede sumergirse hasta 1000 metros de profundidad, mas que cualquier otra tortuga.'),
(29, 3, 'fa-jellyfish',      'Comedora de medusas',  'Se alimenta casi exclusivamente de medusas; los plasticos flotantes la matan al confundirlos.'),
(29, 4, 'fa-thermometer-half','Sin caparazon duro',  'En lugar de caparazon tiene una piel correosa con aceite que la protege del frio en aguas polares.'),

-- 30 · Langosta Espinosa
(30, 1, 'fa-compass',        'Navegacion magnetica', 'Se orienta usando el campo magnetico terrestre durante sus migraciones nocturnas.'),
(30, 2, 'fa-music',          'Estridulacion',        'Produce sonidos frotando sus antenas contra el caparazon para espantar depredadores.'),
(30, 3, 'fa-users',          'Migracion en fila',    'Migran en filas de hasta 50 individuos tomados de las antenas del de delante.'),
(30, 4, 'fa-hard-hat',       'Muda',                 'Mudan su exoesqueleto para crecer; quedan vulnerables durante horas hasta que se endurece.'),

-- 31 · Cangrejo Ermitaño
(31, 1, 'fa-home',           'Casa prestada',        'Usa conchas vacias de caracol como refugio y las cambia conforme crece buscando una mas grande.'),
(31, 2, 'fa-hand-rock',      'Intercambio social',   'Se reunen en grupos para intercambiar conchas de forma ordenada y pacifica en cadena.'),
(31, 3, 'fa-tint',           'Necesita el mar',      'Aunque vive en tierra debe regresar al mar para reproducirse y humedecer sus branquias.'),
(31, 4, 'fa-shield-alt',     'Defensa',              'Se retrae dentro de la concha y bloquea la entrada con su pinza mas grande ante depredadores.'),

-- 32 · Cangrejo Porcelana
(32, 1, 'fa-filter',         'Filtrador',            'Filtra particulas organicas del agua con apendices plumosos, rol clave en el intermareal.'),
(32, 2, 'fa-cut',            'Autotomia',            'Puede soltar una pata atrapada por un depredador y regenerarla completamente en la siguiente muda.'),
(32, 3, 'fa-dna',            'No es cangrejo',       'A pesar de su aspecto es un anomuro, mas cercano a las langostas que a los cangrejos verdaderos.'),
(32, 4, 'fa-layer-group',    'Bajo las piedras',     'Debajo de cada piedra del intermareal de Los Cobanos pueden vivir decenas de individuos.'),

-- 33 · Cangrejo Fantasma
(33, 1, 'fa-running',        'El mas rapido',        'Puede correr a 2 metros por segundo, siendo uno de los animales terrestres mas rapidos por su tamano.'),
(33, 2, 'fa-eye',            'Vision 360',           'Sus ojos en pedunculo le dan vision casi completa alrededor para detectar depredadores.'),
(33, 3, 'fa-home',           'Madriguera',           'Excava madrigueras de hasta 1 metro de profundidad en la arena para refugiarse del calor.'),
(33, 4, 'fa-broom',          'Limpiador de playas',  'Consume huevos de tortuga no viables y restos organicos, contribuyendo a la limpieza de la playa.'),

-- 34 · Cangrejo Moro
(34, 1, 'fa-palette',        'Color de advertencia', 'Su color naranja brillante advierte a depredadores de su agilidad y dureza de caparazon.'),
(34, 2, 'fa-running',        'Corredor multiaxial',  'Es el unico cangrejo capaz de correr en cualquier direccion sin girar el cuerpo.'),
(34, 3, 'fa-seedling',       'Controlador de algas', 'Al raspar algas de las rocas mantiene limpia la superficie para que se asienten otros organismos.'),
(34, 4, 'fa-baby',           'Juvenil negro',        'Los juveniles son completamente negros como camuflaje; el color naranja aparece al madurar.'),

-- 35 · Camarón Pistola
(35, 1, 'fa-volume-up',      '218 decibelios',       'Su chasquido alcanza 218 dB, mas fuerte que un disparo de pistola y suficiente para aturdir peces.'),
(35, 2, 'fa-sun',            'Mini sol',             'La burbuja de cavitacion que genera alcanza los 8000 grados Celsius por una fraccion de segundo.'),
(35, 3, 'fa-handshake',      'Simbiosis con gobio',  'Comparte madriguera con un pez gobio: el gobio vigila y el camaron excava y mantiene el tunel.'),
(35, 4, 'fa-cut',            'Pinza asimetrica',     'Solo una pinza es la pistola; la otra es pequena y se usa para alimentarse normalmente.'),

-- 36 · Camarón Limpiador
(36, 1, 'fa-clinic-medical', 'Doctor del arrecife',  'Opera estaciones de limpieza donde los peces hacen fila para ser desparasitados.'),
(36, 2, 'fa-flag-checkered', 'Bandera de tregua',    'Agita sus antenas blancas como señal universal de limpieza; incluso las morenas respetan la tregua.'),
(36, 3, 'fa-venus-mars',     'Hermafrodita',         'Es hermafrodita simultaneo; puede funcionar como macho y hembra al mismo tiempo.'),
(36, 4, 'fa-heartbeat',      'Salud del arrecife',   'Su desaparicion causa proliferacion de parasitos que debilitan a los peces del ecosistema.'),

-- 37 · Jaiba Azul del Pacífico
(37, 1, 'fa-swimmer',        'Cangrejo nadador',     'Sus patas traseras en forma de paleta le permiten nadar activamente en mar abierto.'),
(37, 2, 'fa-tint',           'Tolera salinidades',   'Sobrevive desde agua dulce hasta agua muy salada, colonizando estuarios y mar abierto.'),
(37, 3, 'fa-anchor',         'Pesca local',          'Es el crustaceo mas capturado por pescadores artesanales de Los Cobanos tras la langosta.'),
(37, 4, 'fa-baby',           'Millones de huevos',   'Una sola hembra puede producir hasta 2 millones de huevos en una puesta.'),

-- 38 · Cangrejo Araña
(38, 1, 'fa-tshirt',         'Disfraz vivo',         'Pega esponjas, algas e hidroides sobre su caparazon creando un camuflaje vivo que renueva.'),
(38, 2, 'fa-clock',          'Inmovil de dia',       'Permanece completamente inmovil durante el dia confiando en su camuflaje para evitar depredadores.'),
(38, 3, 'fa-spider',         'Patas largas',         'Sus patas son mucho mas largas que su cuerpo, parecidas a las de una arana, de ahi su nombre.'),
(38, 4, 'fa-seedling',       'Jardinero involuntario','Al transportar organismos vivos en su caparazon dispersa esponjas y algas por el arrecife.'),

-- 39 · Langostina de Arena
(39, 1, 'fa-shoe-prints',    'Zapatilla',            'Su forma aplanada como una zapatilla es adaptacion para enterrarse en arena en segundos.'),
(39, 2, 'fa-moon',           'Cazadora nocturna',    'Permanece enterrada de dia y caza activamente moluscos y erizos de noche.'),
(39, 3, 'fa-hand-paper',     'Sin pinzas',           'A diferencia de las langostas espinosas carece de pinzas; usa sus antenas en paleta para defenderse.'),
(39, 4, 'fa-exclamation-triangle','Poco estudiada',  'Es una de las especies menos estudiadas de Los Cobanos; su biologia aun tiene muchos misterios.'),

-- 40 · Bailarina de Mar
(40, 1, 'fa-leaf', 'Fotosintesis animal', 'Es uno de los pocos animales que puede hacer fotosintesis al retener cloroplastos de algas que come.'),
(40, 2, 'fa-dna', 'Cleptoplastia', 'Practica cleptoplastia: roba cloroplastos y los usa durante semanas para producir energia del sol.'),
(40, 3, 'fa-palette', 'Color variable', 'Su color depende de las algas que consume, siendo un camaleon de los arrecifes.'),
(40, 4, 'fa-music', 'Bailarina', 'Recibe su nombre por los movimientos ondulantes que hace al nadar, similares a una danza.'),

-- 41 · Nudibranquio
(41, 1, 'fa-feather', 'Branquias plumosas', 'Sus branquias externas en forma de plumas le dan el nombre de nudibranquio.'),
(41, 2, 'fa-tshirt', 'Camuflaje perfecto', 'Su color y textura imitan perfectamente las rocas y algas donde vive.'),
(41, 3, 'fa-skull', 'Toxinas', 'Almacena toxinas de sus presas para defenderse; su color advierte a depredadores.'),
(41, 4, 'fa-venus-mars', 'Hermafrodita', 'Tiene organos reproductores masculinos y femeninos, pudiendo aparearse con cualquier individuo.'),

-- 42 · Pulpo de Roca
(42, 1, 'fa-brain', 'Inteligencia', 'Es considerado uno de los invertebrados mas inteligentes, capaz de resolver problemas complejos.'),
(42, 2, 'fa-tshirt', 'Camuflaje activo', 'Cambia de color y textura en segundos para camuflarse con el fondo marino.'),
(42, 3, 'fa-cut', 'Regeneracion', 'Puede regenerar brazos perdidos en combates o escapes de depredadores.'),
(42, 4, 'fa-eye', 'Ocelos falsos', 'Las manchas azules en su cabeza imitan ojos para confundir a depredadores.'),

-- 43 · Caracol Cono
(43, 1, 'fa-syringe', 'Arpon venenoso', 'Posee un diente modificado en arpon que inyecta potente toxina neurotoxica a sus presas.'),
(43, 2, 'fa-flask', 'Toxina farmacologica', 'Su veneno es estudiado para crear analgesicos mas potentes que la morfina.'),
(43, 3, 'fa-fish', 'Cazador', 'Es un depredador activo que caza gusanos y peces con su arpon.'),
(43, 4, 'fa-harpoon', 'Inyeccion', 'El arpon esta conectado a una glandula venenosa y se dispara a gran velocidad.'),

-- 44 · Caracol Murex
(44, 1, 'fa-dna', 'Purpura antigua', 'Algunos murex eran usados en la antigüedad para producir el tinte purpura real.'),
(44, 2, 'fa-hard-hat', 'Concha espinosa', 'Sus espinas protegen la concha de depredadores y ayudan a anclarse en el sustrato.'),
(44, 3, 'fa-drill', 'Perforador', 'Perfora conchas de bivalvos con su rádula para alimentarse de su carne.'),
(44, 4, 'fa-palette', 'Variedad de colores', 'Su concha puede presentar variaciones de color segun el habitat y alimentacion.'),

-- 45 · Cambute del Pacífico
(45, 1, 'fa-ruler', 'El mas grande', 'Es el gasterópodo mas grande de Los Cobanos, alcanzando 25 cm de longitud.'),
(45, 2, 'fa-shell', 'Concha valiosa', 'Su concha es utilizada en artesanía y como instrumento ceremonial.'),
(45, 3, 'fa-seedling', 'Herbivoro', 'Es herbivoro y pasta algas y pastos marinos, controlando su crecimiento.'),
(45, 4, 'fa-exclamation-triangle', 'Sobreexplotado', 'Esta bajo presión pesquera por su carne y su concha, necesitando medidas de manejo.'),

-- 46 · Ostra de Roca
(46, 1, 'fa-water', 'Filtradora', 'Una ostra puede filtrar hasta 150 litros de agua al dia, limpiando el mar.'),
(46, 2, 'fa-layer-group', 'Arrecife vivo', 'Sus bancos crean sustrato para otras especies y protegen la costa de la erosion.'),
(46, 3, 'fa-male', 'Cambio de sexo', 'Algunas ostras cambian de sexo durante su vida, comenzando como machos y terminando hembras.'),
(46, 4, 'fa-heartbeat', 'Salud del ecosistema', 'Su presencia indica agua limpia; su desaparición es señal de contaminación.'),

-- 47 · Almeja del Pacífico
(47, 1, 'fa-tshirt', 'Camuflaje', 'Se entierra en la arena dejando solo un pequeño sifon, invisible para depredadores.'),
(47, 2, 'fa-water', 'Filtradora', 'Filtra el agua eliminando bacterias y particulas, mejorando la calidad del agua.'),
(47, 3, 'fa-utensils', 'Pesca local', 'Es pescada artesanalmente por pescadores de Los Cobanos para consumo local.'),
(47, 4, 'fa-dna', 'Anillos de crecimiento', 'Sus conchas tienen anillos que permiten determinar su edad, como los arboles.'),

-- 48 · Chitón
(48, 1, 'fa-dna', 'Fosil viviente', 'Es uno de los moluscos mas primitivos, con un diseño que ha cambiado poco en 500 millones de años.'),
(48, 2, 'fa-hard-hat', 'Armadura articulada', 'Sus ocho placas articuladas le permiten enrollarse como un armadillo para protegerse.'),
(48, 3, 'fa-magnet', 'Dientes magneticos', 'Sus dientes radulares tienen puntas de magnetita, el mineral mas magnetico que existe.'),
(48, 4, 'fa-home', 'Fijacion', 'Se adhiere tan firmemente a las rocas que es casi imposible arrancarlo sin dañarlo.'),

-- 49 · Calamar Dedal
(49, 1, 'fa-rocket', 'Propulsion a chorro', 'Se desplaza expulsando agua a gran velocidad, como un cohete acuatico.'),
(49, 2, 'fa-tshirt', 'Camuflaje instantaneo', 'Cambia de color en milisegundos usando cromatoforos controlados por su sistema nervioso.'),
(49, 3, 'fa-users', 'Cardumen', 'Forma densos cardumenes que se mueven coordinadamente para confundir depredadores.'),
(49, 4, 'fa-baby', 'Ciclo de vida corto', 'Vive solo 1-2 anos y muere despues de reproducirse, dejando miles de descendientes.'),

-- 50 · Pez Lora Gigante
(50, 1, 'fa-sand', 'Productor de arena', 'Tritura coral muerto y lo excreta como arena fina, siendo el principal productor de arena del arrecife.'),
(50, 2, 'fa-palette', 'Cambio de color', 'Los machos son azul-verdes y las hembras marrones; cambian de sexo y color durante su vida.'),
(50, 3, 'fa-bed', 'Moco dormilon', 'Produce un moco gelatinoso alrededor de su cuerpo para dormir protegido de depredadores.'),
(50, 4, 'fa-dna', 'Hermafrodita', 'Todas nacen hembras y algunas se convierten en machos al madurar, cambiando tambien de color.'),

-- 51 · Pez Piedra o Escorpión
(51, 1, 'fa-tshirt', 'Camuflaje perfecto', 'Parece una roca cubierta de algas, con apendices carnosos que imitan algas.'),
(51, 2, 'fa-skull', 'Venenoso', 'Sus espinas dorsales inyectan veneno que causa dolor intenso y reacciones sistemica.'),
(51, 3, 'fa-fish', 'Emboscador', 'Permanece inmóvil hasta que una presa pasa cerca y la succiona en milisegundos.'),
(51, 4, 'fa-clock', 'Paciencia', 'Puede permanecer dias en la misma posicion esperando a su presa.'),

-- 52 · Murena Verde
(52, 1, 'fa-dragon', 'Segunda mandibula', 'Tiene una segunda mandibula faringea que se proyecta para atrapar presas.'),
(52, 2, 'fa-teeth', 'Mordida poderosa', 'Su mordida es una de las mas poderosas entre los peces, capaz de romper conchas.'),
(52, 3, 'fa-eye', 'Mala vista', 'Tiene mala vista pero excelente olfato; caza principalmente de noche.'),
(52, 4, 'fa-water', 'Respiración', 'Abre y cierra la boca constantemente para bombear agua sobre sus branquias.'),

-- 53 · Pez Mariposa de Nariz Larga
(53, 1, 'fa-ruler', 'Hocico largo', 'Su hocico alargado le permite alcanzar presas en grietas estrechas del arrecife.'),
(53, 2, 'fa-heart', 'Pareja monogama', 'Forma parejas permanentes y defiende su territorio de alimentacion juntos.'),
(53, 3, 'fa-palette', 'Colorido', 'Su amarillo brillante y cabeza negra lo hacen uno de los peces mas vistosos del arrecife.'),
(53, 4, 'fa-stethoscope', 'Indicador de salud', 'Su presencia indica un arrecife sano y bien conservado.'),

-- 54 · Pez Halcón Coralino
(54, 1, 'fa-fish', 'Señuelo', 'Tiene una mancha en la aleta dorsal que usa como señuelo para atraer presas.'),
(54, 2, 'fa-rock', 'Emboscador', 'Espera inmóvil sobre el coral y se lanza rapidamente sobre sus presas.'),
(54, 3, 'fa-tshirt', 'Camuflaje', 'Su patron de color imita perfectamente el coral donde vive.'),
(54, 4, 'fa-fighter-jet', 'Territorial', 'Defiende agresivamente su roca de otros peces halcon.'),

-- 55 · Mero Guasa
(55, 1, 'fa-dna', 'Cambio de sexo', 'Todas las hembras pueden transformarse en machos cuando alcanzan cierto tamaño.'),
(55, 2, 'fa-clock', 'Crecimiento lento', 'Crece muy lentamente y tarda años en alcanzar la madurez sexual.'),
(55, 3, 'fa-handshake', 'Pesca deportiva', 'Es una de las especies mas codiciadas por la pesca deportiva en Los Cobanos.'),
(55, 4, 'fa-exclamation-triangle', 'Sobreexplotado', 'Su poblacion esta disminuyendo por la pesca sin regulacion.'),

-- 56 · Pez Globo de Puntos Blancos
(56, 1, 'fa-balloon', 'Inflable', 'Se infla como un globo cuando se siente amenazado, multiplicando su tamaño.'),
(56, 2, 'fa-skull', 'Tetrodotoxina', 'Posee una neurotoxina letal en sus organos internos que puede matar a un humano.'),
(56, 3, 'fa-spider', 'Espinas', 'Su cuerpo esta cubierto de pequenas espinas que se erizan al inflarse.'),
(56, 4, 'fa-cut', 'Dientes fusionados', 'Tiene dientes fusionados que forman un pico poderoso para romper conchas.'),

-- 57 · Pez Corneta
(57, 1, 'fa-ruler', 'Cuerpo alargado', 'Su cuerpo tubular puede superar el metro de longitud.'),
(57, 2, 'fa-arrow-up', 'Nado vertical', 'Nada casi verticalmente entre los arrecifes para camuflarse.'),
(57, 3, 'fa-tint', 'Azul brillante', 'Tiene una linea dorsal de color azul brillante que lo hace inconfundible.'),
(57, 4, 'fa-spear', 'Arpon vivo', 'Lanza su hocico como un arpon para capturar presas.'),

-- 58 · Pez Timón Amarillo
(58, 1, 'fa-users', 'Cardumen', 'Forma grandes cardumenes que pastan algas en los arrecifes rocosos.'),
(58, 2, 'fa-seedling', 'Herbivoro', 'Es herbivoro y controla el crecimiento de algas en el arrecife.'),
(58, 3, 'fa-ship', 'Timon', 'Nada cerca de la superficie con la aleta dorsal erecta como un timon.'),
(58, 4, 'fa-palette', 'Plateado', 'Su color plateado con tonos amarillos lo hace visible desde lejos.'),

-- 59 · Ídolo Moro
(59, 1, 'fa-crown', 'Cuerno frontal', 'Tiene una prolongacion en forma de cuerno en la frente que lo hace unico.'),
(59, 2, 'fa-palette', 'El mas bello', 'Es considerado uno de los peces mas bellos del arrecife.'),
(59, 3, 'fa-users', 'Unico familiar', 'Es el unico miembro de su familia en el mundo.'),
(59, 4, 'fa-heart', 'Pareja', 'Forma parejas monogamas que permanecen juntas toda la vida.'),

-- 60 · Pez Lagarto del Pacífico
(60, 1, 'fa-eye', 'Enterrado', 'Se entierra en la arena dejando solo los ojos y la boca expuestos.'),
(60, 2, 'fa-rocket', 'Ataque vertical', 'Se lanza verticalmente como un cohete para capturar peces que pasan.'),
(60, 3, 'fa-dragon', 'Cabeza de reptil', 'Su cabeza alargada y sus ojos grandes le dan apariencia de reptil.'),
(60, 4, 'fa-clock', 'Paciencia', 'Puede permanecer horas inmóvil esperando una presa.'),

-- 61 · Chame
(61, 1, 'fa-lungs', 'Respira aire', 'Tiene un organo que le permite respirar aire en aguas con bajo oxigeno.'),
(61, 2, 'fa-utensils', 'Sopa de chame', 'Es el ingrediente principal de la sopa de chame, plato tradicional salvadoreno.'),
(61, 3, 'fa-water', 'Aguas salobres', 'Habita estuarios y manglares donde el agua es salobre.'),
(61, 4, 'fa-home', 'Pez de rio', 'Es uno de los pocos peces que vive en aguas dulces cerca del mar.'),

-- 62 · Pez Cornudo
(62, 1, 'fa-crown', 'Protuberancia', 'Los machos grandes desarrollan una protuberancia en la frente.'),
(62, 2, 'fa-palette', 'Cambio de color', 'Los juveniles son negros con rayas blancas; los adultos son azul-violeta con franjas amarillas.'),
(62, 3, 'fa-dna', 'Hermafrodita', 'Todas las hembras pueden transformarse en machos al madurar.'),
(62, 4, 'fa-fish', 'Depredador de grietas', 'Usa su hocico alargado para alcanzar presas en grietas.'),

-- 63 · Raya Águila
(63, 1, 'fa-dove', 'Vuela bajo el agua', 'Ondula sus alas pectorales para volar elegantemente bajo el agua.'),
(63, 2, 'fa-spot', 'Puntos blancos', 'Su dorso negro con puntos blancos la hace inconfundible.'),
(63, 3, 'fa-baby', 'Vivipara', 'Las crias nacen vivas; la hembra da a luz solo 3-4 crias por camada.'),
(63, 4, 'fa-users', 'Cardumen', 'Forma cardumenes que se desplazan juntos durante las mareas altas.'),

-- 64 · Pez Vela del Pacífico
(64, 1, 'fa-rocket', 'El mas rapido', 'Alcanza 110 km/h, uno de los peces mas veloces del oceano.'),
(64, 2, 'fa-sail', 'Vela', 'Su enorme aleta dorsal en forma de vela se pliega para nadar rapidamente.'),
(64, 3, 'fa-spear', 'Pico', 'Usa su pico para aturdir cardumenes de peces.'),
(64, 4, 'fa-trophy', 'Pesca deportiva', 'Es una de las especies mas codiciadas por la pesca deportiva mundial.'),

-- 65 · Cangrejo de Piedra del Pacífico
(65, 1, 'fa-hard-hat', 'Pinzas asimetricas', 'Una pinza es mas grande para triturar y la otra mas pequena para manipular.'),
(65, 2, 'fa-shield-alt', 'Caparazon duro', 'Su caparazon es extremadamente duro, protegiendolo de depredadores.'),
(65, 3, 'fa-utensils', 'Apreciado', 'Es muy apreciado en la gastronomia local por su carne.'),
(65, 4, 'fa-home', 'Oquedades', 'Habita en oquedades del arrecife rocoso que defiende agresivamente.'),

-- 66 · Cangrejo Moro de Roca
(66, 1, 'fa-running', 'El mas agil', 'Es el cangrejo mas agil de la zona de rompiente, corre en cualquier direccion.'),
(66, 2, 'fa-palette', 'Color variable', 'Los juveniles son negros; los adultos adquieren colores naranja y rojo.'),
(66, 3, 'fa-seedling', 'Limpiador', 'Alimentandose de algas mantiene limpias las rocas de la zona intermareal.'),
(66, 4, 'fa-camera', 'Fotogenico', 'Es el cangrejo mas fotografiado de las costas del Pacifico de El Salvador.'),

-- 67 · Cangrejo de Pinzas Rojas
(67, 1, 'fa-palette', 'Pinzas rojas', 'Sus pinzas de color rojo intenso son una señal de advertencia para depredadores.'),
(67, 2, 'fa-home', 'Bajo piedras', 'Es abundante bajo piedras y en grietas del intermareal.'),
(67, 3, 'fa-utensils', 'Oportunista', 'Se alimenta de lo que encuentra, siendo un omnivoro oportunista.'),
(67, 4, 'fa-water', 'Pozas de marea', 'Es una especie clave en las pozas de marea del intermareal rocoso.'),

-- 68 · Camarón de Presión de Panamá
(68, 1, 'fa-volume-up', 'Chasquido', 'Produce un chasquido de cavitacion que aturde a sus presas.'),
(68, 2, 'fa-handshake', 'Simbiosis', 'Vive en simbiosis con peces gobios que le advierten de depredadores.'),
(68, 3, 'fa-cut', 'Pinza pistola', 'Una pinza enorme especializada produce el chasquido; la otra es normal.'),
(68, 4, 'fa-sun', 'Cavitacion', 'La burbuja que genera alcanza temperaturas de miles de grados por microsegundos.'),

-- 69 · Cangrejo Ermitaño de Cabo
(69, 1, 'fa-home', 'Casa prestada', 'Usa conchas de caracol como refugio y las cambia conforme crece.'),
(69, 2, 'fa-eye', 'Ojos largos', 'Tiene ojos en largos pedunculos que le dan amplia vision.'),
(69, 3, 'fa-recycle', 'Reciclador', 'Es un importante reciclador de nutrientes en el intermareal.'),
(69, 4, 'fa-users', 'Comun', 'Es muy comun en pozas de marea y grietas de Los Cobanos.'),

-- 70 · Cangrejo Nadador de Arena
(70, 1, 'fa-swimmer', 'Cangrejo nadador', 'Sus patas traseras en forma de paleta le permiten nadar activamente.'),
(70, 2, 'fa-tshirt', 'Camuflaje', 'Su color marron-arenoso lo camufla perfectamente en el fondo.'),
(70, 3, 'fa-fighter-jet', 'Depredador rapido', 'Es un depredador activo y rapido que persigue a sus presas.'),
(70, 4, 'fa-utensils', 'Pesca local', 'Es capturado por pescadores artesanales de Los Cobanos.'),

-- 71 · Cangrejo Esponja
(71, 1, 'fa-tshirt', 'Disfraz vivo', 'Usa una esponja viva sobre su caparazon como camuflaje y defensa.'),
(71, 2, 'fa-hand-rock', 'Sostiene esponja', 'Usa sus dos ultimas patas para sostener la esponja sobre su espalda.'),
(71, 3, 'fa-home', 'La esponja crece', 'La esponja crece sobre el cangrejo, proporcionandole un disfraz perfecto.'),
(71, 4, 'fa-clock', 'Poco agil', 'Es poco agil comparado con otros cangrejos, confiando en su camuflaje.'),

-- 72 · Cangrejo Violinista
(72, 1, 'fa-music', 'Violinista', 'El macho mueve su pinza gigante como si estuviera tocando un violin.'),
(72, 2, 'fa-tshirt', 'Pinza gigante', 'El macho tiene una pinza desproporcionadamente grande para atraer hembras.'),
(72, 3, 'fa-home', 'Playas fangosas', 'Habita en playas fangosas y manglares cerca de Los Cobanos.'),
(72, 4, 'fa-baby', 'Dimorfismo', 'Las hembras tienen ambas pinzas pequenas; solo los machos tienen pinza gigante.'),

-- 73 · Cangrejo Araña Narigón
(73, 1, 'fa-spider', 'Patas largas', 'Sus patas son extremadamente largas comparadas con su cuerpo.'),
(73, 2, 'fa-tshirt', 'Decorador', 'Se cubre de algas y esponjas para camuflarse perfectamente.'),
(73, 3, 'fa-clock', 'Inmovil', 'Permanece completamente inmóvil durante el dia confiando en su camuflaje.'),
(73, 4, 'fa-users', 'Invisible', 'Es casi invisible entre las rocas y algas del arrecife.'),

-- 74 · Langosta de Arena
(74, 1, 'fa-shoe-prints', 'Zapatilla', 'Su forma aplanada como una zapatilla es adaptacion para enterrarse.'),
(74, 2, 'fa-moon', 'Nocturna', 'De dia enterrada; de noche caza moluscos y erizos.'),
(74, 3, 'fa-hand-paper', 'Sin pinzas', 'A diferencia de otras langostas, no tiene pinzas.'),
(74, 4, 'fa-exclamation-triangle', 'Poco estudiada', 'Es una de las especies menos estudiadas de Los Cobanos.'),

-- 75 · Cangrejo de Coral
(75, 1, 'fa-handshake', 'Mutualista', 'Defiende al coral de depredadores y el coral le da refugio.'),
(75, 2, 'fa-tshirt', 'Invisible', 'Su color y forma imitan perfectamente el coral donde vive.'),
(75, 3, 'fa-users', 'Pequeño', 'Es un cangrejo de pequeño tamaño, apenas 1-3 cm.'),
(75, 4, 'fa-shield-alt', 'Guardian', 'Es el guardian del coral, protegiendolo de estrellas de mar.'),

-- 76 · Cangrejo Decorador
(76, 1, 'fa-tshirt', 'Decorador', 'Pega algas, esponjas e hidroides en su caparazon para camuflarse.'),
(76, 2, 'fa-spider', 'Patas largas', 'Tiene patas extremadamente largas y un cuerpo pequeño.'),
(76, 3, 'fa-clock', 'Invisible', 'Es casi invisible cuando esta inmóvil entre las algas.'),
(76, 4, 'fa-seedling', 'Jardinero', 'Al transportar organismos vivos, dispersa esponjas y algas por el arrecife.'),

-- 77 · Camarón Camello
(77, 1, 'fa-dragon', 'Rostro articulado', 'Su rostro prominente puede moverse hacia arriba y abajo.'),
(77, 2, 'fa-palette', 'Colorido', 'Es de color rojo con bandas blancas, muy llamativo.'),
(77, 3, 'fa-moon', 'Nocturno', 'De dia se esconde en grietas; de noche sale a alimentarse.'),
(77, 4, 'fa-clock', 'Grietas', 'Habita en grietas y oquedades del arrecife rocoso.'),

-- 78 · Percebe de Roca
(78, 1, 'fa-hard-hat', 'Caparazon duro', 'Tiene un caparazon calcareo que lo protege del oleaje.'),
(78, 2, 'fa-water', 'Filtrador', 'Filtra el agua con sus apendices para alimentarse de plancton.'),
(78, 3, 'fa-users', 'Agrupamiento', 'Forma densos agrupamientos que cubren grandes areas de roca.'),
(78, 4, 'fa-dna', 'Hermafrodita', 'Es hermafrodita y se fertiliza cruzadamente con otros percebes.'),

-- 79 · Cangrejo Terrestre del Manglar
(79, 1, 'fa-home', 'Madriguera', 'Excava madrigueras profundas en el manglar para protegerse.'),
(79, 2, 'fa-palette', 'Azul', 'Los adultos tienen una coloracion azulada muy caracteristica.'),
(79, 3, 'fa-water', 'Regresa al mar', 'Debe regresar al mar para reproducirse aunque vive en tierra.'),
(79, 4, 'fa-seedling', 'Reciclador', 'Consume hojas y frutos, reciclando nutrientes en el manglar.'),

-- 80 · Nudibranquio de Rayas Negras
(80, 1, 'fa-leaf', 'Fotosintesis animal', 'Retiene cloroplastos de algas para hacer fotosintesis como una planta.'),
(80, 2, 'fa-palette', 'Lechuga de mar', 'Su aspecto verde ondulado parece una hoja de lechuga.'),
(80, 3, 'fa-dna', 'Cleptoplastia', 'Es uno de los pocos animales que roba cloroplastos de algas.'),
(80, 4, 'fa-tshirt', 'Camuflaje', 'Su color verde la camufla perfectamente entre las algas.'),

-- 81 · Lapa Gigante de México
(81, 1, 'fa-hard-hat', 'Fijacion', 'Se adhiere tan fuertemente que es casi imposible arrancarla de la roca.'),
(81, 2, 'fa-water', 'Oleaje', 'Soporta el embate de las olas en la zona de rompiente.'),
(81, 3, 'fa-seedling', 'Limpiadora', 'Raspa algas de las rocas, manteniendolas limpias.'),
(81, 4, 'fa-ruler', 'Gigante', 'Es la lapa mas grande de la costa pacifica de El Salvador.'),

-- 82 · Pulpo de Pozas
(82, 1, 'fa-brain', 'Inteligente', 'Es capaz de abrir conchas y escapar de contenedores.'),
(82, 2, 'fa-tshirt', 'Ocelos', 'Tiene manchas oceladas que usa para confundir depredadores.'),
(82, 3, 'fa-home', 'Pozas de marea', 'Esta adaptado a las duras condiciones de las pozas de marea.'),
(82, 4, 'fa-clock', 'Nocturno', 'Se esconde en grietas durante el dia y sale de noche a cazar.'),

-- 83 · Ostra Perlífera del Pacífico
(83, 1, 'fa-gem', 'Productora de perlas', 'Produce perlas de calidad en el Pacifico oriental.'),
(83, 2, 'fa-water', 'Filtradora', 'Filtra grandes cantidades de agua para alimentarse.'),
(83, 3, 'fa-shield-alt', 'Nacre', 'Su interior nacarado es de alto valor comercial.'),
(83, 4, 'fa-exclamation-triangle', 'Vulnerable', 'Esta protegida por su alto valor comercial y poblaciones reducidas.'),

-- 84 · Caracol Sombrero Chino
(84, 1, 'fa-tshirt', 'Sombrero chino', 'Su concha aplanada parece un sombrero chino.'),
(84, 2, 'fa-water', 'Filtrador', 'Filtra particulas y detritus del agua para alimentarse.'),
(84, 3, 'fa-hand-rock', 'Fijacion', 'Se fija a rocas y conchas de otros moluscos.'),
(84, 4, 'fa-shield-alt', 'Resistente', 'Su forma aplanada le permite resistir corrientes y oleaje.'),

-- 85 · Caracol Porcelana
(85, 1, 'fa-gem', 'Porcelana', 'Su concha lisa y brillante parece de porcelana.'),
(85, 2, 'fa-clock', 'Nocturno', 'Es nocturno y se esconde bajo piedras durante el dia.'),
(85, 3, 'fa-palette', 'Vistoso', 'Su color blanco con puntos marrones lo hace muy vistoso.'),
(85, 4, 'fa-exclamation-triangle', 'Coleccionable', 'Su concha es muy apreciada por coleccionistas.'),

-- 86 · Caracol Oliva de Puntos
(86, 1, 'fa-gem', 'Concha brillante', 'Su concha pulida y brillante parece de porcelana.'),
(86, 2, 'fa-moon', 'Nocturno', 'De dia enterrado en la arena; de noche sale a alimentarse.'),
(86, 3, 'fa-users', 'Carroñero', 'Se alimenta de carroña y es importante en el reciclaje.'),
(86, 4, 'fa-palette', 'Puntos blancos', 'Su concha marron con puntos blancos es caracteristica.'),

-- 87 · Liebre de Mar Gigante
(87, 1, 'fa-bug', 'Orejas de liebre', 'Tiene tentaculos en la cabeza que parecen orejas de liebre.'),
(87, 2, 'fa-tint', 'Tinta purpura', 'Libera tinta purpura para confundir a depredadores.'),
(87, 3, 'fa-seedling', 'Control de algas', 'Es importante en el control de algas en el arrecife.'),
(87, 4, 'fa-venus-mars', 'Hermafrodita', 'Es hermafrodita y se aparea con cualquier individuo.'),

-- 88 · Caracol Corona del Pacífico
(88, 1, 'fa-crown', 'Corona', 'Su concha tiene espinas que parecen una corona.'),
(88, 2, 'fa-home', 'Estuarios', 'Habita en estuarios y zonas fangosas cerca de la costa.'),
(88, 3, 'fa-utensils', 'Depredador', 'Es un depredador de bivalvos y tambien carroñero.'),
(88, 4, 'fa-water', 'Salobre', 'Tolera aguas salobres en desembocaduras de rios.'),

-- 89 · Almeja de Sifón
(89, 1, 'fa-water', 'Sifon', 'Su largo sifon sobresale del fondo para filtrar agua.'),
(89, 2, 'fa-utensils', 'Pesca local', 'Es explotada por pescadores artesanales de Los Cobanos.'),
(89, 3, 'fa-layer-group', 'Enterrada', 'Vive enterrada en la arena dejando solo el sifon expuesto.'),
(89, 4, 'fa-heartbeat', 'Cadena alimenticia', 'Es presa importante de peces y aves costeras.'),

-- 90 · Nudibranquio de Orla Dorada
(90, 1, 'fa-crown', 'Orla dorada', 'Tiene un borde dorado-anaranjado que lo hace muy vistoso.'),
(90, 2, 'fa-palette', 'Colorido', 'Su cuerpo blanco con orla dorada y branquias doradas es espectacular.'),
(90, 3, 'fa-skull', 'Toxinas', 'Acumula toxinas de las esponjas que come para defenderse.'),
(90, 4, 'fa-users', 'Poco comun', 'Es menos comun que otros nudibranquios en Los Cobanos.'),

-- 91 · Caracol Turbante
(91, 1, 'fa-tshirt', 'Turbante', 'Su forma redondeada parece un turbante.'),
(91, 2, 'fa-hard-hat', 'Operculo', 'Tiene un operculo calcareo que cierra herméticamente la concha.'),
(91, 3, 'fa-seedling', 'Herbivoro', 'Pasta algas de las rocas, controlando su crecimiento.'),
(91, 4, 'fa-gem', 'Artesania', 'Su operculo es usado en artesania y joyeria.'),

-- 92 · Callo de Hacha
(92, 1, 'fa-axe', 'Forma de hacha', 'Su concha en forma de abanico o hacha es caracteristica.'),
(92, 2, 'fa-utensils', 'Apreciado', 'Su musculo aductor (callo) es muy apreciado en gastronomia.'),
(92, 3, 'fa-water', 'Filtrador', 'Bombea grandes cantidades de agua para alimentarse.'),
(92, 4, 'fa-home', 'Semienterrada', 'Vive semienterrada en arena con la concha expuesta.'),

-- 93 · Caracol del Tinte
(93, 1, 'fa-palette', 'Tinte purpura', 'Produce un tinte purpura usado por culturas precolombinas.'),
(93, 2, 'fa-sun', 'Cambia de color', 'El tinte cambia de amarillo a purpura al exponerse al sol.'),
(93, 3, 'fa-history', 'Historia', 'Era usado por los antiguos habitantes de la region para teñir textiles.'),
(93, 4, 'fa-exclamation-triangle', 'Disminuido', 'Su poblacion ha disminuido por la recoleccion excesiva.'),

-- 94 · Calamar de Lanza
(94, 1, 'fa-rocket', 'Propulsion a chorro', 'Se desplaza expulsando agua a alta velocidad.'),
(94, 2, 'fa-tshirt', 'Camuflaje', 'Cambia de color instantaneamente para camuflarse.'),
(94, 3, 'fa-users', 'Cardumen', 'Forma grandes cardumenes que migran verticalmente.'),
(94, 4, 'fa-utensils', 'Comercial', 'Es de gran importancia comercial en la pesca de California.');

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
(2, 1, 'Degradacion de arrecifes rocosos y coralinos', 'high'),
(2, 2, 'Contaminacion costera', 'medium'),
(2, 3, 'Captura para acuarios marinos', 'medium'),
(2, 4, 'Cambio climatico y acidificacion oceanica', 'medium'),

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
(5, 1, 'Sobreexplotacion por pesca deportiva y artesanal', 'high'),
(5, 2, 'Pesca con redes de enmalle', 'medium'),
(5, 3, 'Contaminacion costera', 'medium'),
(5, 4, 'Cambio climatico', 'low'),

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

-- 8 · Jaiba Roja del Pacífico
(8, 1, 'Sobrepesca artesanal sin regulacion', 'high'),
(8, 2, 'Degradacion de arrecifes rocosos', 'high'),
(8, 3, 'Contaminacion costera', 'medium'),
(8, 4, 'Sedimentacion de fondos arenosos', 'medium'),

-- Especie 9
(9, 1, 'Coleccionismo y souvenirs marinos',       'high'),
(9, 2, 'Contaminación y acidificación',           'medium'),
(9, 3, 'Enfermedades como el síndrome de marchitamiento','medium'),
(9, 4, 'Alteración de hábitat bentónico',         'low'),

-- 10 · Camarón Mantis del Pacífico
(10, 1, 'Pesca de arrastre de fondo', 'high'),
(10, 2, 'Contaminacion de sedimentos', 'high'),
(10, 3, 'Destruccion de madrigueras por arrastre', 'medium'),
(10, 4, 'Captura incidental en pesca artesanal', 'medium'),

-- Especie 11
(11, 1, 'Pesca dirigida por branquias (medicina)','high'),
(11, 2, 'Enredamiento en redes de pesca',         'high'),
(11, 3, 'Colisiones con embarcaciones',           'medium'),
(11, 4, 'Contaminación y pérdida de plancton',    'low'),

-- Especie 12
(12, 1, 'Recolección de conchas por coleccionismo','high'),
(12, 2, 'Degradación de arrecifes de coral',      'medium'),
(12, 3, 'Contaminación de sedimentos',            'medium'),
(12, 4, 'Turismo sin regulación',                 'low'),

-- 13 · Pez Ángel Real
(13, 1, 'Pesca ornamental para acuarios',            'high'),
(13, 2, 'Blanqueamiento de coral por temperatura',   'high'),
(13, 3, 'Contaminacion costera y sedimentacion',     'medium'),
(13, 4, 'Turismo de buceo sin regulacion',           'low'),

-- 14 · Burrita Azul
(14, 1, 'Degradacion del habitat intermareal',       'high'),
(14, 2, 'Contaminacion por aguas residuales',        'medium'),
(14, 3, 'Captura incidental en pesca artesanal',     'medium'),
(14, 4, 'Perturbacion por turismo no regulado',      'low'),

-- 15 · Burrita Negra
(15, 1, 'Pisoteo y perturbacion en pozas de marea',  'high'),
(15, 2, 'Contaminacion y escorrentia agricola',      'medium'),
(15, 3, 'Eventos de blanqueamiento termico',         'medium'),
(15, 4, 'Recoleccion para acuarios',                 'low'),

-- 16 · Damisela de Acapulco
(16, 1, 'Degradacion del arrecife rocoso',           'high'),
(16, 2, 'Contaminacion por plasticos en arrecife',   'medium'),
(16, 3, 'Captura para comercio ornamental',          'medium'),
(16, 4, 'Buzos que destruyen su jardin de algas',    'low'),

-- 17 · Damisela Azul
(17, 1, 'Perdida de cobertura coralina',             'high'),
(17, 2, 'Reduccion de zooplancton por acidificacion','high'),
(17, 3, 'Pesca pelagica incidental',                 'medium'),
(17, 4, 'Contaminacion luminica costera',            'low'),

-- 18 · Pez Cirujano de Cola Amarilla
(18, 1, 'Sobrepesca artesanal directa',              'high'),
(18, 2, 'Perdida de cobertura algal por sedimentacion','medium'),
(18, 3, 'Blanqueamiento y muerte de arrecifes',      'medium'),
(18, 4, 'Captura ornamental',                        'low'),

-- 19 · Pez Cirujano de Aleta Amarilla
(19, 1, 'Pesca artesanal con red de enmalle',        'high'),
(19, 2, 'Degradacion de fondos mesofoticos',         'medium'),
(19, 3, 'Contaminacion por sedimentos',              'medium'),
(19, 4, 'Captura incidental en pesca de arrastre',   'low'),

-- 20 · Roncador Gris
(20, 1, 'Sobrepesca artesanal pesca con linea',      'high'),
(20, 2, 'Destruccion de refugios diurnos rocosos',   'medium'),
(20, 3, 'Contaminacion de fondos blandos nocturnos', 'medium'),
(20, 4, 'Turismo de pesca deportiva sin regulacion', 'low'),

-- 21 · Pargo Amarillo
(21, 1, 'Sobrepesca artesanal y comercial',          'high'),
(21, 2, 'Destruccion de manglares area de cria',     'high'),
(21, 3, 'Contaminacion de estuarios',                'medium'),
(21, 4, 'Pesca deportiva sin cuotas',                'medium'),

-- 22 · Cabrilla Loro
(22, 1, 'Pesca artesanal de arrastre en fondo',      'high'),
(22, 2, 'Perdida de esponjas por contaminacion',     'medium'),
(22, 3, 'Recoleccion como pesca de subsistencia',    'medium'),
(22, 4, 'Degradacion de arrecife rocoso profundo',   'low'),

-- 23 · Tiburón Ballena
(23, 1, 'Pesca dirigida y captura incidental',      'high'),
(23, 2, 'Colisiones con embarcaciones',             'high'),
(23, 3, 'Contaminacion por plasticos y redes',      'medium'),
(23, 4, 'Turismo de nado sin regulacion',           'low'),

-- 24 · Tiburón Martillo
(24, 1, 'Pesca de aletas finning',                  'high'),
(24, 2, 'Pesca incidental en redes de enmalle',     'high'),
(24, 3, 'Destruccion de habitat costero',           'medium'),
(24, 4, 'Cambio climatico oceanico',                'medium'),

-- 25 · Pez Vela
(25, 1, 'Pesca deportiva sin cuotas de captura',    'high'),
(25, 2, 'Pesca comercial incidental',               'medium'),
(25, 3, 'Degradacion de presas por sobrepesca',     'medium'),
(25, 4, 'Cambio climatico y migracion de presas',   'low'),

-- 26 · Tortuga Carey
(26, 1, 'Trafico de caparazon para joyeria y artesanias', 'high'),
(26, 2, 'Destruccion de arrecifes de coral habitat',       'high'),
(26, 3, 'Captura incidental en redes de pesca',            'medium'),
(26, 4, 'Contaminacion por plasticos confundidos con medusas','medium'),

-- 27 · Tortuga Golfina
(27, 1, 'Saqueo de nidos para consumo de huevos',         'high'),
(27, 2, 'Captura incidental en redes de arrastre',         'high'),
(27, 3, 'Destruccion y contaminacion de playas de anidacion','medium'),
(27, 4, 'Cambio climatico y feminizacion de poblaciones',  'medium'),

-- 28 · Tortuga Prieta
(28, 1, 'Captura incidental en pesquerias',                'high'),
(28, 2, 'Destruccion de playas de anidacion',              'high'),
(28, 3, 'Perdida de pastos marinos por contaminacion',     'medium'),
(28, 4, 'Cambio climatico y blanqueamiento de habitat',    'medium'),

-- 29 · Tortuga Baula
(29, 1, 'Ingestion de plasticos confundidos con medusas',  'high'),
(29, 2, 'Captura incidental en palangres y redes',         'high'),
(29, 3, 'Saqueo de nidos en playas de anidacion',          'medium'),
(29, 4, 'Colisiones con embarcaciones',                    'low'),

-- 30 · Langosta Espinosa
(30, 1, 'Sobrepesca y pesca fuera de veda',                'high'),
(30, 2, 'Destruccion de arrecifes rocosos habitat',        'high'),
(30, 3, 'Contaminacion costera',                           'medium'),
(30, 4, 'Cambio climatico y blanqueamiento',               'medium'),

-- 31 · Cangrejo Ermitaño
(31, 1, 'Recoleccion de conchas que los priva de hogar',   'high'),
(31, 2, 'Contaminacion de playas y plasticos',             'medium'),
(31, 3, 'Captura para comercio de mascotas',               'medium'),
(31, 4, 'Perdida de habitat costero por urbanizacion',     'low'),

-- 32 · Cangrejo Porcelana
(32, 1, 'Pisoteo en zona intermareal por turismo',         'high'),
(32, 2, 'Contaminacion y escorrentia agricola',            'medium'),
(32, 3, 'Eventos de blanqueamiento termico',               'medium'),
(32, 4, 'Extraccion de piedras del intermareal',           'low'),

-- 33 · Cangrejo Fantasma
(33, 1, 'Contaminacion luminica que desorienta sus ciclos','high'),
(33, 2, 'Compactacion de playas por turismo masivo',       'medium'),
(33, 3, 'Presencia de perros y animales domesticos',       'medium'),
(33, 4, 'Vehiculos en playa que destruyen madrigueras',    'low'),

-- 34 · Cangrejo Moro
(34, 1, 'Contaminacion de la zona de rompiente',           'high'),
(34, 2, 'Recoleccion como souvenir o para consumo',        'medium'),
(34, 3, 'Perturbacion por turismo no regulado en rocas',   'medium'),
(34, 4, 'Derrames de hidrocarburos en zona costera',       'low'),

-- 35 · Camarón Pistola
(35, 1, 'Degradacion de arrecifes rocosos habitat',        'high'),
(35, 2, 'Contaminacion por sedimentos que tapan grietas',  'medium'),
(35, 3, 'Captura incidental en pesca artesanal',           'medium'),
(35, 4, 'Contaminacion sonora submarina',                  'low'),

-- 36 · Camarón Limpiador
(36, 1, 'Degradacion del arrecife que elimina sus estaciones','high'),
(36, 2, 'Contaminacion que reduce poblaciones de peces clientes','medium'),
(36, 3, 'Captura para acuarios marinos',                   'medium'),
(36, 4, 'Turismo de buceo que perturba estaciones limpieza','low'),

-- 37 · Jaiba Azul del Pacífico
(37, 1, 'Sobrepesca artesanal sin regulacion de tallas',   'high'),
(37, 2, 'Destruccion de estuarios y manglares',            'high'),
(37, 3, 'Contaminacion de aguas estuarinas',               'medium'),
(37, 4, 'Cambio climatico y variacion de salinidad',       'medium'),

-- 38 · Cangrejo Araña
(38, 1, 'Perdida de esponjas e invertebrados por contaminacion','high'),
(38, 2, 'Degradacion de fondos rocosos de arrecife',       'medium'),
(38, 3, 'Captura incidental en pesca de fondo',            'medium'),
(38, 4, 'Sedimentacion que cubre el sustrato rocoso',      'low'),

-- 39 · Langostina de Arena
(39, 1, 'Pesca artesanal sin regulacion de tallas',        'high'),
(39, 2, 'Degradacion de fondos arenosos por arrastre',     'high'),
(39, 3, 'Contaminacion de sedimentos marinos',             'medium'),
(39, 4, 'Falta de datos para su gestion pesquera',         'medium'),

-- 40 · Bailarina de Mar
(40, 1, 'Cambio climatico que altera algas de las que depende', 'high'),
(40, 2, 'Contaminacion costera que afecta calidad del agua', 'medium'),
(40, 3, 'Perdida de habitat por urbanizacion costera', 'medium'),
(40, 4, 'Recoleccion para acuarios', 'low'),

-- 41 · Nudibranquio
(41, 1, 'Contaminacion que elimina presas (hidroides y briozoos)', 'high'),
(41, 2, 'Degradacion de arrecifes rocosos', 'medium'),
(41, 3, 'Cambio climatico y acidificacion oceanica', 'medium'),
(41, 4, 'Recoleccion para acuarios y colecciones', 'low'),

-- 42 · Pulpo de Roca
(42, 1, 'Sobrepesca para consumo humano', 'high'),
(42, 2, 'Destruccion de habitat rocoso por actividades humanas', 'high'),
(42, 3, 'Contaminacion costera', 'medium'),
(42, 4, 'Cambio climatico y acidificacion', 'medium'),

-- 43 · Caracol Cono
(43, 1, 'Recoleccion por coleccionistas por su concha vistosa', 'high'),
(43, 2, 'Degradacion de arrecifes rocosos', 'medium'),
(43, 3, 'Contaminacion de fondos marinos', 'medium'),
(43, 4, 'Cambio climatico', 'low'),

-- 44 · Caracol Murex
(44, 1, 'Recoleccion para coleccionismo y artesania', 'high'),
(44, 2, 'Sobrepesca para consumo local', 'medium'),
(44, 3, 'Perdida de habitat por sedimentacion', 'medium'),
(44, 4, 'Contaminacion de aguas costeras', 'low'),

-- 45 · Cambute del Pacífico
(45, 1, 'Sobreexplotacion por su carne y concha', 'high'),
(45, 2, 'Perdida de pastos marinos por contaminacion', 'high'),
(45, 3, 'Falta de regulacion pesquera', 'medium'),
(45, 4, 'Contaminacion costera y sedimentacion', 'medium'),

-- 46 · Ostra de Roca
(46, 1, 'Sobreexplotacion por consumo humano', 'high'),
(46, 2, 'Contaminacion de aguas costeras', 'high'),
(46, 3, 'Cambio climatico y acidificacion oceanica', 'medium'),
(46, 4, 'Destruccion de bancos naturales por actividades humanas', 'medium'),

-- 47 · Almeja del Pacífico
(47, 1, 'Sobrepesca artesanal sin regulacion de tallas', 'high'),
(47, 2, 'Contaminacion de sedimentos costeros', 'medium'),
(47, 3, 'Cambio climatico y acidificacion que afecta conchas', 'medium'),
(47, 4, 'Perdida de fondos arenosos por sedimentacion', 'low'),

-- 48 · Chitón
(48, 1, 'Recoleccion para consumo humano', 'high'),
(48, 2, 'Pisoteo en zona intermareal por turismo', 'medium'),
(48, 3, 'Contaminacion de la zona de rompiente', 'medium'),
(48, 4, 'Extraccion de rocas del intermareal', 'low'),

-- 49 · Calamar Dedal
(49, 1, 'Sobrepesca para carnada de pesca deportiva', 'high'),
(49, 2, 'Contaminacion luminica que altera comportamiento', 'medium'),
(49, 3, 'Cambio climatico que afecta temperatura del agua', 'medium'),
(49, 4, 'Contaminacion por plasticos', 'low'),

-- 50 · Pez Lora Gigante
(50, 1, 'Sobrepesca para consumo local', 'high'),
(50, 2, 'Destruccion de arrecifes coralinos', 'high'),
(50, 3, 'Cambio climatico y blanqueamiento de coral', 'medium'),
(50, 4, 'Pesca con redes de enmalle', 'medium'),

-- 51 · Pez Piedra o Escorpión
(51, 1, 'Destruccion de arrecifes rocosos', 'high'),
(51, 2, 'Contaminacion costera', 'medium'),
(51, 3, 'Captura incidental en pesca de fondo', 'medium'),
(51, 4, 'Cambio climatico', 'low'),

-- 52 · Murena Verde
(52, 1, 'Degradacion de arrecifes rocosos', 'high'),
(52, 2, 'Contaminacion de aguas costeras', 'medium'),
(52, 3, 'Pesca incidental en trampas para langosta', 'medium'),
(52, 4, 'Cambio climatico', 'low'),

-- 53 · Pez Mariposa de Nariz Larga
(53, 1, 'Perdida de arrecifes coralinos', 'high'),
(53, 2, 'Captura para acuarios marinos', 'high'),
(53, 3, 'Cambio climatico y blanqueamiento', 'medium'),
(53, 4, 'Contaminacion costera', 'medium'),

-- 54 · Pez Halcón Coralino
(54, 1, 'Degradacion de arrecifes coralinos', 'high'),
(54, 2, 'Captura para acuarios', 'medium'),
(54, 3, 'Contaminacion costera', 'medium'),
(54, 4, 'Cambio climatico', 'low'),

-- 55 · Mero Guasa
(55, 1, 'Sobreexplotacion pesquera', 'high'),
(55, 2, 'Pesca deportiva sin regulacion', 'high'),
(55, 3, 'Destruccion de habitat rocoso', 'medium'),
(55, 4, 'Cambio climatico', 'medium'),

-- 56 · Pez Globo de Puntos Blancos
(56, 1, 'Contaminacion por plasticos', 'high'),
(56, 2, 'Degradacion de arrecifes', 'medium'),
(56, 3, 'Captura incidental', 'medium'),
(56, 4, 'Cambio climatico', 'low'),

-- 57 · Pez Corneta
(57, 1, 'Degradacion de arrecifes', 'high'),
(57, 2, 'Contaminacion costera', 'medium'),
(57, 3, 'Captura incidental', 'medium'),
(57, 4, 'Cambio climatico', 'low'),

-- 58 · Pez Timón Amarillo
(58, 1, 'Sobrepesca para consumo', 'high'),
(58, 2, 'Perdida de praderas de algas', 'medium'),
(58, 3, 'Contaminacion costera', 'medium'),
(58, 4, 'Cambio climatico', 'low'),

-- 59 · Ídolo Moro
(59, 1, 'Captura para acuarios', 'high'),
(59, 2, 'Degradacion de arrecifes coralinos', 'high'),
(59, 3, 'Cambio climatico', 'medium'),
(59, 4, 'Contaminacion costera', 'medium'),

-- 60 · Pez Lagarto del Pacífico
(60, 1, 'Pesca de arrastre de fondo', 'high'),
(60, 2, 'Contaminacion de sedimentos', 'medium'),
(60, 3, 'Degradacion de fondos arenosos', 'medium'),
(60, 4, 'Cambio climatico', 'low'),

-- 61 · Chame
(61, 1, 'Sobrepesca para consumo tradicional', 'high'),
(61, 2, 'Destruccion de manglares y estuarios', 'high'),
(61, 3, 'Contaminacion de aguas dulces', 'medium'),
(61, 4, 'Cambio climatico', 'medium'),

-- 62 · Pez Cornudo
(62, 1, 'Sobrepesca para consumo', 'high'),
(62, 2, 'Degradacion de arrecifes rocosos', 'medium'),
(62, 3, 'Captura incidental', 'medium'),
(62, 4, 'Contaminacion costera', 'low'),

-- 63 · Raya Águila
(63, 1, 'Pesca incidental en redes de enmalle', 'high'),
(63, 2, 'Contaminacion costera', 'high'),
(63, 3, 'Pesca deportiva', 'medium'),
(63, 4, 'Cambio climatico', 'medium'),

-- 64 · Pez Vela del Pacífico
(64, 1, 'Sobreexplotacion por pesca deportiva', 'high'),
(64, 2, 'Pesca comercial con palangres', 'high'),
(64, 3, 'Contaminacion por plasticos', 'medium'),
(64, 4, 'Cambio climatico', 'medium'),

-- 65 · Cangrejo de Piedra del Pacífico
(65, 1, 'Sobreexplotacion por consumo', 'high'),
(65, 2, 'Destruccion de arrecifes rocosos', 'high'),
(65, 3, 'Pesca sin regulacion de tallas', 'medium'),
(65, 4, 'Contaminacion costera', 'medium'),

-- 66 · Cangrejo Moro de Roca
(66, 1, 'Pisoteo en zona intermareal por turismo', 'high'),
(66, 2, 'Contaminacion de la zona de rompiente', 'medium'),
(66, 3, 'Recoleccion como souvenir', 'medium'),
(66, 4, 'Derrames de hidrocarburos', 'low'),

-- 67 · Cangrejo de Pinzas Rojas
(67, 1, 'Pisoteo en zona intermareal', 'high'),
(67, 2, 'Contaminacion costera', 'medium'),
(67, 3, 'Extraccion de piedras del intermareal', 'medium'),
(67, 4, 'Eventos de blanqueamiento termico', 'low'),

-- 68 · Camarón de Presión de Panamá
(68, 1, 'Degradacion de arrecifes rocosos', 'high'),
(68, 2, 'Contaminacion por sedimentos', 'medium'),
(68, 3, 'Captura incidental', 'medium'),
(68, 4, 'Contaminacion sonora submarina', 'low'),

-- 69 · Cangrejo Ermitaño de Cabo
(69, 1, 'Recoleccion de conchas que los priva de hogar', 'high'),
(69, 2, 'Contaminacion de playas', 'medium'),
(69, 3, 'Pisoteo en zona intermareal', 'medium'),
(69, 4, 'Perdida de habitat costero', 'low'),

-- 70 · Cangrejo Nadador de Arena
(70, 1, 'Sobrepesca artesanal', 'high'),
(70, 2, 'Pesca de arrastre de fondo', 'high'),
(70, 3, 'Contaminacion de fondos arenosos', 'medium'),
(70, 4, 'Cambio climatico', 'medium'),

-- 71 · Cangrejo Esponja
(71, 1, 'Perdida de esponjas por contaminacion', 'high'),
(71, 2, 'Degradacion de arrecifes rocosos', 'medium'),
(71, 3, 'Sedimentacion que cubre sustrato', 'medium'),
(71, 4, 'Cambio climatico', 'low'),

-- 72 · Cangrejo Violinista
(72, 1, 'Destruccion de manglares', 'high'),
(72, 2, 'Contaminacion de playas fangosas', 'high'),
(72, 3, 'Urbanizacion costera', 'medium'),
(72, 4, 'Cambio climatico y nivel del mar', 'medium'),

-- 73 · Cangrejo Araña Narigón
(73, 1, 'Perdida de algas y esponjas por contaminacion', 'high'),
(73, 2, 'Degradacion de fondos rocosos', 'medium'),
(73, 3, 'Captura incidental', 'medium'),
(73, 4, 'Sedimentacion', 'low'),

-- 74 · Langosta de Arena
(74, 1, 'Pesca artesanal sin regulacion', 'high'),
(74, 2, 'Degradacion de fondos arenosos', 'high'),
(74, 3, 'Contaminacion de sedimentos', 'medium'),
(74, 4, 'Falta de datos para gestion', 'medium'),

-- 75 · Cangrejo de Coral
(75, 1, 'Perdida de corales por blanqueamiento', 'high'),
(75, 2, 'Degradacion de arrecifes coralinos', 'high'),
(75, 3, 'Cambio climatico', 'high'),
(75, 4, 'Contaminacion costera', 'medium'),

-- 76 · Cangrejo Decorador
(76, 1, 'Perdida de algas y esponjas', 'high'),
(76, 2, 'Degradacion de arrecifes rocosos', 'medium'),
(76, 3, 'Contaminacion costera', 'medium'),
(76, 4, 'Sedimentacion', 'low'),

-- 77 · Camarón Camello
(77, 1, 'Degradacion de arrecifes rocosos', 'high'),
(77, 2, 'Contaminacion costera', 'medium'),
(77, 3, 'Captura para acuarios', 'medium'),
(77, 4, 'Cambio climatico', 'low'),

-- 78 · Percebe de Roca
(78, 1, 'Contaminacion costera', 'high'),
(78, 2, 'Pisoteo en zona intermareal', 'medium'),
(78, 3, 'Recoleccion para consumo', 'medium'),
(78, 4, 'Cambio climatico y acidificacion', 'medium'),

-- 79 · Cangrejo Terrestre del Manglar
(79, 1, 'Destruccion de manglares', 'high'),
(79, 2, 'Urbanizacion costera', 'high'),
(79, 3, 'Contaminacion de zonas humedas', 'medium'),
(79, 4, 'Cambio climatico y nivel del mar', 'medium'),

-- 80 · Nudibranquio de Rayas Negras
(80, 1, 'Cambio climatico que altera algas', 'high'),
(80, 2, 'Contaminacion costera', 'medium'),
(80, 3, 'Perdida de habitat por urbanizacion', 'medium'),
(80, 4, 'Recoleccion para acuarios', 'low'),

-- 81 · Lapa Gigante de México
(81, 1, 'Recoleccion para consumo humano', 'high'),
(81, 2, 'Pisoteo en zona intermareal', 'high'),
(81, 3, 'Contaminacion de la zona de rompiente', 'medium'),
(81, 4, 'Extraccion de rocas del intermareal', 'medium'),

-- 82 · Pulpo de Pozas
(82, 1, 'Contaminacion de pozas de marea', 'high'),
(82, 2, 'Pisoteo en zona intermareal', 'high'),
(82, 3, 'Recoleccion para consumo', 'medium'),
(82, 4, 'Cambio climatico', 'medium'),

-- 83 · Ostra Perlífera del Pacífico
(83, 1, 'Sobreexplotacion por perlas y nacre', 'high'),
(83, 2, 'Contaminacion costera', 'high'),
(83, 3, 'Cambio climatico y acidificacion', 'high'),
(83, 4, 'Destruccion de arrecifes rocosos', 'medium'),

-- 84 · Caracol Sombrero Chino
(84, 1, 'Contaminacion de fondos marinos', 'high'),
(84, 2, 'Sedimentacion', 'medium'),
(84, 3, 'Degradacion de arrecifes rocosos', 'medium'),
(84, 4, 'Cambio climatico', 'low'),

-- 85 · Caracol Porcelana
(85, 1, 'Recoleccion por coleccionistas', 'high'),
(85, 2, 'Contaminacion de fondos marinos', 'medium'),
(85, 3, 'Degradacion de arrecifes rocosos', 'medium'),
(85, 4, 'Cambio climatico', 'low'),

-- 86 · Caracol Oliva de Puntos
(86, 1, 'Recoleccion por coleccionistas', 'high'),
(86, 2, 'Contaminacion de fondos arenosos', 'medium'),
(86, 3, 'Pesca de arrastre de fondo', 'medium'),
(86, 4, 'Cambio climatico', 'low'),

-- 87 · Liebre de Mar Gigante
(87, 1, 'Contaminacion costera', 'high'),
(87, 2, 'Perdida de praderas de algas', 'high'),
(87, 3, 'Cambio climatico', 'medium'),
(87, 4, 'Recoleccion para acuarios', 'low'),

-- 88 · Caracol Corona del Pacífico
(88, 1, 'Contaminacion de estuarios', 'high'),
(88, 2, 'Destruccion de manglares', 'high'),
(88, 3, 'Recoleccion para consumo', 'medium'),
(88, 4, 'Cambio climatico', 'medium'),

-- 89 · Almeja de Sifón
(89, 1, 'Sobrepesca artesanal', 'high'),
(89, 2, 'Contaminacion de sedimentos', 'medium'),
(89, 3, 'Cambio climatico y acidificacion', 'medium'),
(89, 4, 'Perdida de fondos arenosos', 'low'),

-- 90 · Nudibranquio de Orla Dorada
(90, 1, 'Perdida de esponjas por contaminacion', 'high'),
(90, 2, 'Degradacion de arrecifes rocosos', 'medium'),
(90, 3, 'Cambio climatico', 'medium'),
(90, 4, 'Contaminacion costera', 'medium'),

-- 91 · Caracol Turbante
(91, 1, 'Recoleccion para consumo y artesania', 'high'),
(91, 2, 'Contaminacion costera', 'medium'),
(91, 3, 'Degradacion de arrecifes rocosos', 'medium'),
(91, 4, 'Cambio climatico', 'low'),

-- 92 · Callo de Hacha
(92, 1, 'Sobreexplotacion por su carne', 'high'),
(92, 2, 'Pesca de arrastre de fondo', 'high'),
(92, 3, 'Contaminacion de sedimentos', 'medium'),
(92, 4, 'Cambio climatico', 'medium'),

-- 93 · Caracol del Tinte
(93, 1, 'Recoleccion excesiva para tinte', 'high'),
(93, 2, 'Pisoteo en zona intermareal', 'high'),
(93, 3, 'Contaminacion costera', 'medium'),
(93, 4, 'Extraccion de rocas del intermareal', 'low'),

-- 94 · Calamar de Lanza
(94, 1, 'Sobrepesca comercial', 'high'),
(94, 2, 'Contaminacion por plasticos', 'medium'),
(94, 3, 'Cambio climatico', 'medium'),
(94, 4, 'Pesca incidental', 'low');


  USE simulador;
UPDATE especies
SET
    model_path = '../public/media/3D_Models/bailarina.glb'
WHERE id = 40;

USE simulador;
UPDATE especies
SET
scale_3d = 3.0
WHERE id = 40;

USE simulador;
UPDATE especies
SET rot_y =  -1.57
WHERE id = 40;
-- =============================================================
--  VERIFICACIÓN
-- =============================================================
SELECT COUNT(*) FROM especies;      -- debe dar 94
SELECT COUNT(*) FROM curiosidades;  -- debe dar 376
SELECT COUNT(*) FROM amenazas;      -- debe dar 376
SELECT MAX(id) FROM especies;

-- NO ejecutes este:
-- UPDATE especies SET habitat = CONCAT(habitat, ' de Los Cobanos'), zona_geografica = 'Los Cobanos, El Salvador' WHERE id BETWEEN 1 AND 12 AND zona_geografica != 'Los Cobanos, El Salvador';

