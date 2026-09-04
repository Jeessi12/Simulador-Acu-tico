<?php

/**
 * Centralizes one-time, same-application redirects around authentication.
 *
 * The destination is kept server-side so it cannot be replaced through a
 * return URL query parameter. It is still validated when consumed in case a
 * session is stale or malformed.
 */
final class AuthRedirect
{
    private const APP_BASE_PATH = '/Simulador-Acu-tico-main';
    private const LOGIN_PATH = self::APP_BASE_PATH . '/views/login.php';
    private const DEFAULT_PATH = self::APP_BASE_PATH . '/views/index.php';
    private const SESSION_KEY = 'auth_intended_destination';
    private const MAX_AGE_SECONDS = 1800;
    private const MAX_DESTINATION_LENGTH = 4096;
    private const MAX_FRAGMENT_LENGTH = 2048;

    private const AUTHENTICATION_PATHS = [
        self::APP_BASE_PATH . '/views/login.php',
        self::APP_BASE_PATH . '/views/registro.php',
        self::APP_BASE_PATH . '/views/google-login.php',
        self::APP_BASE_PATH . '/views/google-callback.php',
        self::APP_BASE_PATH . '/app/controllers/AuthController.php',
        self::APP_BASE_PATH . '/app/controllers/GoogleAuthController.php',
        self::APP_BASE_PATH . '/app/controllers/GoogleLoginController.php',
        self::APP_BASE_PATH . '/app/controllers/LogoutController.php',
    ];

    public static function requireAuthentication(string $error = 'locked'): void
    {
        if (isset($_SESSION['usuario'], $_SESSION['id'])) {
            return;
        }

        self::rememberCurrentRequest();
        self::redirect(self::LOGIN_PATH . '?error=' . rawurlencode($error));
    }

    public static function rememberCurrentRequest(): void
    {
        $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        if ($method !== 'GET' && $method !== 'HEAD') {
            return;
        }

        $destination = (string) ($_SERVER['REQUEST_URI'] ?? '');
        if (!self::isValidInternalDestination($destination)) {
            return;
        }

        $_SESSION[self::SESSION_KEY] = [
            'url' => $destination,
            'created_at' => time(),
        ];
    }
    /**
     * Retains a browser fragment while an external OAuth round trip occurs.
     * Fragments are never sent in HTTP requests, so the login page forwards it
     * separately and only an existing server-side destination may receive it.
     */
    public static function rememberFragment(?string $fragment): void
    {
        $fragment = self::validatedFragment($fragment);
        if ($fragment === null || !isset($_SESSION[self::SESSION_KEY])) {
            return;
        }

        $_SESSION[self::SESSION_KEY]['fragment'] = $fragment;
    }

    public static function redirectAfterAuthentication(
        ?string $fragment = null,
        ?string $defaultDestination = null
    ): void
    {
        self::redirect(self::consumeIntendedDestination($fragment, $defaultDestination));
    }

    public static function consumeIntendedDestination(
        ?string $fragment = null,
        ?string $defaultDestination = null
    ): string
    {
        $fallback = is_string($defaultDestination)
            && self::isValidInternalDestination($defaultDestination)
                ? $defaultDestination
                : self::DEFAULT_PATH;
        $stored = $_SESSION[self::SESSION_KEY] ?? null;
        unset($_SESSION[self::SESSION_KEY]);

        if (!is_array($stored)) {
            return $fallback;
        }

        $createdAt = $stored['created_at'] ?? null;
        $destination = $stored['url'] ?? null;
        if (!is_int($createdAt)
            || $createdAt > time() + 60
            || time() - $createdAt > self::MAX_AGE_SECONDS
            || !is_string($destination)
            || !self::isValidInternalDestination($destination)
        ) {
            return $fallback;
        }

        $validFragment = self::validatedFragment($fragment);
        if ($validFragment === null) {
            $validFragment = self::validatedFragment($stored['fragment'] ?? null);
        }

        return $destination . ($validFragment ?? '');
    }

    public static function isValidInternalDestination($destination): bool
    {
        if (!is_string($destination)
            || $destination === ''
            || strlen($destination) > self::MAX_DESTINATION_LENGTH
            || preg_match('/[\x00-\x1F\x7F\\\\]/', $destination)
            || $destination[0] !== '/'
            || str_starts_with($destination, '//')
            || str_contains($destination, '#')
        ) {
            return false;
        }

        $parts = parse_url($destination);
        if ($parts === false
            || isset($parts['scheme'])
            || isset($parts['host'])
            || isset($parts['user'])
            || isset($parts['pass'])
            || isset($parts['port'])
        ) {
            return false;
        }

        $path = $parts['path'] ?? '';
        $decodedPath = $path;
        for ($i = 0; $i < 3; $i++) {
            $next = rawurldecode($decodedPath);
            if ($next === $decodedPath) {
                break;
            }
            $decodedPath = $next;
        }

        if (preg_match('/[\x00-\x1F\x7F\\\\]/', $decodedPath)
            || ($decodedPath !== self::APP_BASE_PATH
                && !str_starts_with($decodedPath, self::APP_BASE_PATH . '/'))
        ) {
            return false;
        }

        foreach (explode('/', $decodedPath) as $segment) {
            if ($segment === '.' || $segment === '..') {
                return false;
            }
        }

        return !in_array(rtrim($decodedPath, '/'), self::AUTHENTICATION_PATHS, true);
    }

    private static function validatedFragment($fragment): ?string
    {
        if (!is_string($fragment) || $fragment === '') {
            return null;
        }

        if ($fragment[0] !== '#') {
            $fragment = '#' . $fragment;
        }

        if (strlen($fragment) > self::MAX_FRAGMENT_LENGTH
            || preg_match('/[\x00-\x1F\x7F]/', $fragment)
        ) {
            return null;
        }

        return $fragment;
    }

    private static function redirect(string $destination): void
    {
        header('Location: ' . $destination, true, 302);
        exit;
    }
}
