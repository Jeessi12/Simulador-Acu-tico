document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const formWrapper = document.querySelector('.form-wrapper');
    const switchToRegister = document.getElementById('switch-to-register');
    
    // Bubble animation centralized in ../JS/burbujas.js — removed duplicate implementation here.
    

    function loginUser(username) {
        localStorage.setItem('userSession', 'true');
        localStorage.setItem('currentUser', username);
    }
    

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