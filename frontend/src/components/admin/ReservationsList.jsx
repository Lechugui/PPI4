import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ReservationsList = () => {
  const { token } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://127.0.0.1:8000/reservations/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "No se pudieron cargar las reservas");
        }

        const data = await res.json();
        setReservas(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [token]);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Reservas</h1>
        <Link to="/adminPage" className="btn btn-outline">Volver</Link>
      </header>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {loading && (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && reservas.length === 0 && (
            <p className="text-base-content/70">No hay reservas registradas.</p>
          )}

          {!loading && !error && reservas.length > 0 && (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Cancha</th>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.user?.nombre ?? r.user_id}</td>
                      <td>{r.court?.nombre ?? r.court_id}</td>
                      <td>
                        {new Date(r.fecha + "T00:00:00").toLocaleDateString("es-AR")}
                      </td>
                      <td>
                        {r.time_slot?.hora_inicio
                          ? `${r.time_slot.hora_inicio} - ${r.time_slot?.hora_fin ?? ""}`
                          : r.time_slot_id ?? "N/A"}
                      </td>
                      <td>
                        {r.status?.nombre ?? r.status_id ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ReservationsList;