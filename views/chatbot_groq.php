<?php
/**
 * Endpoint para el chatbot con Groq
 * Ubicación: views/chatbot_groq.php
 */

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../app/controllers/ChatbotGroqController.php';

$message = trim($_POST['message'] ?? $_GET['message'] ?? '');
$context = trim($_POST['context'] ?? '');

if (empty($message)) {
    echo json_encode([
        'error' => 'Mensaje vacío',
        'response' => '🌊 ¡Hola! Soy Akira. Por favor, escribe una pregunta para poder ayudarte. 😊'
    ]);
    exit;
}

try {
    $ai = new ChatbotGroqController();
    $response = $ai->getResponse($message, $context);
    
    echo json_encode([
        'response' => $response,
        'source' => 'groq',
        'success' => true
    ]);
} catch (Exception $e) {
    error_log("Error en Groq: " . $e->getMessage());
    
    echo json_encode([
        'error' => 'exception',
        'response' => '😊 Lo siento, Akira está teniendo problemas técnicos. Por favor, intenta de nuevo en unos segundos. 🌊',
        'source' => 'fallback',
        'success' => false
    ]);
}
?>