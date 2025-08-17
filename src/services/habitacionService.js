const API_BASE_URL = 'http://localhost:8080/api';

export const habitacionService = {
  // Obtener todas las habitaciones
  async getAllHabitaciones() {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones`);
      if (!response.ok) {
        throw new Error(`Error al obtener habitaciones: ${response.status}`);
      }
      const habitaciones = await response.json();
      
      console.log('Datos de habitaciones del backend:', habitaciones);
      
      // Formatear los datos para mejor visualización
      return habitaciones.map(habitacion => {
        console.log('Procesando habitación:', habitacion);
        console.log('Tipo de habitación:', habitacion.tipo);
        console.log('Límite de personas:', habitacion.tipo?.limitePersonas);
        
        return {
          ...habitacion,
          precioFormatted: `$${habitacion.precioNoche?.toLocaleString()}`,
          tipoNombre: habitacion.tipo ? habitacion.tipo.nombreTipo : 'N/A',
          capacidad: habitacion.tipo ? habitacion.tipo.limitePersonas : 'N/A'
        };
      });
    } catch (error) {
      console.error('Error obteniendo habitaciones:', error);
      throw error;
    }
  },

  // Obtener habitación por ID
  async getHabitacionById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener habitación: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo habitación:', error);
      throw error;
    }
  },

  // Crear nueva habitación
  async createHabitacion(habitacionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitacionData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear habitación: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando habitación:', error);
      throw error;
    }
  },

  // Actualizar habitación
  async updateHabitacion(id, habitacionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitacionData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar habitación: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando habitación:', error);
      throw error;
    }
  },

  // Eliminar habitación
  async deleteHabitacion(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar habitación: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error eliminando habitación:', error);
      throw error;
    }
  },

  // Obtener habitaciones con filtros
  async getHabitacionesFiltradas(filtros = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filtros.nombre) {
        queryParams.append('nombre', filtros.nombre);
      }
      if (filtros.tipo) {
        queryParams.append('tipo', filtros.tipo);
      }
      if (filtros.piso) {
        queryParams.append('piso', filtros.piso);
      }
      if (filtros.precioMin) {
        queryParams.append('precioMin', filtros.precioMin);
      }
      if (filtros.precioMax) {
        queryParams.append('precioMax', filtros.precioMax);
      }
      
      const url = `${API_BASE_URL}/habitaciones${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error al obtener habitaciones filtradas: ${response.status}`);
      }
      
      const habitaciones = await response.json();
      return habitaciones.map(habitacion => ({
        ...habitacion,
        precioFormatted: `$${habitacion.precioNoche?.toLocaleString()}`,
        tipoNombre: habitacion.tipo ? habitacion.tipo.nombreTipo : 'N/A',
        capacidad: habitacion.tipo ? habitacion.tipo.limitePersonas : 'N/A'
      }));
    } catch (error) {
      console.error('Error obteniendo habitaciones filtradas:', error);
      throw error;
    }
  },

  // Obtener estadísticas de habitaciones
  async getHabitacionesStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/habitaciones`);
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas: ${response.status}`);
      }
      
      const habitaciones = await response.json();
      
      const total = habitaciones.length;
      const porPiso = {};
      const porTipo = {};
      let ingresosPotenciales = 0;
      
      habitaciones.forEach(habitacion => {
        // Contar por piso
        const piso = habitacion.pisoUbicacion || 'Sin piso';
        porPiso[piso] = (porPiso[piso] || 0) + 1;
        
        // Contar por tipo
        const tipo = habitacion.tipo ? habitacion.tipo.nombreTipo : 'Sin tipo';
        porTipo[tipo] = (porTipo[tipo] || 0) + 1;
        
        // Calcular ingresos potenciales (30 días)
        ingresosPotenciales += (habitacion.precioNoche || 0) * 30;
      });
      
      return {
        total,
        porPiso,
        porTipo,
        ingresosPotenciales,
        promedioPrecio: habitaciones.reduce((sum, h) => sum + (h.precioNoche || 0), 0) / total || 0
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};






