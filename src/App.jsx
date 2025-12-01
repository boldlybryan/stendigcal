import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <h1 className="font-display text-4xl">Stendig Calendar</h1>
    </div>
  )
}

export default App
