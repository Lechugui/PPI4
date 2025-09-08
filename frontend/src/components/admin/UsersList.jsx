import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://127.0.0.1:8000";

function UsersList() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API_URL}/login/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // Si aún no creaste el endpoint en el backend, verás este mensaje.
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
      setErr("No pude cargar los usuarios (¿endpoint /login/users creado?).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Eliminar este usuario?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/login/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          msg = j.detail || msg;
        } catch {}
        throw new Error(msg);
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error(e);
      alert(`Error eliminando: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Usuarios</h1>
        <div className="flex gap-2">
          <Link to="/admin" className="btn">Volver al panel</Link>
          <Link to="/admin/users/new" className="btn btn-primary">
            Nuevo usuario
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : err ? (
        <div className="alert alert-error">{err}</div>
      ) : users.length === 0 ? (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p>No hay usuarios.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto card bg-base-100 shadow">
          <div className="card-body p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.role_id ?? u.role?.id ?? "-"}</td>
                    <td className="flex gap-2">
                      {/* Editar lo implementamos luego */}
                      <button className="btn btn-sm" disabled>
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(u.id)}
                        disabled={currentUser?.id === u.id} // evitar borrarse a uno mismo
                        title={
                          currentUser?.id === u.id
                            ? "No podés eliminar tu propio usuario"
                            : "Eliminar"
                        }
                      >
                        Eliminar
                      </button>
                      <Link
                        to={`/admin/users/${u.id}/reservas`}
                        className="btn btn-sm btn-outline"
                        title="Ver historial de reservas"
                      >
                        Historial
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersList;