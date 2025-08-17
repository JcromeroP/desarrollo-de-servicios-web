const API_BASE_URL = 'http://localhost:8080/api';

export const huespedService = {
  // Obtener todos los huéspedes
  async getAllHuespedes() {
    try {
      const response = await fetch(`${API_BASE_URL}/huespedes`);
      if (!response.ok) {
        throw new Error(`Error al obtener huéspedes: ${response.status}`);
      }
      const huespedes = await response.json();
      
      // Formatear los datos para mejor visualización
      return huespedes.map(huesped => ({
        ...huesped,
        fechaNacFormatted: huesped.fechaNac ? 
          new Date(huesped.fechaNac).toLocaleDateString('es-ES') : 'N/A',
        nombreCompleto: `${huesped.nombres} ${huesped.apellidos}`,
        edad: huesped.fechaNac ? 
          Math.floor((new Date() - new Date(huesped.fechaNac)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'
      }));
    } catch (error) {
      console.error('Error obteniendo huéspedes:', error);
      throw error;
    }
  },

  // Obtener huésped por ID
  async getHuespedById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/huespedes/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener huésped: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo huésped:', error);
      throw error;
    }
  },

  // Crear nuevo huésped
  async createHuesped(huespedData) {
    try {
      const response = await fetch(`${API_BASE_URL}/huespedes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(huespedData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear huésped: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando huésped:', error);
      throw error;
    }
  },

  // Actualizar huésped
  async updateHuesped(id, huespedData) {
    try {
      // Validaciones del lado del cliente
      if (!huespedData.dni || !huespedData.nombres) {
        throw new Error('DNI y nombres son campos obligatorios');
      }

      // Preparar datos para enviar al backend
      const huespedToSend = {
        dni: huespedData.dni,
        nombres: huespedData.nombres,
        apellidos: huespedData.apellidos || '',
        fechaNac: huespedData.fechaNac || null,
        direccion: huespedData.direccion || '',
        profesion: huespedData.profesion || ''
      };

      const response = await fetch(`${API_BASE_URL}/huespedes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(huespedToSend),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al actualizar huésped: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando huésped:', error);
      throw error;
    }
  },

  // Eliminar huésped
  async deleteHuesped(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/huespedes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al eliminar huésped: ${response.status}`);
      }
      
      // El backend devuelve 204 (No Content) para eliminaciones exitosas
      return true;
    } catch (error) {
      console.error('Error eliminando huésped:', error);
      throw error;
    }
  },

  // Obtener huéspedes con filtros
  async getHuespedesFiltrados(filtros = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filtros.nombre) {
        queryParams.append('nombre', filtros.nombre);
      }
      if (filtros.profesion) {
        queryParams.append('profesion', filtros.profesion);
      }
      if (filtros.dni) {
        queryParams.append('dni', filtros.dni);
      }
      
      const url = `${API_BASE_URL}/huespedes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error al obtener huéspedes filtrados: ${response.status}`);
      }
      
      const huespedes = await response.json();
      return huespedes.map(huesped => ({
        ...huesped,
        fechaNacFormatted: huesped.fechaNac ? 
          new Date(huesped.fechaNac).toLocaleDateString('es-ES') : 'N/A',
        nombreCompleto: `${huesped.nombres} ${huesped.apellidos}`,
        edad: huesped.fechaNac ? 
          Math.floor((new Date() - new Date(huesped.fechaNac)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'
      }));
    } catch (error) {
      console.error('Error obteniendo huéspedes filtrados:', error);
      throw error;
    }
  },

  // Obtener estadísticas de huéspedes
  async getHuespedesStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/huespedes`);
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas: ${response.status}`);
      }
      
      const huespedes = await response.json();
      
      const total = huespedes.length;
      const activos = huespedes.filter(h => h.profesion && h.profesion.trim() !== '').length;
      const conDireccion = huespedes.filter(h => h.direccion && h.direccion.trim() !== '').length;
      
      return {
        total,
        activos,
        conDireccion,
        promedioEdad: huespedes.reduce((sum, h) => {
          if (h.fechaNac) {
            const edad = Math.floor((new Date() - new Date(h.fechaNac)) / (365.25 * 24 * 60 * 60 * 1000));
            return sum + edad;
          }
          return sum;
        }, 0) / huespedes.filter(h => h.fechaNac).length || 0
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};


