import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { loginTracer } from './LoginTracer.jsx'
import { auth, db } from './firebase.jsx'

export const PermissionsContext = createContext({
  user: null,
  permissions: {},
  sessionId: null,
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
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || '')

  const functions = getFunctions()

  const createSession = httpsCallable(functions, 'createSession')
  const validateSession = httpsCallable(functions, 'validateSession')
  const invalidateSession = httpsCallable(functions, 'invalidateSession')

  console.log(user)
  console.log(sessionId)

  const handleSignOut = async () => {
    if (user) {
      try {
        if (sessionId) {
          await invalidateSession({ sessionId })
        }
        await signOut(auth)
        localStorage.removeItem('sessionId')
        setSessionId('')
        setUser(null)
        setPermissions({})
      } catch (error) {
        console.error('Error during sign out:', error)
      }
    }
  }

  useEffect(() => {
    if (user && !sessionId) {
      createSession().then((result) => {
        const newSessionId = result.data.sessionId
        localStorage.setItem('sessionId', newSessionId)
        setSessionId(newSessionId)
      }).catch((error) => {
        console.error('Error creating session:', error)
      })
    }
  }, [user, sessionId, createSession])

  useEffect(() => {
    let intervalId

    if (sessionId) {
      intervalId = setInterval(() => {
        validateSession({ sessionId })
            .then((result) => {
              if (!result.data.isValid) {
                handleSignOut()
              }
            })
            .catch((error) => {
              console.error('Error validating session:', error)
            })
      }, 3600000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [sessionId, validateSession])

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
    sessionId,
  }

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => useContext(PermissionsContext)
