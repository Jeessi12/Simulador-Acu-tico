(function () {
    'use strict';

    const modal = document.getElementById('authGate');
    if (!modal) return;

    const dialog = modal.querySelector('.auth-gate__dialog');
    const featureLabel = modal.querySelector('[data-auth-feature-label]');
    const closeButton = modal.querySelector('.auth-gate__close');
    const protectedPages = new Set([
        'admin.php',
        'asignaciones.php',
        'especies.php',
        'espacios.php',
        'perfilUsuario.php',
        'simulador.php',
        'simuladores.php'
    ]);
    const pageLabels = {
        'admin.php': 'la administración',
        'asignaciones.php': 'las asignaciones',
        'especies.php': 'el catálogo de especies',
        'espacios.php': 'los espacios educativos',
        'perfilUsuario.php': 'tu perfil',
        'simulador.php': 'el simulador',
        'simuladores.php': 'las simulaciones'
    };
    const focusableSelector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    let triggerElement = null;
    let isOpen = false;
    let closeTimer = null;

    function getPageName(url) {
        try {
            const parsedUrl = new URL(url, window.location.href);
            if (parsedUrl.origin !== window.location.origin) return '';
            return parsedUrl.pathname.split('/').pop() || '';
        } catch (error) {
            return '';
        }
    }

    function isProtectedTrigger(element) {
        if (!element || element.matches('[data-auth-modal-close]')) return false;
        if (element.matches('[data-requires-auth="true"], [data-auth-required="true"]')) return true;
        if (element.tagName !== 'A' || !element.hasAttribute('href')) return false;
        return protectedPages.has(getPageName(element.getAttribute('href')));
    }

    function getFeatureName(element) {
        const customLabel = element.dataset.authFeature;
        if (customLabel && customLabel.trim()) return customLabel.trim();
        if (element.tagName === 'A') {
            return pageLabels[getPageName(element.getAttribute('href'))] || 'este apartado';
        }
        return 'esta función';
    }

    function openModal(trigger, featureName) {
        if (closeTimer !== null) {
            window.clearTimeout(closeTimer);
            closeTimer = null;
        }
        triggerElement = trigger || document.activeElement;
        featureLabel.textContent = featureName || getFeatureName(triggerElement);
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('auth-gate-open');
        isOpen = true;

        window.requestAnimationFrame(function () {
            modal.classList.add('is-visible');
            closeButton.focus();
        });
    }

    function closeModal() {
        if (!isOpen) return;

        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('auth-gate-open');
        isOpen = false;

        closeTimer = window.setTimeout(function () {
            modal.hidden = true;
            if (triggerElement && document.contains(triggerElement)) {
                triggerElement.focus({ preventScroll: true });
            }
            triggerElement = null;
            closeTimer = null;
        }, 220);
    }

    function trapFocus(event) {
        if (!isOpen || event.key !== 'Tab') return;

        const focusableElements = Array.from(dialog.querySelectorAll(focusableSelector))
            .filter(function (element) { return element.getClientRects().length > 0; });
        if (!focusableElements.length) {
            event.preventDefault();
            dialog.focus();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    document.addEventListener('click', function (event) {
        const closeTrigger = event.target.closest('[data-auth-modal-close]');
        if (closeTrigger && modal.contains(closeTrigger)) {
            event.preventDefault();
            closeModal();
            return;
        }

        const trigger = event.target.closest('a, button, [role="button"], [data-requires-auth], [data-auth-required]');
        if (!isProtectedTrigger(trigger)) return;

        event.preventDefault();
        event.stopPropagation();
        openModal(trigger);
    }, true);

    document.addEventListener('keydown', function (event) {
        if (!isOpen) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
            return;
        }
        trapFocus(event);
    });

    window.BlueEcoAuthModal = {
        open: function (featureName, trigger) {
            openModal(trigger || document.activeElement, featureName);
        },
        close: closeModal
    };
}());
