# Guía de defensa técnica de Blue EcoSim

Esta guía está basada en el código actual del proyecto. Las respuestas modelo están redactadas para decirlas en voz alta: son técnicas, pero no intentan aparentar que el sistema hace algo que todavía no implementa.

## Mapa rápido del sistema

| Parte | Archivos principales | Responsabilidad |
|---|---|---|
| Conexión a datos | `app/models/Conexion.php` | Abre conexiones MySQL a `simulador` y `simulador_especies` con `utf8mb4`. |
| Autenticación local | `app/controllers/AuthController.php`, `RegisterController.php`, `views/verify.php`, `LogoutController.php` | Registro, hash de contraseña, verificación por correo, login, sesión y logout. |
| OAuth de Google | `GoogleLoginController.php`, `GoogleAuthController.php`, `views/google-callback.php` | Redirección a Google, canje del código OAuth, consulta del perfil y vinculación por correo. |
| Autorización | `app/support/AuthRedirect.php` y validaciones de rol en cada vista | Exige una sesión, recuerda la página solicitada y limita páginas según el rol. |
| Catálogo | `views/especies.php`, `views/api_especies.php`, `public/js/especies.js` | Obtiene las especies como JSON, filtra, busca, muestra detalles, notas, favoritos y modelos 3D. |
| Resolución de modelos | `app/support/SpeciesModelResolver.php` | Busca automáticamente un `.glb` cuyo nombre coincida con la especie y decide vista frontal o lateral. |
| Simulador | `views/simulador.php`, `public/js/simulador.js`, `public/godot/*` | Inicia Godot en un `canvas`, intercambia parámetros y estadísticas, controla tiempo y observaciones. |
| Espacios y tareas | `views/espacios.php`, `views/asignaciones.php`, `app/support/SpaceCapacity.php` | Creación de aulas, invitaciones, cupo, asignación y seguimiento de simulaciones. |
| Notificaciones | `views/notificaciones_lista.php`, `public/js/notificaciones.js` | Invitaciones y operaciones de leído, destacado, archivado y eliminado. Hay limitaciones de integración descritas en el nivel 4. |
| Logros | `AchievementSchema.php`, `AchievementManager.php`, `api_achievements.php` | Registra actividad, calcula métricas, desbloquea logros y muestra progreso. |
| Chatbot | `ChatbotGroqController.php`, `ChatbotKnowledge.php`, `chatbot_groq.php`, `chatbot.js` | Clasifica la consulta, responde casos deterministas o llama a Groq y conserva historial. |
| Interfaz React | `src/**/*.tsx`, configuraciones `vite*.ts` y `public/build/*` | Añade componentes concretos a páginas PHP; no reemplaza toda la aplicación. |
| Base de datos | `MySQL/simuladorDB.sql`, `MySQL/simulador_especiesDB.sql` | Dos esquemas: funcionamiento general y catálogo de especies. |

Flujo simplificado:

```text
Navegador
  -> vista PHP / formulario / fetch
  -> controlador, endpoint o lógica de la propia vista
  -> Conexion.php
  -> MySQL (simulador o simulador_especies)
  -> HTML, redirección o JSON
  -> JavaScript actualiza la interfaz
```

---

# Nivel 1 — Preguntas generales

## 1. ¿Cómo está estructurado Blue EcoSim?

**Respuesta modelo:**

“Blue EcoSim es una aplicación web multipágina. Las vistas están en `views`, la lógica reutilizable se separa en `app/controllers`, `app/models`, `app/services` y `app/support`, y los archivos que recibe el navegador están en `public`. PHP procesa sesiones, permisos y base de datos; JavaScript controla la interacción del navegador. React se usa solo en componentes visuales concretos, Three.js en el catálogo 3D y Godot en la simulación.”

**Concepto — aplicación multipágina:** cada navegación puede pedir un nuevo archivo PHP al servidor. No es una SPA completa, donde casi toda la navegación ocurre dentro de una sola página JavaScript.

## 2. ¿El proyecto utiliza MVC?

**Respuesta modelo:**

“Tiene una separación inspirada en MVC, pero no es un MVC estricto. `Conexion.php` y los esquemas representan datos; los controladores de autenticación y chatbot procesan acciones; las páginas de `views` representan la interfaz. Sin embargo, algunas vistas grandes, como `espacios.php` y `admin.php`, también contienen consultas y reglas de negocio. Por eso lo describiría como una arquitectura PHP por capas en evolución, no como un framework MVC completo.”

**Concepto — MVC:** Modelo administra datos, Vista presenta la interfaz y Controlador coordina una solicitud. La ventaja es reducir la mezcla de responsabilidades.

## 3. ¿Qué tecnologías usa el proyecto y para qué?

**Respuesta modelo:**

“Usamos PHP para la lógica del servidor, MySQL para persistencia, HTML y CSS para la estructura y diseño, y JavaScript para eventos y peticiones asíncronas. Three.js renderiza archivos GLB en WebGL. Godot contiene la simulación exportada a web mediante JavaScript, WebAssembly y un paquete PCK. React y TypeScript se usan en componentes visuales que Vite compila a módulos para insertarlos en las páginas PHP. Composer administra PHPMailer y el cliente de Google; npm administra React, Vite y las dependencias de interfaz.”

## 4. ¿Cómo se comunica el frontend con el backend?

**Respuesta modelo:**

“Se comunica de dos maneras. Los formularios tradicionales envían POST a controladores PHP y normalmente reciben una redirección; por ejemplo, el login va a `AuthController.php`. Las funciones dinámicas usan `fetch`, que es la API del navegador para hacer solicitudes sin recargar toda la página. El catálogo solicita JSON a `api_especies.php`; el simulador envía JSON a `api_achievements.php`; las observaciones usan `FormData` contra `guardar_observacion.php`.”

**Concepto — AJAX:** es el patrón de comunicarse con el servidor de forma asíncrona y actualizar una parte de la interfaz. Actualmente suele implementarse con `fetch`.

## 5. ¿Cómo se conectan a la base de datos?

**Respuesta modelo:**

