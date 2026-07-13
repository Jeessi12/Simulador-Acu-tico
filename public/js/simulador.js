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
            'Puedes ajustar temperatura, salinidad, oxigeno y salud del ecosistema.'
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
        summary: 'Modifica poblaciones y condiciones ambientales para observar cambios en toda la red alimenticia.',
        description: 'Ajusta especies, temperatura, salinidad, oxigeno, salud ambiental y contaminacion para analizar sus efectos en el arrecife.',
        details: [
            'Puedes cambiar las poblaciones de depredadores, presas y organismos base.',
            'Las condiciones ambientales afectan la productividad del arrecife y su capacidad de carga.',
            'Observa como cambian la reproduccion, supervivencia y el equilibrio trofico.'
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
window.godot_population_polling_enabled = false;

let selectedSimulation = window.godot_simulation;
let selectedSpecies = window.godot_focus_species;
let lastGodotStats = null;
let livePopulations = {};
let populationLimits = {};
let godotStarted = false;
let simulationVisible = false;
let achievementSessionToken = null;

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

async function achievementApi(action, data = {}, keepalive = false) {
    const response = await fetch('api_achievements.php', {
        method: 'POST',
        credentials: 'same-origin',
        keepalive,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action,
            csrf_token: window.BLUEECO_ACHIEVEMENT_CSRF,
            ...data
        })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo actualizar el progreso de logros.');
    }
    return result.data || {};
}

function announceAchievementUnlocks(unlocked) {
    if (!Array.isArray(unlocked) || unlocked.length === 0) return;
    window.dispatchEvent(new CustomEvent('blueeco:achievements-unlocked', { detail: unlocked }));
}

