// src/pages/ContactPage.jsx
import React from 'react'
import { useForm, ValidationError } from '@formspree/react'
import { Input, Button, Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function ContactPage() {
  const [state, handleSubmit] = useForm('xwprllyv')

  if (state.succeeded) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
        <Title level={2} style={{ marginBottom: 8 }}>Thanks!</Title>
        <Paragraph>We’ve received your message and will get back to you shortly.</Paragraph>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
      <Title level={2} style={{ marginBottom: 8 }}>Contact Us</Title>
      <Paragraph style={{ marginBottom: 24 }}>
        We’ll get back to you quickly. Fields marked * are required.
      </Paragraph>

      {/* Native <form> so Formspree can capture the submit event */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Name *</label>
        <Input id="name" name="name" size="large" placeholder="Your name" required style={{ marginBottom: 14 }} />

        <label htmlFor="email" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Email *</label>
        <Input id="email" name="email" type="email" size="large" placeholder="you@company.com" required style={{ marginBottom: 4 }} />
        <ValidationError prefix="Email" field="email" errors={state.errors} />

        <label htmlFor="phone" style={{ display: 'block', fontWeight: 600, marginTop: 12, marginBottom: 6 }}>Phone</label>
        <Input id="phone" name="phone" size="large" placeholder="(555) 555-5555" style={{ marginBottom: 14 }} />

        <label htmlFor="subject" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Subject</label>
        <Input id="subject" name="subject" size="large" placeholder="How can we help?" style={{ marginBottom: 14 }} />

        <label htmlFor="message" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Message *</label>
        <Input.TextArea id="message" name="message" rows={6} placeholder="Tell us about your project…" required style={{ marginBottom: 4 }} />
        <ValidationError prefix="Message" field="message" errors={state.errors} />

        {/* Optional metadata */}
        {/* <input type="hidden" name="_subject" value="New inquiry from website" /> */}

        <Button htmlType="submit" type="primary" size="large" loading={state.submitting} style={{ marginTop: 12 }}>
          Send Message
        </Button>
      </form>
    </div>
  )
}
