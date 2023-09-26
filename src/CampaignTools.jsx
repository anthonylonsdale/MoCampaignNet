import { Divider, Layout, Space, Typography } from 'antd'
import React, { useState } from 'react'

import './App.css'

import CustomHeader from './components/CustomHeader.jsx'
import Sidebar from './components/SideBar.jsx'


const { Content } = Layout
const { Title, Paragraph } = Typography

function CampaignTools() {
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
              GOBS
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
                  Test
                </Paragraph>
              </div>
            </Space>
          </Space>
        </Content>
      </Layout>
    </Layout>
  )
}

export default CampaignTools
