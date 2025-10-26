import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ReservationsList = () => {
  const { token } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [courts, setCourts] = useState([]);            
  const [slots, setSlots] = useState({});             
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);    
  const [draft, setDraft] = useState({});              
  const [deletingId, setDeletingId] = useState(null);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ---- fetchers
  const fetchReservas = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/reservations/", { headers: authHeaders });
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

  const fetchCourts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/courts", { headers: authHeaders });
      if (!res.ok) throw new Error("No se pudieron cargar las canchas");
      const data = await res.json();
      setCourts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getAvailableSlots = async (courtId, fecha) => {
    const key = `${courtId}_${fecha}`;
    if (slots[key]) return slots[key];

    const url = new URL("http://127.0.0.1:8000/reservations/available-slots");
    url.searchParams.set("court_id", courtId);
    url.searchParams.set("fecha", fecha); // YYYY-MM-DD

    const res = await fetch(url.toString(), { headers: authHeaders });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "No se pudieron cargar los horarios");
    }
    const data = await res.json();
    setSlots((prev) => ({ ...prev, [key]: data }));
    return data;
  };

  // acciones
  const handleDelete = async (id) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la reserva #${id}?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://127.0.0.1:8000/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        setReservas((prev) => prev.filter((r) => r.id !== id));
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "No se pudo eliminar la reserva");
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = async (row) => {
    setEditingId(row.id);
    // fecha en formato YYYY-MM-DD
    const fechaISO = row.fecha ? String(row.fecha) : "";
    setDraft({
      court_id: row.court_id,
      time_slot_id: row.time_slot_id,
      fecha: fechaISO,  // fecha editable
    });
    try {
      if (fechaISO && row.court_id) {
        await getAvailableSlots(row.court_id, fechaISO); // precarga horarios
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const onChangeCourt = async (newCourtId) => {
    // al cambiar cancha, resetea slot y refresca horarios para nueva cancha + fecha del draft
    const courtIdNum = Number(newCourtId);
    setDraft((prev) => ({ ...prev, court_id: courtIdNum, time_slot_id: undefined }));
    try {
      if (draft.fecha) await getAvailableSlots(courtIdNum, draft.fecha); // usa fecha del draft
    } catch (e) {
      alert(e.message);
    }
  };

  const onChangeFecha = async (newFecha) => {
    // al cambiar fecha, resetea slot y refresca horarios para cancha draft + nueva fecha
    const fechaVal = newFecha; // "YYYY-MM-DD"
    setDraft((prev) => ({ ...prev, fecha: fechaVal, time_slot_id: undefined })); // reseteo slot
    try {
      if (draft.court_id) await getAvailableSlots(draft.court_id, fechaVal);     // traigo horarios
    } catch (e) {
      alert(e.message);
    }
  };

  const saveEdit = async (row) => {
    // Construye payload SOLO con cambios
    const payload = {};
    if (draft.court_id && draft.court_id !== row.court_id) payload.court_id = Number(draft.court_id);
    if (draft.time_slot_id && draft.time_slot_id !== row.time_slot_id) payload.time_slot_id = Number(draft.time_slot_id);
    if (draft.fecha && draft.fecha !== String(row.fecha)) payload.fecha = draft.fecha; // fecha opcional

    if (Object.keys(payload).length === 0) {
      cancelEdit();
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/reservations/reservation/${row.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "No se pudo actualizar la reserva");
      }
      const updated = await res.json();
      setReservas((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      cancelEdit();
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    fetchCourts();
    fetchReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r) => {
                    const isEditing = editingId === r.id;
                    const fechaKey = (isEditing ? draft.fecha : r.fecha) || "";
                    const courtKey = (isEditing ? draft.court_id : r.court_id) || "";
                    const cacheKey = `${courtKey}_${fechaKey}`;
                    const available = slots[cacheKey] || [];

                    return (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.user?.nombre ?? r.user_id}</td>

                        {/* CANCHA */}
                        <td>
                          {isEditing ? (
                            <select
                              className="select select-sm select-bordered"
                              value={draft.court_id ?? r.court_id}
                              onChange={(e) => onChangeCourt(e.target.value)}
                            >
                              {courts.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.nombre}
                                </option>
                              ))}
                            </select>
                          ) : (
                            r.court?.nombre ?? r.court_id
                          )}
                        </td>

                        {/* FECHA */}
                        <td>
                          {isEditing ? (
                            <input
                              type="date"
                              className="input input-sm input-bordered"
                              value={draft.fecha ?? (r.fecha ? String(r.fecha) : "")}
                              onChange={(e) => onChangeFecha(e.target.value)}
                            />
                          ) : r.fecha ? (
                            new Date(r.fecha + "T00:00:00").toLocaleDateString("es-AR")
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* HORARIO */}
                        <td>
                          {isEditing ? (
                            <select
                              className="select select-sm select-bordered"
                              value={draft.time_slot_id ?? r.time_slot_id ?? ""}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  time_slot_id: Number(e.target.value),
                                }))
                              }
                            >
                              <option value="" disabled>
                                Seleccionar
                              </option>
                              {available.map((s) => (
                                <option key={s.id} value={s.id} disabled={!s.available}>
                                  {`${s.hora_inicio} - ${s.hora_fin}`}{!s.available ? " (ocupado)" : ""}
                                </option>
                              ))}
                            </select>
                          ) : r.time_slot?.hora_inicio ? (
                            `${r.time_slot.hora_inicio} - ${r.time_slot?.hora_fin ?? ""}`
                          ) : (
                            r.time_slot_id ?? "N/A"
                          )}
                        </td>

                        {/* ESTADO dejo solo lectura */}
                        <td>{r.status?.nombre ?? r.status_id ?? "—"}</td>

                        {/* ACCIONES */}
                        <td className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button className="btn btn-success btn-sm" onClick={() => saveEdit(r)}>
                                Guardar
                              </button>
                              <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button className="btn btn-warning btn-sm" onClick={() => startEdit(r)}>
                              Editar
                            </button>
                          )}

                          <button
                            className={`btn btn-error btn-sm ${deletingId === r.id ? "btn-disabled" : ""}`}
                            onClick={() => handleDelete(r.id)}
                            disabled={deletingId === r.id || isEditing}
                          >
                            {deletingId === r.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Eliminar"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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