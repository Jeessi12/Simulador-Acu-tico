<?php
require_once __DIR__ . '/../data/ChatbotKnowledge.php';

/**
 * ChatbotGroqController - Integración con Groq AI
 * Ubicación: app/controllers/ChatbotGroqController.php
 * Modelo: llama-3.1-8b-instant
 * 
 * ✅ ASISTENTE: AKIRA - CON CONOCIMIENTO EXACTO DE LA PÁGINA
 * ✅ SOLO LO QUE EXISTE EN LA PÁGINA - SIN INVENTAR
 * ✅ NEGRITAS PARA RESALTAR PALABRAS CLAVE
 * ✅ EMOJIS MARINOS MODERADOS
 */

class ChatbotGroqController {
    
    private $apiUrl = 'secreto aqui';
    private $apiKey = 'secreto aqui';
    
    public function getResponse($message, $context = '') {
        $message = trim((string) $message);
        $conversationHistory = $this->getConversationHistory();
        $previousScope = $this->getPreviousScope($conversationHistory);
        $scope = ChatbotKnowledge::classifyScope($message, $previousScope);

        if ($scope === ChatbotKnowledge::SCOPE_CONVERSATIONAL) {
            $botResponse = ChatbotKnowledge::conversationalResponse($message);
            $this->saveExchange($message, $botResponse, $scope);
            return $botResponse;
        }

        if (in_array($scope, [ChatbotKnowledge::SCOPE_AMBIGUOUS, ChatbotKnowledge::SCOPE_OUT_OF_SCOPE], true)) {
            $botResponse = ChatbotKnowledge::boundaryResponse($scope);
            $this->saveExchange($message, $botResponse, $scope);
            return $botResponse;
        }

        if ($scope === ChatbotKnowledge::SCOPE_PLATFORM
            && ChatbotKnowledge::hasClearlyNonMarineSubject($message)) {
            $botResponse = ChatbotKnowledge::platformNonMarineResponse();
            $this->saveExchange($message, $botResponse, $scope);
            return $botResponse;
        }

        if ($scope === ChatbotKnowledge::SCOPE_MARINE) {
            $smallTalkResponse = ChatbotKnowledge::marineSmallTalkResponse($message);
            if ($smallTalkResponse !== null) {
                $this->saveExchange($message, $smallTalkResponse, $scope);
                return $smallTalkResponse;
            }
        }

        // Las intenciones de plataforma que ya están verificadas se responden
        // desde el inventario determinista. Así la IA no puede contradecir el
        // contenido real de la página ni cambiar nombres, accesos o límites.
        if ($scope === ChatbotKnowledge::SCOPE_PLATFORM) {
            $verifiedResponse = $this->getFallbackResponse($message, $scope, false);
            if ($verifiedResponse !== null) {
                $this->saveExchange($message, $verifiedResponse, $scope);
                return $verifiedResponse;
            }
        }

        $systemPrompt = $this->buildPlatformKnowledge($context, $message, $scope);
        
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];
        
        // Una pregunta nueva no hereda afirmaciones de conversaciones anteriores.
        // Solo los seguimientos breves reciben historial del mismo ámbito.
        if (ChatbotKnowledge::isContextualFollowUp($message)) {
            $recentHistory = $this->getScopedHistory($conversationHistory, $scope, 6);
            foreach ($recentHistory as $entry) {
                $messages[] = [
                    'role' => $entry['role'],
                    'content' => $entry['content']
                ];
            }
        }
        
        $messages[] = ['role' => 'user', 'content' => $message];
        $this->saveToHistory('user', $message, $scope);
        
        $data = [
            'model' => 'llama-3.1-8b-instant',
            'messages' => $messages,
            'temperature' => 0.1,
            'max_tokens' => 550,
            'top_p' => 0.8
        ];
        