document.addEventListener('DOMContentLoaded', function () {
    setupTimer();
    setupFullscreen();
    setupParticleCanvas();
    setupSliders();
    setupSimulationTabs();
    setupGodotPopulationSync();
    setupObservations();

    applySimulation(selectedSimulation);
    setSimulationVisible(true);
    startGodot();

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
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');
    const completeBtn = document.getElementById('completeSimulation');
    const completionStatus = document.getElementById('completionStatus');
    let seconds = 0;
    let interval = null;
    let achievementHeartbeat = null;
    let timerRunning = false;

    function setCompletionStatus(message, state = '') {
        if (!completionStatus) return;
        completionStatus.textContent = message;
        completionStatus.classList.toggle('is-error', state === 'error');
        completionStatus.classList.toggle('is-success', state === 'success');
    }

    function updateTimer() {
        if (!timerRunning) return;
        seconds++;
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        if (timerDisplay) timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
    }

    function stopLocalTimer() {
        timerRunning = false;
        clearInterval(interval);
        clearInterval(achievementHeartbeat);
        interval = null;
        achievementHeartbeat = null;
        setGlobal('godot_is_running', false);
    }

    async function heartbeatAchievement() {
        if (!achievementSessionToken || !timerRunning) return;
        try {
            const data = await achievementApi('heartbeat_simulation', {
                session_token: achievementSessionToken
            });
            announceAchievementUnlocks(data.unlocked);
        } catch (error) {
            console.warn(error.message);
        }
    }

    async function pauseAchievement(keepalive = false) {
        if (!achievementSessionToken) return;
        try {
            await achievementApi('pause_simulation', {
                session_token: achievementSessionToken
            }, keepalive);
        } catch (error) {
            if (!keepalive) console.warn(error.message);
        }
    }

    async function beginTimer() {
        if (timerRunning) return;
        setSimulationVisible(true);
        startGodot();
        setCompletionStatus('Registrando tiempo activo de exploración…');

        try {
            if (!achievementSessionToken) {
                const params = new URLSearchParams(window.location.search);
                const data = await achievementApi('start_simulation', {
                    simulation_id: Number(params.get('id')) || 1,
                    assignment_id: Number(window.ASSIGNMENT_ID) || null
                });
                achievementSessionToken = data.session_token;
            } else {
                await achievementApi('resume_simulation', {
                    session_token: achievementSessionToken
                });
            }
        } catch (error) {
            setCompletionStatus(error.message, 'error');
        }

        setGlobal('godot_is_running', true);
        timerRunning = true;
        if (!interval) interval = setInterval(updateTimer, 1000);
        if (!achievementHeartbeat) achievementHeartbeat = setInterval(heartbeatAchievement, 60000);
    }

    startBtn?.addEventListener('click', beginTimer);
    pauseBtn?.addEventListener('click', () => {
        stopLocalTimer();
        pauseAchievement();
        setCompletionStatus('Simulación en pausa. Tu tiempo activo quedó guardado.');
    });

    resetBtn?.addEventListener('click', () => {
        stopLocalTimer();
        pauseAchievement();
        seconds = 0;
        if (timerDisplay) timerDisplay.textContent = '00:00:00';
        setGlobal('godot_reset_simulation', Date.now());
        applySimulation(selectedSimulation);
        setSimulationVisible(true);
        setCompletionStatus('Temporizador reiniciado. Puedes continuar la misma experiencia.');
    });

    completeBtn?.addEventListener('click', async () => {
        if (!achievementSessionToken) {
            setCompletionStatus('Inicia el temporizador antes de finalizar la experiencia.', 'error');
            return;
        }

        completeBtn.disabled = true;
        try {
            const data = await achievementApi('complete_simulation', {
                session_token: achievementSessionToken
            });
            stopLocalTimer();
            achievementSessionToken = null;
            completeBtn.classList.add('is-complete');
            setCompletionStatus('¡Experiencia completada y progreso guardado!', 'success');
            announceAchievementUnlocks(data.unlocked);
        } catch (error) {
            setCompletionStatus(error.message, 'error');
        } finally {
            completeBtn.disabled = false;
        }
    });

    const returnBtn = document.getElementById('returnToSelector');
    returnBtn?.addEventListener('click', () => {
        stopLocalTimer();
        pauseAchievement(true);
        window.location.href = 'simuladores.php';
    });

    window.addEventListener('pagehide', () => {
        if (achievementSessionToken && timerRunning) pauseAchievement(true);
    });

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
    bindSlider('healthSlider', 'healthVal', 'godot_ecosystem_health');
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
    livePopulations = { ...(config.populations || {}) };
    populationLimits = {};
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
    updateFoodChainInsight();
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
        const currentValue = getPopulationCount(speciesKey, value);
        const limit = getPopulationLimit(speciesKey);
        const maxText = limit && Number.isFinite(Number(limit.max)) ? ` / ${limit.max}` : '';
        const speciesName = SPECIES[speciesKey] || speciesKey;
        return `
            <div class="population-stepper" data-species="${speciesKey}">
                <div>
                    <strong>${speciesName}</strong>
                    <span class="population-limit">Poblacion viva</span>
                </div>
                <div class="population-actions">
                    <button type="button" class="population-btn" data-delta="-1" aria-label="Eliminar 1 ${speciesName}">
                        <i class="fa-solid fa-minus" aria-hidden="true"></i>
                    </button>
                    <span class="population-count" aria-live="polite">
                        <span id="popVal_${speciesKey}">${currentValue}</span><span id="popLimit_${speciesKey}">${maxText}</span>
                    </span>
                    <button type="button" class="population-btn" data-delta="1" aria-label="Agregar 1 ${speciesName}">
                        <i class="fa-solid fa-plus" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('') + `
        <div class="food-chain-insight" id="foodChainInsight" aria-live="polite">
            <div class="trophic-meter">
                <span>Balance trófico</span>
                <strong id="trophicBalanceValue">--</strong>
            </div>
            <div class="trophic-bar" aria-hidden="true"><span id="trophicBalanceBar"></span></div>
            <p id="trophicDiagnosis">Ajusta las poblaciones y el ambiente para observar la respuesta de la red alimenticia.</p>
            <dl id="foodChainEcology" class="food-chain-ecology" hidden>
                <div><dt>Salud ambiental</dt><dd data-ecology-value="environmental_health">--</dd></div>
                <div><dt>Productividad del arrecife</dt><dd data-ecology-value="reef_productivity">--</dd></div>
                <div><dt>Capacidad de carga</dt><dd data-ecology-value="carrying_capacity">--</dd></div>
                <div><dt>Biodiversidad</dt><dd data-ecology-value="biodiversity">--</dd></div>
                <div><dt>Estado del arrecife</dt><dd data-ecology-value="reef_state">--</dd></div>
                <div><dt>Capturas</dt><dd data-ecology-value="captures">--</dd></div>
                <div><dt>Mortalidad</dt><dd data-ecology-value="mortality">--</dd></div>
            </dl>
        </div>
    `;

    list.querySelectorAll('.population-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const row = button.closest('.population-stepper');
            if (!row) return;
            const speciesKey = row.dataset.species;
            const delta = Number(button.dataset.delta || 0);
            const limit = getPopulationLimit(speciesKey);
            const max = limit && Number.isFinite(Number(limit.max)) ? Number(limit.max) : 20;
            const nextValue = Math.max(0, Math.min(max, getPopulationCount(speciesKey, 0) + delta));
            livePopulations[speciesKey] = nextValue;
            setGlobal(`godot_population_${speciesKey}`, nextValue);
            updatePopulationCounters();
            updateStatsPanel(lastGodotStats);
            updateFoodChainInsight();
        });
    });

    updatePopulationCounters();
    updateFoodChainInsight();
}

function updateControlsVisibility(config) {
    const environmental = document.querySelector('.environmental-controls');
    const pollutionControl = document.getElementById('pollutionControl');
    const isFoodChain = config === SIMULATIONS.sim_02_cadena_alimenticia;

    if (environmental) {
        environmental.hidden = config !== SIMULATIONS.sim_01_ecosistema_basico && !isFoodChain;
    }
    if (pollutionControl) {
        pollutionControl.hidden = config !== SIMULATIONS.sim_03_contaminacion_marina && !isFoodChain;
    }
}

function updateSliderValues(values) {
    setSliderValue('tempSlider', 'tempVal', values.godot_temperature);
    setSliderValue('salSlider', 'salVal', values.godot_salinity);
    setSliderValue('oxSlider', 'oxVal', values.godot_oxygen);
    setSliderValue('healthSlider', 'healthVal', values.godot_ecosystem_health);
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
    const health = Number(window.godot_ecosystem_health);
    const pollution = Number(window.godot_pollution);
    const alerts = [];

    if (selectedSimulation === 'sim_01_ecosistema_basico') {
        if (temp < 22 || temp > 30) alerts.push('Temperatura fuera de rango optimo');
        if (sal < 30 || sal > 38) alerts.push('Salinidad fuera de rango optimo');
        if (ox < 5) alerts.push('Oxigeno insuficiente');
        if (health > 90) alerts.push('Salud alta: mantenla 20 segundos para atraer Tortugas Carey');
        if (health < 60) alerts.push('Salud del ecosistema baja');
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
    if (stats && stats.populations) livePopulations = { ...stats.populations };
    if (stats && stats.population_limits) populationLimits = { ...stats.population_limits };
    updatePopulationCounters();
    updateStatsPanel(stats);
    updateAlertsFromGodot(stats.alerts || []);
    updateFoodChainInsight(stats);
};

function setupGodotPopulationSync() {
    window.addEventListener('godotPopulationSync', (event) => {
        livePopulations = { ...(event.detail || {}) };
        updatePopulationCounters();
        updateStatsPanel(lastGodotStats);
    });
}

function getPopulationCount(speciesKey, defaultValue = 0) {
    const value = livePopulations && Object.prototype.hasOwnProperty.call(livePopulations, speciesKey)
        ? livePopulations[speciesKey]
        : defaultValue;
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function getPopulationLimit(speciesKey) {
    return populationLimits && populationLimits[speciesKey] ? populationLimits[speciesKey] : null;
}

function updatePopulationCounters() {
    const config = SIMULATIONS[selectedSimulation];
    if (!config || !config.populations) return;

    Object.entries(config.populations).forEach(([speciesKey, defaultValue]) => {
        const valueEl = document.getElementById(`popVal_${speciesKey}`);
        const limitEl = document.getElementById(`popLimit_${speciesKey}`);
        const addButton = document.querySelector(`.population-stepper[data-species="${speciesKey}"] .population-btn[data-delta="1"]`);
        const removeButton = document.querySelector(`.population-stepper[data-species="${speciesKey}"] .population-btn[data-delta="-1"]`);
        const value = getPopulationCount(speciesKey, defaultValue);
        const limit = getPopulationLimit(speciesKey);
        const max = limit && Number.isFinite(Number(limit.max)) ? Number(limit.max) : null;

        if (valueEl) valueEl.textContent = getPopulationCount(speciesKey, defaultValue);
        if (limitEl) limitEl.textContent = max === null ? '' : ` / ${max}`;
        if (addButton) addButton.disabled = max !== null && value >= max;
        if (removeButton) removeButton.disabled = value <= 0;
    });
    updateFoodChainInsight(lastGodotStats);
}

function getFirstStatValue(stats, keys) {
    if (!stats || typeof stats !== 'object') return undefined;
    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(stats, key) && stats[key] !== null && stats[key] !== undefined) {
            return stats[key];
        }
    }
    return undefined;
}

function setOptionalStatValue(ids, value, formatter = (currentValue) => currentValue) {
    const text = value === null || value === undefined || value === '' ? '-' : formatter(value);
    ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    });
}

function formatPercentStat(value) {
    const number = Number(value);
    return Number.isFinite(number) ? `${formatNumber(number)}%` : String(value);
}

function updateStatsPanel(stats) {
    const healthEl = document.getElementById('health-val');
    const stressEl = document.getElementById('stress-val');
    const stageEl = document.getElementById('stage-val');
    const ageEl = document.getElementById('age-val');
    const growthEl = document.getElementById('growth-val');
    const wellbeingEl = document.getElementById('wellbeing-val');
    const populationEl = document.getElementById('population-val');

    const selectedStats = stats && stats.species ? stats.species[selectedSpecies] : null;
    const selectedPopulation = stats && stats.populations
        ? stats.populations[selectedSpecies]
        : getPopulationCount(selectedSpecies, 0);

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

    // Algunos rediseños incluyen estas filas; se actualizan solo si existen en el DOM.
    setOptionalStatValue(
        ['hunger-val', 'hungerVal', 'hunger-value'],
        getFirstStatValue(selectedStats, ['hunger', 'hungry', 'hambre']),
        formatPercentStat
    );
    setOptionalStatValue(
        ['energy-val', 'energyVal', 'energy-value'],
        getFirstStatValue(selectedStats, ['energy', 'energia']),
        formatPercentStat
    );
    setOptionalStatValue(
        ['fatigue-val', 'fatigueVal', 'fatigue-value'],
        getFirstStatValue(selectedStats, ['fatigue', 'tiredness', 'fatiga']),
        formatPercentStat
    );
    setOptionalStatValue(
        ['immunity-val', 'immunityVal', 'immunity-value'],
        getFirstStatValue(selectedStats, ['immunity', 'immune_system', 'inmunidad']),
        formatPercentStat
    );
    setOptionalStatValue(
        ['biological-state-val', 'biologicalStateVal', 'biological-state-value', 'bio-state-val'],
        getFirstStatValue(selectedStats, ['biological_state', 'bio_state', 'estado_biologico', 'state']),
        (value) => String(value)
    );
}

function isEcologyPayload(ecology) {
    return !!ecology && typeof ecology === 'object' && !Array.isArray(ecology);
}

function normalizePercentage(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return null;
    const percentage = number >= 0 && number <= 1 ? number * 100 : number;
    return Math.max(0, Math.min(100, percentage));
}

function formatEcologyValue(key, value, ecology) {
    if (key === 'captures') {
        const successful = Number(ecology.captures_successful);
        const failed = Number(ecology.captures_failed);
        if (!Number.isFinite(successful) && !Number.isFinite(failed)) return '--';
        const successfulText = Number.isFinite(successful) ? successful : 0;
        const failedText = Number.isFinite(failed) ? failed : 0;
        return `${successfulText} exitosas / ${failedText} fallidas`;
    }
    if (key === 'carrying_capacity' || key === 'mortality') {
        const number = Number(value);
        return Number.isFinite(number) ? formatNumber(number, 0) : String(value ?? '--');
    }
    if (key === 'reef_state') return value === null || value === undefined ? '--' : String(value);

    const percentage = normalizePercentage(value);
    return percentage === null ? String(value ?? '--') : `${formatNumber(percentage)}%`;
}

function updateEcologyDetails(ecology) {
    const details = document.getElementById('foodChainEcology');
    if (!details) return;

    details.hidden = !isEcologyPayload(ecology);
    if (!isEcologyPayload(ecology)) return;

    details.querySelectorAll('[data-ecology-value]').forEach((element) => {
        const key = element.dataset.ecologyValue;
        const value = key === 'captures' ? null : ecology[key];
        element.textContent = formatEcologyValue(key, value, ecology);
    });
}

function updateFoodChainInsight(stats = lastGodotStats) {
    const panel = document.getElementById('foodChainInsight');
    if (!panel || selectedSimulation !== 'sim_02_cadena_alimenticia') return;

    const value = document.getElementById('trophicBalanceValue');
    const bar = document.getElementById('trophicBalanceBar');
    const diagnosis = document.getElementById('trophicDiagnosis');
    const ecology = stats && stats.ecology;

    // Godot es la fuente de verdad cuando exporta métricas ecológicas.
    if (isEcologyPayload(ecology)) {
        const score = normalizePercentage(ecology.trophic_balance);
        const environmentalHealth = formatEcologyValue('environmental_health', ecology.environmental_health, ecology);
        const productivity = formatEcologyValue('reef_productivity', ecology.reef_productivity, ecology);
        const carryingCapacity = formatEcologyValue('carrying_capacity', ecology.carrying_capacity, ecology);
        const reefState = formatEcologyValue('reef_state', ecology.reef_state, ecology);
        const captures = formatEcologyValue('captures', null, ecology);
        const mortality = formatEcologyValue('mortality', ecology.mortality, ecology);
        const messages = [];

        if (ecology.reef_state !== null && ecology.reef_state !== undefined && ecology.reef_state !== '') {
            messages.push(`Estado del arrecife: ${reefState}.`);
        }
        messages.push(`Salud ambiental: ${environmentalHealth}; productividad: ${productivity}; capacidad de carga: ${carryingCapacity}.`);
        if (Number.isFinite(Number(ecology.captures_successful)) || Number.isFinite(Number(ecology.captures_failed)) || Number.isFinite(Number(ecology.mortality))) {
            messages.push(`Capturas: ${captures}; mortalidad: ${mortality}.`);
        }

        if (value) value.textContent = score === null ? '--' : `${formatNumber(score, 0)}%`;
        if (bar) {
            bar.style.width = score === null ? '0%' : `${score}%`;
            bar.dataset.state = score === null ? 'warn' : score >= 75 ? 'good' : score >= 45 ? 'warn' : 'bad';
        }
        if (diagnosis) diagnosis.textContent = messages.join(' ');
        updateEcologyDetails(ecology);
        return;
    }

    updateEcologyDetails(null);

    const populations = stats && stats.populations ? stats.populations : livePopulations;
    const mero = Number(populations.mero_guasa ?? 0);
    const pargo = Number(populations.pargo_amarillo ?? 0);
    const cangrejo = Number(populations.cangrejo_moro_roca ?? 0);
    const bailarina = Number(populations.bailarina_mar ?? 0);
    const base = cangrejo + bailarina;
    const total = mero + pargo + base;
    const preyPressure = base > 0 ? pargo / base : pargo;
    const apexControl = pargo > 0 ? mero / pargo : mero;
    let score = 100;
    const messages = [];

    if (mero <= 0) {
        score -= 42;
        messages.push('Sin Mero Guasa, la cadena pierde su regulador superior.');
    } else if (apexControl < 0.25) {
        score -= 16;
        messages.push('Hay poco depredador tope para controlar al Pargo Amarillo.');
    } else {
        messages.push('El Mero Guasa mantiene presion de control sobre los consumidores.');
    }

    if (pargo <= 0) {
        score -= 18;
        messages.push('Falta depredador intermedio: la transferencia energetica queda incompleta.');
    } else if (preyPressure > 0.65) {
        score -= 24;
        messages.push('El Pargo Amarillo presiona demasiado a la base de la cadena.');
    }

    if (base < 6) {
        score -= 26;
        messages.push('La base alimenticia es baja: cangrejos y bailarinas no sostienen la red.');
    } else if (base > 18) {
        score -= 12;
        messages.push('La base crece mucho; puede aparecer competencia por espacio.');
    }

    if (total >= 26) {
        score -= 18;
        messages.push('La densidad total es alta y aumenta el estres por sobrepoblacion.');
    }

    score = Math.max(0, Math.min(100, Math.round(score)));
    if (value) value.textContent = `${score}%`;
    if (bar) {
        bar.style.width = `${score}%`;
        bar.dataset.state = score >= 75 ? 'good' : score >= 45 ? 'warn' : 'bad';
    }
    if (diagnosis) diagnosis.textContent = messages.slice(0, 2).join(' ');
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
