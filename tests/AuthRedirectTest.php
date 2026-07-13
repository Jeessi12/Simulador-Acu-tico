<?php

require_once __DIR__ . '/../app/support/AuthRedirect.php';

function assertSameValue($expected, $actual, string $message): void
{
    if ($expected !== $actual) {
        fwrite(STDERR, "FAIL: {$message}\nExpected: " . var_export($expected, true)
            . "\nActual: " . var_export($actual, true) . "\n");
        exit(1);
    }
}

function assertDestinationValidity(string $destination, bool $expected): void
{
    assertSameValue(
        $expected,
        AuthRedirect::isValidInternalDestination($destination),
        "Destination validation for {$destination}"
    );
}

assertDestinationValidity('/Simulador-Acu-tico-main/views/simulador.php?asignacion=42&tab=datos', true);
assertDestinationValidity('/Simulador-Acu-tico-main/views/especies.php', true);
assertDestinationValidity('https://evil.example/steal', false);
assertDestinationValidity('//evil.example/steal', false);
assertDestinationValidity('/outside-app/page.php', false);
assertDestinationValidity('/Simulador-Acu-tico-main/%2e%2e/outside.php', false);
assertDestinationValidity('/Simulador-Acu-tico-main/views/login.php', false);
assertDestinationValidity("/Simulador-Acu-tico-main/views/especies.php\r\nX-Test: bad", false);

$_SESSION = [
    'auth_intended_destination' => [
        'url' => '/Simulador-Acu-tico-main/views/simulador.php?asignacion=42&tab=datos',
        'created_at' => time(),
    ],
];

assertSameValue(
    '/Simulador-Acu-tico-main/views/simulador.php?asignacion=42&tab=datos#observaciones',
    AuthRedirect::consumeIntendedDestination('#observaciones'),
    'A valid destination retains its query string and fragment'
);
assertSameValue(false, isset($_SESSION['auth_intended_destination']), 'The destination is consumed once');
assertSameValue(
    '/Simulador-Acu-tico-main/views/index.php',
    AuthRedirect::consumeIntendedDestination(),
    'A repeated redirect falls back to the home page'
);
assertSameValue(
    '/Simulador-Acu-tico-main/views/index.php?verificacion=ok',
    AuthRedirect::consumeIntendedDestination(
        null,
        '/Simulador-Acu-tico-main/views/index.php?verificacion=ok'
    ),
    'An authentication path may retain its existing internal fallback'
);

$_SESSION = [
    'auth_intended_destination' => [
        'url' => '/Simulador-Acu-tico-main/views/especies.php',
        'created_at' => time() - 3600,
    ],
];
assertSameValue(
    '/Simulador-Acu-tico-main/views/index.php',
    AuthRedirect::consumeIntendedDestination(),
    'An expired destination falls back to the home page'
);

$_SESSION = [];
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/Simulador-Acu-tico-main/views/especies.php?familia=coral';
AuthRedirect::rememberCurrentRequest();
assertSameValue(
    '/Simulador-Acu-tico-main/views/especies.php?familia=coral',
    AuthRedirect::consumeIntendedDestination(),
    'The complete current path and query string are stored'
);

fwrite(STDOUT, "AuthRedirect tests passed.\n");