“La clase `Conexion` centraliza la configuración y crea objetos `mysqli`. `getConnection()` abre la base general `simulador` y `getSpeciesConnection()` abre `simulador_especies`. La conexión se reutiliza dentro de la instancia y establece `utf8mb4`, que permite caracteres Unicode, incluidos acentos y emojis.”

## 6. ¿Por qué existen dos bases de datos?

**Respuesta modelo:**

“Separamos el catálogo del funcionamiento general. `simulador` contiene usuarios, roles, espacios, asignaciones, notificaciones, configuración y logros. `simulador_especies` contiene `especies`, `curiosidades` y `amenazas`. Esto reduce el acoplamiento del catálogo y permite conceder a la cuenta de la aplicación solo permiso de lectura sobre especies, aunque la configuración de credenciales todavía debe mejorarse.”

## 7. ¿Cómo manejan la sesión y los roles?

**Respuesta modelo:**

“Al autenticar correctamente guardamos en la sesión PHP `usuario`, `rol` e `id`. El rol es numérico: 1 estudiante, 2 docente, 3 personal y 4 administrador. Las páginas protegidas llaman a `AuthRedirect::requireAuthentication()` y luego las páginas exclusivas comparan el rol. Por ejemplo, `espacios.php` exige docente, `asignaciones.php` estudiante y `admin.php` administrador.”

**Concepto — sesión:** información que el servidor asocia a un navegador mediante una cookie de identificador. La contraseña no se guarda en la sesión.

## 8. ¿Cómo evitan que un usuario no autenticado entre a una función protegida?

**Respuesta modelo:**

“Hay dos capas. En la interfaz, `auth-modal.js` intercepta enlaces protegidos y muestra un diálogo. La seguridad real está en el servidor: las páginas sensibles llaman a `AuthRedirect::requireAuthentication()`. Aunque alguien escriba directamente la URL o desactive JavaScript, PHP comprueba la sesión y lo envía al login.”

## 9. ¿Qué CRUD existen?

**Respuesta modelo:**

“CRUD significa crear, leer, actualizar y eliminar. Hay CRUD parcial o distribuido: el docente crea y elimina espacios, crea asignaciones e invitaciones y lee miembros y tareas; el administrador lee usuarios, cambia roles y elimina usuarios; el estudiante crea observaciones y actualiza estados de invitación. No existe actualmente un CRUD administrativo completo de especies ni una API REST con las cuatro operaciones: la API de especies es de lectura.”

## 10. ¿Cómo se cargan las especies?

**Respuesta modelo:**

“Al dispararse `DOMContentLoaded`, `loadSpeciesData()` en `public/js/especies.js` hace `fetch('./api_especies.php')`. El endpoint consulta todas las especies, agrega curiosidades, amenazas y la ruta del modelo, y devuelve JSON. Después `renderCards()` filtra los datos en memoria y genera las tarjetas. Si falla, se sustituye el esqueleto de carga por un mensaje y un botón para reintentar.”

## 11. ¿Cómo se integra Godot con la página web?

**Respuesta modelo:**

“`views/simulador.php` carga el motor exportado `public/godot/index.js`. `startGodot()` crea el `canvas`, construye `Engine` con el ejecutable WebAssembly y el paquete PCK y llama a `startGame()`. JavaScript publica variables `window.godot_*` y notifica al puente si existe. En sentido contrario, Godot puede llamar funciones globales como `onGodotStats`, que actualizan poblaciones, alertas y estadísticas de la interfaz.”

**Conceptos:** WebAssembly es un formato binario que permite ejecutar en el navegador código compilado con buen rendimiento. El `.pck` contiene escenas y recursos del proyecto Godot exportado.

## 12. ¿Por qué combinar PHP, React, Three.js y Godot?

**Respuesta modelo:**

“Cada tecnología cubre una necesidad distinta. PHP y MySQL simplifican cuentas y gestión escolar en XAMPP. React ayuda en componentes complejos con estado, pero mantenerlo como islas evita reescribir toda la aplicación. Three.js es apropiado para inspeccionar modelos GLB dentro del catálogo. Godot es más conveniente para una simulación con escenas, entidades y reglas en tiempo real. La desventaja es que aumenta la complejidad de integración y exige definir claramente cuál parte es fuente de verdad.”

---

# Nivel 2 — Funcionalidades específicas

## 13. ¿Qué ocurre cuando un usuario se registra?

**Archivo:** `app/controllers/RegisterController.php`.

**Respuesta modelo:**

“El controlador recibe nombre, correo, contraseña y rol; valida que el rol sea 1, 2 o 3 y comprueba si el correo ya existe. Aplica `password_hash` con bcrypt, crea al usuario con estado `pendiente`, genera un token aleatorio de 64 caracteres hexadecimales y lo guarda con expiración de 24 horas. PHPMailer envía el enlace de verificación. Si el correo no se puede enviar, elimina la cuenta recién creada para no dejarla incompleta.”

## 14. ¿Qué es bcrypt y cómo se comprueba una contraseña?

**Respuesta modelo:**

“Bcrypt es una función de hash diseñada para contraseñas. Genera un valor irreversible e incluye una sal aleatoria y un costo de trabajo. En el registro usamos `password_hash(..., PASSWORD_BCRYPT)` y en el login `password_verify`. No se descifra la contraseña: PHP calcula la verificación usando la información incluida en el hash y compara de forma segura.”

**Repregunta:** ¿Por qué no usar SHA-256 directamente?

**Respuesta corta:** “Porque SHA-256 es demasiado rápido para contraseñas y facilita probar millones de combinaciones. Bcrypt está diseñado para ser deliberadamente costoso y usa sal automáticamente.”

## 15. ¿Cómo funciona la verificación del correo?

**Archivo:** `views/verify.php`.

**Respuesta modelo:**

“El enlace contiene un token generado con `random_bytes`. `verify.php` lo busca junto con su fecha de expiración. Si expiró, elimina el token; si es válido, cambia al usuario a `activo`, elimina el token para que no se reutilice, carga nombre y rol, inicia la sesión y registra el evento de login para los logros.”

