import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import './App.css'

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

  }, [isDark]);
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1e2939c2]' : 'bg-white'} transition-colors duration-500`}>
      <NavBar isDark={isDark} toggleDark={() => setIsDark(!isDark)} />
      <main className="p-10 flex justify-center">
        {/* Aquí iría tu tarjeta o contenido */}
      </main>
    </div>
  )
}

export default App
