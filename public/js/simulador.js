// Integracion web <-> Godot para BlueEcoSim.

const SIMULATIONS = {
    sim_01_ecosistema_basico: {
        tabClass: 'arrecife',
        title: 'Ecosistema Basico',
        heading: 'Arrecife de Los Cobanos',
        summary: 'Ambiente optimo para observar ciclo de vida y equilibrio.',
        description: 'Pez Lora, Pez Angel y Tortuga Carey interactuan en un arrecife saludable.',
        details: [
            'Simulacion recomendada para observar parametros estables.',
            'Incluye Pez Lora Gigante, Pez Angel Real y Tortuga Carey.',
            'Puedes ajustar temperatura, salinidad y oxigeno.'
        ],
        species: ['pez_lora_gigante', 'pez_angel_real', 'tortuga_carey'],
        values: {
            godot_temperature: 25,
            godot_salinity: 34,
            godot_oxygen: 6.5,
            godot_ecosystem_health: 95,
            godot_pollution: 0
        }
    },
    sim_02_cadena_alimenticia: {
        tabClass: 'cadena',
        title: 'La Cadena Alimenticia',
        heading: 'Cadena alimenticia marina',
        summary: 'Altera poblaciones para observar un desequilibrio en cascada.',
        description: 'Reduce el Mero Guasa a cero para simular sobrepesca y ver el colapso trofico.',
        details: [
            'Simulacion enfocada en relaciones entre poblaciones.',
            'Permite cambiar cantidades de depredadores, presas y organismos base.',
            'Ideal para analizar efectos en cadena dentro del ecosistema.'
        ],
        species: ['mero_guasa', 'pargo_amarillo', 'cangrejo_moro_roca', 'bailarina_mar'],
        populations: {
            mero_guasa: 2,
            pargo_amarillo: 4,
            cangrejo_moro_roca: 7,
            bailarina_mar: 8
        },
        values: {
            godot_temperature: 25,
            godot_salinity: 34,
            godot_oxygen: 6.5,
            godot_ecosystem_health: 100,
            godot_pollution: 0
        }
    },
    sim_03_contaminacion_marina: {
        tabClass: 'contaminacion',
        title: 'Contaminacion Marina',
        heading: 'Contaminacion marina',
        summary: 'Aumenta contaminacion para provocar hipoxia y estres biologico.',
        description: 'El oxigeno baja, la salinidad cambia y las especies jovenes entran en riesgo.',
        details: [
            'Simulacion centrada en el impacto de contaminantes.',
            'El control de contaminacion afecta oxigeno, salud y bienestar.',
            'Util para comparar un ambiente sano contra uno bajo presion.'
        ],
        species: ['pez_globo_puntos_blancos', 'tortuga_golfina', 'jaiba_azul_pacifico'],
        values: {
            godot_temperature: 27,
            godot_salinity: 34,
            godot_oxygen: 6.5,
            godot_ecosystem_health: 90,
            godot_pollution: 0
        }
    }
};

const SPECIES = {
    pez_lora_gigante: 'Pez Lora Gigante',
    pez_angel_real: 'Pez Angel Real',
    tortuga_carey: 'Tortuga Carey',
    mero_guasa: 'Mero Guasa',
    pargo_amarillo: 'Pargo Amarillo',
    cangrejo_moro_roca: 'Cangrejo Moro de Roca',
    bailarina_mar: 'Bailarina de Mar',
    pez_globo_puntos_blancos: 'Pez Globo de Puntos Blancos',
    tortuga_golfina: 'Tortuga Golfina',
    jaiba_azul_pacifico: 'Jaiba Azul del Pacifico'
};

window.godot_simulation = getInitialSimulation();
window.godot_focus_species = SIMULATIONS[window.godot_simulation].species[0];
window.godot_temperature = SIMULATIONS[window.godot_simulation].values.godot_temperature;
window.godot_salinity = SIMULATIONS[window.godot_simulation].values.godot_salinity;
window.godot_oxygen = SIMULATIONS[window.godot_simulation].values.godot_oxygen;
window.godot_ecosystem_health = SIMULATIONS[window.godot_simulation].values.godot_ecosystem_health;
window.godot_pollution = SIMULATIONS[window.godot_simulation].values.godot_pollution;

let selectedSimulation = window.godot_simulation;
let selectedSpecies = window.godot_focus_species;
let lastGodotStats = null;
let godotStarted = false;
let simulationVisible = false;

function getInitialSimulation() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id === '2') return 'sim_02_cadena_alimenticia';
    if (id === '3') return 'sim_03_contaminacion_marina';
    return 'sim_01_ecosistema_basico';
}

