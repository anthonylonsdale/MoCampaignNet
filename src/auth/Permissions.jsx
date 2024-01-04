import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { loginTracer } from './LoginTracer.jsx'
import { auth, db } from './firebase.jsx'


export const PermissionsContext = createContext({
  user: null,
  permissions: {},
})

const defaultPermissions = {
  'View Generic Maps': true,
  'Edit Profile': true,
  'Edit User Settings': true,
}

const adminPermissions = {
  'Add Users': true,
  'Remove Users': true,
  'View Premium Data': true,
  'Build and Export Datasets': true,
}

export const PermissionsProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState({})

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setPermissions({})
    } catch (error) {
      console.error('Sign out error:', error.message)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid)
        const docSnap = await getDoc(userDoc)

        if (docSnap.exists()) {
          setUser(currentUser)
          const userData = docSnap.data()
          const userIsAdmin = userData.isAdministrator
          setPermissions(userIsAdmin ? { ...defaultPermissions, ...adminPermissions } : defaultPermissions)

          await loginTracer(currentUser.uid)
        } else {
          alert('Error with User...')
          setUser(null)
          setPermissions({})
        }
      } else {
        setUser(null)
        setPermissions({})
      }
    })

    return () => unsubscribe()
  }, [auth])

  const contextValue = {
    user,
    permissions,
    handleSignOut,
  }

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => useContext(PermissionsContext)
