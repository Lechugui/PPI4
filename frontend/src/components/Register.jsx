import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });

  const {
    registerContext,
    errors, 
    setErrors, 
    loading,
    successMessage,
    showSuccessModal,
    setShowSuccessModal,
  } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    let newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido.";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (!formData.confirmarPassword) {
      newErrors.confirmarPassword = "Confirme su contraseña.";
    } else if (formData.password !== formData.confirmarPassword) {
      newErrors.confirmarPassword = "Las contraseñas no coinciden.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await registerContext(formData.nombre, formData.email, formData.password);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-200">
      <div className="bg-base-100 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          Registro de Usuario
        </h2>
        {errors.general && (
          <div className="alert alert-error mb-4">{errors.general}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-gray-200 text-sm font-bold mb-2"
            >
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs italic">{errors.nombre}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-200 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-200 text-sm font-bold mb-2"
            >
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmarPassword"
              className="block text-gray-200 text-sm font-bold mb-2"
            >
              Confirmar Contraseña:
            </label>
            <input
              type="password"
              id="confirmarPassword"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.confirmarPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.confirmarPassword}
              </p>
            )}
          </div>
          <div className="w-40 mx-auto flex flex-col space-y-2">
            <button
              type="submit"
              className="btn btn-primary rounded-lg w-full text-black"
              disabled={loading} 
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="btn btn-secondary rounded-lg w-full text-black"
              disabled={loading} 
            >
              Volver
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-success">¡Éxito!</h3>
            <p className="py-2">{successMessage}</p>
            <p className="py-2">
              Aguarde unos instantes, será redirigido a la página principal.
            </p>
            <div className="modal-action"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;