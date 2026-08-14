# ProyectoM4_TamaraCastronuovo

Aplicación web de gestión de tareas desplegada en Vercel, con autenticación, CRUD persistente en Firestore y envío de emails reales mediante AWS SES a través de Vercel Functions.

## Descripción del proyecto

Este proyecto implementa un gestor de tareas con foco en una arquitectura por capas para separar interfaz, lógica de negocio e integraciones externas. La aplicación contempla:

- Autenticación funcional.
- CRUD completo persistente en Firestore.
- Envío real de emails con AWS SES.
- Invocación de SES a través de Vercel Functions.

## Decisiones arquitectónicas

Se define una estructura por responsabilidades:

- `/src/pages`: vistas principales (login, registro, tareas).
- `/src/components`: componentes de UI reutilizables.
- `/src/features`: lógica por dominio (auth, tasks).
- `/src/services`: servicios e integraciones (Firebase/Auth/Firestore/API).
- `/src/routes`: enrutado y rutas protegidas.
- `/src/hooks`: hooks reutilizables.
- `/src/types`: tipos e interfaces compartidas.
- `/src/utils`: utilidades auxiliares.
- `/src/api`: capa dedicada a comunicación API.
- `/functions`: Vercel Functions para backend serverless (emails con SES).
- `/tests`: pruebas unitarias y de componentes con mocks.

## Instrucciones de instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar variables de entorno desde `.env.example` a `.env` y completar valores reales.
3. Ejecutar en desarrollo:
   ```bash
   npm run dev
   ```

## Variables de entorno necesarias

Definidas en `.env.example`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SES_FROM_EMAIL`
- `SES_TO_EMAIL`
- `VITE_APP_URL`
- `VITE_API_BASE_URL`

> ⚠️ `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` son credenciales sensibles: definirlas solo en variables de entorno seguras (local/Vercel), nunca versionarlas, exponerlas en cliente ni registrarlas en logs.

## URL de producción

- https://proyectom4-tamaracastronuovo.vercel.app

> Mantener esta URL actualizada cuando cambie el dominio de despliegue.

## Flujo de envío de emails

1. El usuario ejecuta una acción en la app que requiere notificación por email.
2. El frontend llama a una Vercel Function en `/functions`.
3. La función valida el payload y usa credenciales AWS desde variables de entorno.
4. La función invoca AWS SES para enviar el correo.
5. La función responde al frontend con éxito/error para feedback en UI.

## Integración de IA en el proceso

La IA se utilizó para:

- Acelerar organización inicial de arquitectura por capas.
- Revisar cobertura de requisitos del entregable antes de validar cambios.
- Refinar estructura de documentación para dejar claros setup, entorno y despliegue.

Situaciones donde fue más efectiva:

- Checklists de cumplimiento de entregables.
- Detección de omisiones en README y variables de entorno.

Patrones y buenas prácticas descubiertas:

- Validar requisitos con una lista explícita antes de codificar.
- Mantener cambios pequeños y verificables por cada requisito.
- Documentar el flujo extremo a extremo (UI → Function → SES) para facilitar soporte.

## Commits

Se recomienda mantener commits semánticos y descriptivos (por ejemplo: `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`).
