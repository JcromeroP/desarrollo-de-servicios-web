import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, Container, Row, Col, Alert, Spinner, Modal, Badge, Card
} from 'react-bootstrap';
import Layout from '../components/Layout';
import { habitacionService } from '../services/habitacionService';
import Swal from 'sweetalert2';

const ListaHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [filtros, setFiltros] = useState({
    nombre: '',
    tipo: '',
    piso: '',
    precioMin: '',
    precioMax: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombreTematica: '',
    pisoUbicacion: '',
    precioNoche: '',
    tipo: {
      idTipo: null,
      nombreTipo: '',
    },
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Cargar habitaciones, tipos y estadísticas
  useEffect(() => {
    loadHabitaciones();
    loadTiposHabitacion();
    loadStats();
  }, []);

  const loadHabitaciones = async () => {
    try {
      setLoading(true);
      const data = await habitacionService.getAllHabitaciones();
      setHabitaciones(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando habitaciones:', err);
      setError('Error al cargar las habitaciones. Por favor, verifica que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const loadTiposHabitacion = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tipos');
      if (response.ok) {
        const data = await response.json();
        setTiposHabitacion(data);
      }
    } catch (err) {
      console.error('Error cargando tipos de habitación:', err);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await habitacionService.getHabitacionesStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  // Aplicar filtros
  const aplicarFiltros = async () => {
    try {
      setLoading(true);
      const data = await habitacionService.getHabitacionesFiltradas(filtros);
      setHabitaciones(data);
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      setError('Error al aplicar los filtros');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({ nombre: '', tipo: '', piso: '', precioMin: '', precioMax: '' });
    loadHabitaciones();
    setCurrentPage(1);
  };

  // Modal functions
  const handleShowModal = () => {
    setFormData({
      nombreTematica: '',
      pisoUbicacion: '',
      precioNoche: '',
      tipo: {
        idTipo: null,
        nombreTipo: '',
      },
    });
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (habitacion) => {
    const tipo = habitacion.tipo || { idTipo: null, nombreTipo: '' };
    setFormData({
      nombreTematica: habitacion.nombreTematica || '',
      pisoUbicacion: habitacion.pisoUbicacion || '',
      precioNoche: habitacion.precioNoche || '',
      tipo: {
        idTipo: tipo.idTipo,
        nombreTipo: tipo.nombreTipo,
      },
    });
    setEditMode(true);
    setEditId(habitacion.idHabitacion);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== 'tipo') {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTipoChange = (e) => {
    const idTipo = parseInt(e.target.value);
    const tipoSeleccionado = tiposHabitacion.find((t) => t.idTipo === idTipo) || { idTipo: null, nombreTipo: '' };
    setFormData({ ...formData, tipo: tipoSeleccionado });
  };

  const handleSubmit = async () => {
    if (
      !formData.nombreTematica ||
      !formData.pisoUbicacion ||
      !formData.precioNoche ||
      !formData.tipo.idTipo
    ) {
      Swal.fire('Error', 'Por favor completa todos los campos, incluyendo el tipo de habitación.', 'error');
      return;
    }

    try {
      const bodyToSend = {
        ...formData,
        precioNoche: parseFloat(formData.precioNoche),
        tipo: { idTipo: formData.tipo.idTipo }
      };

      if (editMode) {
        await habitacionService.updateHabitacion(editId, bodyToSend);
        setHabitaciones(habitaciones.map((h) => (h.idHabitacion === editId ? { ...h, ...bodyToSend } : h)));
      } else {
        const newHabitacion = await habitacionService.createHabitacion(bodyToSend);
        setHabitaciones([...habitaciones, newHabitacion]);
      }

      handleCloseModal();
      loadStats();
      Swal.fire('Éxito', `Habitación ${editMode ? 'actualizada' : 'creada'} correctamente.`, 'success');
    } catch (error) {
      console.error('Error al guardar habitación:', error);
      Swal.fire('Error', 'Error al guardar la habitación. Revisa la consola para más detalles.', 'error');
    }
  };

  const handleDelete = async (idHabitacion) => {
    const result = await Swal.fire({
      title: '¿Seguro que quieres eliminar esta habitación?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await habitacionService.deleteHabitacion(idHabitacion);
        setHabitaciones(habitaciones.filter(h => h.idHabitacion !== idHabitacion));
        loadStats();
        Swal.fire('Eliminado', 'La habitación ha sido eliminada.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar la habitación.', 'error');
      }
    }
  };

  // Paginación
  const totalPages = Math.ceil(habitaciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const habitacionesPaginadas = habitaciones.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Función para obtener badge de piso
  const getPisoBadge = (piso) => {
    if (!piso) return <Badge bg="secondary">Sin piso</Badge>;
    return <Badge bg="info" className="badge-piso">{piso}</Badge>;
  };

  // Función para obtener badge de tipo
  const getTipoBadge = (tipo) => {
    if (!tipo || !tipo.nombreTipo) return <Badge bg="secondary">Sin tipo</Badge>;
    return <Badge bg="primary" className="badge-tipo">{tipo.nombreTipo}</Badge>;
  };

  if (loading && !habitaciones.length) {
    return (
      <Layout>
        <Container fluid className="mt-4">
          <div className="loading-container">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Cargando habitaciones...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container fluid className="mt-4">
        {/* Header con estadísticas */}
        <div className="habitaciones-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="text-white mb-0">
                <i className="fas fa-bed me-3"></i>
                Gestión de Habitaciones
              </h1>
              <p className="text-white-50 mb-0">Administra todas las habitaciones del hotel</p>
            </Col>
            <Col className="text-end">
              <Button variant="light" size="lg" onClick={handleShowModal}>
                <i className="fas fa-plus me-2"></i>
                Nueva Habitación
              </Button>
            </Col>
          </Row>
        </div>

        {/* Tarjetas de estadísticas */}
        {stats && (
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-bed text-primary"></i>
                  </div>
                  <h3 className="stats-number">{stats.total}</h3>
                  <p className="stats-label">Total Habitaciones</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-building text-success"></i>
                  </div>
                  <h3 className="stats-number">{Object.keys(stats.porPiso).length}</h3>
                  <p className="stats-label">Pisos Diferentes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-tags text-info"></i>
                  </div>
                  <h3 className="stats-number">{Object.keys(stats.porTipo).length}</h3>
                  <p className="stats-label">Tipos Diferentes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-dollar-sign text-warning"></i>
                  </div>
                  <h3 className="stats-number">${Math.round(stats.promedioPrecio).toLocaleString()}</h3>
                  <p className="stats-label">Precio Promedio</p>
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
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre temático"
                    value={filtros.nombre}
                    onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tipo de habitación"
                    value={filtros.tipo}
                    onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Piso</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Número de piso"
                    value={filtros.piso}
                    onChange={(e) => setFiltros({ ...filtros, piso: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Precio Mín</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Precio mínimo"
                    value={filtros.precioMin}
                    onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Precio Máx</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Precio máximo"
                    value={filtros.precioMax}
                    onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3 d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <Button variant="primary" onClick={aplicarFiltros} className="flex-fill">
                    <i className="fas fa-search me-2"></i>
                    Aplicar
                  </Button>
                  <Button variant="outline-secondary" onClick={limpiarFiltros}>
                    <i className="fas fa-times me-2"></i>
                    Limpiar
                  </Button>
                </div>
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

        {/* Tabla de habitaciones */}
        <Card className="main-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Lista de Habitaciones ({habitaciones.length})
              </h5>
              <div className="d-flex align-items-center gap-3">
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
                    <th>Nombre Temático</th>
                    <th>Tipo de Habitación</th>
                    <th>Piso</th>
                    <th>Precio por Noche</th>
                    <th>Capacidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {habitacionesPaginadas.map((hab, index) => (
                    <tr key={hab.idHabitacion}>
                      <td>{startIndex + index + 1}</td>
                      <td>
                        <strong>{hab.nombreTematica}</strong>
                      </td>
                      <td>{getTipoBadge(hab.tipo)}</td>
                      <td>{getPisoBadge(hab.pisoUbicacion)}</td>
                      <td>
                        <strong className="text-success">
                          ${hab.precioNoche?.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <Badge bg="secondary" className="badge-capacidad">
                          {hab.capacidad && hab.capacidad !== 'N/A' ? `${hab.capacidad} personas` : 'N/A'}
                        </Badge>
                      </td>
                      <td>
                        <div className="acciones-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(hab)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(hab.idHabitacion)}
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
                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, habitaciones.length)} de {habitaciones.length} habitaciones
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

        {/* Modal para Nueva/Editar Habitación */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-bed me-2"></i>
              {editMode ? 'Editar Habitación' : 'Nueva Habitación'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre Temático</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombreTematica"
                      value={formData.nombreTematica}
                      onChange={handleChange}
                      placeholder="Ej: Habitación Marina, Suite Presidencial"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Piso</Form.Label>
                    <Form.Control
                      type="text"
                      name="pisoUbicacion"
                      value={formData.pisoUbicacion}
                      onChange={handleChange}
                      placeholder="Ej: 1, 2, 3..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio por Noche</Form.Label>
                    <Form.Control
                      type="number"
                      name="precioNoche"
                      value={formData.precioNoche}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Habitación</Form.Label>
                    <Form.Select
                      name="tipo"
                      value={formData.tipo?.idTipo || ''}
                      onChange={handleTipoChange}
                    >
                      <option value="">Seleccione Tipo</option>
                      {tiposHabitacion.map((t) => (
                        <option key={t.idTipo} value={t.idTipo}>
                          {t.nombreTipo}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              <i className="fas fa-save me-2"></i>
              {editMode ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Layout>
  );
};

export default ListaHabitaciones;
