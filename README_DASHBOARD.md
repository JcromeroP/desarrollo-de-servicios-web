# Dashboard del Sistema Hotelero

## 🚀 Funcionalidades del Dashboard

El dashboard ahora está completamente conectado al backend y muestra datos reales de la base de datos:

### 📊 **Estadísticas en Tiempo Real**
- **Reservas**: Total, activas y pendientes
- **Habitaciones**: Total, disponibles y ocupadas
- **Huéspedes**: Total, activos y nuevos
- **Usuarios**: Total, administradores y staff
- **Ingresos**: Del mes actual y totales
- **Ocupación**: Tasa de ocupación del hotel
- **Promedio**: Ingreso promedio por reserva

### 🎨 **Diseño Mejorado**
- Gradientes de colores inspirados en Argon Dashboard
- Efectos hover y transiciones suaves
- Iconos FontAwesome para mejor UX
- Diseño responsive para móviles y tablets
- Sombras y bordes redondeados modernos

## 🔧 **Configuración Requerida**

### 1. **Backend (Spring Boot)**
```bash
# Navegar al directorio del backend
cd backend-proyecto

# Ejecutar el proyecto
./mvnw spring-boot:run
```

**Puerto**: El backend debe estar ejecutándose en `http://localhost:8080`

### 2. **Base de Datos MySQL**
- **URL**: `jdbc:mysql://localhost:3306/bd_proyecto_reserva`
- **Usuario**: `root`
- **Contraseña**: (vacía por defecto)
- **Base de datos**: `bd_proyecto_reserva`

### 3. **Frontend (React)**
```bash
# Navegar al directorio del frontend
cd proyecto-frontend

# Instalar dependencias
npm install

# Ejecutar el proyecto
npm start
```

**Puerto**: El frontend se ejecutará en `http://localhost:3000`

## 📡 **Endpoints del Backend Utilizados**

### **Reservas**
- `GET /api/reservas` - Listar todas las reservas
- `GET /api/reservas/{id}` - Obtener reserva por ID
- `POST /api/reservas` - Crear nueva reserva
- `PUT /api/reservas/{id}` - Actualizar reserva
- `DELETE /api/reservas/{id}` - Eliminar reserva

### **Habitaciones**
- `GET /api/habitaciones` - Listar todas las habitaciones
- `POST /api/habitaciones` - Crear nueva habitación

### **Huéspedes**
- `GET /api/huespedes` - Listar todos los huéspedes
- `GET /api/huespedes/{id}` - Obtener huésped por ID
- `POST /api/huespedes` - Crear nuevo huésped
- `PUT /api/huespedes/{id}` - Actualizar huésped
- `DELETE /api/huespedes/{id}` - Eliminar huésped

### **Usuarios**
- `GET /api/usuarios` - Listar todos los usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

## 🔒 **Configuración CORS**

El backend incluye configuración CORS para permitir peticiones desde el frontend:

- **Orígenes permitidos**: `http://localhost:3000`, `http://localhost:3001`
- **Métodos**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Todos los headers
- **Credentials**: Habilitado

## 📱 **Responsive Design**

El dashboard se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop**: 4 tarjetas por fila
- **Tablet**: 2 tarjetas por fila
- **Móvil**: 1 tarjeta por fila

## 🎯 **Características Técnicas**

### **Frontend**
- React 18 con Hooks
- React Bootstrap para componentes UI
- CSS personalizado con variables CSS
- Manejo de estado con useState y useEffect
- Servicios asíncronos para API calls

### **Backend**
- Spring Boot 3.x
- Spring Data JPA
- MySQL como base de datos
- Configuración CORS global
- Entidades con relaciones JPA

### **Base de Datos**
- MySQL 8.0+
- Esquema automático con Hibernate
- Relaciones entre entidades (OneToMany, ManyToOne)

## 🚨 **Solución de Problemas**

### **Error de Conexión**
Si aparece "Error de Conexión":
1. Verifica que el backend esté ejecutándose en puerto 8080
2. Verifica que MySQL esté activo
3. Revisa la consola del navegador para errores específicos

### **Datos No Cargados**
Si las estadísticas no se cargan:
1. Verifica que la base de datos tenga datos
2. Revisa los logs del backend
3. Verifica que las entidades tengan la estructura correcta

### **Problemas de CORS**
Si hay errores de CORS:
1. Verifica que la configuración CORS esté activa
2. Reinicia el backend después de cambios
3. Verifica que el frontend esté en el puerto correcto

## 🔄 **Actualizaciones en Tiempo Real**

El dashboard se actualiza automáticamente:
- Al cargar la página
- Los datos se obtienen del backend en tiempo real
- Estadísticas calculadas dinámicamente

## 📈 **Métricas Calculadas**

### **Reservas Activas**
- Reservas con fecha de check-in <= hoy <= fecha de check-out

### **Reservas Pendientes**
- Reservas con fecha de check-in > hoy

### **Habitaciones Disponibles**
- Total de habitaciones - habitaciones ocupadas

### **Huéspedes Activos**
- Huéspedes con reservas activas

### **Tasa de Ocupación**
- (Habitaciones ocupadas / Total habitaciones) * 100

### **Ingresos**
- Suma de montoTotal de todas las reservas
- Filtrado por mes actual para ingresos mensuales

## 🎨 **Personalización de Colores**

Los gradientes utilizan la paleta de colores de Argon Dashboard:
- **Azul**: `#5e72e4` → `#825ee4`
- **Verde**: `#2dce89` → `#2dcecc`
- **Naranja**: `#fb6340` → `#fbb140`
- **Azul claro**: `#11cdef` → `#1171ef`
- **Púrpura**: `#8965e0` → `#9b6bff`
- **Rojo**: `#f5365c` → `#f56036`
- **Amarillo**: `#ffd600` → `#ffed4e`