## 16. ¿Qué ocurre internamente al iniciar sesión?

**Archivo:** `AuthController.php`.

**Respuesta modelo:**

“Se busca el correo con una consulta preparada. Si existe, `password_verify` compara la contraseña con el hash. Después se exige que el estado sea `activo`; se guardan id, nombre y rol en `$_SESSION`, se registra el login en el sistema de logros y `AuthRedirect` devuelve al usuario a la página protegida que había intentado abrir.”

## 17. ¿Cómo funciona el regreso a la página solicitada después del login?

**Archivo/clase:** `AuthRedirect`.

**Respuesta modelo:**

“Cuando una página protegida detecta que falta la sesión, `rememberCurrentRequest()` guarda la URL interna en la sesión por un máximo de 30 minutos. Tras autenticar, `consumeIntendedDestination()` la valida y la consume una sola vez. Solo acepta rutas dentro de `/Simulador-Acu-tico-main`, rechaza esquema, host, barras dobles, recorridos `..` y páginas de autenticación. Así evita una redirección abierta hacia un sitio malicioso.”

## 18. ¿Cómo funciona el login con Google?

**Respuesta modelo:**

“`GoogleLoginController.php` construye la URL OAuth con los alcances de correo y perfil. Google devuelve un código a `google-callback.php`, que carga `GoogleAuthController.php`. Este intercambia el código por un access token, consulta el perfil y primero busca `google_id`; si no existe, busca el mismo correo y vincula el identificador. Si la cuenta todavía no existe, guarda datos de prellenado en sesión y redirige al registro.”

**Concepto — OAuth 2.0:** protocolo para delegar autenticación. La aplicación no recibe la contraseña de Google; recibe un código temporal y luego un token limitado.

## 19. ¿Qué hace cerrar sesión?

**Archivo:** `LogoutController.php`.

**Respuesta modelo:**

“Inicia la sesión existente, llama a `session_destroy()` y redirige al inicio. La autoridad real es la sesión PHP. Hay un `session.js` antiguo que usa `localStorage`, pero no debe confundirse con la autenticación real y convendría retirarlo. Como endurecimiento adicional, también se puede expirar explícitamente la cookie de sesión.”

## 20. ¿Cómo crea un docente un espacio?

**Archivo:** `views/espacios.php`, bloque `crear_espacio`.

**Respuesta modelo:**

“La página primero exige una sesión de docente. Al recibir el formulario valida nombre y portada y usa una consulta preparada para insertar `nombre`, `id_docente` y `portada`. El `id_docente` sale de la sesión, no del formulario, para que un usuario no pueda crear el espacio a nombre de otro.”

## 21. ¿Cómo se invita a estudiantes?

**Respuesta modelo:**

“Para cada estudiante seleccionado se hace un `INSERT` en `espacio_estudiantes` con estado `pendiente`. La clave primaria compuesta evita dos membresías idénticas; `ON DUPLICATE KEY UPDATE` permite volver a invitar a alguien que rechazó. Además se inserta una notificación de tipo `invitacion` asociada al espacio.”

## 22. ¿Cómo evitan superar el cupo si dos estudiantes aceptan al mismo tiempo?

**Archivo/función:** `app/support/SpaceCapacity.php`, `acceptStudentIntoSpace()`.

**Respuesta modelo:**

“Se abre una transacción y se bloquea la fila del espacio con `SELECT ... FOR UPDATE`. Mientras esa transacción decide, otra aceptación del mismo espacio debe esperar. Después se bloquea la membresía, se obtiene el límite configurado, se cuentan aceptados y solo se actualiza o inserta si hay cupo. Finalmente se hace `commit`; ante error, `rollback`. Esto evita una condición de carrera.”

**Conceptos:** una transacción agrupa operaciones para que se confirmen juntas. Una condición de carrera ocurre cuando solicitudes simultáneas leen el mismo estado y toman decisiones incompatibles.

## 23. ¿Cómo funciona el código de seis caracteres para unirse a un espacio?

**Archivo:** `views/asignaciones.php`, bloque `unirse_codigo`.

**Respuesta modelo:**

“Actualmente el código se calcula como los primeros seis caracteres del MD5 del id del espacio. La página recorre los espacios y compara el código; si coincide llama a `acceptStudentIntoSpace()`. Funciona como identificador corto, pero no es un token secreto robusto. En una versión de producción guardaría un código aleatorio único en la tabla e indexaría esa columna para buscarlo directamente.”

## 24. ¿Cómo asigna un docente una simulación?

**Respuesta modelo:**

“El docente elige una simulación y todos los estudiantes o una selección. El servidor cruza los ids recibidos con los miembros aceptados del espacio, por lo que no confía solo en el formulario. Luego, dentro de una transacción, inserta una fila de `asignaciones` para cada estudiante y una notificación. La asignación conserva docente, estudiante, simulación, espacio, fecha y estado.”

## 25. ¿Qué pasa cuando el estudiante abre una tarea?

**Archivos:** `views/asignaciones.php` y `views/simulador.php`.

**Respuesta modelo:**

“La URL incorpora el id de la asignación y `start=1`. `simulador.php` comprueba con una consulta preparada que esa asignación pertenece al id de estudiante de la sesión. Solo entonces expone `ASSIGNMENT_ID` al JavaScript y carga sus observaciones anteriores. El parámetro `start=1` hace que el temporizador y el registro de actividad comiencen automáticamente.”

## 26. ¿Cómo se guardan las observaciones?

**Archivo:** `views/guardar_observacion.php` y función `setupObservations()` en `simulador.js`.

**Respuesta modelo:**

“JavaScript envía `id_asignacion` y el texto con `fetch` y `FormData`. El servidor exige sesión y POST, limita el texto a 1000 caracteres y verifica que la asignación pertenezca al estudiante autenticado. Luego inserta con una consulta preparada y devuelve JSON. En el navegador el comentario se agrega al hilo sin recargar.”

## 27. ¿Cómo se marca una actividad como completada?

**Respuesta modelo:**

