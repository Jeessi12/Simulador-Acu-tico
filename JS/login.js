document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const formWrapper = document.querySelector('.form-wrapper');
    const switchToRegister = document.getElementById('switch-to-register');
    const navRegisterBtn = document.getElementById('nav-register-btn');
    
    // ========== BURBUJAS ==========
    const canvas = document.getElementById('bubblesCanvas');
    const ctx = canvas.getContext('2d');
    
    let mouse = { x: null, y: null };
    let lastMouse = { x: null, y: null };
    let mouseSpeed = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('mousemove', (e) => {
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        if (lastMouse.x !== null && lastMouse.y !== null) {
            const dx = mouse.x - lastMouse.x;
            const dy = mouse.y - lastMouse.y;
            mouseSpeed = Math.sqrt(dx * dx + dy * dy);
        }
    });
    
    let particles = [];
    
    function createParticle() {
        let size = Math.random() * 6 + 4;
        let x;
        let rand = Math.random();
        if (rand < 0.5) {
            x = Math.random() * canvas.width * 0.5;
        } else if (rand < 0.75) {
            x = canvas.width * 0.35 + Math.random() * canvas.width * 0.3;
        } else {
            x = canvas.width * 0.65 + Math.random() * canvas.width * 0.35;
        }
        
        return {
            x: x,
            y: Math.random() * canvas.height,
            r: size,
            baseR: size,
            speed: Math.random() * 0.8 + 0.3,
            dx: (Math.random() - 0.5) * 0.5,
            popping: false,
            popSize: 0
        };
    }
    
    for (let i = 0; i < 60; i++) {
        particles.push(createParticle());
    }
    
    function drawBubble(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x - p.r / 3, p.y - p.r / 3, p.r / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
    }
    
    function drawPop(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.popSize, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        if (p.popSize > p.r) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.popSize - 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.stroke();
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            if (!p.popping) {
                p.y -= p.speed;
                p.x += p.dx;
                
                if (p.y < 0) {
                    particles[i] = createParticle();
                }
                
                if (p.x > canvas.width + 50) p.x = -50;
                if (p.x < -50) p.x = canvas.width + 50;
                
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = p.x - mouse.x;
                    let dy = p.y - mouse.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120 && mouseSpeed > 5) {
                        p.r = p.baseR + 3;
                        let angle = Math.atan2(dy, dx);
                        p.x += Math.cos(angle) * 3;
                        p.y += Math.sin(angle) * 3;
                    } else {
                        p.r = p.baseR;
                    }
                    
                    if (dist < 50 && mouseSpeed > 8) {
                        p.popping = true;
                    }
                } else {
                    p.r = p.baseR;
                }
                
                drawBubble(p);
            } else {
                p.popSize += 3.5;
                drawPop(p);
                if (p.popSize > p.r * 2.5) {
                    particles[i] = createParticle();
                }
            }
        });
        
        mouseSpeed *= 0.95;
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // ========== FUNCIONES DE SESIÓN ==========
    function loginUser(username) {
        localStorage.setItem('userSession', 'true');
        localStorage.setItem('currentUser', username);
    }
    
    // ========== ANIMACIÓN DE SALIDA ==========
    function animateAndRedirect(url) {
        formWrapper.classList.add('exit-animation');
        setTimeout(function() {
            window.location.href = url;
        }, 500);
    }
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            animateAndRedirect('registro.html');
        });
    }
    
    if (navRegisterBtn) {
        navRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            animateAndRedirect('registro.html');
        });
    }
    
    // ========== VALIDACIONES ==========
    if (loginForm) {
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');
        
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        if (loginEmail) {
            loginEmail.addEventListener('input', function() {
                if (this.value && !validateEmail(this.value)) {
                    this.style.borderBottom = '1px solid #ff6b6b';
                } else {
                    this.style.borderBottom = 'none';
                }
            });
        }
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            let errorMessage = '';
            
            if (!validateEmail(loginEmail.value)) {
                isValid = false;
                errorMessage = 'Por favor, ingresa un email válido';
                loginEmail.style.borderBottom = '1px solid #ff6b6b';
            } else {
                loginEmail.style.borderBottom = 'none';
            }
            
            if (loginPassword.value.length < 6) {
                isValid = false;
                errorMessage = errorMessage || 'La contraseña debe tener al menos 6 caracteres';
                loginPassword.style.borderBottom = '1px solid #ff6b6b';
            } else {
                loginPassword.style.borderBottom = 'none';
            }
            
            if (isValid) {
                // INICIAR SESIÓN - Guardar en localStorage
                const username = loginEmail.value.split('@')[0];
                loginUser(username);
                
                showMessage('Inicio de sesión exitoso! Redirigiendo...', 'success', loginForm);
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showMessage(errorMessage, 'error', loginForm);
            }
        });
    }
    
    function showMessage(message, type, form) {
        const oldMsg = form.querySelector('.form-message');
        if (oldMsg) oldMsg.remove();
        
        const msgDiv = document.createElement('div');
        msgDiv.className = 'form-message';
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            margin-top: 20px;
            padding: 12px;
            border-radius: 10px;
            font-size: 13px;
            text-align: center;
            background: ${type === 'success' ? 'rgba(56, 161, 105, 0.9)' : 'rgba(229, 62, 62, 0.9)'};
            color: white;
            backdrop-filter: blur(5px);
            animation: fadeIn 0.3s ease;
        `;
        
        form.appendChild(msgDiv);
        
        setTimeout(function() {
            msgDiv.style.opacity = '0';
            setTimeout(function() { msgDiv.remove(); }, 300);
        }, 3000);
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);