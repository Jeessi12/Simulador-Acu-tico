/**
 * CHATBOT ASISTENTE - Blue EcoSim
 * Versión con rebote simultáneo al aparecer y desaparecer el consejo
 */

class Chatbot {
    constructor(currentUser = null) {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.currentUser = currentUser;
        this.toggleBtn = null;
        this.toggleIcon = null;
        this.resettingIcon = false;

        this.knowledgeBase = this.buildKnowledgeBase();
        this.tips = this.buildTips();

        this.init();
        this.startRandomTips();
    }

    // ========== BASE DE CONOCIMIENTO COMPLETA ==========
    buildKnowledgeBase() {
        return [
            // Registro y login
            { keywords: ['registrar', 'registrarme', 'crear cuenta', 'registro', 'como me registro'], response: "📝 Para registrarte en Blue EcoSim:\n\n1. Haz clic en 'Registrate' en la barra superior\n2. Completa: email, nombre de usuario, contraseña\n3. Selecciona tu rol (Estudiante/Docente/Personal)\n4. Recibirás un correo de verificación\n5. Haz clic en el enlace del correo para activar tu cuenta\n\n⚠️ Revisa tu bandeja de spam si no ves el correo." },
            { keywords: ['iniciar sesión', 'login', 'entrar', 'acceder', 'ingresar', 'loguear'], response: "🔐 Para iniciar sesión:\n\n1. Haz clic en 'Iniciar Sesión' en el navbar\n2. Ingresa tu email y contraseña\n3. También puedes acceder con Google\n\nSi tu cuenta no está verificada, revisa tu correo para activarla." },
            { keywords: ['contraseña', 'olvide contraseña', 'recuperar contraseña', 'resetear password'], response: "🔑 ¿Olvidaste tu contraseña?\n\nPor ahora, contacta a tu profesor o administrador. Pronto añadiremos recuperación automática por correo electrónico." },
            { keywords: ['verificar', 'verificación', 'activar cuenta', 'correo verificación'], response: "✉️ ¿No recibiste el correo de verificación?\n\n• Revisa tu bandeja de spam/correo no deseado\n• Solicita un nuevo enlace desde registro\n• Contacta a soporte si persiste el problema" },
            { keywords: ['google', 'iniciar con google', 'google login'], response: "🌐 Puedes iniciar sesión con Google:\n\n• Haz clic en 'Iniciar sesión con Google'\n• Selecciona tu cuenta\n• Si es tu primera vez, elige tu rol\n• ¡Listo! Tu cuenta se vinculará automáticamente" },
            // Roles
            { keywords: ['rol', 'roles', 'diferencia roles', 'estudiante', 'docente', 'personal'], response: "👥 Blue EcoSim tiene 3 roles principales:\n\n🎓 **Estudiante**: Accede a simulaciones asignadas por docentes, completa tareas, ve tu progreso.\n\n👨‍🏫 **Docente**: Crea espacios virtuales, invita estudiantes, asigna simulaciones, revisa tareas.\n\n🐠 **Personal**: Uso individual sin asignaciones, explora libremente todas las simulaciones." },
            { keywords: ['cambiar rol', 'modificar rol', 'otro rol'], response: "🔄 Para cambiar tu rol, contacta a un administrador del sistema. Ellos pueden modificar tu tipo de cuenta según tus necesidades." },
            // Simulador
            { keywords: ['simulación', 'simular', 'empezar simulación', 'iniciar simulación'], response: "🎮 Para iniciar una simulación:\n\n• Ve a la pestaña 'SIMULACION' en el menú\n• O desde 'ASIGNACIONES' si tu profesor te asignó una tarea\n• Usa los controles: Play ▶️, Pause ⏸️, Reset 🔄\n• Escribe observaciones mientras experimentas" },
            { keywords: ['ecosistema', 'tipos simulaciones', 'que simulaciones hay'], response: "🌊 Tipos de simulaciones disponibles:\n\n• **Ecosistema básico**: Arrecife de coral con especies comunes\n• **Cadena alimenticia**: Relación depredador-presa en el océano\n• **Contaminación marina**: Efectos de residuos en el ecosistema\n\n¡Próximamente más escenarios!" },
            { keywords: ['controles simulador', 'como usar simulador', 'botones simulador'], response: "🎮 Controles del simulador:\n\n• ▶️ **Play**: Inicia o reanuda la simulación\n• ⏸️ **Pause**: Pausa el tiempo de simulación\n• 🔄 **Reset**: Reinicia el ecosistema a valores iniciales\n• 📝 **Observaciones**: Guarda notas sobre lo que observas\n• 🖥️ **Expandir**: Pantalla completa" },
            // Espacios
            { keywords: ['espacio', 'espacios', 'aula virtual', 'unirse a espacio'], response: "🏫 Los **Espacios** son aulas virtuales:\n\n🔹 **Como estudiante**:\n• Usa el código de 6 caracteres que te dio tu profesor\n• O acepta la invitación en notificaciones\n\n🔹 **Como docente**:\n• Crea espacios desde 'ESPACIOS'\n• Invita estudiantes por email\n• Comparte el código único del aula" },
            { keywords: ['código espacio', 'código aula', 'unirse código'], response: "🔑 ¿Cómo unirse con código?\n\n1. Ve a la sección 'Unirse a un espacio'\n2. Ingresa el código de 6 caracteres (mayúsculas/números)\n3. Los campos avanzan automáticamente\n4. Haz clic en 'Unirse al espacio'\n\n💡 El código lo genera automáticamente el sistema." },
            { keywords: ['crear espacio', 'nuevo espacio', 'crear aula'], response: "🏗️ Para crear un espacio (solo docentes):\n\n1. Ve a la pestaña 'ESPACIOS'\n2. Escribe el nombre del espacio\n3. Selecciona una imagen de fondo\n4. Haz clic en 'Crear espacio'\n5. Comparte el código o invita estudiantes directamente" },
            // Asignaciones
            { keywords: ['asignaciones', 'tareas', 'mis tareas', 'simulaciones asignadas'], response: "📋 En 'ASIGNACIONES' encuentras:\n\n• **Simulaciones pendientes**: Las que debes realizar\n• **En progreso**: Las que empezaste pero no terminaste\n• **Completadas**: Las que ya finalizaste\n• **Progreso general**: Porcentaje de avance total\n\n✅ Marca 'Completar' cuando termines una simulación" },
            { keywords: ['progreso', 'avance', 'porcentaje', 'completadas'], response: "📊 Tu progreso se muestra en:\n\n• Tarjeta de progreso (anillo circular)\n• Número de simulaciones totales\n• Simulaciones completadas vs pendientes\n\n💡 ¡Completa todas tus asignaciones para obtener insignias!" },
            // Especies
            { keywords: ['especies', 'animales marinos', 'catálogo especies', 'ver especies'], response: "🐠 En la sección 'ESPECIES' puedes:\n\n• Ver modelos 3D interactivos de animales marinos\n• Rotar y hacer zoom en cada especie\n• Guardar tus favoritas (❤️)\n• Crear notas de estudio\n• Filtrar por categoría: Peces, Tortugas, Crustáceos, Moluscos" },
            { keywords: ['modelo 3d', 'ver en 3d', 'girar modelo'], response: "🖱️ Controles del visor 3D:\n\n• **Click + arrastrar**: Rotar el modelo\n• **Click derecho + arrastrar**: Mover cámara\n• **Scroll**: Acercar/alejar zoom\n• **Auto-rotación**: El modelo gira solo" },
            { keywords: ['favoritos', 'guardar favoritos', 'mis favoritos'], response: "❤️ Para guardar especies favoritas:\n\n1. Ve al detalle de cualquier especie\n2. Haz clic en el botón ❤️ 'Agregar a favoritos'\n3. Accede a todos tus favoritos desde el menú 'Favoritos'" },
            { keywords: ['notas', 'mis notas', 'tomar notas', 'apuntes'], response: "📝 La sección 'Notas' te permite:\n\n• Crear notas de estudio sobre especies\n• Editar y eliminar notas\n• Cada nota se guarda automáticamente\n• Puedes asociar notas a especies específicas" },
            // Otros
            { keywords: ['notificaciones', 'campana', 'invitaciones'], response: "🔔 En el ícono de campana (🔔) del navbar:\n\n• Recibirás invitaciones a espacios\n• Nuevas simulaciones asignadas\n• Estados de tus tareas\n• Puedes filtrar por: Recibidos, Destacados, No leídos" },
            { keywords: ['perfil', 'mi perfil', 'editar perfil', 'ver perfil'], response: "👤 Tu perfil muestra:\n\n• Nombre de usuario y email\n• Rol actual (Estudiante/Docente/Personal)\n• Fecha de último acceso\n• Próximamente: insignias y estadísticas" },
            { keywords: ['cerrar sesión', 'logout', 'salir'], response: "🚪 Para cerrar sesión:\n\n1. Haz clic en tu avatar en el navbar\n2. Selecciona 'Cerrar Sesión'\n3. Serás redirigido a la página principal" },
            { keywords: ['sobre nosotros', 'nosotros', 'quienes somos', 'que es blue ecosim'], response: "🌊 **Blue EcoSim** es un simulador interactivo de ecosistemas marinos creado con fines educativos.\n\n🎯 **Objetivo**: Experimentar con diferentes parámetros del entorno para observar cómo cambian las especies y el equilibrio del ecosistema.\n\n💡 **Ideal para**: Estudiantes, docentes y amantes de la biología marina." },
            { keywords: ['ayuda', 'soporte', 'problema técnico', 'error', 'bug'], response: "🆘 ¿Tienes problemas técnicos?\n\n1. Intenta recargar la página\n2. Limpia la caché de tu navegador\n3. Contacta a tu profesor\n4. Escribe a: soporte@blueecosim.com" },
            { keywords: ['hola', 'buenas', 'saludos', 'buenos días'], response: "👋 ¡Hola! Soy el asistente de Blue EcoSim. Pregúntame sobre registro, simulaciones, especies o cualquier duda de la plataforma. ¿En qué puedo ayudarte hoy? 🐙" },
            { keywords: ['gracias', 'thanks', 'buen trabajo'], response: "🌟 ¡De nada! Me alegra poder ayudarte. Sigue explorando el maravilloso mundo marino. ¿Necesitas algo más? 🐠" },
            { keywords: ['adiós', 'chao', 'bye', 'hasta luego'], response: "👋 ¡Hasta luego! Sigue sumergiéndote en el conocimiento marino. Cuando necesites ayuda, aquí estoy. ¡Que tengas un gran día! 🌊" }
        ];
    }