function setGlobal(key, value) {
    window[key] = value;
    if (window.godotBridge && typeof window.godotBridge.notify === 'function') {
        window.godotBridge.notify(key, value);
    }
}

function formatNumber(value, decimals = 1) {
    const num = Number(value);
    if (!Number.isFinite(num)) return '0.0';
    return num.toFixed(decimals);
}

document.addEventListener('DOMContentLoaded', function () {
    setupTimer();
    setupFullscreen();
    setupParticleCanvas();
    setupSliders();
    setupSimulationTabs();
    setupObservations();

    applySimulation(selectedSimulation);
    setSimulationVisible(true);

    const params = new URLSearchParams(window.location.search);
    if (params.get('start') === '1' && typeof window.beginSelectedSimulation === 'function') {
        window.beginSelectedSimulation();
    }
});

function setupObservations() {
    const input = document.getElementById('obsInput');
    const button = document.getElementById('sendObs');
    const thread = document.getElementById('observationThread');
    if (!input || !button) return;

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function observationTemplate(observation) {
        const user = observation.usuario || window.CURRENT_USER_NAME || 'Estudiante';
        const initial = user.trim().charAt(0).toUpperCase() || 'E';
        return `
            <article class="observation-comment">
                <div class="observation-avatar" aria-hidden="true">${escapeHtml(initial)}</div>
                <div class="observation-body">
                    <div class="observation-meta">
                        <strong>${escapeHtml(user)}</strong>
                        <span>${escapeHtml(observation.fecha || 'Ahora')}</span>
                    </div>
                    <p>${escapeHtml(observation.observacion)}</p>
                </div>
            </article>
        `;
    }

    function renderObservationThread(observations = []) {
        if (!thread) return;
        if (!observations.length) {
            thread.innerHTML = '<p class="observation-empty">Tus observaciones apareceran aqui.</p>';
            return;
        }
        thread.innerHTML = observations.map(observationTemplate).join('');
    }

    function prependObservation(observation) {
        if (!thread) return;
        const empty = thread.querySelector('.observation-empty');
        if (empty) empty.remove();
        thread.insertAdjacentHTML('afterbegin', observationTemplate(observation));
    }

    function setObservationState(message, isError = false) {
        input.placeholder = message;
        input.classList.toggle('obs-error', isError);
        input.classList.toggle('obs-success', !isError);
        setTimeout(() => {
            input.classList.remove('obs-error', 'obs-success');
            input.placeholder = 'Escribe tus observaciones del ecosistema...';
        }, 2400);
    }

    async function sendObservation() {
        const text = input.value.trim();
        const assignmentId = Number(window.ASSIGNMENT_ID || 0);

        if (!text) {
            setObservationState('Escribe una observacion antes de enviar.', true);
            return;
        }
        if (!assignmentId) {
            setObservationState('Entra desde tus asignaciones para guardar observaciones.', true);
            return;
        }

        button.disabled = true;
        try {
            const formData = new FormData();
            formData.append('id_asignacion', String(assignmentId));
            formData.append('observacion', text);

            const response = await fetch('guardar_observacion.php', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });
            const result = await response.json();

            if (!response.ok || !result.ok) {
                throw new Error(result.message || 'No se pudo guardar la observacion.');
            }

            input.value = '';
            prependObservation(result.observation || {
                usuario: window.CURRENT_USER_NAME || 'Estudiante',
                fecha: 'Ahora',
                observacion: text
            });
            setObservationState('Observacion guardada para tu docente.');
        } catch (error) {
            setObservationState(error.message || 'No se pudo guardar la observacion.', true);
        } finally {
            button.disabled = false;
        }
    }

    button.addEventListener('click', sendObservation);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') sendObservation();
    });
    renderObservationThread(Array.isArray(window.INITIAL_OBSERVATIONS) ? window.INITIAL_OBSERVATIONS : []);
}

function setupTimer() {
    const timerDisplay = document.getElementById('timer');
    let seconds = 0;
    let interval = null;
    let timerRunning = false;

    function updateTimer() {
        if (!timerRunning) return;
        seconds++;
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        if (timerDisplay) timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
    }

    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');

    if (startBtn) {
        startBtn.onclick = () => {
            beginTimer();
        };
    }
    if (pauseBtn) {
        pauseBtn.onclick = () => {
            timerRunning = false;
            clearInterval(interval);
            interval = null;
            setGlobal('godot_is_running', false);
        };
    }
    if (resetBtn) {
        resetBtn.onclick = () => {
            timerRunning = false;
            clearInterval(interval);
            interval = null;
            seconds = 0;
            if (timerDisplay) timerDisplay.textContent = '00:00:00';
            setGlobal('godot_reset_simulation', Date.now());
            applySimulation(selectedSimulation);
            setSimulationVisible(true);
        };
    }

    const returnBtn = document.getElementById('returnToSelector');
    if (returnBtn) {
        returnBtn.onclick = () => {
            window.location.href = 'simuladores.php';
        };
    }

    function beginTimer() {
        setSimulationVisible(true);
        startGodot();
        setGlobal('godot_is_running', true);
        timerRunning = true;
        if (!interval) interval = setInterval(updateTimer, 1000);
    }

    window.beginSelectedSimulation = beginTimer;
}

