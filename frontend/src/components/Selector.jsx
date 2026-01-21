import { useState } from 'react'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'

export default function Selector(coleccion = [], onSelect, placeholder = "Seleccionar...") {

    const [selectedobjeto, setSelectedobjeto] = useState(null)
    const [query, setQuery] = useState('')

    const filteredobjeto =
        query === ''
            ? coleccion
            : coleccion.filter((objeto) => {
                return objeto.nombre.toLowerCase().includes(query.toLowerCase())
            })

    return (
        <Combobox value={selectedobjeto} onChange={setSelectedobjeto} onClose={() => setQuery('')}>
            <div className="relative w-full max-w-sm">
            <ComboboxInput
                className="w-full bg-white border-2 border-gray-200 rounded-full py-2 px-4 text-center focus:outline-none focus:border-blue-500 transition-colors"
                aria-label="coleccion"
                displayValue={(objeto) => objeto?.nombre}
                placeholder='coleccion'
                onChange={(event) => setQuery(event.target.value)}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon
                    className="size-5 text-gray-400 hover:text-blue-500 transition-colors"
                />
            </ComboboxButton>
            </div>
            <ComboboxOptions
                anchor="bottom"
                className="w-[var(--input-width)] bg-white shadow-lg border border-gray-200 rounded-xl mt-1 z-50 empty:invisible ">
                {filteredObjeto.map((objeto) => (
                    <ComboboxOption
                        key={objeto.id}
                        value={objeto}
                        className="group flex cursor-default items-center gap-2 py-2 px-3 select-none data-[focus]:bg-blue-50 transition-colors"
                    >
                                <span className={`text-s`}>
                                    {objeto.nombre}
                                </span>
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    )
}