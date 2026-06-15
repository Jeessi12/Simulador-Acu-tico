// ========== VARIABLES GLOBALES GODOT ==========
// Se declaran primero para que Godot las lea desde el inicio
window.godot_temperature = 24;
window.godot_salinity    = 35;
window.godot_oxygen      = 6;

// ========== TODO DENTRO DE DOMContentLoaded ==========
// Garantiza que el DOM esté disponible antes de buscar cualquier elemento

document.addEventListener('DOMContentLoaded', function () {

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
    const expandBtn  = document.getElementById("expandBtn");
    const closeBtn   = document.getElementById("closeFullscreen");
    const simulator  = document.querySelector(".simulator");

    if (expandBtn) expandBtn.onclick = () => { if (simulator && !document.fullscreenElement) simulator.requestFullscreen(); };
    if (closeBtn)  closeBtn.onclick  = () => { if (document.fullscreenElement) document.exitFullscreen(); };

    document.addEventListener("fullscreenchange", () => {
        if (simulator) simulator.classList.toggle("fullscreen-active", !!document.fullscreenElement);
    });

    // ─── SLIDERS — PUENTE HACIA GODOT ───
    // Los sliders actualizan window.godot_* que Godot lee vía JavaScriptBridge
    // y también disparan actualizarAlertas para feedback visual inmediato.

    function bindSlider(sliderId, valId, globalKey, low, high, label) {
        const slider = document.getElementById(sliderId);
        const valEl  = document.getElementById(valId);
        if (!slider) { console.warn(`❌ Slider #${sliderId} no encontrado`); return; }

        slider.addEventListener('input', function () {
            const val = parseFloat(this.value);
            if (valEl) valEl.textContent = val;
            window[globalKey] = val;
            // Notificar a Godot si el puente está disponible
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

        // Preservar el h3 si existe
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
    // Crea el <canvas> hijo dentro de #godot-canvas y arranca el Engine.
    // Las rutas son relativas a la ubicación de index.js en /public/godot/,
    // por lo que se pasan como rutas absolutas desde la raíz del servidor.

    const godotContainer = document.getElementById("godot-canvas");
    let   godotCanvas    = null;

    if (godotContainer) {
        godotCanvas = document.createElement("canvas");
        godotCanvas.id = "canvas";
        godotCanvas.style.width  = "100%";
        godotCanvas.style.height = "100%";
        godotCanvas.style.display = "block";
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

        const engine = new Engine(godotCanvas);

        engine.startGame({
            executable: base,
            mainPack:   base + '.pck',
            canvasResizePolicy: 2,
            locale: "es",
            args: []
        }).then(function () {
            console.log("✅ Godot iniciado correctamente");
        }).catch(function (err) {
            console.error("❌ Error iniciando Godot:", err);
        });
    }

    startGodot();
    console.log("🎮 simulador.js listo");
});