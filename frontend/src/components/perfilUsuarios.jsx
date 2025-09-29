import React from 'react';
import { X, User, Mail, Calendar, LogOut } from "lucide-react";

function PerfilUsuario({ abierto, cerrar, userName, userEmail, proximoTurno }) {
    if (!abierto) return null;

    const formatearFechaTurno = (fechaISO) => {
        if (!fechaISO) return 'N/A';
        return new Date(fechaISO).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

            <div className="bg-grey rounded-xl shadow-xl w-full max-w-sm relative animate-fade-in-up border-1 border-green-700">

                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-green-700">Usuario</h2>
                    <button onClick={cerrar} className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>


                <div className="p-6">

                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-1 border-blue-300 shadow-md">
                            <User className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>


                    <div className="space-y-5 mb-8">

                        <div className="flex flex-col items-center gap-4 p-3 bg-gray-50 rounded-lg sm:flex-row sm:items-start">
                            <User className="w-5 h-5 text-gray-600 shrink-0" />


                            <div className="flex-grow">
                                <p className="text-sm text-gray-600 text-center sm:text-left">Nombre Completo</p>
                                <p className="font-semibold text-gray-900 text-lg text-center sm:text-left">{userName || 'No disponible'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 p-3 bg-gray-50 rounded-lg sm:flex-row sm:items-start">
                            <Mail className="w-5 h-5 text-gray-600 shrink-0" />
                            <div className="flex-grow">
                                <p className="text-sm text-gray-600 text-center sm:text-left">Correo Electrónico</p>
                                <p className="font-semibold text-gray-900 text-lg text-center sm:text-left">{userEmail || 'No disponible'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 p-3 bg-gray-50 rounded-lg sm:flex-row sm:items-start">
                            <Calendar className="w-5 h-5 text-gray-600 shrink-0" />
                            <div className="flex-grow">
                                <p className="text-sm text-gray-600 text-center sm:text-left">Próximo Turno</p>
                                {proximoTurno ? (
                                    <p className="font-semibold text-green-700 text-lg text-center sm:text-left">
                                        {formatearFechaTurno(proximoTurno.fecha)} - {proximoTurno.hora} hs
                                    </p>
                                ) : (
                                    <p className="font-semibold text-gray-500 text-lg text-center sm:text-left">No tienes turnos agendados.</p>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-col gap-4">

                        <button className="w-full px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-3 font-medium text-lg">
                            <LogOut className="w-5 h-5" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilUsuario;