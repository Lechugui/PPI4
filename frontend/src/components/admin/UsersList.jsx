import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function UserList() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 📌 Obtener lista de usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al cargar usuarios");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Eliminar usuario
  const deleteUser = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/login/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar usuario");

      // Refrescamos lista quitando el eliminado
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-primary">Usuarios</h2>

      <table className="table w-full bg-base-100 shadow-md rounded-lg">
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
              <td>{u.role_id === 1 ? "Admin" : "Cliente"}</td>
              <td>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => deleteUser(u.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;