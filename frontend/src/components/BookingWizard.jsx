import React from 'react'
import { useBooking } from '../context/BookingContext'
import DateSelector from './DateSelector'
import CourtSelector from './CourtSelector'
import TimeSlotSelector from './TimeSlotSelector'
import BookingConfirmation from './BookingConfirmation'

const BookingWizard = () => {
  const { bookingStep } = useBooking()

  return (
    <div className='w-full max-w-3xl mx-auto'>
      <div className='mb-8'>
        <ul className='steps steps-horizontal w-full'>
          <li className={`step ${bookingStep >= 1 ? 'step-primary' : ''}`}>
            Fecha
          </li>
          <li className={`step ${bookingStep >= 2 ? 'step-primary' : ''}`}>
            Cancha
          </li>
          <li className={`step ${bookingStep >= 3 ? 'step-primary' : ''}`}>
            Horario
          </li>
          <li className={`step ${bookingStep >= 4 ? 'step-primary' : ''}`}>
            Confirmar
          </li>
        </ul>
      </div>

      {bookingStep === 1 && <DateSelector />}
      {bookingStep === 2 && <CourtSelector />}
      {bookingStep === 3 && <TimeSlotSelector />}
      {bookingStep === 4 && <BookingConfirmation />}
    </div>
  )
}

export default BookingWizard
