import { Button, Input, Typography, message } from 'antd'
import { getAuth, updateEmail } from 'firebase/auth'
import React, { useState } from 'react'
import './ChangeEmail.css'

const { Text } = Typography

function ChangeEmail() {
  const [newEmail, setNewEmail] = useState('')

  const handleChangeEmail = async () => {
    const auth = getAuth()
    console.log(auth)
    try {
      await updateEmail(auth.currentUser, newEmail)
      message.success('Email updated successfully.')
    } catch (error) {
      message.error('Error updating email. Please try again.')
    }
  }

  return (
    <div className="container">
      <Text>Enter your new email address:</Text>
      <Input
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        className="input"
        placeholder="New Email"
        required
      />
      <Button onClick={handleChangeEmail} className="submit-button">
        Change Email
      </Button>
    </div>
  )
}

export default ChangeEmail
