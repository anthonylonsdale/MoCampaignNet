import { getAuth } from 'firebase/auth'
import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = getAuth()

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute
