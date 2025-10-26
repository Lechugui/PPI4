import React, { useEffect, useState } from 'react'
import { useBooking } from '../context/BookingContext'

const CourtSelector = () => {
  const {
    courts,
    selectedCourt,
    setSelectedCourt,
    setBookingStep,
    fetchCourts,
    loading,
    error,
    selectedDate
  } = useBooking()
  const [weatherData, setWeatherData] = useState(null)
  const [loadingWeather, setLoadingWeather] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      fetchWeatherForDate()
    }
  }, [selectedDate])

  const fetchWeatherForDate = async () => {
    setLoadingWeather(true)
    try {
      const LATITUDE = -34.6037 // Buenos Aires, Argentina - Change to your location
      const LONGITUDE = -58.3816
      const CITY_NAME = 'Buenos Aires'

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto&forecast_days=14`
      )
      const data = await response.json()

      // Find the weather for the selected date
      const dateIndex = data.daily.time.findIndex(d => d === selectedDate)
      if (dateIndex !== -1) {
        setWeatherData({
          temp_max: data.daily.temperature_2m_max[dateIndex],
          temp_min: data.daily.temperature_2m_min[dateIndex],
          precipitation: data.daily.precipitation_probability_max[dateIndex],
          weather_code: data.daily.weather_code[dateIndex]
        })
      }
    } catch (err) {
      console.error('Error fetching weather:', err)
    } finally {
      setLoadingWeather(false)
    }
  }

  useEffect(() => {
    fetchCourts()
  }, [fetchCourts])

  const handleCourtSelect = court => {
    setSelectedCourt(court)
    setBookingStep(3)
  }

  const handleBack = () => {
    setBookingStep(1)
  }

  const isRainyDay = weatherData && weatherData.precipitation > 50
  const roofedCourts = courts.filter(c => c.techo)
  const hasRoofedCourts = roofedCourts.length > 0

  if (loading) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title text-primary'>Cargando canchas...</h2>
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
            <button onClick={fetchCourts} className='btn btn-primary'>
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
        <h2 className='card-title text-primary'>Selecciona una cancha</h2>

        {weatherData && !loadingWeather && (
          <div
            className={`alert ${
              isRainyDay ? 'alert-warning' : 'alert-info'
            } mt-4`}
          >
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                className='stroke-current shrink-0 w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                ></path>
              </svg>
              <div>
                <h3 className='font-bold'>El clima va a ser:</h3>
                <div className='text-sm'>
                  Temperatura: {weatherData.temp_min}°C - {weatherData.temp_max}
                  °C
                  <br />
                  Probabilidad de lluvia: {weatherData.precipitation}%
                </div>
                {isRainyDay && (
                  <div className='mt-2 font-semibold'>
                    {hasRoofedCourts ? (
                      <span className='text-success'>
                        🏠 Recomendamos canchas con techo para este día
                      </span>
                    ) : (
                      <span className='text-error'>
                        ⚠️ Los días de lluvia pueden suceder cancelaciones por
                        su seguridad, lo sentimos
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {courts.length === 0 ? (
          <p>No hay canchas disponibles</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            {[...courts]
              .sort((a, b) => {
                if (isRainyDay) {
                  return b.techo - a.techo
                }
                return 0
              })
              .map(court => (
                <div
                  key={court.id}
                  onClick={() => handleCourtSelect(court)}
                  className={`card bg-base-200 cursor-pointer transition-all hover:bg-primary hover:text-white
                    ${
                      selectedCourt?.id === court.id
                        ? 'bg-primary text-white'
                        : ''
                    }
                    ${isRainyDay && court.techo ? 'ring-2 ring-success' : ''}`}
                >
                  <div className='card-body p-4'>
                    <h3 className='card-title text-lg'>
                      {court.nombre}
                      {isRainyDay && court.techo && (
                        <span className='text-success'>⭐</span>
                      )}
                    </h3>
                    <p>{court.ubicacion}</p>
                    <div className='flex gap-2 mt-2'>
                      {court.techo ? (
                        <div className='badge badge-success'>🏠 Con techo</div>
                      ) : (
                        <div className='badge badge-info'>☀️ Sin techo</div>
                      )}
                      {!court.disponible && (
                        <div className='badge badge-warning'>No disponible</div>
                      )}
                    </div>
                  </div>
                </div>
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

export default CourtSelector
