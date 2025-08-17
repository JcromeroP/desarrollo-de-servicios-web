import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ borderBottom: "2px solid #007bff", borderRadius: "40px" }}>
      <div className="container-fluid">
        {/* Logo textual */}
        <Link className="navbar-brand me-3" to="/dashboard">
                    <img src="/logo.svg" alt="Logo" width="30" height="30" className="d-inline-block align-text-top me-2"
                      style={{ borderRadius: '40px' }} />
                    AMJ
                  </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {/* Opciones para todos los usuarios */}
            <li className="nav-item">
              <Link className="nav-link" to="/reservas">
                Reservas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/habitaciones">
                Habitaciones
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/huespedes">
                Huéspedes
              </Link>
            </li>

            {/* Opción solo para ADMIN */}
            {user && user.role === 'ADMIN' && (
              <li className="nav-item">
                <Link className="nav-link" to="/usuarios">
                  Usuarios
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Dropdown del usuario */}
        <NavDropdown
          align="end"
          title={
            <div className="d-flex align-items-center">
              <img src="/person-circle.svg" alt="icon user" className="icon-user text-success me-2" />
              <span className="text-dark">{user ? user.email : 'Usuario'}</span>
            </div>
          }
          id="basic-nav-dropdown"
          flip
        >
          <NavDropdown.Item onClick={handleLogout}>
            Cerrar Sesión
          </NavDropdown.Item>
        </NavDropdown>
      </div>
    </nav>
  );
};

export default Navbar;