function setSimulationVisible(visible) {
    simulationVisible = visible;
    const simulator = document.querySelector('.simulator');
    const returnBtn = document.getElementById('returnToSelector');
    if (simulator) {
        simulator.classList.toggle('selection-mode', !visible);
        simulator.classList.toggle('simulation-mode', visible);
        simulator.classList.toggle('simulation-hidden', !visible);
    }
    if (returnBtn) returnBtn.hidden = false;
    setGlobal('godot_is_running', visible);
}

function setupFullscreen() {
    const expandBtn = document.getElementById('expandBtn');
    const closeBtn = document.getElementById('closeFullscreen');
    const simulator = document.querySelector('.simulator');

    if (expandBtn) expandBtn.onclick = () => { if (simulator && !document.fullscreenElement) simulator.requestFullscreen(); };
    if (closeBtn) closeBtn.onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); };

    document.addEventListener('fullscreenchange', () => {
        if (simulator) simulator.classList.toggle('fullscreen-active', !!document.fullscreenElement);
    });
}

function setupParticleCanvas() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
}

function setupSliders() {
    bindSlider('tempSlider', 'tempVal', 'godot_temperature');
    bindSlider('salSlider', 'salVal', 'godot_salinity');
    bindSlider('oxSlider', 'oxVal', 'godot_oxygen');
    bindSlider('pollutionSlider', 'pollutionVal', 'godot_pollution');
}

function bindSlider(sliderId, valueId, globalKey) {
    const slider = document.getElementById(sliderId);
    const valueEl = document.getElementById(valueId);
    if (!slider) return;

    slider.addEventListener('input', function () {
        const value = Number(this.value);
        if (valueEl) valueEl.textContent = value;
        this.setAttribute('aria-valuenow', value);
        setGlobal(globalKey, value);
        updateLocalAlerts();
    });
}

function setupSimulationTabs() {
    document.querySelectorAll('.sim-tab').forEach((button) => {
        button.addEventListener('click', () => {
            applySimulation(button.dataset.simulation);
        });
    });
}

function applySimulation(simulationKey) {
    const config = SIMULATIONS[simulationKey] || SIMULATIONS.sim_01_ecosistema_basico;
    selectedSimulation = simulationKey;
    selectedSpecies = config.species[0];

    setGlobal('godot_simulation', simulationKey);
    setGlobal('godot_focus_species', selectedSpecies);

    Object.entries(config.values).forEach(([key, value]) => setGlobal(key, value));
    if (config.populations) {
        Object.entries(config.populations).forEach(([speciesKey, value]) => {
            setGlobal(`godot_population_${speciesKey}`, value);
        });
    }

    updateSimulationText(config);
    updateSimulationTheme(config.tabClass);
    updateSimulationButtons(simulationKey);
    renderSpeciesButtons(config.species);
    setGlobal('godot_allowed_species', config.species.join(','));
    renderPopulationControls(config);
    updateControlsVisibility(config);
    updateSliderValues(config.values);
    updateCurrentSpecies();
    updateLocalAlerts();
    updateStatsPanel(lastGodotStats);
}

function updateSimulationText(config) {
    const titleEl = document.getElementById('simTitle');
    const currentSimName = document.getElementById('currentSimName');
    const currentDescription = document.getElementById('currentSimDescription');
    const summaryTitle = document.getElementById('simSummaryTitle');
    const summaryText = document.getElementById('simSummaryText');

    if (titleEl) titleEl.textContent = config.heading;
    if (currentSimName) currentSimName.textContent = config.title;
    if (currentDescription) currentDescription.textContent = config.description;
    if (summaryTitle) summaryTitle.textContent = config.title;
    if (summaryText) summaryText.textContent = config.summary;
}

function updateSimulationTheme(tabClass) {
    const simulatorBox = document.querySelector('.simulator');
    if (!simulatorBox) return;
    simulatorBox.classList.remove('theme-arrecife', 'theme-cadena', 'theme-contaminacion');
    simulatorBox.classList.add(`theme-${tabClass}`);
}

