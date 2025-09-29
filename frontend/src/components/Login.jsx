import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    username: '', // Para el email del usuario
    password: '', // Para la contraseña
  });

  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Nuevo estado para el modal

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    setMensajeExito('');
    setShowSuccessModal(false); // Asegúrate de que el modal esté cerrado al iniciar el submit

    // Validaciones básicas del formulario
    const nuevosErrores = {};
    if (!formData.username.trim()) {
      nuevosErrores.username = 'El email es requerido.';
    }
    if (!formData.password.trim()) {
      nuevosErrores.password = 'La contraseña es requerida.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const loginData = new URLSearchParams();
      loginData.append('username', formData.username);
      loginData.append('password', formData.password);

      const response = await fetch('http://127.0.0.1:8000/login/try', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: loginData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login exitoso:', data);
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('tokenType', data.token_type);

        setMensajeExito('¡Sesión iniciada con éxito!');
        setShowSuccessModal(true); // Mostrar el modal de éxito

        setTimeout(() => {
          navigate('/'); // Redirige al Home
        }, 2000); // 2000 milisegundos = 2 segundos

      } else {
        console.error('Error en el login:', data);
        if (data.detail) {
          setErrores({ general: data.detail });
        } else {
          setErrores({ general: 'Credenciales inválidas. Inténtelo de nuevo.' });
        }
      }
    } catch (error) {
      console.error('Error de conexión o inesperado:', error);
      setErrores({ general: 'No se pudo conectar con el servidor. Verifique que el backend esté funcionando.' });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-200">
      <div className="bg-base-100 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Iniciar Sesión</h2>
        {errores.general && <div className="alert alert-error mb-4">{errores.general}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tu email"
            />
             {errores.username && <p className="text-red-500 text-xs italic">{errores.username}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
            />
            {errores.password && <p className="text-red-500 text-xs italic">{errores.password}</p>}
          </div>
          <button
            className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Entrar
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-success">¡Éxito!</h3>
            <p className="py-2">{mensajeExito}</p>
            <p className="py-2">Aguarde unos instantes, será redirigido a la página principal.</p>
            <div className="modal-action">
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;