import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, Container, Row, Col, Alert, Spinner, Modal, Badge, Card
} from 'react-bootstrap';
import Layout from '../components/Layout';
import { usuarioService } from '../services/usuarioService';
import Swal from 'sweetalert2';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [filtros, setFiltros] = useState({
    nombre: '',
    cargo: '',
    dni: '',
    usuario: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    fechaNac: '',
    direccion: '',
    cargo: '',
    usuario: '',
    clave: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Cargar usuarios y estadísticas
  useEffect(() => {
    loadUsuarios();
    loadStats();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAllUsuarios();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar los usuarios. Por favor, verifica que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await usuarioService.getUsuariosStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  // Aplicar filtros
  const aplicarFiltros = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getUsuariosFiltrados(filtros);
      setUsuarios(data);
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
    setFiltros({ nombre: '', cargo: '', dni: '', usuario: '' });
    loadUsuarios();
    setCurrentPage(1);
  };

  // Modal functions
  const handleShowModal = () => {
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      fechaNac: '',
      direccion: '',
      cargo: '',
      usuario: '',
      clave: ''
    });
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (usuario) => {
    setFormData({
      dni: usuario.dni || '',
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      fechaNac: usuario.fechaNac || '',
      direccion: usuario.direccion || '',
      cargo: usuario.cargo || '',
      usuario: usuario.usuario || '',
      clave: '' // No mostramos la clave por seguridad
    });
    setEditMode(true);
    setEditId(usuario.idEmpleado);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.dni || !formData.nombres || !formData.usuario || (!editMode && !formData.clave)) {
      Swal.fire('Error', 'Por favor completa los campos obligatorios', 'error');
      return;
    }

    try {
      if (editMode) {
        await usuarioService.updateUsuario(editId, formData);
        setUsuarios(usuarios.map((u) => (u.idEmpleado === editId ? { ...u, ...formData } : u)));
      } else {
        const newUsuario = await usuarioService.createUsuario(formData);
        setUsuarios([...usuarios, newUsuario]);
      }

      handleCloseModal();
      loadStats();
      Swal.fire('Éxito', `Usuario ${editMode ? 'actualizado' : 'creado'} correctamente.`, 'success');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      Swal.fire('Error', 'Error al guardar el usuario. Revisa la consola para más detalles.', 'error');
    }
  };

  const handleDelete = async (idEmpleado) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await usuarioService.deleteUsuario(idEmpleado);
        setUsuarios(usuarios.filter(u => u.idEmpleado !== idEmpleado));
        loadStats();
        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
      }
    }
  };

  // Paginación
  const totalPages = Math.ceil(usuarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const usuariosPaginados = usuarios.slice(startIndex, startIndex + itemsPerPage);

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

  // Función para obtener badge de cargo
  const getCargoBadge = (cargo) => {
    if (!cargo || cargo.trim() === '') return <Badge bg="secondary">Sin cargo</Badge>;
    return <Badge bg="primary" className="badge-cargo">{cargo.toUpperCase()}</Badge>;
  };

  if (loading && !usuarios.length) {
    return (
      <Layout>
        <Container fluid className="mt-4">
          <div className="loading-container">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Cargando usuarios...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container fluid className="mt-4">
        {/* Header con estadísticas */}
        <div className="usuarios-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="text-white mb-0">
                <i className="fas fa-user-tie me-3"></i>
                Gestión de Usuarios
              </h1>
              <p className="text-white-50 mb-0">Administra todos los usuarios del sistema hotelero</p>
            </Col>
            <Col className="text-end">
              <Button variant="light" size="lg" onClick={handleShowModal}>
                <i className="fas fa-plus me-2"></i>
                Nuevo Usuario
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
                  <p className="stats-label">Total Usuarios</p>
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
                  <p className="stats-label">Con Cargo</p>
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
                    placeholder="Nombre del usuario"
                    value={filtros.nombre}
                    onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Cargo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Cargo del usuario"
                    value={filtros.cargo}
                    onChange={(e) => setFiltros({ ...filtros, cargo: e.target.value })}
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
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre de usuario"
                    value={filtros.usuario}
                    onChange={(e) => setFiltros({ ...filtros, usuario: e.target.value })}
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

        {/* Tabla de usuarios */}
        <Card className="main-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Lista de Usuarios ({usuarios.length})
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
                    <th>Cargo</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosPaginados.map((usuario, index) => (
                    <tr key={usuario.idEmpleado}>
                      <td>{startIndex + index + 1}</td>
                      <td>
                        <strong>{usuario.dni}</strong>
                      </td>
                      <td>
                        <strong>{usuario.nombreCompleto}</strong>
                        <br />
                        <small className="text-muted">
                          {usuario.nombres} {usuario.apellidos}
                        </small>
                      </td>
                      <td>{usuario.fechaNacFormatted}</td>
                      <td>{getEdadBadge(usuario.edad)}</td>
                      <td>
                        {usuario.direccion ? (
                          <span>{usuario.direccion}</span>
                        ) : (
                          <span className="text-muted">Sin dirección</span>
                        )}
                      </td>
                      <td>{getCargoBadge(usuario.cargo)}</td>
                      <td>
                        <Badge bg="secondary" className="badge-usuario">
                          {usuario.usuario}
                        </Badge>
                      </td>
                      <td>
                        <div className="acciones-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(usuario)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(usuario.idEmpleado)}
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
                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, usuarios.length)} de {usuarios.length} usuarios
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

        {/* Modal para Nuevo/Editar Usuario */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-user me-2"></i>
              {editMode ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      placeholder="Número de DNI"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Usuario *</Form.Label>
                    <Form.Control
                      type="text"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleChange}
                      placeholder="Nombre de usuario"
                      required
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
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      placeholder="Nombres del usuario"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      placeholder="Apellidos del usuario"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control
                      type="date"
                      name="fechaNac"
                      value={formData.fechaNac}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      placeholder="Cargo del usuario"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Dirección completa"
                    />
                  </Form.Group>
                </Col>
              </Row>
              {!editMode && (
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Clave *</Form.Label>
                      <Form.Control
                        type="password"
                        name="clave"
                        value={formData.clave}
                        onChange={handleChange}
                        placeholder="Contraseña del usuario"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
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

export default ListaUsuarios;