function updateSimulationButtons(simulationKey) {
    document.querySelectorAll('.sim-tab').forEach((button) => {
        button.classList.toggle('active', button.dataset.simulation === simulationKey);
    });
    document.querySelectorAll('.selector-card').forEach((card) => {
        const isActive = card.dataset.simulation === simulationKey;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

function renderSpeciesButtons(speciesKeys) {
    const container = document.querySelector('.species-options');
    if (!container) return;

    container.innerHTML = speciesKeys.map((speciesKey, index) => {
        const active = index === 0 ? ' active' : '';
        return `<button class="species-chip${active}" type="button" data-species="${speciesKey}">${SPECIES[speciesKey] || speciesKey}</button>`;
    }).join('');

    container.querySelectorAll('.species-chip').forEach((button) => {
        button.addEventListener('click', () => applySpecies(button.dataset.species));
    });
}

function applySpecies(speciesKey) {
    selectedSpecies = speciesKey;
    setGlobal('godot_focus_species', speciesKey);
    document.querySelectorAll('.species-chip').forEach((button) => {
        button.classList.toggle('active', button.dataset.species === speciesKey);
    });
    updateCurrentSpecies();
    updateStatsPanel(lastGodotStats);
}

function updateCurrentSpecies() {
    const currentSpeciesName = document.getElementById('currentSpeciesName');
    if (currentSpeciesName) currentSpeciesName.textContent = SPECIES[selectedSpecies] || selectedSpecies;
}

function renderPopulationControls(config) {
    const panel = document.getElementById('populationControls');
    const list = document.getElementById('populationControlList');
    if (!panel || !list) return;

    if (!config.populations) {
        panel.hidden = true;
        list.innerHTML = '';
        return;
    }

    panel.hidden = false;
    list.innerHTML = Object.entries(config.populations).map(([speciesKey, value]) => {
        return `
            <div class="control-group">
                <label for="pop_${speciesKey}">
                    ${SPECIES[speciesKey] || speciesKey}
                    <span class="val-display"><span id="popVal_${speciesKey}">${value}</span></span>
                </label>
                <input type="range" id="pop_${speciesKey}" min="0" max="12" step="1" value="${value}"
                    aria-label="Poblacion de ${SPECIES[speciesKey] || speciesKey}">
            </div>
        `;
    }).join('');

    Object.entries(config.populations).forEach(([speciesKey]) => {
        const slider = document.getElementById(`pop_${speciesKey}`);
        const valueEl = document.getElementById(`popVal_${speciesKey}`);
        if (!slider) return;
        slider.addEventListener('input', function () {
            const value = Number(this.value);
            if (valueEl) valueEl.textContent = value;
            setGlobal(`godot_population_${speciesKey}`, value);
        });
    });
}

function updateControlsVisibility(config) {
    const environmental = document.querySelector('.environmental-controls');
    const pollutionControl = document.getElementById('pollutionControl');

    if (environmental) environmental.hidden = config === SIMULATIONS.sim_02_cadena_alimenticia;
    if (pollutionControl) pollutionControl.hidden = config !== SIMULATIONS.sim_03_contaminacion_marina;
}

function updateSliderValues(values) {
    setSliderValue('tempSlider', 'tempVal', values.godot_temperature);
    setSliderValue('salSlider', 'salVal', values.godot_salinity);
    setSliderValue('oxSlider', 'oxVal', values.godot_oxygen);
    setSliderValue('pollutionSlider', 'pollutionVal', values.godot_pollution);
}

function setSliderValue(sliderId, valueId, value) {
    const slider = document.getElementById(sliderId);
    const valueEl = document.getElementById(valueId);
    if (slider) {
        slider.value = value;
        slider.setAttribute('aria-valuenow', value);
    }
    if (valueEl) valueEl.textContent = value;
}

function updateLocalAlerts() {
    const alertsContainer = document.querySelector('.card.alerts');
    if (!alertsContainer) return;

    const heading = alertsContainer.querySelector('h3');
    alertsContainer.innerHTML = '';
    if (heading) alertsContainer.appendChild(heading);

    const temp = Number(window.godot_temperature);
    const sal = Number(window.godot_salinity);
    const ox = Number(window.godot_oxygen);
    const pollution = Number(window.godot_pollution);
    const alerts = [];

    if (selectedSimulation !== 'sim_02_cadena_alimenticia') {
        if (temp < 22 || temp > 30) alerts.push('Temperatura fuera de rango optimo');
        if (sal < 30 || sal > 38) alerts.push('Salinidad fuera de rango optimo');
        if (ox < 5) alerts.push('Oxigeno insuficiente');
    }
    if (selectedSimulation === 'sim_03_contaminacion_marina' && pollution > 40) {
        alerts.push('Contaminacion elevada');
    }

    if (alerts.length === 0) {
        alertsContainer.insertAdjacentHTML('beforeend', '<p class="ok">Todos los parametros en rango optimo</p>');
        return;
    }

    alerts.forEach((message) => {
        alertsContainer.insertAdjacentHTML('beforeend', `<p class="warning">${message}</p>`);
    });
}

function startGodot() {
    if (godotStarted) return;
    const godotContainer = document.getElementById('godot-canvas');
    let godotCanvas = document.getElementById('canvas');

    if (godotContainer && !godotCanvas) {
        godotCanvas = document.createElement('canvas');
        godotCanvas.id = 'canvas';
        godotCanvas.style.cssText = 'width:100%;height:100%;display:block;';
        godotContainer.appendChild(godotCanvas);
    }

    function boot() {
        if (typeof Engine === 'undefined' || !Engine) {
            setTimeout(boot, 200);
            return;
        }

        const base = (window.APP_BASE || '') + '/public/godot/index';
        try {
            const engine = new Engine({
                canvas: godotCanvas,
                executable: base,
                mainPack: base + '.pck',
                canvasResizePolicy: 2,
                locale: 'es',
                args: []
            });

            engine.startGame().catch((error) => {
                console.error('Error iniciando Godot 4:', error);
                tryGodot3(base, godotCanvas);
            });
            godotStarted = true;
        } catch (error) {
            console.warn('Fallo constructor Godot 4, intentando Godot 3:', error);
            tryGodot3(base, godotCanvas);
            godotStarted = true;
        }
    }

    boot();
}

function tryGodot3(base, canvas) {
    try {
        const engine = new Engine();
        engine.startGame(base, canvas, base + '.pck')
            .catch((error) => console.error('Error iniciando Godot 3:', error));
    } catch (error) {
        console.error('No se pudo iniciar Godot:', error);
    }
}

window.onGodotCatalog = function (catalog) {
    window.godot_catalog = catalog;
};

window.onGodotStats = function (stats) {
    lastGodotStats = stats;
    updateStatsPanel(stats);
    updateAlertsFromGodot(stats.alerts || []);
};

function updateStatsPanel(stats) {
    const healthEl = document.getElementById('health-val');
    const stressEl = document.getElementById('stress-val');
    const stageEl = document.getElementById('stage-val');
    const ageEl = document.getElementById('age-val');
    const growthEl = document.getElementById('growth-val');
    const wellbeingEl = document.getElementById('wellbeing-val');
    const populationEl = document.getElementById('population-val');

    const selectedStats = stats && stats.species ? stats.species[selectedSpecies] : null;
    const selectedPopulation = stats && stats.populations ? stats.populations[selectedSpecies] : 0;

    const etapas = {
        EGG: 'Huevo',
        JUVENILE: 'Juvenil',
        ADULT: 'Adulto',
        ELDER: 'Anciano',
        NONE: 'Sin individuos'
    };

    if (healthEl) healthEl.textContent = selectedStats ? `${formatNumber(selectedStats.health)}%` : '-';
    if (stressEl) stressEl.textContent = selectedStats ? `${formatNumber(selectedStats.stress)}%` : '-';
    if (wellbeingEl) wellbeingEl.textContent = selectedStats ? `${formatNumber(selectedStats.wellbeing)}%` : '-';
    if (stageEl) stageEl.textContent = selectedStats ? (etapas[selectedStats.stage] || selectedStats.stage || '-') : '-';
    if (ageEl) ageEl.textContent = selectedStats ? `${formatNumber(selectedStats.age)} s` : '-';
    if (growthEl) growthEl.textContent = selectedStats ? `${formatNumber(selectedStats.life_progress)}%` : '-';
    if (populationEl) populationEl.textContent = selectedPopulation || 0;
}

function updateAlertsFromGodot(alerts) {
    const container = document.querySelector('.card.alerts');
    if (!container) return;

    const heading = container.querySelector('h3');
    container.innerHTML = '';
    if (heading) container.appendChild(heading);

    if (!alerts || alerts.length === 0) {
        container.insertAdjacentHTML('beforeend', '<p class="ok">Todos los parametros en rango optimo</p>');
        return;
    }

    alerts.forEach((message) => {
        container.insertAdjacentHTML('beforeend', `<p class="warning">${message}</p>`);
    });
}
