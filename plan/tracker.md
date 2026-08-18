# Source Plan Tracker

Estado general del proyecto: En progreso
Etapa activa: E
Ultima actualizacion: 2026-08-18



## Checklist 

### Autenticacion
- [x] Registro con email y password
- [x] Registro / login con Google
- [x] Login
- [x] Logout
- [x] Proteccion de rutas privadas (no se deben ver tareas sin login)
- [x] Manejo claro de errores de autenticacion

### Gestion de tareas (usuario autenticado)
- [] Crear tarea (titulo + descripcion)
- [] Listar tareas del usuario
- [] Editar tarea
- [] Eliminar tarea
- [] Marcar tarea como completada
- [] Persistencia en Firestore
- [] Cada usuario solo ve sus propias tareas

### Persistencia y sincronizacion
- [] Datos almacenados en Cloud Firestore
- [] Filtrado por userId
- [] Manejo de estados de carga (loading)
- [] Manejo de errores
- [] Actualizacion automatica de la UI tras operaciones CRUD

### Email
- [] Boton para enviar email con resumen del estado de todas las tareas
- [] Funcion de envio usando AWS SES
- [] Email de confirmacion de envio
- [] Sin secretos expuestos en el frontend

### Testing
- [] Tests unitarios de funciones clave
- [] Tests de componente TodoForm
- [] Tests de componente TodoList
- [x] Mock de servicios externos (Firebase, AWS SES) cuando corresponda

### Deploy
- [] Deploy en Vercel
- [] URL publica funcional
- [] Variables de entorno configuradas en Vercel

### Seguridad
- [x] Crear .env para desarrollo
- [x] Crear .env.example sin datos sensibles
- [x] Credenciales de AWS como variables de entorno
- [x] Credenciales de Firebase como variables de entorno
- [x] Agregar .env al .gitignore
- [x] Verificar que los commits no incluyan variables de entorno / secretos


