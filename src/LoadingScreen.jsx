import { Spin, Typography } from 'antd'
import React from 'react'
import styles from './LoadingScreen.module.css'

const { Text } = Typography

// put this in the root because this will be used across the application
const LoadingScreen = () => {
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.loadingContent}>
        <Spin size="large" />
        <Text className={styles.loadingText}>Loading, please wait...</Text>
      </div>
    </div>
  )
}

export default LoadingScreen
