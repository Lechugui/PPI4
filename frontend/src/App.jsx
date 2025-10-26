<<<<<<< HEAD
import React from 'react'
import './App.css'

function App () {
  return (
    <main className='min-h-screen bg-base-200 flex items-center justify-center'>
      <section className='text-center space-y-8'>
        <header>
          <h1 className='text-5xl font-bold text-primary'>
            Reservá tu turno en Paddliemos
          </h1>
          <p className='text-lg text-secondary'>
            ¡Reserva fácilmente tu cancha de paddle para jugar con amigos o
            practicar!
          </p>
        </header>

        <nav className='flex justify-center space-x-6'>
          <button className='btn btn-accent'>Seleccionar Fecha</button>
          <button className='btn btn-accent'>Seleccionar Hora</button>
        </nav>

        <article className='mt-8'>
          <h2 className='text-3xl font-semibold text-primary'>
            Detalles de la Reserva
          </h2>
          <section className='mt-4 bg-base-100 shadow-xl card w-96 mx-auto'>
            <div className='card-body'>
              <h3 className='card-title'>Confirmar Turno</h3>
              <p>Fecha: Lunes, 1 de Mayo</p>
              <p>Hora: 18:00 - 19:00</p>
              <button className='btn btn-primary mt-4'>Reservar</button>
            </div>
          </section>
        </article>

        <aside className='mt-8'>
          <section className='card bg-base-100 shadow-xl w-96 mx-auto'>
            <div className='card-body'>
              <h2 className='card-title'>¿Cómo funciona?</h2>
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
=======
import React, { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Booking from './components/Booking'
import ProfileUser from './components/ProfileUser'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './components/Home'

import ProtectedRoute from './components/ProtectedRoute'
import AdminPage from './components/AdminPage'
import ReservationsList from './components/admin/ReservationsList'

import UsersList from './components/admin/UsersList'

function HistorialTurnosWrapper () {
  const [mostrarPerfil, setMostrarPerfil] = useState(false)

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}
      >
        <button
          onClick={() => setMostrarPerfil(true)}
          style={{
            padding: '8px 16px',
            border: '1px solid #12820e',
            color: '#12820e',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Mi Perfil
        </button>
      </div>

      <ProfileUser
        abierto={mostrarPerfil}
        cerrar={() => setMostrarPerfil(false)}
      />
      <Booking />
      <Link to='/' className='btn btn-sm btn-primary absolute top-4 left-4'>
        {' '}
        Volver
      </Link>
    </div>
  )
}

function App () {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/registro' element={<Register />} />
      <Route path='/' element={<Home />} />
      <Route path='/historialTurnos' element={<HistorialTurnosWrapper />} />
      <Route
        path='/perfilUsuarios'
        element={<ProfileUser abierto={false} cerrar={() => {}} />}
      />
      <Route path='/adminPage' element={<AdminPage />} />

      <Route
        path='/admin/users'
        element={
          <ProtectedRoute allowedRoles={[1]}>
            {' '}
            <UsersList />{' '}
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/reservations'
        element={
          <ProtectedRoute allowedRoles={[1]}>
            {' '}
            <ReservationsList />{' '}
          </ProtectedRoute>
        }
      />
    </Routes>
>>>>>>> 5f32597536c4ea2021c43050a402a07f663d4834
  )
}

export default App
