/**
 * CHATBOT ASISTENTE - Blue EcoSim
 * Clases únicas con prefijo cb-
 * 40 consejos, 60 preguntas, expresiones fijas para buscando/confusion
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
        this.consejos = this.loadConsejos() || [];

        this.knowledgeBase = this.buildKnowledgeBase();
        this.tips = this.buildTips();

        this.init();
        this.startRandomTips();
    }

    // ========== PERSISTENCIA DE CONSEJOS ==========
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

    // ========== BASE DE CONOCIMIENTO (60 PREGUNTAS) ==========
    buildKnowledgeBase() {
        return [
            // ===== REGISTRO Y LOGIN (7) =====
            { keywords: ['registrar', 'registrarme', 'crear cuenta', 'registro', 'como me registro', 'registrate'], 
              response: "📝 Para registrarte en Blue EcoSim:\n\n1. Haz clic en 'Registrate' en la barra superior\n2. Completa: email, nombre de usuario, contraseña\n3. Selecciona tu rol (Estudiante/Docente/Personal)\n4. Recibirás un correo de verificación\n5. Haz clic en el enlace del correo para activar tu cuenta\n\n⚠️ Revisa tu bandeja de spam si no ves el correo." },
            
            { keywords: ['iniciar sesión', 'login', 'entrar', 'acceder', 'ingresar', 'loguear', 'iniciar sesion'], 
              response: "🔐 Para iniciar sesión:\n\n1. Haz clic en 'Iniciar Sesión' en el navbar\n2. Ingresa tu email y contraseña\n3. También puedes acceder con Google\n\nSi tu cuenta no está verificada, revisa tu correo para activarla." },
            
            { keywords: ['contraseña', 'olvide contraseña', 'recuperar contraseña', 'resetear password', 'olvidé mi contraseña'], 
              response: "🔑 ¿Olvidaste tu contraseña?\n\nPor ahora, contacta a tu profesor o administrador. Pronto añadiremos recuperación automática por correo electrónico." },
            
            { keywords: ['verificar', 'verificación', 'activar cuenta', 'correo verificación', 'token', 'verificar cuenta'], 
              response: "✉️ ¿No recibiste el correo de verificación?\n\n• Revisa tu bandeja de spam/correo no deseado\n• Solicita un nuevo enlace desde registro\n• Contacta a soporte si persiste el problema" },
            
            { keywords: ['google', 'iniciar con google', 'google login', 'oauth', 'entrar con google'], 
              response: "🌐 Puedes iniciar sesión con Google:\n\n• Haz clic en 'Iniciar sesión con Google'\n• Selecciona tu cuenta\n• Si es tu primera vez, elige tu rol\n• ¡Listo! Tu cuenta se vinculará automáticamente" },
            
            { keywords: ['cerrar sesión', 'logout', 'salir', 'desconectar', 'cerrar sesion'], 
              response: "🚪 Para cerrar sesión:\n\n1. Haz clic en tu avatar en el navbar\n2. Selecciona 'Cerrar Sesión'\n3. Serás redirigido a la página principal" },
            
            { keywords: ['perfil', 'mi perfil', 'editar perfil', 'ver perfil', 'avatar', 'cambiar foto'], 
              response: "👤 Tu perfil muestra:\n\n• Nombre de usuario y email\n• Rol actual (Estudiante/Docente/Personal)\n• Fecha de último acceso\n• Próximamente: insignias y estadísticas de tus simulaciones" },

            // ===== ROLES (4) =====
            { keywords: ['rol', 'roles', 'diferencia roles', 'estudiante', 'docente', 'personal', 'tipos de usuario', 'que rol soy'], 
              response: "👥 Blue EcoSim tiene 3 roles principales:\n\n🎓 **Estudiante**: Accede a simulaciones asignadas por docentes, completa tareas, ve tu progreso.\n\n👨‍🏫 **Docente**: Crea espacios virtuales, invita estudiantes, asigna simulaciones, revisa tareas.\n\n🐠 **Personal**: Uso individual sin asignaciones, explora libremente todas las simulaciones." },
            
            { keywords: ['cambiar rol', 'modificar rol', 'otro rol', 'cambio de rol'], 
              response: "🔄 Para cambiar tu rol, contacta a un administrador del sistema. Ellos pueden modificar tu tipo de cuenta según tus necesidades." },
            
            { keywords: ['que puedo hacer como estudiante', 'permisos estudiante', 'estudiante'], 
              response: "🎓 Como **estudiante** puedes:\n• Ver y completar simulaciones asignadas\n• Unirte a espacios con código\n• Guardar especies favoritas y notas\n• Ver tu progreso general\n• Dejar observaciones en las simulaciones" },
            
            { keywords: ['que puedo hacer como docente', 'permisos docente', 'docente'], 
              response: "👨‍🏫 Como **docente** puedes:\n• Crear espacios virtuales (aulas)\n• Invitar estudiantes por email o código\n• Asignar simulaciones a estudiantes o espacios\n• Ver el progreso de tus estudiantes\n• Revisar las observaciones que dejan" },

            // ===== SIMULADOR (10) =====
            { keywords: ['simulación', 'simular', 'empezar simulación', 'iniciar simulación', 'ejecutar simulador', 'entrar a simulación'], 
              response: "🎮 Para iniciar una simulación:\n\n• Ve a la pestaña 'SIMULACION' en el menú\n• O desde 'ASIGNACIONES' si tu profesor te asignó una tarea\n• Usa los controles: Play ▶️, Pause ⏸️, Reset 🔄\n• Escribe observaciones mientras experimentas" },
            
            { keywords: ['ecosistema', 'tipos simulaciones', 'que simulaciones hay', 'modalidades', 'tipos de simulacion'], 
              response: "🌊 Tipos de simulaciones disponibles:\n\n• **Ecosistema básico**: Arrecife de coral con especies comunes (Pez Lora, Pez Ángel, Tortuga Carey)\n• **Cadena alimenticia**: Relación depredador-presa en el océano\n• **Contaminación marina**: Efectos de residuos en el ecosistema\n\n¡Próximamente más escenarios!" },
            
            { keywords: ['controles simulador', 'como usar simulador', 'botones simulador', 'controles', 'que hacen los botones'], 
              response: "🎮 Controles del simulador:\n\n• ▶️ **Play**: Inicia o reanuda la simulación\n• ⏸️ **Pause**: Pausa el tiempo de simulación\n• 🔄 **Reset**: Reinicia el ecosistema a valores iniciales\n• 📝 **Observaciones**: Guarda notas sobre lo que observas\n• 🖥️ **Expandir**: Pantalla completa" },
            
            { keywords: ['temperatura', 'salinidad', 'oxígeno', 'parámetros', 'ajustar', 'cambiar temperatura'], 
              response: "🌡️ Puedes ajustar estos parámetros ambientales:\n\n• **Temperatura** (15-35°C): afecta el metabolismo de las especies\n• **Salinidad** (30-40 PSU): influye en la osmorregulación\n• **Oxígeno disuelto** (4-10 mg/L): esencial para la respiración\n• **Contaminación** (0-100%): afecta la salud del ecosistema" },
            
            { keywords: ['observaciones', 'guardar observación', 'escribir observación', 'comentario', 'observacion'], 
              response: "📝 Para guardar observaciones:\n\n1. Escribe tu comentario en el campo de texto\n2. Presiona Enter o el botón de enviar\n3. La observación se guarda automáticamente\n4. Tu docente podrá verla en la asignación\n\n💡 Las observaciones son importantes para tu evaluación." },
            
            { keywords: ['salud', 'estrés', 'bienestar', 'estado biológico', 'estadísticas', 'estado de la especie'], 
              response: "📊 El panel de 'Estado biológico' muestra:\n\n• **Salud**: condición general de la especie (0-100%)\n• **Estrés**: nivel de presión ambiental (0-100%)\n• **Bienestar**: calidad de vida (0-100%)\n• **Etapa**: Huevo, Juvenil, Adulto o Anciano\n• **Edad**: tiempo de vida en segundos\n• **Población**: número de individuos de la especie" },
            
            { keywords: ['especie de prueba', 'cambiar especie', 'select species', 'focus species', 'cambiar animal'], 
              response: "🐟 Puedes cambiar la especie de enfoque:\n\n• En el panel lateral, selecciona una especie\n• La simulación centrará la cámara en ella\n• Verás sus estadísticas en tiempo real\n• Las especies disponibles varían según la simulación" },
            
            { keywords: ['fullscreen', 'pantalla completa', 'expandir', 'expand', 'ver en grande'], 
              response: "🖥️ Para ver la simulación en pantalla completa:\n\n• Haz clic en el botón de expandir (⛶) en el simulador\n• Presiona Escape para salir\n• En móvil, gira el dispositivo para mejor experiencia" },
            
            { keywords: ['reset', 'reiniciar', 'reinicar simulacion', 'volver a empezar'], 
              response: "🔄 Para reiniciar la simulación:\n\n• Haz clic en el botón 🔄 Reset\n• El ecosistema volverá a su estado inicial\n• Los parámetros se restaurarán a los valores por defecto\n• ¡Puedes empezar de nuevo tu experimento!" },
            
            { keywords: ['pausar', 'pausa', 'detener simulacion'], 
              response: "⏸️ Puedes pausar la simulación en cualquier momento:\n\n• Haz clic en el botón ⏸️ Pause\n• El tiempo y los procesos biológicos se detienen\n• Vuelve a presionar ▶️ Play para reanudar" },

            // ===== ESPACIOS (6) =====
            { keywords: ['espacio', 'espacios', 'aula virtual', 'unirse a espacio', 'clase virtual', 'aula'], 
              response: "🏫 Los **Espacios** son aulas virtuales:\n\n🔹 **Como estudiante**:\n• Usa el código de 6 caracteres que te dio tu profesor\n• O acepta la invitación en notificaciones\n\n🔹 **Como docente**:\n• Crea espacios desde 'ESPACIOS'\n• Invita estudiantes por email\n• Comparte el código único del aula" },
            
            { keywords: ['código espacio', 'código aula', 'unirse código', 'código de acceso', 'codigo'], 
              response: "🔑 ¿Cómo unirse con código?\n\n1. Ve a la sección 'Unirse a un espacio'\n2. Ingresa el código de 6 caracteres (mayúsculas/números)\n3. Los campos avanzan automáticamente\n4. Haz clic en 'Unirse al espacio'\n\n💡 El código lo genera automáticamente el sistema basado en el ID del espacio." },
            
            { keywords: ['crear espacio', 'nuevo espacio', 'crear aula', 'nueva clase'], 
              response: "🏗️ Para crear un espacio (solo docentes):\n\n1. Ve a la pestaña 'ESPACIOS'\n2. Escribe el nombre del espacio\n3. Selecciona una imagen de fondo\n4. Haz clic en 'Crear espacio'\n5. Comparte el código o invita estudiantes directamente" },
            
            { keywords: ['invitar estudiantes', 'invitar', 'invitación', 'invitaciones', 'agregar estudiantes'], 
              response: "📨 Para invitar estudiantes (solo docentes):\n\n1. Entra al espacio deseado\n2. En la sección 'Invitar estudiantes'\n3. Selecciona los estudiantes de la lista\n4. Haz clic en 'Invitar seleccionados'\n5. Recibirán una notificación en su cuenta" },
            
            { keywords: ['eliminar espacio', 'borrar espacio', 'cerrar aula', 'eliminar aula'], 
              response: "🗑️ Para eliminar un espacio (solo docentes):\n\n1. Ve a la lista de espacios\n2. Haz clic en el ícono de eliminar (🗑️)\n3. Confirma la acción\n⚠️ Se eliminarán todas las asignaciones de los estudiantes en ese espacio" },
            
            { keywords: ['miembros espacio', 'estudiantes espacio', 'quienes estan en el espacio', 'miembros'], 
              response: "👥 En la sección 'Miembros' del espacio puedes ver:\n\n• **Activos**: estudiantes que aceptaron la invitación\n• **Pendientes**: estudiantes que aún no responden\n• **Rechazados**: estudiantes que rechazaron la invitación\n• Puedes eliminar miembros si es necesario" },

            // ===== ASIGNACIONES (5) =====
            { keywords: ['asignaciones', 'tareas', 'mis tareas', 'simulaciones asignadas', 'deberes', 'tarea'], 
              response: "📋 En 'ASIGNACIONES' encuentras:\n\n• **Simulaciones pendientes**: Las que debes realizar\n• **En progreso**: Las que empezaste pero no terminaste\n• **Completadas**: Las que ya finalizaste\n• **Progreso general**: Porcentaje de avance total\n\n✅ Marca 'Completar' cuando termines una simulación" },
            
            { keywords: ['progreso', 'avance', 'porcentaje', 'completadas', 'estadísticas', 'cuantas tareas'], 
              response: "📊 Tu progreso se muestra en:\n\n• Tarjeta de progreso (anillo circular)\n• Número de simulaciones totales\n• Simulaciones completadas vs pendientes\n• Porcentaje de avance general\n\n💡 ¡Completa todas tus asignaciones para obtener insignias!" },
            
            { keywords: ['completar tarea', 'marcar completada', 'finalizar simulación', 'entregar', 'terminar'], 
              response: "✅ Para marcar una simulación como completada:\n\n1. Entra a la simulación desde 'ASIGNACIONES'\n2. Debes haber dejado al menos una observación\n3. Haz clic en el botón 'Completar'\n4. La tarea pasará a 'Completada'\n\n📝 ¡No olvides escribir tus observaciones!" },
            
            { keywords: ['observaciones tarea', 'ver observaciones', 'comentarios docente', 'que ve el profesor'], 
              response: "👀 Las observaciones son visibles para:\n\n• **Docentes**: pueden ver todas las observaciones de sus estudiantes\n• **Estudiantes**: ven sus propias observaciones guardadas\n• Las observaciones ayudan a evaluar tu comprensión\n• Se guardan con fecha y hora" },
            
            { keywords: ['notificaciones', 'campana', 'invitaciones', 'alertas', 'notificacion'], 
              response: "🔔 En el ícono de campana (🔔) del navbar:\n\n• Recibirás invitaciones a espacios\n• Nuevas simulaciones asignadas\n• Estados de tus tareas\n• Puedes filtrar por: Recibidos, Destacados, No leídos\n• Marcar como leídas o archivarlas" },

            // ===== ESPECIES (7) =====
            { keywords: ['especies', 'animales marinos', 'catálogo especies', 'ver especies', 'fauna', 'que especies hay'], 
              response: "🐠 En la sección 'ESPECIES' puedes:\n\n• Ver modelos 3D interactivos de animales marinos\n• Rotar y hacer zoom en cada especie\n• Guardar tus favoritas (❤️)\n• Crear notas de estudio\n• Filtrar por categoría: Peces, Tortugas, Crustáceos, Moluscos\n• Ver datos científicos: dieta, longevidad, peligro de extinción" },
            
            { keywords: ['modelo 3d', 'ver en 3d', 'girar modelo', '3d', 'visualizar', 'ver animal en 3d'], 
              response: "🖱️ Controles del visor 3D:\n\n• **Click + arrastrar**: Rotar el modelo\n• **Click derecho + arrastrar**: Mover cámara\n• **Scroll**: Acercar/alejar zoom\n• **Auto-rotación**: El modelo gira solo automáticamente\n• Las especies tienen animaciones únicas" },
            
            { keywords: ['favoritos', 'guardar favoritos', 'mis favoritos', 'favoritas', 'corazon'], 
              response: "❤️ Para guardar especies favoritas:\n\n1. Ve al detalle de cualquier especie\n2. Haz clic en el botón ❤️ 'Agregar a favoritos'\n3. Accede a todos tus favoritos desde el menú 'Favoritos'\n4. Puedes quitar favoritos con el mismo botón\n5. Los favoritos se guardan en tu cuenta" },
            
            { keywords: ['notas', 'mis notas', 'tomar notas', 'apuntes', 'estudiar', 'nota'], 
              response: "📝 La sección 'Notas' te permite:\n\n• Crear notas de estudio sobre especies\n• Editar el título y contenido de las notas\n• Eliminar notas que ya no necesites\n• Cada nota se guarda automáticamente en tu cuenta\n• Puedes asociar notas a especies específicas" },
            
            { keywords: ['categorías especies', 'filtrar especies', 'peces', 'tortugas', 'crustáceos', 'moluscos', 'filtrar'], 
              response: "🔍 Puedes filtrar especies por categoría:\n\n• 🐟 **Peces**: la mayoría de las especies marinas\n• 🐢 **Tortugas**: tortugas marinas y terrestres\n• 🦞 **Crustáceos**: cangrejos, langostas, camarones\n• 🐚 **Moluscos**: caracoles, pulpos, calamares\n• Usa los botones de filtro en la parte superior" },
            
            { keywords: ['especie en peligro', 'extinción', 'conservación', 'amenazada', 'peligro de extincion'], 
              response: "⚠️ Información de conservación:\n\n• **En peligro crítico**: riesgo extremo de extinción\n• **En peligro**: alto riesgo de extinción\n• **Vulnerable**: riesgo moderado\n• **Preocupación menor**: población estable\n• Cada especie tiene información detallada sobre sus amenazas" },
            
            { keywords: ['habitat especie', 'distribución', 'zona geográfica', 'dónde vive', 'habitat'], 
              response: "🗺️ Cada especie tiene información de hábitat:\n\n• **Zona geográfica**: región donde habita\n• **Temperatura**: rango óptimo de temperatura\n• **Salinidad**: rango de salinidad tolerado\n• **Profundidad**: rango de profundidad (mínima y máxima)\n• **Zona de luz**: fótica (con luz) o mesopelágica" },

            // ===== OTROS (10) =====
            { keywords: ['sobre nosotros', 'nosotros', 'quienes somos', 'que es blue ecosim', 'acerca de', 'blue ecosim'], 
              response: "🌊 **Blue EcoSim** es un simulador interactivo de ecosistemas marinos creado con fines educativos.\n\n🎯 **Objetivo**: Experimentar con diferentes parámetros del entorno para observar cómo cambian las especies y el equilibrio del ecosistema.\n\n💡 **Ideal para**: Estudiantes, docentes y amantes de la biología marina.\n\n📖 **Más información**: Ve a la sección 'Sobre Nosotros' en el footer." },
            
            { keywords: ['ayuda', 'soporte', 'problema técnico', 'error', 'bug', 'falla', 'no funciona'], 
              response: "🆘 ¿Tienes problemas técnicos?\n\n1. Intenta recargar la página (F5)\n2. Limpia la caché de tu navegador\n3. Contacta a tu profesor si es una asignación\n4. Escribe a: soporte@blueecosim.com\n5. Describe el problema con capturas de pantalla" },
            
            { keywords: ['hola', 'buenas', 'saludos', 'buenos días', 'hey', 'que tal', 'hola como estas'], 
              response: "👋 ¡Hola! Soy el asistente de Blue EcoSim. Pregúntame sobre registro, simulaciones, especies o cualquier duda de la plataforma. ¿En qué puedo ayudarte hoy? 🐙" },
            
            { keywords: ['gracias', 'thanks', 'buen trabajo', 'excelente', 'genial', 'muchas gracias'], 
              response: "🌟 ¡De nada! Me alegra poder ayudarte. Sigue explorando el maravilloso mundo marino. ¿Necesitas algo más? 🐠" },
            
            { keywords: ['adiós', 'chao', 'bye', 'hasta luego', 'nos vemos', 'adios'], 
              response: "👋 ¡Hasta luego! Sigue sumergiéndote en el conocimiento marino. Cuando necesites ayuda, aquí estoy. ¡Que tengas un gran día! 🌊" },
            
            { keywords: ['footer', 'pie de página', 'redes sociales', 'instagram', 'facebook', 'x', 'twitter', 'redes'], 
              response: "📱 En el footer (pie de página) encuentras:\n\n• **Redes sociales**: Instagram, X (Twitter), Facebook\n• **Sobre Nosotros**: información del proyecto\n• El logo de Blue EcoSim\n• Puedes seguirnos para estar al día de novedades" },
            
            { keywords: ['modo oscuro', 'tema oscuro', 'dark mode', 'cambiar tema', 'oscuro'], 
              response: "🌙 Puedes activar el modo oscuro:\n\n• Haz clic en el ícono de luna 🌙 en el navbar\n• El tema se guarda en tu navegador\n• Se aplica a todas las páginas del sitio\n• En modo oscuro, los colores se invierten para cuidar tu vista" },
            
            { keywords: ['idioma', 'traducción', 'english', 'español', 'cambiar idioma', 'traducir'], 
              response: "🌐 Cambia el idioma de la interfaz:\n\n• Haz clic en el ícono de idioma 🌐 en el navbar\n• Alterna entre Español 🇪🇸 e Inglés 🇬🇧\n• La traducción se aplica a toda la página\n• Los mensajes del chatbot también se traducen automáticamente" },
            
            { keywords: ['que es esto', 'como funciona esto', 'para que sirve', 'objetivo'], 
              response: "🌊 Blue EcoSim es una plataforma educativa que simula ecosistemas marinos. Su objetivo es que aprendas sobre biología marina, cadenas alimenticias y el impacto humano en los océanos, todo a través de simulaciones interactivas y modelos 3D." },
            
            { keywords: ['empezar', 'como comienzo', 'primeros pasos', 'que hago primero'], 
              response: "🚀 ¡Bienvenido! Tus primeros pasos:\n\n1. Si eres estudiante, busca el código de tu profesor y únete a un espacio\n2. Ve a 'ASIGNACIONES' para ver tus tareas\n3. Explora 'ESPECIES' para conocer la fauna marina\n4. Inicia una simulación y experimenta con los parámetros\n5. ¡No olvides dejar observaciones!" }
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
            "🎯 Cada simulación tiene un objetivo de aprendizaje diferente: ¡descúbrelos todos!"
        ];
    }

    // ========== GESTOR DE EXPRESIONES (MODIFICADO) ==========
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
            this.toggleIcon.src = src;
            this.toggleBtn.classList.add('bounce');
            setTimeout(() => {
                if (this.toggleBtn) this.toggleBtn.classList.remove('bounce');
            }, 400);
        }
        // Limpiar timeout previo
        if (this.expressionTimeout) {
            clearTimeout(this.expressionTimeout);
            this.expressionTimeout = null;
        }
        // Solo programamos timeout para estados que no sean 'buscando' ni 'confusion'
        if (state !== 'contento' && state !== 'buscando' && state !== 'confusion') {
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

        const list = document.getElementById('cbTipsList');
        if (!list) return;
        const item = document.createElement('div');
        item.className = 'cb-tip-item';
        item.innerHTML = `<span class="cb-tip-icon">💡</span> ${texto}`;
        list.appendChild(item);
        const count = this.window.querySelector('.cb-tips-count');
        if (count) count.textContent = this.consejos.length;
        list.scrollTop = list.scrollHeight;
    }

    // ========== INICIALIZACIÓN ==========
    init() {
        this.createDOM();
        this.loadMessages();
        this.addEventListeners();
        this.makeDraggable();

        if (this.consejos.length > 0) {
            const list = document.getElementById('cbTipsList');
            if (list) {
                this.consejos.forEach(texto => {
                    const item = document.createElement('div');
                    item.className = 'cb-tip-item';
                    item.innerHTML = `<span class="cb-tip-icon">💡</span> ${texto}`;
                    list.appendChild(item);
                });
                const count = this.window.querySelector('.cb-tips-count');
                if (count) count.textContent = this.consejos.length;
                list.scrollTop = list.scrollHeight;
            }
        }

        if (this.messages.length === 0) {
            let welcomeMsg = "🐙 ¡Hola! Soy tu asistente virtual de Blue EcoSim.\n\nPregúntame cualquier cosa sobre:\n• 📝 Registro e inicio de sesión\n• 🎮 Simulaciones interactivas\n• 🐠 Especies marinas 3D\n• 🏫 Espacios y asignaciones\n• ❤️ Favoritos y notas\n\n¿En qué puedo ayudarte hoy? 🌊";
            if (this.currentUser) {
                welcomeMsg = `🐙 ¡Hola ${this.currentUser}! Bienvenido de vuelta a Blue EcoSim.\n\n¿Necesitas ayuda con algo? Puedo orientarte sobre:\n• 📝 Registro y cuenta\n• 🎮 Simulaciones\n• 🐠 Especies marinas\n• 🏫 Tus espacios\n\n¿Qué te gustaría saber? 🌊`;
            }
            this.addBotMessage(welcomeMsg);
            this.addSuggestions();
        }
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
                        <button class="cb-close" id="cbCloseBtn"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                <div class="cb-messages" id="cbMessages"></div>
                <div class="cb-tips-container">
                    <div class="cb-tips-header">
                        <i class="fas fa-lightbulb"></i> Consejos
                        <span class="cb-tips-count">${this.consejos.length}</span>
                    </div>
                    <div class="cb-tips-list" id="cbTipsList"></div>
                </div>
                <div class="cb-input">
                    <input type="text" id="cbInput" placeholder="${inputPlaceholder}" autocomplete="off">
                    <button id="cbSendBtn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <button class="cb-toggle" id="cbToggleBtn">
                <img src="../public/media/Web/ballena-contento.png" alt="Asistente ballena">
            </button>
        `;
        document.body.appendChild(container);
        this.window = document.getElementById('cbWindow');
        this.messagesContainer = document.getElementById('cbMessages');
        this.input = document.getElementById('cbInput');
        this.toggleBtn = document.getElementById('cbToggleBtn');
        this.toggleIcon = this.toggleBtn?.querySelector('img');
    }

    // ========== ARRASTRABLE ==========
    makeDraggable() {
        const header = document.getElementById('cbHeader');
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.cb-header-actions')) return;
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

    // ========== CONSEJOS ALEATORIOS (MODIFICADO) ==========
    startRandomTips() {
        setTimeout(() => this.showRandomTip(), 15000);
        setInterval(() => this.showRandomTip(), 50000 + Math.random() * 20000);
    }

    showRandomTip() {
        if (this.isOpen) return;
        const randomTip = this.tips[Math.floor(Math.random() * this.tips.length)];
        const toggleBtn = this.toggleBtn;
        if (!toggleBtn) return;

        // Cambiar a BUSCANDO (sin timeout automático)
        this.setExpression('buscando');
        this.addConsejo(randomTip);

        const existingTip = document.querySelector('.cb-tip-tooltip');
        if (existingTip) existingTip.remove();

        const tooltip = document.createElement('div');
        tooltip.className = 'cb-tip-tooltip';
        tooltip.innerHTML = `
            <div class="cb-tip-title"><i class="fas fa-lightbulb"></i> ¿Sabías que...?<button class="cb-tip-close"><i class="fas fa-times"></i></button></div>
            <div class="cb-tip-text">${randomTip}</div>
        `;
        toggleBtn.parentElement.appendChild(tooltip);

        if (this.tipTimeout) clearTimeout(this.tipTimeout);
        this.tipTimeout = setTimeout(() => {
            if (tooltip.parentElement) tooltip.remove();
            // Volver a CONTENTO al cerrar el consejo
            this.setExpression('contento');
        }, 10000);

        tooltip.querySelector('.cb-tip-close').addEventListener('click', () => {
            clearTimeout(this.tipTimeout);
            tooltip.remove();
            this.setExpression('contento');
        });
    }

    // ========== SUGERENCIAS ==========
    addSuggestions() {
        const suggestions = ["¿Cómo me registro?", "¿Qué son los espacios?", "¿Cómo inicio una simulación?", "¿Dónde veo mis tareas?", "¿Qué especies hay?"];
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'cb-suggestions';
        suggestions.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'cb-suggestion-btn';
            btn.textContent = text;
            btn.addEventListener('click', () => { this.input.value = text; this.processMessage(text); });
            suggestionsDiv.appendChild(btn);
        });
        this.messagesContainer.appendChild(suggestionsDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // ========== MENSAJES ==========
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
            const messageDiv = document.createElement('div');
            messageDiv.className = `cb-msg cb-msg-${msg.sender}`;

            const bubble = document.createElement('div');
            bubble.className = 'cb-bubble';
            bubble.innerHTML = msg.text.replace(/\n/g, '<br>');

            const tail = document.createElement('div');
            tail.className = 'cb-tail';
            const b1 = document.createElement('span');
            b1.className = 'cb-tail-bubble';
            const b2 = document.createElement('span');
            b2.className = 'cb-tail-bubble';
            tail.appendChild(b1);
            tail.appendChild(b2);

            messageDiv.appendChild(bubble);
            messageDiv.appendChild(tail);
            this.messagesContainer.appendChild(messageDiv);
        });
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
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
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    hideTyping() {
        const indicator = document.getElementById('cbTypingIndicator');
        if (indicator) indicator.remove();
        this.isTyping = false;
    }

    // ========== BÚSQUEDA DE RESPUESTAS ==========
    findResponse(question) {
        const lowerQuestion = question.toLowerCase();
        for (const item of this.knowledgeBase) {
            for (const keyword of item.keywords) {
                if (lowerQuestion.includes(keyword.toLowerCase())) return item.response;
            }
        }
        return null;
    }
    async getResponse(question) {
        const directResponse = this.findResponse(question);
        if (directResponse) return directResponse;
        if (window.blueEcoTranslator?.getLanguage?.() === 'en') {
            try {
                const translatedQuestion = await window.blueEcoTranslator.translate(question, 'en', 'es');
                const translatedResponse = this.findResponse(translatedQuestion);
                if (translatedResponse) return translatedResponse;
            } catch (error) {
                console.warn('No se pudo traducir la pregunta del chatbot:', error);
            }
        }
        return "🤔 No estoy seguro de entender tu pregunta.\n\n💡 Prueba preguntarme:\n\n• ¿Cómo me registro?\n• ¿Qué son los espacios?\n• ¿Cómo inicio una simulación?\n• ¿Dónde veo mis tareas?\n• ¿Qué especies hay?\n• ¿Cómo me contacto con soporte?";
    }

    // ========== PROCESAR MENSAJE ==========
    async processMessage(question) {
        if (!question.trim()) return;
        this.addUserMessage(question);
        this.input.value = '';
        this.setExpression('buscando');
        this.showTyping();
        setTimeout(async () => {
            this.hideTyping();
            const response = await this.getResponse(question);
            
            if (response.includes('No estoy seguro de entender')) {
                this.setExpression('confusion');
            } else {
                this.setExpression('hablando');
            }
            
            this.addBotMessage(response);
        }, 600 + Math.random() * 400);
    }

    // ========== ABRIR/CERRAR CHAT ==========
    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.window.classList.add('open');
            this.input.focus();
            const tip = document.querySelector('.cb-tip-tooltip');
            if (tip) {
                tip.remove();
                clearTimeout(this.tipTimeout);
                this.setExpression('contento');
            }
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
            this.setExpression('contento');
        }
    }

    // ========== EVENTOS ==========
    addEventListeners() {
        document.getElementById('cbToggleBtn')?.addEventListener('click', () => this.toggleChat());
        document.getElementById('cbCloseBtn')?.addEventListener('click', () => this.toggleChat());
        document.getElementById('cbSendBtn')?.addEventListener('click', () => this.processMessage(this.input.value));
        this.input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.processMessage(this.input.value); });
    }
}

// ========== INICIALIZACIÓN GLOBAL ==========
document.addEventListener('DOMContentLoaded', () => {
    if (!window.chatbotInitialized) {
        window.chatbot = new Chatbot(window.currentUserName || null);
        window.chatbotInitialized = true;
    }
});
