import { Button, Form, Input, Typography, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logoblank.png'
import styles from './Signup.module.css'
import PasswordRequirements from './components/PasswordRequirements.jsx'
import { auth, db } from './firebase.jsx'

const { Text } = Typography

function Signup() {
  const [error, setError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [showRequirements, setShowRequirements] = useState(false)
  const history = useNavigate()
  const [form] = useForm()

  const onFinish = async (values) => {
    const { email, password, displayName } = values
    const q = query(
        collection(db, 'users'),
        where('username', '==', displayName),
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      setError('Display name already exists. Please choose another.')
      return
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      message.success('Account created successfully')

      const docRef = doc(db, 'users', userCredentials.user.uid)
      await setDoc(docRef, {
        email: email,
        username: displayName,
        password: password,
        phoneNumber: null,
        isAdministrator: false,
      })

      await updateProfile(userCredentials.user, { displayName })
      history('/campaign-tools')
    } catch (error) {
      setError(error.message)
    }
  }

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

    const areAllRequirementsMet =
      isEmailValid &&
      isDisplayNameEntered &&
      passwordRequirements.every((requirement) => requirement)
    setIsSubmitDisabled(!areAllRequirementsMet)
  }

  useEffect(() => {
    checkRequirements()
  }, [form, newPassword, displayName])

  return (
    <div className={styles.authPage}>
      <div className={styles.authHeader}>
        <img src={logo} alt="Bernoulli Technologies Logo" className={styles.authLogo}/>
        <span className={styles.authTitle}>Account Signup</span>
      </div>
      <div className={styles.authContainer}>
        <Form
          name="signup"
          onFinish={onFinish}
          layout="vertical"
          form={form}
          className={styles.authForm}
        >
          <Form.Item
            label="Email"
            name="email"
            className={styles.authFormItem}
            rules={[
              { required: true, type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input placeholder="Email" className={styles.authInput} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            className={styles.authFormItem}
            rules={[
              { required: true, message: 'Please enter your password!' },
            ]}
          >
            <Input.Password
              placeholder="Password"
              className={styles.authInput}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setShowRequirements(true)}
              onBlur={() => setShowRequirements(false)}
            />
          </Form.Item>

          <Form.Item
            label="Display Name"
            name="displayName"
            className={styles.authFormItem}
            rules={[
              { required: true, message: 'Please enter your display name!' },
            ]}
          >
            <Input
              placeholder="Display Name"
              className={styles.authInput}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Form.Item>

          <PasswordRequirements password={newPassword} visible={showRequirements} />

          {error && <div className={styles.errorText}>{error}</div>}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitDisabled}
              className={styles.authSubmitButton}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Text className={styles.authFooterText}>
          Already have an account? <Link to="/login" className={styles.authLink}>Sign In</Link>
        </Text>
      </div>
    </div>
  )
}

export default Signup
