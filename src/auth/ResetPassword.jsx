import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Input, Typography } from 'antd'
import { getAuth, updatePassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import './ChangeEmail.css'


const { Text } = Typography

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  // Define password requirements
  const passwordRequirements = [
    newPassword.length >= 8,
    /[A-Z]/.test(newPassword),
    /[a-z]/.test(newPassword),
    /[0-9]/.test(newPassword),
    /[!@#$%^&*]/.test(newPassword),
  ]

  // Check if all password requirements are met
  useEffect(() => {
    setIsSubmitDisabled(passwordRequirements.some(
        (requirement) => !requirement))
  }, [newPassword])

  const handleChangePassword = async () => {
    const auth = getAuth()
    const user = auth.currentUser

    try {
      await updatePassword(user, newPassword)
      setMessage('Password updated successfully.')
    } catch (error) {
      setMessage('Error updating password. Please try again.')
    }
  }

  return (
    <div className="container">
      <Text>Enter your new password:</Text>
      <Input.Password
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="input"
        placeholder="New Password"
        required
        visibilityToggle
      />

      <ul className="password-requirements">
        <li>
          {passwordRequirements[0] ? (
            <CheckCircleOutlined style={{ color: 'green' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red' }} />
          )}
          &nbsp;At least 8 characters
        </li>
        <li>
          {passwordRequirements[1] ? (
            <CheckCircleOutlined style={{ color: 'green' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red' }} />
          )}
          &nbsp;Contains at least one uppercase letter
        </li>
        <li>
          {passwordRequirements[2] ? (
            <CheckCircleOutlined style={{ color: 'green' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red' }} />
          )}
          &nbsp;Contains at least one lowercase letter
        </li>
        <li>
          {passwordRequirements[3] ? (
            <CheckCircleOutlined style={{ color: 'green' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red' }} />
          )}
          &nbsp;Contains at least one digit (0-9)
        </li>
        <li>
          {passwordRequirements[4] ? (
            <CheckCircleOutlined style={{ color: 'green' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red' }} />
          )}
          &nbsp;Contains at least one special character (!@#$%^&*)
        </li>
      </ul>
      <Button
        onClick={handleChangePassword}
        className="submit-button"
        disabled={isSubmitDisabled}
      >
        Change Password
      </Button>
      {message && <div className="message">{message}</div>}
    </div>
  )
}

export default ResetPassword
