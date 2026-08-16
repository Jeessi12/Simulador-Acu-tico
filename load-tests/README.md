# Prueba de carga: 100 usuarios

Este escenario utiliza [Artillery](https://www.artillery.io/) para simular 100 visitantes concurrentes en las secciones públicas de BlueEcoSim. No inicia sesión, no crea cuentas y no escribe en la base de datos.

## Antes de ejecutarla

1. Inicia Apache y MySQL desde el panel de XAMPP.
2. Confirma que la página abre en `http://localhost/Simulador-Acu-tico-main/views/index.php`.
3. Cierra otras aplicaciones pesadas para que la medición sea más representativa.

## Ejecutar el test

Desde la carpeta raíz del proyecto ejecuta:

```powershell
npm.cmd run test:load
```

Para guardar el resultado detallado de la ejecución:

```powershell
npm.cmd run test:load:report
```

El archivo generado se guarda en `reports/carga-100-usuarios.json`. Artillery muestra el resumen legible directamente en la terminal; conserva el JSON si necesitas compartir o analizar los datos más adelante.

## Cómo interpretar el resultado

- `http.codes.200`: debe ser igual al total de solicitudes. Códigos `500`, `503` o conexiones rechazadas indican que el servidor no sostuvo la carga.
- `http.response_time.p95`: el 95 % de las respuestas tardó ese tiempo o menos. Para una demostración local, intenta mantenerlo por debajo de 1–2 segundos.
- `http.response_time.p99`: muestra los casos más lentos; compáralo con el p95 para detectar picos.
- `vusers.completed`: debería aproximarse a `110`: 10 del calentamiento y 100 del pico.

## Probar un servidor de pruebas

Nunca ejecutes una carga contra producción sin autorización. Para usar un servidor de pruebas, reemplaza `target` en `100-usuarios.yml` por su URL, guarda el archivo y ejecuta el mismo comando.

## Ajustar la intensidad

- Para una primera comprobación, cambia `arrivalCount: 100` por `arrivalCount: 20`.
- Para sostener los 100 usuarios más tiempo, aumenta `count: 3` dentro del bloque `loop`.
- No incluyas rutas que creen usuarios, envíen mensajes al chatbot o modifiquen asignaciones a menos que uses una base de datos de pruebas.
