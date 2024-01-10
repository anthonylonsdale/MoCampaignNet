import { Button, Form, Input, Typography, message } from 'antd'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logoblank.png'
import styles from './auth.module.css'
import { auth } from './firebase.jsx'

const { Text } = Typography

function Auth() {
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const history = useNavigate()

  const onFinish = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      history('/campaign-tools')
    } catch (error) {
      setError(error.message)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      message.error('Please enter your email address.')
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      message.success('Password reset email sent. Please check your inbox.')
    } catch (error) {
      message.error(error.message)
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authHeader}>
        <img src={logo} alt="Bernoulli Technologies Logo" className={styles.authLogo} />
        <span className={styles.authTitle}>Account Login</span>
      </div>
      <div className={styles.authContainer}>
        <Form
          name="signin"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email address!' }]}
          >
            <Input autoComplete="on" onChange={(e) => setEmail(e.target.value)} />
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
            <Input.Password autoComplete="" name='password' />
          </Form.Item>
          {error && <div className={styles.error}>{error}</div>}
          <div>
            <Button type="link" onClick={handlePasswordReset} className={styles.authLink}>
              Forgot Password?
            </Button>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit">Sign In</Button>
          </Form.Item>
        </Form>
        <Text>
        Don&apos;t have an account? <Link to="/signup" className={styles.authLink}>Sign Up</Link>
        </Text>
      </div>
    </div>

  )
}

export default Auth
