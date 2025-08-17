import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, Container, Row, Col, Alert, Spinner, Modal, Badge, Card
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { reservaService } from '../services/reservaService';

const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);
  const [showNewReservaModal, setShowNewReservaModal] = useState(false);
  const [showEditReservaModal, setShowEditReservaModal] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    huesped: '',
    habitacion: ''
  });
  const [stats, setStats] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [newReserva, setNewReserva] = useState({
    fechaCheckin: '',
    fechaCheckout: '',
    cantidadDias: 1,
    cantidadPersonas: 2,
    montoTotal: 0,
    idHabitacion: '',
    idHuesped: '',
    idEmpleado: ''
  });

  // Cargar reservas al montar el componente
  useEffect(() => {
    loadReservas();
    loadStats();
  }, []);

  // Función para probar la conexión al backend
  const testBackendConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Probar conexión básica
      const response = await fetch('http://localhost:8080/api/reservas');
      console.log('Respuesta del backend:', response);
      
      if (!response.ok) {
        throw new Error(`Backend respondió con status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      // Si llegamos aquí, la conexión funciona
      setError(null);
      setReservas(data);
      
    } catch (err) {
      console.error('Error de conexión:', err);
      setError(`Error de conexión: ${err.message}. Verifica que el backend esté ejecutándose en http://localhost:8080`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar reservas desde el backend
  const loadReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservaService.getAllReservas();
      setReservas(data);
    } catch (err) {
      console.error('Error cargando reservas:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Error de conexión. Verifica que el backend esté ejecutándose en http://localhost:8080');
      } else {
        setError(`Error al cargar las reservas: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      const data = await reservaService.getReservasStats();
      setStats(data);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  // Aplicar filtros
  const aplicarFiltros = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservaService.getReservasFiltradas(filtros);
      setReservas(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error aplicando filtros:', err);
      setError('Error al aplicar los filtros.');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      fechaDesde: '',
      fechaHasta: '',
      huesped: '',
      habitacion: ''
    });
    loadReservas();
  };

  // Crear nueva reserva
  const handleCreateReserva = async () => {
    try {
      const reservaData = {
        ...newReserva,
        idHabitacion: parseInt(newReserva.idHabitacion),
        idHuesped: parseInt(newReserva.idHuesped),
        idEmpleado: parseInt(newReserva.idEmpleado),
        montoTotal: parseFloat(newReserva.montoTotal)
      };

      await reservaService.createReserva(reservaData);
      setShowNewReservaModal(false);
      setNewReserva({
        fechaCheckin: '',
        fechaCheckout: '',
        cantidadDias: 1,
        cantidadPersonas: 2,
        montoTotal: 0,
        idHabitacion: '',
        idHuesped: '',
        idEmpleado: ''
      });
      loadReservas();
      loadStats();
    } catch (err) {
      console.error('Error creando reserva:', err);
      setError('Error al crear la reserva.');
    }
  };

  // Editar reserva
  const handleEditReserva = async () => {
    try {
      if (!editingReserva) return;

      const reservaData = {
        ...editingReserva,
        idHabitacion: parseInt(editingReserva.idHabitacion),
        idHuesped: parseInt(editingReserva.idHuesped),
        idEmpleado: parseInt(editingReserva.idEmpleado),
        montoTotal: parseFloat(editingReserva.montoTotal)
      };

      await reservaService.updateReserva(editingReserva.idReserva, reservaData);
      setShowEditReservaModal(false);
      setEditingReserva(null);
      loadReservas();
      loadStats();
      setError(null);
    } catch (err) {
      console.error('Error editando reserva:', err);
      setError('Error al editar la reserva.');
    }
  };

  // Abrir modal de edición
  const openEditModal = (reserva) => {
    setEditingReserva({
      ...reserva,
      idHabitacion: reserva.habitacion?.idHabitacion || '',
      idHuesped: reserva.huesped?.idHuesped || '',
      idEmpleado: reserva.usuario?.idEmpleado || ''
    });
    setShowEditReservaModal(true);
  };

  // Eliminar reserva
  const handleDelete = async () => {
    if (!reservaToDelete) return;

    try {
      await reservaService.deleteReserva(reservaToDelete.idReserva);
      setReservas(reservas.filter(r => r.idReserva !== reservaToDelete.idReserva));
      setShowDeleteModal(false);
      setReservaToDelete(null);
      loadStats(); // Recargar estadísticas
    } catch (err) {
      console.error('Error eliminando reserva:', err);
      setError('Error al eliminar la reserva.');
    }
  };

  // Confirmar eliminación
  const confirmDelete = (reserva) => {
    setReservaToDelete(reserva);
    setShowDeleteModal(true);
  };

  // Función para obtener estado de la reserva
  const getEstadoReserva = (reserva) => {
    const today = new Date();
    const checkin = new Date(reserva.fechaCheckin);
    const checkout = new Date(reserva.fechaCheckout);
    
    if (checkin > today) {
      return <Badge bg="warning" className="badge-estado">Pendiente</Badge>;
    } else if (checkout < today) {
      return <Badge bg="secondary" className="badge-estado">Completada</Badge>;
    } else {
      return <Badge bg="success" className="badge-estado">Activa</Badge>;
    }
  };

  // Paginación
  const totalPages = Math.ceil(reservas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const reservasPaginadas = reservas.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  if (loading && !reservas.length) {
    return (
      <Layout>
        <Container fluid className="mt-4">
          <div className="loading-container">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Cargando reservas...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container fluid className="mt-4">
        {/* Header con estadísticas */}
        <div className="reservas-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="text-white mb-0">
                <i className="fas fa-calendar-check me-3"></i>
                Gestión de Reservas
              </h1>
              <p className="text-white-50 mb-0">Administra todas las reservas del hotel</p>
            </Col>
            <Col className="text-end">
              <Button variant="light" size="lg" onClick={() => setShowNewReservaModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Nueva Reserva
              </Button>
            </Col>
          </Row>
        </div>

        {/* Botón de prueba de conexión */}
      

        {/* Tarjetas de estadísticas */}
        {stats && (
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-calendar text-primary"></i>
                  </div>
                  <h3 className="stats-number">{stats.total}</h3>
                  <p className="stats-label">Total Reservas</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-check-circle text-success"></i>
                  </div>
                  <h3 className="stats-number">{stats.activas}</h3>
                  <p className="stats-label">Reservas Activas</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-clock text-warning"></i>
                  </div>
                  <h3 className="stats-number">{stats.pendientes}</h3>
                  <p className="stats-label">Reservas Pendientes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-dollar-sign text-info"></i>
                  </div>
                  <h3 className="stats-number">${stats.ingresos?.toLocaleString()}</h3>
                  <p className="stats-label">Ingresos Totales</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Panel de filtros */}
        <Card className="filtros-card mb-4">
          <Card.Body>
            <h5 className="mb-3">
              <i className="fas fa-filter me-2"></i>
              Filtros de Búsqueda
            </h5>
            <Row>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Fecha Desde</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.fechaDesde}
                    onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Fecha Hasta</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.fechaHasta}
                    onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Huésped</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del huésped"
                    value={filtros.huesped}
                    onChange={(e) => setFiltros({ ...filtros, huesped: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Habitación</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre de la habitación"
                    value={filtros.habitacion}
                    onChange={(e) => setFiltros({ ...filtros, habitacion: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex gap-2 justify-content-end">
                <Button variant="primary" onClick={aplicarFiltros}>
                  <i className="fas fa-search me-2"></i>
                  Aplicar Filtros
                </Button>
                <Button variant="outline-secondary" onClick={limpiarFiltros}>
                  <i className="fas fa-times me-2"></i>
                  Limpiar Filtros
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Alertas de error */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Tabla de reservas */}
        <Card className="main-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Lista de Reservas ({reservas.length})
              </h5>
              <div className="d-flex align-items-center gap-3">
                <Form.Control
                  placeholder="Buscar reservas..."
                  style={{ maxWidth: '300px' }}
                />
                <Form.Select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  style={{ width: 'auto' }}
                >
                  <option value={10}>10 por página</option>
                  <option value={25}>25 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={100}>100 por página</option>
                </Form.Select>
              </div>
            </div>

            <div className="table-container">
              <Table responsive hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Estado</th>
                    <th>Huésped</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Días</th>
                    <th>Habitación</th>
                    <th>Personas</th>
                    <th>Monto</th>
                    <th>Registro</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservasPaginadas.map((reserva, index) => (
                    <tr key={reserva.idReserva}>
                      <td>{startIndex + index + 1}</td>
                      <td>{getEstadoReserva(reserva)}</td>
                      <td>
                        <strong>{reserva.huespedNombre}</strong>
                        <br />
                        <small className="text-muted">
                          DNI: {reserva.huesped?.dni || 'N/A'}
                        </small>
                      </td>
                      <td>{reserva.fechaCheckinFormatted}</td>
                      <td>{reserva.fechaCheckoutFormatted}</td>
                      <td>
                        <Badge bg="info" className="badge-dias">
                          {reserva.cantidadDias}
                        </Badge>
                      </td>
                      <td>
                        <strong>{reserva.habitacionNombre}</strong>
                        <br />
                        <small className="text-muted">
                          {reserva.habitacion?.pisoUbicacion || 'N/A'}
                        </small>
                      </td>
                      <td>
                        <Badge bg="secondary" className="badge-personas">
                          {reserva.cantidadPersonas}
                        </Badge>
                      </td>
                      <td>
                        <strong className="text-success">
                          ${reserva.montoTotal?.toLocaleString()}
                        </strong>
                      </td>
                      <td>{reserva.fechaRegistroFormatted}</td>
                      <td>
                        <small>{reserva.usuarioNombre}</small>
                        <br />
                        <small className="text-muted">
                          {reserva.usuario?.cargo || 'N/A'}
                        </small>
                      </td>
                      <td>
                        <div className="acciones-buttons">
                          <Button variant="outline-primary" size="sm" onClick={() => openEditModal(reserva)}>
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDelete(reserva)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="paginacion-container mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, reservas.length)} de {reservas.length} reservas
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => changePage(currentPage - 1)}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline-primary"}
                        size="sm"
                        onClick={() => changePage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => changePage(currentPage + 1)}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Modal de confirmación de eliminación */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="modal-confirmacion">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-exclamation-triangle text-danger me-2"></i>
              Confirmar Eliminación
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que quieres eliminar la reserva de{' '}
            <strong>{reservaToDelete?.huespedNombre}</strong>?
            <br />
            <small className="text-muted">
              Esta acción no se puede deshacer.
            </small>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <i className="fas fa-trash me-2"></i>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para nueva reserva */}
        <Modal show={showNewReservaModal} onHide={() => setShowNewReservaModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-plus me-2"></i>
              Nueva Reserva
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Check-in *</Form.Label>
                    <Form.Control
                      type="date"
                      value={newReserva.fechaCheckin}
                      onChange={(e) => setNewReserva({ ...newReserva, fechaCheckin: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Check-out *</Form.Label>
                    <Form.Control
                      type="date"
                      value={newReserva.fechaCheckout}
                      onChange={(e) => setNewReserva({ ...newReserva, fechaCheckout: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad de Días</Form.Label>
                    <Form.Control
                      type="number"
                      value={newReserva.cantidadDias}
                      onChange={(e) => setNewReserva({ ...newReserva, cantidadDias: parseInt(e.target.value) })}
                      min="1"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad de Personas</Form.Label>
                    <Form.Control
                      type="number"
                      value={newReserva.cantidadPersonas}
                      onChange={(e) => setNewReserva({ ...newReserva, cantidadPersonas: parseInt(e.target.value) })}
                      min="1"
                      max="10"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Monto Total *</Form.Label>
                    <Form.Control
                      type="number"
                      value={newReserva.montoTotal}
                      onChange={(e) => setNewReserva({ ...newReserva, montoTotal: parseFloat(e.target.value) })}
                      step="0.01"
                      min="0"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Habitación *</Form.Label>
                    <Form.Control
                      type="number"
                      value={newReserva.idHabitacion}
                      onChange={(e) => setNewReserva({ ...newReserva, idHabitacion: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Huésped *</Form.Label>
                    <Form.Control
                      type="number"
                      value={newReserva.idHuesped}
                      onChange={(e) => setNewReserva({ ...newReserva, idHuesped: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Empleado *</Form.Label>
                    <Form.Control
                      type="number"
                      value={newReserva.idEmpleado}
                      onChange={(e) => setNewReserva({ ...newReserva, idEmpleado: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNewReservaModal(false)}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateReserva}>
              <i className="fas fa-save me-2"></i>
              Crear Reserva
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para editar reserva */}
        <Modal show={showEditReservaModal} onHide={() => setShowEditReservaModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-edit me-2"></i>
              Editar Reserva
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Check-in *</Form.Label>
                    <Form.Control
                      type="date"
                      value={editingReserva?.fechaCheckin}
                      onChange={(e) => setEditingReserva({ ...editingReserva, fechaCheckin: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Check-out *</Form.Label>
                    <Form.Control
                      type="date"
                      value={editingReserva?.fechaCheckout}
                      onChange={(e) => setEditingReserva({ ...editingReserva, fechaCheckout: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad de Días</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingReserva?.cantidadDias}
                      onChange={(e) => setEditingReserva({ ...editingReserva, cantidadDias: parseInt(e.target.value) })}
                      min="1"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad de Personas</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingReserva?.cantidadPersonas}
                      onChange={(e) => setEditingReserva({ ...editingReserva, cantidadPersonas: parseInt(e.target.value) })}
                      min="1"
                      max="10"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Monto Total *</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingReserva?.montoTotal}
                      onChange={(e) => setEditingReserva({ ...editingReserva, montoTotal: parseFloat(e.target.value) })}
                      step="0.01"
                      min="0"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Habitación *</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingReserva?.idHabitacion}
                      onChange={(e) => setEditingReserva({ ...editingReserva, idHabitacion: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Huésped *</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingReserva?.idHuesped}
                      onChange={(e) => setEditingReserva({ ...editingReserva, idHuesped: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Empleado *</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingReserva?.idEmpleado}
                      onChange={(e) => setEditingReserva({ ...editingReserva, idEmpleado: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditReservaModal(false)}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleEditReserva}>
              <i className="fas fa-save me-2"></i>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Layout>
  );
};

export default ListaReservas;
