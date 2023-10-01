// SignIn.js
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const auth = getAuth()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // User has been signed in
      // You can redirect to another route now
    } catch (error) {
      // Handle error (e.g., invalid credentials, user not found, etc.)
      setError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Sign In</button>
    </form>
  )
}

export default SignIn
