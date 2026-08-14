# ProyectoM4_TamaraCastronuovo

Aplicacion SPA para gestion de tareas por usuario, construida por etapas con deploy incremental en Vercel.

## Estado actual

Etapa activa: **D (gestion completa de tareas)**.

Hoy el proyecto incluye:

- Bootstrap de frontend con React + TypeScript + Vite.
- Configuracion de testing con Vitest + React Testing Library.
- Login con email/password y Google demo.
- Rutas protegidas con dashboard.
- Crear, listar, editar, completar y eliminar tareas por usuario.
- Plan operativo y tracker en la carpeta `plan/`.

Todavia no esta implementado en esta etapa:

- Integracion real con Firebase Auth.
- Persistencia real en Firestore.
- Envio de emails con AWS SES.

## Estructura del repositorio

- `src/`: codigo del frontend.
- `functions/`: Vercel Functions (backend serverless).
- `tests/`: pruebas unitarias y de componentes.
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

- Firebase (cliente):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- AWS SES (serverless):
  - `AWS_REGION`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `SES_FROM_EMAIL`
  - `SES_TO_EMAIL`
- Frontend/API:
  - `VITE_APP_URL`
  - `VITE_API_BASE_URL`

## Seguridad

- `.env` esta ignorado por git y no debe versionarse.
- Credenciales AWS deben vivir solo en variables de entorno locales y de Vercel.
- Nunca exponer secretos en frontend ni en logs.

## Deploy

El proyecto usa `vercel.json` con:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`

La URL publica se agregara una vez realizado el primer deploy de la Etapa A.

## Plan por etapas

El roadmap y su seguimiento estan en:

- `plan/README.md`
- `plan/tracker.md`
- `plan/etapa-a.md`

Cada etapa solo se considera cerrada cuando cumple tres condiciones:

1. Alcance funcional implementado.
2. Tests automatizados en verde.
3. Documentacion actualizada en este README.
