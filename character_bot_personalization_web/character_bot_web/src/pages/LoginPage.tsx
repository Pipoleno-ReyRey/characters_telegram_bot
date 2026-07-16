import { useState, type FormEvent } from 'react'
import { TelegramLogo } from '../components/TelegramLogo'

type AuthMode = 'login' | 'registrer'

type AuthBody = {
  id: number
  name: string
  phone: string
}

type LoginPageProps = {
  onAuthenticated: (name: string) => void
}

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onlyNumbers = (value: string) => value.replace(/\D/g, '')

  const openAuthForm = (mode: AuthMode) => {
    setAuthMode(mode)
    setName('')
    setPhone('')
  }

  const closeAuthForm = () => {
    if (isLoading) return

    setAuthMode(null)
    setName('')
    setPhone('')
  }

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!authMode) return

    setIsLoading(true)

    const body: AuthBody = {
      id: 0,
      name,
      phone,
    }

    try {
      const user = await fetch(`/api/${authMode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((res) => res.json())

      localStorage.setItem('user', JSON.stringify(user))
      console.log({ mode: authMode, ...body })
      onAuthenticated(name)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-400 to-blue-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col items-center gap-4 mb-10">
          <TelegramLogo className="h-20 w-20 shrink-0 drop-shadow-lg" />
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm">
            Character Bot
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-sm">
            Crea y personaliza tu bot de Telegram en minutos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => openAuthForm('login')}
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#229ED9] shadow-lg transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Iniciar sesion
          </button>
          <button
            type="button"
            onClick={() => openAuthForm('registrer')}
            className="rounded-xl border-2 border-white/80 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Registrarse
          </button>
        </div>
      </div>

      {authMode && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {authMode === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
              </h2>
              <button
                type="button"
                onClick={closeAuthForm}
                aria-label="Cerrar"
                disabled={isLoading}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                x
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleAuthSubmit}>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="text-sm font-semibold text-gray-700"
                >
                  Nombre
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre de usuario"
                  autoComplete="name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#229ED9] focus:outline-none focus:ring-2 focus:ring-[#229ED9]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone_number"
                  className="text-sm font-semibold text-gray-700"
                >
                  Numero de telefono
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(onlyNumbers(e.target.value))}
                  placeholder="34600000000"
                  autoComplete="tel"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#229ED9] focus:outline-none focus:ring-2 focus:ring-[#229ED9]/30"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e8bc4] focus:outline-none focus:ring-2 focus:ring-[#229ED9]/40 disabled:cursor-not-allowed disabled:bg-[#7bbfe3]"
              >
                {isLoading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {isLoading
                  ? authMode === 'login' ? 'Entrando...' : 'Registrando...'
                  : authMode === 'login' ? 'Entrar' : 'Registrarme'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
