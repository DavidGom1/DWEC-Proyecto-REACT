import { useEffect } from 'react'

export default function ConsultaMeteo({ isDark }) {
    useEffect(() => {
        // 1. AQUÍ VA TU CÓDIGO (La acción)
        console.log("¡Hola! Me acabo de cargar");

    }, []); // 2. AQUÍ VAN LAS DEPENDENCIAS (¿Cuándo se repite esto?)
    return (
        <div className={`border-2 rounded-[20px] p-3 ${isDark ? 'bg-[#adadad] border-[#1d1d1d] ' : 'bg-white border-[#8f8f8f] '}`}>
            <h1></h1>
        </div>
    );
}
