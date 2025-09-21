import { MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Image, Layout, Typography } from 'antd'
import React from 'react'
import logo from '../images/logoblank.png' // ⬅ same logo as header
import styles from './Footer.module.css'

const { Footer } = Layout
const { Text } = Typography

function AppFooter() {
  return (
    <Footer className={styles.footerBar}>
      <div className={styles.brand}>
        <Image
          src={logo}
          alt="Bernoulli Technologies"
          preview={false}
          className={styles.footerLogo}
        />
        <div className={styles.footerTitle}>Bernoulli Technologies</div>
      </div>

      <div className={styles.contact}>
        <div className={styles.contactItem}>
          <MailOutlined className={styles.icon} />
          <Text className={styles.footerText}>
            <a href="mailto:alonsdale@bernoullitechnologies.net">alonsdale@bernoullitechnologies.net</a>
          </Text>
        </div>
        <div className={styles.contactItem}>
          <PhoneOutlined className={styles.icon} />
          <Text className={styles.footerText}>
            <a href="tel:+18168727762">(816) 872-7762</a>
          </Text>
        </div>
        <div className={styles.copy}>
          &copy; {new Date().getFullYear()} Bernoulli Technologies. All rights reserved.
        </div>
      </div>
    </Footer>
  )
}

export default AppFooter
