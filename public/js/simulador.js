// ========== VARIABLES GLOBALES GODOT ==========
window.godot_temperature = 24;
window.godot_salinity    = 35;
window.godot_oxygen      = 6;

// 1. Variable de especie — la seteas desde el botón "Iniciar simulación"
//    de la página de especies, pasando el key de la DB de Godot
window.godot_species = "pez_cirujano";  // ejemplo

// 2. Parámetros avanzados nuevos (además de los ya existentes)
window.godot_ph         = 8.1;
window.godot_pollution  = 0.0;
window.godot_light      = 80.0;
window.godot_current    = 0.3;
window.godot_turbidity  = 5.0;
window.godot_nutrients  = 20.0;




// 3. Callback que Godot llama cada 1s con el estado del simulador


document.addEventListener('DOMContentLoaded', function () {

    const canvas = document.getElementById('particles'); // ← verifica que uses este ID exacto
    if (!canvas) { console.error('❌ Canvas #particles no encontrado'); return; }
    const ctx = canvas.getContext('2d');

    // ─── TIMER ───
    const timerDisplay = document.getElementById("timer");
    let seconds  = 0;
    let interval = null;

    function updateTimer() {
        seconds++;
        const hrs  = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        if (timerDisplay) timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
    }

    const startBtn = document.getElementById("start");
    const pauseBtn = document.getElementById("pause");
    const resetBtn = document.getElementById("reset");

    if (startBtn) startBtn.onclick = () => { if (!interval) interval = setInterval(updateTimer, 1000); };
    if (pauseBtn) pauseBtn.onclick = () => { clearInterval(interval); interval = null; };
    if (resetBtn) resetBtn.onclick = () => {
        clearInterval(interval);
        interval = null;
        seconds = 0;
        if (timerDisplay) timerDisplay.textContent = "00:00:00";
    };

    // ─── FULLSCREEN ───
    const expandBtn = document.getElementById("expandBtn");
    const closeBtn  = document.getElementById("closeFullscreen");
    const simulator = document.querySelector(".simulator");

    if (expandBtn) expandBtn.onclick = () => { if (simulator && !document.fullscreenElement) simulator.requestFullscreen(); };
    if (closeBtn)  closeBtn.onclick  = () => { if (document.fullscreenElement) document.exitFullscreen(); };

    document.addEventListener("fullscreenchange", () => {
        if (simulator) simulator.classList.toggle("fullscreen-active", !!document.fullscreenElement);
    });

    // ─── SLIDERS ───
    function bindSlider(sliderId, valId, globalKey, low, high, label) {
        const slider = document.getElementById(sliderId);
        const valEl  = document.getElementById(valId);
        if (!slider) { console.warn(`❌ Slider #${sliderId} no encontrado`); return; }

        slider.addEventListener('input', function () {
            const val = parseFloat(this.value);
            if (valEl) valEl.textContent = val;
            window[globalKey] = val;
            if (window.godotBridge && typeof window.godotBridge.notify === 'function') {
                window.godotBridge.notify(globalKey, val);
            }
            actualizarAlertas(window.godot_temperature, window.godot_salinity, window.godot_oxygen);
            console.log(`📤 ${label}: ${val}`);
        });

        console.log(`✅ Slider #${sliderId} listo`);
    }

    bindSlider('tempSlider', 'tempVal', 'godot_temperature', 22, 28, 'Temperatura');
    bindSlider('salSlider',  'salVal',  'godot_salinity',    32, 38, 'Salinidad');
    bindSlider('oxSlider',   'oxVal',   'godot_oxygen',       5,  8, 'Oxígeno');

    // ─── ALERTAS ───
    function actualizarAlertas(temp, sal, ox) {
        const alertsContainer = document.querySelector('.card.alerts');
        if (!alertsContainer) return;

        const heading = alertsContainer.querySelector('h3');
        alertsContainer.innerHTML = '';
        if (heading) alertsContainer.appendChild(heading);

        let alertasActivas = false;

        if (temp < 22 || temp > 28) {
            alertsContainer.insertAdjacentHTML('beforeend', '<p class="warning">⚠️ Temperatura fuera de rango óptimo</p>');
            alertasActivas = true;
        }
        if (sal < 32 || sal > 38) {
            alertsContainer.insertAdjacentHTML('beforeend', '<p class="warning">⚠️ Salinidad fuera de rango óptimo</p>');
            alertasActivas = true;
        }
        if (ox < 5 || ox > 8) {
            alertsContainer.insertAdjacentHTML('beforeend', '<p class="warning">⚠️ Nivel de oxígeno fuera de rango</p>');
            alertasActivas = true;
        }
        if (!alertasActivas) {
            alertsContainer.insertAdjacentHTML('beforeend', '<p class="ok">✔ Todos los parámetros en rango óptimo</p>');
        }
    }

    // ─── INICIAR GODOT ───
    const godotContainer = document.getElementById("godot-canvas");
    let   godotCanvas    = null;

    if (godotContainer) {
        godotCanvas = document.createElement("canvas");
        godotCanvas.id     = "canvas";          // Godot busca este ID por defecto
        godotCanvas.style.cssText = "width:100%;height:100%;display:block;";
        godotContainer.appendChild(godotCanvas);
    }

    function startGodot() {
        if (typeof Engine === 'undefined' || !Engine) {
            console.log("⏳ Esperando Engine de Godot...");
            setTimeout(startGodot, 200);
            return;
        }

        const base = (window.APP_BASE || '') + '/public/godot/index';
        console.log("🚀 Iniciando Godot con ruta base:", base);

        // ─── GODOT 4 ─────────────────────────────────────────────────────────
        // El constructor recibe la config completa; startGame() se llama sin args.
        try {
            const engine = new Engine({
                canvas:             godotCanvas,
                executable:         base,
                mainPack:           base + '.pck',
                canvasResizePolicy: 2,        // 2 = adaptarse al contenedor CSS
                locale:             'es',
                args:               [],
                onProgress: function (current, total) {
                    if (total > 0) {
                        console.log(`📦 Carga Godot: ${Math.round(current / total * 100)}%`);
                    }
                }
            });

            engine.startGame()
                .then(()  => console.log("✅ Godot iniciado correctamente"))
                .catch(err => {
                    console.error("❌ Error Godot 4:", err);
                    // Si falla Godot 4, intenta como Godot 3
                    tryGodot3(base);
                });

        } catch (e) {
            console.warn("⚠️ Fallo constructor Godot 4, intentando Godot 3:", e);
            tryGodot3(base);
        }
    }

    // ─── GODOT 3 (fallback) ──────────────────────────────────────────────────
    // En Godot 3 el constructor no recibe args; startGame recibe (base, canvas, pack).
    function tryGodot3(base) {
        try {
            const engine = new Engine();
            engine.startGame(base, godotCanvas, base + '.pck')
                .then(()  => console.log("✅ Godot 3 iniciado correctamente"))
                .catch(err => console.error("❌ Error Godot 3:", err));
        } catch (e) {
            console.error("❌ No se pudo iniciar Godot en ninguna versión:", e);
        }
    }

    startGodot();
    console.log("🎮 simulador.js listo");
});

