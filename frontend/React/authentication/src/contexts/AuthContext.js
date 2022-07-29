import React, { useContext, useState, useEffect } from 'react'
import { auth, methods } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signUp(email, password) {
        return methods.createUserWithEmailAndPassword(auth,email, password)
    }

    function login(email, password) {
        return methods.signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return methods.signOut(auth)
    }

    function resetPassword(email) {
        return methods.sendPasswordResetEmail(auth, email)
    }

    function updateEmail(email) {
        return methods.updateEmail(auth.currentUser,email)
    }

    function updatePassword(password) {
        return methods.updatePassword(auth.currentUser,password)
    }

    useEffect(() => {
        const unsubscribe = methods.onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signUp,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
