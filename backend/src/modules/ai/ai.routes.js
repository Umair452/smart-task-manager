import { Router } from 'express'
import {
    getPrioritySuggestion,
    getDescriptionSuggestion,
    getTaskSummary
} from './ai.controller.js'
import authenticate from '../../shared/middleware/authenticate.js'

const router = Router()

// All AI routes require authentication
// No one should use AI features without logging in

// POST /ai/suggest-priority
// Send title + description → get priority suggestion
router.post('/suggest-priority', authenticate, getPrioritySuggestion)

// POST /ai/suggest-description
// Send title → get full description
router.post('/suggest-description', authenticate, getDescriptionSuggestion)

// GET /ai/daily-summary
// Get AI summary of your tasks
router.get('/daily-summary', authenticate, getTaskSummary)

export default router