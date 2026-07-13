document.addEventListener('DOMContentLoaded', () => {
    const filters = Array.from(document.querySelectorAll('[data-achievement-filter]'));
    const cards = Array.from(document.querySelectorAll('[data-achievement-category]'));
    const emptyState = document.getElementById('achievementFilterEmpty');

    filters.forEach((filter) => {
        filter.addEventListener('click', () => {
            const category = filter.dataset.achievementFilter || 'all';
            let visible = 0;

            filters.forEach((item) => {
                const active = item === filter;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-pressed', String(active));
            });

            cards.forEach((card) => {
                const matches = category === 'all' || card.dataset.achievementCategory === category;
                card.hidden = !matches;
                if (matches) {
                    visible++;
                    if (typeof card.animate === 'function') {
                        card.animate(
                            [
                                { opacity: 0, transform: 'translateY(8px)' },
                                { opacity: 1, transform: 'translateY(0)' }
                            ],
                            { duration: 260, easing: 'ease-out' }
                        );
                    }
                }
            });

            if (emptyState) emptyState.hidden = visible > 0;
        });
    });
});
