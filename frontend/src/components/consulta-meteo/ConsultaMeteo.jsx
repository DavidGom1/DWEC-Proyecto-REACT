import { useEffect, useState } from 'react'

export default function ConsultaMeteo({ isDark, idProvincia, idMunicipio }) {
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const buscaMeteo = async () => {
            if (!idProvincia) return;
            setLoading(true);
            try {
                if(idMunicipio!=null){
                    const respuesta = await fetch(`/api/meteorologia/municipio/${idMunicipio}`);
                    const json = await respuesta.json();
                    const data = json.data[0];
                    console.log(data);
                    let nombreProvincia = `${data.nombre} - ${data.provincia}`;
                    let descripcion = '';
                    let temps = [];
                    data.prediccion.dia.forEach((p, i) => {
                        console.log(i)
                        temps.push({dia: i==0?'Hoy': i==1?'Mañana':p.fecha.split('T')[0].split('-').reverse().join('/'), min: p.temperatura.minima, max: p.temperatura.maxima})
                    });
                    setDatos({ nombreProvincia, descripcion, temps})
                } else {
                    const respuesta = await fetch(`/api/meteorologia/provincia/${idProvincia}`);
                    const json = await respuesta.json();
                    const texto = json.data.contenido.replace(/\r/g, '');

                    const partes = texto.split(/TEMPERATURAS MÍNIMAS/i);
                    const cabeceraYDesc = partes[0].split(/\n/);
                    const nombreProvincia = cabeceraYDesc[5].trim();
                    let descripcion = cabeceraYDesc.slice(6, cabeceraYDesc.length).join(' ');
                    console.log(descripcion)
                    if(descripcion==".  ") descripcion = 'No hay descripción en texto para esta provincia.'
                    descripcion = descripcion.replace('.', '.\n');
                    const regexTemps = /^([a-zA-ZáéíóúÁÉÍÓÚñÑ\/ ]+?)\s+(-?\d+)\s+(-?\d+)\s*$/gm;
                    let temps = [];
                    let m;
                    while ((m = regexTemps.exec(texto)) !== null) {
                        temps.push({ municipio: m[1].trim(), min: m[2], max: m[3] });
                    }
                    setDatos({ nombreProvincia, descripcion, temps });
                }
            } catch (e) {
                console.error("Error parseando:", e);
            } finally {
                setLoading(false);
            }
        };
        buscaMeteo();
    }, [idProvincia, idMunicipio]);


    return (
        <div className={`rounded-[20px] w-full lg:w-4xl md:w-2xl overflow-hidden shadow-lg border ${
            isDark ? 'bg-[#2d2d2d] border-[#1d1d1d] text-gray-200' : 'bg-white border-gray-200 text-gray-800'
        }`}>
            <div className="p-5 border-b border-gray-500/20">
                <h3 className="text-xl uppercase tracking-widest font-bold opacity-50 mb-2">{loading ? 'cargando...' : !idProvincia ? 'Selecciona una provincia para comenzar' : !idMunicipio ? 'Predicción para' : 'Predicción diaria'} {loading ? '' : datos?.nombreProvincia}</h3>
                <p className="text-lg leading-relaxed font-medium whitespace-pre-line">
                    {loading ? '' : datos?.descripcion}
                </p>
            </div>
            <div className="p-5 bg-black/5">
                <h3 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-4">{loading ? '' : !idProvincia ? 'Luego podrás escoger un municipio de la provincia si necesitas su predicción.' : !idMunicipio ? 'Temperaturas municipios principales' : 'Diaria'}</h3>
                <div className="grid grid-cols-1 gap-3">
                    {loading ? '' : datos?.temps.map((t, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                            <span className="font-semibold">{t.municipio?t.municipio:t.dia}</span>
                            <div className="flex gap-4">
                                <span className="text-blue-400 font-mono">Min: {t.min}°</span>
                                <span className="text-red-400 font-mono">Max: {t.max}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}