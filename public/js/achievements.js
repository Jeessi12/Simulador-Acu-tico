(function () {
    'use strict';

    const DISPLAY_TIME = 6500;
    const queued = [];
    let showing = false;

    function iconNode(icon, title) {
        if (typeof icon === 'string' && /^(?:\/|https?:\/\/)/i.test(icon)) {
            const image = document.createElement('img');
            image.src = icon;
            image.alt = '';
            image.loading = 'lazy';
            return image;
        }

        const symbol = document.createElement('span');
        symbol.textContent = icon || '🏆';
        symbol.setAttribute('role', 'img');
        symbol.setAttribute('aria-label', title || 'Logro');
        return symbol;
    }

    function buildToast(achievement) {
        const toast = document.createElement('article');
        toast.className = 'achievement-toast';
        toast.setAttribute('role', 'status');

        const glow = document.createElement('span');
        glow.className = 'achievement-toast__glow';
        glow.setAttribute('aria-hidden', 'true');

        const icon = document.createElement('div');
        icon.className = 'achievement-toast__icon';
        icon.appendChild(iconNode(achievement.icon, achievement.title));

        const copy = document.createElement('div');
        copy.className = 'achievement-toast__copy';
        const eyebrow = document.createElement('span');
        eyebrow.className = 'achievement-toast__eyebrow';
        eyebrow.textContent = 'Logro desbloqueado';
        const title = document.createElement('strong');
        title.textContent = achievement.title || 'Nuevo logro';
        const message = document.createElement('p');
        message.textContent = achievement.message || '¡Tu esfuerzo ha dado frutos!';
        const meta = document.createElement('span');
        meta.className = 'achievement-toast__meta';
        meta.textContent = `${achievement.level || 'Bronze'} · +${Number(achievement.xp) || 0} XP`;
        copy.append(eyebrow, title, message, meta);

        const close = document.createElement('button');
        close.className = 'achievement-toast__close';
        close.type = 'button';
        close.setAttribute('aria-label', 'Cerrar notificación');
        close.textContent = '×';

        toast.append(glow, icon, copy, close);
        return { toast, close };
    }

    function showNext() {
        const region = document.getElementById('achievement-toast-region');
        if (showing || queued.length === 0 || !region) return;

        showing = true;
        const achievement = queued.shift();
        const { toast, close } = buildToast(achievement);
        region.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('is-visible'));
        let timer = window.setTimeout(dismiss, DISPLAY_TIME);

        function dismiss() {
            window.clearTimeout(timer);
            toast.classList.remove('is-visible');
            toast.classList.add('is-leaving');
            window.setTimeout(() => {
                toast.remove();
                showing = false;
                showNext();
            }, 380);
        }

        close.addEventListener('click', dismiss, { once: true });
        toast.addEventListener('mouseenter', () => window.clearTimeout(timer));
        toast.addEventListener('mouseleave', () => {
            timer = window.setTimeout(dismiss, 2200);
        });
    }

    function showAll(items) {
        if (!Array.isArray(items)) return;
        items.filter(Boolean).forEach((item) => queued.push(item));
        showNext();
    }

    window.BlueEcoAchievements = { showAll };
    window.addEventListener('blueeco:achievements-unlocked', (event) => {
        showAll(event.detail);
    });

    document.addEventListener('DOMContentLoaded', () => {
        const data = document.getElementById('achievement-pending-data');
        if (!data) return;
        try {
            showAll(JSON.parse(data.textContent || '[]'));
        } catch (error) {
            console.warn('No se pudieron mostrar las notificaciones de logros.', error);
        }
    });
})();
