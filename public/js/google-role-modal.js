document.addEventListener('DOMContentLoaded', function () {
    const googleBtn = document.getElementById('google-login-btn');
    const modal = document.getElementById('google-role-modal');
    const closeBtn = document.getElementById('close-google-modal');
    const roleCards = document.querySelectorAll('#google-role-modal .role-card');

    if (googleBtn && modal) {
        googleBtn.addEventListener('click', function () {
            modal.classList.add('visible');
            modal.setAttribute('aria-hidden', 'false');
        });

        closeBtn.addEventListener('click', function () {
            modal.classList.remove('visible');
            modal.setAttribute('aria-hidden', 'true');
        });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('visible');
                modal.setAttribute('aria-hidden', 'true');
            }
        });

        roleCards.forEach(function (card) {
            card.addEventListener('click', function () {
                const rol = this.dataset.role;
                window.location.href = 'google-login.php?rol=' + rol;
            });
        });
    }
});