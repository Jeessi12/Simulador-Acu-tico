/* Interacciones generales de la página Recursos.
 * El carrusel y la línea de tiempo se montan con React desde recursos-timeline.tsx.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('resources-ready');

    const revealItems = [
        ...document.querySelectorAll('.content-section, .timeline-context, .map-panel-wrapper, .map-story-panel, .doc-card-fluid')
    ];
    revealItems.forEach((item) => item.classList.add('reveal-ready'));

    if (typeof IntersectionObserver !== 'undefined') {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('reveal-in');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('reveal-in'));
    }

    const layerMap = {
        location: 'svg-lyr-location',
        reef: 'svg-lyr-reef',
        ecosystem: 'svg-lyr-ecosystem',
        turtles: 'svg-lyr-turtles',
        protected: 'svg-lyr-protected',
    };

    const mapPills = [...document.querySelectorAll('.map-pill')];
    const mapPillsPanel = document.getElementById('mapPills');
    const mapActiveCount = document.getElementById('mapActiveCount');
    const mapActiveList = document.getElementById('mapActiveList');

    const updateMapSummary = () => {
        const activePills = mapPills.filter((pill) => pill.classList.contains('active'));
        const activeNames = activePills.map((pill) => {
            const title = pill.querySelector('b');
            return (title?.textContent || pill.textContent).replace(/\s+/g, ' ').trim();
        });
        const countLabel = `${activePills.length} ${activePills.length === 1 ? 'capa activa' : 'capas activas'}`;

        if (mapActiveCount) {
            mapActiveCount.textContent = countLabel.toLowerCase();
        }
        if (mapPillsPanel) {
            mapPillsPanel.dataset.activeCount = `〰 ${countLabel.toUpperCase()} 〰`;
        }
        if (mapActiveList) {
            mapActiveList.textContent = activeNames.length
                ? activeNames.join(', ')
                : 'Selecciona una capa para explorar el mapa';
        }
    };

    mapPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            const isActive = pill.classList.toggle('active');
            pill.setAttribute('aria-pressed', String(isActive));
            const layerId = layerMap[pill.dataset.layer];
            const svgGroup = layerId ? document.getElementById(layerId) : null;
            svgGroup?.classList.toggle('layer-off', !isActive);
            updateMapSummary();
        });
    });

    updateMapSummary();
});
