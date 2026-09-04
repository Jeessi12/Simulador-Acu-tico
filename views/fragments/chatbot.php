<?php
/**
 * Endpoint para el chatbot con Gemini
 * Ubicación: views/chatbot_ai.php
 * SIN RESTRICCIONES - Responde a TODO
 */

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../app/controllers/ChatbotAIController.php';

$message = $_POST['message'] ?? $_GET['message'] ?? '';
$context = $_POST['context'] ?? '';

if (empty($message)) {
    echo json_encode([
        'error' => 'Mensaje vacío',
        'response' => 'Por favor, escribe una pregunta para poder ayudarte.'
    ]);
    exit;
}

try {
    $ai = new ChatbotAIController();
    $response = $ai->getResponse($message, $context);
    
    echo json_encode([
        'response' => $response,
        'source' => 'gemini',
        'success' => true
    ]);
} catch (Exception $e) {
    error_log("Error en Gemini: " . $e->getMessage());
    
    echo json_encode([
        'error' => 'Error al procesar la solicitud: ' . $e->getMessage(),
        'response' => '⚠️ Lo siento, el servicio de IA no está disponible en este momento. Por favor, intenta más tarde.',
        'source' => 'fallback',
        'success' => false
    ]);
}
?>