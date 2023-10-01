// ProtectedRoute.js
import { Navigate } from 'react-router-dom'
import { auth } from './firebase.jsx'; // Adjusted import

import React from 'react'

function ProtectedRoute({ children }) {
  const user = auth.currentUser
  console.log(auth)

  return user ? children : <Navigate to="/login" />
}

export default ProtectedRoute
