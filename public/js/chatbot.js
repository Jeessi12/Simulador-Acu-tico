/**
 * CHATBOT ASISTENTE - Blue EcoSim
 * Akira - IA con Groq
 * VERSIÓN: Con fondo, preguntas rápidas y modo oscuro mejorado
 */

class Chatbot {
    constructor(currentUser = null) {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.currentUser = currentUser;
        this.toggleBtn = null;
        this.toggleIcon = null;
        this.tipTimeout = null;
        this.mandatoryTipTimeout = null;
        this.tipStartTimeout = null;
        this.tipInterval = null;
        this.tipsMuted = this.loadTipsMutedPreference();
        this.isDragging = false;
        this.currentMode = 'groq';

        this.tips = this.buildTips();

        this.init();
        this.startRandomTips();
    }

    // ========== CONSEJOS EMERGENTES ==========
    buildTips() {
        return [
            "💡 'ESPECIES' requiere iniciar sesión y reúne más de 50 fichas marinas.",
            "🎓 Revisa 'ASIGNACIONES' para ver tus tareas.",
            "🏫 Los docentes crean espacios y asignan simulaciones.",
            "🔔 La campana de Akira activa o silencia estos consejos.",
            "❤️ Los favoritos de especies son temporales y se pierden al recargar.",
            "📝 Las notas de especies se guardan localmente en este navegador.",
            "🎮 En el simulador puedes pausar y reiniciar.",
            "🖱️ En modelos 3D arrastra para rotar y scroll para zoom.",
            "🔑 Pide el código de 6 caracteres a tu profesor.",
            "🐠 Filtra especies por peces, cetáceos, tortugas, crustáceos o moluscos.",
            "📊 Tu progreso se muestra con un anillo circular.",
            "🌊 Hay 3 simulaciones: Arrecife, Cadena alimenticia y Contaminación.",
            "✨ Inicia sesión con Google para vincular tu cuenta.",
            "📧 Revisa spam si no recibes el correo de verificación.",
            "🎯 Tu perfil muestra logros, insignias, XP y progreso.",
            "🧑‍🏫 Los docentes ven el progreso de sus estudiantes.",
            "🔄 En el simulador, reset reinicia el ecosistema.",
            "🗺️ El mapa de RECURSOS es ilustrado por capas; no usa GPS en vivo.",
            "🇸🇻 El Salvador tiene litoral únicamente en el océano Pacífico.",
            "🐢 Cuatro especies de tortuga marina anidan en El Salvador.",
            "🌿 Los manglares son criaderos de peces, camarones y moluscos.",
            "💬 Pregúntame sobre Blue EcoSim o ecosistemas marinos del mundo.",
            "🎉 Marca 'Completada' al terminar una simulación.",
            "📱 Blue EcoSim se adapta a móviles.",
            "🔐 Verifica tu correo antes del primer inicio de sesión.",
            "🌿 En 'RECURSOS' encontrarás la línea del tiempo de Los Cóbanos.",
            "📚 La biblioteca de RECURSOS reúne documentos oficiales de MARN y MINEDUCYT.",
            "🪸 Los Cóbanos reúne arrecifes rocosos y coralinos del Pacífico salvadoreño.",
            "🚫 Akira no responde sobre fauna terrestre o agua dulce ni la atribuye a Blue EcoSim."
        ];
    }

    // ========== INICIALIZACIÓN ==========
    init() {
        this.createDOM();
        this.loadMessages();
        this.addEventListeners();
        this.makeDraggable();
        this.setupResizeHandler();

        if (this.messages.length === 0) {
            let welcomeMsg = `🌊 ¡Hola! Soy **Akira**, tu asistente de Blue EcoSim. 😊\n\nPuedo ayudarte con:\n• 🧭 Secciones, funciones y límites verificados de la plataforma\n• 🎮 Simulaciones, espacios, tareas y logros\n• 🐠 Especies y ecosistemas exclusivamente marinos\n• 🇸🇻 Biodiversidad marina de El Salvador\n\nNo respondo sobre fauna terrestre o agua dulce ni invento que aparezca en Blue EcoSim.\n\n¿Qué te gustaría saber? 💙`;
            
            if (this.currentUser) {
                welcomeMsg = `🌊 ¡Hola **${this.currentUser}**! Soy Akira, tu asistente de Blue EcoSim. 😊\n\nPuedo ayudarte con:\n• 🧭 Secciones, funciones y límites verificados de la plataforma\n• 🎮 Simulaciones, espacios, tareas y logros\n• 🐠 Especies y ecosistemas exclusivamente marinos\n• 🇸🇻 Biodiversidad marina de El Salvador\n\nNo respondo sobre fauna terrestre o agua dulce ni invento que aparezca en Blue EcoSim.\n\n¿Qué te gustaría saber? 💙`;
            }
            this.addBotMessage(welcomeMsg);
        }
        
        this.renderMessages();
    }

