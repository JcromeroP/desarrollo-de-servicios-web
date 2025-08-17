import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Dashboard: Iniciando carga de datos...');
        
        const dashboardStats = await dashboardService.getDashboardStats();
        console.log('📊 Dashboard: Datos recibidos:', dashboardStats);
        
        setStats(dashboardStats);
        setError(null);
      } catch (err) {
        console.error('❌ Dashboard: Error cargando datos:', err);
        setError('Error al cargar los datos del dashboard. Por favor, verifica que el backend esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Container className="mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted">Cargando datos del dashboard...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container className="mt-4">
          <Alert variant="danger">
            <Alert.Heading>Error de Conexión</Alert.Heading>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              Asegúrate de que el backend esté ejecutándose en http://localhost:8080
            </p>
          </Alert>
        </Container>
      </Layout>
    );
  }

  

  // Debug: Mostrar estructura de datos
  console.log('🎯 Dashboard: Renderizando con stats:', stats);

  return (
    <Layout>
      <Container className="mt-4" fluid>
        {/* Header del Dashboard */}
        <Row className="mb-4 dashboard-header">
          <Col>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h1 className="h2 mb-0 text-primary">Dashboard del Sistema</h1>
                <p className="text-muted mb-0">
                  Bienvenido al Sistema de Gestión Hotelera
                </p>
              </div>
              <div className="text-right">
                <Badge bg="info" className="px-3 py-2">
                  <i className="fas fa-user-circle me-2"></i>
                  {user?.role || 'Usuario'}
                </Badge>
              </div>
            </div>
          </Col>
        </Row>

       

        {/* Tarjetas de estadísticas principales */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="dashboard-stats-card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)' }}>
              <Card.Body className="text-white">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Reservas</h6>
                    <h2 className="mb-0">{stats?.reservas?.total || 0}</h2>
                    <small className="text-light">Total de reservas</small>
                  </div>
                  <div className="ms-3">
                    <i className="fas fa-calendar-check fa-2x text-white-50"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="dashboard-stats-card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(87deg, #2dce89 0, #2dcecc 100%)' }}>
              <Card.Body className="text-white">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Habitaciones</h6>
                    <h2 className="mb-0">{stats?.habitaciones?.disponibles || 0}</h2>
                    <small className="text-light">Disponibles</small>
                  </div>
                  <div className="ms-3">
                    <i className="fas fa-bed fa-2x text-white-50"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="dashboard-stats-card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(87deg, #fb6340 0, #fbb140 100%)' }}>
              <Card.Body className="text-white">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Huéspedes</h6>
                    <h2 className="mb-0">{stats?.huespedes?.activos || 0}</h2>
                    <small className="text-light">Actualmente hospedados</small>
                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-1">
                        <small className="text-white-50">
                          Total: {stats?.huespedes?.total || 0} | 
                          Nuevos: {stats?.huespedes?.nuevos || 0}
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="ms-3">
                    <i className="fas fa-users fa-2x text-white-50"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="dashboard-stats-card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(87deg, #11cdef 0, #1171ef 100%)' }}>
              <Card.Body className="text-white">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Ingresos</h6>
                    <h2 className="mb-0">${stats?.ingresos?.mesActual?.toLocaleString() || '0'}</h2>
                    <small className="text-light">Este mes</small>
                  </div>
                  <div className="ms-3">
                    <i className="fas fa-dollar-sign fa-2x text-white-50"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Segunda fila de estadísticas */}
        <Row className="mb-4">
          {user?.role === 'ADMIN' && (
            <Col lg={3} md={6} className="mb-3">
              <Card className="dashboard-stats-card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(87deg, #8965e0 0, #9b6bff 100%)' }}>
                <Card.Body className="text-white">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="text-uppercase text-light ls-1 mb-1">Usuarios</h6>
                      <h2 className="mb-0">{stats?.usuarios?.total || 0}</h2>
                      <small className="text-light">Usuarios del sistema</small>
                    </div>
                    <div className="ms-3">
                      <i className="fas fa-user-shield fa-2x text-white-50"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="dashboard-stats-card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(87deg, #f5365c 0, #f56036 100%)' }}>
              <Card.Body className="text-white">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Ocupación</h6>
                    <h2 className="mb-0">
                      {stats?.habitaciones?.total ? 
                        Math.round((stats.habitaciones.ocupadas / stats.habitaciones.total) * 100) : 0}%
                    </h2>
                    <small className="text-light">Tasa de ocupación</small>
                  </div>
                  <div className="ms-3">
                    <i className="fas fa-chart-pie fa-2x text-white-50"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="dashboard-stats-card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(87deg, #2dce89 0, #2dcecc 100%)' }}>
              <Card.Body className="text-white">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Total</h6>
                    <h2 className="mb-0">${stats?.ingresos?.total?.toLocaleString() || '0'}</h2>
                    <small className="text-light">Ingresos totales</small>
                  </div>
                  <div className="ms-3">
                    <i className="fas fa-chart-line fa-2x text-white-50"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="dashboard-stats-card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(87deg, #ffd600 0, #ffed4e 100%)' }}>
              <Card.Body className="text-white">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Promedio</h6>
                    <h2 className="mb-0">
                      ${stats?.reservas?.total ? 
                        Math.round(stats.ingresos.total / stats.reservas.total) : 0}
                    </h2>
                    <small className="text-light">Por reserva</small>
                  </div>
                  <div className="ms-3">
                    <i className="fas fa-calculator fa-2x text-white-50"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Contenido principal */}
        <Row>
          <Col lg={8} className="mb-4">
            <Card className="main-card border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h5 className="h3 mb-0 text-primary">Resumen de Actividad</h5>
                    <p className="text-muted mb-0">Estado actual del sistema</p>
                  </div>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="summary-card d-flex align-items-center p-3 rounded">
                      <div className="flex-shrink-0 me-3">
                        <i className="fas fa-clock text-warning fa-lg"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Reservas Pendientes</h6>
                        <h4 className="mb-0 text-warning">{stats?.reservas?.pendientes || 0}</h4>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="summary-card d-flex align-items-center p-3 rounded">
                      <div className="flex-shrink-0 me-3">
                        <i className="fas fa-door-open text-success fa-lg"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Habitaciones Ocupadas</h6>
                        <h4 className="mb-0 text-success">{stats?.habitaciones?.ocupadas || 0}</h4>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="summary-card d-flex align-items-center p-3 rounded">
                      <div className="flex-shrink-0 me-3">
                        <i className="fas fa-user-plus text-info fa-lg"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Nuevos Huéspedes</h6>
                        <h4 className="mb-0 text-info">{stats?.huespedes?.nuevos || 0}</h4>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="summary-card d-flex align-items-center p-3 rounded">
                      <div className="flex-shrink-0 me-3">
                        <i className="fas fa-chart-line text-primary fa-lg"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Ocupación</h6>
                        <h4 className="mb-0 text-primary">
                          {stats?.habitaciones?.total ? 
                            Math.round((stats.habitaciones.ocupadas / stats.habitaciones.total) * 100) : 0}%
                        </h4>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="mb-4">
            <Card className="main-card border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0">
                <h5 className="h3 mb-0 text-primary">Accesos Rápidos</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-3">
                  <button className="quick-access-btn btn btn-outline-primary btn-lg d-flex align-items-center justify-content-start" onClick={() => navigate('/reservas')}>
                    <i className="fas fa-calendar-plus me-3"></i>
                    Nueva Reserva
                  </button>
                  <button className="quick-access-btn btn btn-outline-success btn-lg d-flex align-items-center justify-content-start" onClick={() => navigate('/habitaciones')}>
                    <i className="fas fa-bed me-3"></i>
                    Gestionar Habitaciones
                  </button>
                  <button className="quick-access-btn btn btn-outline-info btn-lg d-flex align-items-center justify-content-start" onClick={() => navigate('/huespedes')}>
                    <i className="fas fa-user-plus me-3"></i>
                    Registrar Huésped
                  </button>
                  {user?.role === 'ADMIN' && (
                    <button className="quick-access-btn btn btn-outline-warning btn-lg d-flex align-items-center justify-content-start" onClick={() => navigate('/usuarios')}>
                      <i className="fas fa-users-cog me-3"></i>
                      Administrar Usuarios
                    </button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Información del usuario */}
        <Row>
          <Col>
            <Card className="main-card border-0 shadow-sm">
              <Card.Body className="text-center py-4">
                <div className="mb-3">
                  <i className="fas fa-user-circle fa-3x text-primary"></i>
                </div>
                <h4 className="mb-2">Sesión Activa</h4>
                <p className="text-muted mb-3">
                  Has iniciado sesión como: <strong className="text-primary">{user?.role || 'Usuario'}</strong>
                </p>
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="summary-card d-flex align-items-center justify-content-center p-3 rounded">
                      <i className="fas fa-envelope text-muted me-2"></i>
                      <span>{user?.email || 'No disponible'}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Dashboard;
