import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'; 
import { Button, Form, FormGroup, Container, Card, CardBody, Input } from 'reactstrap';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        email: username,
        password: password,
      };
      /* http://ec2-18-189-202-101.us-east-2.compute.amazonaws.com:8081*/
      const response = await axios.post('http://localhost:8080/api/user/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { status, message, data } = response.data;
      
      if (status === 200 || status === 201) {
        decodeToken(data);
      } else if ([400, 403, 401, 404].includes(status)) {
        Swal.fire({
          icon: 'error',
          title: 'Error en el inicio de sesión',
          text: message || 'Por favor inténtalo nuevamente.',
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: error.response?.data?.message || 'Ocurrió un error al intentar iniciar sesión.',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  const decodeToken = (token) => {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    localStorage.setItem('idUser', decodedToken.idUser);
    localStorage.setItem('name', decodedToken.name);
    localStorage.setItem('facultad', decodedToken.facultad);
    localStorage.setItem('programa', decodedToken.programa);
    localStorage.setItem('email', decodedToken.email);
    localStorage.setItem('role', decodedToken.role);

    if (userRole === 'Usuario') {
      navigate("/Home"); 
    }
    if (userRole === 'Admin') {
      navigate("/Administracion");
    }
  };

  return (
    <div className="login-page" style={styles.page}>
      <Container style={styles.container}>
        <Card style={styles.card}>
          <CardBody>
            <h1>Iniciar Sesión</h1>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input 
                  type="email" 
                  className="form-control mt-3" 
                  id="username" 
                  placeholder="Correo electrónico" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Input 
                  type="password" 
                  className="form-control mt-3" 
                  id="inputPassword" 
                  placeholder="Contraseña" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>
              <Button type="submit" color="success">
                Acceder
              </Button>
              <div className="mt-3">
                <a href="/forgot-password" style={{ ...styles.link, display: 'block' }}>
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  card: {
    width: '380px',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  link: {
    color: '#28a745',
    textDecoration: 'none',
  },
};

export default LoginPage;