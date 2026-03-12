import { Router } from 'express'
import {
    create,
    getAll,
    getOne,
    update,
    remove
} from './tasks.controller.js'
import authenticate from '../../shared/middleware/authenticate.js'
import authorize from '../../shared/middleware/authorize.js'

// Router is a mini express app
// groups all task related routes together
const router = Router()

// POST /tasks - create a new task
// authenticate = must be logged in
router.post('/', authenticate, create)

// GET /tasks - get all tasks
// admin sees all, user sees own
router.get('/', authenticate, getAll)

// GET /tasks/:id - get single task by id
// :id is a dynamic parameter
// e.g. /tasks/abc123 → req.params.id = 'abc123'
router.get('/:id', authenticate, getOne)

// PATCH /tasks/:id - update a task
// PATCH = partial update (not all fields required)
// PUT = full update (all fields required)
router.patch('/:id', authenticate, update)

// DELETE /tasks/:id - delete a task
// authorize(['ADMIN']) = only admins can delete
router.delete('/:id', authenticate, authorize(['ADMIN']), remove)

export default router