import { useState, useEffect } from 'react'
import NavBar from './components/navbar/NavBar'
import Cookies from 'universal-cookie';
import './App.css'
import ConsultaMeteo from './components/consulta-meteo/ConsultaMeteo';
import SelectorProvincia from './components/selector/Selector';

const cookies = new Cookies();

function App() {
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
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

  useEffect(() => {
    fetch('/api/provincias')
      .then(res => res.json())
      .then(data => {
        setProvincias(data);
      })
      .catch(err => {
        console.error("Error: ", err);
      });
  }, []);

  useEffect(() => {
    if(provinciaSeleccionada!=null){
      fetch(`/api/municipios/${provinciaSeleccionada.id}`)
        .then(res => res.json())
        .then(data => {
          setMunicipios(data);
        })
        .catch(err => {
          console.error('Error: ', err);
        })
      }
  }, [provinciaSeleccionada]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1e2939c2]' : 'bg-white'} transition-colors duration-500`}>
      <NavBar isDark={isDark} toggleDark={() => setIsDark(!isDark)} />
      <main className="p-10 flex flex-col items-center gap-3">
        <div className="pb-5 flex justify-evenly gap-4 max-w-[500px]">
          <SelectorProvincia 
            label="Provincia"
            coleccion={provincias} 
            onSelect={(prov) => setProvinciaSeleccionada(prov)}
            placeholder="Seleccionar provincia"
            isDark={isDark} />
          <SelectorProvincia 
            label="Municipio"
            coleccion={municipios}
            onSelect={(mun) => setMunicipioSeleccionado(mun)}
            placeholder={provinciaSeleccionada ? "Seleccionar municipio" : "Provincia primero"}
            isDark={isDark} />
        </div>
        <div>
          <ConsultaMeteo 
            isDark={isDark} 
            idProvincia={provinciaSeleccionada?.id} 
            idMunicipio={municipioSeleccionado?.id}/>
        </div>
      </main>
    </div>
  )
}

export default App
