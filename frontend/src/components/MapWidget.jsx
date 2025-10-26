import React, { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

const MapWidget = () => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const COURT_LOCATION = {
    lat: -34.6037,
    lng: -58.3816,
    name: 'Paddliemos - Canchas de Paddle'
  }

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async = true

    script.onload = () => {
      if (mapRef.current && !mapInstanceRef.current && window.L) {
        const map = window.L.map(mapRef.current).setView(
          [COURT_LOCATION.lat, COURT_LOCATION.lng],
          15
        )

        window.L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }
        ).addTo(map)
        const marker = window.L.marker([
          COURT_LOCATION.lat,
          COURT_LOCATION.lng
        ]).addTo(map)
        marker
          .bindPopup(`<b>${COURT_LOCATION.name}</b><br>¡Ven a jugar!`)
          .openPopup()

        mapInstanceRef.current = map
      }
    }

    document.body.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${COURT_LOCATION.lat},${COURT_LOCATION.lng}`
    window.open(url, '_blank')
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body p-0'>
        <div className='p-4'>
          <h3 className='card-title text-primary flex items-center gap-2'>
            <MapPin className='w-5 h-5' />
            Ubicación de las Canchas
          </h3>
          <p className='text-sm text-gray-500 mt-1'>
            Encuéntranos fácilmente y planifica tu visita
          </p>
        </div>
        <div
          ref={mapRef}
          className='w-full h-64 bg-gray-200'
          style={{ minHeight: '256px' }}
        />

        <div className='p-4'>
          <button
            onClick={handleGetDirections}
            className='btn btn-primary btn-sm w-full'
          >
            <MapPin className='w-4 h-4' />
            Cómo llegar
          </button>
          <p className='text-xs text-center text-gray-500 mt-2'>
            📍 {COURT_LOCATION.name}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MapWidget
