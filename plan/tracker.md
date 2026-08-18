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
- [x] Crear tarea (titulo + descripcion)
- [x] Listar tareas del usuario
- [x] Editar tarea
- [x] Eliminar tarea
- [x] Marcar tarea como completada
- [x] Persistencia en Firestore
- [x] Cada usuario solo ve sus propias tareas

### Persistencia y sincronizacion
- [x] Datos almacenados en Cloud Firestore
- [x] Filtrado por userId
- [x] Manejo de estados de carga (loading)
- [x] Manejo de errores
- [x] Actualizacion automatica de la UI tras operaciones CRUD

### Email
- [] Boton para enviar email con resumen del estado de todas las tareas. El email tiene que ser enviado al email del usuario autenticado. 
- [] Funcion de envio usando AWS SES. Validar que la cuenta de AWS SES en el archivo .env sirva para esto.
- [] Email de confirmacion de envio
- [] Sin secretos expuestos en el frontend


### Testing
- [x] Tests unitarios de funciones clave
- [x] Tests de componente TodoForm
- [x] Tests de componente TodoList
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


