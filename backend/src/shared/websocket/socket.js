import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

let io

export const initSocket = (httpServer) => {

    io = new Server(httpServer, {
        cors: {
            // Allow ALL origins for now during development
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth.token

        if (!token) {
            return next(new Error('Authentication error. No token provided'))
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.user = decoded
            next()
        } catch (error) {
            return next(new Error('Authentication error. Invalid token'))
        }
    })

    io.on('connection', (socket) => {
        console.log(`⚡ User connected: ${socket.user.email}`)
        socket.join(`user:${socket.user.id}`)
        console.log(`👤 Joined room: user:${socket.user.id}`)

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.user.email}`)
        })
    })

    return io
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!')
    }
    return io
}