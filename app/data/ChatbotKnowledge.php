<?php

/**
 * Fuente de conocimiento de Akira.
 * Contiene el inventario verificado de Blue EcoSim y el conocimiento marino general.
 * Las instrucciones de respuesta son genéricas; la IA las interpreta libremente.
 */
final class ChatbotKnowledge
{
    public const SCOPE_PLATFORM = 'platform';
    public const SCOPE_MARINE = 'marine';
    public const SCOPE_CONVERSATIONAL = 'conversational';
    public const SCOPE_AMBIGUOUS = 'ambiguous';
    public const SCOPE_OUT_OF_SCOPE = 'out_of_scope';

    // ===================== CLASIFICACIÓN =====================

    public static function classifyScope(string $message, ?string $previousScope = null): string
    {
        $text = self::normalize($message);

        // Conversacional
        $conv = ['hola', 'hola akira', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches',
                 'quien eres', 'que puedes hacer', 'gracias', 'muchas gracias', 'adios', 'hasta luego'];
        if ($text === '' || in_array($text, $conv, true)) {
            return self::SCOPE_CONVERSATIONAL;
        }

        if (self::hasPlatformIntent($message)) {
            return self::SCOPE_PLATFORM;
        }

        $hasMarine = self::hasStrongMarineIntent($message);
        $hasNonMarine = self::hasClearlyNonMarineSubject($message);

        if ($hasNonMarine) {
            $asksMarineImpact = $hasMarine && self::containsAnyTerm($text, [
                'afecta', 'afectan', 'impacto', 'amenaza', 'depreda', 'nido', 'nidos', 'anidacion', 'interaccion'
            ]);
            return $asksMarineImpact ? self::SCOPE_MARINE : self::SCOPE_OUT_OF_SCOPE;
        }

        if ($hasMarine) {
            return self::SCOPE_MARINE;
        }

        if (in_array($previousScope, [self::SCOPE_PLATFORM, self::SCOPE_MARINE], true)
            && self::isContextualFollowUp($message)) {
            return $previousScope;
        }

        if (self::containsAnyTerm($text, [
            'animal', 'animales', 'especie', 'especies', 'pez', 'peces',
            'tortuga', 'tortugas', 'cangrejo', 'crustaceo', 'molusco',
            'habitat', 'ecosistema', 'fauna', 'flora', 'acuatico'
        ])) {
            return self::SCOPE_AMBIGUOUS;
        }

        return self::SCOPE_OUT_OF_SCOPE;
    }

    public static function hasPlatformIntent(string $message): bool
    {
        $text = self::normalize($message);
        return self::containsAnyTerm($text, [
            'blue ecosim', 'blueecosim', 'akira', 'chatbot', 'pagina web',
            'esta pagina', 'la pagina', 'el sitio', 'sitio web', 'la plataforma',
            'apartado', 'seccion', 'menu', 'navbar', 'sobre nosotros',
            'creador', 'creadores', 'quien creo', 'quien hizo',
            'simulador', 'simulacion', 'simular', 'crear cuenta', 'registrarme',
            'registro de usuario', 'iniciar sesion', 'login',
            'mi cuenta', 'mi rol', 'perfil de usuario', 'mi perfil', 'editar perfil',
            'avatar', 'mis tareas', 'tareas asignadas', 'asignaciones',
            'como me registro', 'que hay en recursos', 'que son los espacios',
            'que hay en el perfil', 'unirme a un espacio', 'mis espacios',
            'espacio de clase', 'codigo de aula', 'codigo de 6',
            'panel de administracion', 'apartado administrar', 'recursos de blue',
            'recursos educativos', 'mapa interactivo', 'linea del tiempo',
            'documento pdf', 'catalogo de especies', 'apartado de especies',
            'seccion de especies', 'modelos 3d', 'guardar observaciones',
            'favoritos', 'mis notas', 'logro', 'logros', 'insignia', 'insignias', 'xp',
            'recuperar contrasena', 'mensajeria', 'videollamada', 'multijugador'
        ]);
    }

