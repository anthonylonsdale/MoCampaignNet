import { MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Image, Layout, Typography } from 'antd'
import React from 'react'
import logo from '../images/logo.png'
import styles from './Footer.module.css'

const { Footer } = Layout
const { Text } = Typography

function AppFooter() {
  return (
    <Footer className={styles.footer}>
      <div className={styles.footerContent}>
        <Image
          src={logo}
          alt="Logo"
          width={160} // Set your desired size
          preview={false}
        />
        <div className={styles.buttonLikeText}>
          &copy; {new Date().getFullYear()} Bernoulli Technologies. All rights reserved.
        </div>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <MailOutlined className={styles.icon} />
            <Text className={styles.footerText}>alonsdale@bernoullitechnologies.net</Text>
          </div>
          <div className={styles.contactItem}>
            <PhoneOutlined className={styles.icon} />
            <Text className={styles.footerText}>(816) 872-7762</Text>
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default AppFooter
