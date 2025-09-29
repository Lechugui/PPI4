import React, { useEffect, useState } from 'react';
import { BookingProvider } from '../context/BookingContext';
import BookingWizard from './BookingWizard';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const [logoutMessage, setLogoutMessage] = useState(''); 

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      return payload.sub;
    } catch (e) {
      console.error("Error decodificando token JWT:", e);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      setIsLoggedIn(true);
      const email = decodeJwt(token);

      if (email) {
        const fetchUserName = async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/login/user_name', { 
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              if (data.nombre) {
                setUserName(data.nombre);
              } else {
                setUserName(email.split('@')[0]); 
              }
            } else {
              console.error('Error al obtener el nombre del usuario:', response.status, response.statusText);
              setUserName(email.split('@')[0]);
            }
          } catch (error) {
            console.error('Error de red al obtener el nombre del usuario:', error);
            setUserName(email.split('@')[0]); 
          }
        };
        fetchUserName();
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  }, []); 

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');

    setLogoutMessage('¡Tu sesión ha sido cerrada con éxito!');
    setShowLogoutModal(true);

    setTimeout(() => {
      setShowLogoutModal(false); 
      setIsLoggedIn(false); 
      setUserName(''); 
      navigate('/'); 
    }, 2000); 
  };

  return (
    <BookingProvider>
      <div className='absolute top-2 right-4 flex flex-col items-end space-y-1'>
        {isLoggedIn ? (
          <>
            <span className='text-lg font-semibold text-gray-700'>
              ¡Bienvenido, {userName}!
            </span>
            <button className='btn btn-sm btn-primary' onClick={handleLogoutClick}>
              Cerrar Sesión
            </button>
            <ThemeToggle />
          </>
        ) : (
          <>
            <div className="flex space-x-2">
              <button className='btn btn-sm btn-primary mt-4' onClick={handleLoginClick}>
                Ingresar
              </button>
              <button
                className='btn btn-sm btn-secondary mt-4'
                onClick={handleRegisterClick}
              >
                Registrate
              </button>
            </div>
            <ThemeToggle />
          </>
        )}
      </div>

      <main className='min-h-screen bg-base-200 flex flex-col'>
        <header className='bg-base-100 shadow-md py-4'>
          <div className='container mx-auto px-4 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <img src={'/paddliemos.webp'} alt='logo' className='w-22 h-22' />
              <span>
                <h1 className='text-3xl font-bold text-primary'>Paddliemos</h1>
                <p className='text-secondary'>
                  Sistema de reservas de canchas de paddle
                </p>
              </span>
            </div>
          </div>
        </header>

        <section className='container mx-auto px-4 py-8 flex-grow'>
          <div className='text-center mb-8'>
            <h2 className='text-4xl font-bold text-primary mb-2'>
              Reservá tu turno
            </h2>
            <p className='text-lg text-secondary'>
              ¡Reserva fácilmente tu cancha de paddle para jugar con amigos o
              practicar!
            </p>
          </div>

          <BookingWizard />
        </section>

        <footer className='bg-base-100 py-6'>
          <div className='container mx-auto px-4 text-center'>
            <p className='text-sm'>
              © 2025 Paddliemos - Todos los derechos reservados
            </p>
          </div>
        </footer>
      </main>

      {showLogoutModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-success">¡Adiós!</h3>
            <p className="py-2">{logoutMessage}</p>
            <p className="py-2">Será redirigido a la pantalla principal.</p>
            <div className="modal-action">
            </div>
          </div>
        </div>
      )}
    </BookingProvider>
  );
}

export default Home;