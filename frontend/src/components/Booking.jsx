import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Calendar, Trash2 } from 'lucide-react'

function Booking () {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [turnoAConfirmar, setTurnoAConfirmar] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setError('Usuario no autenticado')
      setLoading(false)
      return
    }

    fetch(`http://localhost:8000/reservations/ultimos/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar las reservas')
        return res.json()
      })
      .then(data => {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        const turnosFormateados = data.map(turno => {
          let estadoActual = turno.status_id || -1
          const fechaTurno = new Date(turno.fecha)
          fechaTurno.setHours(0, 0, 0, 0)
          if (estadoActual !== 3) {
            if (fechaTurno < hoy) {
              estadoActual = 'Completado'
            } else if (fechaTurno.getTime() === hoy.getTime()) {
              estadoActual = 'Hoy'
            } else {
              estadoActual = 'Agendado'
            }
          } else {
            estadoActual = 'Cancelado'
          }

          return {
            id: turno.id,
            fecha: turno.fecha,
            hora: turno.time_slot?.hora_inicio || 'N/A',

            court_id: turno.court_id,
            time_slot_id: turno.time_slot_id,
            estado: estadoActual
          }
        })
        setTurnos(turnosFormateados)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [user])

  const handleAbrirConfirmacion = turno => {
    setTurnoAConfirmar({
      court_id: turno.court_id,
      estado: turno.estado,
      fecha: turno.fecha,
      hora: turno.hora,
      id: turno.id,
      time_slot_id: turno.time_slot_id
    })
    setMostrarConfirmacion(true)
  }

  const handleCerrarConfirmacion = () => {
    setTurnoAConfirmar(null)
    setMostrarConfirmacion(false)
  }

  const handleConfirmarCancelacion = turno => {
    if (!user || !user.token) {
      console.error('Usuario no autenticado o token no disponible.')
      alert('Debes iniciar sesión para cancelar un turno.')
      setMostrarConfirmacion(false)
      return
    }

    if (turnoAConfirmar) {
      fetch(`http://localhost:8000/reservations/reservation/${turno.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          status_id: 3,
          user_id: user.id,
          court_id: turno.court_id,
          fecha: turno.fecha,
          time_slot_id: turno.time_slot_id
        })
      })
        .then(res => {
          if (!res.ok) {
            return res
              .json()
              .then(errorData => {
                throw new Error(
                  errorData.detail ||
                    errorData.message ||
                    'Error desconocido al cancelar el turno.'
                )
              })
              .catch(() => {
                throw new Error(
                  'Error al cancelar el turno. Estado HTTP: ' + res.status
                )
              })
          }
          return res.json()
        })
        .then(data => {
          console.log('Respuesta del backend al cancelar:', data)

          const nuevosTurnos = turnos.map(turno =>
            turno.id === turnoAConfirmar.id
              ? { ...turno, estado: 'Cancelado' }
              : turno
          )
          setTurnos(nuevosTurnos)
          setTurnoAConfirmar(null)
          setMostrarConfirmacion(false)
          alert('¡Turno cancelado exitosamente!')
        })
        .catch(err => {
          console.error('Error en la cancelación:', err)
          alert(
            `Hubo un error al intentar cancelar el turno: ${
              err.message || 'Por favor, inténtalo de nuevo.'
            }`
          )
          setMostrarConfirmacion(false)
        })
    }
  }

  const formatearFecha = fechaISO => {
    return new Date(fechaISO + 'T00:00:00').toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const turnosFiltrados = turnos
    .filter(turno => busqueda === '' || turno.fecha === busqueda)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  if (loading) return <p className='text-center mt-10'>Cargando turnos...</p>
  if (error)
    return <p className='text-center mt-10 text-red-600'>Error: {error}</p>

  return (
    <div className='bg-base-100 shadow-md rounded-xl p-6 mb-10 relative'>
      <div className='max-w-xl mx-auto mt-20 shadow-lg rounded-lg p-6'>
        <h2 className='text-2xl font-bold text-center text-primary mb-4'>
          Mis Turnos Previos
        </h2>
      </div>

      <div className='mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center'>
        <input
          type='date'
          className='input input-bordered w-full sm:max-w-xs'
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button
          className='btn btn-outline w-full sm:w-auto'
          onClick={() => setBusqueda('')}
        >
          Limpiar Filtro
        </button>
      </div>

      {turnosFiltrados.length === 0 ? (
        <p className='text-secondary text-center py-4'>
          No se encontraron turnos para la fecha seleccionada.
        </p>
      ) : (
        <div className='flex flex-col items-center gap-4'>
          {turnosFiltrados.map((turno, index) => (
            <div
              key={`${turno.id}-${turno.fecha}-${turno.hora}-${index}`}
              className='bg-base-200 rounded-lg shadow-sm p-4 border-2 border-primary hover:shadow-md transition-shadow duration-200 w-full md:w-3/4 lg:w-1/2'
            >
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-semibold text-base-content flex items-center gap-2'>
                  <Calendar className='w-5 h-5 text-primary' />
                  {formatearFecha(turno.fecha)}
                </h3>
                <div className='flex flex-col items-end'>
                  <span className='text-xs text-base-content mb-1'></span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      turno.estado === 'Cancelado'
                        ? 'bg-error text-error-content'
                        : turno.estado === 'Completado'
                        ? 'bg-success text-success-content'
                        : turno.estado === 'Hoy'
                        ? 'bg-warning text-warning-content'
                        : 'bg-primary text-primary-content'
                    }`}
                  >
                    {turno.estado}
                  </span>
                </div>
              </div>

              <p className='text-base-content text-sm mb-3'>
                Horario:{' '}
                <span className='font-medium text-base-content'>
                  {turno.hora} hs
                </span>
              </p>
              {(turno.estado === 'Agendado' || turno.estado === 'Hoy') && (
                <div className='flex justify-end'>
                  <button
                    className='btn btn-ghost'
                    onClick={() => handleAbrirConfirmacion(turno)}
                    aria-label='Cancelar Turno'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {mostrarConfirmacion && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-base-100 rounded-xl shadow-xl w-full max-w-md border-2 border-primary'>
            <div className='p-6'>
              <h3 className='text-lg font-semibold text-base-content mb-4'>
                Confirmar cancelación de turno
              </h3>
              {turnoAConfirmar && (
                <div className='mb-6 p-4 bg-base-200 rounded-lg'>
                  <p className='text-base-content'>
                    ¿Estás seguro que deseas cancelar el turno del{' '}
                    <span className='font-medium text-base-content'>
                      {formatearFecha(turnoAConfirmar.fecha)}
                    </span>{' '}
                    a las{' '}
                    <span className='font-medium text-base-content'>
                      {turnoAConfirmar.hora} hs
                    </span>
                    ?
                  </p>
                </div>
              )}
              <div className='flex gap-3'>
                <button
                  onClick={handleCerrarConfirmacion}
                  className='flex-1 px-4 py-2 border border-base-300 text-base-content rounded-lg hover:bg-base-200 transition-colors'
                >
                  No, mantener turno
                </button>
                <button
                  onClick={() => handleConfirmarCancelacion(turnoAConfirmar)}
                  className='flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-red-600 hover:bg-red-700'
                >
                  Sí, cancelar turno
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Booking
