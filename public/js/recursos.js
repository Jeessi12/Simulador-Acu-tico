document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('resources-ready');

    const updatePageProgress = () => {
        const pageHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(100, Math.max(0, (window.scrollY / pageHeight) * 100));
        document.documentElement.style.setProperty('--page-progress', `${progress}%`);
    };

    window.addEventListener('scroll', updatePageProgress, { passive: true });
    window.addEventListener('resize', updatePageProgress);
    updatePageProgress();

    const revealItems = [
        ...document.querySelectorAll('.content-section:not(.timeline-scroll-section), .map-panel-wrapper, .doc-card-fluid')
    ];

    revealItems.forEach((item) => item.classList.add('reveal-ready'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('reveal-in');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));

    const railLinks = [...document.querySelectorAll('.resources-rail a')];
    const railSections = railLinks
        .map((link) => document.getElementById(link.dataset.section))
        .filter(Boolean);

    railLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.getElementById(link.dataset.section);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const railObserver = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        railLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === visible.target.id);
        });
    }, { threshold: [0.16, 0.3, 0.55], rootMargin: '-18% 0px -45% 0px' });

    railSections.forEach((section) => railObserver.observe(section));

    const timelineSection = document.getElementById('timeline');
    const timelineNodes = [...document.querySelectorAll('.timeline-node')];
    const timelineDetail = document.getElementById('timelineDetail');
    const detailBadge = timelineDetail?.querySelector('.detail-year-badge');
    const detailTitle = timelineDetail?.querySelector('h3');
    const detailDesc = timelineDetail?.querySelector('p');
    const timelinePath = document.querySelector('.timeline-route-progress');
    const timelineMarker = document.querySelector('.timeline-route-marker');
    const timelinePoints = [
        { x: 7, y: 64 },
        { x: 24, y: 27 },
        { x: 47, y: 61 },
        { x: 66, y: 33 },
        { x: 86, y: 53 },
    ];
    let timelinePathLength = 0;
    let activeTimelineIndex = -1;

    if (timelinePath) {
        timelinePathLength = timelinePath.getTotalLength();
        timelineSection?.style.setProperty('--timeline-path-length', timelinePathLength);
        timelineSection?.style.setProperty('--timeline-path-offset', timelinePathLength);
        timelinePath.style.strokeDasharray = timelinePathLength;
        timelinePath.style.strokeDashoffset = timelinePathLength;
    }

    const moveTimelineMarker = (progress) => {
        if (!timelineMarker || timelinePoints.length === 0) return;

        const scaled = progress * (timelinePoints.length - 1);
        const startIndex = Math.min(timelinePoints.length - 1, Math.floor(scaled));
        const endIndex = Math.min(timelinePoints.length - 1, startIndex + 1);
        const local = scaled - startIndex;
        const start = timelinePoints[startIndex];
        const end = timelinePoints[endIndex];
        const x = start.x + ((end.x - start.x) * local);
        const y = start.y + ((end.y - start.y) * local);

        timelineSection?.style.setProperty('--marker-x', `${x}%`);
        timelineSection?.style.setProperty('--marker-y', `${y}%`);
    };

    const setTimelineActive = (index) => {
        const node = timelineNodes[index];
        if (!node || index === activeTimelineIndex) return;

        activeTimelineIndex = index;
        timelineNodes.forEach((item) => item.classList.toggle('active', item === node));
        const point = timelinePoints[index];
        if (point) {
            timelineSection?.style.setProperty('--marker-x', `${point.x}%`);
            timelineSection?.style.setProperty('--marker-y', `${point.y}%`);
        }
        node.querySelector('.timeline-node-icon')?.animate(
            [
                { transform: 'translateY(-2px) scale(0.86)' },
                { transform: 'translateY(-7px) scale(1.14)' },
                { transform: 'translateY(-4px) scale(1)' }
            ],
            { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
        );

        if (!timelineDetail) return;

        timelineDetail.classList.add('is-changing');
        window.setTimeout(() => {
            if (detailBadge) detailBadge.textContent = node.dataset.year;
            if (detailTitle) detailTitle.textContent = node.dataset.title;
            if (detailDesc) detailDesc.textContent = node.dataset.description;
            timelineDetail.classList.remove('is-changing');
            timelineDetail.animate(
                [
                    { opacity: 0, transform: 'translateY(14px) scale(0.98)' },
                    { opacity: 1, transform: 'translateY(0) scale(1)' }
                ],
                { duration: 360, easing: 'ease-out' }
            );
        }, 150);
    };

    const setTimelineByProgress = (progress) => {
        if (timelineNodes.length === 0) return;

        timelineSection?.style.setProperty('--timeline-progress', `${Math.round(progress * 100)}%`);
        if (timelinePathLength) {
            timelineSection?.style.setProperty('--timeline-path-offset', timelinePathLength * (1 - progress));
            timelinePath.style.strokeDashoffset = timelinePathLength * (1 - progress);
        }
        moveTimelineMarker(progress);
        const index = Math.min(
            timelineNodes.length - 1,
            Math.max(0, Math.round(progress * (timelineNodes.length - 1)))
        );

        setTimelineActive(index);
    };

    let timelineFrame = null;
    const updateTimelineByScroll = () => {
        if (!timelineSection || timelineNodes.length === 0) return;

        const rect = timelineSection.getBoundingClientRect();
        const scrollable = Math.max(1, rect.height - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
        setTimelineByProgress(progress);
    };

    const requestTimelineUpdate = () => {
        if (timelineFrame) return;
        timelineFrame = window.requestAnimationFrame(() => {
            timelineFrame = null;
            updateTimelineByScroll();
        });
    };

    timelineNodes.forEach((node, index) => {
        node.addEventListener('click', () => {
            setTimelineActive(index);
            if (timelineSection) {
                const travel = timelineSection.offsetHeight - window.innerHeight;
                const target = timelineSection.offsetTop + (travel * (index / Math.max(1, timelineNodes.length - 1)));
                window.scrollTo({ top: target, behavior: 'smooth' });
            }
        });
    });

    if (window.gsap && window.ScrollTrigger && timelineSection) {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({
            trigger: timelineSection,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => setTimelineByProgress(self.progress),
            onRefresh: updateTimelineByScroll,
        });
    } else {
        window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
        window.addEventListener('resize', requestTimelineUpdate);
    }

    setTimelineActive(0);
    updateTimelineByScroll();


    const biodiversityTrack = document.getElementById('biodiversityCarousel');
    const biodiversityCards = biodiversityTrack ? [...biodiversityTrack.querySelectorAll('.bio-day-card')] : [];
    const biodiversityPrev = document.querySelector('.bio-carousel-prev');
    const biodiversityNext = document.querySelector('.bio-carousel-next');
    const biodiversityCounter = document.getElementById('bioCarouselCounter');
    const biodiversityTitle = document.getElementById('bioCarouselTitle');
    const biodiversityPanel = document.querySelector('.biodiversity-trip-panel');
    let activeBioIndex = 0;
    let bioFrame = null;

    const setBiodiversityActive = (index, shouldScroll = false) => {
        if (!biodiversityTrack || !biodiversityCards.length) return;

        activeBioIndex = (index + biodiversityCards.length) % biodiversityCards.length;
        const activeCard = biodiversityCards[activeBioIndex];

        biodiversityCards.forEach((card, cardIndex) => {
            card.classList.toggle('is-active', cardIndex === activeBioIndex);
        });

        if (biodiversityCounter) {
            biodiversityCounter.textContent = String(activeBioIndex + 1).padStart(2, '0');
        }

        if (biodiversityTitle) {
            biodiversityTitle.textContent = activeCard.querySelector('.location')?.textContent || '';
        }

        if (biodiversityPanel) {
            const panelRect = biodiversityPanel.getBoundingClientRect();
            const cardRect = activeCard.getBoundingClientRect();
            biodiversityPanel.style.setProperty('--bio-plane-x', `${cardRect.left - panelRect.left + (cardRect.width / 2)}px`);
        }

        if (shouldScroll) {
            biodiversityTrack.scrollTo({
                left: activeCard.offsetLeft - ((biodiversityTrack.clientWidth - activeCard.clientWidth) / 2),
                behavior: 'smooth'
            });
        }
    };

    const updateBiodiversityFromScroll = () => {
        if (!biodiversityTrack || !biodiversityCards.length) return;

        const center = biodiversityTrack.scrollLeft + (biodiversityTrack.clientWidth / 2);
        let closestIndex = 0;
        let closestDistance = Infinity;

        biodiversityCards.forEach((card, index) => {
            const cardCenter = card.offsetLeft + (card.clientWidth / 2);
            const distance = Math.abs(center - cardCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        setBiodiversityActive(closestIndex);
    };

    const requestBiodiversityUpdate = () => {
        if (bioFrame) return;
        bioFrame = window.requestAnimationFrame(() => {
            bioFrame = null;
            updateBiodiversityFromScroll();
        });
    };

    if (biodiversityTrack && biodiversityCards.length) {
        biodiversityCards.forEach((card, index) => {
            card.addEventListener('click', () => setBiodiversityActive(index, true));
        });

        biodiversityPrev?.addEventListener('click', () => setBiodiversityActive(activeBioIndex - 1, true));
        biodiversityNext?.addEventListener('click', () => setBiodiversityActive(activeBioIndex + 1, true));
        biodiversityTrack.addEventListener('scroll', requestBiodiversityUpdate, { passive: true });
        window.addEventListener('resize', requestBiodiversityUpdate);

        setBiodiversityActive(0);
        window.setTimeout(() => setBiodiversityActive(0, true), 120);
    }

    const LAYER_MAP = {
        location: 'svg-lyr-location',
        reef: 'svg-lyr-reef',
        ecosystem: 'svg-lyr-ecosystem',
        turtles: 'svg-lyr-turtles',
        protected: 'svg-lyr-protected',
    };

    const mapPills = [...document.querySelectorAll('.map-pill')];
    const mapActiveCount = document.getElementById('mapActiveCount');
    const mapActiveList = document.getElementById('mapActiveList');

    const updateMapSummary = () => {
        const activePills = mapPills.filter((pill) => pill.classList.contains('active'));
        const activeNames = activePills.map((pill) => pill.textContent.trim());

        if (mapActiveCount) {
            mapActiveCount.textContent = `${activePills.length} ${activePills.length === 1 ? 'capa activa' : 'capas activas'}`;
        }

        if (mapActiveList) {
            mapActiveList.textContent = activeNames.length ? activeNames.join(', ') : 'Selecciona una capa para explorar el mapa';
        }
    };

    mapPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            const isActive = pill.classList.toggle('active');
            const layerId = LAYER_MAP[pill.dataset.layer];
            const svgGroup = layerId ? document.getElementById(layerId) : null;

            if (svgGroup) {
                svgGroup.classList.toggle('layer-off', !isActive);
            }

            updateMapSummary();
        });
    });

    updateMapSummary();
});


