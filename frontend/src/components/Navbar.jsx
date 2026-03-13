import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'
import { LogOut, CheckSquare, Sparkles } from 'lucide-react'

const Navbar = () => {
    const { t, i18n } = useTranslation()
    const { user, logout } = useAuthStore()

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value)
    }

    return (
        <nav className="gradient-bg px-6 py-4 flex items-center justify-between shadow-lg">

            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <CheckSquare size={20} className="text-white" />
                </div>
                <div>
                    <span className="text-white font-bold text-lg leading-none">
                        Smart Task Manager
                    </span>
                    <div className="flex items-center gap-1">
                        <Sparkles size={10} className="text-purple-200" />
                        <span className="text-purple-200 text-xs">AI Powered</span>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">

                {/* User badge */}
                <div className="hidden sm:flex items-center gap-2 bg-white bg-opacity-10 rounded-2xl px-3 py-1.5">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-white text-sm font-medium">{user?.name}</span>
                    {user?.role === 'ADMIN' && (
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                            ADMIN
                        </span>
                    )}
                </div>

                {/* Language switcher */}
                <select
                    onChange={changeLanguage}
                    defaultValue={i18n.language}
                    className="bg-white bg-opacity-10 text-white text-sm rounded-xl px-2 py-1.5 border border-white border-opacity-20 focus:outline-none cursor-pointer"
                >
                    <option value="en" className="text-gray-800">🇺🇸 EN</option>
                    <option value="es" className="text-gray-800">🇪🇸 ES</option>
                    <option value="fr" className="text-gray-800">🇫🇷 FR</option>
                </select>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex items-center gap-1.5 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-3 py-1.5 rounded-xl text-sm font-medium transition border border-white border-opacity-20"
                >
                    <LogOut size={15} />
                    <span className="hidden sm:block">{t('logout')}</span>
                </button>

            </div>
        </nav>
    )
}

export default Navbar