# 🏨 Componente de Reservas - Sistema Hotelero

## 🚀 **Funcionalidades Implementadas**

### **✅ Conexión Completa con Backend**
- **API REST** conectada al `ReservaController.java`
- **CRUD completo** de reservas (Crear, Leer, Actualizar, Eliminar)
- **Datos en tiempo real** desde la base de datos MySQL
- **Manejo de errores** robusto con validaciones

### **📊 Dashboard de Estadísticas**
- **Total de reservas** en tiempo real
- **Reservas activas** (con check-in <= hoy <= check-out)
- **Reservas pendientes** (con check-in > hoy)
- **Ingresos totales** calculados automáticamente

### **🔍 Sistema de Filtros Avanzado**
- **Filtro por fechas** (desde/hasta)
- **Búsqueda por huésped** (nombre)
- **Filtro por habitación** (nombre temático)
- **Aplicar/limpiar filtros** dinámicamente

### **📋 Tabla de Reservas Completa**
- **Estado visual** con badges de colores (Pendiente, Activa, Completada)
- **Información detallada** de huéspedes, habitaciones y usuarios
- **Fechas formateadas** en español
- **Montos formateados** con separadores de miles
- **Acciones** de editar y eliminar por reserva

### **📱 Diseño 100% Responsive**
- **Desktop**: Layout completo con todas las columnas
- **Tablet**: Adaptación automática del contenido
- **Móvil**: Vista optimizada para pantallas pequeñas
- **Breakpoints**: 1200px, 992px, 768px, 576px

### **⚡ Funcionalidades Avanzadas**
- **Paginación inteligente** (10, 25, 50, 100 items por página)
- **Navegación entre páginas** con controles intuitivos
- **Modal de confirmación** para eliminaciones
- **Estados de carga** con spinners
- **Alertas de error** con manejo de excepciones

## 🔧 **Arquitectura Técnica**

### **Frontend (React)**
```javascript
// Servicio de reservas
import { reservaService } from '../services/reservaService';

// Funciones principales
- getAllReservas()           // Obtener todas las reservas
- getReservaById(id)         // Obtener reserva específica
- createReserva(data)        // Crear nueva reserva
- updateReserva(id, data)    // Actualizar reserva existente
- deleteReserva(id)          // Eliminar reserva
- getReservasFiltradas()     // Aplicar filtros
- getReservasStats()         // Obtener estadísticas
```

### **Backend (Spring Boot)**
```java
// ReservaController.java
@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")

// Endpoints disponibles
GET    /api/reservas         // Listar todas las reservas
GET    /api/reservas/{id}    // Obtener reserva por ID
POST   /api/reservas         // Crear nueva reserva
PUT    /api/reservas/{id}    // Actualizar reserva
DELETE /api/reservas/{id}    // Eliminar reserva
```

### **Base de Datos (MySQL)**
```sql
-- Estructura de la tabla reserva
CREATE TABLE reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    fecha_checkin DATE NOT NULL,
    fecha_checkout DATE NOT NULL,
    cantidad_dias INT NOT NULL,
    cantidad_personas INT NOT NULL DEFAULT 2,
    monto_total DECIMAL(10,2) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_habitacion INT,
    id_huesped INT,
    id_empleado INT,
    FOREIGN KEY (id_habitacion) REFERENCES habitacion(id_habitacion),
    FOREIGN KEY (id_huesped) REFERENCES huesped(id_huesped),
    FOREIGN KEY (id_empleado) REFERENCES usuario(id_empleado)
);
```

## 🎨 **Estilos CSS Personalizados**

### **Clases CSS Implementadas**
```css
.reservas-header          /* Header con gradiente azul */
.stats-card              /* Tarjetas de estadísticas con hover */
.filtros-card            /* Panel de filtros con fondo claro */
.table-container         /* Contenedor de tabla con sombras */
.badge-estado            /* Badges de estado personalizados */
.badge-dias              /* Badges de días personalizados */
.badge-personas          /* Badges de personas personalizados */
.acciones-buttons        /* Botones de acciones con layout */
.paginacion-container    /* Contenedor de paginación */
.modal-confirmacion      /* Modal de confirmación personalizado */
```

