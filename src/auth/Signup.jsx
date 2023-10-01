// Signup.js
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import React, { useState } from 'react'
import './Signup.css'; // Import the CSS file

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const auth = getAuth()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // User has been created and signed in
      // You can redirect to another route now
    } catch (error) {
      // Handle error (e.g., email already in use, password too weak, etc.)
      setError(error.message)
    }
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Password"
          required
        />
        {error && <div className="error-text">{error}</div>}
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
    </div>
  )
}

export default Signup