“El flujo principal del simulador usa `api_achievements.php`: al finalizar, `AchievementManager::completeSimulation()` exige al menos 60 segundos acreditados y, si hay una asignación válida, cambia su estado a `completada` dentro de la misma transacción. También existe un flujo anterior en `asignaciones.php?completar=...` que exige una observación. Tener dos caminos con reglas distintas es deuda técnica; convendría unificarlos en un único servicio.”

## 28. ¿Cómo funcionan los filtros del catálogo y cómo se conserva la categoría?

**Archivo:** `public/js/especies.js`, `getPersistedCategory()`, `persistCategory()` y `renderCards()`.

**Respuesta modelo:**

“La categoría actual está en un objeto `state`. Al pulsar un filtro se guarda en `localStorage` con la clave `blueEcoSpeciesCategory` y se llama a `renderCards()`. Esa función filtra el arreglo ya cargado por categoría y además compara la búsqueda con nombre común, nombre científico y hábitat. Al recargar, solo se acepta una categoría de una lista blanca; cualquier valor extraño vuelve a `todos`.”

## 29. ¿Cómo funcionan favoritos y notas?

**Respuesta modelo:**

“Los favoritos viven en un `Set` de JavaScript y solo duran mientras la página está abierta. Las notas sí se serializan como JSON en `localStorage` bajo `blueEcoNotes`; se pueden crear, editar, contraer y eliminar. No se guardan en MySQL ni se sincronizan entre dispositivos. Esa diferencia debe explicarse claramente.”

## 30. ¿Cómo restauran la posición al volver al catálogo?

**Respuesta modelo honesta:**

“El detalle no navega a otra URL: `showView()` oculta una sección y muestra otra dentro de la misma página, así que se conserva el DOM del catálogo. Sin embargo, el código actual no guarda explícitamente `window.scrollY` ni ejecuta `scrollTo` al regresar. No afirmaría que existe restauración persistente. La mejora sería guardar la posición antes de `openDetail()` y restaurarla al volver, o manejar el detalle con History API y estado.”

## 31. ¿Cómo se asocia automáticamente un modelo 3D a una especie?

**Archivo/clase:** `SpeciesModelResolver`.

**Respuesta modelo:**

“La API pasa nombre común, nombre científico, categoría y la ruta antigua al resolvedor. Este escanea una sola vez la carpeta de modelos, normaliza los nombres y crea un índice. Normalizar significa quitar acentos, pasar a minúsculas y convertir separadores en guiones. Si encuentra coincidencia devuelve una URL codificada; si no, usa `model_path` de la base como respaldo, y si tampoco existe informa `missing`.”

## 32. ¿Cómo deciden si el modelo se ve de frente o de lado?

**Respuesta modelo:**

“`detectView()` identifica palabras completas como cangrejo, jaiba o centollo y devuelve `front`; el resto usa `side`. En el navegador, `init3DModel()` conserva rotación cero para frente y aplica 90 grados para lateral. Algunas especies cuyo archivo tiene otra orientación usan un mapa de excepciones por nombre científico, `INITIAL_ROTATION_Y_BY_SPECIES`.”

## 33. ¿Cómo funciona el visor Three.js?

**Respuesta modelo:**

“`init3DModel()` importa Three.js, `OrbitControls`, `GLTFLoader` y `RoomEnvironment`. Crea escena, cámara de perspectiva y renderer WebGL. Carga el GLB, calcula su caja envolvente, lo centra y normaliza su escala. Con el tamaño resultante calcula la distancia necesaria de cámara para que el modelo completo quepa. Configura controles, entorno PBR, reproduce clips de animación si existen y usa `requestAnimationFrame` para renderizar y dar un movimiento flotante.”

**Conceptos:** GLTF describe escenas 3D; GLB es su versión binaria en un solo archivo. PBR es un modelo de materiales basado en cómo se comporta físicamente la luz.

## 34. ¿Cómo funciona el simulador desde que se abre la página?

**Respuesta modelo:**

“`getInitialSimulation()` lee `id=1`, `2` o `3`. `applySimulation()` carga valores iniciales, especies permitidas, tema, controles y poblaciones; después `startGodot()` inicia el motor. Los sliders llaman a `setGlobal()`, que actualiza una variable global y notifica al puente. Godot devuelve datos por `onGodotStats()`, y la web actualiza panel biológico, límites de población, alertas y balance trófico.”

## 35. ¿Cómo se registra el tiempo activo y los logros?

**Respuesta modelo:**

“Al iniciar se crea una sesión de actividad con un token aleatorio. Cada 60 segundos el navegador manda un heartbeat. El servidor acredita como máximo 90 segundos desde la última actividad, guarda duración y evalúa reglas de logros. Pausar marca la sesión inactiva; reanudar cambia la marca de tiempo; completar es idempotente y requiere 60 segundos. Si se cierra la página, `pagehide` intenta pausar usando `keepalive`.”

## 36. ¿Cómo funciona el chatbot Akira?

**Respuesta modelo:**

“`chatbot.js` envía el mensaje al endpoint `chatbot_groq.php`. `ChatbotGroqController` clasifica si es conversación, plataforma, tema marino, ambiguo o fuera de alcance. Las respuestas verificadas de la plataforma salen de `ChatbotKnowledge`, sin depender del modelo. Para preguntas marinas permitidas construye un prompt y llama a Groq; conserva hasta 20 entradas de historial en la sesión y solo reutiliza historial del mismo ámbito en seguimientos cortos. Si la API falla, responde con reglas de respaldo.”

## 37. ¿Cómo funciona el cambio de idioma?

**Archivo:** `public/js/translator.js`.

**Respuesta modelo:**

“Recorre nodos de texto y ciertos atributos del DOM, excluyendo scripts, código, inputs y nombres científicos. Primero usa traducciones manuales para textos críticos; luego intenta el endpoint público de Google Translate y usa MyMemory como respaldo. Guarda idioma y caché en `localStorage`. Un `MutationObserver` detecta contenido añadido dinámicamente y programa su traducción.”

## 38. ¿Cómo generan el CSV de usuarios?

**Archivo:** `views/admin.php`, bloque `exportar_csv`.

**Respuesta modelo:**