// ── FUERA de DOMContentLoaded ──────────────────────────────────────────
// Debe ser global para que Godot pueda llamarlo vía JavaScriptBridge

function actualizarAlertasGodot(alerts) {
    var container = document.querySelector('.card.alerts');
    if (!container) return;

    var heading = container.querySelector('h3');
    container.innerHTML = '';
    if (heading) container.appendChild(heading);

    if (!alerts || alerts.length === 0) {
        container.insertAdjacentHTML('beforeend', '<p class="ok">✔ Todos los parámetros en rango óptimo</p>');
        return;
    }

    var nombres = {
        'temperatura'  : '🌡️ Temperatura fuera de rango óptimo',
        'salinidad'    : '🧂 Salinidad fuera de rango óptimo',
        'oxigeno'      : '💨 Oxígeno insuficiente',
        'ph'           : '⚗️ pH fuera de rango',
        'contaminacion': '☣️ Nivel de contaminación crítico',
        'corriente'    : '🌊 Corriente demasiado fuerte',
        'luz'          : '🔦 Nivel de luz insuficiente'
    };

    alerts.forEach(function(key) {
        var msg = nombres[key] || ('⚠️ ' + key);
        container.insertAdjacentHTML('beforeend', '<p class="warning">⚠️ ' + msg + '</p>');
    });
}

window.onGodotStats = function(stats) {
    var healthEl = document.getElementById('health-val');
    var stressEl = document.getElementById('stress-val');
    var stageEl  = document.getElementById('stage-val');
    var wbEl     = document.getElementById('wellbeing-val');
    var popEl    = document.getElementById('population-val');

    var etapas = { EGG: '🥚 Huevo', JUVENILE: '🐟 Juvenil', ADULT: '🐠 Adulto', ELDER: '🐡 Anciano' };

    if (healthEl) healthEl.textContent = (stats.health  || 0).toFixed(1) + '%';
    if (stressEl) stressEl.textContent = (stats.stress  || 0).toFixed(1) + '%';
    if (wbEl)     wbEl.textContent     = (stats.wellbeing || 0).toFixed(1) + '%';
    if (stageEl)  stageEl.textContent  = etapas[stats.stage] || stats.stage || '—';
    if (popEl)    popEl.textContent    = stats.population || 0;

    actualizarAlertasGodot(stats.alerts || []);
};