# Source Plan Tracker

Estado general del proyecto: En progreso
Etapa activa: B1
Ultima actualizacion: 2026-08-14

## Tablero de etapas

| Etapa | Estado | Alcance resumido | Tests requeridos | Deploy | Docs |
|---|---|---|---|---|---|
| A | Completada | Base React + TypeScript + Vite + Vitest + Vercel | Setup base, render inicial, utilidades de test | Primer deploy tecnico | README setup + scripts + env |
| B1 | En progreso | Auth email/password + rutas privadas | Auth service + forms + guards | Deploy auth base | README auth base |
| B2 | Pendiente | Google Authentication | Auth social + CTA Google + errores | Deploy auth social | README auth Google |
| C | Pendiente | Crear y listar tareas por usuario | Firestore mocks + TaskForm + TaskList | Deploy CRUD parcial | README tareas v1 |
| D | Pendiente | Editar, eliminar, completar | Integracion CRUD completo | Deploy CRUD completo | README tareas v2 |
| E | Pendiente | Resumen por email con SES | Function tests + mocks SES + UI trigger | Deploy email | README email + env Vercel |
| F | Pendiente | Hardening final | Suite completa + smoke test | Deploy final | README final + checklist |

## Checklist etapa activa: B1

### Alcance
- [x] Definir flujo de autenticacion por email/password.
- [x] Crear formulario de login con validacion de campos.
- [x] Implementar rutas privadas para dashboard.
- [x] Guardar sesion local en memoria para la demo inicial.
- [ ] Preparar la base para conectar Firebase Auth real.

### Verificacion
- [x] `npm run test` ejecuta el flujo base de auth.
- [ ] `npm run build` verifica compilacion con auth y guardas.
- [ ] Se publica un deploy de la autenticacion base en Vercel.

### Documentacion
- [ ] README con descripcion de la Etapa B1.
- [ ] README con credenciales demo y reglas de acceso.
- [ ] Documentacion de B2 y siguientes enlazada desde el plan.

## Bloqueos

- Ninguno registrado.