“Solo un administrador llega a esa rama. PHP establece `Content-Type: text/csv` y `Content-Disposition: attachment`, abre `php://output`, escribe encabezados y cada fila con `fputcsv`, y termina la ejecución. No crea un archivo permanente en el servidor: transmite el contenido directamente al navegador.”

---

# Nivel 3 — Archivos, funciones y consultas

## 39. Explique esta consulta: `SELECT * FROM usuarios WHERE email = ?`.

**Archivo:** `AuthController.php`.

**Respuesta modelo:**

“El signo `?` es un parámetro. `bind_param('s', $email)` indica que es texto y el driver envía valor y estructura SQL por separado. Eso evita que el correo se interprete como código SQL. Después `execute()` ejecuta y `get_result()` permite leer la fila.”

**Concepto — prepared statement:** consulta preparada que separa instrucciones y datos; es una defensa principal contra inyección SQL.

## 40. ¿Qué hace `ON DUPLICATE KEY UPDATE` al invitar?

**Archivo:** `views/espacios.php`, consulta sobre `espacio_estudiantes`.

**Respuesta modelo:**

“La tabla tiene clave primaria compuesta por espacio y estudiante. Si la combinación no existe se inserta como pendiente; si ya existe, la misma sentencia actualiza el estado a pendiente. Así se puede reenviar una invitación rechazada sin crear filas duplicadas.”

## 41. ¿Por qué `FOR UPDATE` es importante en el cupo?

**Archivo:** `SpaceCapacity.php`.

**Respuesta modelo:**

“Bloquea la fila seleccionada hasta terminar la transacción. Todos los intentos para el mismo espacio se serializan alrededor de esa fila: uno cuenta y acepta, confirma, y luego el siguiente vuelve a contar el estado actualizado. Sin el bloqueo, dos peticiones podrían ver 29 de 30 y ambas aceptar.”

## 42. ¿Qué hace `SpeciesModelResolver::normalizeName()`?

**Respuesta modelo:**

“Quita espacios extremos, translitera acentos a ASCII, pasa a minúsculas, reemplaza cualquier grupo que no sea letra o número por un guion y elimina guiones de los extremos. De esa manera `Pez Ángel Real.glb`, `pez_angel_real.glb` y `pez-angel-real` generan una clave comparable.”

## 43. ¿Por qué se usa `rawurlencode($filename)` en la ruta del GLB?

**Respuesta modelo:**

“Porque algunos nombres contienen espacios, tildes u otros caracteres que no deben colocarse literalmente en una URL. `rawurlencode` codifica el nombre como un segmento seguro sin cambiar la ruta base.”

## 44. ¿Qué hace `formatSpeciesData()`?

**Archivo:** `views/api_especies.php`.

**Respuesta modelo:**

“Es una capa de adaptación entre las columnas MySQL y el objeto que necesita JavaScript. Cambia nombres como `nombre_cientifico` a `scientificName`, convierte ids y medidas numéricas a `int` o `float`, resuelve el modelo y agrega arreglos de curiosidades y amenazas. Así el frontend recibe un contrato uniforme.”

## 45. ¿Por qué usan `escapeHtml()` antes de construir tarjetas con `innerHTML`?

**Respuesta modelo:**

“Porque los datos de la base se insertan dentro de plantillas HTML. `escapeHtml` crea un elemento, asigna el dato a `textContent` y obtiene el HTML escapado, por lo que `<script>` se muestra como texto y no se ejecuta. Es una defensa contra XSS. También se usa `htmlspecialchars` al renderizar datos desde PHP.”

**Concepto — XSS:** vulnerabilidad donde datos controlables se interpretan como HTML o JavaScript y se ejecutan en el navegador de otra persona.

## 46. ¿Cómo calcula la cámara el encuadre del modelo?

**Función:** `fitCameraToModel()` en `especies.js`.

**Respuesta modelo:**

“Después de escalar y centrar el modelo se calcula `Box3` y su tamaño. Con el campo de visión vertical y la relación de aspecto se deriva también el campo horizontal. Se calcula la distancia necesaria para cubrir ancho y alto, se toma la mayor, se agrega profundidad y un margen de 8 %, y se actualizan posición, planos `near/far` y límites de zoom.”

## 47. ¿Qué hace `AnimationMixer`?

**Respuesta modelo:**

“Si el GLB trae clips de animación, se crea un `AnimationMixer` asociado al modelo. Cada clip se convierte en una acción y se reproduce. En cada frame `mixer.update(delta)` avanza las animaciones según el tiempo real transcurrido, independientemente de la velocidad del equipo.”

## 48. ¿Cómo evitan fugas al reemplazar un visor 3D?

**Respuesta modelo:**

“El contenedor guarda `_cleanup3d`. Antes de reutilizarlo se desconecta `ResizeObserver`, se cancela el frame, se liberan controles, renderer, textura de fondo y mapa de entorno. Es una limpieza parcial correcta. Como mejora, también recorrería el modelo para liberar explícitamente geometrías, materiales y texturas del GLB.”

## 49. ¿Qué hace `setGlobal(key, value)` en el simulador?

**Respuesta modelo:**

“Actualiza `window[key]` para que el dato esté disponible globalmente. Si Godot instaló `window.godotBridge.notify`, también envía el cambio inmediatamente. Eso permite funcionar tanto con lectura periódica de variables globales como con notificación por puente.”

## 50. ¿Qué hace `onGodotStats(stats)`?

**Respuesta modelo:**

“Es un callback público para recibir el estado calculado por Godot. Guarda la última respuesta, sincroniza poblaciones y límites, actualiza contadores, panel biológico, alertas y diagnóstico de la cadena alimenticia. En ese flujo Godot es la fuente de verdad; el cálculo local del balance se usa como respaldo si no viene el bloque `ecology`.”

## 51. ¿Cómo evita el sistema acreditar tiempo ilimitado con un solo heartbeat tardío?

**Método:** `AchievementManager::creditActiveTime()`.

**Respuesta modelo:**

