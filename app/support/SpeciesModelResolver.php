<?php

final class SpeciesModelResolver
{
    private string $modelsDirectory;
    private string $publicBasePath;
    private ?array $modelIndex = null;

    public function __construct(string $modelsDirectory, string $publicBasePath)
    {
        $this->modelsDirectory = rtrim($modelsDirectory, "\\/");
        $this->publicBasePath = rtrim($publicBasePath, '/');
    }

    public function resolve(
        string $commonName,
        string $scientificName,
        string $category,
        ?string $legacyPath = null
    ): array {
        $filename = $this->findMatchingFilename([$commonName, $scientificName]);

        if ($filename !== null) {
            return [
                'path' => $this->publicBasePath . '/' . rawurlencode($filename),
                'view' => $this->detectView($commonName, $category),
                'source' => 'automatic',
                'filename' => $filename,
            ];
        }

        $legacyPath = trim((string)$legacyPath);

        return [
            'path' => $legacyPath !== '' ? $legacyPath : null,
            'view' => $this->detectView($commonName, $category),
            'source' => $legacyPath !== '' ? 'legacy' : 'missing',
            'filename' => null,
        ];
    }

    public static function normalizeName(string $value): string
    {
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        $transliterated = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
        if ($transliterated !== false) {
            $value = $transliterated;
        }

        $value = strtolower($value);
        $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';

        return trim($value, '-');
    }

    private function findMatchingFilename(array $speciesNames): ?string
    {
        $index = $this->getModelIndex();

        foreach ($speciesNames as $name) {
            $normalizedName = self::normalizeName((string)$name);
            if ($normalizedName !== '' && isset($index[$normalizedName])) {
                return $index[$normalizedName];
            }
        }

        return null;
    }

    private function getModelIndex(): array
    {
        if ($this->modelIndex !== null) {
            return $this->modelIndex;
        }

        $this->modelIndex = [];
        if (!is_dir($this->modelsDirectory)) {
            return $this->modelIndex;
        }

        $files = scandir($this->modelsDirectory);
        if ($files === false) {
            return $this->modelIndex;
        }

        foreach ($files as $filename) {
            $fullPath = $this->modelsDirectory . DIRECTORY_SEPARATOR . $filename;
            if (!is_file($fullPath) || strtolower(pathinfo($filename, PATHINFO_EXTENSION)) !== 'glb') {
                continue;
            }

            $key = self::normalizeName(pathinfo($filename, PATHINFO_FILENAME));
            if ($key !== '' && !isset($this->modelIndex[$key])) {
                $this->modelIndex[$key] = $filename;
            }
        }

        return $this->modelIndex;
    }

    private function detectView(string $commonName, string $category): string
    {
        $name = self::normalizeName($commonName);
        $category = self::normalizeName($category);

        $frontFacingNames = ['cangrejo', 'jaiba', 'centollo'];
        foreach ($frontFacingNames as $keyword) {
            if (preg_match('/(^|-)' . preg_quote($keyword, '/') . '(-|$)/', $name) === 1) {
                return 'front';
            }
        }

        // Peces, cetaceos, tortugas y el resto de especies alargadas usan vista lateral.
        // En crustaceos solo los nombres de cangrejos/jaibas cambian a vista frontal.
        return $category === 'crustaceos' && str_contains($name, 'cangrejo') ? 'front' : 'side';
    }
}
