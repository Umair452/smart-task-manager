import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} from './tasks.service.js'

export const create = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignedToId } = req.body

        if (!title) {
            return res.status(400).json({
                success: false,
                message: req.t('task.titleRequired')
            })
        }

        // Get timezone from query param or user's saved timezone
        // e.g. POST /tasks?timezone=America/New_York
        const timezone = req.query.timezone || req.user.timezone || 'UTC'

        const task = await createTask(
            { title, description, priority, dueDate, assignedToId },
            req.user.id,
            timezone
        )

        return res.status(201).json({
            success: true,
            message: req.t('task.created'),
            data: task
        })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const getAll = async (req, res) => {
    try {
        const timezone = req.query.timezone || req.user.timezone || 'UTC'
        const locale = req.query.lng || req.user.locale || 'en'

        const tasks = await getAllTasks(req.user.id, req.user.role, timezone, locale)

        return res.status(200).json({
            success: true,
            message: req.t('task.fetched'),
            data: tasks
        })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const getOne = async (req, res) => {
    try {
        const timezone = req.query.timezone || req.user.timezone || 'UTC'
        const locale = req.query.lng || req.user.locale || 'en'

        const task = await getTaskById(
            req.params.id,
            req.user.id,
            req.user.role,
            timezone,
            locale
        )

        return res.status(200).json({
            success: true,
            message: req.t('task.fetchedOne'),
            data: task
        })
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message })
    }
}

export const update = async (req, res) => {
    try {
        const timezone = req.query.timezone || req.user.timezone || 'UTC'

        const task = await updateTask(
            req.params.id,
            req.body,
            req.user.id,
            req.user.role,
            timezone
        )

        return res.status(200).json({
            success: true,
            message: req.t('task.updated'),
            data: task
        })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const remove = async (req, res) => {
    try {
        await deleteTask(req.params.id)

        return res.status(200).json({
            success: true,
            message: req.t('task.deleted')
        })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}
