document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('.register-form');
    const formWrapper  = document.querySelector('.form-wrapper');
    const roleInput    = document.getElementById('roleInput');
    const rolError     = document.getElementById('rolError');

    // ── Animación salida ─────────────────────────────────────────────────
    function animateAndRedirect(url) {
        if (formWrapper) formWrapper.classList.add('exit-animation');
        setTimeout(() => { window.location.href = url; }, 500);
    }

    const switchToLogin = document.getElementById('switch-to-login');
    const navLoginBtn   = document.getElementById('nav-login-btn');

    if (switchToLogin) {
        switchToLogin.addEventListener('click', e => {
            e.preventDefault();
            animateAndRedirect('login.php');
        });
    }
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', e => {
            e.preventDefault();
            animateAndRedirect('login.php');
        });
    }

    // ── Selección de rol ─────────────────────────────────────────────────
    // Usamos mousedown en vez de click para evitar que el blur de inputs interfiera
    document.querySelectorAll('.rol-opcion').forEach(opcion => {
        opcion.addEventListener('mousedown', function (e) {
            e.preventDefault(); // evita que el foco cambie y cause re-render
            document.querySelectorAll('.rol-opcion').forEach(o => o.classList.remove('seleccionado'));
            this.classList.add('seleccionado');
            roleInput.value = this.dataset.rol;
            if (rolError) rolError.classList.remove('visible');
        });
    });

    // ── Validaciones ─────────────────────────────────────────────────────
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showMessage(message, type) {
        const oldMsg = registerForm.querySelector('.form-message');
        if (oldMsg) oldMsg.remove();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'form-message';
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            margin-top: 20px; padding: 12px; border-radius: 10px;
            font-size: 13px; text-align: center;
            background: ${type === 'success' ? 'rgba(56,161,105,0.9)' : 'rgba(229,62,62,0.9)'};
            color: white; animation: fadeIn 0.3s ease;
        `;
        registerForm.appendChild(msgDiv);
        setTimeout(() => {
            msgDiv.style.opacity = '0';
            setTimeout(() => msgDiv.remove(), 300);
        }, 3000);
    }

    // ── Submit ────────────────────────────────────────────────────────────
    if (registerForm) {
        const regEmail    = document.getElementById('reg-email');
        const regUsername = document.getElementById('reg-username');
        const regPassword = document.getElementById('reg-password');
        const regConfirm  = document.getElementById('reg-confirm');

        registerForm.addEventListener('submit', function (e) {
            let valido = true;

            if (!validateEmail(regEmail.value)) {
                regEmail.style.borderBottom = '1px solid #ff6b6b';
                showMessage('Por favor, ingresa un email válido', 'error');
                valido = false;
            } else if (regUsername.value.length < 3) {
                regUsername.style.borderBottom = '1px solid #ff6b6b';
                showMessage('El usuario debe tener al menos 3 caracteres', 'error');
                valido = false;
            } else if (regPassword.value.length < 6) {
                regPassword.style.borderBottom = '1px solid #ff6b6b';
                showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
                valido = false;
            } else if (regPassword.value !== regConfirm.value) {
                regConfirm.style.borderBottom = '1px solid #ff6b6b';
                showMessage('Las contraseñas no coinciden', 'error');
                valido = false;
            }

            if (!roleInput.value) {
                if (rolError) rolError.classList.add('visible');
                showMessage('Selecciona un tipo de cuenta', 'error');
                valido = false;
            }

            if (!valido) e.preventDefault();
        });

        regEmail?.addEventListener('input', function () {
            this.style.borderBottom = validateEmail(this.value) ? 'none' : '1px solid #ff6b6b';
        });
        regUsername?.addEventListener('input', function () {
            this.style.borderBottom = this.value.length >= 3 ? 'none' : '1px solid #ff6b6b';
        });
        regPassword?.addEventListener('input', function () {
            this.style.borderBottom = this.value.length >= 6 ? 'none' : '1px solid #ff6b6b';
        });
        regConfirm?.addEventListener('input', function () {
            this.style.borderBottom = this.value === regPassword.value ? 'none' : '1px solid #ff6b6b';
        });
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to   { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);