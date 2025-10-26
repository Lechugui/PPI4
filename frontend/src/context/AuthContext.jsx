import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedAuth = localStorage.getItem('paddliemos_session')
    return savedAuth
      ? JSON.parse(savedAuth)
      : {
          user: null,
          loading: false,
          errors: {},
          successMessage: '',
          showSuccessModal: false
        }
  })

  const setUser = updatedUser => {
    setAuthState(prev => ({
      ...prev,
      user: { ...prev.user, ...updatedUser }
    }))
  }

  const navigate = useNavigate()

  const registerContext = async (nombre, email, password) => {
    setAuthState(prev => ({ ...prev, loading: true, errors: {} }))

    try {
      const userData = {
        nombre,
        email,
        contraseña: password,
        role_id: 2
      }

      const response = await fetch('http://127.0.0.1:8000/login/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Error en el registro')
      }

      // Auto-login después del registro
      await login(email, password, '¡Registro exitoso! Serás redirigido...')
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        errors: { general: error.message },
        loading: false
      }))
    }
  }

  // Función para iniciar sesión
  const login = async (
    username,
    password,
    successMessage = '¡Sesión iniciada con éxito!'
  ) => {
    setAuthState(prev => ({ ...prev, loading: true, errors: {} }))

    try {
      const loginData = new URLSearchParams()
      loginData.append('username', username)
      loginData.append('password', password)

      const response = await fetch('http://127.0.0.1:8000/login/try', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: loginData.toString()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Credenciales inválidas')
      }

      if (data.error || data.success === false) {
        throw new Error(data.error || 'Credenciales inválidas')
      }

      const userData = {
        token: data.access_token,
        tokenType: data.token_type,
        id: data.user_id,
        name: data.user_name,
        email: data.user_email,
        role_id: data.role_id //almaceno el role_id 
      }

      console.log("🔑 Usuario logueado:", userData) // Debug para verificar role_id

      localStorage.setItem(
        'paddliemos_session',
        JSON.stringify({
          user: userData,
          loading: false,
          successMessage: '¡Sesión iniciada con éxito!',
          showSuccessModal: true
        })
      )
      // Guardar en localStorage
      localStorage.setItem('authToken', data.access_token)
      localStorage.setItem('userName', data.user_name)

      setAuthState(prev => ({
        ...prev,
        user: userData,
        successMessage,
        showSuccessModal: true,

        loading: false
      }))

      //  Redirección según el rol
      setTimeout(() => {
        if (userData.role_id === 1) {
          navigate('/adminPage') // si es admin
        } else {
          navigate('/') // si es cliente
        }
      }, 2000)


      return true
    } catch (error) {
      localStorage.removeItem('paddliemos_session')
      setAuthState(prev => ({
        ...prev,
        errors: { general: error.message },
        loading: false
      }))
      return false
    }
  }
  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('paddliemos_session')
    localStorage.removeItem('authToken')
    setAuthState({
      user: null,
      loading: false,
      errors: {},
      successMessage: '',
      showSuccessModal: false
    })
  }

  // Función para actualizar errores
  const setErrors = errors => {
    setAuthState(prev => ({ ...prev, errors }))
  }

  // Función para actualizar mensaje de éxito
  const setSuccessMessage = message => {
    setAuthState(prev => ({ ...prev, successMessage: message }))
  }

  // Función para actualizar el modal de éxito
  const setShowSuccessModal = show => {
    setAuthState(prev => ({ ...prev, showSuccessModal: show }))
  }

  const token = localStorage.getItem('authToken')

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        token,
        login,
        logout,
        setErrors,
        setUser,
        setSuccessMessage,
        setShowSuccessModal,
        registerContext
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
