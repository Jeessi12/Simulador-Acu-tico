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
            modelPath: "../public/media/3D_Models/ridley_turtle_lepidochelys_olivacea.glb",
            scale: 1.2, posY: -0.2, rotY: -1.57, camDistance: 3.2, camHeight: 0.8,
            distribucion: "Océanos Atlántico, Pacífico e Índico. Principales playas de anidación: Costa Rica (Tortuguero), Australia, Islas Galápagos, Caribe mexicano.",
            reproduccion: "Las hembras anidan en las mismas playas donde nacieron, cada 2-4 años. Depositan entre 100 y 200 huevos por nidada.",
            amenazas: "Pérdida de hábitat por urbanización costera, pesca incidental, cambio climático, recolección ilegal de huevos.",
            curiosidadExtra: "Pueden contener la respiración bajo el agua hasta 5 horas cuando están descansando."
        },
        {
            id: 2, name: "Pez payaso", scientificName: "Amphiprioninae", category: "peces",
            habitat: "Arrecifes de coral (asociado a anémonas)",
            desc: "Famoso por su simbiosis mutualista con anémonas marinas. Todos nacen machos y el dominante se vuelve hembra. Su color anaranjado con bandas blancas lo convierte en uno de los peces más reconocibles.",
            dieta: "Omnívoro (plancton, algas, restos)", longevidad: "6-10 años",
            peligro: "Preocupación menor",
            modelPath: "../public/media/3D_Models/clown_fish_low_poly_animated.glb",
            scale: 13, posY: -0.1, rotY: 1.57, camDistance: 2.2, camHeight: 0.5,
            distribucion: "Arrecifes del Indo-Pacífico, desde el Mar Rojo hasta las Islas Salomón y la Gran Barrera de Coral.",
            reproduccion: "El macho cuida los huevos en la base de la anémona. Hermafroditismo secuencial protándrico.",
            amenazas: "Sobreexplotación para acuariofilia, degradación de arrecifes por cambio climático, contaminación costera.",
            curiosidadExtra: "Su inmunidad al veneno de las anémonas se debe a una capa de moco especial."
        },
        {
            id: 3, name: "Pulpo", scientificName: "Octopoda", category: "moluscos",
            habitat: "Mar profundo, arrecifes rocosos",
            desc: "Uno de los invertebrados más inteligentes del planeta. Puede cambiar el color y la textura de su piel en milisegundos gracias a células llamadas cromatóforos.",
            dieta: "Carnívoro (crustáceos, peces, moluscos)", longevidad: "3-5 años",
            peligro: "Datos insuficientes",
            modelPath: "../public/media/3D_Models/octopus.glb",
            scale: 0.1, posY: -1.4, rotY: Math.PI, camDistance: 5, camHeight: 0.6,
            distribucion: "Océanos de todo el mundo, desde aguas tropicales hasta polares.",
            reproduccion: "Las hembras ponen hasta 100,000 huevos y mueren poco después de cuidarlos.",
            amenazas: "Sobrepesca, degradación de hábitats costeros, contaminación por plásticos.",
            curiosidadExtra: "Tienen tres corazones y su sangre es azul por la hemocianina (cobre)."
        },
        {
            id: 4, name: "Tiburón martillo", scientificName: "Sphyrnidae", category: "peces",
            habitat: "Aguas tropicales y templadas",
            desc: "Reconocible por su peculiar cabeza en forma de T que le proporciona visión de 360 grados. Depredador tope que regula las poblaciones de rayas, calamares y peces.",
            dieta: "Carnívoro (rayas, peces, calamares)", longevidad: "20-30 años",
            peligro: "En peligro crítico",
            modelPath: "../public/media/3D_Models/hammerhead_shark.glb",
            scale: 0.6, posY: -0.2, rotY: 1.57, camDistance: 3.0, camHeight: 0.7,
            distribucion: "Océanos Atlántico, Pacífico e Índico, principalmente en zonas costeras y arrecifes.",
            reproduccion: "Vivíparos con placenta. Las camadas tienen de 6 a 42 crías. Gestación de 9 a 11 meses.",
            amenazas: "Pesca intensiva por sus aletas, pesca incidental, baja tasa reproductiva.",
            curiosidadExtra: "Sus ojos están en los extremos de la cabeza, dándoles visión de 360 grados."
        },
        {
            id: 5, name: "Cirujano azul", scientificName: "Paracanthurus hepatus", category: "peces",
            habitat: "Arrecifes de coral",
            desc: "Pez de color azul eléctrico con distintiva mancha amarilla en la cola. Ayuda a controlar el crecimiento de algas sobre los corales.",
            dieta: "Herbívoro (algas)", longevidad: "8-12 años",
            peligro: "Preocupación menor",
            modelPath: "../public/media/3D_Models/hand_painted_surgeon_fish.glb",
            scale: 10.0, posY: -0.2, rotY: 1.57, camDistance: 2.8, camHeight: 0.7,
            distribucion: "Arrecifes del Indo-Pacífico, desde África Oriental hasta Japón.",
            reproduccion: "Desove en grupos al atardecer. Los huevos son pelágicos y las larvas se dispersan con las corrientes.",
            amenazas: "Captura para acuariofilia, blanqueamiento de corales, acidificación oceánica.",
            curiosidadExtra: "Posee una espina afilada a ambos lados de la cola que usa para defenderse."
        },
        {
            id: 6, name: "Caballito de mar", scientificName: "Hippocampus", category: "peces",
            habitat: "Praderas marinas, manglares",
            desc: "Pez único que nada en posición vertical. El macho es el responsable de la gestación.",
            dieta: "Carnívoro (pequeños crustáceos)", longevidad: "1-4 años",
            peligro: "Vulnerable",
            modelPath: "../public/media/3D_Models/seahorse_from_poly_by_google.glb",
            scale: 0.0050, posY: -0.3, rotY: 1.57, camDistance: 2.8, camHeight: 0.7,
            distribucion: "Aguas templadas y tropicales de todo el mundo, en hábitats costeros.",
            reproduccion: "El macho incuba los huevos en una bolsa ventral. Da a luz hasta 1,500 crías.",
            amenazas: "Pesca incidental, pérdida de manglares, uso en medicina tradicional.",
            curiosidadExtra: "Son monógamos y realizan danzas nupciales cada mañana, enlazando sus colas."
        },
        {
            id: 7, name: "Delfín nariz de botella", scientificName: "Tursiops truncatus", category: "peces",
            habitat: "Océano abierto, zonas costeras",
            desc: "Mamífero marino extremadamente inteligente. Vive en manadas y se comunica mediante silbidos y clicks únicos.",
            dieta: "Carnívoro (peces, calamares)", longevidad: "40-50 años",
            peligro: "Preocupación menor",
            modelPath: "../public/media/3D_Models/cute_dolphin.glb",
            scale: 1.5, posY: -0.3, rotY: 1.57, camDistance: 4.5, camHeight: 0.8,
            distribucion: "Océanos y mares templados y tropicales de todo el mundo.",
            reproduccion: "Gestación de 12 meses, una cría por parto. Amamantamiento hasta los 18 meses.",
            amenazas: "Contaminación acústica, redes de pesca, tráfico marítimo.",
            curiosidadExtra: "Cada delfín tiene un silbido único que funciona como nombre."
        },
        {
            id: 8, name: "Cangrejo ermitaño", scientificName: "Paguroidea", category: "crustaceos",
            habitat: "Zonas intermareales, fondos arenosos",
            desc: "Utiliza conchas vacías como refugio. A medida que crece, debe buscar conchas más grandes.",
            dieta: "Omnívoro (detritus, algas, pequeños invertebrados)", longevidad: "3-12 años",
            peligro: "Preocupación menor",
            modelPath: "../public/media/3D_Models/little_hermit_crab.glb",
            scale: 33.0, posY: 0.3, rotY: -25, camDistance: 2.5, camHeight: 0.5,
            distribucion: "Costas de todo el mundo, desde aguas tropicales hasta templadas.",
            reproduccion: "Las hembras transportan los huevos en el abdomen. Las larvas son planctónicas.",
            amenazas: "Contaminación costera, recolecta para acuarios, acidificación oceánica.",
            curiosidadExtra: "Forman cadenas de adopción de conchas: el más grande deja su concha y otros la ocupan."
        },
        {
            id: 9, name: "Estrella de mar", scientificName: "Asteroidea", category: "moluscos",
            habitat: "Fondos rocosos, arenosos",
            desc: "Equinodermo con gran capacidad regenerativa. Puede perder un brazo y volver a crecerlo.",
            dieta: "Carnívoro (mejillones, almejas)", longevidad: "5-35 años",
            peligro: "Preocupación menor",
            modelPath: "../public/media/3D_Models/starfish.glb",
            scale: 0.9, posY: -0.1, rotY: 0, camDistance: 2.8, camHeight: 0.5,
            distribucion: "Todos los océanos, desde la zona intermareal hasta profundidades abisales.",
            reproduccion: "Liberan gametos al agua (fecundación externa).",
            amenazas: "Acidificación oceánica, contaminación, cambio climático.",
            curiosidadExtra: "Pueden regenerar un brazo perdido, e incluso un cuerpo entero a partir de un brazo."
        },
        {
            id: 10, name: "Langosta espinosa", scientificName: "Palinuridae", category: "crustaceos",
            habitat: "Arrecifes rocosos, fondos duros",
            desc: "Carece de pinzas grandes, usa sus largas antenas para defenderse. Importante en la pesca artesanal.",
            dieta: "Omnívoro (moluscos, algas, carroña)", longevidad: "15-20 años",
            peligro: "Preocupación menor",
            modelPath: "../public/media/3D_Models/lobster.glb",
            scale: 0.15, posY: -0.15, rotY: 0, camDistance: 3.0, camHeight: 0.6,
            distribucion: "Aguas tropicales y templadas del Atlántico, Pacífico e Índico.",
            reproduccion: "Las hembras llevan los huevos en el abdomen hasta la eclosión.",
            amenazas: "Sobrepesca, pérdida de hábitat rocoso, contaminación costera.",
            curiosidadExtra: "Migran en fila india por el fondo marino durante cientos de kilómetros."
        },
        {
            id: 11, name: "Mantarraya", scientificName: "Mobula birostris", category: "peces",
            habitat: "Aguas cálidas tropicales",
            desc: "Una de las rayas más grandes del mundo. Filtradora de plancton conocida por sus impresionantes saltos fuera del agua.",
            dieta: "Carnívoro (plancton, peces pequeños)", longevidad: "15-20 años",
            peligro: "Vulnerable",
            modelPath: "../public/media/3D_Models/mantarraya.glb",
            scale: 1.5, posY: -0.2, rotY: 0, camDistance: 3.2, camHeight: 0.6,
            distribucion: "Océanos Atlántico, Pacífico e Índico, en zonas tropicales y subtropicales.",
            reproduccion: "Ovovivíparas. Nace una cría por parto.",
            amenazas: "Pesca accidental, colisión con embarcaciones, contaminación marina.",
            curiosidadExtra: "Filtran hasta 13,000 litros de agua por hora para alimentarse."
        },
        {
            id: 12, name: "Caracol cono", scientificName: "Conus geographus", category: "moluscos",
            habitat: "Arenas y arrecifes",
            desc: "Molusco depredador que usa un arpón modificado para inyectar veneno. Su toxina se estudia para desarrollar analgésicos no adictivos.",
            dieta: "Carnívoro (gusanos, peces)", longevidad: "10-15 años",
            peligro: "Preocupación menor",
            modelPath: "../public/media/3D_Models/cone_snail_shell.glb",
            scale: 0.8, posY: -0.1, rotY: 0, camDistance: 2.5, camHeight: 0.5,
            distribucion: "Arrecifes del Indo-Pacífico tropical, desde el este de África hasta Polinesia.",
            reproduccion: "Ponen cápsulas de huevos adheridas a sustratos duros.",
            amenazas: "Recolección por su concha, pérdida de hábitat, contaminación.",
            curiosidadExtra: "Su veneno contiene más de 100 toxinas, algunas usadas en investigación médica."
        }
    ];

    // ========== ESTADO EN MEMORIA ==========
    let state = {
        currentCategory: 'todos',
        currentSearch: '',
        favorites: new Set(),
        notes: [],
        currentView: 'home',
        currentSpecies: null
    };

    // ========== ELEMENTOS DOM ==========
    const searchInput  = document.getElementById('searchInput');
    const filterBtns   = document.querySelectorAll('.ftab');
    const speciesGrid  = document.getElementById('speciesGrid');
    const noResultsDiv = document.getElementById('noResults');

    // ========== UTILIDADES ==========
    function getCoverClass(cat) {
        const map = { peces: 'cover-peces', tortugas: 'cover-tortugas', crustaceos: 'cover-crustaceos', moluscos: 'cover-moluscos' };
        return map[cat] || 'cover-default';
    }
    function getCategoryText(cat) {
        const map = { peces: '🐟 Peces', tortugas: '🐢 Tortugas', crustaceos: '🦞 Crustáceos', moluscos: '🐚 Moluscos' };
        return map[cat] || '🌊 Marina';
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

    // ========== RENDER TARJETAS HOME ==========
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
            return `
            <article class="book-card" data-id="${s.id}" style="animation-delay:${idx * 0.04}s">
                <div class="book-cover ${getCoverClass(s.category)}" style="background-image: url('${imgSrc}');">
                    <div class="cover-overlay"></div>
                    ${makeCardBubbles(5)}
                    <span class="category-chip">${getCategoryText(s.category)}</span>
                    <button class="fav-badge-card" data-id="${s.id}" title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">${isFav ? '❤️' : '🤍'}</button>
                </div>
                <div class="book-info">
                    <h3>${s.name}</h3>
                    <div class="book-scientific">${s.scientificName}</div>
                    <span class="book-habitat-tag"><i class="fas fa-map-marker-alt"></i>${s.habitat.split(',')[0]}</span>
                    <p class="book-desc">${s.desc.substring(0, 90)}${s.desc.length > 90 ? '…' : ''}</p>
                    <button class="btn-ver-especie" data-id="${s.id}">
                        <i class="fas fa-eye"></i> Ver especie
                    </button>
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

    // ========== DETALLE (REDISEÑADO) ==========
    function openDetail(species) {
        state.currentSpecies = species;
        showView('detail');

        // Badge científico
        const badge = document.getElementById('detailBadge');
        if (badge) badge.textContent = species.scientificName;

        const isFav = state.favorites.has(species.id);
        const dangerClass = getDangerClass(species.peligro);
        const dangerIcon  = getDangerIcon(species.peligro);

        // ── 1. Chips flotantes sobre el panel 3D ──────────────
        const panel3d = document.getElementById('detail3dPanel');
        panel3d.querySelectorAll('.floating-chip').forEach(c => c.remove());

        const chips = [
            { cls: 'chip-category',               icon: 'fas fa-tag',           text: getCategoryText(species.category) },
            { cls: 'chip-habitat',                icon: 'fas fa-map-marker-alt', text: species.habitat.split(',')[0] },
            { cls: 'chip-longevity',              icon: 'fas fa-clock',          text: species.longevidad },
            { cls: 'chip-dieta',                  icon: 'fas fa-utensils',       text: species.dieta.split('(')[0].trim() },
            { cls: 'chip-danger danger-chip',     icon: 'fas fa-shield-alt',     text: species.peligro },
        ];
        chips.forEach(({ cls, icon, text }) => {
            const chip = document.createElement('div');
            chip.className = `floating-chip ${cls}`;
            chip.innerHTML = `<i class="${icon}"></i><span>${text}</span>`;
            panel3d.appendChild(chip);
        });

        // ── 2. Sidebar derecho ── nombre + desc + stats + acciones ──
        const sidebar = document.getElementById('detailInfoSidebar');
        sidebar.innerHTML = `
            <div>
                <h2 class="detail-species-name">${species.name}</h2>
                <div class="detail-scientific">${species.scientificName}</div>
                <button class="fav-btn-detail ${isFav ? 'active' : ''}" id="detailFavBtn">
                    ${isFav ? '❤️ En favoritos' : '🤍 Agregar a favoritos'}
                </button>
            </div>

            <div class="detail-desc-block">${species.desc}</div>

            <div class="detail-stats-grid">
                <div class="detail-stat-card">
                    <div class="detail-stat-label"><i class="fas fa-utensils"></i> Dieta</div>
                    <div class="detail-stat-value">${species.dieta.split('(')[0].trim()}</div>
                    ${species.dieta.includes('(') ? `<div class="detail-stat-sub">${species.dieta.match(/\((.+)\)/)?.[1] || ''}</div>` : ''}
                </div>
                <div class="detail-stat-card">
                    <div class="detail-stat-label"><i class="fas fa-clock"></i> Longevidad</div>
                    <div class="detail-stat-value">${species.longevidad}</div>
                </div>
                <div class="detail-stat-card full-width">
                    <div class="detail-stat-label"><i class="fas fa-shield-alt"></i> Conservación</div>
                    <span class="danger-badge ${dangerClass}">${dangerIcon} ${species.peligro}</span>
                </div>
            </div>

            <div class="detail-actions">
                <button class="btn-action primary" id="btnSimulacion">
                    <i class="fas fa-flask"></i> Iniciar simulación
                </button>
                <button class="btn-action secondary" id="addNoteFromDetailBtn">
                    <i class="fas fa-sticky-note"></i> Nota
                </button>
            </div>
        `;

        document.getElementById('detailFavBtn').addEventListener('click', () => {
            toggleFavorite(species.id);
            const btn = document.getElementById('detailFavBtn');
            const now = state.favorites.has(species.id);
            if (btn) {
                btn.textContent = now ? '❤️ En favoritos' : '🤍 Agregar a favoritos';
                btn.classList.toggle('active', now);
            }
        });
        document.getElementById('addNoteFromDetailBtn').addEventListener('click', () => {
            addNote(species.name);
            showView('notes');
        });

        // ── 3. Ocultar área antigua, montar TABS ──────────────
        const oldBottom = document.getElementById('detailBottomArea');
        if (oldBottom) oldBottom.classList.add('hidden');

        let tabsArea = document.getElementById('detailTabsArea');
        if (!tabsArea) {
            tabsArea = document.createElement('div');
            tabsArea.id = 'detailTabsArea';
            tabsArea.className = 'detail-tabs-area';
            if (oldBottom) oldBottom.insertAdjacentElement('afterend', tabsArea);
        }

        tabsArea.innerHTML = `
            <div class="detail-tab-nav">
                <button class="dtab active" data-tab="distribucion"><i class="fas fa-globe-americas"></i> Distribución</button>
                <button class="dtab" data-tab="reproduccion"><i class="fas fa-egg"></i> Reproducción</button>
                <button class="dtab" data-tab="amenazas"><i class="fas fa-exclamation-triangle"></i> Amenazas</button>
                <button class="dtab" data-tab="curiosidad"><i class="fas fa-lightbulb"></i> Dato curioso</button>
            </div>
            <div class="detail-tab-pane active" id="tab-distribucion">
                <div class="tab-content-block"><p>${species.distribucion}</p></div>
            </div>
            <div class="detail-tab-pane" id="tab-reproduccion">
                <div class="tab-content-block"><p>${species.reproduccion}</p></div>
            </div>
            <div class="detail-tab-pane" id="tab-amenazas">
                <div class="tab-content-block"><p>${species.amenazas}</p></div>
            </div>
            <div class="detail-tab-pane" id="tab-curiosidad">
                <div class="tab-content-block curiosity"><p>${species.curiosidadExtra}</p></div>
            </div>
        `;

        tabsArea.querySelectorAll('.dtab').forEach(btn => {
            btn.addEventListener('click', () => {
                tabsArea.querySelectorAll('.dtab').forEach(b => b.classList.remove('active'));
                tabsArea.querySelectorAll('.detail-tab-pane').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const pane = document.getElementById('tab-' + btn.dataset.tab);
                if (pane) pane.classList.add('active');
            });
        });

        // ── 4. Modelo 3D ──────────────────────────────────────
        const c3d = document.getElementById('detail3dContainer');
        if (c3d) { c3d.innerHTML = ''; delete c3d.dataset.initialized; }
        generateUnderwaterBubbles();
        setTimeout(() => {
            init3DModel('detail3dContainer', species.modelPath, species.scale, species.posY, species.rotY, species.camDistance, species.camHeight, true);
        }, 120);
    }

    // ========== BURBUJAS PANEL 3D ==========
    function generateUnderwaterBubbles() {
        const panel = document.getElementById('detail3dPanel');
        if (!panel) return;
        panel.querySelectorAll('.underwater-bubble').forEach(b => b.remove());
        const count = Math.floor(Math.random() * 10) + 6;
        for (let i = 0; i < count; i++) {
            const b = document.createElement('div');
            b.className = 'underwater-bubble';
            const size = Math.random() * 15 + 5;
            b.style.cssText = `
                width:${size}px; height:${size}px;
                left:${(Math.random()*88+6).toFixed(1)}%;
                top:${(Math.random()*70+20).toFixed(1)}%;
                --rise:${(-(Math.random()*120+60)).toFixed(0)}px;
                --sway:${((Math.random()-.5)*40).toFixed(1)}px;
                --duration:${(Math.random()*4+2).toFixed(1)}s;
                --delay:${(Math.random()*6).toFixed(1)}s;
            `;
            panel.appendChild(b);
        }
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
            return;
        }
        grid.style.display = 'grid';
        noFav.style.display = 'none';

        grid.innerHTML = favSpecies.map((s, idx) => {
            const imgSrc = getImgSrc(s.name);
            return `
            <article class="book-card" data-id="${s.id}" style="animation-delay:${idx*0.04}s">
                <div class="book-cover ${getCoverClass(s.category)}" style="background-image: url('${imgSrc}');">
                    <div class="cover-overlay"></div>
                    ${makeCardBubbles(5)}
                    <span class="category-chip">${getCategoryText(s.category)}</span>
                    <button class="fav-badge-card" data-id="${s.id}" title="Quitar de favoritos">❤️</button>
                </div>
                <div class="book-info">
                    <h3>${s.name}</h3>
                    <div class="book-scientific">${s.scientificName}</div>
                    <span class="book-habitat-tag"><i class="fas fa-map-marker-alt"></i>${s.habitat.split(',')[0]}</span>
                    <button class="btn-ver-especie" data-id="${s.id}"><i class="fas fa-eye"></i> Ver especie</button>
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
            id: Date.now(),
            title,
            species: speciesName,
            text: '',
            date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            collapsed: false
        });
    }

    function renderNotes() {
        const container = document.getElementById('notesContainer');
        if (!container) return;
        if (state.notes.length === 0) {
            container.innerHTML = `
                <div class="no-results no-results-centered" style="grid-column:1/-1;">
                    <i class="fas fa-sticky-note"></i>
                    <h3>Sin notas aún</h3>
                    <p>Entra al detalle de una especie y agrega tu primera nota</p>
                </div>`;
            return;
        }
        container.innerHTML = state.notes.map((n, idx) => `
            <div class="note-card" data-note-id="${n.id}" style="animation-delay:${idx*0.04}s">
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
                if (note) note.text = ta.value;
            });
        });
    }

    window.deleteNote = function (noteId) {
        state.notes = state.notes.filter(n => n.id !== noteId);
        renderNotes();
    };
    window.toggleNoteCollapse = function (noteId) {
        const note = state.notes.find(n => n.id === noteId);
        if (note) { note.collapsed = !note.collapsed; renderNotes(); }
    };
    window.editNoteTitle = function (noteId) {
        const note = state.notes.find(n => n.id === noteId);
        if (!note) return;
        const card     = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
        const titleDiv = card.querySelector('.note-title-display');
        const input    = document.createElement('input');
        input.type      = 'text';
        input.className = 'note-title-input';
        input.value     = note.title;
        titleDiv.replaceWith(input);
        input.focus();
        const save = () => {
            const v = input.value.trim();
            if (v) note.title = v;
            renderNotes();
        };
        input.addEventListener('blur', save);
        input.addEventListener('keypress', e => { if (e.key === 'Enter') save(); });
    };

    const addNoteBtn = document.getElementById('addNoteBtn');
    if (addNoteBtn) addNoteBtn.addEventListener('click', () => { addNote('', 'Nueva nota'); renderNotes(); });

    // ========== MODELO 3D ==========
    async function init3DModel(containerId, modelPath, scaleValue = 0.7, posYValue = 0, rotYValue = 0, camDistance = 3.5, camHeight = 1, isDetail = false) {
        try {
            const check = await fetch(modelPath, { method: 'HEAD' });
            if (!check.ok) {
                const c = document.getElementById(containerId);
                if (c) c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(255,255,255,0.45);font-size:12px;text-align:center;">⚠️ Modelo no disponible</div>`;
                return;
            }
            const THREE = await import('three');
            const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
            const { GLTFLoader }    = await import('three/addons/loaders/GLTFLoader.js');

            const container = document.getElementById(containerId);
            if (!container || container.dataset.initialized === 'true') return;
            container.dataset.initialized = 'true';

            const w = container.clientWidth, h = container.clientHeight;
            if (w === 0 || h === 0) return;

            const scene = new THREE.Scene();
            scene.background = null;

            const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
            camera.position.set(0, camHeight, camDistance);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);
            container.innerHTML = '';
            container.appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(isDetail ? 0x88ccff : 0xffffff, isDetail ? 0.55 : 0.6));
            const main = new THREE.DirectionalLight(isDetail ? 0xaaddff : 0xffffff, isDetail ? 1.3 : 1);
            main.position.set(3, 5, 2);
            scene.add(main);
            const fill = new THREE.PointLight(isDetail ? 0x44aaff : 0x88aaff, isDetail ? 0.8 : 0.5);
            fill.position.set(-2, 2, 3);
            scene.add(fill);
            if (isDetail) {
                const bot = new THREE.PointLight(0x0066cc, 0.6);
                bot.position.set(0, -3, 0);
                scene.add(bot);
                const rim = new THREE.PointLight(0x00aaff, 0.5);
                rim.position.set(2, 2, -3);
                scene.add(rim);
            }

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping    = true;
            controls.dampingFactor    = 0.05;
            controls.autoRotate       = true;
            controls.autoRotateSpeed  = isDetail ? 1.2 : 1.5;
            controls.enableZoom       = isDetail;
            controls.enablePan        = false;

            const loader = new GLTFLoader();
            loader.load(modelPath,
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(scaleValue, scaleValue, scaleValue);
                    model.position.set(0, posYValue, 0);
                    model.rotation.y = rotYValue;
                    model.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
                    scene.add(model);
                    function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }
                    animate();
                    new ResizeObserver(() => {
                        const nw = container.clientWidth, nh = container.clientHeight;
                        if (nw > 0 && nh > 0) { camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh); }
                    }).observe(container);
                },
                undefined,
                () => {
                    container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(255,255,255,0.4);">⚠️ Error al cargar modelo</div>`;
                }
            );
        } catch (e) { console.error('Error 3D:', e); }
    }

    // ========== BURBUJAS DE FONDO (canvas) ==========
    function initBackgroundBubbles() {
        const canvas = document.getElementById('staticBubblesCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = window.innerWidth, H = window.innerHeight;
        function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; }
        window.addEventListener('resize', resize);
        resize();
        const bubbles = Array.from({ length: 55 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            r: Math.random() * 18 + 5,
            speed: Math.random() * 0.45 + 0.12,
            opacity: Math.random() * 0.28 + 0.07
        }));
        function drawBubble(b) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            const g = ctx.createRadialGradient(b.x - b.r/3, b.y - b.r/3, b.r/10, b.x, b.y, b.r);
            g.addColorStop(0, `rgba(255,255,255,${b.opacity + 0.2})`);
            g.addColorStop(1, `rgba(180,230,255,${b.opacity * 0.5})`);
            ctx.fillStyle = g;
            ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${b.opacity + 0.2})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(b.x - b.r/3, b.y - b.r/3, b.r/5, 0, Math.PI*2);
            ctx.fillStyle = `rgba(255,255,255,${b.opacity + 0.2})`;
            ctx.fill();
        }
        function loop() {
            ctx.clearRect(0, 0, W, H);
            for (const b of bubbles) {
                drawBubble(b);
                b.y -= b.speed;
                if (b.y + b.r < 0) { b.y = H + b.r; b.x = Math.random() * W; }
            }
            requestAnimationFrame(loop);
        }
        loop();
    }

    // ========== EVENTOS FILTROS Y BÚSQUEDA ==========
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentCategory = btn.dataset.category;
            renderCards();
        });
    });
    searchInput.addEventListener('input', e => {
        state.currentSearch = e.target.value;
        renderCards();
    });

    // ========== INICIO ==========
    renderCards();
    initBackgroundBubbles();
});