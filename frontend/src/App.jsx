import React from 'react'
import './App.css'

function App () {
  return (
    <main className='min-h-screen bg-base-200 flex items-center justify-center'>
      <section className='text-center space-y-8'>
        <header>
          <h1 className='text-5xl font-bold text-primary'>
            Reservá tu turno en Paddliemos
          </h1>
          <p className='text-lg text-secondary'>
            ¡Reserva fácilmente tu cancha de paddle para jugar con amigos o
            practicar!
          </p>
        </header>

        <nav className='flex justify-center space-x-6'>
          <button className='btn btn-accent'>Seleccionar Fecha</button>
          <button className='btn btn-accent'>Seleccionar Hora</button>
        </nav>

        <article className='mt-8'>
          <h2 className='text-3xl font-semibold text-primary'>
            Detalles de la Reserva
          </h2>
          <section className='mt-4 bg-base-100 shadow-xl card w-96 mx-auto'>
            <div className='card-body'>
              <h3 className='card-title'>Confirmar Turno</h3>
              <p>Fecha: Lunes, 1 de Mayo</p>
              <p>Hora: 18:00 - 19:00</p>
              <button className='btn btn-primary mt-4'>Reservar</button>
            </div>
          </section>
        </article>

        <aside className='mt-8'>
          <section className='card bg-base-100 shadow-xl w-96 mx-auto'>
            <div className='card-body'>
              <h2 className='card-title'>¿Cómo funciona?</h2>
              <ul>
                <li>1. Elige una fecha disponible.</li>
                <li>2. Selecciona un horario para tu turno.</li>
                <li>3. Confirma tu reserva y ¡listo!</li>
              </ul>
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default App
