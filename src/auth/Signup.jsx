import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, List, Typography, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'
import { db } from './firebase.jsx'

const { Text, Title } = Typography

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
    <div className="signup-container">
      <Title level={2}>Sign Up</Title>
      <Form name="signup" onFinish={onFinish} layout="vertical" form={form}>
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

        <Form.Item
          label="Display Name"
          name="displayName"
          rules={[
            {
              required: true,
              message: 'Please enter your display name!',
            },
          ]}
        >
          <Input
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Form.Item>
        {showRequirements && (
          <List
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
        )}
        {error && <div className="error-text">{error}</div>}
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      <Text>
        Already have an account? <Link to="/login"
          className="auth-link">Sign In</Link>
      </Text>
    </div>
  )
}

export default Signup
