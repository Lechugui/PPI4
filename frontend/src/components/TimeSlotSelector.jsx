import React, { useEffect } from 'react'
import { useBooking } from '../context/BookingContext'

const TimeSlotSelector = () => {
  const {
    selectedDate,
    selectedCourt,
    selectedTimeSlot,
    setSelectedTimeSlot,
    setBookingStep,
    generateTimeSlots,
    timeSlots,
    loading,
    error
  } = useBooking()

  useEffect(() => {
    if (selectedDate && selectedCourt) {
      generateTimeSlots(selectedDate)
    }
  }, [selectedDate, selectedCourt, generateTimeSlots])

  const handleTimeSlotSelect = timeSlot => {
    if (!timeSlot.available) return
    setSelectedTimeSlot(timeSlot)
    setBookingStep(4) // confirmar
  }

  const handleBack = () => {
    setBookingStep(2) // seleccionar cancha
  }

  // formatear fecha
  const formatDate = date => {
    if (!date) return ''
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return date.toLocaleDateString('es-ES', options)
  }

  if (loading) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title text-primary'>Cargando horarios...</h2>
          <div className='flex justify-center'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title text-error'>Error</h2>
          <p>{error}</p>
          <div className='card-actions justify-end'>
            <button
              onClick={() => generateTimeSlots(selectedDate)}
              className='btn btn-primary'
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title text-primary'>Selecciona un horario</h2>
        <p className='text-sm mb-2'>
          {selectedCourt?.nombre} - {formatDate(selectedDate)}
        </p>

        {timeSlots.length === 0 ? (
          <p className='my-4'>No hay horarios disponibles para esta fecha</p>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4'>
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => handleTimeSlotSelect(slot)}
                disabled={!slot.available}
                className={`btn ${
                  selectedTimeSlot?.id === slot.id
                    ? 'btn-primary'
                    : slot.available
                    ? 'btn-outline'
                    : 'btn-disabled'
                }`}
              >
                {slot.start} - {slot.end}
              </button>
            ))}
          </div>
        )}

        <div className='card-actions justify-between mt-6'>
          <button onClick={handleBack} className='btn btn-outline'>
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimeSlotSelector
