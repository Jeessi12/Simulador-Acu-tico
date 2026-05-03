document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form');
    const formWrapper = document.querySelector('.form-wrapper');
    const switchToLogin = document.getElementById('switch-to-login');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const openRoleModalBtn = document.getElementById('open-role-modal');
    const roleModal = document.getElementById('role-modal');
    const closeRoleModalBtn = document.getElementById('close-role-modal');
    const roleCards = document.querySelectorAll('.role-card');
    const roleInput = document.getElementById('roleInput');

    function animateAndRedirect(url) {
        if (formWrapper) {
            formWrapper.classList.add('exit-animation');
        }
        setTimeout(function() {
            window.location.href = url;
        }, 500);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
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

    function openRoleModal() {
        if (!roleModal) return;
        roleModal.classList.add('visible');
        roleModal.setAttribute('aria-hidden', 'false');
    }

    function closeRoleModal() {
        if (!roleModal) return;
        roleModal.classList.remove('visible');
        roleModal.setAttribute('aria-hidden', 'true');
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            animateAndRedirect('login.php');
        });
    }

    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            animateAndRedirect('login.php');
        });
    }

    if (registerForm) {
        const regEmail = document.getElementById('reg-email');
        const regUsername = document.getElementById('reg-username');
        const regPassword = document.getElementById('reg-password');
        const regConfirm = document.getElementById('reg-confirm');

        function validatePasswords() {
            if (!regPassword || !regConfirm) return false;
            if (regPassword.value !== regConfirm.value) {
                regConfirm.style.borderBottom = '1px solid #ff6b6b';
                return false;
            }
            regConfirm.style.borderBottom = 'none';
            return true;
        }

        function validateFormFields() {
            if (!regEmail || !regUsername || !regPassword || !regConfirm) {
                return false;
            }

            if (!validateEmail(regEmail.value)) {
                regEmail.style.borderBottom = '1px solid #ff6b6b';
                showMessage('Por favor, ingresa un email válido', 'error', registerForm);
                return false;
            }

            if (regUsername.value.length < 3) {
                regUsername.style.borderBottom = '1px solid #ff6b6b';
                showMessage('El nombre de usuario debe tener al menos 3 caracteres', 'error', registerForm);
                return false;
            }

            if (regPassword.value.length < 6) {
                regPassword.style.borderBottom = '1px solid #ff6b6b';
                showMessage('La contraseña debe tener al menos 6 caracteres', 'error', registerForm);
                return false;
            }

            if (!validatePasswords()) {
                showMessage('Las contraseñas no coinciden', 'error', registerForm);
                return false;
            }

            return true;
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

        if (openRoleModalBtn) {
            openRoleModalBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (validateFormFields()) {
                    openRoleModal();
                }
            });
        }

        if (closeRoleModalBtn) {
            closeRoleModalBtn.addEventListener('click', closeRoleModal);
        }

        if (roleModal) {
            roleModal.addEventListener('click', function(event) {
                if (event.target === roleModal) {
                    closeRoleModal();
                }
            });
        }

        if (roleCards) {
            roleCards.forEach(function(card) {
                card.addEventListener('click', function() {
                    if (roleInput) {
                        roleInput.value = this.dataset.role;
                        registerForm.submit();
                    }
                });
            });
        }

        registerForm.addEventListener('submit', function(e) {
            if (!roleInput || !roleInput.value) {
                e.preventDefault();
                if (validateFormFields()) {
                    openRoleModal();
                }
            }
        });
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