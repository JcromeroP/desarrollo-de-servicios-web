# Navbar Dinámico por Rol de Usuario

## Funcionalidad Implementada

El sistema ahora incluye tu Navbar.jsx existente que muestra diferentes opciones según el rol del usuario:

### Para Usuarios USER:
- **Reservas** - Gestión de reservas del hotel
- **Habitaciones** - Administración de habitaciones
- **Huéspedes** - Gestión de información de huéspedes

### Para Usuarios ADMIN:
- **Reservas** - Gestión de reservas del hotel
- **Habitaciones** - Administración de habitaciones
- **Huéspedes** - Gestión de información de huéspedes
- **Usuarios** - Administración de usuarios del sistema (exclusivo para ADMIN)

## Credenciales de Prueba

### Usuario ADMIN:
- **Email:** admin@admin.com
- **Password:** admin1
- **Rol:** ADMIN
- **Acceso:** Todas las funcionalidades incluyendo gestión de usuarios

### Usuario USER:
- **Email:** user@user.com
- **Password:** user1
- **Rol:** USER
- **Acceso:** Solo funcionalidades básicas (sin gestión de usuarios)

## Cómo Probar

1. **Iniciar la aplicación:**
   ```bash
   npm start
   ```

2. **Ir a la página de login:**
   - Navegar a `/login`

3. **Probar con usuario ADMIN:**
   - Usar credenciales: admin@admin.com / admin1
   - Verificar que aparece la opción "Usuarios" en el navbar

4. **Probar con usuario USER:**
   - Usar credenciales: user@user.com / user1
   - Verificar que NO aparece la opción "Usuarios" en el navbar

5. **Verificar funcionalidad:**
   - El navbar se actualiza automáticamente según el rol
   - El email del usuario aparece en el dropdown
   - La funcionalidad de cerrar sesión funciona correctamente

## Archivos Modificados

- `src/context/AuthContext.jsx` - Contexto de autenticación
- `src/components/Navbar.jsx` - Navbar dinámico (tu navbar existente)
- `src/components/Layout.jsx` - Layout común que contiene el navbar
- `src/components/Layout.css` - Estilos para mantener el navbar consistente
- `src/views/Login.jsx` - Login con contexto de autenticación
- `src/views/Dashboard.jsx` - Dashboard que usa el Layout
- `src/views/ListarReservas.jsx` - Actualizado para usar Layout
- `src/views/ListarHabitaciones.jsx` - Actualizado para usar Layout
- `src/views/ListaHuespedes.jsx` - Actualizado para usar Layout
- `src/views/ListaUsuarios.jsx` - Actualizado para usar Layout
- `src/routes/PrivateRoute.jsx` - Ruta protegida actualizada
- `src/App.js` - App con AuthProvider

## Características Técnicas

- **Tu Navbar.jsx:** Se mantiene tu diseño y estructura original
- **Layout Común:** Todas las páginas usan el mismo Layout con navbar
- **Context API:** Manejo centralizado del estado de autenticación
- **LocalStorage:** Persistencia de la sesión del usuario
- **Renderizado Condicional:** Mostrar/ocultar opciones según el rol
- **Protección de Rutas:** Verificación de autenticación
- **Manejo de Estado:** Estado global del usuario en toda la aplicación
- **Navbar Consistente:** No se desacomoda al navegar entre páginas

## Notas Importantes

- **Se mantiene tu Navbar.jsx original** con su diseño y funcionalidad
- **Layout Común:** Todas las páginas usan el mismo Layout para evitar duplicación
- El navbar se actualiza automáticamente al cambiar de usuario
- La sesión persiste entre recargas de página
- Solo los usuarios ADMIN pueden acceder a la gestión de usuarios
- El Dashboard se muestra debajo de tu navbar
- **Navbar Consistente:** No se desacomoda al navegar entre páginas
- El sistema es responsive y funciona en dispositivos móviles 