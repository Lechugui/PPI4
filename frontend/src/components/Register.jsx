import React, { useState } from 'react'

function Register () {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  })

  const [errores, setErrores] = useState({})
  const [mensajeExito, setMensajeExito] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setErrores({})
    setMensajeExito('')

    const nuevosErrores = {}
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido.'
    }
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'El email no es válido.'
    }
    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es requerida.'
    } else if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.'
    }
    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no son coincidentes.'
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    try {
      //TODO ver de conectarlo todo al back para la persistencia
      console.log('Datos enviados al servidor:', formData)
      setMensajeExito('Se ha registrado el nuevo usuario')
      setFormData({
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: ''
      })
    } catch (error) {
      console.error('Error al registrar el usuario:', error)
      setErrores({
        general:
          'Hubo un error al registrar el usuario. Inténtelo de nuevo, por favor'
      })
    }
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-200'>
      <div className='bg-base-100 shadow-md rounded-lg p-8 w-full max-w-md'>
        <h2 className='text-2xl font-semibold mb-4 text-primary'>
          Registro de Usuario
        </h2>
        {mensajeExito && (
          <div className='alert alert-success mb-4'>{mensajeExito}</div>
        )}
        {errores.general && (
          <div className='alert alert-error mb-4'>{errores.general}</div>
        )}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='nombre'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Nombre:
            </label>
            <input
              type='text'
              id='nombre'
              name='nombre'
              value={formData.nombre}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            {errores.nombre && (
              <p className='text-red-500 text-xs italic'>{errores.nombre}</p>
            )}
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Email:
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            {errores.email && (
              <p className='text-red-500 text-xs italic'>{errores.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Contraseña:
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            {errores.password && (
              <p className='text-red-500 text-xs italic'>{errores.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor='confirmarPassword'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Confirmar Contraseña:
            </label>
            <input
              type='password'
              id='confirmarPassword'
              name='confirmarPassword'
              value={formData.confirmarPassword}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            {errores.confirmarPassword && (
              <p className='text-red-500 text-xs italic'>
                {errores.confirmarPassword}
              </p>
            )}
          </div>
          <button
            type='submit'
            className='bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
