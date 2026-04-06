// ================= PARTICLES HERO =================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const popSound = document.getElementById('popSound');

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

let particles = [];

function createParticle(){
    let size = Math.random()*6 + 4;
    return {
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: size,
        baseR: size,
        speed: Math.random()*0.8 + 0.3,
        dx: (Math.random()-0.5)*0.5,
        popping: false,
        popSize: 0
    };
}

for(let i=0;i<70;i++){
    particles.push(createParticle());
}

function drawBubble(p){
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p.x - p.r/3, p.y - p.r/3, p.r/4, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
}

function drawPop(p){
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.popSize, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach((p, i) => {

        if(!p.popping){

            p.y -= p.speed;
            p.x += p.dx;

            if(p.y < 0){
                particles[i] = createParticle();
            }

            if(mouse.x && mouse.y){
                let dx = p.x - mouse.x;
                let dy = p.y - mouse.y;
                let dist = Math.sqrt(dx*dx + dy*dy);

                if(dist < 120){
                    p.r = p.baseR + 3;
                    p.x += dx * 0.02;
                    p.y += dy * 0.02;
                } else {
                    p.r = p.baseR;
                }

                if(dist < 50){
                    p.popping = true;

                    if(popSound){
                        popSound.currentTime = 0;
                        popSound.play();
                    }
                }
            }

            drawBubble(p);

        } else {

            p.popSize += 3;
            drawPop(p);

            if(p.popSize > p.r * 2){
                particles[i] = createParticle();
            }
        }
    });

    requestAnimationFrame(animate);
}

animate();


// ================= NAVBAR =================
window.addEventListener("scroll", function(){
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ================= PARTICLES SPECIES =================
const canvasS = document.getElementById('particlesSpecies');
const ctxS = canvasS.getContext('2d');

function resizeCanvasS(){
    canvasS.width = canvasS.offsetWidth;
    canvasS.height = canvasS.offsetHeight;
}
resizeCanvasS();
window.addEventListener('resize', resizeCanvasS);

let mouseS = { x: null, y: null };

const speciesSection = document.querySelector('.eco-section');

speciesSection.addEventListener('mousemove', (e)=>{
    const rect = canvasS.getBoundingClientRect();
    mouseS.x = e.clientX - rect.left;
    mouseS.y = e.clientY - rect.top;
});

speciesSection.addEventListener('mouseleave', ()=>{
    mouseS.x = null;
    mouseS.y = null;
});

let particlesS = [];

function createParticleS(){
    let size = Math.random()*6 + 4;
    return {
        x: Math.random()*canvasS.width,
        y: Math.random()*canvasS.height,
        r: size,
        baseR: size,
        speed: Math.random()*0.8 + 0.3,
        dx: (Math.random()-0.5)*0.5,
        popping: false,
        popSize: 0
    };
}

for(let i=0;i<60;i++){
    particlesS.push(createParticleS());
}

function drawBubbleS(p){
    ctxS.beginPath();
    ctxS.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctxS.fillStyle = 'rgba(255,255,255,0.2)';
    ctxS.fill();

    ctxS.strokeStyle = 'rgba(255,255,255,0.6)';
    ctxS.stroke();

    ctxS.beginPath();
    ctxS.arc(p.x - p.r/3, p.y - p.r/3, p.r/4, 0, Math.PI*2);
    ctxS.fillStyle = 'rgba(255,255,255,0.7)';
    ctxS.fill();
}

function drawPopS(p){
    ctxS.beginPath();
    ctxS.arc(p.x, p.y, p.popSize, 0, Math.PI*2);
    ctxS.strokeStyle = 'rgba(255,255,255,0.5)';
    ctxS.lineWidth = 2;
    ctxS.stroke();
}

function animateS(){
    ctxS.clearRect(0,0,canvasS.width,canvasS.height);

    particlesS.forEach((p, i) => {

        if(!p.popping){

            p.y -= p.speed;
            p.x += p.dx;

            if(p.y < 0){
                particlesS[i] = createParticleS();
                particlesS[i].y = canvasS.height;
            }

            if(mouseS.x && mouseS.y){
                let dx = p.x - mouseS.x;
                let dy = p.y - mouseS.y;
                let dist = Math.sqrt(dx*dx + dy*dy);

                if(dist < 120){
                    p.r = p.baseR + 3;
                    p.x += dx * 0.02;
                    p.y += dy * 0.02;
                } else {
                    p.r = p.baseR;
                }

                if(dist < 50){
                    p.popping = true;
                }
            }

            drawBubbleS(p);

        } else {

            p.popSize += 3;
            drawPopS(p);

            if(p.popSize > p.r * 2){
                particlesS[i] = createParticleS();
            }
        }
    });

    requestAnimationFrame(animateS);
}

animateS();