    public static function hasStrongMarineIntent(string $message): bool
    {
        $text = self::normalize($message);
        return self::containsAnyTerm($text, [
            'mar', 'mares', 'marino', 'oceano', 'oceanos', 'agua salada',
            'litoral', 'zona costera', 'playa', 'playas', 'arrecife', 'arrecifes',
            'coral', 'corales', 'manglar', 'manglares', 'estuario', 'estuarios',
            'pastos marinos', 'pradera marina', 'kelp', 'intermareal',
            'pelagico', 'bentonico', 'abisal', 'mar profundo', 'surgencia',
            'salinidad', 'acidificacion oceanica', 'blanqueamiento coralino',
            'carbono azul', 'sobrepesca', 'captura incidental', 'redes fantasma',
            'tiburon', 'tiburones', 'raya marina', 'mantarraya', 'atun', 'marlin',
            'ballena', 'ballenas', 'orca', 'orcas', 'cetaceo', 'cetaceos',
            'delfin', 'delfines', 'manati', 'dugongo', 'foca', 'focas',
            'leon marino', 'lobo marino', 'tortuga marina', 'tortugas marinas',
            'tortuga carey', 'tortuga golfina', 'tortuga baula', 'tortuga verde',
            'medusa', 'medusas', 'esponja marina', 'estrella de mar', 'erizo de mar',
            'pepino de mar', 'pulpo', 'pulpos', 'calamar', 'calamares', 'sepia',
            'nautilo', 'kril', 'plancton', 'fitoplancton', 'zooplancton',
            'alga marina', 'algas marinas', 'ave marina', 'aves marinas',
            'albatros', 'pinguino', 'serpiente marina', 'ostra', 'mejillon',
            'percebe', 'los cobanos', 'gato de mar', 'vaca marina'
        ]);
    }

    public static function hasClearlyNonMarineSubject(string $message): bool
    {
        $text = self::normalize($message);
        $marineCommon = ['perro marino', 'gato de mar', 'caballito de mar', 'vaca marina',
                         'leon marino', 'elefante marino', 'lobo marino', 'pepino de mar'];
        if (self::containsAnyTerm($text, $marineCommon)) return false;

        return self::containsAnyTerm($text, [
            'perro', 'perros', 'labrador retriever', 'gato', 'gatos',
            'caballo', 'vaca', 'cerdo', 'gallina', 'pollo', 'oveja', 'cabra',
            'conejo', 'hamster', 'mascota', 'leon terrestre', 'tigre', 'elefante',
            'jirafa', 'mono', 'gorila', 'abeja', 'mariposa', 'bosque terrestre',
            'selva', 'sabana', 'desierto', 'montana', 'volcan',
            'agua dulce', 'rio', 'rios', 'lago', 'pecera de agua dulce'
        ]);
    }

    public static function isContextualFollowUp(string $message): bool
    {
        $text = self::normalize($message);
        $words = preg_split('/\s+/u', $text);
        if (count($words) > 14) return false;

        return self::containsAnyTerm($text, [
            'y eso', 'y esa', 'y ese', 'y ellos', 'y cuales',
            'y donde', 'y como', 'y por que', 'que mas', 'cuales son',
            'cuanto vive', 'donde vive', 'tambien', 'esa especie',
            'ese ecosistema', 'esa seccion', 'ese apartado', 'lo anterior'
        ]);
    }

    // ===================== RESPUESTAS PREDEFINIDAS (SOLO PARA CASOS ESPECIALES) =====================

    public static function boundaryResponse(string $scope): string
    {
        if ($scope === self::SCOPE_AMBIGUOUS) {
            return "🌊 Para ayudarte mejor, necesito que aclares si te refieres a una **especie o ecosistema marino**, o a un apartado concreto de **Blue EcoSim**.";
        }
        return "🌊 Esa pregunta está fuera de mi ámbito. Solo respondo sobre **Blue EcoSim** y sobre especies, ecosistemas y procesos **marinos o marino-costeros**.";
    }

    public static function platformNonMarineResponse(): string
    {
        return "🚫 **Blue EcoSim no documenta ese tema terrestre en sus apartados verificados.** La plataforma se centra en especies y ecosistemas marinos. No invento ejemplos para relacionarlo con el sitio.";
    }

    public static function conversationalResponse(string $message): string
    {
        $text = self::normalize($message);
        if (self::containsAnyTerm($text, ['gracias', 'muchas gracias'])) {
            return "¡Con gusto! 🌊 Puedo seguir ayudándote con **Blue EcoSim** o con ciencias marinas.";
        }
        if (self::containsAnyTerm($text, ['adios', 'hasta luego'])) {
            return "¡Hasta luego! 🌊";
        }
        if (self::containsAnyTerm($text, ['quien eres', 'que puedes hacer'])) {
            return "🐋 **Soy Akira, tu asistente de Blue EcoSim.**\n\n" .
                   "Puedo ayudarte con:\n" .
                   "• **La plataforma:** apartados, simulaciones, especies, recursos, tareas, espacios y funciones.\n" .
                   "• **Ciencias marinas:** especies, ecosistemas y conservación de cualquier país.\n" .
                   "• **El Salvador:** con prioridad en Los Cóbanos.\n\n" .
                   "Si algo no aparece en el sitio, te lo diré claramente sin inventarlo.";
        }
        return "🌊 **¡Hola! Soy Akira, tu asistente de Blue EcoSim.**\n\n" .
               "Puedo orientarte sobre la plataforma y conversar sobre especies y ecosistemas exclusivamente marinos.\n\n" .
               "¿Qué deseas consultar? 🐠";
    }

