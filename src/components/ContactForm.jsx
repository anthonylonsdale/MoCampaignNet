import React, { useState } from 'react'
import { Resend } from 'resend'
import styles from './ContactForm.module.css'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const resend = new Resend('re_d33JY2vQ_Dgyjni4jmzJHMNosSwgFbowu')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await resend.sendEmail({
        from: 'alonsdale@bernoullitechnologies.net',
        to: 'alons3253@gmail.com',
        subject: `New Message from ${formData.name}`,
        html: `<strong>From:</strong> ${formData.email}<br>
        <p>${formData.message}</p>`,
      })

      alert('Email sent successfully')
    } catch (error) {
      alert('Failed to send email')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })}
          className={styles.textarea}
        ></textarea>
      </div>
      <button type="submit" className={styles.button}>Submit</button>
    </form>
  )
}

export default ContactForm
