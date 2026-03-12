import {
    suggestPriority,
    suggestDescription,
    getDailySummary
} from './ai.service.js'

// ─── SUGGEST PRIORITY ────────────────────────────────────

export const getPrioritySuggestion = async (req, res) => {
    try {
        const { title, description } = req.body

        // Title is required to suggest priority
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Task title is required'
            })
        }

        const result = await suggestPriority(title, description)

        return res.status(200).json({
            success: true,
            message: 'Priority suggestion generated',
            data: result
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ─── SUGGEST DESCRIPTION ─────────────────────────────────

export const getDescriptionSuggestion = async (req, res) => {
    try {
        const { title } = req.body

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Task title is required'
            })
        }

        const result = await suggestDescription(title)

        return res.status(200).json({
            success: true,
            message: 'Description suggestion generated',
            data: result
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ─── DAILY SUMMARY ───────────────────────────────────────

export const getTaskSummary = async (req, res) => {
    try {
        // req.user.id comes from authenticate middleware
        const result = await getDailySummary(req.user.id)

        return res.status(200).json({
            success: true,
            message: 'Daily summary generated',
            data: result
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}