        $ch = curl_init($this->apiUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->apiKey
            ],
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT => 30
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $result = json_decode($response, true);
            if (isset($result['choices'][0]['message']['content'])) {
                $botResponse = $this->guardModelResponse(
                    $message,
                    $scope,
                    trim($result['choices'][0]['message']['content'])
                );
                $this->saveToHistory('assistant', $botResponse, $scope);
                return $botResponse;
            }
            $botResponse = $this->getFallbackResponse($message, $scope);
            $this->saveToHistory('assistant', $botResponse, $scope);
            return $botResponse;
        }
        
        $botResponse = $this->getFallbackResponse($message, $scope);
        $this->saveToHistory('assistant', $botResponse, $scope);
        return $botResponse;
    }
    
    private function buildPlatformKnowledge($context, $message = '', $scope = '') {
        return ChatbotKnowledge::systemPrompt((string) $context, (string) $message, (string) $scope);
    }

    private function getConversationHistory() {
        if (session_status() === PHP_SESSION_NONE) {
            if (headers_sent()) {
                return [];
            }
            session_start();
        }
        return $_SESSION['chatbot_history'] ?? [];
    }
    
    private function saveToHistory($role, $content, $scope = null) {
        if (session_status() === PHP_SESSION_NONE) {
            if (headers_sent()) {
                return;
            }
            session_start();
        }
        if (!isset($_SESSION['chatbot_history'])) {
            $_SESSION['chatbot_history'] = [];
        }
        if (count($_SESSION['chatbot_history']) >= 20) {
            array_shift($_SESSION['chatbot_history']);
        }
        $_SESSION['chatbot_history'][] = [
            'role' => $role,
            'content' => $content,
            'scope' => $scope
        ];
    }

    private function saveExchange($message, $response, $scope) {
        $this->saveToHistory('user', $message, $scope);
        $this->saveToHistory('assistant', $response, $scope);
    }

    private function getPreviousScope(array $history) {
        for ($index = count($history) - 1; $index >= 0; $index--) {
            $entry = $history[$index];
            if (($entry['role'] ?? '') !== 'user') {
                continue;
            }

            $scope = $entry['scope'] ?? null;
            if (in_array($scope, [ChatbotKnowledge::SCOPE_PLATFORM, ChatbotKnowledge::SCOPE_MARINE], true)) {
                return $scope;
            }

            $derivedScope = ChatbotKnowledge::classifyScope((string) ($entry['content'] ?? ''));
            if (in_array($derivedScope, [ChatbotKnowledge::SCOPE_PLATFORM, ChatbotKnowledge::SCOPE_MARINE], true)) {
                return $derivedScope;
            }
        }

        return null;
    }

    private function getScopedHistory(array $history, $scope, $limit) {
        $filtered = array_values(array_filter($history, static function ($entry) use ($scope) {
            return isset($entry['role'], $entry['content'], $entry['scope'])
                && $entry['scope'] === $scope
                && in_array($entry['role'], ['user', 'assistant'], true);
        }));

        return array_slice($filtered, -$limit);
    }

    private function guardModelResponse($message, $scope, $response) {
        if ($response === '') {
            return $this->getFallbackResponse($message, $scope);
        }

        $normalizedResponse = function_exists('mb_strtolower')
            ? mb_strtolower($response, 'UTF-8')
            : strtolower($response);

        if (preg_match('/labrador retriever|raza(?:s)? de perro|perros? (?:que )?(?:aparecen|hay|se encuentran) en blue ecosim/u', $normalizedResponse)) {
            return ChatbotKnowledge::platformNonMarineResponse();
        }

        if ($scope === ChatbotKnowledge::SCOPE_MARINE
            && !ChatbotKnowledge::hasPlatformIntent($message)
            && preg_match('/blue ecosim|en (?:la|esta) plataforma|en (?:el|este) sitio|en (?:la|esta) página/u', $normalizedResponse)) {
            $sentences = preg_split('/(?<=[.!?])\s+|\R+/u', $response) ?: [];
            $safeSentences = array_filter($sentences, static function ($sentence) {
                return !preg_match('/blue ecosim|en (?:la|esta) plataforma|en (?:el|este) sitio|en (?:la|esta) página/iu', $sentence);
            });
            $response = trim(implode(' ', $safeSentences));

            if ($response === '') {
                return "No puedo vincular ese dato con Blue EcoSim porque la pregunta es científica general. Reformúlala indicando la especie o el ecosistema **marino** que deseas conocer.";
            }
        }

        return $response;
    }
    
    private function getFallbackResponse($message, $scope = null, $allowGeneric = true) {
        $lowerMessage = function_exists('mb_strtolower')
            ? mb_strtolower($message, 'UTF-8')
            : strtolower($message);

        $containsAny = static function (string $text, array $terms): bool {
            foreach ($terms as $term) {
                if (strpos($text, $term) !== false) {
                    return true;
                }
            }
            return false;
        };
        
        // Detectar insultos
        $insultos = ['idiota', 'estúpido', 'estupido', 'tonto', 'imbécil', 'imbecil', 'pendejo', 'pendeja', 'boludo', 'boluda', 'gil', 'gila', 'basura', 'mierda'];
        foreach ($insultos as $insulto) {
            if (strpos($lowerMessage, $insulto) !== false) {
                return "🌊 Entiendo tu frustración. Estoy aquí para ayudar con temas marinos. ¿Hay algo sobre **Blue EcoSim** o el **océano** que te gustaría saber? 😊";
            }
        }
        
        // Detectar temas no marinos
        $temasNoMarinos = ['fútbol', 'futbol', 'béisbol', 'beisbol', 'baloncesto', 'basquet', 'tenis', 'política', 'politica', 'presidente', 'elección', 'elecciones', 'cine', 'película', 'pelicula', 'música', 'musica', 'videojuego', 'videojuegos'];
        $temasPermitidos = ['mar', 'marin', 'océano', 'oceano', 'costa', 'arrecife', 'manglar', 'especie', 'ecosistema', 'pesca', 'blue ecosim', 'blueecosim', 'plataforma', 'chatbot', 'akira', 'simulación', 'simulacion', 'registro', 'sesión', 'sesion', 'tarea', 'espacio', 'recurso', 'perfil'];
        $tieneContextoPermitido = false;
        foreach ($temasPermitidos as $temaPermitido) {
            if (strpos($lowerMessage, $temaPermitido) !== false) {
                $tieneContextoPermitido = true;
                break;
            }
        }
        foreach ($temasNoMarinos as $tema) {
            if (!$tieneContextoPermitido && strpos($lowerMessage, $tema) !== false) {
                return "🌊 Soy **Akira** 🐋, tu asistente marino. Solo puedo ayudarte con temas del **océano**, la **vida marina** y **Blue EcoSim**. ¿Tienes alguna pregunta sobre el mar o la plataforma? 😊";
            }
        }
        
        // Respuestas de respaldo por intención. Las frases se mantienen
        // deliberadamente específicas para no confundir temas científicos con
        // nombres de secciones de la plataforma.
        $preguntaRegistroCuenta = $containsAny($lowerMessage, [
            'me registro', 'registrarme', 'crear una cuenta', 'crear cuenta',
            'registro en blue ecosim', 'registro de usuario', 'formulario de registro'
        ]) || ($containsAny($lowerMessage, ['registro', 'registrar'])
            && $containsAny($lowerMessage, ['cuenta', 'usuario', 'correo', 'email', 'contraseña', 'blue ecosim', 'blueecosim', 'plataforma']));

        if ($preguntaRegistroCuenta) {
            return "📝 **Cómo registrarte en Blue EcoSim:**\n\n" .
                   "1️⃣ Ve a **'Registrate'** en el navbar 👆\n" .
                   "2️⃣ Completa: **email**, **usuario**, **contraseña** y **confirma**\n" .
                   "3️⃣ Selecciona tu **rol** (Estudiante, Docente o Personal)\n" .
                   "4️⃣ Recibirás un **correo de verificación** (revisa spam) 📧\n" .
                   "5️⃣ ¡Listo! Ya puedes **iniciar sesión** 🐠\n\n" .
                   "💙 ¿Necesitas ayuda con algo más? 😊";
        }
        
        if (strpos($lowerMessage, 'iniciar sesión') !== false || strpos($lowerMessage, 'login') !== false) {
            return "🔐 **Cómo iniciar sesión en Blue EcoSim:**\n\n" .
                   "• Ve a **'Iniciar Sesión'** en el navbar 👆\n" .
                   "• Ingresa tu **email** y **contraseña** 📧\n" .
                   "• O usa **'Iniciar sesión con Google'** 🌐\n" .
                   "• Si tu cuenta no está **verificada**, revisa tu correo 📬\n\n" .
                   "💙 ¡Espero que esto te ayude! 😊";
        }

        $consultasDeFuncionesAusentes = ['recuperar contraseña', 'recuperación de contraseña', 'olvide mi contraseña', 'olvidé mi contraseña', 'chat entre', 'mensajería', 'mensajeria', 'foro', 'videollamada', 'multijugador', 'descargar modelo', 'qué funciones no existen', 'que funciones no existen', 'qué funciones no están disponibles', 'que funciones no estan disponibles', 'qué no existe', 'que no existe'];
        foreach ($consultasDeFuncionesAusentes as $funcionAusente) {
            if (strpos($lowerMessage, $funcionAusente) !== false) {
                return "🚫 Esas funciones **no están disponibles actualmente en Blue EcoSim**. La plataforma no tiene recuperación de contraseña desde la interfaz, chat o mensajería entre usuarios, foros, videollamadas, modo multijugador ni descarga de modelos 3D. Para un problema de cuenta, debes pedir ayuda a un administrador; para una asignación, consulta a tu docente.";
            }
        }

        $preguntaOrcaEnPlataforma = $scope === ChatbotKnowledge::SCOPE_PLATFORM
            && $containsAny($lowerMessage, ['orca', 'orcas'])
            && $containsAny($lowerMessage, [
                'hay', 'aparece', 'aparecen', 'ficha', 'catálogo', 'catalogo',
                'especie', 'blue ecosim', 'blueecosim', 'sitio', 'página', 'pagina'
            ]);

        if ($preguntaOrcaEnPlataforma) {
            return "🐋 **No hay una ficha propia de orca en el catálogo verificado.**\n\n" .
                   "La categoría **Cetáceos** contiene una ficha: **Delfín nariz de botella** (*Tursiops truncatus*). La palabra **orca** sí aparece mencionada como depredador en algunas fichas de otras especies, así que no sería correcto decir que no se menciona en absoluto.";
        }

        $consultasSobreCreadores = ['creador', 'creadores', 'quién creó', 'quien creó', 'quién hizo', 'quien hizo', 'desarrollador', 'desarrolladores', 'autores', 'equipo del sitio', 'sobre nosotros', 'sobre los creadores'];
        foreach ($consultasSobreCreadores as $consultaSobreCreadores) {
            if (strpos($lowerMessage, $consultaSobreCreadores) !== false) {
                return "👥 **Sí existe el apartado Sobre Nosotros.** Puedes abrirlo desde el enlace **Sobre Nosotros** que está en el pie de página. Allí se explica que **Blue EcoSim fue creado por estudiantes con fines educativos** y se presenta como interactivo, educativo y exploratorio. Sin embargo, la página actual **no muestra los nombres, fotografías, perfiles, funciones ni datos de contacto de sus creadores**.";
            }
        }

        $consultaListadoApartados = $containsAny($lowerMessage, [
            'cuáles son los apartados', 'cuales son los apartados',
            'qué apartados hay', 'que apartados hay',
            'todos los apartados', 'lista de apartados',
            'cuáles son las secciones', 'cuales son las secciones',
            'qué secciones hay', 'que secciones hay',
            'todas las secciones', 'lista de secciones',
            'qué hay en la página', 'que hay en la pagina'
        ]);

        if ($consultaListadoApartados) {
            return "🧭 **Apartados de Blue EcoSim:** el menú principal contiene **INICIO**, **SIMULACIÓN**, **ESPECIES** y **RECURSOS**. Según el rol también aparecen **ASIGNACIONES** para estudiantes, **ESPACIOS** para docentes y **ADMINISTRAR** para administradores. El **PERFIL** se abre desde el avatar y **Sobre Nosotros** está en el pie de página. SIMULACIÓN, ESPECIES y PERFIL requieren iniciar sesión; RECURSOS y Sobre Nosotros son públicos.";
        }
        
        $preguntaRelacionEspecieSimulador = $containsAny($lowerMessage, ['especie', 'animal', 'catálogo', 'catalogo'])
            && $containsAny($lowerMessage, ['simulación', 'simulacion', 'simulador', 'simular']);

        if ($preguntaRelacionEspecieSimulador) {
            $preguntaSeleccionLibre = $containsAny($lowerMessage, ['seleccionar', 'elegir', 'escoger', 'usar', 'cualquier', 'pasar', 'poner']);
            $introduccion = $preguntaSeleccionLibre
                ? "🎮 **No puedes seleccionar cualquier especie del catálogo para usarla en el simulador.**"
                : "🎮 **El simulador no utiliza las 89 fichas del catálogo; cada escenario tiene especies fijas.**";

            return $introduccion . " Los tres escenarios utilizan:\n\n" .
                   "• **Arrecife de Los Cóbanos:** Pez Lora Gigante, Pez Ángel Real y Tortuga Carey.\n" .
                   "• **Cadena alimenticia:** Mero Guasa, Pargo Amarillo, Cangrejo Moro de Roca y Bailarina de Mar.\n" .
                   "• **Contaminación marina:** Pez Globo de Puntos Blancos, Tortuga Golfina y Jaiba Azul del Pacífico.\n\n" .
                   "El botón **Iniciar simulación** de las fichas individuales todavía indica **próximamente**. Para jugar debes entrar en **SIMULACIÓN** y escoger uno de esos tres escenarios.";
        }

        if (strpos($lowerMessage, 'simulación') !== false || strpos($lowerMessage, 'simulacion') !== false || strpos($lowerMessage, 'simulador') !== false || strpos($lowerMessage, 'simular') !== false) {
            return "🎮 **Cómo iniciar una simulación en Blue EcoSim:**\n\n" .
                   "1️⃣ Ve a **'SIMULACIÓN'** en el navbar 👆\n" .
                   "2️⃣ Elige uno de los **3 simuladores**:\n" .
                   "   🌿 **Arrecife de Los Cóbanos** (ecosistema básico)\n" .
                   "   🐟 **Cadena alimenticia** (depredador-presa)\n" .
                   "   ⚠️ **Contaminación marina** (efectos de residuos)\n" .
                   "3️⃣ Haz clic en **'Iniciar simulación'** ▶️\n" .
                   "4️⃣ Usa: **Play** ▶️, **Pausa** ⏸️, **Reset** 🔄\n" .
                   "5️⃣ ¡Ajusta los **parámetros** y explora! 🌊\n\n" .
                   "😄 ¿Listo para sumergirte? 🐠";
        }

        $mencionaJapon = strpos($lowerMessage, 'japón') !== false || strpos($lowerMessage, 'japon') !== false;
        $mencionaElSalvador = strpos($lowerMessage, 'el salvador') !== false
            || strpos($lowerMessage, 'salvadoreñ') !== false
            || strpos($lowerMessage, 'cóbanos') !== false
            || strpos($lowerMessage, 'cobanos') !== false;

        if (($scope === null || $scope === ChatbotKnowledge::SCOPE_MARINE) && $mencionaJapon && $mencionaElSalvador) {
            return "🌏 **El Salvador y Japón:** El Salvador tiene una costa tropical en el Pacífico oriental, con manglares, estuarios, playas y el sistema arrecifal rocoso-coralino de Los Cóbanos. Japón abarca desde el sur subtropical de Ryukyu/Okinawa —con arrecifes coralinos y manglares— hasta costas templadas y frías del norte, donde destacan bosques de kelp. Japón recibe la influencia de Kuroshio cálida y Oyashio fría; no es correcto atribuir la corriente de California a El Salvador ni *Posidonia oceanica* a Japón. Son costas distintas y no conviene afirmar que una tiene más biodiversidad sin una métrica científica.";
        }

        if (($scope === null || $scope === ChatbotKnowledge::SCOPE_MARINE) && $mencionaJapon) {
            return "🇯🇵 **Japón marino:** el sur subtropical de Ryukyu/Okinawa alberga arrecifes coralinos y manglares; hacia el norte cobran importancia las costas templadas o frías y los bosques de kelp. La corriente cálida Kuroshio influye en el sur y este, la fría Oyashio en el nordeste y la rama de Tsushima entra al mar de Japón. También hay bahías, costas rocosas, praderas de pastos marinos y ambientes profundos.";
        }

        if (($scope === null || $scope === ChatbotKnowledge::SCOPE_MARINE) && $mencionaElSalvador) {
            return "🇸🇻 **Mar de El Salvador:** el país tiene costa únicamente en el **océano Pacífico**. Destacan el arrecife rocoso-coralino y los hábitats costeros de **Los Cóbanos**, además de manglares y estuarios como Barra de Santiago, Jaltepeque, Bahía de Jiquilisco y Golfo de Fonseca. En sus costas anidan tortuga golfina, carey, verde/prieta y baula; también hay peces, rayas, tiburones, delfines y cetáceos migratorios. Las principales presiones incluyen captura incidental, redes fantasma, sobrepesca, pérdida de manglar, aguas residuales, plásticos, sedimentación y calentamiento oceánico. 🌊";
        }

        if (($scope === null || $scope === ChatbotKnowledge::SCOPE_MARINE) && strpos($lowerMessage, 'tortuga') !== false) {
            return "🐢 Existen **siete especies de tortugas marinas** en el mundo. Viven en mares tropicales y templados, migran entre zonas de alimentación y playas de anidación y cumplen funciones como controlar medusas o mantener pastos marinos y arrecifes. En **El Salvador** anidan cuatro: golfina (*Lepidochelys olivacea*), carey (*Eretmochelys imbricata*), verde/prieta (*Chelonia mydas*) y baula (*Dermochelys coriacea*). Sus amenazas más comunes son la captura incidental, el saqueo de nidos, los plásticos, la pérdida de playas y el cambio climático.";
        }

        if (($scope === null || $scope === ChatbotKnowledge::SCOPE_MARINE) && strpos($lowerMessage, 'manglar') !== false) {
            return "🌿 Los **manglares** son bosques marino-costeros tropicales adaptados a mareas y salinidad. Funcionan como criaderos de peces, camarones y moluscos, almacenan carbono azul, filtran sedimentos y reducen el impacto del oleaje. En El Salvador son especialmente relevantes Barra de Santiago, Bahía de Jiquilisco, Jaltepeque y Golfo de Fonseca. No son ecosistemas de agua dulce, aunque reciben agua de ríos y lluvias.";
        }

        if (($scope === null || $scope === ChatbotKnowledge::SCOPE_MARINE)
            && (strpos($lowerMessage, 'arrecife') !== false || strpos($lowerMessage, 'coral') !== false)) {
            return "🪸 Un **arrecife** es una estructura marina que concentra refugio, alimento y zonas de reproducción. Puede ser coralino o principalmente rocoso. Los corales constructores son animales coloniales asociados con microalgas; el calor prolongado puede causar blanqueamiento. En El Salvador, **Los Cóbanos** es el principal referente arrecifal, con fondos rocosos, comunidades coralinas, algas, peces e invertebrados del Pacífico oriental tropical.";
        }

        if (($scope === null || $scope === ChatbotKnowledge::SCOPE_MARINE)
            && (strpos($lowerMessage, 'ecosistema') !== false || strpos($lowerMessage, 'océano') !== false || strpos($lowerMessage, 'oceano') !== false)) {
            return "🌊 Los ecosistemas marinos del mundo incluyen **arrecifes**, **manglares**, **pastos marinos**, bosques de **kelp**, estuarios salobres, costas rocosas, playas, plataforma continental, océano abierto, mares polares y mar profundo. Se conectan mediante corrientes, migraciones y dispersión de larvas. Puedo explicarte uno de ellos, compararlo entre países o relacionarlo con **El Salvador**.";
        }
        
        $preguntaSobreCatalogo = $containsAny($lowerMessage, ['catálogo', 'catalogo', 'apartado de especies', 'sección de especies', 'seccion de especies', 'blue ecosim', 'blueecosim'])
            && $containsAny($lowerMessage, ['especie', 'animal']);

        if ($preguntaSobreCatalogo) {
            return "🐠 **Catálogo de Especies de Blue EcoSim:**\n\n" .
                   "• Requiere **iniciar sesión** y se abre desde **ESPECIES**.\n" .
                   "• La versión actual contiene **89 fichas**.\n" .
                   "• Explora con **modelos 3D interactivos** 🖱️\n" .
                   "• Filtra por **Peces**, **Cetáceos**, **Tortugas**, **Crustáceos** o **Moluscos**.\n" .
                   "• Haz clic en una especie para ver **detalle completo** ✨\n" .
                   "• Los favoritos son temporales; las notas se guardan solo en este navegador.\n" .
                   "• La simulación propia de cada ficha todavía está marcada como **próximamente**.";
        }
        
        $preguntaSobreEspaciosDeClase = $containsAny($lowerMessage, ['qué son los espacios', 'que son los espacios'])
            || ($containsAny($lowerMessage, ['aula', 'código de 6', 'codigo de 6', 'docente', 'estudiante', 'asignación', 'asignacion', 'tarea', 'blue ecosim', 'blueecosim'])
                && $containsAny($lowerMessage, ['espacio', 'aula']));

        if ($preguntaSobreEspaciosDeClase) {
            return "🏫 **Espacios en Blue EcoSim:**\n\n" .
                   "👨‍🎓 **Para estudiantes:**\n" .
                   "• Ve a **'ASIGNACIONES'** → **'Unirse a un espacio'**\n" .
                   "• Ingresa el **código de 6 caracteres** que te dio tu docente 🔑\n\n" .
                   "👨‍🏫 **Para docentes:**\n" .
                   "• Ve a **'ESPACIOS'** en el navbar 👆\n" .
                   "• Crea espacios con **nombre** e **imagen de fondo**\n" .
                   "• Invita **estudiantes** y asigna **simulaciones** 📚\n\n" .
                   "🔑 ¿Tienes tu código listo? 😊";
        }
        
        if (strpos($lowerMessage, 'asignaciones') !== false || strpos($lowerMessage, 'tarea') !== false) {
            return "📋 **Asignaciones en Blue EcoSim (estudiantes):**\n\n" .
                   "• Ve a **'ASIGNACIONES'** en el navbar 👆\n" .
                   "• Verás tus **simulaciones asignadas** 📋\n" .
                   "• Cada tarjeta muestra: **nombre**, **estado** y **fecha** 📅\n" .
                   "• Haz clic en **'Entrar'** para iniciar la simulación 🎮\n" .
                   "• Deja una **observación** antes de completar 📝\n" .
                   "• Marca **'Completar'** para finalizar ✅\n\n" .
                   "💪 ¡Tú puedes! 🎯";
        }
        
        if ((strpos($lowerMessage, 'progreso') !== false || strpos($lowerMessage, 'avance') !== false)
            && $containsAny($lowerMessage, ['asignación', 'asignacion', 'tarea', 'estudiante', 'blue ecosim', 'blueecosim', 'plataforma'])
            && strpos($lowerMessage, 'logro') === false
            && strpos($lowerMessage, 'insignia') === false
            && strpos($lowerMessage, 'xp') === false) {
            return "📊 **Progreso en Blue EcoSim:**\n\n" .
                   "• En **'ASIGNACIONES'** verás tu **progreso general** 📈\n" .
                   "• El **anillo circular** muestra el **% completado** 🔵\n" .
                   "• Estadísticas: **Total** 📊, **Completadas** ✅, **Pendientes** ⏳\n\n" .
                   "🎯 ¡Sigue así! 💪";
        }
        
        $preguntaRecursosPagina = $containsAny($lowerMessage, [
            'sección recursos', 'seccion recursos', 'apartado recursos',
            'recursos de blue ecosim', 'recursos en blue ecosim',
            'recursos educativos tiene blue ecosim',
            'biblioteca de documentos', 'documento pdf', 'documentos pdf',
            'mapa interactivo', 'línea del tiempo', 'linea del tiempo'
        ]) || ($containsAny($lowerMessage, ['recurso', 'documento'])
            && $containsAny($lowerMessage, ['página', 'pagina', 'sitio', 'plataforma', 'blue ecosim', 'blueecosim']));

        if ($preguntaRecursosPagina) {
            return "📚 **Recursos educativos de Blue EcoSim:**\n\n" .
                   "• **RECURSOS** es público y se centra en Los Cóbanos.\n" .
                   "• Incluye cinco hitos históricos y una vista de biodiversidad.\n" .
                   "• Su mapa ilustrado tiene capas de ubicación, arrecifes, ecosistemas, tortugas y zonas protegidas; no es GPS ni mapa satelital en vivo. 🗺️\n" .
                   "• Hay cuatro tarjetas de documentos, pero actualmente las cuatro abren el mismo PDF de especies amenazadas de El Salvador. 📄";
        }
        
        $preguntaPerfilUsuario = $containsAny($lowerMessage, [
            'mi perfil', 'perfil de usuario', 'perfil en blue ecosim',
            'perfil de blue ecosim', 'editar perfil', 'avatar', 'datos de mi cuenta'
        ]);

        if ($preguntaPerfilUsuario) {
            return "👤 **Perfil de usuario en Blue EcoSim:**\n\n" .
                   "• Requiere iniciar sesión y se abre desde el **avatar**.\n" .
                   "• Muestra: **email**, **rol** y **fecha de acceso** 📅\n" .
                   "• Incluye **logros**, **insignias**, **XP** y progreso por categorías. 🏅\n" .
                   "• El **avatar** cambia según el rol y hay botón para cerrar sesión.\n" .
                   "• No permite editar nombre, correo, contraseña o avatar; favoritos y notas están en **ESPECIES**.";
        }
        
        $preguntaPanelAdmin = $containsAny($lowerMessage, [
            'panel de administración', 'panel de administracion', 'apartado administrar',
            'sección administrar', 'seccion administrar', 'rol admin', 'usuario admin',
            'administrador de blue ecosim', 'administrar blue ecosim'
        ]);

        if ($preguntaPanelAdmin) {
            return "🔐 **Panel de Administración (solo ADMIN):**\n\n" .
                   "• Ve a **'ADMINISTRAR'** en el navbar 👆\n" .
                   "• **Dashboard**: estadísticas de usuarios, espacios, asignaciones\n" .
                   "• **Usuarios**: cambiar roles, eliminar usuarios\n" .
                   "• **Simulaciones**: crear, editar, eliminar\n" .
                   "• **Logs**: registro de actividad del sistema\n" .
                   "• **Configuración**: límites, modo mantenimiento, logos\n\n" .
                   "🔐 Solo usuarios con rol **ADMIN** tienen acceso.";
        }
        
        $preguntaFavoritosNotas = strpos($lowerMessage, 'favorito') !== false
            || ($containsAny($lowerMessage, ['nota', 'notas'])
                && $containsAny($lowerMessage, ['especie', 'catálogo', 'catalogo', 'blue ecosim', 'blueecosim', 'página', 'pagina', 'guardar']));

        if ($preguntaFavoritosNotas) {
            return "⭐ **Favoritos y Notas en Blue EcoSim:**\n\n" .
                   "• Están dentro de **ESPECIES**, que requiere iniciar sesión.\n" .
                   "• Los **Favoritos** (❤️) son temporales y se pierden al recargar la página.\n" .
                   "• Las **Notas** (📝) se guardan localmente en el navegador; no se sincronizan con la cuenta.\n" .
                   "• Ninguna de las dos funciones aparece en **PERFIL**.";
        }

        if (strpos($lowerMessage, 'logro') !== false || strpos($lowerMessage, 'insignia') !== false || strpos($lowerMessage, 'xp') !== false) {
            return "🏅 **Logros e insignias:** están en **PERFIL** para usuarios autenticados. Hay progreso, XP, estados bloqueado/desbloqueado y filtros de Aprendizaje, Simulación, Exploración, Constancia y Especiales. Algunas acciones muestran avisos al desbloquear un logro. No hay ranking público ni canje de XP por premios.";
        }
        
        if (strpos($lowerMessage, 'ayuda') !== false || strpos($lowerMessage, 'soporte') !== false) {
            return "🆘 **Ayuda en Blue EcoSim:**\n\n" .
                   "• No existe un centro de tickets, una guía rápida separada ni un correo de soporte dentro de la plataforma.\n" .
                   "• Si tienes un problema técnico, prueba recargar la página. 🔄\n" .
                   "• Contacta a tu **docente** para dudas sobre **asignaciones** 👨‍🏫\n" .
                   "• Un **administrador** puede ayudarte con el estado o rol de la cuenta. 🔐";
        }

        if (!$allowGeneric) {
            return null;
        }

        if ($scope === ChatbotKnowledge::SCOPE_PLATFORM) {
            return "ℹ️ **Eso no está documentado en la versión verificada de Blue EcoSim.** No voy a suponer que existe. Puedes preguntarme por INICIO, SIMULACIÓN, ESPECIES, RECURSOS, ASIGNACIONES, ESPACIOS, PERFIL, ADMINISTRAR o SOBRE NOSOTROS.";
        }

        if ($scope === ChatbotKnowledge::SCOPE_MARINE) {
            return "🌊 No pude generar una respuesta científica segura en este momento. Intenta reformular la consulta indicando la **especie**, el **ecosistema marino** o el **país costero** que deseas conocer.";
        }
        
        // Mensaje de bienvenida por defecto
        return "🌊 ¡Hola! Soy **Akira** 🐋, tu asistente de **Blue EcoSim**. 😊\n\n" .
               "Puedo explicarte las **secciones, funciones y límites** de la plataforma; ayudarte con **simulaciones, espacios, tareas y logros**; y responder sobre **especies y ecosistemas exclusivamente marinos** de cualquier país, con prioridad en **El Salvador**. 🇸🇻\n\n" .
               "¿Qué te gustaría saber?";
    }
}
?>
