import { useState } from 'react'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton, Label } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'

export default function Selector(props) {
    const { label, coleccion, onSelect, placeholder, isDark } = props;
    const [selectedObjeto, setSelectedObjeto] = useState(null)
    const [query, setQuery] = useState('')

    const filteredObjeto =
        query === ''
            ? coleccion
            : coleccion.filter((objeto) => {
                return objeto.nombre.toLowerCase().includes(query.toLowerCase())
            })

    return (
        <Combobox 
            as = 'div'
            value={selectedObjeto} 
            onChange={(valor) => {
                setSelectedObjeto(valor); 
                onSelect(valor);
            }}
            onClose={() => setQuery('')}>
            <Label className={`block text-md font-medium pl-5 ${isDark ? 'text-white' : 'text-gray-700'}`}>{label}</Label>
            <div className="relative w-full max-w-[15rem]">
            <ComboboxInput
                className="w-full bg-white border-2 border-gray-200 rounded-full py-2 px-4 text-center focus:outline-none focus:border-blue-500 transition-colors"
                aria-label="coleccion"
                displayValue={(objeto) => objeto?.nombre}
                placeholder={placeholder}
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