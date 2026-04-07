document.addEventListener('DOMContentLoaded', function() {
    
    const speciesData = [
        { id: 1, name: "Tortuga verde", category: "tortugas", habitat: "Arrecifes costeros", desc: "Especie herbívora que mantiene saludables los pastos marinos. Emblemática del Pacífico tropical.", icon: "🐢", color: "#2d6a4f", dieta: "Herbívora (pastos marinos, algas)", longevidad: "80-100 años", peligro: "En peligro de extinción" },
        { id: 2, name: "Pez payaso", category: "peces", habitat: "Arrecife de coral", desc: "Famoso por su simbiosis con anémonas. Vive en aguas cálidas y poco profundas.", icon: "🐠", color: "#f4a261", dieta: "Omnívoro (plancton, algas)", longevidad: "6-10 años", peligro: "Preocupación menor" },
        { id: 3, name: "Pulpo", category: "moluscos", habitat: "Mar profundo / Arrecifes", desc: "Inteligente y camaleónico, maestro del camuflaje y cazador nocturno.", icon: "🐙", color: "#9c89b8", dieta: "Carnívoro (crustáceos, peces)", longevidad: "3-5 años", peligro: "Datos insuficientes" },
        { id: 4, name: "Tiburón martillo", category: "peces", habitat: "Aguas tropicales", desc: "Depredador tope con visión panorámica única. Esencial para el equilibrio marino.", icon: "🦈", color: "#264653", dieta: "Carnívoro (rayas, peces, calamares)", longevidad: "20-30 años", peligro: "En peligro crítico" },
        { id: 5, name: "Cirujano azul", category: "peces", habitat: "Arrecifes de coral", desc: "Color azul vibrante, popular en acuarios. Se alimenta de algas.", icon: "🐟", color: "#2a9d8f", dieta: "Herbívoro (algas)", longevidad: "8-12 años", peligro: "Preocupación menor" },
        { id: 6, name: "Caballito de mar", category: "peces", habitat: "Praderas marinas", desc: "El macho gesta los huevos. Frágil y fascinante, símbolo de conservación.", icon: "🐴", color: "#e9c46a", dieta: "Carnívoro (pequeños crustáceos)", longevidad: "1-4 años", peligro: "Vulnerable" },
        { id: 7, name: "Langosta espinosa", category: "crustaceos", habitat: "Arrecifes rocosos", desc: "Sin pinzas grandes, usa sus antenas para defenderse. Importante en la pesca artesanal.", icon: "🦞", color: "#e76f51", dieta: "Omnívoro (moluscos, algas)", longevidad: "15-20 años", peligro: "Preocupación menor" },
        { id: 8, name: "Caracol cono", category: "moluscos", habitat: "Arenas y arrecifes", desc: "Veneno potencialmente mortal, pero su toxina se estudia para fármacos.", icon: "🐚", color: "#bc6c25", dieta: "Carnívoro (gusanos, peces)", longevidad: "10-15 años", peligro: "Preocupación menor" },
        { id: 9, name: "Delfín nariz de botella", category: "peces", habitat: "Océano abierto", desc: "Mamífero marino inteligente y sociable. Ayuda a mantener el equilibrio ecológico.", icon: "🐬", color: "#0077b6", dieta: "Carnívoro (peces, calamares)", longevidad: "40-50 años", peligro: "Preocupación menor" },
        { id: 10, name: "Cangrejo ermitaño", category: "crustaceos", habitat: "Zonas intermareales", desc: "Utiliza conchas vacías como refugio. Recicla materiales del ecosistema.", icon: "🦀", color: "#d00000", dieta: "Omnívoro (detritus, algas)", longevidad: "3-12 años", peligro: "Preocupación menor" },
        { id: 11, name: "Estrella de mar", category: "moluscos", habitat: "Fondos rocosos", desc: "Capaz de regenerar sus brazos. Importante depredadora de mejillones.", icon: "⭐", color: "#f4a261", dieta: "Carnívoro (mejillones, almejas)", longevidad: "5-35 años", peligro: "Preocupación menor" },
        { id: 12, name: "Mantarraya", category: "peces", habitat: "Aguas cálidas", desc: "Nadadora elegante y pacífica. Filtra plancton y pequeños peces.", icon: "🔷", color: "#2a9d8f", dieta: "Carnívoro (plancton, peces pequeños)", longevidad: "15-20 años", peligro: "Vulnerable" }
    ];

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
            "Langosta espinosa": "Pueden migrar en fila india por el fondo marino durante cientos de kilómetros.",
            "Caracol cono": "Su veneno contiene más de 100 toxinas diferentes, algunas usadas como analgésico.",
            "Delfín nariz de botella": "Cada delfín tiene un silbido único que funciona como nombre.",
            "Cangrejo ermitaño": "Cambian de concha a medida que crecen, formando 'cadenas de adopción'.",
            "Estrella de mar": "Pueden regenerar un brazo perdido, e incluso un cuerpo entero a partir de un brazo.",
            "Mantarraya": "Son filtradoras, pueden procesar hasta 13,000 litros de agua por hora."
        };
        return curiosities[name] || "Esta especie juega un papel crucial en el equilibrio del ecosistema marino.";
    }

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
                    <div class="modal-header" style="background: linear-gradient(135deg, ${species.color}60, ${species.color}30);">
                        <span class="modal-icon">${species.icon}</span>
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

    function renderCards() {
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
            let categoryText = getCategoryText(species.category);
            const gradientStyle = `linear-gradient(135deg, ${species.color}30, ${species.color}70)`;
            return `
                <article class="species-card" style="animation-delay: ${index * 0.05}s">
                    <div class="card-img" style="background: ${gradientStyle};">
                        <span style="font-size: 5rem; filter: drop-shadow(2px 4px 8px rgba(0,0,0,0.2));">${species.icon}</span>
                        <span class="category-badge">${categoryText}</span>
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

        document.querySelectorAll('.btn-especie').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                const species = speciesData.find(s => s.id === id);
                if (species) showModal(species);
            });
        });
    }


    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderCards();
        });
    });

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderCards();
    });

    renderCards();


    const canvas = document.getElementById('bubblesCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let particles = [];
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 8 + 4,
            speed: Math.random() * 0.5 + 0.2,
            dx: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.4 + 0.2
        };
    }
    
    for (let i = 0; i < 70; i++) particles.push(createParticle());
    
    function drawBubble(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.7})`;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x - p.r * 0.25, p.y - p.r * 0.25, p.r * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity + 0.2})`;
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
});