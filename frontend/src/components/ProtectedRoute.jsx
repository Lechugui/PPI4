// ProtectedRoute.jsx
// Componente para rutas protegidas según rol

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  console.log("ProtectedRoute - user:", user);        //  Debug
  console.log("ProtectedRoute - allowedRoles:", allowedRoles);

  if (!user) {
    // Si no está logueado lo mando a login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role_id)) {
    // Si está logueado pero no tiene permiso lo mando a home
    return <Navigate to="/" replace />;
  }

  // Si está logueado y con rol permitido, renderiza la página
  return children;
};

export default ProtectedRoute;