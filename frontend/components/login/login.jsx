import React from 'react';

function Login() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-200">
      <div className="bg-base-100 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Iniciar Sesión</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Usuario:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Tu nombre de usuario"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Tu contraseña"
            />
          </div>
          <button className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;