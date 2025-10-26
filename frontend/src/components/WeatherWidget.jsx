import React, { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react'

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const LATITUDE = -34.6037
  const LONGITUDE = -58.3816
  const CITY_NAME = 'Buenos Aires'

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
        )

        if (!response.ok) {
          throw new Error('No se pudo obtener el clima')
        }

        const data = await response.json()
        setWeather(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = weatherCode => {
    // Open Meteo weather codes: https://open-meteo.com/en/docs
    if (weatherCode === 0 || weatherCode === 1) {
      return <Sun className='w-12 h-12 text-yellow-400' />
    } else if (weatherCode === 2 || weatherCode === 3) {
      return <Cloud className='w-12 h-12 text-gray-400' />
    } else if (weatherCode >= 51 && weatherCode <= 67) {
      return <CloudRain className='w-12 h-12 text-blue-400' />
    } else if (weatherCode >= 80 && weatherCode <= 99) {
      return <CloudRain className='w-12 h-12 text-blue-400' />
    }
    return <Cloud className='w-12 h-12 text-gray-400' />
  }

  const getWeatherDescription = weatherCode => {
    const descriptions = {
      0: 'Despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna densa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia fuerte',
      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos fuertes',
      95: 'Tormenta',
      96: 'Tormenta con granizo ligero',
      99: 'Tormenta con granizo fuerte'
    }
    return descriptions[weatherCode] || 'Desconocido'
  }

  if (loading) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h3 className='card-title text-primary'>Clima Actual</h3>
          <div className='flex justify-center py-4'>
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
          <h3 className='card-title text-error'>Error al cargar clima</h3>
          <p className='text-sm text-gray-500'>{error}</p>
        </div>
      </div>
    )
  }

  const currentWeather = weather?.current

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h3 className='card-title text-primary flex items-center gap-2'>
          <Wind className='w-5 h-5' />
          Clima en {CITY_NAME}
        </h3>

        <div className='flex items-center justify-between mt-4'>
          <div className='flex items-center gap-4'>
            {getWeatherIcon(currentWeather?.weather_code)}
            <div>
              <p className='text-4xl font-bold'>
                {Math.round(currentWeather?.temperature_2m)}°C
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-300 capitalize'>
                {getWeatherDescription(currentWeather?.weather_code)}
              </p>
            </div>
          </div>
        </div>

        <div className='divider my-2'></div>

        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div className='flex items-center gap-2'>
            <Droplets className='w-4 h-4 text-blue-500' />
            <span>Humedad: {currentWeather?.relative_humidity_2m}%</span>
          </div>
          <div className='flex items-center gap-2'>
            <Wind className='w-4 h-4 text-gray-500' />
            <span>Viento: {currentWeather?.wind_speed_10m} km/h</span>
          </div>
          <div className='flex items-center gap-2'>
            <span>
              Sensación: {Math.round(currentWeather?.apparent_temperature)}°C
            </span>
          </div>
        </div>

        <div className='mt-4 p-3 bg-info/10 rounded-lg'>
          <p className='text-xs text-center'>
            {currentWeather?.temperature_2m > 25
              ? '☀️ ¡Perfecto para jugar paddle!'
              : currentWeather?.weather_code >= 61 &&
                currentWeather?.weather_code <= 99
              ? '🌧️ Puede que llueva, verifica antes de reservar'
              : '✅ Buen clima para jugar'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WeatherWidget
