// ========== NO PONGAS IMPORTS AQUÍ - Van en el HTML con importmap ==========

document.addEventListener('DOMContentLoaded', function () {

    // ========== DATOS DE ESPECIES ==========
    const speciesData = [
        {
            id: 1, name: "Tortuga verde", scientificName: "Chelonia mydas", category: "tortugas",
            habitat: "Arrecifes costeros, pastos marinos",
            desc: "La tortuga verde es una de las especies de tortugas marinas más grandes y la única herbívora en su etapa adulta. Realiza migraciones épicas de hasta 2,600 km entre sus áreas de alimentación y anidación.",
            dieta: "Herbívora (pastos marinos, algas)", longevidad: "80-100 años",
            peligro: "En peligro de extinción",
            tamaño: "90-120 cm", peso: "80-150 kg",
            reproduccion: "Anidación estacional", huevos: "100-200 huevos por nidada",
            depredadores: "Tiburones, cocodrilos, humanos",
            temperatura: "24 – 30 °C", salinidad: "Marina (~35 ppt)", zona_luz: "Zona fótica",
            profundidad_min: "0", profundidad_max: "40", zona_geografica: "Trópicos globales",
            map_x: 110, map_y: 55,
            curiosidades: [
                { icon: "fa-compass", title: "Navegación", text: "Detecta el campo magnético terrestre para orientarse en migraciones de miles de km." },
                { icon: "fa-thermometer-half", title: "Temperatura", text: "El sexo de las crías depende de la temperatura de incubación de los huevos." },
                { icon: "fa-lungs", title: "Apnea", text: "Pueden aguantar hasta 7 horas sumergidas mientras descansan." },
                { icon: "fa-seedling", title: "Ecosistema", text: "Al pastar pastos marinos, los fertilizan y mantienen saludables los arrecifes." }
            ],
            amenazas: [
                { label: "Captura incidental en redes de pesca", level: "high" },
                { label: "Destrucción de playas de anidación", level: "high" },
                { label: "Cambio climático y feminización", level: "medium" },
                { label: "Contaminación por plásticos", level: "medium" }
            ],
            modelPath: "../public/media/3D_Models/ridley_turtle_lepidochelys_olivacea.glb",
            scale: 1.2, posY: -0.2, rotY: -1.57, camDistance: 3.2, camHeight: 0.8
        },
        {
            id: 2, name: "Pez payaso", scientificName: "Amphiprioninae", category: "peces",
            habitat: "Arrecifes de coral (asociado a anémonas)",
            desc: "Famoso por su simbiosis mutualista con anémonas marinas. Todos nacen machos y el dominante se vuelve hembra.",
            dieta: "Omnívoro (plancton, algas, restos)", longevidad: "6-10 años",
            peligro: "Preocupación menor",
            tamaño: "8-12 cm", peso: "15-30 g",
            reproduccion: "Puesta en anémonas", huevos: "100-1000 huevos por ciclo",
            depredadores: "Peces más grandes, morenas",
            temperatura: "24 – 28 °C", salinidad: "Marina (~35 ppt)", zona_luz: "Zona fótica",
            profundidad_min: "1", profundidad_max: "15", zona_geografica: "Indo-Pacífico",
            map_x: 165, map_y: 52,
            curiosidades: [
                { icon: "fa-venus-mars", title: "Hermafroditismo", text: "Todos nacen machos; el más dominante cambia de sexo al ser hembra del grupo." },
                { icon: "fa-shield-alt", title: "Inmunidad", text: "Produce una capa de moco que los protege del veneno de la anémona." },
                { icon: "fa-music", title: "Comunicación", text: "Se comunican con chasquidos y chirriados para establecer jerarquías." },
                { icon: "fa-home", title: "Simbiosis", text: "La anémona los protege de depredadores; ellos la limpian y la alimentan." }
            ],
            amenazas: [
                { label: "Blanqueamiento de coral por calentamiento", level: "high" },
                { label: "Pesca excesiva para acuarios", level: "medium" },
                { label: "Contaminación costera", level: "medium" },
                { label: "Turismo sin regulación en arrecifes", level: "low" }
            ],
            modelPath: "../public/media/3D_Models/clown_fish_low_poly_animated.glb",
            scale: 13, posY: -0.1, rotY: 1.57, camDistance: 2.2, camHeight: 0.5
        },
        {
            id: 3, name: "Pulpo", scientificName: "Octopoda", category: "moluscos",
            habitat: "Mar profundo, arrecifes rocosos",
            desc: "Uno de los invertebrados más inteligentes del planeta. Puede cambiar el color y la textura de su piel.",
            dieta: "Carnívoro (crustáceos, peces)", longevidad: "3-5 años",
            peligro: "Datos insuficientes",
            tamaño: "30-90 cm", peso: "3-10 kg",
            reproduccion: "Desove único", huevos: "100,000-500,000 huevos",
            depredadores: "Tiburones, delfines, focas",
            temperatura: "10 – 25 °C", salinidad: "Marina (~34 ppt)", zona_luz: "Zona fótica y mesopelágica",
            profundidad_min: "0", profundidad_max: "200", zona_geografica: "Océanos globales",
            map_x: 95, map_y: 40,
            curiosidades: [
                { icon: "fa-brain", title: "Inteligencia", text: "Tienen 9 cerebros: uno central y uno en cada tentáculo, que actúan de forma independiente." },
                { icon: "fa-palette", title: "Camuflaje", text: "Pueden cambiar color, textura y forma en menos de 200 milisegundos." },
                { icon: "fa-tint", title: "3 corazones", text: "Tienen tres corazones y sangre azul por la hemocianina con cobre." },
                { icon: "fa-unlock", title: "Escapistas", text: "Pueden escapar de tanques y abrir frascos; resuelven problemas complejos." }
            ],
            amenazas: [
                { label: "Pesca comercial excesiva", level: "high" },
                { label: "Acidificación del océano", level: "medium" },
                { label: "Contaminación por microplásticos", level: "medium" },
                { label: "Captura incidental", level: "low" }
            ],
            modelPath: "../public/media/3D_Models/octopus.glb",
            scale: 0.1, posY: -1.4, rotY: Math.PI, camDistance: 5, camHeight: 0.6
        },
        {
            id: 4, name: "Tiburón martillo", scientificName: "Sphyrnidae", category: "peces",
            habitat: "Aguas tropicales y templadas",
            desc: "Reconocible por su peculiar cabeza en forma de T que le proporciona visión de 360 grados.",
            dieta: "Carnívoro (rayas, peces, calamares)", longevidad: "20-30 años",
            peligro: "En peligro crítico",
            tamaño: "3-6 m", peso: "300-580 kg",
            reproduccion: "Vivípara", huevos: "10-40 crías por camada",
            depredadores: "Orcas, humanos",
            temperatura: "20 – 29 °C", salinidad: "Marina (~35 ppt)", zona_luz: "Zona fótica",
            profundidad_min: "0", profundidad_max: "300", zona_geografica: "Trópicos y subtrópicos",
            map_x: 70, map_y: 45,
            curiosidades: [
                { icon: "fa-eye", title: "Visión 360°", text: "Su cabeza en forma de T le da visión casi completa alrededor, sin punto ciego arriba." },
                { icon: "fa-magnet", title: "Electrorecepción", text: "Detecta campos eléctricos de presas enterradas en la arena mediante ampollas de Lorenzini." },
                { icon: "fa-users", title: "Cardúmenes", text: "Únicos tiburones que forman grandes grupos de hasta cientos de individuos." },
                { icon: "fa-baby", title: "Vivíparos", text: "Las crías nacen vivas y completamente formadas, listas para sobrevivir." }
            ],
            amenazas: [
                { label: "Pesca de aletas (finning)", level: "high" },
                { label: "Pesca incidental en redes", level: "high" },
                { label: "Destrucción de hábitat costero", level: "medium" },
                { label: "Cambio climático oceánico", level: "medium" }
            ],
            modelPath: "../public/media/3D_Models/hammerhead_shark.glb",
            scale: 0.6, posY: -0.2, rotY: 1.57, camDistance: 3.0, camHeight: 0.7
        },
        {
            id: 5, name: "Cirujano azul", scientificName: "Paracanthurus hepatus", category: "peces",
            habitat: "Arrecifes de coral",
            desc: "Pez de color azul eléctrico con distintiva mancha amarilla en la cola.",
            dieta: "Herbívoro (algas)", longevidad: "8-12 años",
            peligro: "Preocupación menor",
            tamaño: "20-30 cm", peso: "200-600 g",
            reproduccion: "Desove en grupo", huevos: "Miles de huevos flotantes",
            depredadores: "Tiburones, barracudas",
            temperatura: "24 – 28 °C", salinidad: "Marina (~35 ppt)", zona_luz: "Zona fótica",
            profundidad_min: "2", profundidad_max: "40", zona_geografica: "Indo-Pacífico",
            map_x: 162, map_y: 50,
            curiosidades: [
                { icon: "fa-cut", title: "Espina caudal", text: "Tienen una espina afilada en la cola con la que se defienden de depredadores." },
                { icon: "fa-leaf", title: "Control de algas", text: "Al pastar algas, permiten el crecimiento de coral y mantienen el arrecife saludable." },
                { icon: "fa-palette", title: "Color único", text: "Su pigmento azul real es uno de los más raros en peces de arrecife." },
                { icon: "fa-film", title: "Fama mundial", text: "Popularizado por Dory en Buscando a Nemo, lo que aumentó su demanda en acuarios." }
            ],
            amenazas: [
                { label: "Pesca para comercio de acuarios", level: "high" },
                { label: "Blanqueamiento de coral", level: "high" },
                { label: "Contaminación marina", level: "medium" },
                { label: "Turismo irresponsable", level: "low" }
            ],
            modelPath: "../public/media/3D_Models/hand_painted_surgeon_fish.glb",
            scale: 10.0, posY: -0.2, rotY: 1.57, camDistance: 2.8, camHeight: 0.7
        },
        {
            id: 6, name: "Caballito de mar", scientificName: "Hippocampus", category: "peces",
            habitat: "Praderas marinas, manglares",
            desc: "Pez único que nada en posición vertical. El macho es el responsable de la gestación.",
            dieta: "Carnívoro (pequeños crustáceos)", longevidad: "1-4 años",
            peligro: "Vulnerable",
            tamaño: "5-15 cm", peso: "5-15 g",
            reproduccion: "Gestación masculina", huevos: "50-150 crías",
            depredadores: "Cangrejos, peces grandes",
            temperatura: "20 – 28 °C", salinidad: "Marina (~33-35 ppt)", zona_luz: "Zona fótica",
            profundidad_min: "0", profundidad_max: "30", zona_geografica: "Costas tropicales",
            map_x: 100, map_y: 50,
            curiosidades: [
                { icon: "fa-baby", title: "Machos gestantes", text: "El único animal donde el macho lleva y da a luz a las crías en su bolsa ventral." },
                { icon: "fa-eye", title: "Ojos independientes", text: "Pueden mover cada ojo de forma independiente, como los camaleones." },
                { icon: "fa-anchor", title: "Cola prensil", text: "Se aferran a corales y algas con su cola para no ser arrastrados por corrientes." },
                { icon: "fa-swimmer", title: "Mal nadador", text: "Son los peces más lentos del mundo, se mueven por batido de la aleta dorsal." }
            ],
            amenazas: [
                { label: "Medicina tradicional y coleccionismo", level: "high" },
                { label: "Destrucción de praderas marinas", level: "high" },
                { label: "Pesca incidental", level: "medium" },
                { label: "Acuarios y curios marinos", level: "medium" }
            ],
            modelPath: "../public/media/3D_Models/seahorse_from_poly_by_google.glb",
            scale: 0.0050, posY: -0.3, rotY: 1.57, camDistance: 2.8, camHeight: 0.7
        },
        {
            id: 7, name: "Delfín nariz de botella", scientificName: "Tursiops truncatus", category: "peces",
            habitat: "Océano abierto, zonas costeras",
            desc: "Mamífero marino extremadamente inteligente. Vive en manadas y se comunica mediante silbidos.",
            dieta: "Carnívoro (peces, calamares)", longevidad: "40-50 años",
            peligro: "Preocupación menor",
            tamaño: "2-4 m", peso: "150-650 kg",
            reproduccion: "Vivípara", huevos: "1 cría cada 2-3 años",
            depredadores: "Tiburones, orcas",
            temperatura: "10 – 32 °C", salinidad: "Marina (~35 ppt)", zona_luz: "Zona fótica",
            profundidad_min: "0", profundidad_max: "500", zona_geografica: "Océanos globales",
            map_x: 75, map_y: 42,
            curiosidades: [
                { icon: "fa-satellite-dish", title: "Ecolocalización", text: "Emiten clicks ultrasónicos y analizan el eco para detectar presas con precisión milimétrica." },
                { icon: "fa-moon", title: "Sueño hemisférico", text: "Duermen con medio cerebro a la vez para seguir respirando en superficie." },
                { icon: "fa-id-badge", title: "Identidad", text: "Cada delfín tiene un silbido único que funciona como su 'nombre' personal." },
                { icon: "fa-heart", title: "Empatía", text: "Ayudan a compañeros heridos y han rescatado humanos en el mar." }
            ],
            amenazas: [
                { label: "Redes de pesca y captura incidental", level: "high" },
                { label: "Contaminación acústica submarina", level: "medium" },
                { label: "Derrames de petróleo", level: "medium" },
                { label: "Turismo de avistamiento irresponsable", level: "low" }
            ],
            modelPath: "../public/media/3D_Models/cute_dolphin.glb",
            scale: 1.5, posY: -0.3, rotY: 1.57, camDistance: 4.5, camHeight: 0.8
        },
        {
            id: 8, name: "Cangrejo ermitaño", scientificName: "Paguroidea", category: "crustaceos",
            habitat: "Zonas intermareales, fondos arenosos",
            desc: "Utiliza conchas vacías como refugio. A medida que crece, debe buscar conchas más grandes.",
            dieta: "Omnívoro (detritus, algas)", longevidad: "3-12 años",
            peligro: "Preocupación menor",
            tamaño: "5-15 cm", peso: "10-50 g",
            reproduccion: "Puesta de huevos", huevos: "Miles de huevos",
            depredadores: "Pulpos, peces, aves",
            temperatura: "18 – 27 °C", salinidad: "Marina o estuarina", zona_luz: "Intermareal",
            profundidad_min: "0", profundidad_max: "10", zona_geografica: "Costas tropicales",
            map_x: 100, map_y: 55,
            curiosidades: [
                { icon: "fa-home", title: "Casa prestada", text: "Usan conchas de gasterópodos vacías; organizan intercambios masivos en cadena." },
                { icon: "fa-hand-rock", title: "Sociabilidad", text: "Se reúnen en grupos para intercambiar conchas de forma ordenada y pacífica." },
                { icon: "fa-recycle", title: "Recicladores", text: "Son descomponedores clave; procesan materia orgánica en el sedimento." },
                { icon: "fa-shield-alt", title: "Defensa", text: "Se retraen dentro de la concha y bloquean la entrada con su pinza más grande." }
            ],
            amenazas: [
                { label: "Recolección de conchas (privación de hogar)", level: "high" },
                { label: "Contaminación de playas", level: "medium" },
                { label: "Captura para comercio de mascotas", level: "medium" },
                { label: "Pérdida de hábitat costero", level: "low" }
            ],
            modelPath: "../public/media/3D_Models/little_hermit_crab.glb",
            scale: 33.0, posY: 0.3, rotY: -25, camDistance: 2.5, camHeight: 0.5
        },
        {
            id: 9, name: "Estrella de mar", scientificName: "Asteroidea", category: "moluscos",
            habitat: "Fondos rocosos, arenosos",
            desc: "Equinodermo con gran capacidad regenerativa. Puede perder un brazo y volver a crecerlo.",
            dieta: "Carnívoro (mejillones, almejas)", longevidad: "5-35 años",
            peligro: "Preocupación menor",
            tamaño: "10-30 cm", peso: "50-500 g",
            reproduccion: "Reproducción sexual y asexual", huevos: "Miles de huevos",
            depredadores: "Gaviotas, nutrias, peces",
            temperatura: "5 – 25 °C", salinidad: "Marina (~35 ppt)", zona_luz: "Zona bentónica",
            profundidad_min: "0", profundidad_max: "200", zona_geografica: "Océanos globales",
            map_x: 95, map_y: 40,
            curiosidades: [
                { icon: "fa-hand-paper", title: "Regeneración", text: "Pueden regenerar un brazo perdido en meses; algunos regeneran el cuerpo entero desde un brazo." },
                { icon: "fa-stomach", title: "Digestión externa", text: "Expulsan su estómago fuera del cuerpo para digerir presas dentro de sus conchas." },
                { icon: "fa-shoe-prints", title: "Sin cerebro", text: "No tienen cerebro ni sangre; usan agua de mar a presión para moverse y funcionar." },
                { icon: "fa-eye", title: "Ojos en tentáculos", text: "Tienen pequeños fotorreceptores en las puntas de sus brazos para detectar luz." }
            ],
            amenazas: [
                { label: "Coleccionismo y souvenirs marinos", level: "high" },
                { label: "Contaminación y acidificación", level: "medium" },
                { label: "Enfermedades como el síndrome de marchitamiento", level: "medium" },
                { label: "Alteración de hábitat bentónico", level: "low" }
            ],
            modelPath: "../public/media/3D_Models/starfish.glb",
            scale: 0.9, posY: -0.1, rotY: 0, camDistance: 2.8, camHeight: 0.5
        },
        {
            id: 10, name: "Langosta espinosa", scientificName: "Palinuridae", category: "crustaceos",
            habitat: "Arrecifes rocosos, fondos duros",
            desc: "Carece de pinzas grandes, usa sus largas antenas para defenderse.",
            dieta: "Omnívoro (moluscos, algas)", longevidad: "15-20 años",
            peligro: "Preocupación menor",
            tamaño: "20-40 cm", peso: "0.5-3 kg",
            reproduccion: "Puesta de huevos", huevos: "50,000-500,000 huevos",
            depredadores: "Pulpos, peces grandes, humanos",
            temperatura: "18 – 28 °C", salinidad: "Marina (~35 ppt)", zona_luz: "Zona bentónica",
            profundidad_min: "1", profundidad_max: "90", zona_geografica: "Trópicos y subtrópicos",
            map_x: 80, map_y: 50,
            curiosidades: [
                { icon: "fa-compass", title: "Navegación magnética", text: "Pueden orientarse usando el campo magnético terrestre durante migraciones." },
                { icon: "fa-music", title: "Estridulación", text: "Producen sonidos frotando sus antenas contra el caparazón para espantar depredadores." },
                { icon: "fa-users", title: "Migraciones en fila", text: "Migran en filas de hasta 50 individuos tomados de las antenas del de delante." },
                { icon: "fa-hard-hat", title: "Muda", text: "Mudan su exoesqueleto para crecer; quedan vulnerables durante horas hasta que se endurece." }
            ],
            amenazas: [
                { label: "Sobrepesca y pesca ilegal", level: "high" },
                { label: "Destrucción de arrecifes de coral", level: "high" },
                { label: "Contaminación costera", level: "medium" },
                { label: "Cambio climático y blanqueamiento", level: "medium" }
            ],
            modelPath: "../public/media/3D_Models/lobster.glb",
            scale: 0.15, posY: -0.15, rotY: 0, camDistance: 3.0, camHeight: 0.6
        },
        {
            id: 11, name: "Mantarraya", scientificName: "Mobula birostris", category: "peces",
            habitat: "Aguas cálidas tropicales",
            desc: "Una de las rayas más grandes del mundo. Filtradora de plancton conocida por sus impresionantes saltos.",
            dieta: "Carnívoro (plancton, peces pequeños)", longevidad: "15-20 años",
            peligro: "Vulnerable",
            tamaño: "3-5 m", peso: "500-1500 kg",
            reproduccion: "Vivípara", huevos: "1-2 crías por camada",
            depredadores: "Tiburones, orcas",
            temperatura: "20 – 30 °C", salinidad: "Marina (~35 ppt)", zona_luz: "Zona fótica y epipelágica",
            profundidad_min: "0", profundidad_max: "1000", zona_geografica: "Trópicos globales",
            map_x: 105, map_y: 52,
            curiosidades: [
                { icon: "fa-brain", title: "Mayor cerebro", text: "Tienen el mayor cerebro en proporción al cuerpo de todos los peces." },
                { icon: "fa-rocket", title: "Saltos", text: "Pueden saltar varios metros fuera del agua; aún se desconoce la razón exacta." },
                { icon: "fa-filter", title: "Filtración", text: "Filtran hasta 30 kg de plancton por hora pasando agua por sus branquias modificadas." },
                { icon: "fa-graduation-cap", title: "Curiosas", text: "Se acercan a buzos voluntariamente; parecen mostrar curiosidad hacia humanos." }
            ],
            amenazas: [
                { label: "Pesca dirigida por branquias (medicina)", level: "high" },
                { label: "Enredamiento en redes de pesca", level: "high" },
                { label: "Colisiones con embarcaciones", level: "medium" },
                { label: "Contaminación y pérdida de plancton", level: "low" }
            ],
            modelPath: "../public/media/3D_Models/mantarraya.glb",
            scale: 1.5, posY: -0.2, rotY: 0, camDistance: 3.2, camHeight: 0.6
        },
        {
            id: 12, name: "Caracol cono", scientificName: "Conus geographus", category: "moluscos",
            habitat: "Arenas y arrecifes",
            desc: "Molusco depredador que usa un arpón modificado para inyectar veneno.",
            dieta: "Carnívoro (gusanos, peces)", longevidad: "10-15 años",
            peligro: "Preocupación menor",
            tamaño: "10-15 cm", peso: "50-150 g",
            reproduccion: "Puesta de huevos", huevos: "Miles de huevos",
            depredadores: "Peces, tortugas",
            temperatura: "22 – 30 °C", salinidad: "Marina (~35 ppt)", zona_luz: "Bentónica fótica",
            profundidad_min: "0", profundidad_max: "50", zona_geografica: "Indo-Pacífico",
            map_x: 160, map_y: 55,
            curiosidades: [
                { icon: "fa-syringe", title: "Veneno letal", text: "Produce conotoxinas que atacan el sistema nervioso; no hay antídoto conocido." },
                { icon: "fa-crosshairs", title: "Arpón harpaxóforo", text: "Su 'diente' es un arpón retráctil que puede disparar en cualquier dirección." },
                { icon: "fa-pills", title: "Medicina", text: "Sus conotoxinas son base de Ziconotide, un analgésico más potente que la morfina." },
                { icon: "fa-moon", title: "Caza nocturna", text: "Son activos de noche; detectan presas con un sifón que analiza partículas en el agua." }
            ],
            amenazas: [
                { label: "Recolección de conchas por coleccionismo", level: "high" },
                { label: "Degradación de arrecifes de coral", level: "medium" },
                { label: "Contaminación de sedimentos", level: "medium" },
                { label: "Turismo sin regulación", level: "low" }
            ],
            modelPath: "../public/media/3D_Models/cone_snail_shell.glb",
            scale: 0.8, posY: -0.1, rotY: 0, camDistance: 2.5, camHeight: 0.5
        }
    ];

    // ========== ESTADO ==========
    let state = {
        currentCategory: 'todos',
        currentSearch: '',
        favorites: new Set(),
        notes: JSON.parse(localStorage.getItem('blueEcoNotes') || '[]'),
        currentView: 'home',
        currentSpecies: null
    };

    function persistNotes() {
        localStorage.setItem('blueEcoNotes', JSON.stringify(state.notes));
    }

    // ========== DOM ==========
    const searchInput  = document.getElementById('searchInput');
    const filterBtns   = document.querySelectorAll('.ftab');
    const speciesGrid  = document.getElementById('speciesGrid');
    const noResultsDiv = document.getElementById('noResults');

    // ========== UTILS ==========
    function getCoverClass(cat) {
        const m = { peces:'cover-peces', tortugas:'cover-tortugas', crustaceos:'cover-crustaceos', moluscos:'cover-moluscos' };
        return m[cat] || 'cover-default';
    }
    function getCategoryText(cat) {
        const m = { peces:'🐟 Peces', tortugas:'🐢 Tortugas', crustaceos:'🦞 Crustáceos', moluscos:'🐚 Moluscos' };
        return m[cat] || '🌊 Marina';
    }
    function getDangerClass(p) {
        if (p === 'En peligro crítico') return 'critico';
        if (p === 'En peligro de extinción') return 'peligro';
        if (p === 'Vulnerable') return 'vulnerable';
        return 'seguro';
    }
    function getDangerIcon(p) {
        if (p === 'En peligro crítico') return '🔴';
        if (p === 'En peligro de extinción') return '🟠';
        if (p === 'Vulnerable') return '🟡';
        return '🟢';
    }
    function escapeHtml(t) {
        if (!t) return '';
        const d = document.createElement('div');
        d.textContent = t;
        return d.innerHTML;
    }
    function makeCardBubbles(count = 5) {
        return Array.from({ length: count }, () => {
            const size = (Math.random() * 8 + 4).toFixed(1);
            const left = (Math.random() * 80 + 10).toFixed(1);
            const top  = (Math.random() * 70 + 20).toFixed(1);
            const dur  = (Math.random() * 3 + 2).toFixed(1);
            const del  = (Math.random() * 4).toFixed(1);
            const rise = (-(Math.random() * 80 + 40)).toFixed(0);
            const sway = ((Math.random() - 0.5) * 30).toFixed(1);
            return `<div class="card-bubble" style="width:${size}px;height:${size}px;left:${left}%;top:${top}%;--rise:${rise}px;--sway:${sway}px;--duration:${dur}s;--delay:${del}s;"></div>`;
        }).join('');
    }
    function getImgSrc(name) {
        const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return `../public/media/Species/${slug}.png`;
    }
    function getCitesLevel(id) {
        if (id === 1) return 'Apéndice I';
        if (id === 4 || id === 11) return 'Apéndice II';
        return 'No listado';
    }

    function initSidebarTooltips() {
        const tooltips = { navInicio: 'Catálogo', navFavoritos: 'Favoritos', navNotas: 'Notas' };
        Object.entries(tooltips).forEach(([id, label]) => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('data-tooltip', label);
        });
    }
    initSidebarTooltips();

    // ========== VISTA SWITCHER ==========
    window.showView = function (viewName) {
        document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
        const target = document.getElementById('view-' + viewName);
        if (target) target.classList.add('active');
        document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
        const navMap = { home: 'navInicio', favorites: 'navFavoritos', notes: 'navNotas' };
        if (navMap[viewName]) {
            const btn = document.getElementById(navMap[viewName]);
            if (btn) btn.classList.add('active');
        }
        state.currentView = viewName;
        if (viewName === 'favorites') renderFavorites();
        if (viewName === 'notes') renderNotes();
    };

    // ========== MODELO 3D ==========
    async function init3DModel(containerId, modelPath, scaleValue = 0.7, posYValue = 0, rotYValue = 0, camDistance = 3.5, camHeight = 1, isDetail = false) {
        try {
            const THREE = await import('three');
            const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
            const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');

            const container = document.getElementById(containerId);
            if (!container) return;

            const bubbleLayer = container.querySelector('.bubble-overlay-layer');
            while (container.firstChild) container.removeChild(container.firstChild);
            delete container.dataset.initialized;

            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w === 0 || h === 0) {
                setTimeout(() => init3DModel(containerId, modelPath, scaleValue, posYValue, rotYValue, camDistance, camHeight, isDetail), 100);
                return;
            }

            const scene = new THREE.Scene();

            const imagePaths = ['../public/media/backgrounds/ocean-background.jpeg'];
            let bgTexture = null;
            for (const imagePath of imagePaths) {
                try {
                    const textureLoader = new THREE.TextureLoader();
                    bgTexture = await new Promise((resolve, reject) => {
                        textureLoader.load(imagePath, resolve, undefined, reject);
                    });
                    break;
                } catch(e) { /* continuar */ }
            }
            if (bgTexture) scene.background = bgTexture;
            else scene.background = new THREE.Color(0x071828);

            const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
            camera.position.set(0, camHeight, camDistance);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.inset = '0';
            renderer.domElement.style.zIndex = '1';
            container.style.position = 'relative';
            container.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(isDetail ? 0x88ccff : 0xffffff, isDetail ? 0.65 : 0.6);
            scene.add(ambientLight);
            const mainLight = new THREE.DirectionalLight(isDetail ? 0xaaddff : 0xffffff, isDetail ? 1.4 : 1);
            mainLight.position.set(3, 5, 2);
            scene.add(mainLight);
            const fillLight = new THREE.PointLight(isDetail ? 0x44aaff : 0x88aaff, isDetail ? 0.9 : 0.5);
            fillLight.position.set(-2, 2, 3);
            scene.add(fillLight);
            if (isDetail) {
                const backLight = new THREE.PointLight(0x0066cc, 0.7);
                backLight.position.set(0, -2, -2);
                scene.add(backLight);
                const rimLight = new THREE.PointLight(0x00aaff, 0.6);
                rimLight.position.set(2, 2, -3);
                scene.add(rimLight);
                const biolumLight = new THREE.PointLight(0x7df9f0, 0.4);
                biolumLight.position.set(-3, 0, 2);
                scene.add(biolumLight);
            }

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = true;
            controls.autoRotateSpeed = isDetail ? 0.8 : 1.5;
            controls.enableZoom = isDetail;
            controls.enablePan = false;

            const loader = new GLTFLoader();
            loader.load(modelPath,
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(scaleValue, scaleValue, scaleValue);
                    model.position.set(0, posYValue, 0);
                    model.rotation.y = rotYValue;
                    model.traverse(c => {
                        if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
                    });
                    scene.add(model);
                },
                undefined,
                (error) => {
                    console.error('Error cargando modelo:', error);
                    container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(125,249,240,0.6);font-size:0.9rem;text-align:center;position:relative;z-index:20;">🐠 Modelo 3D no disponible</div>`;
                }
            );

            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
            animate();

            const resizeObserver = new ResizeObserver(() => {
                const nw = container.clientWidth;
                const nh = container.clientHeight;
                if (nw > 0 && nh > 0) {
                    camera.aspect = nw / nh;
                    camera.updateProjectionMatrix();
                    renderer.setSize(nw, nh);
                }
            });
            resizeObserver.observe(container);
            container._cleanup3d = () => resizeObserver.disconnect();

        } catch (e) {
            console.error('Error en init3DModel:', e);
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(125,249,240,0.6);font-size:0.9rem;text-align:center;">⚠️ Error al cargar el modelo 3D</div>`;
        }
    }

    // ========== BURBUJAS PANEL 3D ==========
    function generateUnderwaterBubbles() {
        const panel = document.getElementById('detail3dPanel');
        if (!panel) return;
        const existing = panel.querySelector('.bubble-overlay-layer');
        if (existing) existing.remove();

        const layer = document.createElement('div');
        layer.className = 'bubble-overlay-layer';
        layer.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:25;overflow:hidden;border-radius:inherit;`;

        const count = Math.floor(Math.random() * 12) + 8;
        for (let i = 0; i < count; i++) {
            const b = document.createElement('div');
            b.className = 'underwater-bubble';
            const size = Math.random() * 16 + 5;
            b.style.cssText = `width:${size}px;height:${size}px;left:${(Math.random()*88+6).toFixed(1)}%;top:${(Math.random()*60+30).toFixed(1)}%;--rise:${(-(Math.random()*140+80)).toFixed(0)}px;--sway:${((Math.random()-.5)*50).toFixed(1)}px;--duration:${(Math.random()*4+2.5).toFixed(1)}s;--delay:${(Math.random()*7).toFixed(1)}s;`;
            layer.appendChild(b);
        }
        panel.appendChild(layer);
    }

    // ========== PANEL INTERACTIVO ==========
    function buildInteractivePanel(species) {
        const curiosidades = species.curiosidades || [
            { icon: 'fa-bolt',   title: 'Dato 1', text: 'Información no disponible' },
            { icon: 'fa-brain',  title: 'Dato 2', text: 'Información no disponible' },
            { icon: 'fa-heart',  title: 'Dato 3', text: 'Información no disponible' },
            { icon: 'fa-eye',    title: 'Dato 4', text: 'Información no disponible' },
        ];
        const amenazas = species.amenazas || [
            { label: 'Pesca ilegal y sobreexplotación', level: 'high' },
            { label: 'Contaminación del hábitat',        level: 'high' },
            { label: 'Cambio climático',                 level: 'medium' },
            { label: 'Turismo sin regulación',           level: 'low' },
        ];

        // Mini mapa SVG con punto animado
        const mx = species.map_x || 95;
        const my = species.map_y || 40;
        const mapSVG = `
        <svg viewBox="0 0 220 110" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect width="220" height="110" fill="#071828"/>
          <g fill="rgba(125,249,240,0.14)" stroke="rgba(86,207,225,0.28)" stroke-width="0.5">
            <path d="M12,22 L38,18 L45,30 L52,26 L58,38 L48,52 L38,55 L25,48 L15,38 Z"/>
            <path d="M60,15 L90,12 L98,20 L105,18 L112,30 L108,45 L98,52 L82,55 L68,48 L58,35 L55,25 Z"/>
            <path d="M65,58 L80,54 L90,62 L88,78 L78,88 L62,85 L58,72 Z"/>
            <path d="M118,20 L145,16 L155,28 L158,42 L148,52 L132,56 L120,45 L115,32 Z"/>
            <path d="M150,58 L165,54 L172,66 L168,80 L155,84 L145,74 Z"/>
            <path d="M170,22 L198,18 L206,30 L208,44 L195,50 L178,48 L168,38 L165,28 Z"/>
            <path d="M180,58 L205,54 L210,68 L205,82 L188,86 L176,76 L175,64 Z"/>
          </g>
          <circle cx="${mx}" cy="${my}" r="4" fill="rgba(125,249,240,0.95)"/>
          <circle cx="${mx}" cy="${my}" r="4" fill="none" stroke="rgba(125,249,240,0.6)" stroke-width="1.5">
            <animate attributeName="r" values="4;11;4" dur="2.2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2.2s" repeatCount="indefinite"/>
          </circle>
          <text x="${mx}" y="${my + 17}" text-anchor="middle" fill="rgba(125,249,240,0.65)" font-size="5.5" font-family="sans-serif">${escapeHtml(species.zona_geografica || 'Océano')}</text>
        </svg>`;

        const habitatRows = [
            { icon: 'fa-water',              label: 'Zona',         value: species.habitat.split(',')[0].trim() },
            { icon: 'fa-thermometer-half',   label: 'Temperatura',  value: species.temperatura   || '— °C' },
            { icon: 'fa-tint',               label: 'Salinidad',    value: species.salinidad     || 'Marina' },
            { icon: 'fa-sun',                label: 'Luz',          value: species.zona_luz      || 'Zona fótica' },
        ];

        const sciItems = [
            { value: species.profundidad_min  || '0',   label: 'Prof. mín (m)' },
            { value: species.profundidad_max  || '—',   label: 'Prof. máx (m)' },
            { value: species.longevidad       || '—',   label: 'Longevidad' },
            { value: species.tamaño           || '—',   label: 'Tamaño' },
            { value: species.peso             || '—',   label: 'Peso' },
            { value: getCitesLevel(species.id),          label: 'CITES' },
        ];

        return `
        <div class="detail-interactive-panel">
            <div class="interact-tabs">
                <button class="interact-tab active" data-tab="habitat">
                    <i class="fas fa-map-marked-alt"></i> Hábitat
                </button>
                <button class="interact-tab" data-tab="curiosidades">
                    <i class="fas fa-lightbulb"></i> Curiosidades
                </button>
                <button class="interact-tab" data-tab="amenazas">
                    <i class="fas fa-exclamation-triangle"></i> Amenazas
                </button>
                <button class="interact-tab" data-tab="datos">
                    <i class="fas fa-flask"></i> Datos
                </button>
            </div>
            <div class="interact-content">

                <div class="interact-pane active" id="pane-habitat">
                    <div class="habitat-map-wrap">
                        <div class="habitat-map-svg">${mapSVG}</div>
                        <div class="habitat-info-list">
                            ${habitatRows.map(r => `
                            <div class="habitat-info-row">
                                <i class="fas ${r.icon}"></i>
                                <span><strong>${escapeHtml(r.label)}:</strong> ${escapeHtml(r.value)}</span>
                            </div>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="interact-pane" id="pane-curiosidades">
                    <div class="curiosities-grid">
                        ${curiosidades.map(c => `
                        <div class="curiosity-card">
                            <div class="curiosity-icon"><i class="fas ${c.icon}"></i></div>
                            <div class="curiosity-text">
                                <strong>${escapeHtml(c.title)}</strong>
                                <span>${escapeHtml(c.text)}</span>
                            </div>
                        </div>`).join('')}
                    </div>
                </div>

                <div class="interact-pane" id="pane-amenazas">
                    <div class="threats-list">
                        ${amenazas.map(a => `
                        <div class="threat-item ${a.level}">
                            <div class="threat-dot"></div>
                            <span class="threat-label">${escapeHtml(a.label)}</span>
                            <span class="threat-level">${a.level === 'high' ? 'Alto' : a.level === 'medium' ? 'Medio' : 'Bajo'}</span>
                        </div>`).join('')}
                    </div>
                </div>

                <div class="interact-pane" id="pane-datos">
                    <div class="sci-data-grid">
                        ${sciItems.map(d => `
                        <div class="sci-data-item">
                            <div class="sci-data-value">${escapeHtml(String(d.value))}</div>
                            <div class="sci-data-label">${escapeHtml(d.label)}</div>
                        </div>`).join('')}
                    </div>
                </div>

            </div>
        </div>`;
    }

    function initInteractiveTabs(container) {
        const tabs  = container.querySelectorAll('.interact-tab');
        const panes = container.querySelectorAll('.interact-pane');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const target = container.querySelector(`#pane-${tab.dataset.tab}`);
                if (target) target.classList.add('active');
            });
        });
    }

    // ========== DETALLE COMPLETO ==========
    function openDetail(species) {
        state.currentSpecies = species;
        showView('detail');

        const badge = document.getElementById('detailBadge');
        if (badge) badge.textContent = species.scientificName;

        const isFav = state.favorites.has(species.id);
        const dangerClass = getDangerClass(species.peligro);
        const dangerIcon  = getDangerIcon(species.peligro);
        const dangerColor = dangerClass === 'critico' ? '#b91c1c' : dangerClass === 'peligro' ? '#c2410c' : dangerClass === 'vulnerable' ? '#a16207' : '#15803d';
        const dangerBg    = dangerClass === 'critico' ? '#fee2e2' : dangerClass === 'peligro' ? '#ffede0' : dangerClass === 'vulnerable' ? '#fef9e3' : '#dcfce7';

        // ── Reconstruir layout de detalle con detail-left-col ──
        const detailTopArea = document.querySelector('.detail-top-area');
        if (detailTopArea) {
            detailTopArea.innerHTML = `
                <div class="detail-left-col">
                    <div class="detail-3d-panel" id="detail3dPanel">
                        <div id="detail3dContainer"></div>
                        <div class="detail-species-badge" id="detailBadge">${escapeHtml(species.scientificName)}</div>
                    </div>
                    <div id="interactivePanelSlot"></div>
                </div>
                <div class="detail-info-sidebar" id="detailInfoSidebar"></div>
            `;
        }

        // ── Chips flotantes ──
        const panel3d = document.getElementById('detail3dPanel');
        if (panel3d) {
            panel3d.querySelectorAll('.floating-chip').forEach(c => c.remove());
            const chips = [
                { cls: 'chip-category',           icon: 'fas fa-tag',           text: getCategoryText(species.category) },
                { cls: 'chip-habitat',             icon: 'fas fa-map-marker-alt',text: species.habitat.split(',')[0].trim() },
                { cls: 'chip-longevity',           icon: 'fas fa-clock',         text: species.longevidad },
                { cls: 'chip-dieta',               icon: 'fas fa-utensils',      text: species.dieta.split('(')[0].trim() },
                { cls: 'chip-danger danger-chip',  icon: 'fas fa-shield-alt',    text: species.peligro },
            ];
            chips.forEach(({ cls, icon, text }) => {
                const chip = document.createElement('div');
                chip.className = `floating-chip ${cls}`;
                chip.innerHTML = `<i class="${icon}"></i><span>${escapeHtml(text)}</span>`;
                panel3d.appendChild(chip);
            });
        }

        // ── Panel interactivo ──
        const slot = document.getElementById('interactivePanelSlot');
        if (slot) {
            slot.innerHTML = buildInteractivePanel(species);
            initInteractiveTabs(slot);
        }

        // ── Sidebar derecho ──
        const sidebar = document.getElementById('detailInfoSidebar');
        if (sidebar) {
            sidebar.innerHTML = `
                <div class="detail-header-block">
                    <div class="detail-title-row">
                        <h2 class="detail-species-name">${escapeHtml(species.name)}</h2>
                        <button class="fav-btn-detail ${isFav ? 'active' : ''}" id="detailFavBtn">
                            <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                            <span>Favorito</span>
                        </button>
                    </div>
                    <span class="detail-scientific">${escapeHtml(species.scientificName)}</span>
                    <div style="display:inline-flex;align-items:center;gap:8px;background:${dangerBg};padding:6px 14px;border-radius:100px;margin-top:10px;">
                        <span style="font-size:1rem;">${dangerIcon}</span>
                        <span style="font-weight:700;font-size:0.75rem;color:${dangerColor};">${escapeHtml(species.peligro)}</span>
                        <span style="font-size:0.65rem;color:#6a8aaa;">CITES ${getCitesLevel(species.id)}</span>
                    </div>
                </div>

                <div class="detail-desc-block">
                    <p>${escapeHtml(species.desc)}</p>
                </div>

                <div class="detail-stats-grid">
                    <div class="detail-stat-card">
                        <div class="detail-stat-label"><i class="fas fa-utensils"></i> Dieta</div>
                        <div class="detail-stat-value">${escapeHtml(species.dieta.split('(')[0].trim())}</div>
                        ${species.dieta.includes('(') ? `<div class="detail-stat-sub">${escapeHtml(species.dieta.match(/\((.+)\)/)?.[1] || '')}</div>` : ''}
                    </div>
                    <div class="detail-stat-card">
                        <div class="detail-stat-label"><i class="fas fa-clock"></i> Longevidad</div>
                        <div class="detail-stat-value">${escapeHtml(species.longevidad)}</div>
                        <div class="detail-stat-sub">Silvestre</div>
                    </div>
                    <div class="detail-stat-card">
                        <div class="detail-stat-label"><i class="fas fa-ruler"></i> Tamaño</div>
                        <div class="detail-stat-value">${escapeHtml(species.tamaño || 'Variable')}</div>
                    </div>
                    <div class="detail-stat-card">
                        <div class="detail-stat-label"><i class="fas fa-weight-hanging"></i> Peso</div>
                        <div class="detail-stat-value">${escapeHtml(species.peso || 'Variable')}</div>
                    </div>
                    <div class="detail-stat-card full-width">
                        <div class="detail-stat-label"><i class="fas fa-map-marker-alt"></i> Hábitat</div>
                        <div class="detail-stat-value">${escapeHtml(species.habitat)}</div>
                    </div>
                    <div class="detail-stat-card">
                        <div class="detail-stat-label"><i class="fas fa-egg"></i> Reproducción</div>
                        <div class="detail-stat-value" style="font-size:0.85rem;">${escapeHtml(species.reproduccion)}</div>
                        <div class="detail-stat-sub">${escapeHtml(species.huevos)}</div>
                    </div>
                    <div class="detail-stat-card">
                        <div class="detail-stat-label"><i class="fas fa-skull-crossbones"></i> Depredadores</div>
                        <div class="detail-stat-value" style="font-size:0.82rem;line-height:1.4;">${escapeHtml(species.depredadores)}</div>
                    </div>
                </div>

                <div class="detail-actions">
                    <button class="btn-action primary" id="btnSimulacion">
                        <i class="fas fa-play-circle"></i> Iniciar simulación
                    </button>
                    <button class="btn-action secondary" id="addNoteFromDetailBtn">
                        <i class="fas fa-sticky-note"></i> Nota
                    </button>
                </div>
            `;

            document.getElementById('detailFavBtn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(species.id);
                const now = state.favorites.has(species.id);
                const btn = document.getElementById('detailFavBtn');
                btn.innerHTML = `<i class="${now ? 'fas' : 'far'} fa-heart"></i><span>Favorito</span>`;
                btn.classList.toggle('active', now);
            });
            document.getElementById('addNoteFromDetailBtn')?.addEventListener('click', () => {
                addNote(species.name, `Nota sobre ${species.name}`);
                showView('notes');
            });
            document.getElementById('btnSimulacion')?.addEventListener('click', () => {
                alert(`🌊 Simulación de ecosistema para ${species.name} próximamente`);
            });
        }

        // ── Canvas 3D ──
        const c3d = document.getElementById('detail3dContainer');
        if (c3d) {
            if (c3d._cleanup3d) { c3d._cleanup3d(); delete c3d._cleanup3d; }
            c3d.innerHTML = '';
            delete c3d.dataset.initialized;
        }

        generateUnderwaterBubbles();

        setTimeout(() => {
            init3DModel('detail3dContainer', species.modelPath, species.scale, species.posY, species.rotY, species.camDistance, species.camHeight, true);
        }, 120);
    }

    // ========== FAVORITOS ==========
    function toggleFavorite(id) {
        if (state.favorites.has(id)) state.favorites.delete(id);
        else state.favorites.add(id);
    }

    function renderFavorites() {
        const grid  = document.getElementById('favoritesGrid');
        const noFav = document.getElementById('noFavorites');
        const favSpecies = speciesData.filter(s => state.favorites.has(s.id));

        if (favSpecies.length === 0) {
            grid.style.display = 'none';
            noFav.style.display = 'flex';
            noFav.innerHTML = `
                <div class="empty-favorites-message">
                    <i class="fas fa-heart-broken"></i>
                    <div class="message-text">
                        <h4>No tienes favoritos aún</h4>
                        <p>Explora las especies y pulsa el corazón ❤️ para guardar tus favoritas</p>
                        <div class="empty-hint">
                            <i class="fas fa-lightbulb"></i>
                            <span>Descubre las especies marinas y crea tu colección</span>
                        </div>
                    </div>
                </div>`;
            return;
        }

        grid.style.display = 'grid';
        noFav.style.display = 'none';
        noFav.innerHTML = '';

        grid.innerHTML = favSpecies.map((s, idx) => {
            const imgSrc = getImgSrc(s.name);
            const dangerClass = getDangerClass(s.peligro);
            const dangerIcon  = getDangerIcon(s.peligro);
            return `
            <article class="book-card" data-id="${s.id}" style="animation-delay:${idx * 0.05}s">
                <div class="book-cover ${getCoverClass(s.category)}" style="background-image:url('${imgSrc}');">
                    <div class="cover-overlay"></div>
                    ${makeCardBubbles(5)}
                    <span class="category-chip">${getCategoryText(s.category)}</span>
                    <button class="fav-badge-card" data-id="${s.id}" title="Quitar de favoritos">❤️</button>
                </div>
                <div class="book-info">
                    <h3>${escapeHtml(s.name)}</h3>
                    <div class="book-scientific">${escapeHtml(s.scientificName)}</div>
                    <span class="book-habitat-tag"><i class="fas fa-map-marker-alt"></i>${escapeHtml(s.habitat.split(',')[0].trim())}</span>
                    <div class="book-info-divider"></div>
                    <div class="book-card-footer">
                        <span class="badge-danger-mini ${dangerClass}">${dangerIcon} ${escapeHtml(s.peligro)}</span>
                        <button class="btn-ver-especie" data-id="${s.id}"><i class="fas fa-eye"></i> Ver especie</button>
                    </div>
                </div>
            </article>`;
        }).join('');

        grid.querySelectorAll('.btn-ver-especie').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const sp = speciesData.find(x => x.id === parseInt(btn.dataset.id));
                if (sp) openDetail(sp);
            });
        });
        grid.querySelectorAll('.fav-badge-card').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                toggleFavorite(parseInt(btn.dataset.id));
                renderFavorites();
                renderCards();
            });
        });
        grid.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('click', e => {
                if (e.target.closest('.fav-badge-card') || e.target.closest('.btn-ver-especie')) return;
                const sp = speciesData.find(x => x.id === parseInt(card.dataset.id));
                if (sp) openDetail(sp);
            });
        });
    }

    // ========== NOTAS ==========
    function addNote(speciesName = '', title = 'Nueva nota') {
        state.notes.unshift({
            id: Date.now(), title, species: speciesName, text: '',
            date: new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' }),
            collapsed: false
        });
        persistNotes();
        renderNotes();
    }

    function renderNotes() {
        const container = document.getElementById('notesContainer');
        if (!container) return;

        if (state.notes.length === 0) {
            container.innerHTML = `
                <div class="empty-notes-wrapper">
                    <div class="empty-notes-message">
                        <i class="fas fa-journal-whills"></i>
                        <div class="message-text">
                            <h4>Sin notas aún</h4>
                            <p>Entra al detalle de una especie y agrega tu primera nota</p>
                            <div class="empty-hint">
                                <i class="fas fa-lightbulb"></i>
                                <span>Explora las especies y documenta tus observaciones</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            return;
        }

        container.innerHTML = state.notes.map((n, idx) => `
            <div class="note-card" data-note-id="${n.id}" style="animation-delay:${idx * 0.05}s">
                <div class="note-header">
                    <div class="note-title-display" onclick="window.toggleNoteCollapse(${n.id})">${escapeHtml(n.title)}</div>
                    <div class="note-actions">
                        <button class="note-edit-btn" onclick="window.editNoteTitle(${n.id})" title="Editar título"><i class="fas fa-pen"></i></button>
                        <button class="note-delete-btn" onclick="window.deleteNote(${n.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="note-content ${n.collapsed ? 'collapsed' : ''}">
                    ${n.species ? `<div class="note-species-tag"><i class="fas fa-fish"></i> ${escapeHtml(n.species)}</div>` : ''}
                    <textarea class="note-textarea" data-note-id="${n.id}" placeholder="Escribe tu nota aquí...">${escapeHtml(n.text)}</textarea>
                    <div class="note-date">${n.date}</div>
                </div>
            </div>`).join('');

        container.querySelectorAll('.note-textarea').forEach(ta => {
            ta.addEventListener('input', () => {
                const note = state.notes.find(n => n.id === parseInt(ta.dataset.noteId));
                if (note) { note.text = ta.value; persistNotes(); }
            });
        });
    }

    window.deleteNote = function(noteId) {
        state.notes = state.notes.filter(n => n.id !== noteId);
        persistNotes(); renderNotes();
    };
    window.toggleNoteCollapse = function(noteId) {
        const note = state.notes.find(n => n.id === noteId);
        if (note) { note.collapsed = !note.collapsed; renderNotes(); }
    };
    window.editNoteTitle = function(noteId) {
        const note = state.notes.find(n => n.id === noteId);
        if (!note) return;
        const card = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
        const titleDiv = card.querySelector('.note-title-display');
        const input = document.createElement('input');
        input.type = 'text'; input.className = 'note-title-input'; input.value = note.title;
        titleDiv.replaceWith(input);
        input.focus();
        const save = () => { const v = input.value.trim(); if (v) note.title = v; persistNotes(); renderNotes(); };
        input.addEventListener('blur', save);
        input.addEventListener('keypress', e => { if (e.key === 'Enter') save(); });
    };

    document.getElementById('addNoteBtn')?.addEventListener('click', () => {
        addNote('', 'Nueva nota'); renderNotes();
    });

    // ========== RENDER TARJETAS ==========
    function renderCards() {
        let filtered = speciesData.filter(s => {
            if (state.currentCategory !== 'todos' && s.category !== state.currentCategory) return false;
            if (state.currentSearch.trim()) {
                const q = state.currentSearch.toLowerCase();
                return s.name.toLowerCase().includes(q) || s.scientificName.toLowerCase().includes(q) || s.habitat.toLowerCase().includes(q);
            }
            return true;
        });

        if (filtered.length === 0) {
            speciesGrid.style.display = 'none';
            noResultsDiv.style.display = 'block';
            return;
        }
        speciesGrid.style.display = 'grid';
        noResultsDiv.style.display = 'none';

        speciesGrid.innerHTML = filtered.map((s, idx) => {
            const isFav = state.favorites.has(s.id);
            const imgSrc = getImgSrc(s.name);
            const dangerClass = getDangerClass(s.peligro);
            const dangerIcon  = getDangerIcon(s.peligro);
            return `
            <article class="book-card" data-id="${s.id}" style="animation-delay:${idx * 0.05}s">
                <div class="book-cover ${getCoverClass(s.category)}" style="background-image:url('${imgSrc}');background-size:cover;background-position:center;">
                    <div class="cover-overlay"></div>
                    ${makeCardBubbles(5)}
                    <span class="category-chip">${getCategoryText(s.category)}</span>
                    <button class="fav-badge-card" data-id="${s.id}" title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">${isFav ? '❤️' : '🤍'}</button>
                </div>
                <div class="book-info">
                    <h3>${escapeHtml(s.name)}</h3>
                    <div class="book-scientific">${escapeHtml(s.scientificName)}</div>
                    <span class="book-habitat-tag"><i class="fas fa-map-marker-alt"></i>${escapeHtml(s.habitat.split(',')[0].trim())}</span>
                    <p class="book-desc">${escapeHtml(s.desc.substring(0, 100))}${s.desc.length > 100 ? '...' : ''}</p>
                    <div class="book-info-divider"></div>
                    <div class="book-card-footer">
                        <span class="badge-danger-mini ${dangerClass}">${dangerIcon} ${escapeHtml(s.peligro)}</span>
                        <button class="btn-ver-especie" data-id="${s.id}">
                            <i class="fas fa-eye"></i> Ver especie
                        </button>
                    </div>
                </div>
            </article>`;
        }).join('');

        speciesGrid.querySelectorAll('.btn-ver-especie').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const sp = speciesData.find(x => x.id === parseInt(btn.dataset.id));
                if (sp) openDetail(sp);
            });
        });
        speciesGrid.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('click', e => {
                if (e.target.closest('.fav-badge-card') || e.target.closest('.btn-ver-especie')) return;
                const sp = speciesData.find(x => x.id === parseInt(card.dataset.id));
                if (sp) openDetail(sp);
            });
        });
        speciesGrid.querySelectorAll('.fav-badge-card').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                toggleFavorite(parseInt(btn.dataset.id));
                renderCards();
            });
        });
    }

    // ========== FILTROS Y BÚSQUEDA ==========
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentCategory = btn.dataset.category;
            renderCards();
        });
    });
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            state.currentSearch = e.target.value;
            renderCards();
        });
    }

    // ========== INICIO ==========
    renderCards();
});