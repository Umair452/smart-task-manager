import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from 'http'
import middleware from 'i18next-http-middleware'
import i18next from './shared/i18n/i18n.js'
import { initSocket } from './shared/websocket/socket.js'
import authRoutes from './modules/auth/auth.routes.js'
import taskRoutes from './modules/tasks/tasks.routes.js'
import aiRoutes from './modules/ai/ai.routes.js'
import authenticate from './shared/middleware/authenticate.js'
import authorize from './shared/middleware/authorize.js'
import { startScheduler } from './modules/notifications/scheduler.js'
import prisma from './lib/prisma.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_URL || '*'
    ],
    credentials: true
}))

app.use(express.json())
app.use(middleware.handle(i18next))

app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)
app.use('/ai', aiRoutes)

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running!' })
})

app.get('/profile', authenticate, (req, res) => {
    res.json({ success: true, data: req.user })
})

app.get('/admin', authenticate, authorize(['ADMIN']), (req, res) => {
    res.json({ success: true, data: req.user })
})

const httpServer = createServer(app)
initSocket(httpServer)
startScheduler()

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`⚡ WebSocket server is ready!`)
})

export default app