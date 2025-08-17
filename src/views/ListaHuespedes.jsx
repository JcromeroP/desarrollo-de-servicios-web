import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, Container, Row, Col, Alert, Spinner, Modal, Badge, Card
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { huespedService } from '../services/huespedService';

const ListaHuespedes = () => {
  const [huespedes, setHuespedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [filtros, setFiltros] = useState({
    nombre: '',
    profesion: '',
    dni: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [huespedToDelete, setHuespedToDelete] = useState(null);
  const [showNewHuespedModal, setShowNewHuespedModal] = useState(false);
  const [showEditHuespedModal, setShowEditHuespedModal] = useState(false);
  const [editingHuesped, setEditingHuesped] = useState(null);
  const [newHuesped, setNewHuesped] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    fechaNac: '',
    direccion: '',
    profesion: ''
  });
  
  const navigate = useNavigate();

  // Cargar huéspedes y estadísticas
  useEffect(() => {
    loadHuespedes();
    loadStats();
  }, []);

  const loadHuespedes = async () => {
    try {
      setLoading(true);
      const data = await huespedService.getAllHuespedes();
      setHuespedes(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando huéspedes:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Error de conexión. Verifica que el backend esté ejecutándose en http://localhost:8080');
      } else {
        setError(`Error al cargar los huéspedes: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await huespedService.getHuespedesStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  // Aplicar filtros
  const aplicarFiltros = async () => {
    try {
      setLoading(true);
      const data = await huespedService.getHuespedesFiltrados(filtros);
      setHuespedes(data);
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
    setFiltros({ nombre: '', profesion: '', dni: '' });
    loadHuespedes();
    setCurrentPage(1);
  };

  // Confirmar eliminación
  const confirmDelete = (huesped) => {
    setHuespedToDelete(huesped);
    setShowDeleteModal(true);
  };

  // Eliminar huésped
  const handleDelete = async () => {
    try {
      await huespedService.deleteHuesped(huespedToDelete.idHuesped);
      setHuespedes(huespedes.filter(h => h.idHuesped !== huespedToDelete.idHuesped));
      loadStats(); // Recargar estadísticas
      setShowDeleteModal(false);
      setHuespedToDelete(null);
    } catch (err) {
      setError('Error al eliminar el huésped');
    }
  };

  // Crear nuevo huésped
  const handleCreateHuesped = async () => {
    try {
      if (!newHuesped.dni || !newHuesped.nombres) {
        setError('DNI y nombres son campos obligatorios');
        return;
      }

      await huespedService.createHuesped(newHuesped);
      setShowNewHuespedModal(false);
      setNewHuesped({
        dni: '',
        nombres: '',
        apellidos: '',
        fechaNac: '',
        direccion: '',
        profesion: ''
      });
      loadHuespedes();
      loadStats();
    } catch (err) {
      console.error('Error creando huésped:', err);
      setError('Error al crear el huésped.');
    }
  };

  // Editar huésped
  const handleEditHuesped = async () => {
    try {
      if (!editingHuesped) return;

      if (!editingHuesped.dni || !editingHuesped.nombres) {
        setError('DNI y nombres son campos obligatorios');
        return;
      }

      await huespedService.updateHuesped(editingHuesped.idHuesped, editingHuesped);
      setShowEditHuespedModal(false);
      setEditingHuesped(null);
      loadHuespedes();
      loadStats();
      setError(null);
    } catch (err) {
      console.error('Error editando huésped:', err);
      setError('Error al editar el huésped.');
    }
  };

  // Abrir modal de edición
  const openEditModal = (huesped) => {
    setEditingHuesped({
      ...huesped,
      fechaNac: huesped.fechaNac ? huesped.fechaNac.split('T')[0] : ''
    });
    setShowEditHuespedModal(true);
  };

  // Paginación
  const totalPages = Math.ceil(huespedes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const huespedesPaginados = huespedes.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Función para obtener badge de edad
  const getEdadBadge = (edad) => {
    if (edad === 'N/A') return <Badge bg="secondary">N/A</Badge>;
    if (edad < 18) return <Badge bg="warning" className="badge-edad">Menor</Badge>;
    if (edad < 65) return <Badge bg="success" className="badge-edad">Adulto</Badge>;
    return <Badge bg="info" className="badge-edad">Mayor</Badge>;
  };

  // Función para obtener badge de profesión
  const getProfesionBadge = (profesion) => {
    if (!profesion || profesion.trim() === '') return <Badge bg="secondary">Sin profesión</Badge>;
    return <Badge bg="primary" className="badge-profesion">{profesion}</Badge>;
  };

  if (loading && !huespedes.length) {
    return (
      <Layout>
        <Container fluid className="mt-4">
          <div className="loading-container">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Cargando huéspedes...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container fluid className="mt-4">
        {/* Header con estadísticas */}
        <div className="huespedes-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="text-white mb-0">
                <i className="fas fa-users me-3"></i>
                Gestión de Huéspedes
              </h1>
              <p className="text-white-50 mb-0">Administra la información de todos los huéspedes del hotel</p>
            </Col>
            <Col className="text-end">
              <Button variant="light" size="lg" onClick={() => setShowNewHuespedModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Nuevo Huésped
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
                    <i className="fas fa-users text-primary"></i>
                  </div>
                  <h3 className="stats-number">{stats.total}</h3>
                  <p className="stats-label">Total Huéspedes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-briefcase text-success"></i>
                  </div>
                  <h3 className="stats-number">{stats.activos}</h3>
                  <p className="stats-label">Con Profesión</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-map-marker-alt text-info"></i>
                  </div>
                  <h3 className="stats-number">{stats.conDireccion}</h3>
                  <p className="stats-label">Con Dirección</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon">
                    <i className="fas fa-birthday-cake text-warning"></i>
                  </div>
                  <h3 className="stats-number">{Math.round(stats.promedioEdad)}</h3>
                  <p className="stats-label">Edad Promedio</p>
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
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del huésped"
                    value={filtros.nombre}
                    onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Profesión</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Profesión"
                    value={filtros.profesion}
                    onChange={(e) => setFiltros({ ...filtros, profesion: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Número de DNI"
                    value={filtros.dni}
                    onChange={(e) => setFiltros({ ...filtros, dni: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3 d-flex align-items-end">
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

        {/* Tabla de huéspedes */}
        <Card className="main-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Lista de Huéspedes ({huespedes.length})
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
                    <th>DNI</th>
                    <th>Nombre Completo</th>
                    <th>Fecha Nac.</th>
                    <th>Edad</th>
                    <th>Dirección</th>
                    <th>Profesión</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {huespedesPaginados.map((huesped, index) => (
                    <tr key={huesped.idHuesped}>
                      <td>{startIndex + index + 1}</td>
                      <td>
                        <strong>{huesped.dni}</strong>
                      </td>
                      <td>
                        <strong>{huesped.nombreCompleto}</strong>
                        <br />
                        <small className="text-muted">
                          {huesped.nombres} {huesped.apellidos}
                        </small>
                      </td>
                      <td>{huesped.fechaNacFormatted}</td>
                      <td>{getEdadBadge(huesped.edad)}</td>
                      <td>
                        {huesped.direccion ? (
                          <span>{huesped.direccion}</span>
                        ) : (
                          <span className="text-muted">Sin dirección</span>
                        )}
                      </td>
                      <td>{getProfesionBadge(huesped.profesion)}</td>
                      <td>
                        <div className="acciones-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(huesped)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDelete(huesped)}
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
                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, huespedes.length)} de {huespedes.length} huéspedes
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
            ¿Estás seguro de que quieres eliminar al huésped{' '}
            <strong>{huespedToDelete?.nombreCompleto}</strong>?
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

        {/* Modal para nuevo huésped */}
        <Modal show={showNewHuespedModal} onHide={() => setShowNewHuespedModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-user-plus me-2"></i>
              Nuevo Huésped
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>DNI *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Número de DNI"
                      value={newHuesped.dni}
                      onChange={(e) => setNewHuesped({ ...newHuesped, dni: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control
                      type="date"
                      value={newHuesped.fechaNac}
                      onChange={(e) => setNewHuesped({ ...newHuesped, fechaNac: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombres *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombres del huésped"
                      value={newHuesped.nombres}
                      onChange={(e) => setNewHuesped({ ...newHuesped, nombres: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Apellidos del huésped"
                      value={newHuesped.apellidos}
                      onChange={(e) => setNewHuesped({ ...newHuesped, apellidos: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Profesión</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Profesión del huésped"
                      value={newHuesped.profesion}
                      onChange={(e) => setNewHuesped({ ...newHuesped, profesion: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Dirección completa"
                      value={newHuesped.direccion}
                      onChange={(e) => setNewHuesped({ ...newHuesped, direccion: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNewHuespedModal(false)}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateHuesped}>
              <i className="fas fa-save me-2"></i>
              Crear Huésped
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para editar huésped */}
        <Modal show={showEditHuespedModal} onHide={() => setShowEditHuespedModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-edit me-2"></i>
              Editar Huésped
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>DNI *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Número de DNI"
                      value={editingHuesped?.dni || ''}
                      onChange={(e) => setEditingHuesped({ ...editingHuesped, dni: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control
                      type="date"
                      value={editingHuesped?.fechaNac || ''}
                      onChange={(e) => setEditingHuesped({ ...editingHuesped, fechaNac: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombres *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombres del huésped"
                      value={editingHuesped?.nombres || ''}
                      onChange={(e) => setEditingHuesped({ ...editingHuesped, nombres: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Apellidos del huésped"
                      value={editingHuesped?.apellidos || ''}
                      onChange={(e) => setEditingHuesped({ ...editingHuesped, apellidos: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Profesión</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Profesión del huésped"
                      value={editingHuesped?.profesion || ''}
                      onChange={(e) => setEditingHuesped({ ...editingHuesped, profesion: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Dirección completa"
                      value={editingHuesped?.direccion || ''}
                      onChange={(e) => setEditingHuesped({ ...editingHuesped, direccion: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditHuespedModal(false)}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleEditHuesped}>
              <i className="fas fa-save me-2"></i>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Layout>
  );
};

export default ListaHuespedes;
