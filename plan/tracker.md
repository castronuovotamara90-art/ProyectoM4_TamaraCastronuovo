# Source Plan Tracker

Estado general del proyecto: En progreso
Etapa activa: E
Ultima actualizacion: 2026-08-15

## Tablero de etapas

| Etapa | Estado | Alcance resumido | Tests requeridos | Deploy | Docs |
|---|---|---|---|---|---|
| A | Completada | Base React + TypeScript + Vite + Vitest + Vercel | Setup base, render inicial, utilidades de test | Primer deploy tecnico | README setup + scripts + env |
| B1 | Completada | Auth email/password + rutas privadas | Auth service + forms + guards | Deploy auth base | README auth base |
| B2 | Completada | Google Authentication | Auth social + CTA Google + errores | Deploy auth social | README auth Google |
| C | Completada | Crear y listar tareas por usuario | Firestore mocks + TaskForm + TaskList | Deploy CRUD parcial | README tareas v1 |
| D | Completada | Editar, eliminar, completar | Integracion CRUD completo | Deploy CRUD completo | README tareas v2 |
| E | En progreso | Resumen por email con SES | Function tests + mocks SES + UI trigger | Deploy email | README email + env Vercel |
| F | Pendiente | Hardening final | Suite completa + smoke test | Deploy final | README final + checklist |

## Checklist etapa activa: E

### Alcance
- [x] Definir flujo de autenticacion por email/password.
- [x] Implementar Google auth demo.
- [x] Crear formulario para agregar tareas por usuario.
- [x] Listar tareas por usuario autenticado.
- [x] Editar tareas desde el dashboard.
- [x] Marcar tareas como completadas.
- [x] Eliminar tareas del usuario.
- [x] Crear function de resumen por email con AWS SES.
- [x] Exponer trigger desde el dashboard para enviar el resumen.

### Verificacion
- [ ] `npm run test` ejecuta los flujos de B1, B2, C, D y E.
- [ ] `npm run build` compila correctamente.
- [ ] El avance queda publicado en GitHub.

### Documentacion
- [x] README con descripcion del estado actual.
- [ ] README con alcance de Etapa E.
- [x] Plan actualizado con el estado real de cada etapa.

## Bloqueos

- Ninguno registrado.
