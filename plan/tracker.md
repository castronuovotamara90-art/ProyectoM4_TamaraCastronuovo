# Source Plan Tracker

Estado general del proyecto: En progreso
Etapa activa: A
Ultima actualizacion: 2026-08-14

## Tablero de etapas

| Etapa | Estado | Alcance resumido | Tests requeridos | Deploy | Docs |
|---|---|---|---|---|---|
| A | En progreso | Base React + TypeScript + Vite + Vitest + Vercel | Setup base, render inicial, utilidades de test | Primer deploy tecnico | README setup + scripts + env |
| B1 | Pendiente | Auth email/password + rutas privadas | Auth service + forms + guards | Deploy auth base | README auth base |
| B2 | Pendiente | Google Authentication | Auth social + CTA Google + errores | Deploy auth social | README auth Google |
| C | Pendiente | Crear y listar tareas por usuario | Firestore mocks + TaskForm + TaskList | Deploy CRUD parcial | README tareas v1 |
| D | Pendiente | Editar, eliminar, completar | Integracion CRUD completo | Deploy CRUD completo | README tareas v2 |
| E | Pendiente | Resumen por email con SES | Function tests + mocks SES + UI trigger | Deploy email | README email + env Vercel |
| F | Pendiente | Hardening final | Suite completa + smoke test | Deploy final | README final + checklist |

## Checklist etapa activa: A

### Alcance
- [x] Crear configuracion base del proyecto frontend.
- [x] Definir scripts de desarrollo, build y test.
- [x] Configurar Vitest y React Testing Library.
- [x] Dejar una SPA minima renderizando.
- [x] Confirmar estrategia de deploy en Vercel.

### Verificacion
- [x] `npm install` funciona.
- [x] `npm run dev` levanta la app.
- [x] `npm run test` pasa.
- [x] `npm run build` genera salida de produccion.
- [ ] Deploy inicial en Vercel responde con la SPA.

### Documentacion
- [x] README con instalacion.
- [x] README con scripts.
- [x] README con variables de entorno.
- [x] README con alcance de la etapa A.

## Bloqueos

- Ninguno registrado.
