# 🚀 INSTRUCCIONES DE EJECUCIÓN COMPLETA

## 📋 **PASOS PARA EJECUTAR EL PROYECTO COMPLETO**

### **PASO 1: CONFIGURAR LA BASE DE DATOS MYSQL**

#### 1.1 **Abrir MySQL Workbench**
- Ejecutar MySQL Workbench
- Conectarse a tu servidor MySQL local (puerto 3306)

#### 1.2 **Ejecutar el Script SQL Completo**
- Abrir el archivo: `backend-proyecto/database_setup.sql`
- **IMPORTANTE**: Ejecutar TODO el script completo de una vez
- El script creará la base de datos y la poblará con datos de ejemplo

#### 1.3 **Verificar la Creación**
```sql
-- Ejecutar esta consulta para verificar
USE bd_proyecto_reserva;
SHOW TABLES;
```

**Deberías ver estas tablas:**
- `tipo_habitacion`
- `usuario`
- `habitacion`
- `huesped`
- `reserva`

#### 1.4 **Verificar los Datos**
```sql
-- Verificar que hay datos en cada tabla
SELECT 'Tipo Habitación' as tabla, COUNT(*) as total FROM tipo_habitacion
UNION ALL
SELECT 'Usuario' as tabla, COUNT(*) as total FROM usuario
UNION ALL
SELECT 'Habitación' as tabla, COUNT(*) as total FROM habitacion
UNION ALL
SELECT 'Huésped' as tabla, COUNT(*) as total FROM huesped
UNION ALL
SELECT 'Reserva' as tabla, COUNT(*) as total FROM reserva;
```

**Resultados esperados:**
- Tipo Habitación: 4
- Usuario: 4
- Habitación: 10
- Huésped: 8
- Reserva: 10

---

### **PASO 2: EJECUTAR EL BACKEND (SPRING BOOT)**

#### 2.1 **Abrir Terminal/CMD**
```bash
# Navegar al directorio del backend
cd backend-proyecto
```

#### 2.2 **Verificar Java y Maven**
```bash
# Verificar que tienes Java 17+ instalado
java -version

# Verificar que tienes Maven instalado
mvn -version
```

#### 2.3 **Ejecutar el Backend**
```bash
# Ejecutar con Maven Wrapper (recomendado)
./mvnw spring-boot:run

# O si tienes Maven instalado globalmente
mvn spring-boot:run
```

#### 2.4 **Verificar que el Backend Funciona**
- El backend debe iniciar en `http://localhost:8080`
- Deberías ver en la consola: "Started BackendProyectoApplication"
- **NO CERRAR** esta terminal

**Logs esperados:**
```
2024-XX-XX XX:XX:XX.XXX  INFO 1234 --- [main] c.b.B.BackendProyectoApplication : Started BackendProyectoApplication in X.XXX seconds
```

---

### **PASO 3: EJECUTAR EL FRONTEND (REACT)**

#### 3.1 **Abrir NUEVA Terminal/CMD**
```bash
# Navegar al directorio del frontend
cd proyecto-frontend
```

#### 3.2 **Instalar Dependencias**
```bash
# Instalar todas las dependencias
npm install
```

#### 3.3 **Ejecutar el Frontend**
```bash
# Iniciar el servidor de desarrollo
npm start
```

#### 3.4 **Verificar que el Frontend Funciona**
- El navegador se abrirá automáticamente en `http://localhost:3000`
- Deberías ver el dashboard con datos reales de la base de datos

---

### **PASO 4: VERIFICAR LA CONEXIÓN**

#### 4.1 **Verificar en el Navegador**
- Abrir `http://localhost:3000`
- Deberías ver el dashboard con estadísticas reales
- **NO** deberías ver "Error de Conexión"

#### 4.2 **Verificar en la Consola del Navegador**
- Presionar F12 → Console
- **NO** deberías ver errores de CORS o conexión

