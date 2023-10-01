import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, List, Typography } from 'antd'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'; // Import the CSS file

const { Title } = Typography

function Signup() {
  const [error, setError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordRequirements, setPasswordRequirements] = useState([
    false, false, false, false, false,
  ])
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [showRequirements, setShowRequirements] = useState(false)
  const history = useNavigate()

  const onFocusPassword = () => {
    setShowRequirements(true)
  }

  const onBlurPassword = () => {
    setShowRequirements(false)
  }

  const onFinish = async (values) => {
    const { email, password } = values
    const auth = getAuth()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      history('/campaign-tools')
    } catch (error) {
      setError(error.message)
    }
  }

  // Check if all password requirements are met
  useEffect(() => {
    const requirements = [
      newPassword.length >= 8,
      /[A-Z]/.test(newPassword),
      /[a-z]/.test(newPassword),
      /[0-9]/.test(newPassword),
      /[!@#$%^&*]/.test(newPassword),
    ]
    setPasswordRequirements(requirements)
    setIsSubmitDisabled(requirements.some((requirement) => !requirement))
  }, [newPassword])

  const requirementsData = [
    {
      icon: passwordRequirements[0] ? (
        <CheckCircleOutlined style={{ color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      ),
      text: 'At least 8 characters',
    },
    {
      icon: passwordRequirements[1] ? (
        <CheckCircleOutlined style={{ color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      ),
      text: 'Contains at least one uppercase letter',
    },
    {
      icon: passwordRequirements[2] ? (
        <CheckCircleOutlined style={{ color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      ),
      text: 'Contains at least one lowercase letter',
    },
    {
      icon: passwordRequirements[3] ? (
        <CheckCircleOutlined style={{ color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      ),
      text: 'Contains at least one digit (0-9)',
    },
    {
      icon: passwordRequirements[4] ? (
        <CheckCircleOutlined style={{ color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      ),
      text: 'Contains at least one special character (!@#$%^&*)',
    },
  ]

  return (
    <div className="signup-container">
      <Title level={2}>Sign Up</Title>
      <Form name="signup" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please enter a valid email address!',
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your password!',
            },
          ]}
        >
          <Input.Password
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onFocus={onFocusPassword}
            onBlur={onBlurPassword}
          />
        </Form.Item>

        {showRequirements && (
          <List
            dataSource={requirementsData}
            renderItem={(item) => (
              <List.Item>
                {item.icon}&nbsp;{item.text}
              </List.Item>
            )}
          />
        )}

        {error && <div className="error-text">{error}</div>}

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>

      <p>
        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
      </p>
    </div>
  )
}

export default Signup
