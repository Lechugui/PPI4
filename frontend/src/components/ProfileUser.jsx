import React, { useState, useEffect } from "react";
import { X, User, Mail, Calendar, Trash2, Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfileUser({ abierto, cerrar }) {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [logoutMessage, setLogoutMessage] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    if (user?.name) {
      setEditedName(user.name);
    }
  }, [user]);

  if (!abierto) return null;

  const handleLogoutClick = () => {
    logout();
    setLogoutMessage("¡Tu cuenta ha sido eliminada!");
    setShowLogoutModal(true);
    setTimeout(() => {
      setShowLogoutModal(false);
      navigate("/");
    }, 2000);
  };

  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/login/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ nombre: editedName }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el nombre.");
      }
      setConfirmationMessage("¡Nombre cambiado con éxito!");
      setShowConfirmationModal(true);
      setIsEditingName(false);
      setTimeout(() => {
        setShowConfirmationModal(false);
      }, 1000);
      setUser({ name: editedName });
      localStorage.setItem("userName", editedName);
    } catch (error) {
      setConfirmationMessage("¡Error, intentelo de nuevo más tarde!");
      console.error("Error al guardar el nombre:", error);
      setShowConfirmationModal(true);
      setTimeout(() => {
        setShowConfirmationModal(false);
      }, 1000);
    }
  };

  const handleCancelEditName = () => {
    setEditedName(user?.name || "");
    setIsEditingName(false);
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const response = await fetch(
        `http://localhost:8000/login/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error desconocido al eliminar la cuenta."
        );
      }
      setShowLogoutModal(true);
      handleLogoutClick();
    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      setShowLogoutModal(false);
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatearFechaTurno = (fechaISO) => {
    if (!fechaISO) return "N/A";
    return new Date(fechaISO).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const proximoTurno = { fecha: "2025-07-20T10:00:00Z", hora: "10:00" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-sm relative animate-fade-in-up border-2 border-primary">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h2 className="text-2xl font-bold text-primary">Usuario</h2>
          <button
            onClick={cerrar}
            className="p-2 rounded-full hover:bg-base-200 transition-colors focus:outline-none focus:ring-2 focus:ring-base-300"
          >
            <X className="w-6 h-6 text-base-content" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-primary-focus/20 rounded-full flex items-center justify-center border-2 border-primary shadow-md">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="space-y-5 mb-8">
            <div className="flex flex-col items-center gap-4 p-3 bg-base-200 rounded-lg sm:flex-row sm:items-start">
              <User className="w-5 h-5 text-base-content shrink-0" />
              <div className="flex-grow">
                <p className="text-sm text-base-content text-center sm:text-left">
                  Nombre Completo
                </p>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input input-bordered input-sm flex-grow"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                    <button
                      className="btn btn-primary btn-sm btn-circle"
                      onClick={handleSaveName}
                      aria-label="Guardar Nombre"
                    >
                      ✓
                    </button>
                    <button
                      className="btn btn-ghost btn-sm btn-circle"
                      onClick={handleCancelEditName}
                      aria-label="Cancelar Edición"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <p className="font-semibold text-base-content text-lg">
                      {user?.name || "No disponible"}
                    </p>
                    <button
                      className="btn btn-ghost btn-circle btn-sm"
                      onClick={handleEditNameClick}
                      aria-label="Editar Nombre"
                    >
                      <Pencil className="w-4 h-4 text-base-content" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-3 bg-base-200 rounded-lg sm:flex-row sm:items-start">
              <Mail className="w-5 h-5 text-base-content shrink-0" />
              <div className="flex-grow">
                <p className="text-sm text-base-content text-center sm:text-left">
                  Correo Electrónico
                </p>
                <p className="font-semibold text-base-content text-lg text-center sm:text-left">
                  {user?.email || "No disponible"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              className="btn btn-error w-full text-lg"
              onClick={handleDeleteAccountClick}
            >
              <Trash2 className="w-5 h-5 mr-2" /> Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-sm border-2 border-error">
            <div className="p-6 text-center">
              <Trash2 className="w-16 h-16 mx-auto text-error mb-4" />
              <h3 className="text-xl font-semibold text-base-content mb-4">
                ¿Estás seguro que deseas eliminar tu cuenta?
              </h3>
              <p className="text-base-content mb-6">
                Esta acción es irreversible y eliminará todos tus datos.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-base-300 text-base-content rounded-lg hover:bg-base-200 transition-colors"
                  disabled={isDeletingAccount}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeleteAccount}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-error hover:bg-red-900"
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Sí, eliminar mi cuenta"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box">
            <div>
              <span>{logoutMessage}</span>
            </div>
          </div>
        </div>
      )}
      {showConfirmationModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box">
            <div>
              <span>{confirmationMessage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileUser;