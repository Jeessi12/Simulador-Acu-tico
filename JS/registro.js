document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form');
    const formWrapper = document.querySelector('.form-wrapper');
    const switchToLogin = document.getElementById('switch-to-login');
    const navLoginBtn = document.getElementById('nav-login-btn');
    
    
    function registerUser(username, email, password) {
       
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            return { success: false, message: 'El email ya está registrado' };
        }

        const usernameExists = users.some(user => user.username === username);
        if (usernameExists) {
            return { success: false, message: 'El nombre de usuario ya está en uso' };
        }
        

        users.push({ 
            username: username, 
            email: email, 
            password: password,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
        
        return { success: true, message: 'Usuario registrado exitosamente' };
    }
    
  
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
          
            x = canvas.width * 0.5 + Math.random() * canvas.width * 0.5;
        } else if (rand < 0.75) {

            x = canvas.width * 0.35 + Math.random() * canvas.width * 0.3;
        } else {
          
            x = Math.random() * canvas.width * 0.35;
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
    

    function animateAndRedirect(url) {
        formWrapper.classList.add('exit-animation');
        setTimeout(function() {
            window.location.href = url;
        }, 500);
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            animateAndRedirect('login.html');
        });
    }
    
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            animateAndRedirect('login.html');
        });
    }
    

    if (registerForm) {
        const regEmail = document.getElementById('reg-email');
        const regUsername = document.getElementById('reg-username');
        const regPassword = document.getElementById('reg-password');
        const regConfirm = document.getElementById('reg-confirm');
        
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        function validatePasswords() {
            if (regPassword.value !== regConfirm.value) {
                regConfirm.style.borderBottom = '1px solid #ff6b6b';
                return false;
            } else {
                regConfirm.style.borderBottom = 'none';
                return true;
            }
        }
        
   
        if (regEmail) {
            regEmail.addEventListener('input', function() {
                if (this.value && !validateEmail(this.value)) {
                    this.style.borderBottom = '1px solid #ff6b6b';
                } else {
                    this.style.borderBottom = 'none';
                }
            });
        }
        
        if (regUsername) {
            regUsername.addEventListener('input', function() {
                if (this.value.length < 3 && this.value.length > 0) {
                    this.style.borderBottom = '1px solid #ff6b6b';
                } else {
                    this.style.borderBottom = 'none';
                }
            });
        }
        
        if (regPassword) {
            regPassword.addEventListener('input', function() {
                if (regConfirm.value) validatePasswords();
                if (this.value.length > 0 && this.value.length < 6) {
                    this.style.borderBottom = '1px solid #ff6b6b';
                } else {
                    this.style.borderBottom = 'none';
                }
            });
        }
        
        if (regConfirm) {
            regConfirm.addEventListener('input', validatePasswords);
        }
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            let errorMessage = '';
            
            if (!validateEmail(regEmail.value)) {
                isValid = false;
                errorMessage = 'Por favor, ingresa un email válido';
                regEmail.style.borderBottom = '1px solid #ff6b6b';
            } else if (regUsername.value.length < 3) {
                isValid = false;
                errorMessage = 'El nombre de usuario debe tener al menos 3 caracteres';
                regUsername.style.borderBottom = '1px solid #ff6b6b';
            } else if (regPassword.value.length < 6) {
                isValid = false;
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                regPassword.style.borderBottom = '1px solid #ff6b6b';
            } else if (regPassword.value !== regConfirm.value) {
                isValid = false;
                errorMessage = 'Las contraseñas no coinciden';
                regConfirm.style.borderBottom = '1px solid #ff6b6b';
            }
            
            if (isValid) {
            
                const result = registerUser(regUsername.value, regEmail.value, regPassword.value);
                
                if (result.success) {
                    showMessage(result.message + ' Redirigiendo al login...', 'success', registerForm);
                    setTimeout(function() {
                        animateAndRedirect('login.html');
                    }, 1500);
                } else {
                    showMessage(result.message, 'error', registerForm);
                }
            } else {
                showMessage(errorMessage, 'error', registerForm);
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
            z-index: 100;
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