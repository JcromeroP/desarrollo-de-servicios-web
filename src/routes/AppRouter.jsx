import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "../views/Login";
import Dashboard from "../views/Dashboard";
import ListaReservas from "../views/ListarReservas";
import ListarHabitaciones from "../views/ListarHabitaciones";
import ListaHuespedes from "../views/ListaHuespedes";
import ListaUsuarios from "../views/ListaUsuarios";
import PrivateRoute from "../routes/PrivateRoute";
import Home from "../components/Home";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservas"
          element={
            <PrivateRoute>
              <ListaReservas />
            </PrivateRoute>
          }
        />
        <Route
          path="/habitaciones"
          element={
            <PrivateRoute>
              <ListarHabitaciones />
            </PrivateRoute>
          }
        />
        <Route
          path="/huespedes"
          element={
            <PrivateRoute>
              <ListaHuespedes />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <ListaUsuarios />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
