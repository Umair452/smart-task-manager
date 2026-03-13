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

// Allow both local and production frontend
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
    res.json({ status: 'ok', message: req.t('general.serverRunning') })
})

app.get('/profile', authenticate, (req, res) => {
    res.json({ success: true, message: req.t('general.loggedIn'), data: req.user })
})

app.get('/admin', authenticate, authorize(['ADMIN']), (req, res) => {
    res.json({ success: true, message: req.t('general.welcomeAdmin'), data: req.user })
})

app.get('/test-overdue', async (req, res) => {
    try {
        const now = new Date()
        const overdueTasks = await prisma.task.findMany({
            where: {
                status: { notIn: ['OVERDUE', 'DONE'] },
                dueDate: { not: null, lt: now }
            }
        })
        const overdueIds = overdueTasks.map(task => task.id)
        const updated = await prisma.task.updateMany({
            where: { id: { in: overdueIds } },
            data: { status: 'OVERDUE' }
        })
        res.json({ success: true, message: `Marked ${updated.count} tasks as OVERDUE` })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

const httpServer = createServer(app)
initSocket(httpServer)
startScheduler()

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`⚡ WebSocket server is ready!`)
})

export default app 