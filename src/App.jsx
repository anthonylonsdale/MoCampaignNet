import { Divider, Layout, Space, Typography } from 'antd'
import React, { useState } from 'react'

import './App.css'

import CustomHeader from './components/CustomHeader.jsx'
import Sidebar from './components/Sidebar.jsx'


const { Content } = Layout
const { Title, Paragraph } = Typography

function App() {
  const [collapsed, setCollapsed] = useState(true)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <CustomHeader />
      <Layout>
        <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <Content
          style={{
            padding: 24,
            minHeight: 280,
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={2}>Political Campaign Content</Title>
            <Divider />
            <Paragraph>
              Welcome
              Welcome to our political campaign platform. Here, you can find
              valuable information, updates, and resources for your campaign.
            </Paragraph>
            <Divider />
            <Space size="large">
              <div>
                <Title level={3}>Campaign Images</Title>
                {/* Add your campaign images here */}
                <img
                  src="your-image-url.jpg"
                  alt="Campaign Image"
                  style={{ maxWidth: '100%' }}
                />
              </div>
              <div>
                <Title level={3}>Campaign Updates</Title>
                {/* Add campaign updates here */}
                <Paragraph>
                  Stay tuned for the latest campaign updates and news.
                </Paragraph>
              </div>
            </Space>
          </Space>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
