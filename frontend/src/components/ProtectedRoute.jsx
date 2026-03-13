import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

// This component protects routes
// If not logged in → redirect to login
// If logged in → show the page
const ProtectedRoute = ({ children }) => {
    const { token } = useAuthStore()

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute