import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, List, Typography, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logoblank.png'
import './Signup.css'
import { db } from './firebase.jsx'

const { Text } = Typography

function Signup() {
  const [error, setError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [passwordRequirements, setPasswordRequirements] = useState([false, false, false, false, false])
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [showRequirements, setShowRequirements] = useState(false)
  const history = useNavigate()
  const [form] = useForm()

  const onFocusPassword = () => {
    setShowRequirements(true)
  }

  const onBlurPassword = () => {
    setShowRequirements(false)
  }

  const onFinish = async (values) => {
    const { email, password, displayName } = values
    const auth = getAuth()

    const q = query(
        collection(db, 'users'),
        where('username', '==', displayName),
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // Display name already exists
      setError('Display name already exists. Please choose another.')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      message.success('Account created successfully')

      // Save user info to Firestore
      const docRef = doc(db, 'users', email)
      await setDoc(docRef, {
        email: email,
        username: displayName,
        password: password,
        isAdministrator: false,
      })

      await updateProfile(userCredential.user, { displayName })
      history('/campaign-tools')
    } catch (error) {
      setError(error.message)
    }
  }

  const generateIcon = (isMet) => (
    isMet ? (
      <CheckCircleOutlined style={{ color: 'green' }} />
    ) : (
      <CloseCircleOutlined style={{ color: 'red' }} />
    )
  )

  const checkRequirements = async () => {
    const email = form.getFieldValue('email')
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const isDisplayNameEntered = displayName.trim() !== ''

    const passwordRequirements = [
      newPassword.length >= 8,
      /[A-Z]/.test(newPassword),
      /[a-z]/.test(newPassword),
      /[0-9]/.test(newPassword),
      /[!@#$%^&*]/.test(newPassword),
    ]

    setPasswordRequirements(passwordRequirements)

    const areAllRequirementsMet =
      isEmailValid &&
      isDisplayNameEntered &&
      passwordRequirements.every((requirement) => requirement)
    setIsSubmitDisabled(!areAllRequirementsMet)
  }

  const requirementsData = [
    {
      text: 'At least 8 characters',
    },
    {
      text: 'Contains at least one uppercase letter',
    },
    {
      text: 'Contains at least one lowercase letter',
    },
    {
      text: 'Contains at least one digit (0-9)',
    },
    {
      text: 'Contains at least one special character (!@#$%^&*)',
    },
  ]

  useEffect(() => {
    checkRequirements()
  }, [form, newPassword, displayName])

  return (
    <div className="auth-page">
      <div className="auth-header">
        <img src={logo} alt="Bernoulli Technologies Logo" className="auth-logo"/>
        <span className="auth-title">Account Signup</span>
      </div>
      <div className="auth-container">
        <Form
          name="signup"
          onFinish={onFinish}
          layout="vertical"
          form={form}
          className="auth-form"
        >
          <Form.Item
            label="Email"
            name="email"
            className="auth-form-item"
            rules={[
              { required: true, type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input placeholder="Email" className="auth-input" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            className="auth-form-item"
            rules={[
              { required: true, message: 'Please enter your password!' },
            ]}
          >
            <Input.Password
              placeholder="Password"
              className="auth-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={onFocusPassword}
              onBlur={onBlurPassword}
            />
          </Form.Item>

          <Form.Item
            label="Display Name"
            name="displayName"
            className="auth-form-item" // Assuming this class is styled in Signup.css
            rules={[
              { required: true, message: 'Please enter your display name!' },
            ]}
          >
            <Input
              placeholder="Display Name"
              className="auth-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Form.Item>
          {showRequirements && (
            <div className="password-requirements">
              <List
                size="small"
                bordered
                dataSource={requirementsData.map((requirement, index) => ({
                  ...requirement,
                  icon: generateIcon(passwordRequirements[index]),
                }))}
                renderItem={(item) => (
                  <List.Item>
                    {item.icon}&nbsp;{item.text}
                  </List.Item>
                )}
              />
            </div>
          )}
          {error && <div className="error-text">{error}</div>}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitDisabled}
              className="auth-submit-button"
            >
            Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Text className="auth-footer-text"> {/* New class for footer text */}
        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </Text>
      </div>
    </div>
  )
}

export default Signup
