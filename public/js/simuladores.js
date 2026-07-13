const SIMULATOR_DATA = {
    1: {
        title: 'Arrecife de Los Cóbanos',
        tag: 'Equilibrio natural',
        icon: 'fa-water',
        description: 'Observa especies marinas en un ecosistema saludable y estable, con parámetros ambientales dentro de su rango óptimo.',
        facts: [
            'Especies principales: Pez Lora Gigante, Pez Ángel Real y Tortuga Carey.',
            'Variables: temperatura, salinidad, oxígeno disuelto y salud del ecosistema.',
            'Objetivo: reconocer cómo se comporta un arrecife en equilibrio.'
        ]
    },
    2: {
        title: 'Cadena alimenticia',
        tag: 'Dinámica de poblaciones',
        icon: 'fa-link',
        description: 'Modifica poblaciones y condiciones ambientales para observar cómo cambia el equilibrio de la red alimenticia.',
        facts: [
            'Especies principales: Mero Guasa, Pargo Amarillo, Cangrejo Moro y Bailarina de Mar.',
            'Variables: poblaciones, temperatura, salinidad, oxígeno, salud ambiental y contaminación.',
            'Objetivo: analizar productividad, capacidad de carga, reproducción, supervivencia y equilibrio trófico.'
        ]
    },
    3: {
        title: 'Contaminación marina',
        tag: 'Presión ambiental',
        icon: 'fa-flask',
        description: 'Aumenta el nivel de contaminación para comprobar su efecto sobre el oxígeno, la salud, el estrés y el bienestar biológico.',
        facts: [
            'Especies principales: Pez Globo, Tortuga Golfina y Jaiba Azul del Pacífico.',
            'Variable principal: nivel de contaminación del entorno.',
            'Objetivo: comparar un ambiente sano con uno sometido a presión ambiental.'
        ]
    }
};

let selectedSimulationId = null;
let lastFocusedElement = null;
let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('simInfoModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelModal');
    const startBtn = document.getElementById('startSelectedSimulation');
    const searchInput = document.getElementById('simulatorSearch');
    const library = document.getElementById('simulatorLibrary');

    document.querySelectorAll('.classroom-card').forEach((card) => {
        card.addEventListener('click', () => openSimulationModal(card.dataset.simulation));
    });

    document.querySelectorAll('[data-quick-start]').forEach((button) => {
        button.addEventListener('click', () => {
            library?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    document.querySelectorAll('.filter-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            activeFilter = chip.dataset.filter || 'all';
            document.querySelectorAll('.filter-chip').forEach((item) => {
                const isActive = item === chip;
                item.classList.toggle('active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });
            filterCards();
        });
    });

    searchInput?.addEventListener('input', filterCards);

    document.addEventListener('keydown', (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            searchInput?.focus();
        }

        if (event.key === 'Escape') {
            if (modal && !modal.hidden) closeModal();
            else if (document.activeElement === searchInput) {
                searchInput.value = '';
                filterCards();
                searchInput.blur();
            }
        }
    });

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    startBtn?.addEventListener('click', () => {
        if (selectedSimulationId) {
            window.location.href = `simulador.php?id=${selectedSimulationId}&start=1`;
        }
    });

    document.querySelectorAll('.ripple-button').forEach((button) => {
        button.addEventListener('pointerdown', createRipple);
    });

    initializeRevealAnimations();
});

function normalizeText(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function filterCards() {
    const searchInput = document.getElementById('simulatorSearch');
    const emptyResults = document.getElementById('emptyResults');
    const query = normalizeText(searchInput?.value || '');
    let visibleCards = 0;

    document.querySelectorAll('.classroom-card').forEach((card) => {
        const searchableText = normalizeText(card.dataset.search || card.textContent || '');
        const matchesSearch = !query || searchableText.includes(query);
        const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
        const shouldShow = matchesSearch && matchesFilter;

        card.hidden = !shouldShow;
        if (shouldShow) visibleCards += 1;
    });

    if (emptyResults) emptyResults.hidden = visibleCards > 0;
}

function openSimulationModal(simulationId) {
    const data = SIMULATOR_DATA[simulationId];
    const modal = document.getElementById('simInfoModal');
    if (!data || !modal) return;

    selectedSimulationId = simulationId;
    lastFocusedElement = document.activeElement;

    const icon = document.querySelector('#modalIcon i');
    const tag = document.getElementById('modalTag');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    const facts = document.getElementById('modalFacts');

    if (icon) icon.className = `fa-solid ${data.icon}`;
    if (tag) tag.textContent = data.tag;
    if (title) title.textContent = data.title;
    if (description) description.textContent = data.description;
    if (facts) {
        facts.replaceChildren(...data.facts.map((fact) => {
            const row = document.createElement('div');
            row.className = 'fact-row';

            const infoIcon = document.createElement('i');
            infoIcon.className = 'fa-regular fa-circle-check';
            infoIcon.setAttribute('aria-hidden', 'true');

            const text = document.createElement('span');
            text.textContent = fact;
            row.append(infoIcon, text);
            return row;
        }));
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('closeModal')?.focus();
}

function closeModal() {
    const modal = document.getElementById('simInfoModal');
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function createRipple(event) {
    const button = event.currentTarget;
    if (!(button instanceof HTMLElement)) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

function initializeRevealAnimations() {
    const elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

    elements.forEach((element) => observer.observe(element));
}
