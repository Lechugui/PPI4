import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Trash2 } from 'lucide-react';

function ProfileUser({ abierto, cerrar }) {
    const { user, updateUserProfile, logout } = useAuth();
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(user?.name || '');

    useEffect(() => {
        setEditedName(user?.name || '');
    }, [user, abierto]);

    if (!abierto) return null;

    const handleSaveName = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/users/me', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: editedName })
            });

            if (response.ok) {
                const updatedUserData = await response.json();
                updateUserProfile({ ...user, name: updatedUserData.name });
                setIsEditingName(false);
                alert('Nombre actualizado con éxito!');
            } else {
                console.error('Error al actualizar el nombre:', response.status, response.statusText);
                alert('Hubo un error al actualizar el nombre.');
            }
        } catch (error) {
            console.error('Error de red al actualizar el nombre:', error);
            alert('Error de red.');
        }
    };

    // La función handleDownloadInvoice ha sido eliminada.

    return (
        <div className="modal modal-open backdrop-blur-sm">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-primary">Usuario</h3>
                <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={cerrar}>✕</button>

                <div className="py-4">
                    {/* Icono de avatar */}
                    <div className="flex justify-center mb-4">
                        <div className="avatar placeholder">
                            <div className="w-24 rounded-full bg-neutral-focus text-neutral-content">
                                <span className="text-3xl">{(user?.name ? user.name[0] : 'U').toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Campo Nombre Completo */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text flex items-center gap-2">
                                <User size={16} /> {/* Icono de persona */}
                                Nombre Completo
                            </span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={isEditingName ? editedName : (user?.name || 'No disponible')}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="input input-bordered w-full"
                                readOnly={!isEditingName}
                            />
                            {isEditingName ? (
                                <button className="btn btn-sm btn-success" onClick={handleSaveName}>Guardar</button>
                            ) : (
                                <button className="btn btn-ghost btn-sm" onClick={() => setIsEditingName(true)}>✏️</button>
                            )}
                        </div>
                    </div>

                    {/* Campo Correo Electrónico */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text flex items-center gap-2">
                                <Mail size={16} /> {/* Icono de email */}
                                Correo Electrónico
                            </span>
                        </label>
                        <input
                            type="email"
                            value={user?.email || 'No disponible'}
                            className="input input-bordered w-full"
                            readOnly
                        />
                    </div>

                    {/* El botón de Descargar Factura ha sido eliminado de aquí */}

                    <div className="modal-action justify-center">
                        <button className="btn btn-error flex items-center gap-2">
                            <Trash2 size={20} /> {/* Icono de basura */}
                            Eliminar Cuenta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileUser;