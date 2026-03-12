import { Router } from 'express'
import { register, login } from './auth.controller.js'

// Router is like a mini express app
// it groups related routes together
const router = Router()

// POST /auth/register → calls the register controller
router.post('/register', register)

// POST /auth/login → calls the login controller
router.post('/login', login)

export default router