    // ========== CREACIÓN DEL DOM ==========
    createDOM() {
        const container = document.createElement('div');
        container.className = 'cb-container';
        container.innerHTML = `
            <div class="cb-window" id="cbWindow">
                <div class="cb-header" id="cbHeader">
                    <h3>
                        <img src="../public/media/Web/ballena-contento.png" alt="Akira" class="cb-whale-img">
                        Akira · Asistente IA
                    </h3>
                    <div class="cb-header-actions">
                        <button class="cb-close" id="cbCloseBtn" aria-label="Cerrar chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="cb-messages" id="cbMessages"></div>
                <div class="cb-suggestions-panel" id="cbSuggestionsPanel">
                    <div class="cb-suggestions-container">
                        <div class="cb-suggestions-header">
                            <button class="cb-suggestions-toggle" type="button" aria-label="Minimizar mensajes rápidos">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <span class="cb-suggestions-icon">⚡</span>
                            <span class="cb-suggestions-title">Preguntas rápidas</span>
                        </div>
                        <div class="cb-suggestions-grid" id="cbSuggestionsGrid">
                            <!-- Generado por JS -->
                        </div>
                    </div>
                </div>
                <div class="cb-input">
                    <input type="text" id="cbInput" placeholder="Pregunta sobre Blue EcoSim o temas exclusivamente marinos..." autocomplete="off">
                    <button id="cbSendBtn" aria-label="Enviar mensaje">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            <button class="cb-notifications-toggle" id="cbNotificationsToggle" type="button" aria-pressed="false">
                <i class="fas fa-bell" aria-hidden="true"></i>
            </button>
            <button class="cb-toggle" id="cbToggleBtn" aria-label="Abrir asistente">
                <img src="../public/media/Web/ballena-contento.png" alt="Akira - Asistente">
            </button>
        `;
        document.body.appendChild(container);
        
        this.window = document.getElementById('cbWindow');
        this.messagesContainer = document.getElementById('cbMessages');
        this.suggestionsPanel = document.getElementById('cbSuggestionsPanel');
        this.suggestionsGrid = document.getElementById('cbSuggestionsGrid');
        this.input = document.getElementById('cbInput');
        this.toggleBtn = document.getElementById('cbToggleBtn');
        this.toggleIcon = this.toggleBtn?.querySelector('img');
        this.notificationsToggle = document.getElementById('cbNotificationsToggle');

        this.updateNotificationsToggle();
        
        this.showSuggestions();
    }

