// ContactOwnerForm.jsx
import { Button, Form, Input, message } from 'antd'
import React, { useState } from 'react'

function ContactOwnerForm() {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://your-server.com/contact-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, content }),
      })
      if (response.ok) {
        // Handle success
        message.success('Email sent successfully')
      } else {
        message.error('Error sending email:', response.statusText)
      }
    } catch (error) {
      message.error('Network error:', error)
    }
  }

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="Email" required>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>
      <Form.Item label="Subject" required>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </Form.Item>
      <Form.Item label="Content" required>
        <Input.TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Send Email</Button>
      </Form.Item>
    </Form>
  )
}

export default ContactOwnerForm
