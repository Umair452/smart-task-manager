import jwt from 'jsonwebtoken'
const authenticate = (req, res, next) => {

    //get the token from header
    const authHeader = req.headers['authorization']
    //check if the header exists

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized - No token provided'
        })
    }

    // 3. The header looks like "Bearer eyJhbGc..."
    // We split by space and take the second part (the actual token)
    // "Bearer eyJhbGc...".split(' ') = ['Bearer', 'eyJhbGc...']
    const token = authHeader.split(' ')[1]

    // 4. Check if token part actually exists after splitting
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Token missing'
        })
    }

    // 5. Verify the token using our secret key
    // jwt.verify() will throw an error if:
    // - token is fake/tampered
    // - token has expired
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 6. Attach the decoded user info to the request object
        // Now any route after this middleware can access req.user
        // decoded contains { id, email, role } we set during login
        req.user = decoded

        // 7. Call next() to pass control to the next middleware or route
        // Without next(), the request would just hang forever
        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }


}

export default authenticate
