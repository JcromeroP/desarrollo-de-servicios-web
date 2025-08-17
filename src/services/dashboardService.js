const API_BASE_URL = 'http://localhost:8080/api';
export const dashboardService = {
  // Obtener estadísticas generales del dashboard
  async getDashboardStats() {
    try {
      console.log('🔄 Iniciando obtención de estadísticas del dashboard...');
      
      // Obtener todas las reservas
      const reservasResponse = await fetch(`${API_BASE_URL}/reservas`);
      if (!reservasResponse.ok) {
        throw new Error(`Error al obtener reservas: ${reservasResponse.status}`);
      }
      const reservas = await reservasResponse.json();
      console.log('📊 Reservas obtenidas:', reservas.length);
      
      // Obtener todas las habitaciones
      const habitacionesResponse = await fetch(`${API_BASE_URL}/habitaciones`);
      if (!habitacionesResponse.ok) {
        throw new Error(`Error al obtener habitaciones: ${habitacionesResponse.status}`);
      }
      const habitaciones = await habitacionesResponse.json();
      console.log('🏨 Habitaciones obtenidas:', habitaciones.length);
      
      // Obtener todos los huéspedes
      const huespedesResponse = await fetch(`${API_BASE_URL}/huespedes`);
      if (!huespedesResponse.ok) {
        throw new Error(`Error al obtener huéspedes: ${huespedesResponse.status}`);
      }
      const huespedes = await huespedesResponse.json();
      console.log('👥 Huéspedes obtenidos:', huespedes.length);
      
      // Obtener todos los usuarios
      const usuariosResponse = await fetch(`${API_BASE_URL}/usuarios`);
      if (!usuariosResponse.ok) {
        throw new Error(`Error al obtener usuarios: ${usuariosResponse.status}`);
      }
      const usuarios = await usuariosResponse.json();
      console.log('👤 Usuarios obtenidos:', usuarios.length);

      // Calcular estadísticas
      const today = new Date();
      const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Reservas
      const reservasActivas = reservas.filter(reserva => {
        if (!reserva.fechaCheckin || !reserva.fechaCheckout) return false;
        const checkin = new Date(reserva.fechaCheckin);
        const checkout = new Date(reserva.fechaCheckout);
        return checkin <= currentDate && checkout >= currentDate;
      });

      const reservasPendientes = reservas.filter(reserva => {
        if (!reserva.fechaCheckin) return false;
        const checkin = new Date(reserva.fechaCheckin);
        return checkin > currentDate;
      });

      console.log('📅 Reservas activas:', reservasActivas.length);
      console.log('⏳ Reservas pendientes:', reservasPendientes.length);

      // Habitaciones
      const habitacionesDisponibles = habitaciones.filter(habitacion => {
        const habitacionOcupada = reservasActivas.some(reserva => {
          // Verificar si la reserva tiene habitación y si coincide
          if (!reserva.habitacion) return false;
          if (typeof reserva.habitacion === 'object' && reserva.habitacion.idHabitacion) {
            return reserva.habitacion.idHabitacion === habitacion.idHabitacion;
          }
          // Si habitacion es solo un ID
          if (typeof reserva.habitacion === 'number') {
            return reserva.habitacion === habitacion.idHabitacion;
          }
          return false;
        });
        return !habitacionOcupada;
      });

      const habitacionesOcupadas = habitaciones.filter(habitacion => {
        const habitacionOcupada = reservasActivas.some(reserva => {
          if (!reserva.habitacion) return false;
          if (typeof reserva.habitacion === 'object' && reserva.habitacion.idHabitacion) {
            return reserva.habitacion.idHabitacion === habitacion.idHabitacion;
          }
          if (typeof reserva.habitacion === 'number') {
            return reserva.habitacion === habitacion.idHabitacion;
          }
          return false;
        });
        return habitacionOcupada;
      });

      console.log('🚪 Habitaciones disponibles:', habitacionesDisponibles.length);
      console.log('🔒 Habitaciones ocupadas:', habitacionesOcupadas.length);

      // Huéspedes activos (con reservas activas)
      const huespedesActivos = [...new Set(reservasActivas.map(reserva => {
        if (!reserva.huesped) return null;
        
        // Si huesped es un objeto con idHuesped
        if (typeof reserva.huesped === 'object' && reserva.huesped.idHuesped) {
          return reserva.huesped.idHuesped;
        }
        
        // Si huesped es solo un ID
        if (typeof reserva.huesped === 'number') {
          return reserva.huesped;
        }
        
        return null;
      }))].filter(id => id !== null);

      console.log('👥 Huéspedes activos (IDs únicos):', huespedesActivos.length);

      // Nuevos huéspedes (registrados en el último mes)
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      const nuevosHuespedes = huespedes.filter(huesped => {
        // Buscar la primera reserva de este huésped
        const primeraReserva = reservas.find(reserva => {
          if (!reserva.huesped) return false;
          
          let reservaHuespedId;
          if (typeof reserva.huesped === 'object' && reserva.huesped.idHuesped) {
            reservaHuespedId = reserva.huesped.idHuesped;
          } else if (typeof reserva.huesped === 'number') {
            reservaHuespedId = reserva.huesped;
          } else {
            return false;
          }
          
          return reservaHuespedId === huesped.idHuesped;
        });
        
        if (primeraReserva && primeraReserva.fechaRegistro) {
          const fechaReserva = new Date(primeraReserva.fechaRegistro);
          return fechaReserva >= lastMonth;
        }
        return false;
      });

      console.log('🆕 Nuevos huéspedes:', nuevosHuespedes.length);

      // Calcular ingresos totales
      const ingresosTotales = reservas.reduce((total, reserva) => {
        return total + (reserva.montoTotal || 0);
      }, 0);

      // Calcular ingresos del mes actual
      const ingresosMesActual = reservas.filter(reserva => {
        if (!reserva.fechaRegistro) return false;
        const fechaReserva = new Date(reserva.fechaRegistro);
        return fechaReserva.getMonth() === today.getMonth() && 
               fechaReserva.getFullYear() === today.getFullYear();
      }).reduce((total, reserva) => {
        return total + (reserva.montoTotal || 0);
      }, 0);

      const stats = {
        reservas: {
          total: reservas.length,
          activas: reservasActivas.length,
          pendientes: reservasPendientes.length
        },
        habitaciones: {
          total: habitaciones.length,
          disponibles: habitacionesDisponibles.length,
          ocupadas: habitacionesOcupadas.length
        },
        huespedes: {
          total: huespedes.length,
          activos: huespedesActivos.length,
          nuevos: nuevosHuespedes.length
        },
        usuarios: {
          total: usuarios.length,
          admin: usuarios.filter(u => u.cargo === 'ADMIN').length,
          staff: usuarios.filter(u => u.cargo !== 'ADMIN').length
        },
        ingresos: {
          total: ingresosTotales,
          mesActual: ingresosMesActual
        }
      };

      console.log('✅ Estadísticas calculadas:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del dashboard:', error);
      throw error;
    }
  },

  // Obtener reservas recientes
  async getReservasRecientes(limit = 5) {
    try {
      const response = await fetch(`${API_BASE_URL}/reservas`);
      if (!response.ok) {
        throw new Error(`Error al obtener reservas: ${response.status}`);
      }
      const reservas = await response.json();
      
      // Ordenar por fecha de registro (más recientes primero)
      const reservasOrdenadas = reservas
        .filter(reserva => reserva.fechaRegistro)
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
        .slice(0, limit);

      return reservasOrdenadas;
    } catch (error) {
      console.error('Error obteniendo reservas recientes:', error);
      throw error;
    }
  },

  // Obtener habitaciones con estado
  async getHabitacionesConEstado() {
    try {
      const [habitacionesResponse, reservasResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/habitaciones`),
        fetch(`${API_BASE_URL}/reservas`)
      ]);
      
      if (!habitacionesResponse.ok || !reservasResponse.ok) {
        throw new Error('Error al obtener datos de habitaciones o reservas');
      }
      
      const habitaciones = await habitacionesResponse.json();
      const reservas = await reservasResponse.json();
      
      const today = new Date();
      const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      return habitaciones.map(habitacion => {
        const reservaActiva = reservas.find(reserva => {
          if (!reserva.habitacion) return false;
          
          let reservaHabitacionId;
          if (typeof reserva.habitacion === 'object' && reserva.habitacion.idHabitacion) {
            reservaHabitacionId = reserva.habitacion.idHabitacion;
          } else if (typeof reserva.habitacion === 'number') {
            reservaHabitacionId = reserva.habitacion;
          } else {
            return false;
          }
          
          return reservaHabitacionId === habitacion.idHabitacion &&
                 reserva.fechaCheckin && reserva.fechaCheckout &&
                 new Date(reserva.fechaCheckin) <= currentDate &&
                 new Date(reserva.fechaCheckout) >= currentDate;
        });

        return {
          ...habitacion,
          estado: reservaActiva ? 'Ocupada' : 'Disponible',
          reservaActiva: reservaActiva || null
        };
      });
    } catch (error) {
      console.error('Error obteniendo habitaciones con estado:', error);
      throw error;
    }
  },

  // Obtener estadísticas de ocupación por mes
  async getEstadisticasOcupacion() {
    try {
      const response = await fetch(`${API_BASE_URL}/reservas`);
      if (!response.ok) {
        throw new Error(`Error al obtener reservas: ${response.status}`);
      }
      const reservas = await response.json();
      
      const today = new Date();
      const meses = [];
      
      // Generar datos para los últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const mes = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const nombreMes = mes.toLocaleDateString('es-ES', { month: 'short' });
        
        const reservasDelMes = reservas.filter(reserva => {
          if (!reserva.fechaCheckin) return false;
          const fechaReserva = new Date(reserva.fechaCheckin);
          return fechaReserva.getMonth() === mes.getMonth() && 
                 fechaReserva.getFullYear() === mes.getFullYear();
        });
        
        meses.push({
          mes: nombreMes,
          reservas: reservasDelMes.length,
          ingresos: reservasDelMes.reduce((total, r) => total + (r.montoTotal || 0), 0)
        });
      }
      
      return meses;
    } catch (error) {
      console.error('Error obteniendo estadísticas de ocupación:', error);
      throw error;
    }
  }
};
