import { useEffect, useState } from 'react'

export default function ConsultaMeteo({ isDark }) {

    const [info, setInfo] = useState(null);

    useEffect(() => {
        const buscaMeteo = async () => {
            const respuesta = await fetch('/api/meteorologia/28');
            const datos = await respuesta.json();
            const contenido = datos.data['contenido']
            console.log(contenido)
            return contenido;
        };

        setInfo(buscaMeteo());
    }, []); 

    return (
        <div className={`border-2 rounded-[20px] p-3 ${isDark ? 'bg-[#adadad] border-[#1d1d1d] ' : 'bg-white border-[#8f8f8f] '}`}>
            <pre>{info}</pre>
        </div>
    );
}
