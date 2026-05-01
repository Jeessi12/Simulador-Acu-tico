function isLoggedIn() {
    return localStorage.getItem('userSession') === 'true';
}


function getCurrentUser() {
    return localStorage.getItem('currentUser');
}


function loginUser(username) {
    localStorage.setItem('userSession', 'true');
    localStorage.setItem('currentUser', username);
    updateNavbarButtons();
}

function logoutUser() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('currentUser');
    updateNavbarButtons();

    showLogoutMessage();

    setTimeout(function() {
        window.location.href = 'login.html';
    }, 1500);
}

function updateNavbarButtons() {
    const authButtons = document.getElementById('authButtons');
    const userButtons = document.getElementById('userButtons');
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (isLoggedIn()) {
        if (authButtons) authButtons.style.display = 'none';
        if (userButtons) userButtons.style.display = 'flex';

        if (userNameDisplay) {
            userNameDisplay.textContent = `👤 ${getCurrentUser()}`;
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userButtons) userButtons.style.display = 'none';
    }
}


function initSessionUI() {
    updateNavbarButtons();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
}

function showLogoutMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'logout-message';
    messageDiv.innerHTML = `
        <i class="fas fa-sign-out-alt"></i>
        <span>¡Sesión cerrada exitosamente!</span>
        <span class="redirect-text">Redirigiendo al login...</span>
    `;

    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(59, 91, 140, 0.95);
        color: white;
        padding: 20px 35px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        font-weight: 500;
        z-index: 2000;
        animation: fadeInScale 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
        text-align: center;
    `;

    const redirectText = messageDiv.querySelector('.redirect-text');
    redirectText.style.cssText = `
        font-size: 12px;
        opacity: 0.8;
        margin-top: 5px;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(function() {
        messageDiv.style.animation = 'fadeOutScale 0.3s ease';
        setTimeout(function() {
            messageDiv.remove();
        }, 300);
    }, 1500);
}


const logoutStyles = document.createElement('style');
logoutStyles.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }

    @keyframes fadeOutScale {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }

    .user-name {
        color: #30343a;
        font-size: 14px;
        font-weight: 600;
        margin-right: 10px;
        padding: 8px 12px;
        background: rgba(59, 91, 140, 0.1);
        border-radius: 20px;
    }

    .btn-logout {
        background: #dc2626;
        color: white;
        padding: 8px 16px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .btn-logout:hover {
        background: #b91c1c;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }

    .user-buttons {
        display: flex;
        align-items: center;
        gap: 15px;
    }
`;
document.head.appendChild(logoutStyles);