“La consulta calcula la diferencia entre última actividad y ahora, pero la limita con `LEAST(90, ...)`. Como el heartbeat esperado es cada 60 segundos, tolera retrasos breves, pero no acredita horas si el navegador quedó suspendido. La fila se bloquea con `FOR UPDATE` y la duración se actualiza dentro de una transacción.”

## 52. ¿Cómo evita completar dos veces la misma sesión?

**Respuesta modelo:**

“La fila tiene `completed_at`. El método la bloquea, devuelve sin cambio si ya está completada y el `UPDATE` incluye `WHERE completed_at IS NULL`. Solo si `affected_rows` es uno considera que se completó en esa llamada. Eso hace la operación idempotente.”

**Concepto — idempotencia:** repetir una operación no produce efectos adicionales después de la primera aplicación válida.

## 53. ¿Cómo funciona el token CSRF de logros?

**Respuesta modelo:**

“`AchievementManager::csrfToken()` genera 32 bytes aleatorios y los guarda en sesión. El fragmento de notificaciones lo expone a la página y cada petición JSON lo envía. `api_achievements.php` usa `hash_equals` para compararlo antes de procesar. Así otro sitio no puede forzar acciones usando solo la cookie de sesión.”

## 54. ¿Cómo están definidas las reglas de logros?

**Archivos:** `AchievementSchema.php` y `AchievementManager.php`.

**Respuesta modelo:**

“Los logros y sus reglas son datos en tablas, no una cadena de `if` por insignia. Cada regla tiene `metric_key`, operador, objetivo y opciones JSON. `evaluate()` carga definiciones, calcula métricas como días de login, segundos, simulaciones completadas o secciones visitadas, actualiza progreso con un upsert y desbloquea solo cuando se cumplen todas las reglas.”

## 55. ¿Qué hacen las claves foráneas y `ON DELETE CASCADE`?

**Respuesta modelo:**

“Una clave foránea impide referencias a filas inexistentes. `ON DELETE CASCADE` hace que al eliminar el padre se borren relaciones dependientes; por ejemplo, al eliminar un usuario se eliminan varias membresías y registros asociados. Reduce datos huérfanos, aunque antes de borrar debe confirmarse que ese comportamiento sea el deseado.”

## 56. ¿Cómo se montan componentes React dentro de PHP?

**Respuesta modelo:**

“Cada entrada TypeScript busca un elemento por id y, si existe, llama a `createRoot(...).render(...)`. Vite compila entradas distintas a carpetas de `public/build`: línea de tiempo, selector de simulaciones, pantalla de carga y loaders de autenticación. PHP imprime el contenedor y carga el módulo compilado. Es el patrón de islas: React controla solo ese subárbol del DOM.”

---

# Nivel 4 — Preguntas difíciles y repreguntas de ingeniería

## 57. ¿Las credenciales están gestionadas de forma segura?

**Respuesta modelo:**

“No completamente. En la versión actual hay credenciales MySQL, SMTP y OAuth escritas en archivos PHP y en el SQL de instalación. Eso sirve para un entorno local controlado, pero no es aceptable para producción ni para un repositorio compartido. Las movería a variables de entorno o un gestor de secretos, rotaría las credenciales ya expuestas y dejaría un `.env.example` sin valores reales.”

**Repregunta:** ¿Por qué no basta con poner el archivo en `.gitignore`?

**Respuesta corta:** “Porque si el secreto ya estuvo en el historial debe considerarse comprometido. Hay que rotarlo; ignorar el archivo solo evita futuras inclusiones.”

## 58. ¿Qué problema tiene desactivar `CURLOPT_SSL_VERIFYPEER`?

**Respuesta modelo:**

“En `GoogleAuthController.php` y en el cliente de Groq se desactiva la validación del certificado TLS. Eso permite que un intermediario suplante el servicio y robe códigos o tokens. La corrección es activar verificación de host y peer e instalar correctamente el paquete de autoridades certificadoras de PHP.”

## 59. ¿El OAuth de Google está protegido contra CSRF?

**Respuesta modelo:**

“Actualmente no se envía ni valida el parámetro OAuth `state`. Esa es una carencia. Generaría un valor aleatorio, lo guardaría en sesión, lo enviaría a Google y exigiría coincidencia al recibir el callback. También usaría PKCE si el flujo y la biblioteca elegida lo admiten.”

**Repregunta:** ¿Qué protege `state`?

**Respuesta corta:** “Vincula el callback con el intento de login iniciado por ese navegador y evita que se inyecte una respuesta OAuth iniciada por otra persona.”

## 60. ¿Regeneran el id de sesión después de autenticar?

**Respuesta modelo:**

“No encontré `session_regenerate_id(true)` después del login local, Google o verificación. Por eso no defendería protección completa contra fijación de sesión. La mejora es regenerarlo inmediatamente después de autenticar y configurar cookies `HttpOnly`, `Secure` bajo HTTPS y `SameSite` antes de iniciar la sesión.”

## 61. ¿La validación del registro es suficiente?

**Respuesta modelo:**

“La interfaz valida formato de correo, tres caracteres de usuario, seis de contraseña y confirmación. Pero el servidor solo valida el rol, normaliza campos y revisa correo duplicado. Como JavaScript puede omitirse, faltan `filter_var` para el correo, límites de longitud, política de contraseña y comprobación de confirmación en PHP. La regla crítica siempre debe repetirse en servidor.”

## 62. ¿La opción administrativa “registro abierto” realmente bloquea registros?

**Respuesta modelo:**

“No. `admin.php` guarda la clave `registro_abierto`, pero `registro.php` y `RegisterController.php` no la consultan. En este momento es configuración sin efecto. Para completarla, tanto la vista como —sobre todo— el controlador deben rechazar el POST cuando el valor sea cero.”

## 63. ¿Todas las operaciones que modifican datos tienen protección CSRF?

**Respuesta modelo:**

“No. La API de logros sí valida token CSRF, pero login, registro, administración, espacios, invitaciones, asignaciones, notificaciones y observaciones no tienen un token equivalente. `SameSite` puede reducir riesgo, pero no reemplaza el control explícito. Implementaría un helper único de generación y validación y lo usaría en todos los formularios y endpoints mutables.”

