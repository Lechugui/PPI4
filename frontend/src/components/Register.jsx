import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
  });

  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGoBack = () => {
  navigate('/'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    setMensajeExito('');
    setShowSuccessModal(false); 

    const nuevosErrores = {};
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido.';
    }
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'El email no es válido.';
    }
    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es requerida.';
    } else if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no son coincidentes.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        contraseña: formData.password,
        role_id: 2,
      };

      const registerResponse = await fetch('http://127.0.0.1:8000/login/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        console.log('Usuario registrado exitosamente:', registerData);

        try {
          const loginFormData = new URLSearchParams();
          loginFormData.append('username', formData.email);
          loginFormData.append('password', formData.password);

          const loginResponse = await fetch('http://127.0.0.1:8000/login/try', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: loginFormData.toString(),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
            console.log('Login exitoso después del registro:', loginData);
            localStorage.setItem('authToken', loginData.access_token);
            localStorage.setItem('tokenType', loginData.token_type);

            setMensajeExito('¡Registro exitoso!');
            setShowSuccessModal(true); 

            setTimeout(() => {
              setShowSuccessModal(false); 
              navigate('/'); 
            }, 2000); 

          } else {
            console.error('Error al loguear después del registro:', loginData);
            setErrores({ general: loginData.detail || 'Error al iniciar sesión automáticamente después del registro.' });
          }
        } catch (loginError) {
          console.error('Error de red o inesperado durante el login post-registro:', loginError);
          setErrores({ general: 'No se pudo iniciar sesión automáticamente. Intenta iniciar sesión manualmente.' });
        }

        setFormData({ nombre: '', email: '', password: '', confirmarPassword: '' });
      } else {
        console.error('Error al registrar el usuario:', registerData);
        if (registerData.detail) {
          setErrores({ general: registerData.detail });
        } else {
          setErrores({ general: 'Hubo un error al registrar el usuario. Inténtelo de nuevo, por favor.' });
        }
      }
    } catch (error) {
      console.error('Error de conexión o inesperado durante el registro:', error);
      setErrores({ general: 'No se pudo conectar con el servidor. Verifique que el backend esté funcionando.' });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-200">
      <div className="bg-base-100 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Registro de Usuario</h2>
        {errores.general && <div className="alert alert-error mb-4">{errores.general}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errores.nombre && <p className="text-red-500 text-xs italic">{errores.nombre}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errores.email && <p className="text-red-500 text-xs italic">{errores.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errores.password && <p className="text-red-500 text-xs italic">{errores.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmarPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirmar Contraseña:
            </label>
            <input
              type="password"
              id="confirmarPassword"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errores.confirmarPassword && <p className="text-red-500 text-xs italic">{errores.confirmarPassword}</p>}
          </div>
          <div className="w-40 mx-auto flex flex-col space-y-2">
            <button
              type="submit"
              className="btn btn-primary rounded-lg w-full text-black"  
            >
              Registrarse
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="btn btn-secondary rounded-lg w-full text-black" 
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

export default Register;