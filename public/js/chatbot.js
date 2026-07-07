/**
 * CHATBOT ASISTENTE - Blue EcoSim
 * Estructura mejorada: Sugerencias arriba, sin consejos en el chat
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
        this.expressionTimeout = null;
        this.typingTimeout = null;
        this.consejos = this.loadConsejos() || [];
        this.isDragging = false;
        this.messageId = 0;
        this.suggestionIndex = 0;

        this.knowledgeBase = this.buildKnowledgeBase();
        this.tips = this.buildTips();

        this.init();
        this.startRandomTips();
    }

    // ========== PERSISTENCIA ==========
    loadConsejos() {
        try {
            const data = localStorage.getItem('chatbot_consejos');
            return data ? JSON.parse(data) : null;
        } catch { return null; }
    }
    
    saveConsejos() {
        try {
            localStorage.setItem('chatbot_consejos', JSON.stringify(this.consejos));
        } catch {}
    }

    // ========== BASE DE CONOCIMIENTO ==========
    buildKnowledgeBase() {
        return [
            // ===== REGISTRO Y LOGIN =====
            { 
                keywords: ['registrar', 'registrarme', 'crear cuenta', 'registro', 'como me registro', 'registrate'], 
                response: `📝 **Cómo registrarte en Blue EcoSim**

━━━━━━━━━━━━━━━━━━━━━━━━

**Pasos a seguir:**

1️⃣ Haz clic en 'Registrate' en la barra superior
2️⃣ Completa: email, nombre de usuario, contraseña
3️⃣ Selecciona tu rol (Estudiante/Docente/Personal)
4️⃣ Recibirás un correo de verificación
5️⃣ Haz clic en el enlace del correo para activar tu cuenta

━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **Importante:** Revisa tu bandeja de spam si no ves el correo.

¿Necesitas más ayuda con el registro?`
            },
            
            { 
                keywords: ['iniciar sesión', 'login', 'entrar', 'acceder', 'ingresar', 'loguear', 'iniciar sesion'], 
                response: `🔐 **Iniciar sesión en Blue EcoSim**

━━━━━━━━━━━━━━━━━━━━━━━━

**Acceso rápido:**

1️⃣ Haz clic en 'Iniciar Sesión' en el navbar
2️⃣ Ingresa tu email y contraseña
3️⃣ También puedes acceder con Google

━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Consejo:** Si tu cuenta no está verificada, revisa tu correo para activarla.

¿Problemas para entrar? Pregúntame sobre recuperación de contraseña.`
            },
            
            { 
                keywords: ['contraseña', 'olvide contraseña', 'recuperar contraseña', 'resetear password', 'olvidé mi contraseña'], 
                response: `🔑 **¿Olvidaste tu contraseña?**

━━━━━━━━━━━━━━━━━━━━━━━━

**Solución por ahora:**

📞 Contacta a tu profesor o administrador del sistema.

📧 Ellos podrán ayudarte a restablecer tu acceso.

━━━━━━━━━━━━━━━━━━━━━━━━

✨ **Próximamente:** Añadiremos recuperación automática por correo electrónico.

¿Tienes otra duda? ¡Pregúntame!`
            },
            
            { 
                keywords: ['verificar', 'verificación', 'activar cuenta', 'correo verificación', 'token', 'verificar cuenta'], 
                response: `✉️ **¿No recibiste el correo de verificación?**

━━━━━━━━━━━━━━━━━━━━━━━━

**Pasos a seguir:**

📬 Revisa tu bandeja de spam/correo no deseado

🔄 Solicita un nuevo enlace desde la página de registro

📧 Contacta a soporte si persiste el problema

━━━━━━━━━━━━━━━━━━━━━━━━

**Soporte:** soporte@blueecosim.com

¿Necesitas más ayuda con la verificación?`
            },
            
            { 
                keywords: ['google', 'iniciar con google', 'google login', 'oauth', 'entrar con google'], 
                response: `🌐 **Iniciar sesión con Google**

━━━━━━━━━━━━━━━━━━━━━━━━

**Es muy fácil:**

1️⃣ Haz clic en 'Iniciar sesión con Google'
2️⃣ Selecciona tu cuenta de Google
3️⃣ Si es tu primera vez, elige tu rol
4️⃣ ¡Listo! Tu cuenta se vinculará automáticamente

━━━━━━━━━━━━━━━━━━━━━━━━

✨ **Ventaja:** No necesitas recordar otra contraseña.

¿Te funciona el inicio con Google?`
            },
            
            { 
                keywords: ['cerrar sesión', 'logout', 'salir', 'desconectar', 'cerrar sesion'], 
                response: `🚪 **Cerrar sesión en Blue EcoSim**

━━━━━━━━━━━━━━━━━━━━━━━━

**Simplemente:**

1️⃣ Haz clic en tu avatar en el navbar
2️⃣ Selecciona 'Cerrar Sesión'
3️⃣ Serás redirigido a la página principal

━━━━━━━━━━━━━━━━━━━━━━━━

🔒 **Consejo de seguridad:** Siempre cierra sesión en dispositivos compartidos.

¿Listo para volver a entrar?`
            },
            
            { 
                keywords: ['perfil', 'mi perfil', 'editar perfil', 'ver perfil', 'avatar', 'cambiar foto'], 
                response: `👤 **Tu perfil en Blue EcoSim**

━━━━━━━━━━━━━━━━━━━━━━━━

**Información disponible:**

• 👤 Nombre de usuario y email
• 🎭 Rol actual (Estudiante/Docente/Personal)
• 📅 Fecha de último acceso
• 🏆 Próximamente: insignias y estadísticas

━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Próximamente:** Podrás editar tu foto de perfil.

¿Quieres saber más sobre tu perfil?`
            },

            // ===== ROLES =====
            { 
                keywords: ['rol', 'roles', 'diferencia roles', 'estudiante', 'docente', 'personal', 'tipos de usuario', 'que rol soy'], 
                response: `👥 **Los 3 roles de Blue EcoSim**

━━━━━━━━━━━━━━━━━━━━━━━━

🎓 **Estudiante**
• Accede a simulaciones asignadas por docentes
• Completa tareas y ve su progreso
• Guarda especies favoritas y notas

━━━━━━━━━━━━━━━━━━━━━━━━

👨‍🏫 **Docente**
• Crea espacios virtuales (aulas)
• Invita estudiantes por email o código
• Asigna simulaciones y revisa tareas

━━━━━━━━━━━━━━━━━━━━━━━━

🐠 **Personal**
• Uso individual sin asignaciones
• Explora libremente todas las simulaciones
• Ideal para aprendizaje autodidacta

━━━━━━━━━━━━━━━━━━━━━━━━

¿Qué rol tienes actualmente?`
            },
            
            { 
                keywords: ['cambiar rol', 'modificar rol', 'otro rol', 'cambio de rol'], 
                response: `🔄 **Cambiar tu rol en la plataforma**

━━━━━━━━━━━━━━━━━━━━━━━━

**Procedimiento:**

📧 Contacta a un administrador del sistema

✉️ Ellos pueden actualizar tu tipo de cuenta

━━━━━━━━━━━━━━━━━━━━━━━━

📬 **Contacto:** administracion@blueecosim.com

¿Necesitas ayuda con otra cosa?`
            },
            
            { 
                keywords: ['que puedo hacer como estudiante', 'permisos estudiante', 'estudiante'], 
                response: `🎓 **Permisos de Estudiante**

━━━━━━━━━━━━━━━━━━━━━━━━

**Lo que puedes hacer:**

✅ Ver y completar simulaciones asignadas
✅ Unirte a espacios con código
✅ Guardar especies favoritas y notas
✅ Ver tu progreso general
✅ Dejar observaciones en las simulaciones

━━━━━━━━━━━━━━━━━━━━━━━━

📊 **Tu progreso:** Se muestra en un anillo circular en 'ASIGNACIONES'.

¿Listo para empezar tus tareas?`
            },
            
            { 
                keywords: ['que puedo hacer como docente', 'permisos docente', 'docente'], 
                response: `👨‍🏫 **Permisos de Docente**

━━━━━━━━━━━━━━━━━━━━━━━━

**Lo que puedes hacer:**

✅ Crear espacios virtuales (aulas)
✅ Invitar estudiantes por email o código
✅ Asignar simulaciones a estudiantes o espacios
✅ Ver el progreso de tus estudiantes
✅ Revisar las observaciones que dejan

━━━━━━━━━━━━━━━━━━━━━━━━

📚 **Gestión:** Desde la sección 'ESPACIOS' puedes administrar todo.

¿Quieres crear un nuevo espacio?`
            },

            // ===== SIMULADOR =====
            { 
                keywords: ['simulación', 'simular', 'empezar simulación', 'iniciar simulación', 'ejecutar simulador', 'entrar a simulación'], 
                response: `🎮 **Iniciar una simulación**

━━━━━━━━━━━━━━━━━━━━━━━━

**Acceso rápido:**

📌 Ve a la pestaña 'SIMULACION' en el menú
📌 O desde 'ASIGNACIONES' si tu profesor te asignó una tarea

━━━━━━━━━━━━━━━━━━━━━━━━

**Controles básicos:**

▶️ **Play:** Inicia o reanuda
⏸️ **Pause:** Pausa el tiempo
🔄 **Reset:** Reinicia el ecosistema
📝 **Observaciones:** Guarda notas en tiempo real

━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Consejo:** Escribe observaciones mientras experimentas.

¿Quieres saber más sobre los controles?`
            },
            
            { 
                keywords: ['ecosistema', 'tipos simulaciones', 'que simulaciones hay', 'modalidades', 'tipos de simulacion'], 
                response: `🌊 **Tipos de simulaciones disponibles**

━━━━━━━━━━━━━━━━━━━━━━━━

🐠 **Ecosistema básico**
Arrecife de coral con especies comunes (Pez Lora, Pez Ángel, Tortuga Carey)

🦈 **Cadena alimenticia**
Relación depredador-presa en el océano

🌍 **Contaminación marina**
Efectos de residuos en el ecosistema

━━━━━━━━━━━━━━━━━━━━━━━━

✨ **Próximamente:** Más escenarios como manglares y océano profundo.

¿Cuál te gustaría probar?`
            },
            
            { 
                keywords: ['controles simulador', 'como usar simulador', 'botones simulador', 'controles', 'que hacen los botones'], 
                response: `🎮 **Guía de controles del simulador**

━━━━━━━━━━━━━━━━━━━━━━━━

**Botones principales:**

▶️ **Play:** Inicia o reanuda la simulación
⏸️ **Pause:** Pausa el tiempo de simulación
🔄 **Reset:** Reinicia el ecosistema a valores iniciales
📝 **Observaciones:** Guarda notas sobre lo que observas
🖥️ **Expandir:** Pantalla completa

━━━━━━━━━━━━━━━━━━━━━━━━

⌨️ **Atajo:** Presiona 'Espacio' para pausar/reanudar.

¿Alguna duda sobre los controles?`
            },
            
            { 
                keywords: ['temperatura', 'salinidad', 'oxígeno', 'parámetros', 'ajustar', 'cambiar temperatura'], 
                response: `🌡️ **Parámetros ambientales ajustables**

━━━━━━━━━━━━━━━━━━━━━━━━

**🌡️ Temperatura** (15-35°C)
Afecta el metabolismo de las especies

**🧂 Salinidad** (30-40 PSU)
Influye en la osmorregulación

**💨 Oxígeno disuelto** (4-10 mg/L)
Esencial para la respiración

**☣️ Contaminación** (0-100%)
Afecta la salud del ecosistema

━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **Importante:** Cambios bruscos pueden estresar a las especies.

¿Quieres saber cómo afectan estos parámetros?`
            },
            
            { 
                keywords: ['observaciones', 'guardar observación', 'escribir observación', 'comentario', 'observacion'], 
                response: `📝 **Guardar observaciones en el simulador**

━━━━━━━━━━━━━━━━━━━━━━━━

**Pasos para guardar:**

1️⃣ Escribe tu comentario en el campo de texto
2️⃣ Presiona Enter o el botón de enviar
3️⃣ La observación se guarda automáticamente
4️⃣ Tu docente podrá verla en la asignación

━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Importante:** Las observaciones son clave para tu evaluación. ¡Sé detallado!

¿Tienes una observación para compartir?`
            },
            
            { 
                keywords: ['salud', 'estrés', 'bienestar', 'estado biológico', 'estadísticas', 'estado de la especie'], 
                response: `📊 **Panel de 'Estado biológico'**

━━━━━━━━━━━━━━━━━━━━━━━━

**Métricas en tiempo real:**

❤️ **Salud:** Condición general (0-100%)
😰 **Estrés:** Nivel de presión ambiental (0-100%)
😊 **Bienestar:** Calidad de vida (0-100%)
🥚 **Etapa:** Huevo → Juvenil → Adulto → Anciano
⏱️ **Edad:** Tiempo de vida en segundos
👥 **Población:** Número de individuos

━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Monitorea** estos valores para entender el ecosistema.

¿Quieres saber más sobre las estadísticas?`
            },

            // ===== ESPACIOS =====
            { 
                keywords: ['espacio', 'espacios', 'aula virtual', 'unirse a espacio', 'clase virtual', 'aula'], 
                response: `🏫 **Los Espacios son aulas virtuales**

━━━━━━━━━━━━━━━━━━━━━━━━

**Como Estudiante:**
• Usa el código de 6 caracteres que te dio tu profesor
• O acepta la invitación en notificaciones

**Como Docente:**
• Crea espacios desde 'ESPACIOS'
• Invita estudiantes por email
• Comparte el código único del aula

━━━━━━━━━━━━━━━━━━━━━━━━

🔑 **Código:** Compuesto por letras y números (ej: A7B3C2)

¿Tienes un código para unirte?`
            },
            
            { 
                keywords: ['código espacio', 'código aula', 'unirse código', 'código de acceso', 'codigo'], 
                response: `🔑 **Unirse a un espacio con código**

━━━━━━━━━━━━━━━━━━━━━━━━

**Pasos:**

1️⃣ Ve a la sección 'Unirse a un espacio'
2️⃣ Ingresa el código de 6 caracteres (mayúsculas/números)
3️⃣ Los campos avanzan automáticamente
4️⃣ Haz clic en 'Unirse al espacio'

━━━━━━━━━━━━━━━━━━━━━━━━

💡 **El código** lo genera automáticamente el sistema basado en el ID del espacio.

¿Tienes el código de tu profesor?`
            },
            
            { 
                keywords: ['crear espacio', 'nuevo espacio', 'crear aula', 'nueva clase'], 
                response: `🏗️ **Crear un espacio (solo docentes)**

━━━━━━━━━━━━━━━━━━━━━━━━

**Pasos:**

1️⃣ Ve a la pestaña 'ESPACIOS'
2️⃣ Escribe el nombre del espacio
3️⃣ Selecciona una imagen de fondo
4️⃣ Haz clic en 'Crear espacio'
5️⃣ Comparte el código o invita estudiantes directamente

━━━━━━━━━━━━━━━━━━━━━━━━

✨ **Consejo:** Elige un nombre descriptivo para tu clase.

¿Necesitas ayuda para crear tu primer espacio?`
            },

            // ===== ASIGNACIONES =====
            { 
                keywords: ['asignaciones', 'tareas', 'mis tareas', 'simulaciones asignadas', 'deberes', 'tarea'], 
                response: `📋 **Tus asignaciones en Blue EcoSim**

━━━━━━━━━━━━━━━━━━━━━━━━

📌 **Pendientes:** Simulaciones que debes realizar
⏳ **En progreso:** Empezadas pero no terminadas
✅ **Completadas:** Ya finalizadas
📊 **Progreso general:** Porcentaje de avance total

━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Consejo:** Marca 'Completar' cuando termines una simulación.

¿Cuántas tareas tienes pendientes?`
            },
            
            { 
                keywords: ['progreso', 'avance', 'porcentaje', 'completadas', 'estadísticas', 'cuantas tareas'], 
                response: `📊 **Seguimiento de tu progreso**

━━━━━━━━━━━━━━━━━━━━━━━━

**Visualización:**

🎯 Tarjeta de progreso (anillo circular)
📊 Número de simulaciones totales
✅ Completadas vs pendientes
📈 Porcentaje de avance general

━━━━━━━━━━━━━━━━━━━━━━━━

🏆 **Objetivo:** ¡Completa todas tus asignaciones para obtener insignias!

¿Quieres saber cómo mejorar tu progreso?`
            },
            
            { 
                keywords: ['completar tarea', 'marcar completada', 'finalizar simulación', 'entregar', 'terminar'], 
                response: `✅ **Completar una simulación**

━━━━━━━━━━━━━━━━━━━━━━━━

**Pasos:**

1️⃣ Entra a la simulación desde 'ASIGNACIONES'
2️⃣ Debes haber dejado al menos una observación
3️⃣ Haz clic en el botón 'Completar'
4️⃣ La tarea pasará a 'Completada'

━━━━━━━━━━━━━━━━━━━━━━━━

📝 **Recuerda:** ¡Las observaciones son importantes para tu evaluación!

¿Listo para completar tu primera tarea?`
            },

            // ===== ESPECIES =====
            { 
                keywords: ['especies', 'animales marinos', 'catálogo especies', 'ver especies', 'fauna', 'que especies hay'], 
                response: `🐠 **Catálogo de especies marinas**

━━━━━━━━━━━━━━━━━━━━━━━━

**Características:**

📦 Modelos 3D interactivos
🔄 Rotación y zoom en cada especie
❤️ Guardar favoritas
📝 Crear notas de estudio
🔍 Filtrar por categoría

━━━━━━━━━━━━━━━━━━━━━━━━

**Categorías:**
🐟 Peces | 🐢 Tortugas | 🦞 Crustáceos | 🐚 Moluscos

━━━━━━━━━━━━━━━━━━━━━━━━

📊 **Datos:** Dieta, longevidad, peligro de extinción.

¿Quieres explorar las especies marinas?`
            },
            
            { 
                keywords: ['modelo 3d', 'ver en 3d', 'girar modelo', '3d', 'visualizar', 'ver animal en 3d'], 
                response: `🖱️ **Controles del visor 3D**

━━━━━━━━━━━━━━━━━━━━━━━━

**Interacción:**

🔄 **Click + arrastrar:** Rotar el modelo
📦 **Click derecho + arrastrar:** Mover cámara
🔍 **Scroll:** Acercar/alejar zoom
🔄 **Auto-rotación:** El modelo gira solo automáticamente

━━━━━━━━━━━━━━━━━━━━━━━━

✨ **Extra:** Cada especie tiene animaciones únicas.

¿Listo para explorar la fauna marina en 3D?`
            },
            
            { 
                keywords: ['favoritos', 'guardar favoritos', 'mis favoritos', 'favoritas', 'corazon'], 
                response: `❤️ **Guardar especies favoritas**

━━━━━━━━━━━━━━━━━━━━━━━━

**Pasos:**

1️⃣ Ve al detalle de cualquier especie
2️⃣ Haz clic en el botón ❤️ 'Agregar a favoritos'
3️⃣ Accede a todos tus favoritos desde el menú 'Favoritos'
4️⃣ Puedes quitar favoritos con el mismo botón

━━━━━━━━━━━━━━━━━━━━━━━━

💾 **Persistencia:** Los favoritos se guardan en tu cuenta.

¿Qué especie te gustaría agregar a favoritos?`
            },

            // ===== OTROS =====
            { 
                keywords: ['hola', 'buenas', 'saludos', 'buenos días', 'hey', 'que tal', 'hola como estas'], 
                response: `👋 ¡Hola! Soy tu asistente virtual de Blue EcoSim.

━━━━━━━━━━━━━━━━━━━━━━━━

🐙 Estoy aquí para ayudarte con todo lo relacionado a la plataforma.

**Puedes preguntarme sobre:**

• 📝 Registro e inicio de sesión
• 🎮 Simulaciones interactivas
• 🐠 Especies marinas
• 🏫 Espacios y asignaciones
• ❤️ Favoritos y notas

━━━━━━━━━━━━━━━━━━━━━━━━

¿En qué puedo ayudarte hoy? 🌊`
            },
            
            { 
                keywords: ['gracias', 'thanks', 'buen trabajo', 'excelente', 'genial', 'muchas gracias'], 
                response: `🌟 ¡De nada! Me alegra poder ayudarte.

━━━━━━━━━━━━━━━━━━━━━━━━

🐠 Sigue explorando el maravilloso mundo marino.

💡 Recuerda que cada simulación es una oportunidad de aprendizaje.

━━━━━━━━━━━━━━━━━━━━━━━━

¿Necesitas ayuda con algo más? ¡Estoy aquí para ti!`
            },
            
            { 
                keywords: ['adiós', 'chao', 'bye', 'hasta luego', 'nos vemos', 'adios'], 
                response: `👋 ¡Hasta luego!

━━━━━━━━━━━━━━━━━━━━━━━━

🌊 Sigue sumergiéndote en el conocimiento marino.

💙 Cuando necesites ayuda, aquí estaré para ti.

━━━━━━━━━━━━━━━━━━━━━━━━

**Recuerda:** Cada pequeña acción cuenta para la conservación de nuestros océanos. ¡Que tengas un excelente día!`
            },
            
            { 
                keywords: ['ayuda', 'soporte', 'problema técnico', 'error', 'bug', 'falla', 'no funciona'], 
                response: `🆘 **¿Problemas técnicos?**

━━━━━━━━━━━━━━━━━━━━━━━━

**Pasos a seguir:**

1️⃣ Recarga la página (F5 o Ctrl+R)
2️⃣ Limpia la caché de tu navegador
3️⃣ Contacta a tu profesor si es una asignación
4️⃣ Escribe a: soporte@blueecosim.com
5️⃣ Describe el problema con capturas de pantalla

━━━━━━━━━━━━━━━━━━━━━━━━

📱 **Incluye:** Navegador, sistema operativo y paso a paso del error.

¿Puedo ayudarte con algo más?`
            },
            
            { 
                keywords: ['empezar', 'como comienzo', 'primeros pasos', 'que hago primero'], 
                response: `🚀 **¡Bienvenido a Blue EcoSim!**

━━━━━━━━━━━━━━━━━━━━━━━━

**Si eres Estudiante:**

1️⃣ Busca el código de tu profesor y únete a un espacio
2️⃣ Ve a 'ASIGNACIONES' para ver tus tareas
3️⃣ Explora 'ESPECIES' para conocer la fauna marina
4️⃣ Inicia una simulación y experimenta

━━━━━━━━━━━━━━━━━━━━━━━━

**Si eres Docente:**

1️⃣ Crea espacios virtuales
2️⃣ Invita a tus estudiantes
3️⃣ Asigna simulaciones

━━━━━━━━━━━━━━━━━━━━━━━━

🌟 **¡Explora, aprende y diviértete!**

¿Listo para comenzar tu aventura marina?`
            }
        ];
    }

    // ========== CONSEJOS ==========
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
            "🏆 Próximamente habrá insignias por logros completados.",
            "🌡️ Ajusta la temperatura en el simulador para ver cómo reaccionan las especies al cambio climático.",
            "🧪 La simulación de contaminación te muestra cómo el plástico afecta a los ecosistemas marinos.",
            "🐟 El Pez Lora Gigante es el principal productor de arena en los arrecifes de coral.",
            "🐢 Las tortugas marinas regresan a la misma playa donde nacieron para anidar.",
            "🦞 Las langostas espinosas migran en fila, tomadas de las antenas, durante la noche.",
            "🐚 Los moluscos como el pulpo son considerados los invertebrados más inteligentes.",
            "🌿 Las praderas de pastos marinos son vitales para la reproducción de muchas especies.",
            "🔬 Cada especie tiene un rol en el ecosistema; si una desaparece, todo el sistema se afecta.",
            "📈 El simulador te muestra estadísticas en tiempo real de salud y estrés de las especies.",
            "🎓 Los docentes pueden asignar simulaciones personalizadas a cada estudiante.",
            "🔔 Marca tus notificaciones como leídas para mantener organizado tu panel.",
            "📚 Usa la sección 'Notas' para preparar tus exámenes de biología marina.",
            "🤖 Este chatbot fue diseñado para ayudarte con cualquier duda de la plataforma.",
            "💡 ¿El océano produce más del 50% del oxígeno que respiramos?",
            "🎯 Cada simulación tiene un objetivo de aprendizaje diferente: ¡descúbrelos todos!",
            "🔬 Puedes ajustar parámetros ambientales para ver cómo reaccionan las especies."
        ];
    }

    // ========== GESTOR DE EXPRESIONES ==========
    setExpression(state) {
        const imageMap = {
            contento:  '../public/media/Web/ballena-contento.png',
            feliz:     '../public/media/Web/ballena-feliz.png',
            hablando:  '../public/media/Web/ballena-hablando.png',
            buscando:  '../public/media/Web/ballena-buscando.png',
            confusion: '../public/media/Web/ballena-confusion.png'
        };
        
        if (!this.toggleIcon) return;
        
        const src = imageMap[state] || imageMap.contento;
        if (this.toggleIcon.src !== src) {
            this.toggleIcon.style.transition = 'opacity 0.3s ease';
            this.toggleIcon.style.opacity = '0';
            
            setTimeout(() => {
                this.toggleIcon.src = src;
                this.toggleIcon.style.opacity = '1';
            }, 150);
            
            this.toggleBtn.classList.add('bounce');
            setTimeout(() => {
                if (this.toggleBtn) this.toggleBtn.classList.remove('bounce');
            }, 400);
        }
        
        if (this.expressionTimeout) {
            clearTimeout(this.expressionTimeout);
            this.expressionTimeout = null;
        }
        
        if (state !== 'buscando' && state !== 'confusion' && state !== 'contento') {
            this.expressionTimeout = setTimeout(() => {
                this.setExpression('contento');
                this.expressionTimeout = null;
            }, 5000);
        }
    }

    // ========== AÑADIR CONSEJO ==========
    addConsejo(texto) {
        if (this.consejos.includes(texto)) return;
        this.consejos.push(texto);
        this.saveConsejos();
    }

    // ========== INICIALIZACIÓN ==========
    init() {
        this.createDOM();
        this.loadMessages();
        this.addEventListeners();
        this.makeDraggable();
        this.setupResizeHandler();

        if (this.messages.length === 0) {
            let welcomeMsg = `🐙 ¡Hola! Soy tu asistente virtual de Blue EcoSim.

━━━━━━━━━━━━━━━━━━━━━━━━

**Pregúntame cualquier cosa sobre:**

• 📝 Registro e inicio de sesión
• 🎮 Simulaciones interactivas
• 🐠 Especies marinas 3D
• 🏫 Espacios y asignaciones
• ❤️ Favoritos y notas

━━━━━━━━━━━━━━━━━━━━━━━━

¿En qué puedo ayudarte hoy? 🌊`;
            
            if (this.currentUser) {
                welcomeMsg = `🐙 ¡Hola ${this.currentUser}! Bienvenido de vuelta a Blue EcoSim.

━━━━━━━━━━━━━━━━━━━━━━━━

**¿Necesitas ayuda con algo?**

Puedo orientarte sobre:
• 📝 Registro y cuenta
• 🎮 Simulaciones
• 🐠 Especies marinas
• 🏫 Tus espacios

━━━━━━━━━━━━━━━━━━━━━━━━

¿Qué te gustaría saber? 🌊`;
            }
            
            this.addBotMessage(welcomeMsg);
        }
        
        this.renderMessages();
    }

    // ========== CREACIÓN DEL DOM ==========
    createDOM() {
        const isEnglish = window.blueEcoTranslator?.getLanguage?.() === 'en';
        const assistantTitle = isEnglish ? 'Blue EcoSim Assistant' : 'Asistente Blue EcoSim';
        const inputPlaceholder = isEnglish ? 'Type your question here...' : 'Escribe tu pregunta aquí...';
        
        const container = document.createElement('div');
        container.className = 'cb-container';
        container.innerHTML = `
            <div class="cb-window" id="cbWindow">
                <div class="cb-header" id="cbHeader">
                    <h3>
                        <img src="../public/media/Web/ballena-contento.png" alt="Ballena" class="cb-whale-img">
                        ${assistantTitle}
                    </h3>
                    <div class="cb-header-actions">
                        <button class="cb-close" id="cbCloseBtn" aria-label="Cerrar chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="cb-messages" id="cbMessages"></div>
                <div class="cb-suggestions-panel" id="cbSuggestionsPanel"></div>
                <div class="cb-input">
                    <input type="text" id="cbInput" placeholder="${inputPlaceholder}" autocomplete="off">
                    <button id="cbSendBtn" aria-label="Enviar mensaje">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            <button class="cb-toggle" id="cbToggleBtn" aria-label="Abrir asistente">
                <img src="../public/media/Web/ballena-contento.png" alt="Asistente ballena">
            </button>
        `;
        document.body.appendChild(container);
        
        this.window = document.getElementById('cbWindow');
        this.messagesContainer = document.getElementById('cbMessages');
        this.suggestionsPanel = document.getElementById('cbSuggestionsPanel');
        this.input = document.getElementById('cbInput');
        this.toggleBtn = document.getElementById('cbToggleBtn');
        this.toggleIcon = this.toggleBtn?.querySelector('img');
        
        // Mostrar sugerencias al inicio
        this.showSuggestions();
    }

    // ========== MOSTRAR SUGERENCIAS ARRIBA ==========
    toggleSuggestionsPanel() {
        if (!this.suggestionsPanel) return;

        const isCollapsed = this.suggestionsPanel.classList.toggle('is-collapsed');
        const toggleBtn = this.suggestionsPanel.querySelector('.cb-suggestions-toggle');
        const toggleIcon = toggleBtn?.querySelector('i');

        if (toggleBtn) {
            toggleBtn.setAttribute('aria-label', isCollapsed ? 'Expandir mensajes rápidos' : 'Minimizar mensajes rápidos');
        }

        if (toggleIcon) {
            toggleIcon.className = isCollapsed ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
        }
    }

    showSuggestions() {
        if (!this.suggestionsPanel) return;
        
        const suggestions = [
            { text: "📝 ¿Cómo me registro?", action: "¿Cómo me registro?" },
            { text: "🏫 ¿Qué son los espacios?", action: "¿Qué son los espacios?" },
            { text: "🎮 ¿Cómo inicio una simulación?", action: "¿Cómo inicio una simulación?" },
            { text: "📋 ¿Dónde veo mis tareas?", action: "¿Dónde veo mis tareas?" },
            { text: "🐠 ¿Qué especies hay?", action: "¿Qué especies hay?" },
            { text: "🔑 ¿Cómo me uno a un espacio?", action: "¿Cómo me uno a un espacio?" }
        ];

        const existingSuggestions = this.suggestionsPanel.querySelector('.cb-suggestions-container');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        const container = document.createElement('div');
        container.className = 'cb-suggestions-container';
        container.innerHTML = `
            <div class="cb-suggestions-header">
                <button class="cb-suggestions-toggle" type="button" aria-label="Minimizar mensajes rápidos">
                    <i class="fas fa-chevron-down"></i>
                </button>
                <span class="cb-suggestions-icon">⚡</span>
                <span class="cb-suggestions-title">Mensajes rápidos</span>
                <span class="cb-suggestions-hint">Toca para enviar</span>
            </div>
            <div class="cb-suggestions-grid">
                ${suggestions.map((s, index) => `
                    <button class="cb-suggestion-btn" data-index="${index}">
                        ${s.text}
                    </button>
                `).join('')}
            </div>
        `;

        this.suggestionsPanel.appendChild(container);

        const toggleBtn = container.querySelector('.cb-suggestions-toggle');
        toggleBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSuggestionsPanel();
        });

        container.querySelectorAll('.cb-suggestion-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const suggestion = suggestions[index];
                this.input.value = suggestion.action;
                this.processMessage(suggestion.action);
            });
        });
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

    // ========== CONSEJOS ALEATORIOS (SOLO TOOLTIP) ==========
    startRandomTips() {
        setTimeout(() => this.showRandomTip(), 10000);
        setInterval(() => this.showRandomTip(), 45000 + Math.random() * 15000);
    }

    showRandomTip() {
        if (this.isOpen) return;
        
        const randomTip = this.tips[Math.floor(Math.random() * this.tips.length)];
        const toggleBtn = this.toggleBtn;
        if (!toggleBtn) return;

        this.setExpression('buscando');
        this.addConsejo(randomTip);

        const existingTip = document.querySelector('.cb-tip-tooltip');
        if (existingTip) {
            existingTip.style.transition = 'all 0.3s ease';
            existingTip.style.opacity = '0';
            existingTip.style.transform = 'scale(0.9)';
            setTimeout(() => existingTip.remove(), 300);
        }

        setTimeout(() => {
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
                        this.setExpression('contento');
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
                    this.setExpression('contento');
                }, 300);
            });
        }, 300);
    }

    // ========== MENSAJES ==========
    loadMessages() {
        const saved = localStorage.getItem('chatbot_messages');
        if (saved) {
            try {
                this.messages = JSON.parse(saved);
            } catch {
                this.messages = [];
            }
        }
    }
    
    saveMessages() {
        if (this.messages.length > 100) {
            this.messages = this.messages.slice(-80);
        }
        try {
            localStorage.setItem('chatbot_messages', JSON.stringify(this.messages));
        } catch {}
    }
    
    renderMessages() {
        if (!this.messagesContainer) return;
        
        const wasAtBottom = this.messagesContainer.scrollHeight - this.messagesContainer.scrollTop <= this.messagesContainer.clientHeight + 20;
        
        this.messagesContainer.innerHTML = '';
        
        if (this.messages.length <= 1 && !this.suggestionsPanel?.querySelector('.cb-suggestions-container')) {
            this.showSuggestions();
        }
        
        // Renderizar mensajes
        this.messages.forEach((msg, index) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `cb-msg cb-msg-${msg.sender}`;
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(15px)';

            const bubbleContainer = document.createElement('div');
            bubbleContainer.className = 'cb-bubble-container';
            
            const bubble = document.createElement('div');
            bubble.className = 'cb-bubble';
            bubble.innerHTML = msg.text.replace(/\n/g, '<br>');

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

            bubbleContainer.appendChild(bubble);
            messageDiv.appendChild(bubbleContainer);
            messageDiv.appendChild(tail);
            this.messagesContainer.appendChild(messageDiv);
            
            const delay = index < 3 ? index * 100 : 0;
            setTimeout(() => {
                messageDiv.style.transition = 'all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)';
                messageDiv.style.opacity = '1';
                messageDiv.style.transform = 'translateY(0)';
            }, delay);
        });
        
        if (wasAtBottom) {
            setTimeout(() => {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }, 100);
        }
    }
    
    addUserMessage(text) {
        this.messages.push({ sender: 'user', text, timestamp: Date.now() });
        this.renderMessages();
        this.saveMessages();
    }
    
    addBotMessage(text) {
        this.messages.push({ sender: 'bot', text, timestamp: Date.now() });
        this.renderMessages();
        this.saveMessages();
    }

    // ========== INDICADOR DE ESCRITURA ==========
    showTyping() {
        this.isTyping = true;
        this.setExpression('hablando');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'cb-typing';
        typingDiv.id = 'cbTypingIndicator';
        typingDiv.style.opacity = '0';
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
            <span class="cb-typing-text">Escribiendo...</span>
        `;
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

    // ========== BÚSQUEDA DE RESPUESTAS ==========
    findResponse(question) {
        const lowerQuestion = question.toLowerCase();
        let bestMatch = null;
        let bestScore = 0;
        
        for (const item of this.knowledgeBase) {
            for (const keyword of item.keywords) {
                const keywordLower = keyword.toLowerCase();
                if (lowerQuestion.includes(keywordLower)) {
                    const score = keywordLower.length / lowerQuestion.length;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = item.response;
                    }
                }
            }
        }
        return bestMatch;
    }
    
    async getResponse(question) {
        const directResponse = this.findResponse(question);
        if (directResponse) return directResponse;
        
        if (window.blueEcoTranslator?.getLanguage?.() === 'en') {
            try {
                const translatedQuestion = await window.blueEcoTranslator.translate(question, 'en', 'es');
                const translatedResponse = this.findResponse(translatedQuestion);
                if (translatedResponse) {
                    return await window.blueEcoTranslator.translate(translatedResponse, 'es', 'en');
                }
            } catch (error) {
                console.warn('Error en traducción del chatbot:', error);
            }
        }
        
        return `🤔 No estoy seguro de entender tu pregunta.

━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Prueba preguntarme:**

• 📝 ¿Cómo me registro?
• 🏫 ¿Qué son los espacios?
• 🎮 ¿Cómo inicio una simulación?
• 📋 ¿Dónde veo mis tareas?
• 🐠 ¿Qué especies hay?
• 🔑 ¿Cómo me uno a un espacio?

━━━━━━━━━━━━━━━━━━━━━━━━

O escríbeme con más detalle para poder ayudarte mejor. 🌊`;
    }

    // ========== PROCESAR MENSAJE ==========
    async processMessage(question) {
        if (!question.trim()) return;
        
        this.input.disabled = true;
        this.input.style.opacity = '0.6';
        
        this.addUserMessage(question);
        this.input.value = '';
        this.setExpression('buscando');
        this.showTyping();
        
        const delay = 800 + Math.random() * 700;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        this.hideTyping();
        const response = await this.getResponse(question);
        
        if (response.includes('No estoy seguro') || response.includes('🤔')) {
            this.setExpression('confusion');
        } else {
            this.setExpression('hablando');
        }
        
        this.addBotMessage(response);
        
        this.input.disabled = false;
        this.input.style.opacity = '1';
        this.input.focus();
    }

    // ========== ABRIR/CERRAR CHAT ==========
    toggleChat() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.window.classList.add('open');
            
            const tip = document.querySelector('.cb-tip-tooltip');
            if (tip) {
                tip.style.transition = 'all 0.3s ease';
                tip.style.opacity = '0';
                tip.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    if (tip.parentElement) tip.remove();
                    clearTimeout(this.tipTimeout);
                    this.setExpression('contento');
                }, 300);
            }
            
            setTimeout(() => {
                if (this.input) {
                    this.input.focus();
                }
            }, 400);
            
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
            
            this.setExpression('contento');
        }
    }

    // ========== EVENTOS ==========
    addEventListeners() {
        document.getElementById('cbToggleBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat();
        });
        
        document.getElementById('cbCloseBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat();
        });
        
        document.getElementById('cbSendBtn')?.addEventListener('click', () => {
            this.processMessage(this.input.value);
        });
        
        this.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.processMessage(this.input.value);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleChat();
            }
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
        console.log('🐋 Chatbot Blue EcoSim inicializado correctamente');
    }
});