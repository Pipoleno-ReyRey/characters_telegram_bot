import { useState } from 'react'
import { TelegramLogo } from '../components/TelegramLogo'

type BotPersonalizationBody = {
  character: string
  description: string
  user: JSON
}

type PersonalizationPageProps = {
  username: string
}

export function PersonalizationPage({ username }: PersonalizationPageProps) {
  const [characterName, setCharacterName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const user: JSON = JSON.parse(localStorage.getItem('user') || '{}')
  const handleSubmit = async () => {
    setIsLoading(true)

    const body: BotPersonalizationBody = {
      character: characterName,
      description,
      user: user,
    }

    try {
     const response = await fetch(`/api/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      setUrl((await response.json()).url)
    } finally {
      setIsLoading(false)
    }

    console.log(body)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-400 to-blue-600 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl p-8 md:p-10">
        <div className="flex flex-col items-center gap-4 mb-8">
          <TelegramLogo className="h-16 w-16 shrink-0" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Personaliza tu propio bot
          </h1>
          <p className="text-sm text-gray-500">Hola, {username}</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="character_name"
              className="text-sm font-semibold text-gray-700"
            >
              Nombre del personaje
            </label>
            <input
              id="character_name"
              name="character_name"
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Ej: Luna, Max, Sofia..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe la personalidad, tono y estilo de tu bot..."
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition"
            />
          </div>

          <button
            type="button"
            onClick={async() => {await handleSubmit()}}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1e8bc4] focus:outline-none focus:ring-2 focus:ring-[#229ED9]/40 disabled:cursor-not-allowed disabled:bg-[#7bbfe3]"
          >
            {isLoading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isLoading ? 'Creando...' : 'Enviar'}
          </button>
        </form>

        {url !== '' ? (
          <div className="flex flex-col items-center gap-4 mb-8 px-4 mt-6">
          <p className="text-xl text-gray-500">Tu bot personalizado: </p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
        </div>
        ): null}
      </div>
    </div>
  )
}
