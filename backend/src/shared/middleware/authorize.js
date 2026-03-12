// authorize is a function that RETURNS a middleware function
// We pass in the allowed roles e.g. authorize(['ADMIN'])
const authorize = (roles = []) => {
    return (req, res, next) => {

        // 1. req.user was set by the authenticate middleware
        // It contains { id, email, role }
        const userRole = req.user.role

        // 2. Check if the user's role is in the allowed roles array
        // e.g. roles = ['ADMIN'], userRole = 'USER'
        // ['ADMIN'].includes('USER') = false → blocked
        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                // 403 = Forbidden (you are logged in but not allowed)
                message: 'Access denied. You do not have permission'
            })
        }

        // 3. Role is allowed, move to next middleware/route
        next()
    }
}

export default authorize