# Bases de datos

El proyecto utiliza exactamente dos bases MySQL:

- `simulador`: usuarios, roles, verificaciones, logros, clases, asignaciones, simulaciones, actividad, notificaciones y configuracion general.
- `simulador_especies`: exclusivamente las tablas `especies`, `curiosidades` y `amenazas`.

Para instalar una copia nueva, importa como administrador primero `simulador_especiesDB.sql` y despues `simuladorDB.sql`. El segundo archivo crea la cuenta de la aplicacion y asigna permisos para ambas bases. La aplicacion mantiene `simulador` como su conexion original y utiliza la segunda conexion solo en la API del catalogo de especies.