### **Responsive Design**
- **1200px+**: Layout completo, 4 columnas de estadísticas
- **992px-1199px**: Layout ajustado, 4 columnas
- **768px-991px**: Layout tablet, 2 columnas de estadísticas
- **<768px**: Layout móvil, 1 columna, tabla scrollable

## 📡 **Flujo de Datos**

### **1. Carga Inicial**
```javascript
useEffect(() => {
  loadReservas();      // Cargar reservas desde backend
  loadStats();         // Cargar estadísticas
}, []);
```

### **2. Obtención de Datos**
```javascript
const loadReservas = async () => {
  try {
    setLoading(true);
    const data = await reservaService.getAllReservas();
    setReservas(data);
  } catch (err) {
    setError('Error al cargar las reservas');
  } finally {
    setLoading(false);
  }
};
```

### **3. Aplicación de Filtros**
```javascript
const aplicarFiltros = async () => {
  try {
    setLoading(true);
    const data = await reservaService.getReservasFiltradas(filtros);
    setReservas(data);
    setCurrentPage(1);
  } catch (err) {
    setError('Error al aplicar los filtros');
  } finally {
    setLoading(false);
  }
};
```

### **4. Eliminación de Reservas**
```javascript
const handleDelete = async () => {
  try {
    await reservaService.deleteReserva(reservaToDelete.idReserva);
    setReservas(reservas.filter(r => r.idReserva !== reservaToDelete.idReserva));
    loadStats(); // Recargar estadísticas
  } catch (err) {
    setError('Error al eliminar la reserva');
  }
};
```

## 🎯 **Características Destacadas**

### **Estado Visual de Reservas**
- 🟡 **Pendiente**: Check-in en el futuro
- 🟢 **Activa**: Check-in <= hoy <= check-out
- ⚫ **Completada**: Check-out en el pasado

### **Formateo Automático de Datos**
- **Fechas**: Formato español (dd/mm/aaaa)
- **Montos**: Separadores de miles y símbolo de moneda
- **Nombres**: Apellidos y nombres concatenados
- **Información adicional**: DNI, piso, cargo del usuario

### **Validaciones y Seguridad**
- **Confirmación** antes de eliminar reservas
- **Manejo de errores** de conexión
- **Estados de carga** para mejor UX
- **Validación de datos** del backend

## 🔄 **Integración con Dashboard**

### **Datos Compartidos**
- **Estadísticas** sincronizadas entre componentes
- **Recarga automática** al modificar reservas
- **Consistencia** de datos en tiempo real

### **Navegación**
- **Enlaces** entre dashboard y lista de reservas
- **Estado persistente** de filtros y paginación
- **Contexto** del usuario autenticado

## 🚨 **Solución de Problemas**

### **Error de Conexión**
```javascript
// Verificar que el backend esté ejecutándose
// Puerto 8080 debe estar activo
// Verificar configuración CORS
```

### **Datos No Cargados**
```javascript
// Verificar que la base de datos tenga reservas
// Revisar logs del backend
// Verificar estructura de entidades JPA
```

### **Problemas de Filtros**
```javascript
// Verificar formato de fechas (YYYY-MM-DD)
// Verificar que los filtros se apliquen correctamente
// Revisar consola del navegador para errores
```

## ✅ **Checklist de Verificación**

- [ ] Backend ejecutándose en puerto 8080
- [ ] Base de datos con datos de reservas
- [ ] Componente carga sin errores
- [ ] Estadísticas se muestran correctamente
- [ ] Filtros funcionan correctamente
- [ ] Tabla muestra todas las columnas
- [ ] Paginación funciona
- [ ] Botones de acción responden
- [ ] Modal de confirmación aparece
- [ ] Diseño responsive en todos los dispositivos
- [ ] No hay errores en la consola

## 🎉 **Resultado Final**

Al completar la implementación, tendrás:

1. **Componente completamente funcional** conectado al backend
2. **Gestión completa de reservas** con CRUD operaciones
3. **Dashboard de estadísticas** en tiempo real
4. **Sistema de filtros avanzado** para búsquedas
5. **Tabla responsive** con paginación inteligente
6. **Diseño moderno** con estilos personalizados
7. **Integración perfecta** con el sistema hotelero

**¡El componente de reservas estará completamente conectado y funcionando!** 🚀


