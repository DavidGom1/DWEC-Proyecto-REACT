import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import Cookies from 'universal-cookie';
import './App.css'
import ConsultaMeteo from './components/ConsultaMeteo';
import SelectorProvincia from './components/Selector';
import provincias from './data/provincias.json'

const cookies = new Cookies();

function App() {
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
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
      <main className="p-10 flex justify-center gap-3">
        <ConsultaMeteo isDark={isDark} idProvincia={provinciaSeleccionada?.id}/>
        <div>
          <SelectorProvincia 
            coleccion={provincias} 
            onSelect={(prov) => setProvinciaSeleccionada(prov)}
            placeholder="Seleccionar provincia" />
        </div>
      </main>
    </div>
  )
}

export default App
