import { Divider, Layout, Space, Typography } from 'antd'
import React, { useState } from 'react'

import '../App.css'

import Sidebar from '../components/SideBar.jsx'

const { Content } = Layout
const { Title, Paragraph } = Typography


function Homescreen() {
  const [collapsed, setCollapsed] = useState(true)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <Content
          style={{
            padding: 24,
            minHeight: 280,
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={2}>
                      Specializing in independent Software Development,
                      Modeling and Political Consulting. Founded in 2021

            </Title>
            <Divider />
            <Paragraph>
            Welcome to our political campaign platform. Here, you can find
            valuable information, updates, and resources for your campaign.
            </Paragraph>
            <Divider />
            <Space size="large">
              <div>
                <Title level={3}>Campaign Images</Title>
                <img
                  src="your-image-url.jpg"
                  alt="Campaign Image"
                  style={{ maxWidth: '100%' }}
                />
              </div>
              <div>
                <Title level={3}>Campaign Updates</Title>
                <Paragraph>
                Stay tuned for the latest campaign updates and news.
                </Paragraph>
              </div>
            </Space>
          </Space>
        </Content>
      </Layout>
    </Layout>)
}

export default Homescreen
