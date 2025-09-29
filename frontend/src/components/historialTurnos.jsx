
import React, { useState, useEffect } from 'react'; // preparo componente para hacer fetch a el endpoint de historial

import { useNavigate } from 'react-router-dom';
import { Calendar } from "lucide-react";

const turnosEjemplo = [
    { id: 1, fecha: '2025-06-07', hora: '18:00', estado: 'Agendado' },
    { id: 2, fecha: '2025-06-06', hora: '20:00', estado: 'Cancelado' },
    { id: 3, fecha: '2025-06-05', hora: '19:00', estado: 'Agendado' },
    { id: 4, fecha: '2025-06-04', hora: '18:00', estado: 'Agendado' },
    { id: 5, fecha: '2025-06-03', hora: '20:00', estado: 'Cancelado' },
    { id: 6, fecha: '2025-06-02', hora: '19:00', estado: 'Agendado' },
];

function HistorialTurnos() {
    const [turnos, setTurnos] = useState([]); // Inicializo el estado de turnos como un array vacío]);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
    const [error, setError] = useState(null); // Estado para manejar errores

    const [busqueda, setBusqueda] = useState('');
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [turnoAConfirmar, setTurnoAConfirmar] = useState(null);
    const navigate = useNavigate();

    //
    useEffect(() => {
        const userId = localStorage.getItem('userId'); // 

    if (!userId) {
      setError('Usuario no autenticado');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/reservations/ultimos/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar las reservas');
        return res.json();
      })
      .then(data => {
        const turnosFormateados = data.map(turno => ({
          id: turno.id,
          fecha: turno.fecha,
          hora: turno.time_slot?.hora_inicio || 'N/A',
          estado: turno.status?.nombre || 'Desconocido',
        }));
        setTurnos(turnosFormateados);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

    //

    const handleAbrirConfirmacion = (turno) => {
        setTurnoAConfirmar(turno);
        setMostrarConfirmacion(true);
    };

    const handleCerrarConfirmacion = () => {
        setTurnoAConfirmar(null);
        setMostrarConfirmacion(false);
    };

    const handleConfirmarCancelacion = () => {
        if (turnoAConfirmar) {
            const nuevosTurnos = turnos.map(turno =>
                turno.id === turnoAConfirmar.id &&
                    turno.fecha === turnoAConfirmar.fecha &&
                    turno.hora === turnoAConfirmar.hora
                    ? { ...turno, estado: 'Cancelado' }
                    : turno
            );
            setTurnos(nuevosTurnos);
            setTurnoAConfirmar(null);
            setMostrarConfirmacion(false);
        }
    };

    const formatearFecha = (fechaISO) => {
        return new Date(fechaISO).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const turnosFiltrados = turnos.filter(turno =>
        busqueda === '' || turno.fecha === busqueda
    ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Si no hay turnos, mostrar un mensaje de carga o error
    // Si hay un error, mostrar un mensaje de error
    if (loading) return <p className="text-center mt-10">Cargando turnos...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;


    return (
        <div className='bg-base-100 shadow-md rounded-xl p-6 mb-10 relative'>
            <div className="max-w-xl mx-auto mt-20 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-primary mb-4">
                    Mis Últimos Turnos
                </h2>
            </div>

            <div className='mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center'>
                <input
                    type='date'
                    className='input input-bordered w-full sm:max-w-xs'
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button
                    className='btn btn-outline w-full sm:w-auto'
                    onClick={() => setBusqueda('')}
                >
                    Limpiar Filtro
                </button>
            </div>

            {turnosFiltrados.length === 0 ? (
                <p className='text-secondary text-center py-4'>No se encontraron turnos para la fecha seleccionada.</p>
            ) : (
                <div className='flex flex-col items-center gap-4'>
                    {turnosFiltrados.map((turno, index) => (
                        <div
                            key={`${turno.id}-${turno.fecha}-${turno.hora}-${index}`}

                            className='bg-base-100 rounded-lg shadow-sm p-4 border-1 border-green-500 hover:shadow-md transition-shadow duration-200 w-full md:w-3/4 lg:w-1/2' // border-2 para un borde visible, border-green-500 para el color
                        >
                            <div className='flex justify-between items-start mb-2'>

                                <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
                                    <Calendar className='w-5 h-5 text-blue-500' />
                                    {formatearFecha(turno.fecha)}
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${turno.estado === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                >
                                    {turno.estado}
                                </span>
                            </div>

                            <p className='text-white text-sm mb-3'>
                                Horario: <span className='font-medium text-white'>{turno.hora} hs</span>
                            </p>
                            {turno.estado === 'Agendado' && (
                                <div className="flex justify-end">
                                    <button

                                        className='bg-green-800 hover:bg-green-600 text-white text-sm font-semibold rounded-full px-3 py-0 transition duration-200 w-auto'
                                        onClick={() => handleAbrirConfirmacion(turno)}
                                    >
                                        Cancelar Turno
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {mostrarConfirmacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

                    <div className="bg-grey rounded-xl shadow-xl w-full max-w-md border-1 border-green-500">
                        <div className="p-6">

                            <h3 className="text-lg font-semibold text-white mb-4">Confirmar cancelación de turno</h3>
                            {turnoAConfirmar && (
                                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                                    <p className="text-gray-300">
                                        ¿Estás seguro que deseas cancelar el turno del{' '}
                                        <span className="font-medium text-white">{formatearFecha(turnoAConfirmar.fecha)}</span> a las{' '} {/* Texto en blanco */}
                                        <span className="font-medium text-white">{turnoAConfirmar.hora} hs</span>? {/* Texto en blanco */}
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCerrarConfirmacion}
                                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors" /* Colores ajustados para tema oscuro */
                                >
                                    No, mantener turno
                                </button>
                                <button
                                    onClick={handleConfirmarCancelacion}
                                    className="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-red-600 hover:bg-red-700"
                                >
                                    Sí, cancelar turno
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HistorialTurnos;
