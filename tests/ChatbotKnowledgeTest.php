<?php

require_once __DIR__ . '/../app/data/ChatbotKnowledge.php';
require_once __DIR__ . '/../app/controllers/ChatbotGroqController.php';

function assertChatbot(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

$speciesSimulatorQuestion = 'Puedo seleccionar cualquier especie del apartado de especies para usarla en el simulador';
$platformPrompt = ChatbotKnowledge::systemPrompt('Usuario: Prueba', $speciesSimulatorQuestion);
$marinePrompt = ChatbotKnowledge::systemPrompt('', '¿Qué especies marinas viven en los manglares de El Salvador?');
$ambiguousPrompt = ChatbotKnowledge::systemPrompt('', '¿Y cuáles son?');

assertChatbot(strlen($platformPrompt) < 8000, 'El contexto de plataforma volvió a crecer demasiado.');
assertChatbot(strlen($marinePrompt) < 8000, 'El contexto marino volvió a crecer demasiado.');
assertChatbot(strlen($ambiguousPrompt) < 3000, 'El contexto para seguimientos ambiguos es demasiado grande.');
assertChatbot(strpos($platformPrompt, 'No se puede escoger libremente') !== false, 'Falta la regla catálogo-simulador.');
assertChatbot(strpos($platformPrompt, 'Cadena alimenticia') !== false, 'Falta el inventario de simulaciones.');
assertChatbot(strpos($marinePrompt, 'PRIORIDAD: EL SALVADOR') !== false, 'Falta el contexto marino salvadoreño.');
assertChatbot(strpos($marinePrompt, 'ADMINISTRAR (ADMIN)') === false, 'Se mezcló inventario administrativo en una pregunta marina.');
assertChatbot(strpos($platformPrompt, 'lista cerrada') !== false, 'Falta la regla de inventario cerrado para la plataforma.');
assertChatbot(strpos($marinePrompt, 'no introduzcas la plataforma') !== false, 'Falta impedir menciones inventadas de Blue EcoSim en ciencia general.');
assertChatbot(strpos($platformPrompt, 'Delfín nariz de botella') !== false, 'Falta identificar el único cetáceo del catálogo.');

$scopeCases = [
    'los perros saben nadar?' => ChatbotKnowledge::SCOPE_OUT_OF_SCOPE,
    'Hola, ¿los perros saben nadar?' => ChatbotKnowledge::SCOPE_OUT_OF_SCOPE,
    '¿Qué peces viven en los ríos?' => ChatbotKnowledge::SCOPE_OUT_OF_SCOPE,
    '¿Cuál es la capital de Costa Rica?' => ChatbotKnowledge::SCOPE_OUT_OF_SCOPE,
    '¿Hay vida en Marte?' => ChatbotKnowledge::SCOPE_OUT_OF_SCOPE,
    '¿Qué especies hay en El Salvador?' => ChatbotKnowledge::SCOPE_AMBIGUOUS,
    '¿Qué especies marinas hay en El Salvador?' => ChatbotKnowledge::SCOPE_MARINE,
    '¿Cómo afectan los perros ferales a las tortugas marinas?' => ChatbotKnowledge::SCOPE_MARINE,
    '¿Qué hay en el apartado de especies?' => ChatbotKnowledge::SCOPE_PLATFORM,
    '¿Qué hay en recursos?' => ChatbotKnowledge::SCOPE_PLATFORM,
    '¿Hay perros en Blue EcoSim?' => ChatbotKnowledge::SCOPE_PLATFORM,
];

foreach ($scopeCases as $question => $expectedScope) {
    assertChatbot(
        ChatbotKnowledge::classifyScope($question) === $expectedScope,
        "Ámbito incorrecto para: {$question}"
    );
}

assertChatbot(
    ChatbotKnowledge::classifyScope('¿Y dónde viven?', ChatbotKnowledge::SCOPE_MARINE) === ChatbotKnowledge::SCOPE_MARINE,
    'Un seguimiento marino breve perdió el ámbito de la conversación.'
);

$controller = new ChatbotGroqController();
$dogAnswer = $controller->getResponse('los perros saben nadar?');
assertChatbot(strpos($dogAnswer, 'fuera de mi ámbito') !== false, 'La pregunta sobre perros no fue bloqueada antes de llamar a la IA.');
assertChatbot(stripos($dogAnswer, 'Labrador') === false, 'Se inventó una raza de perro en la respuesta limitada.');
assertChatbot(stripos($dogAnswer, 'Blue EcoSim') !== false, 'La respuesta limitada no explica el ámbito permitido.');

$platformDogAnswer = $controller->getResponse('¿Hay perros o Labradores en Blue EcoSim?');
assertChatbot(strpos($platformDogAnswer, 'no documenta ese tema terrestre') !== false, 'No se rechazó una falsa premisa terrestre sobre la plataforma.');
assertChatbot(strpos($platformDogAnswer, 'No voy a inventar') !== false, 'La respuesta no deja clara la política contra invenciones.');

$publicCreatorAnswer = $controller->getResponse('¿Hay algún apartado sobre los creadores del sitio?');
assertChatbot(strpos($publicCreatorAnswer, 'Sí existe el apartado Sobre Nosotros') !== false, 'La ruta pública contradijo el inventario verificado sobre los creadores.');

$dogAfterPlatformAnswer = $controller->getResponse('los perros saben nadar?');
assertChatbot(strpos($dogAfterPlatformAnswer, 'fuera de mi ámbito') !== false, 'El historial de plataforma contaminó una pregunta terrestre posterior.');
assertChatbot(stripos($dogAfterPlatformAnswer, 'Labrador') === false, 'El historial volvió a introducir una raza inventada.');

$identityAnswer = $controller->getResponse('¿Quién eres?');
assertChatbot(strpos($identityAnswer, 'Soy Akira') !== false, 'La presentación de Akira perdió su identidad.');
assertChatbot(substr_count($identityAnswer, "\n") >= 4, 'La presentación volvió a convertirse en un bloque de texto sin estructura.');

$orcaPreferenceAnswer = $controller->getResponse('¿Te gustan las orcas?');
assertChatbot(strpos($orcaPreferenceAnswer, 'me parecen fascinantes') !== false, 'Akira perdió su personalidad en una pregunta marina informal.');
assertChatbot(stripos($orcaPreferenceAnswer, 'no tengo capacidad') === false, 'Akira volvió a responder con una limitación robótica innecesaria.');

$orcaCatalogAnswer = $controller->getResponse('¿Hay orcas en el sitio?');
assertChatbot(strpos($orcaCatalogAnswer, 'No hay una ficha propia de orca') !== false, 'No se distinguió una ficha de una simple mención de orcas.');
assertChatbot(strpos($orcaCatalogAnswer, 'sí aparece mencionada como depredador') !== false, 'Se negó incorrectamente toda mención de orcas en el catálogo.');

$fallback = new ReflectionMethod(ChatbotGroqController::class, 'getFallbackResponse');
$fallback->setAccessible(true);

$specificAnswer = $fallback->invoke($controller, $speciesSimulatorQuestion);
assertChatbot(strpos($specificAnswer, 'No puedes seleccionar cualquier especie') !== false, 'La pregunta específica no recibió la respuesta esperada.');
assertChatbot(strpos($specificAnswer, 'Apartados de Blue EcoSim') === false, 'La palabra apartado activó incorrectamente el listado general.');

$sectionsAnswer = $fallback->invoke($controller, '¿Cuáles son todos los apartados de la página?');
assertChatbot(strpos($sectionsAnswer, 'Apartados de Blue EcoSim') !== false, 'La consulta real de apartados no fue reconocida.');

$creatorAnswer = $fallback->invoke($controller, '¿Hay un apartado sobre los creadores?');
assertChatbot(strpos($creatorAnswer, 'Sobre Nosotros') !== false, 'La consulta sobre creadores no fue reconocida.');

$turtleRecordAnswer = $fallback->invoke($controller, '¿Qué muestra el registro de tortugas marinas?');
assertChatbot(strpos($turtleRecordAnswer, 'Cómo registrarte') === false, 'Registro científico se confundió con registro de cuenta.');

$fishingAdministrationAnswer = $fallback->invoke($controller, '¿Qué es la administración pesquera?');
assertChatbot(strpos($fishingAdministrationAnswer, 'Panel de Administración') === false, 'Administración pesquera se confundió con el panel ADMIN.');

echo "Chatbot knowledge tests passed.\n";
