import { getAuth } from 'firebase/auth'
import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  const auth = getAuth()


  useEffect(() => {
    console.log(currentUser)

    auth.onAuthStateChanged(setCurrentUser)
    console.log(currentUser)
  }, [auth])

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