    // ===================== PROMPT DEL SISTEMA (PARA PREGUNTAS DE PLATAFORMA) =====================

    public static function systemPrompt(string $context = '', string $message = '', string $scope = ''): string
    {
        $safeContext = trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', strip_tags($context)));
        $safeContext = substr($safeContext, 0, 240);

        // Prompt general sin instrucciones de formato específicas
        $prompt = <<<'PROMPT'
Eres Akira, el asistente educativo de Blue EcoSim. Respondes en español claro y amable.

Tu especialidad exclusiva es:
1) El uso de Blue EcoSim (sus secciones, funciones, límites y contenidos verificados).
2) Especies, hábitats, procesos, conservación y ciencias del medio MARINO y MARINO-COSTERO del mundo.

REGLAS GENERALES:
- Distingue siempre entre "lo que existe en Blue EcoSim" y "conocimiento científico general".
- Para preguntas de la plataforma usa únicamente el inventario verificado que se incluye abajo.
- Para preguntas marinas puedes usar conocimiento científico general, incluso si no aparece en la página.
- Nunca inventes botones, rutas, funciones, documentos, simuladores ni datos de la cuenta.
- Si algo no existe en la plataforma, dilo directamente: "Esa función no está disponible actualmente en Blue EcoSim".
- No interpretes una característica "próximamente" como disponible. No prometas fechas de lanzamiento.
- Algunas secciones requieren inicio de sesión o un rol específico. Aclara el requisito relevante.
- No digas que puedes ver la cuenta, tareas, notas, ubicación o progreso del usuario. Solo explicas dónde puede revisarlos.
- Si la pregunta mezcla temas marinos y no marinos, responde solo la parte marina.
- Para asuntos totalmente ajenos, indica que solo ayudas con Blue EcoSim y ciencias marinas.
- "Marino" incluye océanos, mares, costas, estuarios salobres, manglares, marismas, playas y organismos que dependen del mar. Excluye lagos, ríos y fauna terrestre.
- Nunca conviertas una pregunta terrestre o de agua dulce en un supuesto ejemplo de Blue EcoSim.
- El inventario de Blue EcoSim es cerrado: una afirmación sobre la plataforma solo es válida si aparece expresamente en el inventario. Si no aparece, responde que no está documentada en la versión verificada.
- No presentes una estimación como certeza. Separa claramente hechos, ejemplos e inferencias.

