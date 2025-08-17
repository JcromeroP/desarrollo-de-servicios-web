import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';

const Home = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Lógica para el navbar
      if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
      
      // Lógica para el footer
      // Mostrar footer cuando esté cerca del final de la página
      if (currentScrollY + windowHeight >= documentHeight - 100) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Nav */}
      <nav id="navbar" className={`navbar navbar-expand-lg navbar-dark bg-dark fixed-top transition ${showNavbar ? 'top-0' : '-top-100'}`} style={{ transition: 'top 0.4s' }}>
        <div className="container">
          <Link className="navbar-brand me-3" to="/">
            <img src="/logo.svg" alt="Logo" width="30" height="30" className="d-inline-block align-text-top me-2"
              style={{ borderRadius: '40px' }} />
            AMJ
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
            <ul className="navbar-nav mx-auto text-center">
              <li className="nav-item"><Link className="nav-link active" to="/">Inicio</Link></li>
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" href="#" id="serviciosDropdown" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">Servicios</span>
                <ul className="dropdown-menu text-center" aria-labelledby="serviciosDropdown">
                  <li><Link className="dropdown-item" to="#reservas">Reservas</Link></li>
                  <li><Link className="dropdown-item" to="#habitaciones">Habitaciones</Link></li>
                  <li><Link className="dropdown-item" to="#huespedes">Huéspedes</Link></li>
                  <li><Link className="dropdown-item" to="#usuarios">Usuarios</Link></li>
                </ul>
              </li>
              <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="btn btn-outline-warning ms-2" to="/login">Iniciar Sesión</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <br />
      <br />

      <main>
        {/* Div principal de la bienvenida al Sistema */}
        <div className="container py-5">
          <div className="row align-items-center">

            {/* Columna izquierda: Descripción de nuestro sistema*/}
            <div className="col-md-6" data-aos="fade-right">
              <h1 className="mb-4">Sistema de Reservas para Hotel</h1>
              <p className="text-muted text-justify">
                Somos <strong>TECHNOLOGY & INNOVATION (AMJ)</strong> y te damos la bienvenida al sistema de
                reservas
                del hotel, una solución diseñada para optimizar la gestión diaria de tus operaciones hoteleras.
                Este sistema te permitirá gestionar de forma centralizada las reservas, habitaciones, huéspedes
                y
                usuarios de manera rápida y eficaz.
              </p>
              <p className="text-muted text-justify">
                Nuestro objetivo es brindarte una herramienta intuitiva y confiable que facilite el trabajo
                administrativo del personal,
                mejorando así la experiencia del cliente desde el momento de su reserva hasta su salida.
              </p>
              <p className="text-muted text-justify">
                Con este sistema, podrás automatizar tareas, reducir errores manuales, acceder a reportes
                detallados
                y mantener un registro actualizado
                de todas las actividades, lo cual se traduce en mayor productividad y mejor calidad de servicio.
              </p>
            </div>

            {/* Columna derecha: Nuestro logo */}
            <div className="col-md-6" data-aos="fade-left">
              <img src="/logo.svg" alt="Hotel Management System" className="img-fluid shadow bienvenida-img" />
            </div>

          </div>
        </div>
        {/* Div secundario que contiene los Beneficios de nuestro sistema */}
        <div className="container my-5">
          <h2 className="text-center mb-4" data-aos="fade-down">¿Por qué usar nuestro sistema?</h2>

          <div className="row text-center">
            {/* Beneficio 1 - Fácil Gestión*/}
            <div className="col-6 col-md-3 mb-4" data-aos="zoom-in">
              <i className="bi bi-door-open-fill icono text-warning"></i>
              <h5>Fácil Gestión</h5>
              <p>Administra reservas, habitaciones y huéspedes sin complicaciones.</p>
            </div>

            {/* Beneficio 2 - Interfaz Amigable */}
            <div className="col-6 col-md-3 mb-4" data-aos="zoom-in" data-aos-delay="100">
              <i className="bi bi-people-fill icono text-warning"></i>
              <h5>Interfaz Amigable</h5>
              <p>Diseño intuitivo para usuarios con poca experiencia técnica.</p>
            </div>

            {/* Beneficio 3 - Funcionalidades */}
            <div className="col-6 col-md-3 mb-4" data-aos="zoom-in" data-aos-delay="200">
              <i className="bi bi-tools icono text-warning"></i>
              <h5>Funcionalidades Completas</h5>
              <p>Cubre todas las áreas claves de la administración hotelera.</p>
            </div>

            {/* Beneficio 4 - Soporte*/}
            <div className="col-6 col-md-3 mb-4" data-aos="zoom-in" data-aos-delay="300">
              <i className="bi bi-headset icono text-warning"></i>
              <h5>Soporte 24/7</h5>
              <p>Estamos contigo en todo momento para ayudarte.</p>
            </div>

            {/* Beneficio 5 - Reserva */}
            <div className="col-6 col-md-3 mb-4" data-aos="zoom-in" data-aos-delay="400">
              <i className="bi bi-calendar-check-fill icono text-warning"></i>
              <h5>Gestión de Reservas</h5>
              <p>Crea, edita y consulta reservas con disponibilidad en tiempo real.</p>
            </div>

            {/* Beneficio 6 - Habitación */}
            <div className="col-6 col-md-3 mb-4" data-aos="zoom-in" data-aos-delay="500">
              <i className="bi bi-house-door-fill icono text-warning"></i>
              <h5>Control de Habitaciones</h5>
              <p>Organiza categorías, precios y características de cada habitación.</p>
            </div>

            {/* Beneficio 7 - Huésped */}
            <div className="col-6 col-md-3 mb-4" data-aos="zoom-in" data-aos-delay="600">
              <i className="bi bi-person-vcard-fill icono text-warning"></i>
              <h5>Información de Huéspedes</h5>
              <p>Accede rápidamente a datos personales e historial de cada huésped.</p>
            </div>

            {/* Beneficio 8 - Usuario */}
            <div className="col-6 col-md-3 mb-4" data-aos="zoom-in" data-aos-delay="700">
              <i className="bi bi-person-gear icono text-warning"></i>
              <h5>Administración de Usuarios</h5>
              <p>Define roles, permisos y controla accesos al sistema de forma segura.</p>
            </div>
          </div>
        </div>


        {/* Sección Reservas */}
        <section id="reservas" className="container my-5" data-aos="fade-right">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0 text-center">
              <div className="section-icon-container">
                <img src="/reserva.svg" alt="Reservas" className="section-image" />
              </div>
            </div>
            <div className="col-md-6">
              <h2>Gestión de Reservas</h2>
              <p className="text-muted text-justify mb-3">
                Nuestro sistema de gestión de reservas te permite administrar de manera eficiente todas las
                reservaciones del hotel.
                Crea nuevas reservas con información detallada de los huéspedes, incluyendo fechas de llegada y
                salida,
                tipo de habitación preferida y servicios adicionales solicitados.
              </p>
              <p className="text-muted text-justify mb-3">
                El sistema incluye funcionalidades avanzadas como verificación de disponibilidad en tiempo real,
                gestión de cancelaciones y modificaciones, así como la generación automática de confirmaciones
                por email.
                También podrás visualizar el calendario de ocupación, gestionar reservas grupales y mantener un
                historial completo de todas las transacciones.
              </p>
              <p className="text-muted text-justify">
                Con nuestra herramienta de gestión de reservas, optimizarás el proceso de reservación,
                reducirás errores manuales y mejorarás significativamente la experiencia tanto del personal
                como de los huéspedes.
              </p>
            </div>
          </div>
        </section>

        {/* Sección Habitaciones */}
        <section id="habitaciones" className="container my-5" data-aos="fade-left">
          <div className="row align-items-center flex-md-row-reverse">
            <div className="col-md-6 mb-4 mb-md-0 text-center">
              <div className="section-icon-container">
                <img src="/habitacion.svg" alt="Habitaciones" className="section-image" />
              </div>
            </div>
            <div className="col-md-6">
              <h2>Gestión de Habitaciones</h2>
              <p className="text-muted text-justify mb-3">
                El módulo de gestión de habitaciones te proporciona control total sobre el inventario de tu
                hotel.
                Administra diferentes tipos de habitaciones con sus características específicas, precios por
                temporada,
                servicios incluidos y estado de mantenimiento. Cada habitación puede ser configurada con fotos,
                descripciones detalladas y amenidades disponibles.
              </p>
              <p className="text-muted text-justify mb-3">
                El sistema te permite gestionar la disponibilidad en tiempo real, programar mantenimiento
                preventivo,
                controlar el estado de limpieza y asignar habitaciones según las preferencias de los huéspedes.
                También incluye herramientas para optimizar la ocupación, gestionar upgrades y mantener un
                registro detallado del uso de cada habitación.
              </p>
              <p className="text-muted text-justify">
                Con esta funcionalidad, maximizarás la rentabilidad de tus habitaciones,
                mejorarás la satisfacción del cliente y optimizarás los procesos operativos
                de tu establecimiento hotelero.
              </p>
            </div>
          </div>
        </section>

        {/* Sección Huéspedes */}
        <section id="huespedes" className="container my-5" data-aos="fade-right">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0 text-center">
              <div className="section-icon-container">
                <img src="/Huesped.svg" alt="Huéspedes" className="section-image" />
              </div>
            </div>
            <div className="col-md-6">
              <h2>Gestión de Huéspedes</h2>
              <p className="text-muted text-justify mb-3">
                Nuestra plataforma de gestión de huéspedes te permite mantener una base de datos completa y
                actualizada de todos los clientes. Registra información detallada incluyendo datos personales,
                preferencias de habitación, historial de estancias anteriores, comentarios y calificaciones.
                El sistema también gestiona información de contacto, documentos de identidad y datos de
                facturación.
              </p>
              <p className="text-muted text-justify mb-3">
                Con esta herramienta podrás crear perfiles de huéspedes frecuentes, implementar programas de
                fidelización, gestionar solicitudes especiales y mantener un historial completo de
                interacciones.
                El sistema incluye funcionalidades para segmentar clientes, generar reportes de satisfacción
                y automatizar comunicaciones personalizadas según las preferencias de cada huésped.
              </p>
              <p className="text-muted text-justify">
                Esta gestión integral de huéspedes te permitirá ofrecer un servicio personalizado,
                aumentar la fidelización de clientes y mejorar significativamente la experiencia
                de hospedaje en tu establecimiento.
              </p>
            </div>
          </div>
        </section>

        {/* Sección Usuarios */}
        <section id="usuarios" className="container my-5" data-aos="fade-left">
          <div className="row align-items-center flex-md-row-reverse">
            <div className="col-md-6 mb-4 mb-md-0 text-center">
              <div className="section-icon-container">
                <img src="/admin-usuarios.svg" alt="Usuarios" className="section-image" />
              </div>
            </div>
            <div className="col-md-6">
              <h2>Gestión de Usuarios</h2>
              <p className="text-muted text-justify mb-3">
                El módulo de administración de usuarios te proporciona control total sobre el acceso y permisos
                del personal en el sistema. Crea cuentas de usuario con diferentes niveles de acceso según
                las responsabilidades de cada empleado. Define roles específicos como recepcionistas,
                gerentes, personal de limpieza y administradores del sistema.
              </p>
              <p className="text-muted text-justify mb-3">
                El sistema incluye funcionalidades avanzadas de seguridad como autenticación de dos factores,
                registro de actividades, gestión de sesiones activas y políticas de contraseñas. También
                permite configurar permisos granulares para diferentes módulos del sistema, crear grupos
                de usuarios y establecer horarios de acceso según las necesidades operativas del hotel.
              </p>
              <p className="text-muted text-justify">
                Con esta herramienta de gestión de usuarios, garantizarás la seguridad de la información,
                optimizarás los procesos de trabajo y mantendrás un control efectivo sobre las operaciones
                de tu establecimiento hotelero.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Espacio para evitar que el footer fijo tape el contenido */}
      <div style={{ height: '80px' }}></div>

      {/* Footer del proyecto*/}
      <footer 
        className={`bg-dark text-white text-center py-4 mt-5 transition ${showFooter ? 'footer-visible' : 'footer-hidden'}`} 
        data-aos="fade-up"
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transform: showFooter ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <p className="mb-0">© 2025 AMJ - TECHNOLOGY & INNOVATION - Todos los derechos reservados</p>
      </footer>
    </>
  );
};

export default Home;
