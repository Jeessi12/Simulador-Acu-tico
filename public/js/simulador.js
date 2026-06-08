// ========== TIMER Y FULLSCREEN ==========

let timer = document.getElementById("timer");
let seconds = 0;
let interval = null;

function updateTimer() {
    seconds++;
    let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    let secs = String(seconds % 60).padStart(2, '0');
    if (timer) timer.textContent = `${hrs}:${mins}:${secs}`;
}

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

if (startBtn) {
    startBtn.onclick = () => {
        if (!interval) interval = setInterval(updateTimer, 1000);
    };
}

if (pauseBtn) {
    pauseBtn.onclick = () => {
        clearInterval(interval);
        interval = null;
    };
}

if (resetBtn) {
    resetBtn.onclick = () => {
        clearInterval(interval);
        interval = null;
        seconds = 0;
        if (timer) timer.textContent = "00:00:00";
    };
}

let expandBtn = document.getElementById("expandBtn");
let closeBtn = document.getElementById("closeFullscreen");
let simulator = document.querySelector(".simulator");

if (expandBtn) {
    expandBtn.onclick = () => {
        if (simulator && !document.fullscreenElement) {
            simulator.requestFullscreen();
        }
    };
}

if (closeBtn) {
    closeBtn.onclick = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    };
}

document.addEventListener("fullscreenchange", () => {
    if (simulator) {
        if (document.fullscreenElement) {
            simulator.classList.add("fullscreen-active");
        } else {
            simulator.classList.remove("fullscreen-active");
        }
    }
});

// ========== PUENTE GODOT (variables globales) ==========

// Inicializar variables globales que Godot leerá
window.godot_temperature = 24;
window.godot_salinity = 35;
window.godot_oxygen = 6;

function inicializarControles() {
    console.log("🎮 Buscando sliders...");
    
    // Temperatura
    const tempSlider = document.getElementById('tempSlider');
    const tempVal = document.getElementById('tempVal');
    
    if (tempSlider) {
        tempSlider.addEventListener('input', function(e) {
            const val = parseFloat(e.target.value);
            if (tempVal) tempVal.textContent = val;
            window.godot_temperature = val;
            console.log('📤 Temperatura actualizada:', val);
        });
        console.log("✅ Slider temperatura configurado");
    } else {
        console.log("❌ Slider temperatura NO encontrado");
    }
    
    // Salinidad
    const salSlider = document.getElementById('salSlider');
    const salVal = document.getElementById('salVal');
    
    if (salSlider) {
        salSlider.addEventListener('input', function(e) {
            const val = parseFloat(e.target.value);
            if (salVal) salVal.textContent = val;
            window.godot_salinity = val;
            console.log('📤 Salinidad actualizada:', val);
        });
        console.log("✅ Slider salinidad configurado");
    } else {
        console.log("❌ Slider salinidad NO encontrado");
    }
    
    // Oxígeno
    const oxSlider = document.getElementById('oxSlider');
    const oxVal = document.getElementById('oxVal');
    
    if (oxSlider) {
        oxSlider.addEventListener('input', function(e) {
            const val = parseFloat(e.target.value);
            if (oxVal) oxVal.textContent = val;
            window.godot_oxygen = val;
            console.log('📤 Oxígeno actualizado:', val);
        });
        console.log("✅ Slider oxígeno configurado");
    } else {
        console.log("❌ Slider oxígeno NO encontrado");
    }
    
    console.log('🎮 Controles inicializados');
}

// Función para actualizar alertas (opcional)
function actualizarAlertas(temperatura, salinidad, oxigeno) {
    const alertsContainer = document.querySelector('.card.alerts');
    if (!alertsContainer) return;
    
    alertsContainer.innerHTML = '';
    let alertasActivas = false;
    
    if (temperatura < 22 || temperatura > 28) {
        alertsContainer.innerHTML += '<p class="warning">⚠️ Temperatura fuera de rango óptimo</p>';
        alertasActivas = true;
    }
    
    if (salinidad < 32 || salinidad > 38) {
        alertsContainer.innerHTML += '<p class="warning">⚠️ Salinidad fuera de rango óptimo</p>';
        alertasActivas = true;
    }
    
    if (oxigeno < 5 || oxigeno > 8) {
        alertsContainer.innerHTML += '<p class="warning">⚠️ Nivel de oxígeno fuera de rango</p>';
        alertasActivas = true;
    }
    
    if (!alertasActivas) {
        alertsContainer.innerHTML = '<p class="ok">✔ Todos los parámetros en rango óptimo</p>';
    }
}

// ========== INICIAR GODOT ==========

var canvas = (function() {
    var container = document.getElementById("godot-canvas");
    if (container && container.tagName !== "CANVAS") {
        var c = document.createElement("canvas");
        c.id = "canvas";
        container.appendChild(c);
        return c;
    }
    return container;
})();

function startGodot() {
    console.log("Engine =", typeof Engine);
    if (typeof Engine !== 'undefined' && Engine) {
        var engine = new Engine(canvas);
        
        engine.startGame({
            executable: "index",
            mainPack: "index.pck",
            canvasResizePolicy: 2,
            locale: "en",
            args: []
        }).then(function() {
            console.log("✅ Godot iniciado correctamente");
        }).catch(function(error) {
            console.error("❌ Error iniciando Godot:", error);
        });
    } else {
        console.log("⏳ Esperando Engine...");
        setTimeout(startGodot, 100);
    }
}

// ========== EJECUTAR TODO ==========

// Inicializar controles inmediatamente
console.log('🚀 Inicializando controles...');
inicializarControles();

// Iniciar Godot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM listo, iniciando Godot...");
    startGodot();
});