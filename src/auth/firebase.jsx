import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import * as firebaseui from 'firebaseui'
import UAParser from 'ua-parser-js'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'leaddrive-pro.firebaseapp.com',
  projectId: 'leaddrive-pro',
  storageBucket: 'leaddrive-pro.appspot.com',
  messagingSenderId: '915335085286',
  appId: '1:915335085286:web:f3215283a9cd6181480f27',
  measurementId: 'G-M65Z2LZH55',
}

const FireBase = initializeApp(firebaseConfig)
const auth = getAuth(FireBase)

const uiConfig = {
  signInSuccessUrl: '/campaign-tools',
  signInOptions: [
    {
      provider: 'password',
      requireDisplayName: true,
    },
  ],
}

async function getUserIP() {
  try {
    const response = await fetch('https://httpbin.org/ip')
    const data = await response.json()
    return data.origin
  } catch (error) {
    console.error('Failed to get IP address:', error)
    return null
  }
}

function getUserDeviceInfo() {
  const parser = new UAParser()
  const result = parser.getResult()

  return { result }
}

const db = getFirestore(FireBase)

const ui = new firebaseui.auth.AuthUI(auth)

export { FireBase, auth, db, getUserDeviceInfo, getUserIP, ui, uiConfig }