#### 4.3 **Verificar las Estadísticas**
El dashboard debe mostrar:
- **Reservas**: Número real (debería ser 10)
- **Habitaciones**: Número real (debería ser 10)
- **Huéspedes**: Número real (debería ser 8)
- **Usuarios**: Número real (debería ser 4)

---

## 🚨 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **PROBLEMA 1: Error de Conexión a MySQL**
```
Error: Communications link failure
```
**SOLUCIÓN:**
1. Verificar que MySQL esté ejecutándose
2. Verificar que el puerto 3306 esté libre
3. Verificar credenciales en `application.properties`

### **PROBLEMA 2: Error de CORS**
```
Access to fetch at 'http://localhost:8080/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**SOLUCIÓN:**
1. Reiniciar el backend después de cambios en CORS
2. Verificar que `CorsConfig.java` esté en el paquete correcto
3. Limpiar caché del navegador

### **PROBLEMA 3: Base de Datos Vacía**
```
Las estadísticas muestran 0 en todas las métricas
```
**SOLUCIÓN:**
1. Verificar que el script SQL se ejecutó completamente
2. Verificar que la base de datos `bd_proyecto_reserva` existe
3. Verificar que las tablas tienen datos

### **PROBLEMA 4: Puerto 8080 Ocupado**
```
Web server failed to start. Port 8080 was already in use.
```
**SOLUCIÓN:**
1. Cambiar puerto en `application.properties`:
   ```properties
   server.port=8081
   ```
2. Actualizar `dashboardService.js` con el nuevo puerto
3. O cerrar la aplicación que use el puerto 8080

---

## 🔧 **CONFIGURACIONES ADICIONALES**

### **Cambiar Puerto del Backend**
Si necesitas cambiar el puerto del backend:

1. **Editar `application.properties`:**
```properties
server.port=8081
```

2. **Editar `dashboardService.js`:**
```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

### **Cambiar Puerto del Frontend**
Si necesitas cambiar el puerto del frontend:

1. **Crear archivo `.env` en `proyecto-frontend/`:**
```env
PORT=3001
```

2. **O ejecutar con puerto específico:**
```bash
npm start -- --port 3001
```

---

## 📱 **VERIFICAR RESPONSIVE DESIGN**

### **Pruebas de Responsive:**
1. **Desktop**: Ancho > 1200px (4 tarjetas por fila)
2. **Laptop**: Ancho 992px - 1200px (4 tarjetas por fila)
3. **Tablet**: Ancho 768px - 991px (2 tarjetas por fila)
4. **Móvil**: Ancho < 768px (1 tarjeta por fila)

### **Cómo Probar:**
1. En el navegador, presionar F12
2. Hacer clic en el ícono de dispositivo móvil
3. Cambiar el ancho de la pantalla
4. Verificar que el layout se adapte correctamente

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

- [ ] MySQL está ejecutándose en puerto 3306
- [ ] Base de datos `bd_proyecto_reserva` creada
- [ ] Todas las tablas tienen datos
- [ ] Backend ejecutándose en puerto 8080
- [ ] Frontend ejecutándose en puerto 3000
- [ ] Dashboard muestra estadísticas reales
- [ ] No hay errores en la consola del navegador
- [ ] Diseño responsive funciona en diferentes tamaños
- [ ] Las tarjetas tienen efectos hover
- [ ] Los iconos se muestran correctamente

---

## 🎯 **RESULTADO FINAL ESPERADO**

Al completar todos los pasos, deberías ver:

1. **Dashboard completamente funcional** con datos reales
2. **8 tarjetas de estadísticas** con gradientes de colores
3. **Datos en tiempo real** desde la base de datos MySQL
4. **Diseño responsive** que se adapta a todos los dispositivos
5. **Efectos visuales** suaves y profesionales
6. **Sin errores** de conexión o CORS

**¡El sistema estará completamente conectado y funcionando!** 🎉