    buildTips() {
        return [
            "💡 ¿Sabías que puedes ver modelos 3D de animales marinos en la sección 'ESPECIES'? ¡Pruébalo!",
            "🎓 Si eres estudiante, revisa 'ASIGNACIONES' para ver las tareas que te asignó tu profesor.",
            "🏫 Los docentes pueden crear espacios virtuales y asignar simulaciones a toda la clase.",
            "🔔 El ícono de campana te muestra todas tus notificaciones e invitaciones pendientes.",
            "❤️ Guarda tus especies favoritas en 'Favoritos' para acceder rápido a ellas.",
            "📝 Crea notas de estudio en cada especie para recordar datos importantes.",
            "🎮 En el simulador puedes pausar, reiniciar y escribir observaciones en tiempo real.",
            "🖱️ En los modelos 3D puedes arrastrar para rotar y hacer scroll para zoom.",
            "🔑 Si eres estudiante, pide el código de 6 caracteres a tu profesor para unirte a un espacio.",
            "🐠 En 'ESPECIES' puedes filtrar por categoría: peces, tortugas, crustáceos o moluscos.",
            "📊 Tu progreso se muestra con un anillo circular en la sección 'ASIGNACIONES'.",
            "🌊 Hay 3 tipos de simulaciones: ecosistema básico, cadena alimenticia y contaminación marina.",
            "✨ Puedes iniciar sesión con Google para vincular tu cuenta fácilmente.",
            "📧 Si no recibes el correo de verificación, revisa tu bandeja de spam.",
            "🎯 Completa todas tus simulaciones para desbloquear insignias (próximamente).",
            "🧑‍🏫 Los docentes pueden ver el progreso de sus estudiantes en cada simulación.",
            "🔄 En el simulador, el botón reset reinicia el ecosistema a su estado inicial.",
            "🗺️ En el footer (pie de página) están nuestras redes sociales y 'Sobre Nosotros'.",
            "💬 ¡Puedes preguntarme cualquier cosa! Estoy aquí para ayudarte 24/7.",
            "🎉 ¿Terminaste una simulación? No olvides marcarla como 'Completada' en tus asignaciones.",
            "👥 Cada rol (Estudiante/Docente/Personal) tiene acceso a diferentes secciones.",
            "📱 Blue EcoSim se adapta a dispositivos móviles, ¡pruébalo desde tu celular!",
            "🔐 Tu cuenta necesita verificación por correo antes del primer inicio de sesión.",
            "🏆 Próximamente habrá insignias por logros completados."
        ];
    }

