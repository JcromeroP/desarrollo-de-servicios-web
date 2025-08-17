import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Buscar usuario en la base de datos
      const response = await fetch("http://localhost:8080/api/usuarios");
      
      if (!response.ok) {
        throw new Error("Error al conectar con el backend");
      }

      const usuarios = await response.json();
      
      // Buscar usuario por usuario y clave
      const foundUser = usuarios.find(
        (u) => u.usuario === usuario && u.clave === clave
      );

      if (foundUser) {
        // Mapear el cargo a role
        const role = foundUser.cargo === 'ADMIN' ? 'ADMIN' : 'USER';
        
        const userData = {
          email: foundUser.usuario,
          role: role,
          nombres: foundUser.nombres,
          apellidos: foundUser.apellidos,
          id: foundUser.idEmpleado
        };

        // Usar el contexto de autenticación
        login(userData);

        // Mostrar mensaje de éxito
        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: `Has iniciado sesión como ${role}`,
          confirmButtonColor: "#FF6A00",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: "Usuario o contraseña incorrectos",
          confirmButtonColor: "#FF6A00",
        });
      }
    } catch (error) {
      console.error('Error de login:', error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor. Verifica que esté ejecutándose.",
        confirmButtonColor: "#FF6A00",
      });
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="row w-100 h-100 m-0">
          <div className="col-md-6 d-none d-md-flex bg-orange justify-content-center align-items-center p-0">
            <img src="/img-login.svg" alt="Ilustración" className="img-fluid login-image" />
          </div>

          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div className="form-box">
              <h2 className="fw-bold mb-2">Cuenta registrada</h2>
              <p className="text-muted mb-4">
                Si ya eres miembro puedes iniciar sesión con tu usuario y contraseña
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label">Usuario</label>
                  <input
                    type="text"
                    id="usuario"
                    className="form-control"
                    placeholder="Ingresa tu usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="clave" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    id="clave"
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    required
                  />
                </div>

                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="remember" />
                  <label className="form-check-label" for="remember">
                    Recordarme
                  </label>
                </div>

                <button type="submit" className="btn btn-orange w-100 mb-3">
                  Iniciar sesión
                </button>
              </form>
            </div>
          </div>
        </div>

        <style>{`
          .login-container {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
          }

          .bg-orange {
            background-color: #FF6A00;
          }

          .text-orange {
            color: #FF6A00;
          }

          .btn-orange {
            background-color: #FF6A00;
            color: white;
            border-radius: 999px;
            padding: 10px;
            font-weight: 500;
            border: none;
          }

          .btn-orange:hover {
            background-color: #e65c00;
          }

          .form-box {
            width: 100%;
            max-width: 400px;
            padding: 0 20px;
          }

          .login-image {
            max-height: 90%;
            object-fit: contain;
          }

          @media (max-width: 768px) {
            .bg-orange {
              display: none;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Login;
