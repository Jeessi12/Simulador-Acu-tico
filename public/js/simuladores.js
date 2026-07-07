const SIMULATOR_DATA = {
    1: {
        title: 'Arrecife de Los Cóbanos',
        tag: 'Equilibrio',
        icon: 'fa-water',
        description: 'Observa especies marinas en un ecosistema saludable y estable, con parámetros ambientales en rango óptimo.',
        facts: [
            'Especies principales: Pez Lora Gigante, Pez Ángel Real y Tortuga Carey.',
            'Controles disponibles: temperatura, salinidad, oxígeno disuelto y salud del ecosistema.',
            'Objetivo: reconocer cómo se comporta un arrecife en equilibrio.'
        ]
    },
    2: {
        title: 'Cadena alimenticia',
        tag: 'Poblaciones',
        icon: 'fa-link',
        description: 'Modifica poblaciones de distintas especies para observar cambios y desequilibrios dentro del ecosistema.',
        facts: [
            'Especies principales: Mero Guasa, Pargo Amarillo, Cangrejo Moro y Bailarina de Mar.',
            'Controles disponibles: botones para agregar o eliminar individuos por especie.',
            'Objetivo: analizar cómo una población afecta a las demás.'
        ]
    },
    3: {
        title: 'Contaminación marina',
        tag: 'Impacto',
        icon: 'fa-flask',
        description: 'Aumenta el nivel de contaminación para comprobar su efecto sobre oxígeno, salud, estrés y bienestar biológico.',
        facts: [
            'Especies principales: Pez Globo, Tortuga Golfina y Jaiba Azul del Pacífico.',
            'Controles disponibles: nivel de contaminación.',
            'Objetivo: comparar un ambiente sano con uno bajo presión ambiental.'
        ]
    }
};

let selectedSimulationId = null;

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('simInfoModal');
    const closeBtn = document.getElementById('closeModal');
    const startBtn = document.getElementById('startSelectedSimulation');

    document.querySelectorAll('.classroom-card').forEach((card) => {
        card.addEventListener('click', () => openSimulationModal(card.dataset.simulation));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (!selectedSimulationId) return;
            window.location.href = `simulador.php?id=${selectedSimulationId}&start=1`;
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });
});

function openSimulationModal(simulationId) {
    const data = SIMULATOR_DATA[simulationId];
    const modal = document.getElementById('simInfoModal');
    const icon = document.querySelector('#modalIcon i');
    const tag = document.getElementById('modalTag');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    const facts = document.getElementById('modalFacts');

    if (!data || !modal) return;
    selectedSimulationId = simulationId;

    if (icon) icon.className = `fa-solid ${data.icon}`;
    if (tag) tag.textContent = data.tag;
    if (title) title.textContent = data.title;
    if (description) description.textContent = data.description;
    if (facts) {
        facts.innerHTML = data.facts.map((fact) => `
            <div class="fact-row">
                <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
                <span>${fact}</span>
            </div>
        `).join('');
    }

    modal.hidden = false;
}

function closeModal() {
    const modal = document.getElementById('simInfoModal');
    if (modal) modal.hidden = true;
}
