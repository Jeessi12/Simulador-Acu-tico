/* recursos.js */
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('resources-ready');

    const progressBar = document.getElementById('resourcesScrollProgress') || (() => {
        const bar = document.createElement('div');
        bar.id = 'resourcesScrollProgress';
        bar.className = 'resources-scroll-progress';
        document.body.prepend(bar);
        return bar;
    })();

    const updatePageProgress = () => {
        const pageHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(100, Math.max(0, (window.scrollY / pageHeight) * 100));
        document.documentElement.style.setProperty('--page-progress', `${progress}%`);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
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

    // ============================================
    // CARRUSEL DE BIODIVERSIDAD - INFINITO (VERSIÓN SIMPLE Y ESTABLE)
    // ============================================
    
    const track = document.getElementById('bioTrack');
    const cards = track ? track.querySelectorAll('.bio-card') : [];
    const dots = document.querySelectorAll('.bio-dot');
    const label = document.querySelector('.bio-current-label');
    const prevBtn = document.getElementById('bioPrev');
    const nextBtn = document.getElementById('bioNext');

    let isAnimating = false;
    let currentIndex = 0;
    let autoCarouselTimer = null;
    let isPaused = false;
    const totalCards = cards.length;

    // Configuración del carrusel
    const CONFIG = {
        interval: 2000,        // Tiempo entre slides (ms)
        transitionSpeed: 500,  // Duración de la transición (ms)
        pauseOnHover: true,    // Pausar al hacer hover
    };

    // ===== CLONAR TARJETAS PARA EFECTO INFINITO =====
    function setupInfiniteCarousel() {
        if (!track || totalCards === 0) return;

        // Guardar las tarjetas originales
        const originalCards = Array.from(cards);
        
        // Limpiar clones anteriores si existen
        const oldClones = track.querySelectorAll('.clone');
        oldClones.forEach(clone => clone.remove());

        // Clonar todas las tarjetas y agregarlas al final
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        });

        // Clonar todas las tarjetas y agregarlas al inicio
        const clonesAtStart = [];
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            clonesAtStart.push(clone);
        });
        clonesAtStart.reverse().forEach(clone => {
            track.insertBefore(clone, track.firstChild);
        });

        // Actualizar la lista de todas las tarjetas
        const allCards = track.querySelectorAll('.bio-card');
        const totalWithClones = allCards.length;
        const originalStartIndex = totalCards; // Índice donde comienzan las originales

        // Posicionar en la primera tarjeta original
        const firstOriginal = allCards[originalStartIndex];
        if (firstOriginal) {
            const containerRect = track.getBoundingClientRect();
            const cardRect = firstOriginal.getBoundingClientRect();
            const scrollLeft = track.scrollLeft + (cardRect.left - containerRect.left) - 
                              (containerRect.width / 2) + (cardRect.width / 2);
            track.scrollTo({ left: scrollLeft, behavior: 'auto' });
        }

        // Marcar la primera tarjeta original como activa
        allCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === originalStartIndex) {
                card.classList.add('active');
            }
        });

        return { allCards, originalStartIndex, totalWithClones };
    }

    let carouselState = null;

    // ===== FUNCIÓN PARA ACTUALIZAR EL CARRUSEL =====
    const updateCarousel = (index, smooth = true) => {
        if (!track || totalCards === 0 || isAnimating) return;

        // Manejar índices circulares
        let targetIndex = index;
        if (targetIndex < 0) targetIndex = totalCards - 1;
        if (targetIndex >= totalCards) targetIndex = 0;

        // Si ya estamos en ese índice, no hacer nada
        if (targetIndex === currentIndex && cards[targetIndex]?.classList.contains('active')) {
            return;
        }

        isAnimating = true;
        const prevIndex = currentIndex;
        currentIndex = targetIndex;

        // Actualizar tarjetas
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === targetIndex) {
                card.classList.add('active');
                card.style.transition = `all ${CONFIG.transitionSpeed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
                card.style.transform = 'scale(1)';
                card.style.opacity = '1';
            } else {
                card.style.transition = `all ${CONFIG.transitionSpeed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
                card.style.transform = 'scale(0.92)';
                card.style.opacity = '0.6';
            }
        });

        // Actualizar clones también
        if (carouselState) {
            const { allCards, originalStartIndex } = carouselState;
            allCards.forEach((card, i) => {
                const cardIndex = (i - originalStartIndex + totalCards) % totalCards;
                if (cardIndex === targetIndex) {
                    card.classList.add('active');
                    card.style.transition = `all ${CONFIG.transitionSpeed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                } else {
                    card.classList.remove('active');
                    card.style.transition = `all ${CONFIG.transitionSpeed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
                    card.style.transform = 'scale(0.92)';
                    card.style.opacity = '0.6';
                }
            });
        }

        // Actualizar dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === targetIndex) {
                dot.classList.add('active');
                dot.style.transition = 'all 0.4s ease';
                dot.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    dot.style.transform = 'scale(1)';
                }, 200);
            }
        });

        // Actualizar label
        if (label) {
            const activeCard = cards[targetIndex];
            const title = activeCard?.querySelector('h3')?.textContent || '';
            const num = String(targetIndex + 1).padStart(2, '0');
            
            label.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            label.style.opacity = '0';
            label.style.transform = 'translateY(-5px)';
            
            setTimeout(() => {
                label.textContent = `${num} ${title}`.trim();
                label.style.opacity = '1';
                label.style.transform = 'translateY(0)';
            }, 200);
        }

        // Scroll suave a la tarjeta activa
        if (smooth && track) {
            const activeCard = cards[targetIndex];
            if (activeCard) {
                const containerRect = track.getBoundingClientRect();
                const cardRect = activeCard.getBoundingClientRect();
                const scrollLeft = track.scrollLeft + (cardRect.left - containerRect.left) - 
                                  (containerRect.width / 2) + (cardRect.width / 2);
                track.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }

        // Manejar el salto infinito después de la animación
        setTimeout(() => {
            if (carouselState) {
                handleInfiniteJump();
            }
            isAnimating = false;
        }, CONFIG.transitionSpeed + 50);
    };

    // ===== MANEJAR EL SALTO INFINITO =====
    function handleInfiniteJump() {
        if (!carouselState || !track) return;

        const { allCards, originalStartIndex, totalWithClones } = carouselState;
        const scrollLeft = track.scrollLeft;
        const cardWidth = allCards[0]?.offsetWidth + 24 || 300;
        const threshold = cardWidth * 2;

        // Calcular la posición del primer y último conjunto original
        const firstOriginalPos = originalStartIndex * cardWidth;
        const lastOriginalPos = (originalStartIndex + totalCards - 1) * cardWidth;

        // Si estamos muy a la izquierda (en los clones del inicio)
        if (scrollLeft < firstOriginalPos - threshold) {
            // Saltar al final del conjunto original
            const jumpTo = lastOriginalPos - cardWidth * 2;
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = jumpTo;
            setTimeout(() => {
                track.style.scrollBehavior = 'smooth';
            }, 50);
        }
        // Si estamos muy a la derecha (en los clones del final)
        else if (scrollLeft > lastOriginalPos + threshold) {
            // Saltar al inicio del conjunto original
            const jumpTo = firstOriginalPos + cardWidth * 2;
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = jumpTo;
            setTimeout(() => {
                track.style.scrollBehavior = 'smooth';
            }, 50);
        }
    }

    // ===== CONTROL DE AUTOPLAY =====
    const startAutoCarousel = () => {
        if (autoCarouselTimer) {
            clearInterval(autoCarouselTimer);
            autoCarouselTimer = null;
        }
        if (isPaused) return;
        autoCarouselTimer = window.setInterval(() => {
            if (!isAnimating && !isPaused) {
                updateCarousel(currentIndex + 1);
            }
        }, CONFIG.interval);
    };

    const stopAutoCarousel = () => {
        if (autoCarouselTimer) {
            clearInterval(autoCarouselTimer);
            autoCarouselTimer = null;
        }
    };

    const resetAutoCarousel = () => {
        stopAutoCarousel();
        startAutoCarousel();
    };

    const pauseAutoCarousel = () => {
        if (!isPaused) {
            isPaused = true;
            stopAutoCarousel();
            track?.classList.add('paused');
        }
    };

    const resumeAutoCarousel = () => {
        if (isPaused) {
            isPaused = false;
            track?.classList.remove('paused');
            startAutoCarousel();
        }
    };

    // ===== EVENTOS DE NAVEGACIÓN =====
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            updateCarousel(currentIndex - 1);
            resetAutoCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            updateCarousel(currentIndex + 1);
            resetAutoCarousel();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
            resetAutoCarousel();
        });
    });

    // ===== EVENTO DE SCROLL PARA EL EFECTO INFINITO =====
    if (track) {
        let scrollTimeout;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (!isAnimating) {
                    handleInfiniteJump();
                }
            }, 150);
        });
    }

    // ===== PAUSA AL HACER HOVER =====
    if (track && CONFIG.pauseOnHover) {
        track.addEventListener('mouseenter', pauseAutoCarousel);
        track.addEventListener('mouseleave', resumeAutoCarousel);
        track.addEventListener('touchstart', pauseAutoCarousel);
        track.addEventListener('touchend', () => {
            setTimeout(resumeAutoCarousel, 3000);
        });
    }

    // ===== NAVEGACIÓN POR TECLADO =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && prevBtn) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && nextBtn) {
            nextBtn.click();
        }
    });

    // ===== INICIALIZAR EL CARRUSEL =====
    function initCarousel() {
        if (totalCards === 0) return;

        // Configurar el carrusel infinito
        carouselState = setupInfiniteCarousel();

        // Actualizar el estado inicial
        if (carouselState) {
            const { allCards, originalStartIndex } = carouselState;
            allCards.forEach((card, i) => {
                card.classList.remove('active');
                if (i === originalStartIndex) {
                    card.classList.add('active');
                }
            });
        }

        // Actualizar dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === 0) {
                dot.classList.add('active');
            }
        });

        // Actualizar label
        if (label && cards[0]) {
            const title = cards[0]?.querySelector('h3')?.textContent || '';
            label.textContent = `01 ${title}`.trim();
        }

        // Iniciar autoplay
        startAutoCarousel();
    }

    // Esperar a que las imágenes carguen
    if (document.readyState === 'complete') {
        setTimeout(initCarousel, 100);
    } else {
        window.addEventListener('load', () => {
            setTimeout(initCarousel, 200);
        });
    }

    // ============================================
    // FIN DEL CARRUSEL INFINITO
    // ============================================

    const timelineItems = document.querySelectorAll('.timeline-item');
    const pathActive = document.getElementById('timelinePathActive');

    if (typeof IntersectionObserver !== 'undefined') {
        const tlObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach((item) => tlObserver.observe(item));

        if (pathActive) {
            const pathObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        pathActive.style.transition = 'stroke-dashoffset 2s ease-out';
                        pathActive.style.strokeDashoffset = '0';
                    } else {
                        pathActive.style.transition = 'stroke-dashoffset 1s ease-in';
                        pathActive.style.strokeDashoffset = '1600';
                    }
                });
            }, { threshold: 0.1 });

            const timelineSection = document.getElementById('timeline-section');
            if (timelineSection) {
                pathObserver.observe(timelineSection);
            }
        }
    } else {
        timelineItems.forEach((item) => item.classList.add('active'));
        if (pathActive) {
            pathActive.style.strokeDashoffset = '0';
        }
    }

    const LAYER_MAP = {
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
        const activeNames = activePills.map((pill) => pill.textContent.replace(/\s+/g, ' ').trim());

        if (mapActiveCount) {
            mapActiveCount.textContent = countLabel.toLowerCase();
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

    // Exponer controles del carrusel para depuración
    window.bioCarousel = {
        next: () => updateCarousel(currentIndex + 1),
        prev: () => updateCarousel(currentIndex - 1),
        goTo: (index) => updateCarousel(index),
        pause: pauseAutoCarousel,
        resume: resumeAutoCarousel,
        getCurrentIndex: () => currentIndex,
        getTotalCards: () => totalCards
    };
});
