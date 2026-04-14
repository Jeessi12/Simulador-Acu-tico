// ========== NO PONGAS IMPORTS AQUÍ - Van en el HTML con importmap ==========

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== DATOS DE ESPECIES CON AJUSTES DE CÁMARA ==========
    const speciesData = [
        { 
            id: 1, 
            name: "Tortuga verde", 
            category: "tortugas", 
            habitat: "Arrecifes costeros", 
            desc: "Especie herbívora que mantiene saludables los pastos marinos. Emblemática del Pacífico tropical.", 
            color: "#2d6a4f", 
            dieta: "Herbívora (pastos marinos, algas)", 
            longevidad: "80-100 años", 
            peligro: "En peligro de extinción",
            modelPath: "../MEDIA/3D_Models/ridley_turtle_lepidochelys_olivacea.glb",
            scale: 1.2,
            posY: -0.2,
            rotY: 0,
            camDistance: 3.2,
            camHeight: 0.8
        },
        { 
            id: 2, 
            name: "Pez payaso", 
            category: "peces", 
            habitat: "Arrecife de coral", 
            desc: "Famoso por su simbiosis con anémonas. Vive en aguas cálidas y poco profundas.", 
            color: "#f4a261", 
            dieta: "Omnívoro (plancton, algas)", 
            longevidad: "6-10 años", 
            peligro: "Preocupación menor",
            modelPath: "../MEDIA/3D_Models/clown_fish_low_poly_animated.glb",
            scale: 13,
            posY: -0.1,
            rotY: 0,
            camDistance: 2.2,
            camHeight: 0.5
        },
        { 
            id: 3, 
            name: "Pulpo", 
            category: "moluscos", 
            habitat: "Mar profundo / Arrecifes", 
            desc: "Inteligente y camaleónico, maestro del camuflaje y cazador nocturno.", 
            color: "#9c89b8", 
            dieta: "Carnívoro (crustáceos, peces)", 
            longevidad: "3-5 años", 
            peligro: "Datos insuficientes",
            modelPath: "../MEDIA/3D_Models/octopus.glb",
            scale: 0.1,
            posY: -1.4,
            rotY: 0,
            camDistance: 5,
            camHeight: 0.6
        },
        { 
            id: 4, 
            name: "Tiburón martillo", 
            category: "peces", 
            habitat: "Aguas tropicales", 
            desc: "Depredador tope con visión panorámica única. Esencial para el equilibrio marino.", 
            color: "#4a6a7a", 
            dieta: "Carnívoro (rayas, peces, calamares)", 
            longevidad: "20-30 años", 
            peligro: "En peligro crítico",
            modelPath: "../MEDIA/3D_Models/hammerhead.glb",
            scale: 0.8,
            posY: -0.2,
            rotY: 0,
            camDistance: 3.0,
            camHeight: 0.7
        },
        { 
            id: 5, 
            name: "Cirujano azul", 
            category: "peces", 
            habitat: "Arrecifes de coral", 
            desc: "Color azul vibrante, popular en acuarios. Se alimenta de algas.", 
            color: "#2a9d8f", 
            dieta: "Herbívoro (algas)", 
            longevidad: "8-12 años", 
            peligro: "Preocupación menor",
            modelPath: "../MEDIA/3D_Models/bluetang.glb",
            scale: 1.0,
            posY: -0.1,
            rotY: 0,
            camDistance: 2.5,
            camHeight: 0.5
        },
        { 
            id: 6, 
            name: "Caballito de mar", 
            category: "peces", 
            habitat: "Praderas marinas", 
            desc: "El macho gesta los huevos. Frágil y fascinante, símbolo de conservación.", 
            color: "#e9c46a", 
            dieta: "Carnívoro (pequeños crustáceos)", 
            longevidad: "1-4 años", 
            peligro: "Vulnerable",
            modelPath: "../MEDIA/3D_Models/seahorse.glb",
            scale: 1.0,
            posY: -0.15,
            rotY: 0,
            camDistance: 2.8,
            camHeight: 0.7
        },
        { 
            id: 7, 
            name: "Delfín nariz de botella", 
            category: "peces", 
            habitat: "Océano abierto", 
            desc: "Mamífero marino inteligente y sociable. Ayuda a mantener el equilibrio ecológico.", 
            color: "#5a8a9e", 
            dieta: "Carnívoro (peces, calamares)", 
            longevidad: "40-50 años", 
            peligro: "Preocupación menor",
            modelPath: "../MEDIA/3D_Models/dolphin.glb",
            scale: 0.7,
            posY: -0.15,
            rotY: 0,
            camDistance: 3.2,
            camHeight: 0.7
        },
        { 
            id: 8, 
            name: "Cangrejo ermitaño", 
            category: "crustaceos", 
            habitat: "Zonas intermareales", 
            desc: "Utiliza conchas vacías como refugio. Recicla materiales del ecosistema.", 
            color: "#d45c4c", 
            dieta: "Omnívoro (detritus, algas)", 
            longevidad: "3-12 años", 
            peligro: "Preocupación menor",
            modelPath: "../MEDIA/3D_Models/crab.glb",
            scale: 0.8,
            posY: -0.1,
            rotY: 0,
            camDistance: 2.5,
            camHeight: 0.5
        },
        { 
            id: 9, 
            name: "Estrella de mar", 
            category: "moluscos", 
            habitat: "Fondos rocosos", 
            desc: "Capaz de regenerar sus brazos. Importante depredadora de mejillones.", 
            color: "#f4a261", 
            dieta: "Carnívoro (mejillones, almejas)", 
            longevidad: "5-35 años", 
            peligro: "Preocupación menor",
            modelPath: "../MEDIA/3D_Models/starfish.glb",
            scale: 0.9,
            posY: -0.1,
            rotY: 0,
            camDistance: 2.8,
            camHeight: 0.5
        },
        { 
            id: 10, 
            name: "Langosta espinosa", 
            category: "crustaceos", 
            habitat: "Arrecifes rocosos", 
            desc: "Sin pinzas grandes, usa sus antenas para defenderse. Importante en la pesca artesanal.", 
            color: "#e76f51", 
            dieta: "Omnívoro (moluscos, algas)", 
            longevidad: "15-20 años", 
            peligro: "Preocupación menor",
            modelPath: "../MEDIA/3D_Models/lobster.glb",
            scale: 0.7,
            posY: -0.15,
            rotY: 0,
            camDistance: 3.0,
            camHeight: 0.6
        },
        { 
            id: 11, 
            name: "Mantarraya", 
            category: "peces", 
            habitat: "Aguas cálidas", 
            desc: "Nadadora elegante y pacífica. Filtra plancton y pequeños peces.", 
            color: "#2a6b8f", 
            dieta: "Carnívoro (plancton, peces pequeños)", 
            longevidad: "15-20 años", 
            peligro: "Vulnerable",
            modelPath: "../MEDIA/3D_Models/ray.glb",
            scale: 0.7,
            posY: -0.2,
            rotY: 0,
            camDistance: 3.2,
            camHeight: 0.6
        },
        { 
            id: 12, 
            name: "Caracol cono", 
            category: "moluscos", 
            habitat: "Arenas y arrecifes", 
            desc: "Veneno potencialmente mortal, pero su toxina se estudia para fármacos.", 
            color: "#bc6c25", 
            dieta: "Carnívoro (gusanos, peces)", 
            longevidad: "10-15 años", 
            peligro: "Preocupación menor",
            modelPath: "../MEDIA/3D_Models/shell.glb",
            scale: 0.8,
            posY: -0.1,
            rotY: 0,
            camDistance: 2.5,
            camHeight: 0.5
        }
    ];

    // Elementos DOM
    const speciesGrid = document.getElementById('speciesGrid');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResultsDiv = document.getElementById('noResults');
    
    let currentCategory = 'todos';
    let currentSearch = '';

    function getCategoryText(category) {
        switch(category) {
            case 'peces': return '🐟 Peces';
            case 'tortugas': return '🐢 Tortugas';
            case 'crustaceos': return '🦞 Crustáceos';
            case 'moluscos': return '🐚 Moluscos';
            default: return '🌊 Especie Marina';
        }
    }

    function getCuriosity(name) {
        const curiosities = {
            "Tortuga verde": "Pueden contener la respiración bajo el agua hasta 5 horas cuando están descansando.",
            "Pez payaso": "Todos los peces payaso nacen machos, y el dominante se convierte en hembra.",
            "Pulpo": "Tienen tres corazones y su sangre es azul debido al cobre en lugar de hierro.",
            "Tiburón martillo": "Sus ojos están ubicados en los extremos de la cabeza, dándoles visión de 360 grados.",
            "Cirujano azul": "Tienen una espada afilada a ambos lados de la cola para defenderse.",
            "Caballito de mar": "Son monógamos y realizan danzas nupciales cada mañana.",
            "Delfín nariz de botella": "Cada delfín tiene un silbido único que funciona como nombre.",
            "Cangrejo ermitaño": "Cambian de concha a medida que crecen, formando 'cadenas de adopción'.",
            "Estrella de mar": "Pueden regenerar un brazo perdido, e incluso un cuerpo entero a partir de un brazo.",
            "Langosta espinosa": "Pueden migrar en fila india por el fondo marino durante cientos de kilómetros.",
            "Mantarraya": "Son filtradoras, pueden procesar hasta 13,000 litros de agua por hora.",
            "Caracol cono": "Su veneno contiene más de 100 toxinas diferentes, algunas usadas como analgésico."
        };
        return curiosities[name] || "Esta especie juega un papel crucial en el equilibrio del ecosistema marino.";
    }

    // ========== FUNCIÓN PARA CARGAR MODELOS 3D CON GLTF Y AJUSTES DE CÁMARA ==========
    async function init3DModel(containerId, modelPath, scaleValue = 0.7, posYValue = 0, rotYValue = 0, camDistance = 3.5, camHeight = 1) {
        try {
            console.log(`📦 Intentando cargar modelo: ${modelPath}`);
            
            // Verificar si el archivo existe
            try {
                const checkResponse = await fetch(modelPath, { method: 'HEAD' });
                if (!checkResponse.ok) {
                    console.error(`❌ Modelo NO encontrado: ${modelPath} (HTTP ${checkResponse.status})`);
                    const container = document.getElementById(containerId);
                    if (container) {
                        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ff6b6b;font-size:11px;text-align:center;">⚠️ Modelo no encontrado<br>${modelPath.split('/').pop()}</div>`;
                    }
                    return null;
                } else {
                    console.log(`✅ Modelo encontrado: ${modelPath}`);
                }
            } catch (fetchError) {
                console.error(`❌ Error verificando modelo: ${modelPath}`, fetchError);
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ff6b6b;font-size:11px;">⚠️ Error de red</div>`;
                }
                return null;
            }
            
            const THREE = await import('three');
            const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
            const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
            
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`❌ Contenedor no encontrado: ${containerId}`);
                return null;
            }
            
            if (container.dataset.initialized === 'true') {
                return null;
            }
            container.dataset.initialized = 'true';
            
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            if (width === 0 || height === 0) {
                console.error(`❌ Dimensiones inválidas para ${containerId}: ${width}x${height}`);
                return null;
            }
            
            // Escena
            const scene = new THREE.Scene();
            scene.background = null;
            
            // Cámara con distancia y altura personalizadas
            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            camera.position.set(0, camHeight, camDistance);
            camera.lookAt(0, 0, 0);
            
            // Renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setClearColor(0x000000, 0);
            renderer.shadowMap.enabled = true;
            container.innerHTML = '';
            container.appendChild(renderer.domElement);
            
            // Luces
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const mainLight = new THREE.DirectionalLight(0xffffff, 1);
            mainLight.position.set(3, 5, 2);
            mainLight.castShadow = true;
            scene.add(mainLight);
            
            const fillLight = new THREE.PointLight(0x88aaff, 0.5);
            fillLight.position.set(-2, 2, 3);
            scene.add(fillLight);
            
            const backLight = new THREE.PointLight(0xffaa66, 0.3);
            backLight.position.set(0, 1, -3);
            scene.add(backLight);
            
            const rimLight = new THREE.PointLight(0xff8866, 0.4);
            rimLight.position.set(1, 1.5, -2);
            scene.add(rimLight);
            
            // Controles
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1.5;
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.target.set(0, 0, 0);
            
            // Cargar modelo GLB
            const loader = new GLTFLoader();
            
            return new Promise((resolve, reject) => {
                loader.load(modelPath, 
                    (gltf) => {
                        console.log(`✅ Modelo cargado exitosamente: ${modelPath}`);
                        const model = gltf.scene;
                        
                        model.scale.set(scaleValue, scaleValue, scaleValue);
                        model.position.set(0, posYValue, 0);
                        model.rotation.y = rotYValue;
                        
                        model.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                        
                        scene.add(model);
                        
                        function animate() {
                            requestAnimationFrame(animate);
                            controls.update();
                            renderer.render(scene, camera);
                        }
                        animate();
                        
                        const resizeObserver = new ResizeObserver(() => {
                            const newWidth = container.clientWidth;
                            const newHeight = container.clientHeight;
                            if (newWidth > 0 && newHeight > 0) {
                                camera.aspect = newWidth / newHeight;
                                camera.updateProjectionMatrix();
                                renderer.setSize(newWidth, newHeight);
                            }
                        });
                        resizeObserver.observe(container);
                        
                        resolve({ scene, camera, renderer, controls, model });
                    },
                    (progress) => {
                        console.log(`📦 Cargando ${modelPath}: ${Math.round((progress.loaded / progress.total) * 100)}%`);
                    },
                    (error) => {
                        console.error('❌ Error detallado del modelo:', error);
                        let errorMsg = 'Error al cargar';
                        if (error.status === 404) errorMsg = 'Archivo no encontrado';
                        else if (error.status === 403) errorMsg = 'Acceso denegado';
                        else if (error.status === 500) errorMsg = 'Error del servidor';
                        
                        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ff6b6b;font-size:11px;text-align:center;">⚠️ ${errorMsg}<br>${modelPath.split('/').pop()}</div>`;
                        reject(error);
                    }
                );
            });
        } catch (error) {
            console.error('❌ Error inicializando 3D:', error);
            return null;
        }
    }

    // Función para mostrar modal con modelo 3D
    function showModal(species) {
        const existingModal = document.getElementById('speciesModal');
        if (existingModal) existingModal.remove();

        let dangerClass = '', dangerIcon = '';
        switch(species.peligro) {
            case 'En peligro crítico': dangerClass = 'critico'; dangerIcon = '🔴'; break;
            case 'En peligro de extinción': dangerClass = 'peligro'; dangerIcon = '🟠'; break;
            case 'Vulnerable': dangerClass = 'vulnerable'; dangerIcon = '🟡'; break;
            default: dangerClass = 'seguro'; dangerIcon = '🟢';
        }

        const modalHTML = `
            <div id="speciesModal" class="modal-overlay">
                <div class="modal-container">
                    <button class="modal-close" id="closeModalBtn"><i class="fas fa-times"></i></button>
                    <div class="modal-header">
                        <div id="modal3dContainer" class="modal-3d-container"></div>
                        <h2>${species.name}</h2>
                        <span class="modal-category">${getCategoryText(species.category)}</span>
                    </div>
                    <div class="modal-body">
                        <div class="info-section">
                            <div class="info-item"><i class="fas fa-map-marker-alt"></i><strong>Hábitat:</strong><span>${species.habitat}</span></div>
                            <div class="info-item"><i class="fas fa-utensils"></i><strong>Dieta:</strong><span>${species.dieta}</span></div>
                            <div class="info-item"><i class="fas fa-clock"></i><strong>Longevidad:</strong><span>${species.longevidad}</span></div>
                            <div class="info-item"><i class="fas fa-shield-alt"></i><strong>Estado conservación:</strong><span class="danger-badge ${dangerClass}">${dangerIcon} ${species.peligro}</span></div>
                        </div>
                        <div class="description-section">
                            <h3><i class="fas fa-info-circle"></i> Descripción</h3>
                            <p>${species.desc}</p>
                        </div>
                        <div class="curiosity-section">
                            <h3><i class="fas fa-lightbulb"></i> Dato curioso</h3>
                            <p>${getCuriosity(species.name)}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn" id="closeModalFooterBtn"><i class="fas fa-check"></i> Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        setTimeout(() => {
            init3DModel('modal3dContainer', species.modelPath, species.scale, species.posY, species.rotY, species.camDistance, species.camHeight);
        }, 100);

        const modalOverlay = document.getElementById('speciesModal');
        const closeBtn = document.getElementById('closeModalBtn');
        const closeFooterBtn = document.getElementById('closeModalFooterBtn');

        function closeModal() {
            modalOverlay.remove();
        }

        closeBtn.addEventListener('click', closeModal);
        closeFooterBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    }

    // Renderizar tarjetas
    async function renderCards() {
        let filtered = speciesData.filter(species => {
            if (currentCategory === 'todos') return true;
            return species.category === currentCategory;
        });

        if (currentSearch.trim() !== '') {
            const searchLower = currentSearch.toLowerCase();
            filtered = filtered.filter(species =>
                species.name.toLowerCase().includes(searchLower) ||
                species.habitat.toLowerCase().includes(searchLower) ||
                species.desc.toLowerCase().includes(searchLower)
            );
        }

        if (filtered.length === 0) {
            speciesGrid.style.display = 'none';
            noResultsDiv.style.display = 'block';
            return;
        }

        speciesGrid.style.display = 'grid';
        noResultsDiv.style.display = 'none';

        speciesGrid.innerHTML = filtered.map((species, index) => {
            return `
                <article class="species-card" data-id="${species.id}" style="animation-delay: ${index * 0.05}s">
                    <div class="card-3d" id="canvas-${species.id}">
                        <span class="category-badge-3d">${getCategoryText(species.category)}</span>
                    </div>
                    <div class="card-info">
                        <h3>${species.name}</h3>
                        <span class="habitat"><i class="fas fa-map-marker-alt"></i> ${species.habitat}</span>
                        <p class="description">${species.desc.substring(0, 85)}${species.desc.length > 85 ? '...' : ''}</p>
                        <button class="btn-especie" data-id="${species.id}">
                            <i class="fas fa-eye"></i> Ver Especie
                        </button>
                    </div>
                </article>
            `;
        }).join('');

        for (const species of filtered) {
            const containerId = `canvas-${species.id}`;
            const container = document.getElementById(containerId);
            if (container) {
                init3DModel(containerId, species.modelPath, species.scale, species.posY, species.rotY, species.camDistance, species.camHeight);
            }
        }

        document.querySelectorAll('.btn-especie').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                const species = speciesData.find(s => s.id === id);
                if (species) showModal(species);
            });
        });
    }

    // Eventos de filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderCards();
        });
    });

    // Evento de búsqueda
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderCards();
    });

    renderCards();

    // ========== BURBUJAS DE FONDO ==========
    const canvas = document.getElementById('bubblesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        function resizeCanvasBubbles() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvasBubbles();
        window.addEventListener('resize', resizeCanvasBubbles);
        
        let particles = [];
        
        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 10 + 5,
                speed: Math.random() * 0.5 + 0.2,
                dx: (Math.random() - 0.5) * 0.15,
                opacity: Math.random() * 0.3 + 0.15
            };
        }
        
        for (let i = 0; i < 70; i++) {
            particles.push(createParticle());
        }
        
        function drawBubble(p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(70, 170, 230, ${p.opacity * 0.5})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(50, 140, 210, ${p.opacity * 0.7})`;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(p.x - p.r * 0.25, p.y - p.r * 0.25, p.r * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.8})`;
            ctx.fill();
        }
        
        function animateBubbles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                p.y -= p.speed;
                p.x += p.dx;
                
                if (p.y + p.r < 0) {
                    particles[i] = createParticle();
                    particles[i].y = canvas.height + p.r;
                    particles[i].x = Math.random() * canvas.width;
                }
                if (p.x + p.r < 0) p.x = canvas.width + p.r;
                if (p.x - p.r > canvas.width) p.x = -p.r;
                
                drawBubble(p);
            });
            
            requestAnimationFrame(animateBubbles);
        }
        
        animateBubbles();
    } else {
        console.error('Canvas de burbujas no encontrado');
    }
});