    // ========== MOSTRAR SUGERENCIAS ==========
    showSuggestions() {
        if (!this.suggestionsGrid) return;
        
        const suggestions = [
            { text: "📝 ¿Cómo me registro?", action: "¿Cómo me registro en Blue EcoSim?" },
            { text: "🏫 ¿Qué son los espacios?", action: "¿Qué son los espacios en Blue EcoSim?" },
            { text: "🎮 ¿Cómo inicio una simulación?", action: "¿Cómo inicio una simulación?" },
            { text: "📋 ¿Dónde veo mis tareas?", action: "¿Dónde veo mis tareas asignadas?" },
            { text: "🐠 ¿Qué especies hay?", action: "¿Qué especies marinas puedo ver en Blue EcoSim?" },
            { text: "📚 ¿Qué hay en recursos?", action: "¿Qué recursos educativos tiene Blue EcoSim?" },
            { text: "👥 Sobre los creadores", action: "¿Hay un apartado sobre los creadores del sitio?" },
            { text: "🇸🇻 Mar de El Salvador", action: "¿Qué ecosistemas y especies marinas destacan en El Salvador?" },
            { text: "🚫 ¿Qué no existe?", action: "¿Qué funciones no están disponibles actualmente en Blue EcoSim?" }
        ];

        this.suggestionsGrid.innerHTML = suggestions.map((s, index) => `
            <button class="cb-suggestion-btn" data-index="${index}">${s.text}</button>
        `).join('');

        this.suggestionsGrid.querySelectorAll('.cb-suggestion-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const suggestion = suggestions[index];
                this.input.value = suggestion.action;
                this.processMessage(suggestion.action);
            });
        });

        const toggleBtn = this.suggestionsPanel.querySelector('.cb-suggestions-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSuggestionsPanel();
            });
        }
    }

    toggleSuggestionsPanel() {
        if (!this.suggestionsPanel) return;
        this.suggestionsPanel.classList.toggle('is-collapsed');
        
        const toggleBtn = this.suggestionsPanel.querySelector('.cb-suggestions-toggle');
        if (toggleBtn) {
            const isCollapsed = this.suggestionsPanel.classList.contains('is-collapsed');
            toggleBtn.setAttribute('aria-label', isCollapsed ? 'Expandir mensajes rápidos' : 'Minimizar mensajes rápidos');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = isCollapsed ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
            }
        }
    }

    // ========== ARRASTRABLE ==========
    makeDraggable() {
        const header = document.getElementById('cbHeader');
        if (!header) return;
        let offsetX = 0, offsetY = 0;
        let isDragging = false;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.cb-header-actions') || e.target.closest('.cb-close')) return;
            isDragging = true;
            const rect = this.window.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            this.window.style.cursor = 'grabbing';
            this.window.style.transition = 'none';
            this.window.style.pointerEvents = 'all';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let left = e.clientX - offsetX;
            let top = e.clientY - offsetY;
            const winWidth = this.window.offsetWidth;
            const winHeight = this.window.offsetHeight;
            left = Math.max(0, Math.min(left, window.innerWidth - winWidth));
            top = Math.max(0, Math.min(top, window.innerHeight - winHeight));
            this.window.style.position = 'fixed';
            this.window.style.left = `${left}px`;
            this.window.style.right = 'auto';
            this.window.style.top = `${top}px`;
            this.window.style.bottom = 'auto';
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                this.window.style.cursor = '';
                this.window.style.transition = '';
                this.window.style.pointerEvents = '';
            }
        });
    }

    // ========== MANEJADOR DE RESIZE ==========
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.window && this.window.style.left !== '' && this.window.style.left !== 'auto') {
                    const left = parseInt(this.window.style.left);
                    const top = parseInt(this.window.style.top);
                    const winWidth = this.window.offsetWidth;
                    const winHeight = this.window.offsetHeight;
                    if (left + winWidth > window.innerWidth) {
                        this.window.style.left = `${Math.max(0, window.innerWidth - winWidth)}px`;
                    }
                    if (top + winHeight > window.innerHeight) {
                        this.window.style.top = `${Math.max(0, window.innerHeight - winHeight)}px`;
                    }
                }
            }, 200);
        });
    }

    // ========== CONSEJOS EMERGENTES ==========
    loadTipsMutedPreference() {
        try {
            return localStorage.getItem('chatbot_tips_muted') === 'true';
        } catch {
            return false;
        }
    }

    saveTipsMutedPreference() {
        try {
            localStorage.setItem('chatbot_tips_muted', String(this.tipsMuted));
        } catch {}
    }

    updateNotificationsToggle() {
        if (!this.notificationsToggle) return;

        const icon = this.notificationsToggle.querySelector('i');
        const status = this.tipsMuted
            ? 'Consejos emergentes silenciados. Activar consejos'
            : 'Consejos emergentes activos. Silenciar consejos';

        this.notificationsToggle.classList.toggle('is-muted', this.tipsMuted);
        this.notificationsToggle.setAttribute('aria-pressed', String(this.tipsMuted));
        this.notificationsToggle.setAttribute('aria-label', status);
        this.notificationsToggle.setAttribute('title', status);
        if (icon) icon.className = this.tipsMuted ? 'fas fa-bell-slash' : 'fas fa-bell';
    }

    setTipsMuted(shouldMute) {
        this.tipsMuted = shouldMute;
        this.saveTipsMutedPreference();
        this.updateNotificationsToggle();

        if (this.tipsMuted) {
            this.stopRandomTips();
            this.dismissCurrentTip();
        } else {
            this.startRandomTips();
        }
    }

    startRandomTips() {
        this.stopRandomTips();
        if (this.tipsMuted) return;

        this.tipStartTimeout = setTimeout(() => this.showRandomTip(), 10000);
        this.tipInterval = setInterval(() => this.showRandomTip(), 45000 + Math.random() * 15000);
    }

    stopRandomTips() {
        clearTimeout(this.tipStartTimeout);
        clearInterval(this.tipInterval);
        this.tipStartTimeout = null;
        this.tipInterval = null;
    }

    dismissCurrentTip() {
        clearTimeout(this.tipTimeout);
        const tooltip = document.querySelector('.cb-tip-tooltip:not(.cb-tip-tooltip--mandatory)');
        if (!tooltip) return;

        tooltip.style.transition = 'all 0.25s ease';
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'scale(0.9) translateY(10px)';
        setTimeout(() => tooltip.remove(), 250);
    }

    showRandomTip() {
        if (this.isOpen || this.tipsMuted) return;
        if (document.querySelector('.cb-tip-tooltip--mandatory')) return;
        const randomTip = this.tips[Math.floor(Math.random() * this.tips.length)];
        const toggleBtn = this.toggleBtn;
        if (!toggleBtn) return;

        const existingTip = document.querySelector('.cb-tip-tooltip:not(.cb-tip-tooltip--mandatory)');
        if (existingTip) existingTip.remove();

        setTimeout(() => {
            if (this.isOpen || this.tipsMuted) return;
            if (document.querySelector('.cb-tip-tooltip--mandatory')) return;

            const tooltip = document.createElement('div');
            tooltip.className = 'cb-tip-tooltip';
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'scale(0.9) translateY(10px)';
            tooltip.innerHTML = `
                <div class="cb-tip-title">
                    <i class="fas fa-lightbulb"></i> ¿Sabías que...?
                    <button class="cb-tip-close" aria-label="Cerrar consejo">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cb-tip-text">${randomTip}</div>
            `;

            toggleBtn.parentElement.appendChild(tooltip);

            requestAnimationFrame(() => {
                tooltip.style.transition = 'all 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)';
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'scale(1) translateY(0)';
            });

            if (this.tipTimeout) clearTimeout(this.tipTimeout);
            this.tipTimeout = setTimeout(() => {
                if (tooltip.parentElement) {
                    tooltip.style.transition = 'all 0.3s ease';
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'scale(0.9) translateY(10px)';
                    setTimeout(() => {
                        if (tooltip.parentElement) tooltip.remove();
                    }, 300);
                }
            }, 10000);

            tooltip.querySelector('.cb-tip-close').addEventListener('click', () => {
                clearTimeout(this.tipTimeout);
                tooltip.style.transition = 'all 0.3s ease';
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'scale(0.9) translateY(10px)';
                setTimeout(() => {
                    if (tooltip.parentElement) tooltip.remove();
                }, 300);
            });

        }, 300);
    }

    showMandatoryNotification(message, options = {}) {
        const text = String(message || '').trim();
        const toggleBtn = this.toggleBtn;
        if (!text || !toggleBtn?.parentElement) return;

        const duration = Math.max(3000, Math.min(Number(options.duration) || 6000, 8000));
        const titleText = String(options.title || 'Akira · Estado del ecosistema');
        const existingTips = document.querySelectorAll('.cb-tip-tooltip');

        clearTimeout(this.tipTimeout);
        clearTimeout(this.mandatoryTipTimeout);
        existingTips.forEach((tip) => tip.remove());

        const tooltip = document.createElement('div');
        tooltip.className = 'cb-tip-tooltip cb-tip-tooltip--mandatory';
        tooltip.setAttribute('role', 'status');
        tooltip.setAttribute('aria-live', 'polite');
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'scale(0.9) translateY(10px)';

        const title = document.createElement('div');
        title.className = 'cb-tip-title';
        const icon = document.createElement('i');
        icon.className = 'fas fa-whale';
        icon.setAttribute('aria-hidden', 'true');
        const titleCopy = document.createElement('span');
        titleCopy.textContent = titleText;
        title.append(icon, titleCopy);

        const copy = document.createElement('div');
        copy.className = 'cb-tip-text';
        copy.textContent = text;
        tooltip.append(title, copy);
        toggleBtn.parentElement.appendChild(tooltip);

        requestAnimationFrame(() => {
            tooltip.style.transition = 'all 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)';
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'scale(1) translateY(0)';
        });

        this.mandatoryTipTimeout = setTimeout(() => {
            if (!tooltip.isConnected) return;
            tooltip.style.transition = 'all 0.3s ease';
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'scale(0.9) translateY(10px)';
            setTimeout(() => tooltip.remove(), 300);
        }, duration);
    }

    // ========== MENSAJES ==========
    loadMessages() {
        const saved = localStorage.getItem('chatbot_messages');
        if (saved) {
            try { this.messages = JSON.parse(saved); } catch { this.messages = []; }
        }
    }
    
    saveMessages() {
        if (this.messages.length > 100) this.messages = this.messages.slice(-80);
        try { localStorage.setItem('chatbot_messages', JSON.stringify(this.messages)); } catch {}
    }

    escapeMessageHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    formatInlineMarkdown(text) {
        return this.escapeMessageHtml(text)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    }

    formatBotMessage(text) {
        const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
        const html = [];
        let hasContent = false;
        let previousWasSpace = false;

        lines.forEach((rawLine) => {
            const line = rawLine.trim();
            if (!line) {
                if (hasContent && !previousWasSpace) {
                    html.push('<div class="cb-answer-space" aria-hidden="true"></div>');
                    previousWasSpace = true;
                }
                return;
            }

            const heading = line.match(/^#{1,3}\s+(.+)$/);
            const bullet = line.match(/^[-*•]\s+(.+)$/);
            const numbered = line.match(/^(\d+)[.)]\s+(.+)$/);

            if (heading) {
                html.push(`<div class="cb-answer-title">${this.formatInlineMarkdown(heading[1])}</div>`);
            } else if (bullet) {
                html.push(`<div class="cb-answer-list-item"><span class="cb-answer-marker">•</span><span>${this.formatInlineMarkdown(bullet[1])}</span></div>`);
            } else if (numbered) {
                html.push(`<div class="cb-answer-list-item"><span class="cb-answer-marker cb-answer-number">${numbered[1]}.</span><span>${this.formatInlineMarkdown(numbered[2])}</span></div>`);
            } else {
                const isLead = !hasContent && line.includes('**') && line.length <= 150;
                html.push(`<div class="${isLead ? 'cb-answer-lead' : 'cb-answer-paragraph'}">${this.formatInlineMarkdown(line)}</div>`);
            }

            hasContent = true;
            previousWasSpace = false;
        });

        while (html[html.length - 1]?.includes('cb-answer-space')) html.pop();
        return html.join('');
    }
    
    renderMessages(forceScroll = false) {
        if (!this.messagesContainer) return;
        
        const wasAtBottom = this.messagesContainer.scrollHeight - this.messagesContainer.scrollTop <= this.messagesContainer.clientHeight + 20;
        
        this.messagesContainer.innerHTML = '';
        
        this.messages.forEach((msg) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `cb-msg cb-msg-${msg.sender}`;
            const bubble = document.createElement('div');
            bubble.className = 'cb-bubble';
            const messageContent = document.createElement('div');
            messageContent.className = 'cb-message-content';
            if (msg.sender === 'bot') {
                messageContent.innerHTML = this.formatBotMessage(msg.text);
            } else {
                messageContent.textContent = msg.text;
            }
            bubble.appendChild(messageContent);
            if (msg.timestamp) {
                const time = new Date(msg.timestamp);
                const timeStr = time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                const timeElement = document.createElement('div');
                timeElement.className = 'cb-timestamp';
                timeElement.textContent = timeStr;
                bubble.appendChild(timeElement);
            }
            const tail = document.createElement('div');
            tail.className = 'cb-tail';
            for (let i = 0; i < 2; i++) {
                const dot = document.createElement('span');
                dot.className = 'cb-tail-bubble';
                tail.appendChild(dot);
            }
            messageDiv.appendChild(bubble);
            messageDiv.appendChild(tail);
            this.messagesContainer.appendChild(messageDiv);
        });
        
        if (forceScroll || wasAtBottom) {
            setTimeout(() => {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }, 100);
        }
    }
    
    addUserMessage(text) {
        this.messages.push({ sender: 'user', text, timestamp: Date.now() });
        this.renderMessages(true);
        this.saveMessages();
    }
    
    addBotMessage(text) {
        this.messages.push({ sender: 'bot', text, timestamp: Date.now() });
        this.renderMessages(true);
        this.saveMessages();
    }

    // ========== INDICADOR DE ESCRITURA ==========
    showTyping() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'cb-typing';
        typingDiv.id = 'cbTypingIndicator';
        typingDiv.style.opacity = '0';
        typingDiv.innerHTML = `<span></span><span></span><span></span><span class="cb-typing-text">Akira está pensando...</span>`;
        this.messagesContainer.appendChild(typingDiv);
        requestAnimationFrame(() => {
            typingDiv.style.transition = 'all 0.3s ease';
            typingDiv.style.opacity = '1';
        });
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    hideTyping() {
        const indicator = document.getElementById('cbTypingIndicator');
        if (indicator) {
            indicator.style.transition = 'all 0.3s ease';
            indicator.style.opacity = '0';
            indicator.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (indicator.parentElement) indicator.remove();
            }, 300);
        }
        this.isTyping = false;
    }

    // ========== PROCESAR MENSAJE CON GROQ ==========
    async processMessage(question) {
        if (!question.trim()) return;

        if (this.suggestionsPanel && !this.suggestionsPanel.classList.contains('is-collapsed')) {
            this.suggestionsPanel.classList.add('is-collapsed');
            const toggleBtn = this.suggestionsPanel.querySelector('.cb-suggestions-toggle');
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-label', 'Expandir mensajes rápidos');
                const icon = toggleBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-chevron-up';
            }
        }
        
        this.addUserMessage(question);
        this.input.value = '';
        this.showTyping();
        
        try {
            const formData = new FormData();
            formData.append('message', question);
            formData.append('context', 'Usuario: ' + (this.currentUser || 'Invitado'));
            
            const res = await fetch('../views/chatbot_groq.php', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });
            
            const data = await res.json();
            
            if (data.error || !data.response) {
                const fallbackResponse = "😊 ¡Hola! Soy Akira. Parece que estoy teniendo un pequeño problema técnico. Por favor, intenta de nuevo en unos segundos. ¡Estoy aquí para ayudarte! 🐠";
                this.hideTyping();
                this.addBotMessage(fallbackResponse);
            } else {
                this.hideTyping();
                this.addBotMessage(data.response);
            }
            
        } catch (error) {
            console.error('Error en chatbot:', error);
            this.hideTyping();
            const fallbackResponse = "😊 Lo siento, Akira no puede conectarse en este momento. Por favor, intenta de nuevo más tarde. 🌊";
            this.addBotMessage(fallbackResponse);
        }
    }

    // ========== ABRIR/CERRAR CHAT ==========
    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.window.classList.add('open');
            const tip = document.querySelector('.cb-tip-tooltip:not(.cb-tip-tooltip--mandatory)');
            if (tip) {
                tip.style.transition = 'all 0.3s ease';
                tip.style.opacity = '0';
                tip.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    if (tip.parentElement) tip.remove();
                    clearTimeout(this.tipTimeout);
                }, 300);
            }
            setTimeout(() => { if (this.input) this.input.focus(); }, 400);
        } else {
            this.window.classList.remove('open');
            if (this.window.style.left !== '' && this.window.style.left !== 'auto') {
                setTimeout(() => {
                    this.window.style.left = '';
                    this.window.style.right = '';
                    this.window.style.top = '';
                    this.window.style.bottom = '';
                    this.window.style.position = 'fixed';
                }, 400);
            }
        }
    }

    // ========== EVENTOS ==========
    addEventListeners() {
        document.getElementById('cbToggleBtn')?.addEventListener('click', (e) => { e.stopPropagation(); this.toggleChat(); });
        document.getElementById('cbCloseBtn')?.addEventListener('click', (e) => { e.stopPropagation(); this.toggleChat(); });
        this.notificationsToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.setTipsMuted(!this.tipsMuted);
        });
        document.addEventListener('blueeco:akira-notification', (event) => {
            const detail = event.detail || {};
            this.showMandatoryNotification(detail.message, detail);
        });
        document.getElementById('cbSendBtn')?.addEventListener('click', () => { this.processMessage(this.input.value); });
        this.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.processMessage(this.input.value); }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) { this.toggleChat(); }
        });
    }
}

// ========== INICIALIZACIÓN GLOBAL ==========
document.addEventListener('DOMContentLoaded', () => {
    if (!window.chatbotInitialized) {
        let userName = null;
        const userElement = document.querySelector('[data-username]') || document.querySelector('.user-name');
        if (userElement) {
            userName = userElement.getAttribute('data-username') || userElement.textContent.trim();
        }
        window.chatbot = new Chatbot(userName);
        window.chatbotInitialized = true;
        console.log('🐋 Akira (Chatbot IA) inicializado correctamente');
    }
});