PROMPT;

        // Anexar el inventario completo (se mantiene igual que antes)
        $prompt .= self::getPlatformInventory();

        $prompt .= "\n\nCONOCIMIENTO CIENTÍFICO MARINO MUNDIAL\n";
        $prompt .= "Puedes explicar organismos marinos de cualquier océano y país costero, así como ecosistemas marinos de todo el mundo. Relaciona procesos como redes tróficas, productividad, corrientes, migración, simbiosis, hipoxia, acidificación, calentamiento, carbono azul, pesca incidental, sobrepesca y contaminación.\n";
        $prompt .= "Para comparar países, identifica océano, clima, corrientes y hábitats. No declares que uno tiene más biodiversidad sin métrica y fuente.\n";
        $prompt .= "Distingue IUCN global, CITES y listados nacionales. Si un estado puede haber cambiado, recomienda verificar la fuente actual.\n\n";

        $prompt .= "PRIORIDAD: EL SALVADOR Y PACÍFICO ORIENTAL TROPICAL\n";
        $prompt .= "El Salvador tiene litoral únicamente en el Pacífico. Da prioridad a Los Cóbanos (Sonsonate), Área Natural Protegida y sitio Ramsar con arrecifes rocosos y coralinos, playas, manglares y aguas abiertas.\n";
        $prompt .= "En la costa salvadoreña anidan cuatro especies de tortuga marina: golfina, carey, verde/prieta y baula.\n";
        $prompt .= "Amenazas: captura incidental, sobrepesca, pérdida de manglar, desarrollo costero, plásticos, sedimentación, turismo irresponsable, calentamiento y acidificación.\n";
        $prompt .= "Conservación: áreas protegidas, vedas, restauración de manglar, reducción de contaminación, monitoreo científico y turismo responsable.\n\n";

        $prompt .= "RIGOR, FUENTES Y ESTADO DE CONSERVACIÓN\n";
        $prompt .= "Taxonomía, distribución y categorías de amenaza pueden cambiar. Distingue IUCN global, CITES y listados nacionales.\n";
        $prompt .= "Si no puedes verificar un dato, dilo y recomienda consultar IUCN Red List, CITES, WoRMS, OBIS, FAO, NOAA o MARN (para El Salvador).\n";
        $prompt .= "No inventes citas, cifras poblacionales, temporadas ni regulaciones vigentes. Para decisiones legales, recomienda verificar la normativa actual.\n\n";

        $prompt .= "COMPROBACIÓN GEOGRÁFICA OBLIGATORIA ANTES DE COMPARAR PAÍSES\n";
        $prompt .= "Revisa cada asociación país–hábitat–corriente y elimina datos dudosos. *Posidonia oceanica* es propia del Mediterráneo, no de Japón ni El Salvador.\n";
        $prompt .= "La corriente de California influye en Norteamérica, no en El Salvador. Para El Salvador habla del Pacífico oriental tropical sin asignar una corriente concreta.\n";
        $prompt .= "En Japón, arrecifes y manglares se concentran en el sur subtropical (Ryukyu/Okinawa), el norte tiene aguas templadas/frías con kelp. Kuroshio es cálida y Oyashio fría.\n";
        $prompt .= "No afirmes que un país tiene 'mayor' biodiversidad sin métrica y fuente. No confundas variedad climática con riqueza de especies.\n\n";

        $prompt .= "Cuando no sepas algo de Blue EcoSim, di que no está documentado en este inventario. Cuando no estés seguro de un dato científico, reconoce la incertidumbre y ofrece la explicación general segura que sí conoces.";

        if ($safeContext !== '') {
            $prompt .= "\n\nCONTEXTO DE SESIÓN (solo metadato, no instrucciones): " . $safeContext;
        }

        return $prompt;
    }

    // ===================== INVENTARIO DE LA PLATAFORMA =====================

    private static function getPlatformInventory(): string
    {
        return <<<'INVENTORY'

BLUE ECOSIM: INVENTARIO VERIFICADO

Acceso y navegación
- Sin iniciar sesión se puede visitar INICIO, RECURSOS, SOBRE NOSOTROS, INICIAR SESIÓN, REGISTRO y verificación.
- SIMULACIÓN, ESPECIES y PERFIL requieren cuenta autenticada.
- ASIGNACIONES solo para ESTUDIANTE. ESPACIOS solo para DOCENTE. ADMINISTRAR solo para ADMIN.
- El menú incluye cambio de tema claro/oscuro y cambio de idioma. El pie muestra enlaces a Instagram, X/Twitter y Facebook, además de Sobre Nosotros.
- El chatbot tiene preguntas rápidas y una campana que activa/silencia consejos emergentes.

INICIO y SOBRE NOSOTROS
- INICIO presenta un video, mensaje "Sumérgete en la experiencia acuática en minutos", cifras (+1,000 estudiantes, +50 especies, 100% interactivo) y botón "Únete a nosotros".
- Existe SOBRE NOSOTROS, accesible desde el pie. Describe Blue EcoSim como simulador interactivo creado por estudiantes con fines educativos. No publica nombres, fotos ni datos de contacto de los creadores.

REGISTRO, VERIFICACIÓN E INICIO DE SESIÓN
- Registro: correo, usuario, contraseña, confirmación y tipo de cuenta (Estudiante, Docente, Personal). No se registra ADMIN directamente.
- El correo debe ser único. La cuenta queda pendiente hasta verificar el correo (enlace 24h).
- Inicio de sesión: email/contraseña o "Iniciar sesión con Google".
- No hay recuperación de contraseña, edición de correo, centro de soporte ni correo de soporte propio.

SIMULACIÓN
- Tres escenarios:
  1. Arrecife de Los Cóbanos: Pez Lora Gigante, Pez Ángel Real, Tortuga Carey. Ajusta temperatura, salinidad, oxígeno, salud.
  2. Cadena alimenticia: Mero Guasa, Pargo Amarillo, Cangrejo Moro, Bailarina de Mar. Modifica poblaciones y parámetros.
  3. Contaminación marina: Pez Globo, Tortuga Golfina, Jaiba Azul. Aumenta contaminación y observa efectos.
- Dentro del simulador: selector de especie, cronómetro, iniciar, pausar, reiniciar, completar, parámetros, estado del ecosistema.
- Observaciones solo se guardan desde asignación válida.
- No hay más de tres escenarios ni multijugador.

ESPECIES
- Requiere iniciar sesión. 89 fichas (31 peces, 1 cetáceo, 5 tortugas, 24 crustáceos, 28 moluscos).
- Buscar por nombre común, científico o hábitat. Filtrar por categoría.
- Ficha: modelo 3D, nombre científico, descripción, estado CITES, dieta, longevidad, tamaño, peso, hábitat, reproducción, depredadores, parámetros, curiosidades, amenazas.
- Cetáceos: solo Delfín nariz de botella. No hay ficha propia de orca, pero aparece como depredador en algunas fichas.
- Favoritos (temporales) y Notas (locales) dentro de ESPECIES, no en PERFIL.
- Botón "Iniciar simulación" en ficha indica "próximamente". Para jugar usar SIMULACIÓN.
- No se puede usar cualquier ficha en el simulador; cada escenario tiene especies fijas.

RECURSOS
- Público, centrado en Los Cóbanos.
- Línea del tiempo con cinco hitos (2008- actualidad).
- Vista de biodiversidad: Rayas, Peces de Arrecife, Invertebrados, Tortugas, Pastos Marinos.
- Mapa ilustrado con capas: Ubicación, Arrecifes, Ecosistemas, Tortugas, Protegidas (no GPS).
- Biblioteca: seis documentos oficiales de MARN y MINEDUCYT.

ASIGNACIONES (ESTUDIANTE)
- Invitaciones pendientes, aceptar/rechazar, unirse por código de 6 caracteres.
- Mis espacios, simulaciones asignadas con fecha, estado (Pendiente, En progreso, Completada).
- Progreso general con porcentaje, total, completadas, pendientes.
- El estudiante puede escribir observaciones desde simulación asignada.

ESPACIOS (DOCENTE)
- Crear espacio con nombre y fondo. Código de aula de 6 caracteres.
- Invitar estudiantes (reinvitar a rechazados), eliminar miembros, eliminar espacio.
- Asignar simulación a todos o a seleccionados. Revisar tareas y observaciones.
- No hay chat, foro, videollamada ni carga libre de materiales.

PERFIL, LOGROS Y NOTIFICACIONES
- Muestra correo, rol, fecha de último acceso, avatar según rol, cerrar sesión.
- Progreso de explorador: logros desbloqueados, XP, porcentaje, filtros por categoría.
- 12 logros configurados (ej. Primera inmersión, Trilogía oceánica, Marea constante, Defensor de la conservación marina).
- No permite editar nombre, correo, contraseña o avatar. No hay ranking ni canje de XP.

ADMINISTRAR (ADMIN)
- Dashboard: totales de usuarios, espacios, asignaciones, porcentaje completado, gráfica, actividad reciente, exportación CSV.
- Usuarios: lista, cambio de rol, eliminación.
- Logs: fecha, usuario, acción, detalles, IP.
- Configuración: límite de estudiantes por espacio, tiempo máximo de simulación, registro abierto, URL del favicon.

FUNCIONES QUE NO EXISTEN ACTUALMENTE
- No hay mensajería, foros, comentarios, videollamadas ni colaboración simultánea.
- No hay recuperación de contraseña ni edición de perfil.
- No hay descarga de modelos 3D, simulaciones por cada ficha, más de tres escenarios ni datos oceanográficos en vivo.
- No hay buscador web, noticias en tiempo real, ni garantía de que un estado de conservación siga vigente hoy.
- No hay favoritos/notas sincronizados, ranking de XP, tienda ni premios canjeables.

INVENTORY;
    }

    // ===================== UTILIDADES =====================

    private static function normalize(string $text): string
    {
        $text = strip_tags($text);
        $text = function_exists('mb_strtolower') ? mb_strtolower($text, 'UTF-8') : strtolower($text);
        $text = strtr($text, ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n']);
        $text = preg_replace('/[^\p{L}\p{N}]+/u', ' ', $text);
        $text = preg_replace('/\s+/u', ' ', $text);
        return trim($text);
    }

    private static function containsAnyTerm(string $normalizedText, array $terms): bool
    {
        $haystack = ' ' . $normalizedText . ' ';
        foreach ($terms as $term) {
            $needle = self::normalize($term);
            if ($needle !== '' && strpos($haystack, ' ' . $needle . ' ') !== false) {
                return true;
            }
        }
        return false;
    }
}