import { getFunctions, httpsCallable } from 'firebase/functions'
import React from 'react'
import 'react-app-polyfill/stable'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { PermissionsProvider } from './auth/Permissions.jsx'
import Signup from './auth/Signup.jsx'
import Auth from './auth/auth.jsx'
import { auth } from './auth/firebase.jsx'
import ProtectedRoute from './auth/protectedRoute.jsx'
import './index.css'
import CampaignTools from './pages/CampaignTools.jsx'
import Portfolio from './pages/Portfolio.jsx'

async function checkSessionValidity() {
  const user = auth.currentUser
  const sessionId = localStorage.getItem('sessionId')

  if (!user || !sessionId) {
    console.log('No user or session ID found.')
    return false // Return false or handle as needed if the user is not logged in
  }

  const functions = getFunctions()
  const validateSessionFn = httpsCallable(functions, 'validateSession')

  try {
    const result = await validateSessionFn({ userId: user.uid, sessionId })
    console.log(result)
    return result.data.isValid
  } catch (error) {
    console.error('Error validating session:', error)
    return false
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope)
        }).catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
  })

  navigator.serviceWorker.addEventListener('message', async (event) => {
    console.log('Received message from service worker', event.data)

    if (event.data && event.data.type === 'CHECK_SESSION') {
      console.log('EVENT MESSAGE RECEIVED', event.data)
      const validationId = event.data.validationId
      const isValidSession = await checkSessionValidity()

      event.ports[0].postMessage({
        type: 'SESSION_VALIDATION_RESPONSE',
        validationId,
        isValid: isValidSession,
      })
    }
  })
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<Auth />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/portfolio' element={<Portfolio />} />
        <Route path='/campaign-tools' element={
          <ProtectedRoute>
            <PermissionsProvider>
              <CampaignTools />
            </PermissionsProvider>
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>,
)
