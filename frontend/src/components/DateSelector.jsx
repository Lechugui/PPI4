import React from 'react'
import { useState } from 'react'
import { useBooking } from '../context/BookingContext'

const DateSelector = () => {
  const { setSelectedDate, setBookingStep } = useBooking()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // generación de días
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1))
  }

  const handleDateSelect = day => {
    const selectedDate = new Date(year, month, day)
    setSelectedDate(selectedDate)
    setBookingStep(2) // court selection
  }

  // validate if a date is in the past
  const isPastDate = day => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(year, month, day)
    return checkDate < today
  }

  // generate calendar days
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className='h-10'></div>)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isDisabled = isPastDate(day)
    calendarDays.push(
      <button
        key={day}
        onClick={() => !isDisabled && handleDateSelect(day)}
        disabled={isDisabled}
        className={`h-10 w-10 rounded-full flex items-center justify-center 
          ${
            isDisabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'hover:bg-primary hover:text-white cursor-pointer'
          }`}
      >
        {day}
      </button>
    )
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title text-primary'>Selecciona una fecha</h2>

        <div className='flex justify-between items-center mb-4'>
          <button onClick={handlePrevMonth} className='btn btn-circle btn-sm'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <span className='text-lg font-medium'>
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className='btn btn-circle btn-sm'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>

        <div className='grid grid-cols-7 gap-1 mb-2'>
          {dayNames.map(day => (
            <div key={day} className='text-center font-medium text-sm'>
              {day}
            </div>
          ))}
        </div>

        <div className='grid grid-cols-7 gap-1'>{calendarDays}</div>
      </div>
    </div>
  )
}

export default DateSelector
