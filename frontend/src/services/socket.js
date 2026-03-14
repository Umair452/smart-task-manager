import { io } from 'socket.io-client'

let socket = null

export const connectSocket = (token) => {
    //socket = io('http://localhost:3000', this is for local deployment
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', // this is for deployment
        {
            auth: { token }
        })

    socket.on('connect', () => {
        console.log('⚡ WebSocket connected! Socket ID:', socket.id)
    })

    socket.on('disconnect', () => {
        console.log('❌ WebSocket disconnected!')
    })

    socket.on('connect_error', (error) => {
        console.log('❌ Connection error:', error.message)
    })

    return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}