import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User } from "lucide-react";


import ThemeToggle from './ThemeToggle';
import PerfilUsuario from './PerfilUsuario';


const turnosEjemplo = [
    { id: 1, fecha: '2025-06-07', hora: '18:00', estado: 'Agendado' },
    { id: 2, fecha: '2025-06-06', hora: '20:00', estado: 'Cancelado' },
    { id: 3, fecha: '2025-06-05', hora: '19:00', estado: 'Agendado' },
    { id: 4, fecha: '2025-06-04', hora: '18:00', estado: 'Agendado' },
    { id: 5, fecha: '2025-06-03', hora: '20:00', estado: 'Cancelado' },
    { id: 6, fecha: '2025-06-02', hora: '19:00', estado: 'Agendado' },
];

function HistorialTurnos() {

    const [turnos, setTurnos] = useState(turnosEjemplo);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [turnoAConfirmar, setTurnoAConfirmar] = useState(null);


    const [mostrarPerfil, setMostrarPerfil] = useState(false);

    const navigate = useNavigate();

    const datosUsuario = {
        userName: "Anna Clara",
        userEmail: "anna.gomes@example.com",
        proximoTurno: turnos.find(turno => turno.estado === 'Agendado') || null,
    };


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


    const handleAbrirPerfil = () => {
        setMostrarPerfil(true);
    };

    const handleCerrarPerfil = () => {
        setMostrarPerfil(false);
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

    return (

        <div className='min-h-screen bg-base-200 text-base-content relative pb-20'>
            <div className="max-w-xl mx-auto pt-10 px-6">

                <div className="flex justify-end mb-4 items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={handleAbrirPerfil}
                        className="btn btn-primary btn-circle"
                        aria-label="Abrir perfil de usuario"
                    >
                        <User className="w-5 h-5" />
                    </button>
                </div>


                <div className="shadow-lg rounded-lg p-6 bg-base-100">
                    <h2 className="text-2xl font-bold text-center text-primary mb-4">
                        Mis Últimos Turnos
                    </h2>
                </div>
            </div>


            <div className='mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center px-6 mt-6'>
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
                <div className='flex flex-col items-center gap-4 px-6'>
                    {turnosFiltrados.map((turno, index) => (
                        <div
                            key={`${turno.id}-${turno.fecha}-${turno.hora}-${index}`}
                            className='bg-base-100 rounded-lg shadow-sm p-4 border-2 border-primary hover:shadow-md transition-shadow duration-200 w-full md:w-3/4 lg:w-1/2'
                        >
                            <div className='flex justify-between items-start mb-2'>
                                <h3 className='text-lg font-semibold text-primary flex items-center gap-2'>
                                    <Calendar className='w-5 h-5 text-accent' />
                                    {formatearFecha(turno.fecha)}
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${turno.estado === 'Cancelado' ? 'bg-error text-error-content' : 'bg-success text-success-content'}`}
                                >
                                    {turno.estado}
                                </span>
                            </div>

                            <p className='text-base-content text-sm mb-3'>
                                Horario: <span className='font-medium'>{turno.hora} hs</span>
                            </p>
                            {turno.estado === 'Agendado' && (
                                <div className="flex justify-end">
                                    <button
                                        className='btn btn-sm btn-error'
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
                    <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-md border-2 border-primary">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-primary mb-4">Confirmar cancelación de turno</h3>
                            {turnoAConfirmar && (
                                <div className="mb-6 p-4 bg-base-200 rounded-lg">
                                    <p className="text-base-content">
                                        ¿Estás seguro que deseas cancelar el turno del{' '}
                                        <span className="font-medium text-primary">{formatearFecha(turnoAConfirmar.fecha)}</span> a las{' '}
                                        <span className="font-medium text-primary">{turnoAConfirmar.hora} hs</span>?
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCerrarConfirmacion}
                                    className="flex-1 px-4 py-2 border border-base-300 text-base-content rounded-lg hover:bg-base-200 transition-colors"
                                >
                                    No, mantener turno
                                </button>
                                <button
                                    onClick={handleConfirmarCancelacion}
                                    className="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-error hover:bg-error-focus"
                                >
                                    Sí, cancelar turno
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <PerfilUsuario
                abierto={mostrarPerfil}
                cerrar={handleCerrarPerfil}
                userName={datosUsuario.userName}
                userEmail={datosUsuario.userEmail}
                proximoTurno={datosUsuario.proximoTurno}
            />
        </div>
    );
}

export default HistorialTurnos;