    init() {
        this.createDOM();
        this.loadMessages();
        this.addEventListeners();
        this.makeDraggable();

        if (this.messages.length === 0) {
            let welcomeMsg = "🐙 ¡Hola! Soy tu asistente virtual de Blue EcoSim.\n\nPregúntame cualquier cosa sobre:\n• 📝 Registro e inicio de sesión\n• 🎮 Simulaciones interactivas\n• 🐠 Especies marinas 3D\n• 🏫 Espacios y asignaciones\n• ❤️ Favoritos y notas\n\n¿En qué puedo ayudarte hoy? 🌊";
            if (this.currentUser) {
                welcomeMsg = `🐙 ¡Hola ${this.currentUser}! Bienvenido de vuelta a Blue EcoSim.\n\n¿Necesitas ayuda con algo? Puedo orientarte sobre:\n• 📝 Registro y cuenta\n• 🎮 Simulaciones\n• 🐠 Especies marinas\n• 🏫 Tus espacios\n\n¿Qué te gustaría saber? 🌊`;
            }
            this.addBotMessage(welcomeMsg);
            this.addSuggestions();
        }
    }

    createDOM() {
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.innerHTML = `
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header" id="chatbotHeader">
                    <h3><i class="fas fa-robot"></i> Asistente EcoSim</h3>
                    <div class="chatbot-header-actions">
                        <button class="chatbot-close" id="chatbotCloseBtn"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                <div class="chatbot-messages" id="chatbotMessages"></div>
                <div class="chatbot-input">
                    <input type="text" id="chatbotInput" placeholder="Escribe tu pregunta aquí..." autocomplete="off">
                    <button id="chatbotSendBtn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <button class="chatbot-toggle" id="chatbotToggleBtn">
                <i class="fas fa-robot"></i>
                <span class="chatbot-badge" id="chatbotBadge">●</span>
            </button>
        `;
        document.body.appendChild(container);
        this.window = document.getElementById('chatbotWindow');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.badge = document.getElementById('chatbotBadge');
        this.toggleBtn = document.getElementById('chatbotToggleBtn');
        this.toggleIcon = this.toggleBtn?.querySelector('i');
    }

