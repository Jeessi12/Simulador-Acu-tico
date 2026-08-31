// ========== NO PONGAS IMPORTS AQUÍ - Van en el HTML con importmap ==========

document.addEventListener('DOMContentLoaded', async function () {

    // ========== ESTADO ==========
    let speciesData = [];

    const CATEGORY_STORAGE_KEY = 'blueEcoSpeciesCategory';
    const VALID_CATEGORIES = new Set(['todos', 'peces', 'cetaceos', 'tortugas', 'crustaceos', 'moluscos']);
    const INITIAL_ROTATION_Y_BY_SPECIES = new Map([
        ['eretmochelys imbricata', Math.PI],
        ['lepidochelys olivacea', -Math.PI / 2],
        ['dermochelys coriacea', -Math.PI / 2],
        ['chelonia mydas agassizii', -Math.PI / 2],
        ['squilla aculeata', Math.PI],
        ['holacanthus passer', Math.PI],
        ['caranx caballus', 0],
        ['abudefduf troschelii', Math.PI],
        ['abudefduf concolor', 0],
        ['stegastes acapulcoensis', 0],
        ['chromis atrilobata', 0],
        ['prionurus punctatus', 0],
        ['acanthurus xanthopterus', Math.PI],
        ['haemulon steindachneri', -Math.PI / 2],
        ['lutjanus argentiventris', 0],
        ['serranus psittacinus', 0],
        ['rhincodon typus', -Math.PI / 2],
        ['istiophorus platypterus', 0],
        ['scarus perrico', 0],
        ['scorpaena mystes', 0],
        ['gymnothorax castaneus', 0]
    ]);

    function getPersistedCategory() {
        try {
            const category = localStorage.getItem(CATEGORY_STORAGE_KEY);
            return VALID_CATEGORIES.has(category) ? category : 'todos';
        } catch (error) {
            return 'todos';
        }
    }

    function persistCategory(category) {
        try {
            localStorage.setItem(CATEGORY_STORAGE_KEY, category);
        } catch (error) {
            // El filtro sigue funcionando aunque el navegador bloquee localStorage.
        }
    }

    let state = {
        currentCategory: getPersistedCategory(),
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

    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === state.currentCategory);
    });

    // ========== CARGA DE DATOS DESDE LA API ==========
    async function loadSpeciesData() {
        // Mostrar esqueleto de carga
        speciesGrid.style.display = 'grid';
        speciesGrid.innerHTML = Array.from({ length: 6 }).map(() => `
            <article class="book-card skeleton-card">
                <div class="book-cover skeleton-cover"></div>
                <div class="book-info">
                    <div class="skeleton-line wide"></div>
                    <div class="skeleton-line medium"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </article>`).join('');

        try {
            const res  = await fetch('./api_especies.php');

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            speciesData = await res.json();

            if (!Array.isArray(speciesData) || speciesData.length === 0) {
                throw new Error('La API devolvió datos vacíos o inválidos');
            }

        } catch (err) {
            console.error('Error cargando especies:', err);
            speciesGrid.style.display = 'none';
            noResultsDiv.style.display = 'block';
            noResultsDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="color:#f97316;"></i>
                <h3>Error al cargar las especies</h3>
                <p>No se pudo conectar con la base de datos. Por favor recarga la página.</p>
                <button onclick="location.reload()" style="margin-top:12px;padding:8px 20px;border-radius:100px;border:none;background:#2d9cdb;color:#fff;cursor:pointer;font-size:0.9rem;">
                    <i class="fas fa-redo"></i> Reintentar
                </button>`;
            return false;
        }

        return true;
    }

    // ========== UTILS ==========
    function getCoverClass(cat) {
        const m = { peces:'cover-peces', cetaceos:'cover-cetaceos', tortugas:'cover-tortugas', crustaceos:'cover-crustaceos', moluscos:'cover-moluscos' };
        return m[cat] || 'cover-default';
    }
    function getCategoryText(cat) {
        const m = { peces:'🐟 Peces', cetaceos:'🐬 Cetáceos', tortugas:'🐢 Tortugas', crustaceos:'🦞 Crustáceos', moluscos:'🐚 Moluscos' };
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
    async function init3DModel(containerId, modelPath, modelView = 'side', isDetail = false, preserveOriginalLighting = false, rotationYOverride = null) {
        try {
            const THREE = await import('three');
            const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
            const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
            const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

            const container = document.getElementById(containerId);
            if (!container) return;

            const bubbleLayer = container.querySelector('.bubble-overlay-layer');
            while (container.firstChild) container.removeChild(container.firstChild);
            delete container.dataset.initialized;

            if (!modelPath) {
                container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(125,249,240,0.6);font-size:0.9rem;text-align:center;position:relative;z-index:20;"><i class="fas fa-fish" style="margin-right:8px;"></i> Modelo 3D no disponible</div>`;
                return;
            }

            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w === 0 || h === 0) {
                setTimeout(() => init3DModel(containerId, modelPath, modelView, isDetail, preserveOriginalLighting, rotationYOverride), 100);
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
            if (bgTexture) {
                // La Tortuga verde conserva tambien el tratamiento original del fondo.
                if (!preserveOriginalLighting) bgTexture.encoding = THREE.sRGBEncoding;
                scene.background = bgTexture;
            }
            else scene.background = new THREE.Color(0x071828);

            const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
            camera.position.set(0, 0.25, 4);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            if (preserveOriginalLighting) {
                renderer.outputEncoding = THREE.LinearEncoding;
                renderer.toneMapping = THREE.NoToneMapping;
                renderer.toneMappingExposure = 1;
            } else {
                renderer.outputEncoding = THREE.sRGBEncoding;
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                renderer.toneMappingExposure = 0.9;
            }
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.inset = '0';
            renderer.domElement.style.zIndex = '1';
            container.style.position = 'relative';
            container.appendChild(renderer.domElement);

            let environmentRenderTarget = null;
            if (preserveOriginalLighting) {
                // Configuracion exacta que tenia el visor antes de los ajustes de iluminacion.
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
            } else {
                // El entorno PBR neutro ilumina los materiales del GLB por si solo.
                // Evitamos sumar luces directas que quemen los colores y eliminen contraste.
                const pmremGenerator = new THREE.PMREMGenerator(renderer);
                const roomEnvironment = new RoomEnvironment();
                environmentRenderTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
                scene.environment = environmentRenderTarget.texture;
                roomEnvironment.traverse(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
                pmremGenerator.dispose();
            }

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = false;
            controls.enableZoom = isDetail;
            controls.enablePan = false;

            let mixer = null;
            const clock = new THREE.Clock();
            let model = null;
            let basePositionY = 0;
            let fittedSize = null;
            let animationFrameId = null;

            function fitCameraToModel() {
                if (!fittedSize) return;

                const verticalFov = THREE.MathUtils.degToRad(camera.fov);
                const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
                const verticalDistance = (fittedSize.y / 2) / Math.tan(verticalFov / 2);
                const horizontalDistance = (fittedSize.x / 2) / Math.tan(horizontalFov / 2);
                const cameraDistance = (Math.max(verticalDistance, horizontalDistance) + fittedSize.z / 2) * 1.08;

                camera.position.set(0, fittedSize.y * 0.03, cameraDistance);
                camera.near = Math.max(cameraDistance / 100, 0.01);
                camera.far = Math.max(cameraDistance * 20, 100);
                camera.updateProjectionMatrix();
                controls.target.set(0, 0, 0);
                controls.minDistance = cameraDistance * 0.55;
                controls.maxDistance = cameraDistance * 2.2;
                controls.update();
            }

const loader = new GLTFLoader();
loader.load(modelPath,
    (gltf) => {

        model = gltf.scene;
        // El frente estandar del GLB se conserva para cangrejos y jaibas.
        // Peces y especies alargadas se giran para mostrarse de lado.
        model.rotation.y = Number.isFinite(rotationYOverride)
            ? rotationYOverride
            : (modelView === 'front' ? 0 : Math.PI / 2);
        model.updateMatrixWorld(true);

        const initialBounds = new THREE.Box3().setFromObject(model);
        const initialSize = initialBounds.getSize(new THREE.Vector3());
        const largestDimension = Math.max(initialSize.x, initialSize.y, initialSize.z);

        if (!Number.isFinite(largestDimension) || largestDimension <= 0) {
            console.error('El modelo GLB no contiene una geometria visible:', modelPath);
            model = null;
            container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(125,249,240,0.6);font-size:0.9rem;text-align:center;position:relative;z-index:20;"><i class="fas fa-fish" style="margin-right:8px;"></i> Modelo 3D no disponible</div>`;
            return;
        }

        const normalizedSize = isDetail ? 2.6 : 1.8;
        model.scale.setScalar(normalizedSize / largestDimension);
        model.updateMatrixWorld(true);

        const scaledBounds = new THREE.Box3().setFromObject(model);
        const center = scaledBounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        basePositionY = model.position.y;
        model.traverse(c => {
            if (c.isMesh) {
                c.castShadow = true;
                c.receiveShadow = true;

                const materials = Array.isArray(c.material) ? c.material : [c.material];
                materials.forEach(material => {
                    if (!preserveOriginalLighting && (material?.isMeshStandardMaterial || material?.isMeshPhysicalMaterial)) {
                        // Reduce solo el brillo recibido del entorno; el color base del GLB no se modifica.
                        material.envMapIntensity = isDetail ? 0.62 : 0.7;
                        material.needsUpdate = true;
                    }
                });
            }
        });
        scene.add(model);

        // La camara calcula automaticamente el zoom necesario para el modelo completo.
        model.updateMatrixWorld(true);
        const fittedBounds = new THREE.Box3().setFromObject(model);
        fittedSize = fittedBounds.getSize(new THREE.Vector3());
        fitCameraToModel();

        // ── Reproducir animaciones si existen ──
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach(clip => {
                const action = mixer.clipAction(clip);
                action.play();
            });
            console.log(`✅ ${gltf.animations.length} animación(es) cargadas para ${modelPath}`);
        }
    },
    undefined,
    (error) => {
        console.error('Error cargando modelo:', error);
        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(125,249,240,0.6);font-size:0.9rem;text-align:center;position:relative;z-index:20;">🐠 Modelo 3D no disponible</div>`;
    }
);

function animate() {

    animationFrameId = requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) {
        mixer.update(delta);
    }

if (model) {

    const t = Date.now() * 0.001;

    // Flota ligeramente
    model.position.y = basePositionY + Math.sin(t * 2) * 0.08;

    // Se balancea de lado a lado
    model.rotation.z = Math.sin(t * 3) * 0.12;

    // Se inclina un poco hacia adelante y atrás
    model.rotation.x = Math.sin(t * 2.5) * 0.05;

}

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
                    fitCameraToModel();
                }
            });
            resizeObserver.observe(container);
            container._cleanup3d = () => {
                resizeObserver.disconnect();
                if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
                controls.dispose();
                renderer.dispose();
                if (bgTexture) bgTexture.dispose();
                if (environmentRenderTarget) environmentRenderTarget.dispose();
            };

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
            { value: species.profundidad_min  ?? '0',  label: 'Prof. mín (m)' },
            { value: species.profundidad_max  ?? '—',  label: 'Prof. máx (m)' },
            { value: species.longevidad       || '—',  label: 'Longevidad' },
            { value: species.tamaño           || '—',  label: 'Tamaño' },
            { value: species.peso             || '—',  label: 'Peso' },
            { value: getCitesLevel(species.id),         label: 'CITES' },
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

        const slot = document.getElementById('interactivePanelSlot');
        if (slot) {
            slot.innerHTML = buildInteractivePanel(species);
            initInteractiveTabs(slot);
        }

        const sidebar = document.getElementById('detailInfoSidebar');
        if (sidebar) {
            sidebar.innerHTML = `
                <section class="detail-info-main" aria-label="Información de la especie">
                    <div class="detail-header-block">
                        <div class="detail-title-row">
                            <h2 class="detail-species-name">${escapeHtml(species.name)}</h2>
                            <button class="fav-btn-detail ${isFav ? 'active' : ''}" id="detailFavBtn">
                                <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                                <span>Favorito</span>
                            </button>
                        </div>
                        <span class="detail-scientific">${escapeHtml(species.scientificName)}</span>
                        <div class="detail-status-row">
                            <span class="detail-danger-status" style="background:${dangerBg};color:${dangerColor};">
                                <span class="detail-danger-icon">${dangerIcon}</span>
                                <span>${escapeHtml(species.peligro)}</span>
                            </span>
                            <span class="detail-iucn-status">IUCN: ${getCitesLevel(species.id)}</span>
                        </div>
                    </div>

                    <div class="detail-desc-block">
                        <p>${escapeHtml(species.desc)}</p>
                    </div>

                    <div class="detail-stats-grid">
                    <div class="detail-stat-card">
                        <i class="fas fa-leaf detail-stat-icon"></i>
                        <div class="detail-stat-label">Dieta</div>
                        <div class="detail-stat-value">${escapeHtml(species.dieta.split('(')[0].trim())}</div>
                        <div class="detail-stat-sub">${escapeHtml(species.dieta.match(/\((.+)\)/)?.[1] || 'Alimentación habitual')}</div>
                    </div>
                    <div class="detail-stat-card">
                        <i class="fas fa-clock detail-stat-icon"></i>
                        <div class="detail-stat-label">Longevidad</div>
                        <div class="detail-stat-value">${escapeHtml(species.longevidad)}</div>
                        <div class="detail-stat-sub">Silvestre</div>
                    </div>
                    <div class="detail-stat-card">
                        <i class="fas fa-ruler detail-stat-icon"></i>
                        <div class="detail-stat-label">Tamaño</div>
                        <div class="detail-stat-value">${escapeHtml(species.tamaño || 'Variable')}</div>
                        <div class="detail-stat-sub">Longitud corporal</div>
                    </div>
                    <div class="detail-stat-card">
                        <i class="fas fa-weight-hanging detail-stat-icon"></i>
                        <div class="detail-stat-label">Peso</div>
                        <div class="detail-stat-value">${escapeHtml(species.peso || 'Variable')}</div>
                        <div class="detail-stat-sub">Peso promedio</div>
                    </div>
                    <div class="detail-stat-card">
                        <i class="fas fa-water detail-stat-icon"></i>
                        <div class="detail-stat-label">Hábitat</div>
                        <div class="detail-stat-value">${escapeHtml(species.habitat)}</div>
                        <div class="detail-stat-sub">Entorno natural</div>
                    </div>
                    <div class="detail-stat-card">
                        <i class="fas fa-dna detail-stat-icon"></i>
                        <div class="detail-stat-label">Reproducción</div>
                        <div class="detail-stat-value">${escapeHtml(species.reproduccion)}</div>
                        <div class="detail-stat-sub">${escapeHtml(species.huevos || 'Promedio por nidada')}</div>
                    </div>
                    </div>

                    <div class="detail-simulation-action">
                        <span><i class="fas fa-microscope"></i> Simulación</span>
                        <button type="button" class="detail-simulate-btn" id="detailSimulateBtn">
                            <i class="fas fa-play-circle"></i> Iniciar simulación
                        </button>
                    </div>
                </section>

                <section class="detail-species-note" aria-label="Notas sobre la especie">
                    <div class="detail-note-heading">
                        <span class="detail-note-icon"><i class="fas fa-note-sticky"></i></span>
                        <strong>Notas</strong>
                        <button type="button" class="detail-note-edit" id="detailNotesBtn" aria-label="Agregar nota">
                            <i class="fas fa-pen"></i>
                        </button>
                    </div>
                    <p>Aquí puedes añadir observaciones, datos relevantes o recordatorios sobre esta especie.</p>
                    <div class="detail-note-lines" aria-hidden="true"><span></span><span></span></div>
                </section>
            `;

            document.getElementById('detailFavBtn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(species.id);
                const now = state.favorites.has(species.id);
                const btn = document.getElementById('detailFavBtn');
                btn.innerHTML = `<i class="${now ? 'fas' : 'far'} fa-heart"></i><span>Favorito</span>`;
                btn.classList.toggle('active', now);
            });
            document.getElementById('detailSimulateBtn')?.addEventListener('click', () => {
                window.location.href = './simuladores.php';
            });
            document.getElementById('detailNotesBtn')?.addEventListener('click', () => {
                addNote(species.name, `Notas de ${species.name}`);
                showView('notes');
            });
        }

        const c3d = document.getElementById('detail3dContainer');
        if (c3d) {
            if (c3d._cleanup3d) { c3d._cleanup3d(); delete c3d._cleanup3d; }
            c3d.innerHTML = '';
            delete c3d.dataset.initialized;
        }

        generateUnderwaterBubbles();

        setTimeout(() => {
            const normalizedScientificName = species.scientificName?.trim().toLowerCase() || '';
            const preserveOriginalLighting = normalizedScientificName === 'chelonia mydas';
            const rotationYOverride = INITIAL_ROTATION_Y_BY_SPECIES.get(normalizedScientificName) ?? null;
            init3DModel('detail3dContainer', species.modelPath, species.modelView, true, preserveOriginalLighting, rotationYOverride);
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
            persistCategory(state.currentCategory);
            renderCards();
        });
    });
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            state.currentSearch = e.target.value;
            renderCards();
        });
    }

    // ========== INICIO: cargar API y luego renderizar ==========
    const ok = await loadSpeciesData();
    if (ok) renderCards();
});
