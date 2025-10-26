import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function AdminPage() {
  const { user, logout } = useAuth();
  const navigate =useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.role_id !== 1) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-base-200">
        <h1 className="text-2xl font-bold text-error">Acceso denegado</h1>
        <p className="text-gray-500 mt-2">No tienes permisos para ver esta página.</p>
        <Link to="/" className="btn btn-primary mt-4">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {/* boton nuevo para volver al inicio desde el panel de adm */}
          <Link to="/" className="btn btn-primary">
            Inicio
          </Link>

          <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
        </div>

        <button className="btn btn-error" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gestionar reservas */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-primary">Reservas</h2>
            <p className="text-gray-500">Administra todas las reservas del sistema.</p>
            <Link to="/admin/reservations" className="btn btn-primary">Ver reservas</Link>
          </div>
        </div>

        {/* Gestionar usuarios */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-primary">Usuarios</h2>
            <p className="text-gray-500">Gestiona los usuarios registrados en la plataforma.</p>
            <Link to="/admin/users" className="btn btn-primary">Ver usuarios</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