    makeDraggable() {
        const header = document.getElementById('chatbotHeader');
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.chatbot-header-actions')) return;
            isDragging = true;
            offsetX = e.clientX - this.window.getBoundingClientRect().left;
            offsetY = e.clientY - this.window.getBoundingClientRect().top;
            this.window.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let left = e.clientX - offsetX;
            let top = e.clientY - offsetY;
            left = Math.max(10, Math.min(left, window.innerWidth - this.window.offsetWidth - 10));
            top = Math.max(10, Math.min(top, window.innerHeight - this.window.offsetHeight - 10));
            this.window.style.position = 'fixed';
            this.window.style.left = `${left}px`;
            this.window.style.right = 'auto';
            this.window.style.top = `${top}px`;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.window.style.transition = '';
        });
    }

    startRandomTips() {
        setTimeout(() => this.showRandomTip(), 15000);
        setInterval(() => this.showRandomTip(), 50000 + Math.random() * 20000);
    }

    /**
     * Activa o desactiva la animación del ícono.
     * @param {boolean} active - true = mostrar animación (rebote + cambio a comentario)
     *                            false = ocultar animación (rebote + restauración a robot)
     */
    animateIcon(active) {
        if (!this.toggleBtn || !this.toggleIcon) return;
        if (active) {
            if (this.resettingIcon) return;
            this.toggleBtn.classList.add('bounce');
            this.toggleIcon.className = 'fas fa-comment-dots';
            this.toggleBtn.classList.add('tip-active');
            setTimeout(() => {
                if (this.toggleBtn) this.toggleBtn.classList.remove('bounce');
            }, 500);
        } else {
            if (this.resettingIcon) return;
            this.resettingIcon = true;
            // Cambio de icono y rebote simultáneos
            this.toggleIcon.className = 'fas fa-robot';
            this.toggleBtn.classList.add('bounce');
            this.toggleBtn.classList.remove('tip-active');
            setTimeout(() => {
                if (this.toggleBtn) this.toggleBtn.classList.remove('bounce');
                this.resettingIcon = false;
            }, 500);
        }
    }

    showRandomTip() {
        if (this.isOpen) return;
        const randomTip = this.tips[Math.floor(Math.random() * this.tips.length)];
        const toggleBtn = this.toggleBtn;
        if (!toggleBtn) return;

        const existingTip = document.querySelector('.chatbot-tip-tooltip');
        if (existingTip) existingTip.remove();

        const tooltip = document.createElement('div');
        tooltip.className = 'chatbot-tip-tooltip';
        tooltip.innerHTML = `
            <div class="tip-title"><i class="fas fa-lightbulb"></i> ¿Sabías que...?<button class="tip-close"><i class="fas fa-times"></i></button></div>
            <div class="tip-text">${randomTip}</div>
        `;
        toggleBtn.parentElement.appendChild(tooltip);
        this.animateIcon(true);

        const resetTimer = setTimeout(() => {
            if (tooltip.parentElement) tooltip.remove();
            this.animateIcon(false);
        }, 10000);

        tooltip.querySelector('.tip-close').addEventListener('click', () => {
            clearTimeout(resetTimer);
            tooltip.remove();
            this.animateIcon(false);
        });
    }

    addSuggestions() {
        const suggestions = ["¿Cómo me registro?", "¿Qué son los espacios?", "¿Cómo inicio una simulación?", "¿Dónde veo mis tareas?", "¿Qué especies hay?"];
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggestions';
        suggestions.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-btn';
            btn.textContent = text;
            btn.addEventListener('click', () => { this.input.value = text; this.processMessage(text); });
            suggestionsDiv.appendChild(btn);
        });
        this.messagesContainer.appendChild(suggestionsDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    loadMessages() {
        const saved = localStorage.getItem('chatbot_messages');
        if (saved) { this.messages = JSON.parse(saved); this.renderMessages(); }
    }
    saveMessages() {
        if (this.messages.length > 50) this.messages = this.messages.slice(-50);
        localStorage.setItem('chatbot_messages', JSON.stringify(this.messages));
    }
    renderMessages() {
        if (!this.messagesContainer) return;
        this.messagesContainer.innerHTML = '';
        this.messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message message-${msg.sender}`;
            div.innerHTML = msg.text.replace(/\n/g, '<br>');
            this.messagesContainer.appendChild(div);
        });
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    addUserMessage(text) { this.messages.push({ sender: 'user', text, timestamp: Date.now() }); this.renderMessages(); this.saveMessages(); }
    addBotMessage(text) { this.messages.push({ sender: 'bot', text, timestamp: Date.now() }); this.renderMessages(); this.saveMessages(); }
    showTyping() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    hideTyping() { const indicator = document.getElementById('typingIndicator'); if (indicator) indicator.remove(); this.isTyping = false; }

    getResponse(question) {
        const lowerQuestion = question.toLowerCase();
        for (const item of this.knowledgeBase) {
            for (const keyword of item.keywords) {
                if (lowerQuestion.includes(keyword.toLowerCase())) return item.response;
            }
        }
        return "🤔 No estoy seguro de entender tu pregunta.\n\n💡 Prueba preguntarme:\n\n• ¿Cómo me registro?\n• ¿Qué son los espacios?\n• ¿Cómo inicio una simulación?\n• ¿Dónde veo mis tareas?\n• ¿Qué especies hay?\n• ¿Cómo me contacto con soporte?";
    }

    async processMessage(question) {
        if (!question.trim()) return;
        this.addUserMessage(question);
        this.input.value = '';
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.addBotMessage(this.getResponse(question));
        }, 600 + Math.random() * 400);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.window.classList.add('open');
            this.input.focus();
            this.badge.style.opacity = '0.5';
            const tip = document.querySelector('.chatbot-tip-tooltip');
            if (tip) { tip.remove(); this.animateIcon(false); }
        } else {
            this.window.classList.remove('open');
            if (this.window.style.left) {
                setTimeout(() => {
                    this.window.style.left = '';
                    this.window.style.right = '';
                    this.window.style.top = '';
                    this.window.style.bottom = '';
                }, 300);
            }
        }
    }

    addEventListeners() {
        document.getElementById('chatbotToggleBtn')?.addEventListener('click', () => this.toggleChat());
        document.getElementById('chatbotCloseBtn')?.addEventListener('click', () => this.toggleChat());
        document.getElementById('chatbotSendBtn')?.addEventListener('click', () => this.processMessage(this.input.value));
        this.input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.processMessage(this.input.value); });
    }
}

// Inicialización global
document.addEventListener('DOMContentLoaded', () => {
    if (!window.chatbotInitialized) {
        window.chatbot = new Chatbot(window.currentUserName || null);
        window.chatbotInitialized = true;
    }
});