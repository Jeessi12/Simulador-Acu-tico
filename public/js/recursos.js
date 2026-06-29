document.addEventListener('DOMContentLoaded', () => {

    /* ── Timeline ───────────────────────────────── */
    const detailBadge = document.getElementById('timelineDetail')?.querySelector('.detail-year-badge');
    const detailTitle = document.getElementById('timelineDetail')?.querySelector('h3');
    const detailDesc  = document.getElementById('timelineDetail')?.querySelector('p');

    document.querySelectorAll('.timeline-node').forEach((node) => {
        node.addEventListener('click', () => {
            document.querySelectorAll('.timeline-node').forEach((n) => n.classList.remove('active'));
            node.classList.add('active');

            if (detailBadge) detailBadge.textContent = node.dataset.year;
            if (detailTitle) detailTitle.textContent = node.dataset.title;
            if (detailDesc)  detailDesc.textContent  = node.dataset.description;
        });
    });

    /* ── Mapa — toggle capas SVG ────────────────── */
    const LAYER_MAP = {
        location:  'svg-lyr-location',
        reef:      'svg-lyr-reef',
        ecosystem: 'svg-lyr-ecosystem',
        turtles:   'svg-lyr-turtles',
        protected: 'svg-lyr-protected',
    };

    document.querySelectorAll('.map-pill').forEach((pill) => {
        pill.addEventListener('click', () => {
            const isActive = pill.classList.toggle('active');
            const layerId  = LAYER_MAP[pill.dataset.layer];
            const svgGroup = layerId ? document.getElementById(layerId) : null;

            if (svgGroup) {
                svgGroup.classList.toggle('layer-off', !isActive);
            }
        });
    });
});