import { useState } from 'react'
import { PersonalizationPage } from './pages/PersonalizationPage'
import { LoginPage } from './pages/LoginPage'

function App() {
  const [username, setUsername] = useState<string | null>(null)

  if (username) {
    return <PersonalizationPage username={username} />
  }

  return <LoginPage onAuthenticated={setUsername} />
}

export default App

