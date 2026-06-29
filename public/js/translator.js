(function () {
    const STORAGE_KEY = 'blueEcoLang';
    const CACHE_KEY = 'blueEcoTranslationCache';
    const DEFAULT_LANG = 'es';
    const TARGET_LANG = 'en';
    const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';
    const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
    const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label'];
    const OVERRIDES = {
        'Volver al catálogo': 'Back to catalog',
        'Catálogo': 'Catalog',
        'Especies Marinas': 'Marine Species',
        'Explora, aprende y conecta con la vida bajo el mar': 'Explore, learn, and connect with life under the sea',
        'Buscar por nombre, nombre científico, hábitat…': 'Search by name, scientific name, habitat...',
        'Todos': 'All',
        'Peces': 'Fish',
        'Tortugas': 'Turtles',
        'Crustáceos': 'Crustaceans',
        'Moluscos': 'Mollusks',
        'Favorito': 'Favorite',
        'Mis Favoritos': 'My Favorites',
        'Mis Notas': 'My Notes',
        'Nueva nota': 'New note',
        'Iniciar simulación': 'Start simulation',
        'Cambiar idioma': 'Change language',
        'Cerrar Sesión': 'Log out',
        'Asistente EcoSim': 'EcoSim Assistant'
    };
    const ATTR_SKIP_SELECTOR = [
        'script',
        'style',
        'noscript',
        'code',
        'pre',
        '[data-no-translate]',
        '.notranslate',
        '.detail-scientific',
        '.detail-species-badge',
        '.book-scientific'
    ].join(',');
    const SKIP_SELECTOR = [
        'script',
        'style',
        'noscript',
        'code',
        'pre',
        'textarea',
        'input',
        'select',
        '[data-no-translate]',
        '.notranslate',
        '.detail-scientific',
        '.detail-species-badge',
        '.book-scientific'
    ].join(',');

    let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    let cache = readCache();
    let applying = false;
    let pendingTranslate = false;
    let observer = null;
    let debounceTimer = null;

    function readCache() {
        try {
            return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveCache() {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            cache = {};
        }
    }

    function shouldSkipElement(element) {
        return !element || element.nodeType !== Node.ELEMENT_NODE || element.closest(SKIP_SELECTOR);
    }

    function shouldSkipAttrElement(element) {
        return !element || element.nodeType !== Node.ELEMENT_NODE || element.closest(ATTR_SKIP_SELECTOR);
    }

    function cleanText(text) {
        return (text || '').replace(/\s+/g, ' ').trim();
    }

    function isTranslatableText(text) {
        const value = cleanText(text);
        if (!value || value.length < 2) return false;
        if (/^[\d\s.,:;°%/()\-–—+]+$/.test(value)) return false;
        return /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(value);
    }

    function getTextNodes(root) {
        const nodes = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!isTranslatableText(node.nodeValue)) return NodeFilter.FILTER_REJECT;
                if (shouldSkipElement(node.parentElement)) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        while (walker.nextNode()) nodes.push(walker.currentNode);
        return nodes;
    }

    function getAttrTargets(root) {
        const targets = [];
        const elements = root.nodeType === Node.ELEMENT_NODE
            ? [root, ...root.querySelectorAll('*')]
            : Array.from(document.querySelectorAll('*'));

        elements.forEach((element) => {
            if (shouldSkipAttrElement(element)) return;
            TRANSLATABLE_ATTRS.forEach((attr) => {
                const value = element.getAttribute(attr);
                if (isTranslatableText(value)) targets.push({ element, attr, value });
            });
        });

        return targets;
    }

    function cacheKey(text, from, to) {
        return `${from}|${to}|${text}`;
    }

    async function fetchTranslation(text, from, to) {
        const normalized = cleanText(text);
        const overrideKey = normalized.replace(/^[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/, '').trim();
        const override = OVERRIDES[normalized] || OVERRIDES[overrideKey];
        if (from === DEFAULT_LANG && to === TARGET_LANG && override) {
            return override;
        }

        const key = cacheKey(normalized, from, to);
        if (cache[key]) return cache[key];

        const googleUrl = `${GOOGLE_TRANSLATE_URL}?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(normalized)}`;
        try {
            const googleResponse = await fetch(googleUrl);
            if (googleResponse.ok) {
                const googleData = await googleResponse.json();
                const translated = cleanText((googleData?.[0] || []).map(part => part?.[0] || '').join(''));
                if (translated) {
                    cache[key] = translated;
                    saveCache();
                    return translated;
                }
            }
        } catch (error) {
            console.warn('Google Translate no respondio, usando respaldo:', error);
        }

        const url = `${MYMEMORY_URL}?q=${encodeURIComponent(normalized)}&langpair=${from}|${to}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Translation API ${response.status}`);
        const data = await response.json();
        const translated = cleanText(data?.responseData?.translatedText || normalized);
        cache[key] = translated;
        saveCache();
        return translated;
    }

    async function translateText(text, from, to) {
        const leading = text.match(/^\s*/)?.[0] || '';
        const trailing = text.match(/\s*$/)?.[0] || '';
        const normalized = cleanText(text);
        const translated = await fetchTranslation(normalized, from, to);
        return `${leading}${translated}${trailing}`;
    }

    async function translatePage(lang) {
        applying = true;
        const from = DEFAULT_LANG;
        const to = lang;

        try {
            const textNodes = getTextNodes(document.body);
            for (const node of textNodes) {
                if (!node.parentElement) continue;
                if (!node.__blueEcoOriginalText) {
                    node.__blueEcoOriginalText = node.nodeValue;
                }

                if (lang === DEFAULT_LANG) {
                    node.nodeValue = node.__blueEcoOriginalText;
                } else {
                    try {
                        node.nodeValue = await translateText(node.__blueEcoOriginalText, from, to);
                    } catch (error) {
                        console.warn('No se pudo traducir texto:', error);
                    }
                }
            }

            const attrs = getAttrTargets(document.body);
            for (const item of attrs) {
                const dataKey = `original${item.attr.replace(/(^.|-.)/g, s => s.replace('-', '').toUpperCase())}`;
                if (!item.element.dataset[dataKey]) {
                    item.element.dataset[dataKey] = item.value;
                }

                if (lang === DEFAULT_LANG) {
                    item.element.setAttribute(item.attr, item.element.dataset[dataKey]);
                } else {
                    try {
                        item.element.setAttribute(item.attr, await translateText(item.element.dataset[dataKey], from, to));
                    } catch (error) {
                        console.warn('No se pudo traducir atributo:', error);
                    }
                }
            }
        } catch (error) {
            console.warn('No se pudo completar la traduccion automatica:', error);
        } finally {
            applying = false;
            updateButton();
            if (pendingTranslate && currentLang !== DEFAULT_LANG) {
                pendingTranslate = false;
                scheduleTranslate();
            }
        }
    }

    function updateButton() {
        const btn = document.getElementById('langBtn');
        if (!btn) return;
        const isEnglish = currentLang === TARGET_LANG;
        btn.classList.toggle('lang-active', isEnglish);
        btn.setAttribute('aria-pressed', String(isEnglish));
        btn.setAttribute('title', isEnglish ? 'Ver en espanol' : 'Translate to English');
    }

    function scheduleTranslate() {
        if (currentLang === DEFAULT_LANG || applying) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => translatePage(currentLang), 250);
    }

    function initObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver((mutations) => {
            if (applying) {
                pendingTranslate = true;
                return;
            }
            if (mutations.some(m => m.addedNodes.length || m.type === 'childList')) {
                scheduleTranslate();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        const btn = document.getElementById('langBtn');
        updateButton();
        initObserver();

        btn?.addEventListener('click', async () => {
            currentLang = currentLang === TARGET_LANG ? DEFAULT_LANG : TARGET_LANG;
            localStorage.setItem(STORAGE_KEY, currentLang);
            updateButton();
            await translatePage(currentLang);
        });

        if (currentLang !== DEFAULT_LANG) {
            translatePage(currentLang);
        }
    }

    window.blueEcoTranslator = {
        getLanguage: () => currentLang,
        translate: (text, from = DEFAULT_LANG, to = TARGET_LANG) => translateText(text, from, to)
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
