import { registerUser, loginUser } from './auth.service.js'

// ─── REGISTER CONTROLLER ─────────────────────────────────

export const register = async (req, res) => {
    try {
        // 1. Pull name, email, password out of the request body
        // req.body is the JSON data the client sends
        const { name, email, password } = req.body

        // 2. Basic validation - make sure fields are not empty
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            })
        }

        // 3. Call the service to do the actual work
        const user = await registerUser(name, email, password)

        // 4. Send back a success response
        // status 201 = "Created" (something new was created)
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        })

    } catch (error) {
        // 5. If anything goes wrong, send error response
        // status 400 = "Bad Request"
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// ─── LOGIN CONTROLLER ────────────────────────────────────

export const login = async (req, res) => {
    try {
        // 1. Pull email and password from request body
        const { email, password } = req.body

        // 2. Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            })
        }

        // 3. Call the service
        const { token, user } = await loginUser(email, password)

        // 4. Send back token and user
        // status 200 = "OK" (request was successful)
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { token, user }
        })

    } catch (error) {
        // status 401 = "Unauthorized" (wrong credentials)
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}