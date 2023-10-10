import { Button, Form, Image, Input, Typography } from 'antd'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import loginTracer from './LoginTracer.jsx'
import './auth.css'

const { Text } = Typography

function Auth() {
  const [error, setError] = useState('')
  const history = useNavigate()

  const onFinish = async (values) => {
    const { email, password } = values
    const auth = getAuth()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log(auth)

      loginTracer(auth.currentUser.uid)

      history('/campaign-tools')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="auth-container">
      <Image src={logo} alt="Your Logo" className="logo" preview={false} />
      <Form
        name="signin"
        onFinish={onFinish}
        layout="vertical"
      >
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
          <Input />
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
          <Input.Password />
        </Form.Item>
        {error && <div className="error">{error}</div>}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
        </Form.Item>
      </Form>
      <Text>
        Don&apos;t have an account?
        <Link to="/signup" className="auth-link">Sign Up</Link>
      </Text>
    </div>
  )
}

export default Auth