## 64. ¿Hay limitación de intentos de login o del chatbot?

**Respuesta modelo:**

“No encontré rate limiting. Un atacante podría automatizar intentos de contraseña o consumir el servicio de IA. Añadiría límites por cuenta e IP, retraso progresivo, registro de intentos y, para el chatbot, cuota por sesión o usuario y límites de tamaño del mensaje.”

## 65. ¿Por qué la tabla `sesiones_activas` no protege las sesiones?

**Respuesta modelo:**

“El esquema crea `sesiones_activas`, pero el código de autenticación no inserta, consulta ni elimina filas allí. También `ultima_actividad` aparece en reportes, pero no se actualiza. Por ahora la sesión depende del mecanismo nativo de PHP. La tabla parece una base para una función futura, no una medida activa.”

## 66. ¿La API de especies es realmente REST y está bien cerrado su CORS?

**Respuesta modelo:**

“Es un endpoint JSON de lectura, pero no una API REST completa: solo implementa GET aunque el encabezado anuncia POST. Además usa `Access-Control-Allow-Origin: *`, innecesario si solo la consume la misma aplicación. Lo ajustaría a GET y OPTIONS, limitaría el origen si se necesita acceso externo y no devolvería detalles internos del error de MySQL.”

## 67. ¿La carga de todas las especies escala bien?

**Respuesta modelo:**

“Con unas 94 especies es razonable, pero `getAllSpecies()` hace una consulta principal y después dos consultas por especie para curiosidades y amenazas: es un patrón N+1. Para más datos usaría tres consultas totales y agruparía por `especie_id`, o un resultado agregado JSON. También añadiría paginación o filtros en servidor si el catálogo creciera.”

## 68. ¿Qué pasa si dos docentes asignan la misma simulación al mismo alumno?

**Respuesta modelo:**

“La tabla no tiene una restricción única para estudiante, simulación y espacio, y `espacios.php` contiene dos bloques distintos de asignación. Por tanto se pueden crear duplicados. Primero definiría la regla de negocio; si solo debe existir una tarea activa por combinación, agregaría una clave única y un `INSERT ... ON DUPLICATE KEY UPDATE`, y unificaría ambos bloques en un servicio.”

## 69. ¿Es seguro el código de aula basado en MD5?

**Respuesta modelo:**

“No debe considerarse secreto. Se deriva de un id predecible, tiene solo seis caracteres y la búsqueda actual recorre todos los espacios. Cambiaría el esquema para guardar un código aleatorio generado con `random_bytes`, con índice único, posible expiración o regeneración, y haría `SELECT ... WHERE codigo = ?`.”

## 70. ¿El límite máximo de tiempo de simulación no se puede evadir desde el navegador?

**Respuesta modelo:**

“El bloqueo visual de `SIMULATION_TIME_LIMIT` se ejecuta en JavaScript, así que un usuario avanzado puede alterarlo. El servidor de logros evita acreditar intervalos grandes y exige tokens, pero no aplica ese límite administrativo acumulado. Si el límite es una regla de seguridad o evaluación, debe almacenarse y verificarse en `AchievementManager` antes de reanudar, acreditar o completar.”

## 71. ¿La simulación puede auditarse completamente desde este repositorio?

**Respuesta modelo:**

“La integración web sí puede auditarse, pero en `public/godot` solo está la exportación compilada: `.wasm` y `.pck`. No están los archivos fuente de Godot, escenas ni scripts GDScript en este repositorio. Por eso no puedo demostrar desde aquí todas las ecuaciones internas. Para reproducibilidad incluiría el proyecto fuente de Godot o lo versionaría en un repositorio relacionado con etiqueta de la exportación.”

## 72. ¿Cuál es la fuente de verdad del balance trófico?

**Respuesta modelo:**

“Cuando Godot envía `stats.ecology`, la interfaz usa esos datos como fuente de verdad. Si no llegan, `updateFoodChainInsight()` calcula una aproximación local basada en poblaciones. Ese respaldo mejora la interfaz, pero puede producir resultados diferentes. Documentaría la fórmula oficial y evitaría mantener dos implementaciones distintas, o marcaría claramente el resultado local como estimación.”

## 73. ¿Hay un problema en el flujo de registro nuevo con Google?

**Respuesta modelo:**

“Sí. `GoogleAuthController` guarda `google_prefill`, pero la vista y el controlador de registro actuales no consumen esos datos ni insertan `google_id`. Un usuario puede completar el registro normal y vincularse en un intento posterior por coincidencia de correo, pero el prellenado prometido no está terminado. Corregiría el flujo con un token de alta temporal en sesión, campos bloqueados y vinculación en la misma transacción.”

## 74. ¿Las notificaciones están completamente integradas?

**Respuesta modelo:**

“La lógica del fragmento `notificaciones_lista.php` y el JavaScript existe, pero no hay una página `views/notificaciones.php` en el árbol actual ni un enlace en la barra. Además `attachActionEvents()` llama `form.submit()`, lo que omite el listener de `submit` que debía hacer el `fetch`; las acciones masivas pueden navegar o no llegar al endpoint correcto. Invitaciones sí se muestran y responden también desde `asignaciones.php`. Yo lo presentaría como módulo parcial que necesita completar su página anfitriona y usar `requestSubmit()` o llamar directamente al `fetch`.”

## 75. ¿Los favoritos sobreviven una recarga?

**Respuesta modelo:**

“No. `favorites` empieza como un `Set` vacío y no se serializa. Las notas y la categoría sí usan `localStorage`. Si la persistencia de favoritos es requisito, los guardaría localmente o, mejor, en una tabla por usuario para sincronizarlos entre dispositivos.”

## 76. ¿Qué riesgos tiene la exportación CSV?

**Respuesta modelo:**

“La autorización de administrador es correcta y `fputcsv` escapa el formato CSV, pero no neutraliza fórmulas. Si un nombre o correo comienza con `=`, `+`, `-` o `@`, algunas hojas de cálculo pueden interpretarlo como fórmula. Antes de exportar prefijaría esos valores con apóstrofo o usaría una política de neutralización de CSV.”

