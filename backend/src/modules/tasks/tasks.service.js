import prisma from '../../lib/prisma.js'
import { getIO } from '../../shared/websocket/socket.js'
import { toUTC, toUserTimezone, formatDate } from '../../shared/utils/date.util.js'

// ─── HELPER: FORMAT TASK DATES ───────────────────────────

// This formats all dates in a task object
// based on the user's timezone and locale
const formatTaskDates = (task, timezone = 'UTC', locale = 'en') => {
    return {
        ...task,
        // Convert UTC dates to user's timezone for display
        dueDate: toUserTimezone(task.dueDate, timezone),
        createdAt: toUserTimezone(task.createdAt, timezone),
        updatedAt: toUserTimezone(task.updatedAt, timezone),
        // Also add human readable format
        dueDateFormatted: formatDate(task.dueDate, timezone, locale)
    }
}

// ─── CREATE TASK ─────────────────────────────────────────

export const createTask = async (data, createdById, timezone = 'UTC') => {

    const task = await prisma.task.create({
        data: {
            ...data,
            // Always store in UTC using our util
            dueDate: toUTC(data.dueDate),
            createdById
        },
        include: {
            createdBy: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true, email: true } }
        }
    })

    const io = getIO()

    if (task.assignedToId) {
        io.to(`user:${task.assignedToId}`).emit('task:assigned', {
            message: `You have been assigned a new task: ${task.title}`,
            task
        })
    }

    io.to(`user:${createdById}`).emit('task:created', {
        message: `Task created successfully: ${task.title}`,
        task
    })

    // Format dates before returning to user
    return formatTaskDates(task, timezone)
}

// ─── GET ALL TASKS ───────────────────────────────────────

export const getAllTasks = async (userId, role, timezone = 'UTC', locale = 'en') => {

    const where = role === 'ADMIN'
        ? {}
        : { OR: [{ createdById: userId }, { assignedToId: userId }] }

    const tasks = await prisma.task.findMany({
        where,
        include: {
            createdBy: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    // Format dates for each task
    return tasks.map(task => formatTaskDates(task, timezone, locale))
}

// ─── GET SINGLE TASK ─────────────────────────────────────

export const getTaskById = async (taskId, userId, role, timezone = 'UTC', locale = 'en') => {

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
            createdBy: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true, email: true } }
        }
    })

    if (!task) throw new Error('Task not found')

    if (role !== 'ADMIN' &&
        task.createdById !== userId &&
        task.assignedToId !== userId) {
        throw new Error('You do not have permission to view this task')
    }

    return formatTaskDates(task, timezone, locale)
}

// ─── UPDATE TASK ─────────────────────────────────────────

export const updateTask = async (taskId, data, userId, role, timezone = 'UTC') => {

    const task = await prisma.task.findUnique({ where: { id: taskId } })

    if (!task) throw new Error('Task not found')

    if (role !== 'ADMIN' && task.createdById !== userId) {
        throw new Error('You do not have permission to update this task')
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
            ...data,
            // Always convert to UTC before storing
            dueDate: data.dueDate ? toUTC(data.dueDate) : undefined
        },
        include: {
            createdBy: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true, email: true } }
        }
    })

    const io = getIO()

    io.to(`user:${updatedTask.createdById}`).emit('task:updated', {
        message: `Task updated: ${updatedTask.title}`,
        task: updatedTask
    })

    if (updatedTask.assignedToId &&
        updatedTask.assignedToId !== updatedTask.createdById) {
        io.to(`user:${updatedTask.assignedToId}`).emit('task:updated', {
            message: `A task assigned to you was updated: ${updatedTask.title}`,
            task: updatedTask
        })
    }

    return formatTaskDates(updatedTask, timezone)
}

// ─── DELETE TASK ─────────────────────────────────────────

export const deleteTask = async (taskId) => {

    const task = await prisma.task.findUnique({ where: { id: taskId } })

    if (!task) throw new Error('Task not found')

    await prisma.task.delete({ where: { id: taskId } })

    const io = getIO()

    io.to(`user:${task.createdById}`).emit('task:deleted', {
        message: `Task deleted: ${task.title}`,
        taskId
    })

    if (task.assignedToId && task.assignedToId !== task.createdById) {
        io.to(`user:${task.assignedToId}`).emit('task:deleted', {
            message: `A task assigned to you was deleted`,
            taskId
        })
    }

    return { message: 'Task deleted successfully' }
}