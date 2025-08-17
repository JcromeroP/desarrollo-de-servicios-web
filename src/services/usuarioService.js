const API_BASE_URL = 'http://localhost:8080/api';

export const usuarioService = {
  // Obtener todos los usuarios
  async getAllUsuarios() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (!response.ok) {
        throw new Error(`Error al obtener usuarios: ${response.status}`);
      }
      const usuarios = await response.json();

      // Formatear los datos para mejor visualización
      return usuarios.map(usuario => ({
        ...usuario,
        fechaNacFormatted: usuario.fechaNac ?
          new Date(usuario.fechaNac).toLocaleDateString('es-ES') : 'N/A',
        nombreCompleto: `${usuario.nombres} ${usuario.apellidos}`,
        edad: usuario.fechaNac ?
          Math.floor((new Date() - new Date(usuario.fechaNac)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A',
        cargoFormatted: usuario.cargo ? usuario.cargo.toUpperCase() : 'N/A'
      }));
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // Obtener usuario por ID
  async getUsuarioById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener usuario: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  // Crear nuevo usuario
  async createUsuario(usuarioData) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      if (!response.ok) {
        throw new Error(`Error al crear usuario: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  },

  // Actualizar usuario
  async updateUsuario(id, usuarioData) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar usuario: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },

  // Eliminar usuario
  async deleteUsuario(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar usuario: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },

  // Obtener usuarios con filtros
  async getUsuariosFiltrados(filtros = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filtros.nombre) {
        queryParams.append('nombre', filtros.nombre);
      }
      if (filtros.cargo) {
        queryParams.append('cargo', filtros.cargo);
      }
      if (filtros.dni) {
        queryParams.append('dni', filtros.dni);
      }
      if (filtros.usuario) {
        queryParams.append('usuario', filtros.usuario);
      }

      const url = `${API_BASE_URL}/usuarios${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al obtener usuarios filtrados: ${response.status}`);
      }

      const usuarios = await response.json();
      return usuarios.map(usuario => ({
        ...usuario,
        fechaNacFormatted: usuario.fechaNac ?
          new Date(usuario.fechaNac).toLocaleDateString('es-ES') : 'N/A',
        nombreCompleto: `${usuario.nombres} ${usuario.apellidos}`,
        edad: usuario.fechaNac ?
          Math.floor((new Date() - new Date(usuario.fechaNac)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A',
        cargoFormatted: usuario.cargo ? usuario.cargo.toUpperCase() : 'N/A'
      }));
    } catch (error) {
      console.error('Error obteniendo usuarios filtrados:', error);
      throw error;
    }
  },

  // Obtener estadísticas de usuarios
  async getUsuariosStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas: ${response.status}`);
      }

      const usuarios = await response.json();

      const total = usuarios.length;
      const porCargo = {};
      const conDireccion = usuarios.filter(u => u.direccion && u.direccion.trim() !== '').length;
      const activos = usuarios.filter(u => u.cargo && u.cargo.trim() !== '').length;

      usuarios.forEach(usuario => {
        const cargo = usuario.cargo || 'Sin cargo';
        porCargo[cargo] = (porCargo[cargo] || 0) + 1;
      });

      return {
        total,
        porCargo,
        conDireccion,
        activos,
        promedioEdad: usuarios.reduce((sum, u) => {
          if (u.fechaNac) {
            const edad = Math.floor((new Date() - new Date(u.fechaNac)) / (365.25 * 24 * 60 * 60 * 1000));
            return sum + edad;
          }
          return sum;
        }, 0) / usuarios.filter(u => u.fechaNac).length || 0
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};






