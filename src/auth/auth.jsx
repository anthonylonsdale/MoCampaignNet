import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './auth.css'; // Importing a new CSS file
import { ui, uiConfig } from './firebase.jsx'

const Auth = () => {
  useEffect(() => {
    ui.start('#firebaseui-auth-container', uiConfig)
  }, [])

  return (
    <div className="auth-container">
      <div id="firebaseui-auth-container"></div>
      <div className="auth-links">
        <Link to="/signin" className="auth-link">Sign In</Link>
        <Link to="/signup" className="auth-link">Sign Up</Link>
      </div>
    </div>
  )
}

export default Auth
