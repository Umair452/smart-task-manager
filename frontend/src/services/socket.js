import { io } from 'socket.io-client'

let socket = null

export const connectSocket = (token) => {
    // Connect to WebSocket server with token
    socket = io('http://localhost:3000', {
        auth: { token }
    })

    socket.on('connect', () => {
        console.log('⚡ WebSocket connected!')
    })

    socket.on('disconnect', () => {
        console.log('❌ WebSocket disconnected!')
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