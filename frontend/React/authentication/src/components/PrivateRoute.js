import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children }) {
    const { currentUser } = useAuth()
    const location = useLocation()

    if (!currentUser) {
        return (
            <Navigate to="/login" state={{ from: location }} replace />
        )
    }
    else {
        return children
    }
}
