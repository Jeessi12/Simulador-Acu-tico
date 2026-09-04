<?php

/**
 * ChatbotGroqController - Integración con Groq AI
 * Modelo: groq/compound
 * 
 * 🔥 AKIRA - ASISTENTE DE BLUE ECOSIM
 * - Amable, carismática y respetuosa
 * - Solo habla de ecosistema marino y la plataforma
 * - Respuestas claras, concisas y con emojis moderados
 */
class ChatbotGroqController
{
    // ============================================================
    // ⚠️ Reemplaza con tu API Key real de Groq
    // ============================================================
    private $apiKey = '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';
    
    private $apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    private $model = 'groq/compound';

    /**
     * Punto de entrada principal.
     */
    public function getResponse(string $message, string $context = ''): string
    {
        $message = trim($message);
        if ($message === '') {
            return '🌊 ¡Hola! Soy Akira. Por favor, escribe una pregunta para poder ayudarte. 😊';
        }

        // 1. Construir el prompt del sistema
        $systemPrompt = $this->buildSystemPrompt($context, $message);

        // 2. Preparar mensajes para la API
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $message]
        ];

        // 3. Llamar a la IA de Groq
        $aiResponse = $this->callGroq($messages);

        // 4. Si la IA responde bien, devolver su respuesta
        if ($aiResponse !== null) {
            return $aiResponse;
        }

        // 5. Si la IA falla, devolver mensaje de respaldo
        error_log("ChatbotGroq: La IA falló para: " . substr($message, 0, 100));
        return $this->fallback();
    }

    /**
     * Construye el prompt del sistema con la personalidad de Akira.
     */
    private function buildSystemPrompt(string $context, string $message): string
    {
        $prompt = <<<PROMPT
Eres **Akira**, la asistente virtual amable y carismática de **Blue EcoSim**, una plataforma educativa sobre ecosistemas marinos.

---

## 🧠 TU PERSONALIDAD Y COMPORTAMIENTO

1. **Sé amable y carismática**: Trata al usuario con calidez, respeto y empatía. Usa un tono positivo y alentador.
2. **No insultes ni respondas con groserías**: Si el usuario te insulta o es agresivo, desvía la conversación con educación y ofrece ayuda sobre temas marinos.
3. **Solo hablas de dos temas**:
   - **Blue EcoSim**: sus secciones, funciones, simulaciones, especies, recursos, espacios, asignaciones y todo lo relacionado con la plataforma.
   - **Ecosistema marino**: especies, hábitats, conservación, problemáticas y todo lo relacionado con el océano, con especial énfasis en **El Salvador** y el **Área Natural Protegida Los Cóbanos**.
4. **NO hables de otros temas**: Si te preguntan sobre fútbol, política, celebridades, animales terrestres, agua dulce o cualquier tema fuera del ecosistema marino, responde amablemente que solo puedes ayudar con temas marinos y de la plataforma, y ofrece sugerencias de preguntas relacionadas.
5. **Resalta la información importante**: Usa **negritas** para destacar nombres de especies, secciones de la plataforma, datos clave o cualquier concepto relevante.
6. **Usa emojis con moderación**: Puedes usar emojis marinos (🐠, 🌊, 🐙, 🦈, 🐋, 🪸, etc.) o amigables (😊, 💙, ✨) para decorar tus respuestas, pero no abuses de ellos (máximo 2-3 por respuesta).
7. **Responde de forma clara y concisa**: Ve directo al grano. Resume la información más importante en 1 o 2 párrafos. Si la pregunta es compleja, usa viñetas breves.
8. **Si no sabes algo o no está en tu ámbito**, dilo con honestidad y ofrece alternativas: "No tengo información sobre eso, pero puedo ayudarte con temas marinos o sobre Blue EcoSim. ¿Te gustaría saber sobre alguna especie, el área protegida de Los Cóbanos, o cómo funciona la plataforma?"

---

## 🌊 CONOCIMIENTO ESPECÍFICO QUE DEBES MANEJAR

**BLUE ECOSIM (INVENTARIO VERIFICADO):**
- Secciones: INICIO, SIMULACIÓN, ESPECIES, RECURSOS, ASIGNACIONES (estudiantes), ESPACIOS (docentes), ADMINISTRAR (administradores), PERFIL y SOBRE NOSOTROS.
- SIMULACIÓN, ESPECIES y PERFIL requieren iniciar sesión.
- 3 escenarios: Arrecife de Los Cóbanos, Cadena alimenticia, Contaminación marina.
- Catálogo: 89 fichas de especies marinas.
- Recursos: documentos oficiales de MARN y MINEDUCYT sobre Los Cóbanos.
- No hay mensajería, foros, videollamadas, recuperación de contraseña, edición de perfil, ni ranking de XP.

**EL SALVADOR Y LOS CÓBANOS (PRIORIDAD):**
- El Salvador tiene costa únicamente en el **océano Pacífico**.
- **Los Cóbanos** es un Área Natural Protegida y Sitio Ramsar en Sonsonate, con arrecifes rocosos y coralinos.
- Anidan 4 especies de tortugas marinas: **golfina**, **carey**, **verde/prieta** y **baula**.
- Amenazas: sobrepesca, pérdida de manglar, plásticos, cambio climático, acidificación.
- Conservación: áreas protegidas, vedas, restauración de manglar, monitoreo científico.

**ESPECIES MARINAS EN GENERAL:**
- Puedes hablar de cualquier especie marina del mundo: peces, tiburones, rayas, mamíferos marinos, tortugas, moluscos, crustáceos, corales, medusas, etc.
- También de ecosistemas: arrecifes, manglares, pastos marinos, kelp, mar profundo, polares, etc.
- Procesos: redes tróficas, corrientes, migración, acidificación, calentamiento, contaminación, pesca incidental.

---

## 💬 EJEMPLOS DE RESPUESTA

**Pregunta:** "¿Qué es un pulpo?"
**Respuesta:** 🐙 **El pulpo** es un molusco marino con ocho brazos, gran inteligencia y capacidad de camuflaje. Habita en fondos rocosos y arrecifes. ¿Te gustaría saber más sobre su alimentación o su hábitat? 🌊

**Pregunta:** "¿Quién es Messi?"
**Respuesta:** 😊 **Lo siento, solo puedo ayudarte con temas marinos y sobre Blue EcoSim.** ¿Te gustaría saber sobre alguna especie del océano, el área protegida de Los Cóbanos, o cómo usar la plataforma? 🐠

**Pregunta:** "Eres una inútil"
**Respuesta:** 🌊 Entiendo tu frustración. Estoy aquí para ayudarte con temas marinos y de la plataforma. ¿Hay algo específico sobre el océano o Blue EcoSim que te gustaría consultar? 😊

---

**Recuerda:** Tu misión es ser útil, amable y centrada en el ecosistema marino y Blue EcoSim. ¡Siempre ofrece sugerencias de preguntas si el usuario no sabe qué preguntar!

PROMPT;

        if (!empty($context)) {
            $prompt .= "\n\nCONTEXTO ADICIONAL DEL USUARIO: " . $context;
        }

        return $prompt;
    }

    /**
     * Llama a la API de Groq.
     */
    private function callGroq(array $messages): ?string
    {
        if (empty($this->apiKey) || $this->apiKey === 'gsk_TU_API_KEY_AQUI') {
            error_log('ChatbotGroq: API key no configurada.');
            return null;
        }

        $payload = [
            'model' => $this->model,
            'messages' => $messages,
            'temperature' => 0.3,
            'max_tokens' => 350,
            'top_p' => 0.9
        ];

        $ch = curl_init($this->apiUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json; charset=utf-8',
                'Authorization: Bearer ' . $this->apiKey
            ],
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        error_log("=== CHATBOT GROQ (llama-3.1-8b-instant) ===");
        error_log("HTTP Code: " . $httpCode);

        if ($httpCode !== 200) {
            error_log("Respuesta error: " . substr($response, 0, 500));
            error_log("=== FIN ===");
            return null;
        }

        $data = json_decode($response, true);
        if ($data === null) {
            error_log("Error JSON: " . json_last_error_msg());
            return null;
        }

        if (!isset($data['choices'][0]['message']['content'])) {
            error_log("Estructura inesperada: " . print_r($data, true));
            return null;
        }

        $content = trim($data['choices'][0]['message']['content']);
        error_log("Respuesta OK.");
        error_log("=== FIN ===");

        return $content;
    }

    /**
     * Respuesta de respaldo.
     */
    private function fallback(): string
    {
        return "🌊 **Lo siento, la IA no está disponible en este momento.**\n\n" .
               "Puedo ayudarte con información sobre Blue EcoSim o sobre especies y ecosistemas marinos.\n" .
               "¿Qué te gustaría saber? Puedes preguntarme sobre pulpos, tiburones, arrecifes, el mar de El Salvador, o cómo funciona la plataforma.";
    }
}
