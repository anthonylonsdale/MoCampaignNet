import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { auth, db, getUserDeviceInfo, getUserIP } from './firebase.jsx'

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

export const getActiveSessions = async (userId) => {
  const sessionDocRef = doc(db, 'sessions', userId)

  try {
    const docSnap = await getDoc(sessionDocRef)

    if (docSnap.exists() && docSnap.data().isValid) {
      // Construct the session object with required fields
      const sessionData = docSnap.data()
      return [{
        sessionId: docSnap.id,
        ...sessionData,
        icon: sessionData.deviceType === 'mobile' ? 'mobile' : 'desktop',
        lastActive: sessionData.lastActive?.toDate().toLocaleString() || 'Unknown',
      }]
    } else {
      console.log('No active session or session is not valid')
      return []
    }
  } catch (error) {
    console.error('Error getting active sessions:', error)
    return []
  }
}


export const PermissionsProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState({})
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || '')
  const intervalSetRef = useRef(false)

  const functions = getFunctions()
  const createSession = httpsCallable(functions, 'createSession')
  const validateSession = httpsCallable(functions, 'validateSession')
  const invalidateSession = httpsCallable(functions, 'invalidateSession')

  console.log(user)
  console.log(sessionId)

  const handleSignOut = async () => {
    console.log('SIGNING OUT!!!')
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

  // this is to validate the session
  useEffect(() => {
    if (sessionId && !intervalSetRef.current) {
      console.log('VALIDATING SESSION')
      const validate = async () => {
        try {
          const userId = auth.currentUser ? auth.currentUser.uid : null
          if (userId && sessionId) {
            const result = await validateSession({ userId, sessionId })
            if (!result.data.isValid) {
              console.error('Session is invalid')
              handleSignOut()
            }
          }
        } catch (error) {
          console.error('Error validating session:', error)
        }
      }

      validate()
      const intervalId = setInterval(validate, 600000) // 10 minutes is 600,000
      intervalSetRef.current = true

      return () => {
        clearInterval(intervalId)
        intervalSetRef.current = false
      }
    }
  }, [sessionId, validateSession, handleSignOut])


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('AUTH STATE CHANGED')
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
          const userData = docSnap.data()
          const userIsAdmin = !!userData.isAdministrator

          setUser(currentUser)
          setPermissions(userIsAdmin ? { ...defaultPermissions, ...adminPermissions } : defaultPermissions)

          if (!sessionId) {
            const deviceInfo = getUserDeviceInfo()
            const ipAddress = await getUserIP()

            const sessionData = {
              device: deviceInfo.deviceModel,
              ip: ipAddress,
              os: `${deviceInfo.osName} ${deviceInfo.osVersion}`,
              screenResolution: deviceInfo.screenResolution,
              userAgent: deviceInfo.fullUserAgent,
              browser: `${deviceInfo.browserName} ${deviceInfo.browserVersion}`,
            }

            const sessionResult = await createSession(sessionData)
            const newSessionId = sessionResult.data.sessionId
            localStorage.setItem('sessionId', newSessionId)
            setSessionId(newSessionId)
            console.log(sessionId)
          }
        } else {
          handleSignOut()
        }
      } else {
        handleSignOut()
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
