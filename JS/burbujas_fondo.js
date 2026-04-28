document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const bubbles = [];
    const NUM = 60;

    for (let i = 0; i < NUM; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 100,
            r: Math.random() * 10 + 3,   // Tamaño reducido: entre 3 y 13 píxeles
            speed: Math.random() * 0.6 + 0.2,
            opacity: Math.random() * 0.25 + 0.1
        });
    }

    function drawBubble(b) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
        ctx.fill();
        // Brillo característico (borde sutil)
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * 2.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // Puntito de luz (igual que en el index)
        ctx.beginPath();
        ctx.arc(b.x - b.r/3, b.y - b.r/3, b.r/4, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 1.5})`;
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let b of bubbles) {
            b.y -= b.speed;
            if (b.y + b.r < 0) {
                b.y = canvas.height + b.r;
                b.x = Math.random() * canvas.width;
            }
            drawBubble(b);
        }
        requestAnimationFrame(animate);
    }
    animate();
});