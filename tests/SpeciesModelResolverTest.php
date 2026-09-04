<?php

require_once __DIR__ . '/../app/support/SpeciesModelResolver.php';

function assertModelValue($expected, $actual, string $message): void
{
    if ($expected !== $actual) {
        fwrite(STDERR, "FAIL: {$message}\nExpected: " . var_export($expected, true)
            . "\nActual: " . var_export($actual, true) . "\n");
        exit(1);
    }
}

$testDirectory = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'blueecosim-models-' . bin2hex(random_bytes(5));
mkdir($testDirectory, 0777, true);

$testFiles = [
    'Pez Ángel_Real.GLB',
    'Cangrejo Fantasma.glb',
    'Mobula birostris.glb',
    'archivo-ignorado.txt',
];

foreach ($testFiles as $filename) {
    file_put_contents($testDirectory . DIRECTORY_SEPARATOR . $filename, 'test');
}

try {
    $resolver = new SpeciesModelResolver($testDirectory, '../public/media/3D_Models');

    $fish = $resolver->resolve('Pez Ángel Real', 'Holacanthus passer', 'peces', 'legacy-fish.glb');
    assertModelValue('../public/media/3D_Models/Pez%20%C3%81ngel_Real.GLB', $fish['path'], 'Coincidencia por nombre comun');
    assertModelValue('automatic', $fish['source'], 'El archivo automatico tiene prioridad');
    assertModelValue('side', $fish['view'], 'Los peces usan vista lateral');

    $crab = $resolver->resolve('Cangrejo Fantasma', 'Ocypode gaudichaudii', 'crustaceos', null);
    assertModelValue('front', $crab['view'], 'Los cangrejos usan vista frontal');

    $scientific = $resolver->resolve('Mantarraya gigante', 'Mobula birostris', 'peces', null);
    assertModelValue('../public/media/3D_Models/Mobula%20birostris.glb', $scientific['path'], 'Coincidencia por nombre cientifico');

    $legacy = $resolver->resolve('Especie sin archivo', 'Species absent', 'moluscos', 'legacy.glb');
    assertModelValue('legacy.glb', $legacy['path'], 'Compatibilidad con la ruta anterior');
    assertModelValue('legacy', $legacy['source'], 'La ruta anterior se identifica como respaldo');

    assertModelValue('pez-angel-real', SpeciesModelResolver::normalizeName('Pez Ángel_Real'), 'Normalizacion de acentos y separadores');
} finally {
    foreach ($testFiles as $filename) {
        unlink($testDirectory . DIRECTORY_SEPARATOR . $filename);
    }
    rmdir($testDirectory);
}

echo "SpeciesModelResolverTest OK\n";
