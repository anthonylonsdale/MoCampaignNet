import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from './firebase.jsx'

export const PermissionsContext = createContext({
  user: null,
  permissions: {},
})

const defaultUserPermissions = {
  'View Generic Maps': true,
  'Edit Profile': true,
  'Edit User Settings': true,
  'Add Users': false,
  'Remove Users': false,
  'View Premium Data': false,
  'Build and Export Datasets': false,
}

const adminPermissions = {
  'View Generic Maps': true,
  'Edit Profile': true,
  'Edit User Settings': true,
  'Add Users': true,
  'Remove Users': true,
  'View Premium Data': true,
  'Build and Export Datasets': true,
}

export const PermissionsProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState({})

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid)
        const docSnap = await getDoc(userDoc)

        console.log('DB ACCESSED')

        if (docSnap.exists()) {
          setUser(currentUser)
          const userData = docSnap.data()
          const userIsAdmin = userData.isAdministrator
          setPermissions(userIsAdmin ? adminPermissions : defaultUserPermissions)
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
  }

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => useContext(PermissionsContext)
