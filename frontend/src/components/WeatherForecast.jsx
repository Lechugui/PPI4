import React, { useState, useEffect } from 'react'

const WeatherForecast = ({ date }) => {
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)

  const LATITUDE = -34.6037
  const LONGITUDE = -58.3816

  useEffect(() => {
    const fetchForecast = async () => {
      if (!date) return

      setLoading(true)
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`
        )
        const data = await response.json()

        const selectedDateStr = date.toISOString().split('T')[0]
        const dateIndex = data.daily.time.indexOf(selectedDateStr)

        if (dateIndex !== -1) {
          setForecast({
            tempMax: Math.round(data.daily.temperature_2m_max[dateIndex]),
            tempMin: Math.round(data.daily.temperature_2m_min[dateIndex]),
            precipitation:
              data.daily.precipitation_probability_max[dateIndex] || 0,
            weatherCode: data.daily.weather_code[dateIndex]
          })
        } else {
          setForecast(null)
        }
      } catch (error) {
        console.error('Error fetching weather forecast:', error)
        setForecast(null)
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [date])

  // Weather code descriptions (WMO Weather interpretation codes)
  const getWeatherDescription = code => {
    const weatherCodes = {
      0: 'Despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',
      71: 'Nevada ligera',
      73: 'Nevada moderada',
      75: 'Nevada intensa',
      77: 'Granizo',
      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos intensos',
      85: 'Chubascos de nieve ligeros',
      86: 'Chubascos de nieve intensos',
      95: 'Tormenta',
      96: 'Tormenta con granizo ligero',
      99: 'Tormenta con granizo intenso'
    }
    return weatherCodes[code] || 'Desconocido'
  }

  // Weather emoji based on code
  const getWeatherEmoji = code => {
    if (code === 0 || code === 1) return '☀️'
    if (code === 2 || code === 3) return '⛅'
    if (code === 45 || code === 48) return '🌫️'
    if (code >= 51 && code <= 55) return '🌦️'
    if (code >= 61 && code <= 65) return '🌧️'
    if (code >= 71 && code <= 77) return '❄️'
    if (code >= 80 && code <= 82) return '🌧️'
    if (code >= 85 && code <= 86) return '🌨️'
    if (code >= 95) return '⛈️'
    return '🌤️'
  }

  if (loading) {
    return (
      <div className='alert alert-info'>
        <span className='loading loading-spinner loading-sm'></span>
        <span>Cargando pronóstico...</span>
      </div>
    )
  }

  if (!forecast) {
    return (
      <div className='alert alert-warning'>
        <span>⚠️</span>
        <span>No hay pronóstico disponible para esta fecha</span>
      </div>
    )
  }

  return (
    <div className='alert alert-info shadow-lg'>
      <div className='flex items-center gap-3 w-full'>
        <span className='text-3xl'>
          {getWeatherEmoji(forecast.weatherCode)}
        </span>
        <div className='flex-1'>
          <h3 className='font-bold'>El clima va a ser:</h3>
          <div className='text-sm'>
            <p>{getWeatherDescription(forecast.weatherCode)}</p>
            <p>
              Temperatura: {forecast.tempMin}°C - {forecast.tempMax}°C
            </p>
            {forecast.precipitation > 0 && (
              <p className='text-warning font-semibold'>
                ⚠️ Probabilidad de lluvia: {forecast.precipitation}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherForecast
