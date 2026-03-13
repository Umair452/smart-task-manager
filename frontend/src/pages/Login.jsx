import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'
import { CheckSquare, Loader, Mail, Lock, Sparkles } from 'lucide-react'

const Login = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { login, loading, error, clearError } = useAuthStore()

    const [form, setForm] = useState({ email: '', password: '' })

    const handleChange = (e) => {
        clearError()
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(form.email, form.password)
            navigate('/dashboard')
        } catch (error) { }
    }

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-purple-300 opacity-10 rounded-full" />

            <div className="glass rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">

                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                        <CheckSquare size={24} className="text-white" />
                    </div>
                </div>
                <h1 className="text-center text-2xl font-bold text-gray-800 mb-1">
                    Smart Task Manager
                </h1>
                <p className="text-center text-gray-400 text-sm mb-8 flex items-center justify-center gap-1">
                    <Sparkles size={14} className="text-purple-400" />
                    AI Powered Productivity
                </p>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('email')}
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 transition"
                                placeholder="john@gmail.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('password')}
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 transition"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full gradient-bg text-white py-3 rounded-2xl font-semibold transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-200 mt-2"
                    >
                        {loading && <Loader size={16} className="animate-spin" />}
                        {t('login')}
                    </button>

                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-gray-300 text-xs">OR</span>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                        {t('register')} →
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login