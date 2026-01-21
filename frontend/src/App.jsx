import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import Cookies from 'universal-cookie';
import './App.css'

const cookies = new Cookies();

function App() {
  const [isDark, setIsDark] = useState(() => {
    const modeCookie = cookies.get('darkMode');
    return modeCookie;
  });
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      cookies.set('darkMode', true, {path: '/', maxAge: 31536000, secure: true, sameSite: 'lax'});
    } else {
      document.documentElement.classList.remove('dark');
      cookies.set('darkMode', false, {path: '/', maxAge: 31536000, secure: true, sameSite: 'lax'});
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