## 77. ¿Es buena práctica ejecutar `CREATE TABLE IF NOT EXISTS` durante solicitudes normales?

**Respuesta modelo:**

“`ensureObservacionesSimulacionTable()` y `AchievementSchema::ensure()` facilitan una instalación local e idempotente. Sin embargo, ejecutar DDL en una solicitud puede requerir permisos altos, introducir latencia o bloquear. En producción usaría migraciones versionadas durante despliegue y daría a la cuenta web solo permisos necesarios de lectura y escritura de datos.”

## 78. ¿La cuenta MySQL respeta mínimo privilegio?

**Respuesta modelo:**

“Parcialmente: sobre `simulador_especies` solo recibe SELECT, lo cual es positivo. Pero sobre `simulador` recibe `ALL PRIVILEGES` y el código crea tablas en tiempo de ejecución. En producción separaría migraciones de ejecución y concedería solo SELECT, INSERT, UPDATE y DELETE sobre las tablas necesarias.”

## 79. ¿Hay código legado o inconsistente?

**Respuesta modelo:**

“Sí. `public/js/login.js` y parte de `session.js` usan una autenticación simulada con `localStorage` y rutas `.html`, pero el login real es PHP y `login.js` ni se carga en `login.php`. `views/fragments/chatbot.php` apunta a un controlador Gemini inexistente y parece obsoleto; el footer usa `views/chatbot.php` con Groq. Eliminar o archivar ese código reduce confusión y superficie de errores.”

## 80. ¿Qué pruebas automatizadas existen y qué no cubren?

**Respuesta modelo:**

“Hay pruebas para `AuthRedirect`, clasificación y respuestas del chatbot, resolución automática de modelos, concurrencia de cupo, límite de tiempo del simulador y el servicio de logros. En la revisión pasaron las cinco pruebas ejecutadas; la del chatbot mostró advertencias porque el entorno aislado no podía escribir la sesión de XAMPP, pero sus aserciones pasaron. Faltan pruebas end-to-end del navegador, autenticación real, OAuth, formularios CSRF, CRUD de espacios, notificaciones y contrato web-Godot.”

---

# Glosario para responder repreguntas

- **API:** contrato para que dos componentes intercambien solicitudes y respuestas. En el proyecto suelen ser endpoints PHP que devuelven JSON.
- **AJAX / `fetch`:** solicitud HTTP desde JavaScript sin recargar toda la página.
- **CRUD:** crear, leer, actualizar y eliminar registros.
- **MVC:** separación entre datos, presentación y coordinación de solicitudes.
- **Sesión:** estado que el servidor asocia a un navegador mediante una cookie de identificador.
- **Cookie:** pequeño dato que el navegador envía al servidor; PHP la usa para identificar la sesión.
- **Hash:** transformación de una sola dirección. Se verifica una contraseña, no se descifra.
- **Bcrypt:** algoritmo de hash de contraseñas con sal y costo configurable.
- **Prepared statement:** consulta SQL parametrizada que separa código y datos.
- **Inyección SQL:** lograr que un valor de entrada altere una consulta.
- **XSS:** lograr que un dato se ejecute como código en el navegador.
- **CSRF:** forzar desde otro sitio una acción aprovechando la sesión abierta de la víctima.
- **CORS:** regla del navegador que controla qué orígenes pueden leer una respuesta web.
- **OAuth 2.0:** delegación de autenticación sin entregar a la aplicación la contraseña del proveedor.
- **Transacción:** grupo de operaciones que se confirma con `commit` o se deshace con `rollback`.
- **Condición de carrera:** fallo producido por operaciones concurrentes que toman decisiones sobre un estado desactualizado.
- **Clave foránea:** restricción que mantiene relaciones válidas entre tablas.
- **Índice:** estructura que acelera búsquedas a cambio de espacio y costo al escribir.
- **JSON:** formato textual de objetos y arreglos usado entre PHP y JavaScript.
- **Three.js:** biblioteca JavaScript que simplifica escenas WebGL, cámaras, luces, materiales y modelos.
- **GLTF/GLB:** formato para escenas 3D; GLB agrupa datos y recursos en un binario.
- **PBR:** materiales que aproximan el comportamiento físico de la luz.
- **WebGL:** API gráfica del navegador usada para renderizado acelerado por GPU.
- **WebAssembly:** binario compilado que se ejecuta en el navegador; Godot exporta su motor a este formato.
- **Godot PCK:** paquete con escenas y recursos del juego o simulación exportada.
- **Heartbeat:** mensaje periódico que confirma actividad y permite acreditar intervalos controlados.
- **Idempotencia:** una repetición no vuelve a causar el mismo efecto.
- **Debounce:** esperar un intervalo corto antes de ejecutar, evitando una búsqueda por cada tecla inmediata.
- **`localStorage`:** almacenamiento persistente de ese navegador y origen; no equivale a la base de datos ni es confiable para autorización.
- **React island:** componente React montado dentro de una página que sigue siendo generada por otra tecnología.
- **Vite:** herramienta que compila y empaqueta los módulos TypeScript/React para el navegador.

---

# Recomendación para responder ante el jurado

Usa esta estructura en casi cualquier respuesta:

1. **Ubica la responsabilidad:** “Esto se maneja en el archivo X, función Y”.
2. **Explica el recorrido:** entrada del usuario → validación → consulta o motor → respuesta visible.
3. **Menciona una protección real:** sesión, rol, consulta preparada, escape, transacción o token, si existe.
4. **Reconoce el límite exacto:** no llames “seguro” o “persistente” a algo que solo funciona en interfaz.
5. **Propón una mejora concreta:** archivo, control y resultado esperado.

Ejemplo breve:

> “La aceptación de estudiantes se maneja en `acceptStudentIntoSpace()`. El id del alumno sale de la sesión, se bloquea el espacio dentro de una transacción, se cuenta el cupo y solo entonces se actualiza la membresía. Eso evita que dos solicitudes simultáneas superen el límite. Como mejora general, agregaría token CSRF al formulario que dispara la acción.”
