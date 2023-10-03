import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import * as firebaseui from 'firebaseui'

import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDQEl7Yx5qYGy_A6Lcwd6_BJzGu4HkXrnU',
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
    // Email and password sign-in
    {
      provider: 'password',
      requireDisplayName: true,
    },
  ],
}

const db = getFirestore(FireBase)

const ui = new firebaseui.auth.AuthUI(auth)

export { FireBase, auth, db, ui, uiConfig }

