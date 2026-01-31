import { useEffect, useState } from 'react'

export default function ConsultaMeteo({ isDark, idProvincia, idMunicipio }) {
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log(idMunicipio)

    useEffect(() => {
        const buscaMeteo = async () => {
            if (!idProvincia) return;
            setLoading(true);
            try {
                const respuesta = await fetch(`/api/meteorologia/${idProvincia}`);
                const json = await respuesta.json();
                const texto = json.data.contenido.replace(/\r/g, '');

                const partes = texto.split(/TEMPERATURAS MÍNIMAS/i);
                const cabeceraYDesc = partes[0].split(/\n/);
                const nombreProvincia = cabeceraYDesc[5].trim();
                let descripcion = cabeceraYDesc.slice(6, cabeceraYDesc.length).join(' ');
                descripcion = descripcion.replace('.', '.\n');
                const regexTemps = /^([a-zA-ZáéíóúÁÉÍÓÚñÑ\/ ]+?)\s+(-?\d+)\s+(-?\d+)\s*$/gm;
                let temps = [];
                let m;
                while ((m = regexTemps.exec(texto)) !== null) {
                    temps.push({ municipio: m[1].trim(), min: m[2], max: m[3] });
                }

                setDatos({ nombreProvincia, descripcion, temps });
            } catch (e) {
                console.error("Error parseando:", e);
            } finally {
                setLoading(false);
            }
        };
        buscaMeteo();
    }, [idProvincia]);

    if (!idProvincia) return <p className="p-4 text-center opacity-50">Selecciona una provincia</p>;
    if (loading) return <p className="p-4 text-center animate-pulse">Cargando clima...</p>;

    return (
        <div className={`rounded-[20px] w-2xl overflow-hidden shadow-lg border ${
            isDark ? 'bg-[#2d2d2d] border-[#1d1d1d] text-gray-200' : 'bg-white border-gray-200 text-gray-800'
        }`}>
            <div className="p-5 border-b border-gray-500/20">
                <h3 className="text-xl uppercase tracking-widest font-bold opacity-50 mb-2">Predicción para {datos?.nombreProvincia}</h3>
                <p className="text-lg leading-relaxed font-medium whitespace-pre-line">
                    {datos?.descripcion}
                </p>
            </div>
            <div className="p-5 bg-black/5">
                <h3 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-4">Temperaturas por municipio</h3>
                <div className="grid grid-cols-1 gap-3">
                    {datos?.temps.map((t, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                            <span className="font-semibold">{t.municipio}</span>
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