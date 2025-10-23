import React, { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Booking from './components/Booking'
import ProfileUser from './components/ProfileUser'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import './App.css'
import Home from './components/Home'

import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/AdminDashboard'
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
      
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={[1]}> <UsersList /> </ProtectedRoute>}/>
      <Route path="/admin/reservations" element={<ProtectedRoute allowedRoles={[1]}> <ReservationsList /> </ProtectedRoute>}/>
    </Routes>
  )
}

export default App
