<?php
/**
 * Endpoint para el chatbot con Groq
 * Modelo: llama-3.1-8b-instant
 * Ubicación: views/chatbot_groq.php
 * 
 * 🔥 SIEMPRE devuelve JSON
 */

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

// === Cargar el controlador ===
require_once __DIR__ . '/../app/controllers/ChatbotGroqController.php';

// === Obtener mensaje del usuario ===
$message = trim($_POST['message'] ?? $_GET['message'] ?? '');
$context = trim($_POST['context'] ?? '');

if (empty($message)) {
    echo json_encode([
        'error' => 'mensaje_vacio',
        'response' => '🌊 ¡Hola! Soy Akira. Por favor, escribe una pregunta para poder ayudarte. 😊',
        'success' => false
    ]);
    exit;
}

// === Intentar obtener respuesta de la IA ===
try {
    $ai = new ChatbotGroqController();
    $response = $ai->getResponse($message, $context);
    
    echo json_encode([
        'response' => $response,
        'source' => 'groq',
        'success' => true
    ]);
    
} catch (Exception $e) {
    error_log("🔥 Groq EXCEPCIÓN: " . $e->getMessage());
    
    echo json_encode([
        'error' => 'exception',
        'response' => '😊 Lo siento, Akira no puede conectarse en este momento. Por favor, intenta de nuevo en unos segundos. 🌊',
        'success' => false
    ]);
}
?>