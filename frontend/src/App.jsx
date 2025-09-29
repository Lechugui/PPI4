import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import HistorialTurnos from './components/HistorialTurnos';
import PerfilUsuarios from './components/PerfilUsuarios';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

function HistorialTurnosWrapper() {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
      }}>
        <button
          onClick={() => setMostrarPerfil(true)}
          style={{
            padding: '8px 16px',
            border: '1px solid #12820e',
            color: '#12820e',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Mi Perfil
        </button>
      </div>

      <PerfilUsuarios abierto={mostrarPerfil} cerrar={() => setMostrarPerfil(false)} />
      <HistorialTurnos />
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <main className='min-h-screen bg-base-200 flex items-center justify-center'>
      <div className="absolute top-4 right-4 space-x-2">
        <button className='btn btn-sm btn-primary mt-4' onClick={handleLoginClick}>
          Ingresar
        </button>
        <button className='btn btn-sm btn-secondary mt-4' onClick={handleRegisterClick}>
          Regístrate
        </button>
      </div>
      <section className='text-center space-y-8'>
        <header>
          <h1 className='text-5xl font-bold text-primary'>
            Reservá tu turno en Paddliemos
          </h1>
          <p className='text-lg text-secondary'>
            ¡Reserva fácilmente tu cancha de paddle para jugar con amigos o practicar!
          </p>
        </header>

        <article className='mt-8'>
          <h2 className='text-3xl font-semibold text-primary'>¿Cómo funciona?</h2>
        </article>

        <aside className='mt-8'>
          <section className='card bg-base-100 shadow-xl w-96 mx-auto'>
            <div className='card-body'>
              <ul>
                <li>1. Elige una fecha disponible.</li>
                <li>2. Selecciona un horario para tu turno.</li>
                <li>3. Confirma tu reserva y ¡listo!</li>
              </ul>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/historialTurnos" element={<HistorialTurnosWrapper />} />
        <Route path="/perfilUsuarios" element={<PerfilUsuarios abierto={false} cerrar={() => { }} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;