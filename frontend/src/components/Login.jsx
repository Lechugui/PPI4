import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login () {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const { login, errors, user } = useAuth() //agrego para traer usuario

  const [mensajeExito, setMensajeExito] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showGeneralError, setShowGeneralError] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (errors.general) {
      setShowGeneralError(true)
      const timer = setTimeout(() => {
        setShowGeneralError(false)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setShowGeneralError(false)
    }
  }, [errors.general])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGoBack = () => {
    navigate('/')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setShowGeneralError(false)

    const success = await login(formData.username, formData.password)
    if (success) {
      setMensajeExito('¡Inicio de sesión exitoso!')
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)

        console.log("Usuario actual:", user) // Debug para verificar el usuario
        if (user.role_id === 1) {
          navigate('/adminPage') //si es admin lo mando al dashboard de admin
        } else {
          navigate('/') //si no es admin lo mando al home
        }
      }, 2000)
    } else {
      null
    }
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-200'>
      <div className='bg-base-100 shadow-md rounded-lg p-8 w-full max-w-md'>
        <h2 className='text-2xl font-semibold mb-4 text-primary'>
          Iniciar Sesión
        </h2>
        {showGeneralError && errors.general && (
          <div className='alert alert-error mb-4'>{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              className='block text-gray-200 text-sm font-bold mb-2'
              htmlFor='username'
            >
              Email:
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
              id='username'
              type='email'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Ingrese su email'
            />
            {errors.username && (
              <p className='text-red-500 text-xs italic'>{errors.username}</p>
            )}
          </div>
          <div>
            <label
              className='block text-gray-200 text-sm font-bold mb-2'
              htmlFor='password'
            >
              Contraseña:
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Ingrese su contraseña'
            />
            {errors.password && (
              <p className='text-red-500 text-xs italic'>{errors.password}</p>
            )}
          </div>
          <div className='w-40 mx-auto flex flex-col space-y-2'>
            <button
              type='submit'
              className='btn btn-primary rounded-lg w-full text-black'
            >
              Ingresar
            </button>
            <button
              type='button'
              onClick={handleGoBack}
              className='btn btn-secondary rounded-lg w-full text-black'
            >
              Volver
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className='modal modal-open backdrop-blur-sm'>
          <div className='modal-box'>
            <h3 className='font-bold text-lg text-success'>¡Éxito!</h3>
            <p className='py-2'>{mensajeExito}</p>
            <p className='py-2'>
              Aguarde unos instantes, será redirigido a la página principal.
            </p>
            <div className='modal-action'></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
