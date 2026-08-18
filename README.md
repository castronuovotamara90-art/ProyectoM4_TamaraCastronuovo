# ProyectoM4_TamaraCastronuovo

Aplicacion SPA para gestion de tareas por usuario autenticado, con persistencia en tiempo real en Cloud Firestore y envio de resumenes por email via AWS SES. Construida por etapas con deploy incremental en Vercel.

## Estado actual

Etapas cerradas: **Autenticacion, Gestion de tareas, Persistencia y sincronizacion, Email, Testing**.

### Autenticacion (Firebase Auth)

- Registro y login con email/password.
- Login con Google (popup).
- Logout.
- Rutas protegidas: el dashboard y las tareas no son accesibles sin sesion activa.
- Manejo claro de errores de autenticacion (credenciales invalidas, email ya registrado, password debil, etc.).

### Gestion de tareas (Cloud Firestore)

- Crear, listar, editar, marcar como completada y eliminar tareas.
- Persistencia real en Cloud Firestore, coleccion `tasks` filtrada por `userId`: cada usuario ve y modifica solo sus propias tareas.
- Sincronizacion en tiempo real con `onSnapshot`: la UI se actualiza sola despues de cada operacion, sin refetch manual.
- Estados de carga (`loading`) y de error visibles en el dashboard.
- Seguridad reforzada con **Firestore Security Rules** (`firestore.rules`): el aislamiento por usuario no depende solo del filtro del cliente, esta garantizado por reglas server-side.
- Indice compuesto (`userId` + `createdAt`) desplegado para soportar la query ordenada (`firestore.indexes.json`).

### Resumen por email (AWS SES)

- Boton "Enviar resumen por email" en el dashboard.
- Function serverless (`functions/send-summary.ts`, expuesta como Vercel Function en `api/send-summary.ts`) que arma el resumen de tareas y lo envia via AWS SES.
- El email se envia a la direccion del **usuario autenticado** (no a una direccion fija hardcodeada).
- Confirmacion de envio: la respuesta incluye el `messageId` que devuelve SES, y el dashboard lo muestra como prueba de que el correo salio.

> **Importante — la cuenta de AWS SES esta en modo sandbox.** En este modo, SES solo entrega emails a direcciones verificadas manualmente en la consola de AWS (ademas del remitente, que ya esta verificado). Esto quiere decir que, para probar el envio con tu propio email, **primero tenes que pedirle a Tamara (castronuovotamara90@gmail.com) que registre y verifique esa direccion como identidad de prueba en SES**. Sin ese paso previo, el envio va a fallar con un error de "email no verificado" aunque el resto de la app funcione normalmente. Salir del sandbox (para poder enviarle a cualquier usuario real sin verificacion previa) requiere solicitar "production access" a AWS, un tramite de revision aparte.

### Testing

- Vitest + React Testing Library.
- Tests unitarios de funciones clave (`taskService`, `toSession`, `buildSummaryEmail`).
- Tests de componentes aislados: formulario de creacion de tareas y listado de tareas agrupado por estado.
- Tests de flujo end-to-end: login, CRUD de tareas, aislamiento de tareas por usuario, envio de resumen por email.
- Mocks de los servicios externos (Firebase Auth, Firestore y AWS SES) para que la suite no dependa de red ni credenciales reales.

## Estructura del repositorio

- `src/`: codigo del frontend (componentes, `hooks/` para auth y tareas, `services/` para Firebase y Firestore).
- `functions/`: logica del backend serverless (resumen por email con AWS SES).
- `api/`: entrypoint de Vercel Functions que expone `functions/` como endpoint HTTP.
- `tests/`: pruebas unitarias y de componentes, con mocks de Firebase/AWS.
- `firestore.rules`, `firestore.indexes.json`, `firebase.json`: configuracion de seguridad e indices de Cloud Firestore.
- `plan/`: roadmap por etapas y checklist de seguimiento.

## Scripts

- `npm run dev`: levanta el entorno de desarrollo.
- `npm run build`: compila TypeScript y genera build de produccion.
- `npm run preview`: sirve localmente el build generado.
- `npm run test`: ejecuta la suite de tests una vez.
- `npm run test:watch`: ejecuta tests en modo watch.
- `npm run test:coverage`: ejecuta tests con cobertura.

## Instalacion y ejecucion

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar variables de entorno desde `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. Iniciar la app:

   ```bash
   npm run dev
   ```

4. Ejecutar tests:

   ```bash
   npm run test
   ```

## Variables de entorno

Las variables esperadas estan definidas en `.env.example`:

- Firebase (cliente, tambien usado para Firestore):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- AWS SES (serverless, solo se usan en `functions/` y `api/`, nunca en el frontend):
  - `AWS_REGION`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `SES_FROM_EMAIL`
- Frontend/API:
  - `VITE_APP_URL`
  - `VITE_API_BASE_URL`

## Seguridad

- `.env` esta ignorado por git y no debe versionarse.
- Credenciales AWS deben vivir solo en variables de entorno locales y de Vercel; se verifico que no aparecen en el bundle del frontend.
- Firestore protegido con Security Rules (`firestore.rules`): cada documento de `tasks` solo es legible/editable por el usuario dueno (`userId == request.auth.uid`).
- Nunca exponer secretos en frontend ni en logs.

## Deploy

El proyecto usa `vercel.json` con:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`

URL pública:

- https://proyecto-m4-tamara-castronuovo.vercel.app/login

Pendiente de verificar en esta etapa: confirmar que el deploy en Vercel este al dia con los ultimos cambios y que las variables de entorno (Firebase + AWS) esten cargadas ahi tambien, no solo en local.

## Plan por etapas

El roadmap y su seguimiento estan en:

- `plan/README.md`
- `plan/tracker.md`
- `plan/etapa-a.md`

Cada etapa solo se considera cerrada cuando cumple tres condiciones:

1. Alcance funcional implementado.
2. Tests automatizados en verde.
3. Documentacion actualizada en este README.
