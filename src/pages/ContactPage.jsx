import { Button, Input, Layout, Typography } from 'antd'
import React from 'react'
import { useForm, ValidationError } from '@formspree/react'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import styles from './ContactPage.module.css'

const { Content } = Layout
const { Title, Paragraph } = Typography

export default function ContactPage() {
  const [state, handleSubmit] = useForm('xwprllyv')

  if (state.succeeded) {
    return (
      <>
        <CustomHeader />
        <Layout>
          <Content className={styles.pageContent}>
            <div className={styles.globalAurora} />
            <div className={styles.successContainer}>
              <div className={styles.successCard}>
                <Title level={2} className={styles.successTitle}>Thank You!</Title>
                <Paragraph className={styles.successText}>
                  We&apos;ve received your message and will get back to you shortly.
                </Paragraph>
              </div>
            </div>
          </Content>
        </Layout>
        <AppFooter />
      </>
    )
  }

  return (
    <>
      <CustomHeader />
      <Layout>
        <Content className={styles.pageContent}>
          <div className={styles.globalAurora} />

          <div className={styles.contactContainer}>
            <div className={styles.contactCard}>
              <Title level={2} className={styles.contactTitle}>Get In Touch</Title>
              <Paragraph className={styles.contactSubtitle}>
                Ready to elevate your campaign? Let&apos;s discuss how we can help you achieve victory.
              </Paragraph>

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Name *</label>
                  <Input
                    id="name"
                    name="name"
                    size="large"
                    placeholder="Your name"
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email *</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    size="large"
                    placeholder="you@company.com"
                    required
                    className={styles.formInput}
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>Phone</label>
                  <Input
                    id="phone"
                    name="phone"
                    size="large"
                    placeholder="(555) 555-5555"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    size="large"
                    placeholder="How can we help?"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>Message *</label>
                  <Input.TextArea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us about your campaign goals…"
                    required
                    className={styles.formTextarea}
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} />
                </div>

                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={state.submitting}
                  className={styles.submitButton}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </Content>
      </Layout>
      <AppFooter />
    </>
  )
}
