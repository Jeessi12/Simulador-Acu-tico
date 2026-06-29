(function () {
    const storageKey = 'blueEcoThemeManual';

    function setTheme(isDark) {
        document.documentElement.classList.toggle('dark-mode', isDark);
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
        updateButtons(isDark);
    }

    function updateButtons(isDark) {
        document.querySelectorAll('#darkModeBtn, .theme-toggle').forEach((button) => {
            const icon = button.querySelector('i');
            button.setAttribute('aria-pressed', String(isDark));
            button.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
            button.setAttribute('title', isDark ? 'Modo claro' : 'Modo oscuro');

            if (icon) {
                icon.classList.toggle('fa-moon', !isDark);
                icon.classList.toggle('fa-sun', isDark);
            }
        });
    }

    function getInitialTheme() {
        const savedTheme = localStorage.getItem(storageKey);
        if (savedTheme) return savedTheme === 'dark';
        return false;
    }

    function initThemeToggle() {
        const isDark = getInitialTheme();
        document.documentElement.classList.toggle('dark-mode', isDark);
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
        document.body.classList.toggle('dark-mode', isDark);
        updateButtons(isDark);

        document.querySelectorAll('#darkModeBtn, .theme-toggle').forEach((button) => {
            if (button.dataset.themeReady === 'true') return;
            button.dataset.themeReady = 'true';
            button.addEventListener('click', () => {
                setTheme(!document.documentElement.classList.contains('dark-mode'));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }
})();
