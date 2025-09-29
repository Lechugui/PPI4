import React from 'react'
import { BookingProvider } from '../context/BookingContext'
import BookingWizard from './BookingWizard'
import ThemeToggle from './ThemeToggle'
import { useNavigate } from 'react-router-dom'

function Home () {
  const navigate = useNavigate()

  /*   const handleLoginClick = () => {
    navigate('/login')
  }
 */
  const handleRegisterClick = () => {
    navigate('/register')
  }

  return (
    <BookingProvider>
      <div className='absolute top-4 right-4 space-x-2'>
        {/*<button className='btn btn-sm btn-primary mt-4' onClick={handleLoginClick}>
          Ingresar
        </button>*/}
        <button
          className='btn btn-sm btn-secondary mt-4'
          onClick={handleRegisterClick}
        >
          Registrate
        </button>
      </div>

      <main className='min-h-screen bg-base-200 flex flex-col'>
        <header className='bg-base-100 shadow-md py-4'>
          <div className='container mx-auto px-4 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <img src={'/paddliemos.webp'} alt='logo' className='w-22 h-22' />
              <span>
                <h1 className='text-3xl font-bold text-primary'>Paddliemos</h1>
                <p className='text-secondary'>
                  Sistema de reservas de canchas de paddle
                </p>
              </span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <section className='container mx-auto px-4 py-8 flex-grow'>
          <div className='text-center mb-8'>
            <h2 className='text-4xl font-bold text-primary mb-2'>
              Reservá tu turno
            </h2>
            <p className='text-lg text-secondary'>
              ¡Reserva fácilmente tu cancha de paddle para jugar con amigos o
              practicar!
            </p>
          </div>

          <BookingWizard />
        </section>

        <footer className='bg-base-100 py-6'>
          <div className='container mx-auto px-4 text-center'>
            <p className='text-sm'>
              © 2025 Paddliemos - Todos los derechos reservados
            </p>
          </div>
        </footer>
      </main>
    </BookingProvider>
  )
}

export default Home
