import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function UserList () {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null) //  fila en edición
  const [editedUser, setEditedUser] = useState({}) //  datos editados
  const [savingId, setSavingId] = useState(null) //  spinner por fila
  const navigate = useNavigate()

  // Obtener lista de usuarios
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al cargar usuarios')
      const data = await res.json()
      const normalized = data.map(u => ({
        ...u,
        role_id: Number(u.role_id)
      }))
      setUsers(normalized)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Eliminar usuario
  const deleteUser = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return
    try {
      const res = await fetch(`http://127.0.0.1:8000/login/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al eliminar usuario')
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  // Modo edición para una fila
  const startEdit = user => {
    setEditingId(user.id)
    setEditedUser({
      id: user.id,
      nombre: user.nombre ?? '',
      email: user.email ?? '',
      role_id: user.role?.id ?? user.role_id ?? 2
    })
  }

  // Cancelar edición
  const cancelEdit = () => {
    setEditingId(null)
    setEditedUser({})
  }

  // Guardar cambios (PUT)
  const saveEdit = async () => {
    const { id, nombre, email, role_id } = editedUser

    // Evito un put innecesario si no hubo cambios
    const original = users.find(u => u.id === id)
    const originalRoleId = original.role?.id ?? original.role_id ?? null

    const changed =
      original.nombre !== nombre ||
      original.email !== email ||
      Number(originalRoleId) !== Number(role_id)
    if (!changed) {
      cancelEdit()
      return
    }

    // Validaciones mínimas
    if (!nombre.trim()) return alert('El nombre es requerido.')
    if (!email.trim()) return alert('El email es requerido.')

    try {
      setSavingId(id)
      const res = await fetch(`http://127.0.0.1:8000/login/users/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, role_id: Number(role_id) })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Error al actualizar usuario')
      }

      const updated = await res.json()

      // Actualizar la fila en el estado local
      setUsers(prev =>
        prev.map(u =>
          u.id === id ? { ...u, ...updated, role: updated.role ?? u.role } : u
        )
      )

      cancelEdit()
    } catch (err) {
      alert(err.message)
    } finally {
      setSavingId(null)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <p>Cargando usuarios...</p>
  if (error) return <p className='text-error'>{error}</p>

  return (
    <div className='p-6 bg-base-200 min-h-screen'>
      <button
        className='btn btn-outline mb-4'
        onClick={() => navigate('/adminPage')}
      >
        Volver
      </button>
      <h2 className='text-2xl font-bold mb-4 text-primary'>Usuarios</h2>

      <div className='overflow-x-auto'>
        <table className='table w-full bg-base-100 shadow-md rounded-lg'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th className='w-56'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const isEditing = editingId === u.id
              return (
                <tr key={u.id}>
                  <td>{u.id}</td>

                  {/* Nombre */}
                  <td>
                    {isEditing ? (
                      <input
                        className='input input-sm input-bordered w-full'
                        value={editedUser.nombre}
                        onChange={e =>
                          setEditedUser(prev => ({
                            ...prev,
                            nombre: e.target.value
                          }))
                        }
                      />
                    ) : (
                      u.nombre
                    )}
                  </td>

                  {/* Email */}
                  <td>
                    {isEditing ? (
                      <input
                        className='input input-sm input-bordered w-full'
                        type='email'
                        value={editedUser.email}
                        onChange={e =>
                          setEditedUser(prev => ({
                            ...prev,
                            email: e.target.value
                          }))
                        }
                      />
                    ) : (
                      u.email
                    )}
                  </td>

                  {/* Rol */}
                  <td>
                    {isEditing ? (
                      <select
                        className='select select-sm select-bordered'
                        value={Number(editedUser.role_id)}
                        onChange={e =>
                          setEditedUser(prev => ({
                            ...prev,
                            role_id: Number(e.target.value)
                          }))
                        }
                      >
                        <option value={1}>Admin</option>
                        <option value={2}>Cliente</option>
                      </select>
                    ) : Number(u.role_id) === 1 ? (
                      'Admin'
                    ) : (
                      'Cliente'
                    )}
                  </td>

                  {/* Acciones */}
                  <td className='flex gap-2'>
                    {isEditing ? (
                      <>
                        <button
                          className={`btn btn-sm btn-primary ${
                            savingId === u.id ? 'btn-disabled' : ''
                          }`}
                          onClick={saveEdit}
                          disabled={savingId === u.id}
                        >
                          {savingId === u.id ? (
                            <span className='loading loading-spinner loading-xs' />
                          ) : (
                            'Guardar'
                          )}
                        </button>
                        <button
                          className='btn btn-sm btn-ghost'
                          onClick={cancelEdit}
                          disabled={savingId === u.id}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className='btn btn-success btn-sm'
                          onClick={() => startEdit(u)}
                        >
                          Editar
                        </button>
                        <button
                          className='btn btn-error btn-sm'
                          onClick={() => deleteUser(u.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserList
