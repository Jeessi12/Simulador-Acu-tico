let timer = document.getElementById("timer");

let seconds = 0;
let interval = null;

function updateTimer() {
    seconds++;

    let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    let secs = String(seconds % 60).padStart(2, '0');

    timer.textContent = `${hrs}:${mins}:${secs}`;
}

document.getElementById("start").onclick = () => {
    if (!interval) interval = setInterval(updateTimer, 1000);
};

document.getElementById("pause").onclick = () => {
    clearInterval(interval);
    interval = null;
};

document.getElementById("reset").onclick = () => {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    timer.textContent = "00:00:00";
};

let expandBtn = document.getElementById("expandBtn");
let closeBtn = document.getElementById("closeFullscreen");
let simulator = document.querySelector(".simulator");

/* ENTRAR FULLSCREEN */
expandBtn.onclick = () => {
    if (!document.fullscreenElement) {
        simulator.requestFullscreen();
    }
};

/* SALIR FULLSCREEN */
closeBtn.onclick = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
};

/* CONTROL VISUAL DEL BOTÓN */
document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        simulator.classList.add("fullscreen-active");
    } else {
        simulator.classList.remove("fullscreen-active");
    }
});

