import { Spin, Typography } from 'antd'
import React from 'react'
import './LoadingScreen.css'

const { Text } = Typography

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <Spin size="large" />
        <Text className="loading-text">Loading, please wait...</Text>
      </div>
    </div>
  )
}

export default LoadingScreen
