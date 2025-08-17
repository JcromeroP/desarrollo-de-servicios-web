const API_BASE_URL = 'http://localhost:8080/api';

export const reservaService = {
  // Obtener todas las reservas
  async getAllReservas() {
    try {
      const response = await fetch(`${API_BASE_URL}/reservas`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al obtener reservas: ${response.status}`);
      }
      const reservas = await response.json();

      // Formatear las fechas y datos para mejor visualización
      return reservas.map(reserva => ({
        ...reserva,
        fechaCheckinFormatted: reserva.fechaCheckin ? 
          new Date(reserva.fechaCheckin).toLocaleDateString('es-ES') : 'N/A',
        fechaCheckoutFormatted: reserva.fechaCheckout ? 
          new Date(reserva.fechaCheckout).toLocaleDateString('es-ES') : 'N/A',
        fechaRegistroFormatted: reserva.fechaRegistro ?
          new Date(reserva.fechaRegistro).toLocaleDateString('es-ES') : 'N/A',
        huespedNombre: reserva.huesped ?
          `${reserva.huesped.nombres || ''} ${reserva.huesped.apellidos || ''}`.trim() || 'N/A' : 'N/A',
        habitacionNombre: reserva.habitacion ?
          reserva.habitacion.nombreTematica || 'N/A' : 'N/A',
        usuarioNombre: reserva.usuario ?
          `${reserva.usuario.nombres || ''} ${reserva.usuario.apellidos || ''}`.trim() || 'N/A' : 'N/A'
      }));
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      throw error;
    }
  },

  // Obtener reserva por ID
  async getReservaById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/reservas/${id}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al obtener reserva: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo reserva:', error);
      throw error;
    }
  },

  // Crear nueva reserva
  async createReserva(reservaData) {
    try {
      // Validaciones del lado del cliente
      if (!reservaData.fechaCheckin || !reservaData.fechaCheckout) {
        throw new Error('Las fechas de check-in y check-out son obligatorias');
      }

      if (new Date(reservaData.fechaCheckin) >= new Date(reservaData.fechaCheckout)) {
        throw new Error('La fecha de check-in debe ser anterior a la de check-out');
      }

      if (reservaData.cantidadPersonas <= 0 || reservaData.cantidadPersonas > 10) {
        throw new Error('La cantidad de personas debe estar entre 1 y 10');
      }

      if (reservaData.montoTotal <= 0) {
        throw new Error('El monto total debe ser mayor a 0');
      }

      if (!reservaData.idHabitacion || !reservaData.idHuesped || !reservaData.idEmpleado) {
        throw new Error('Los IDs de habitación, huésped y empleado son obligatorios');
      }

      // Preparar datos para enviar al backend
      const reservaToSend = {
        fechaCheckin: reservaData.fechaCheckin,
        fechaCheckout: reservaData.fechaCheckout,
        cantidadDias: reservaData.cantidadDias || 1,
        cantidadPersonas: reservaData.cantidadPersonas,
        montoTotal: reservaData.montoTotal,
        habitacion: { idHabitacion: parseInt(reservaData.idHabitacion) },
        huesped: { idHuesped: parseInt(reservaData.idHuesped) },
        usuario: { idEmpleado: parseInt(reservaData.idEmpleado) }
      };

      const response = await fetch(`${API_BASE_URL}/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al crear reserva: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creando reserva:', error);
      throw error;
    }
  },

  // Actualizar reserva
  async updateReserva(id, reservaData) {
    try {
      // Validaciones del lado del cliente
      if (!reservaData.fechaCheckin || !reservaData.fechaCheckout) {
        throw new Error('Las fechas de check-in y check-out son obligatorias');
      }

      if (new Date(reservaData.fechaCheckin) >= new Date(reservaData.fechaCheckout)) {
        throw new Error('La fecha de check-in debe ser anterior a la de check-out');
      }

      if (reservaData.cantidadPersonas <= 0 || reservaData.cantidadPersonas > 10) {
        throw new Error('La cantidad de personas debe estar entre 1 y 10');
      }

      if (reservaData.montoTotal <= 0) {
        throw new Error('El monto total debe ser mayor a 0');
      }

      // Preparar datos para enviar al backend
      const reservaToSend = {
        fechaCheckin: reservaData.fechaCheckin,
        fechaCheckout: reservaData.fechaCheckout,
        cantidadDias: reservaData.cantidadDias || 1,
        cantidadPersonas: reservaData.cantidadPersonas,
        montoTotal: reservaData.montoTotal,
        habitacion: { idHabitacion: parseInt(reservaData.idHabitacion) },
        huesped: { idHuesped: parseInt(reservaData.idHuesped) },
        usuario: { idEmpleado: parseInt(reservaData.idEmpleado) }
      };

      const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al actualizar reserva: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      throw error;
    }
  },

  // Eliminar reserva
  async deleteReserva(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al eliminar reserva: ${response.status}`);
      }

      // El backend devuelve 204 (No Content) para eliminaciones exitosas
      return true;
    } catch (error) {
      console.error('Error eliminando reserva:', error);
      throw error;
    }
  },

  // Obtener reservas con filtros
  async getReservasFiltradas(filtros = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filtros.fechaDesde) {
        queryParams.append('fechaDesde', filtros.fechaDesde);
      }
      if (filtros.fechaHasta) {
        queryParams.append('fechaHasta', filtros.fechaHasta);
      }
      if (filtros.huesped) {
        queryParams.append('huesped', filtros.huesped);
      }
      if (filtros.habitacion) {
        queryParams.append('habitacion', filtros.habitacion);
      }

      const url = `${API_BASE_URL}/reservas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al obtener reservas filtradas: ${response.status}`);
      }

      const reservas = await response.json();
      return reservas.map(reserva => ({
        ...reserva,
        fechaCheckinFormatted: reserva.fechaCheckin ? 
          new Date(reserva.fechaCheckin).toLocaleDateString('es-ES') : 'N/A',
        fechaCheckoutFormatted: reserva.fechaCheckout ? 
          new Date(reserva.fechaCheckout).toLocaleDateString('es-ES') : 'N/A',
        fechaRegistroFormatted: reserva.fechaRegistro ?
          new Date(reserva.fechaRegistro).toLocaleDateString('es-ES') : 'N/A',
        huespedNombre: reserva.huesped?.nombres && reserva.huesped?.apellidos ?
          `${reserva.huesped.nombres} ${reserva.huesped.apellidos}` : 'N/A',
        habitacionNombre: reserva.habitacion ?
          reserva.habitacion.nombreTematica || 'N/A' : 'N/A',
        usuarioNombre: reserva.usuario?.nombres && reserva.usuario?.apellidos ?
          `${reserva.usuario.nombres} ${reserva.usuario.apellidos}` : 'N/A',
      }));
    } catch (error) {
      console.error('Error obteniendo reservas filtradas:', error);
      throw error;
    }
  },

  // Obtener estadísticas de reservas
  async getReservasStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/reservas`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al obtener estadísticas: ${response.status}`);
      }

      const reservas = await response.json();
      const today = new Date();
      const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const reservasActivas = reservas.filter(reserva => {
        const checkin = new Date(reserva.fechaCheckin);
        const checkout = new Date(reserva.fechaCheckout);
        return checkin <= currentDate && checkout >= currentDate;
      });

      const reservasPendientes = reservas.filter(reserva => {
        const checkin = new Date(reserva.fechaCheckin);
        return checkin > currentDate;
      });

      const ingresosTotales = reservas.reduce((total, reserva) => {
        return total + (reserva.montoTotal || 0);
      }, 0);

      return {
        total: reservas.length,
        activas: reservasActivas.length,
        pendientes: reservasPendientes.length,
        ingresos: ingresosTotales
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};




