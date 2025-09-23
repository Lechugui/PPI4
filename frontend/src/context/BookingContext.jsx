import React, { createContext, useContext, useState, useCallback } from 'react'

const API_URL = 'http://localhost:8000' // despues lo mandamos al .env

const BookingContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingContext)

export const BookingProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [courts, setCourts] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCourts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/courts`)
      if (!response.ok) {
        throw new Error('Failed to fetch courts')
      }
      const data = await response.json()
      setCourts(data)
    } catch (err) {
      console.error('Error fetching courts:', err)
      setError('Error loading courts. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const generateTimeSlots = useCallback(
    async date => {
      if (!date || !selectedCourt) return []

      setLoading(true)
      setError(null)

      try {
        const formattedDate = date.toISOString().split('T')[0]
        const response = await fetch(
          `${API_URL}/courts/${selectedCourt.id}/available-slots?fecha=${formattedDate}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch available time slots')
        }

        const data = await response.json()

        // Transform API data to match our frontend format
        const formattedTimeSlots = data.map(slot => ({
          id: slot.id,
          start: slot.hora_inicio,
          end: slot.hora_fin,
          available: slot.available
        }))

        setTimeSlots(formattedTimeSlots)
        return formattedTimeSlots
      } catch (err) {
        console.error('Error fetching time slots:', err)
        setError('Error loading time slots. Please try again.')
        return []
      } finally {
        setLoading(false)
      }
    },
    [selectedCourt]
  )

  const resetBooking = () => {
    setSelectedDate(null)
    setSelectedCourt(null)
    setSelectedTimeSlot(null)
    setBookingStep(1)
  }

  const confirmBooking = async () => {
    if (!selectedDate || !selectedCourt || !selectedTimeSlot) {
      setError('Missing booking information')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      // formateo YYYY-MM-DD para la API
      const formattedDate = selectedDate.toISOString().split('T')[0]

      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: 1, // TODO: cambiarlo por el ID del usuario que obtengamos del usercontext
          court_id: selectedCourt.id,
          fecha: formattedDate,
          time_slot_id: selectedTimeSlot.id,
          status_id: 1 // 1 es el status "confirmado"
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create reservation')
      }

      const data = await response.json()
      return {
        success: true,
        bookingId: data.id
      }
    } catch (err) {
      console.error('Error confirming booking:', err)
      setError(
        err.message || 'Error confirming your booking. Please try again.'
      )
      return null
    } finally {
      setLoading(false)
    }
  }

  const value = {
    selectedDate,
    setSelectedDate,
    selectedCourt,
    setSelectedCourt,
    selectedTimeSlot,
    setSelectedTimeSlot,
    bookingStep,
    setBookingStep,
    courts,
    fetchCourts,
    timeSlots,
    generateTimeSlots,
    resetBooking,
    confirmBooking,
    loading,
    error
  }

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  )
}
