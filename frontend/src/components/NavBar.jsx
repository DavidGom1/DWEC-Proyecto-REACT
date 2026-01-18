import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'

export default function NavBar({ isDark, toggleDark }) {
    return (
        <Disclosure as="nav" className={`relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} transition-all duration-500 ease-in-out shadow-xl`}>
            <div className="mx-auto max-w-7xl !px-2 sm:!px-6 lg:!px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Abrir menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <h1 className="text-2xl font-bold">miTiempo</h1>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <button
                            onClick={toggleDark}
                            className={`hidden sm:block p-2 rounded-lg ${isDark ? ' dark:bg-gray-700 text-white dark:text-yellow-400 transition-colors' : 'dark:bg-gray-700 text-gray-800 dark:text-yellow-400 transition-colors'}`}
                        >
                            {isDark ? <SunIcon className="size-6" /> : <MoonIcon className="size-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 text-center">
                    <button
                        onClick={toggleDark}
                        className={`p-2 rounded-lg ${isDark ? ' dark:bg-gray-700 text-white dark:text-yellow-400 transition-colors' : 'dark:bg-gray-700 text-gray-800 dark:text-yellow-400 transition-colors'}`}
                    >
                        {isDark ? <SunIcon className="size-6" /> : <MoonIcon className="size-6" />}
                    </button>
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}