import { create } from 'zustand'
import api from '../services/api'
import { connectSocket, disconnectSocket } from '../services/socket'

const useAuthStore = create((set) => ({
    // Initial state
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,

    // Register action
    register: async (name, email, password) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post('/auth/register', { name, email, password })
            set({ loading: false })
            return res.data
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || 'Registration failed'
            })
            throw error
        }
    },

    // Login action
    login: async (email, password) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post('/auth/login', { email, password })
            const { token, user } = res.data.data

            // Save to localStorage so user stays logged in
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            // Connect WebSocket after login
            connectSocket(token)

            set({ user, token, loading: false })
            return res.data
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || 'Login failed'
            })
            throw error
        }
    },

    // Logout action
    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        disconnectSocket()
        set({ user: null, token: null })
    },

    // Clear error
    clearError: () => set({ error: null })
}))

export default useAuthStore