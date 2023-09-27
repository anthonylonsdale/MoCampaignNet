
import { Layout, Space, Typography } from 'antd'
import React, { useState } from 'react'
import '../App.css'

import CustomHeader from '../components/CustomHeader.jsx'
import Sidebar from '../components/SideBar.jsx'

const { Content } = Layout
const { Title } = Typography

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
            <Title level={2}>
            TEST
            </Title>
          </Space>
        </Content>
      </Layout>
    </Layout>
  )
}

export default CampaignTools
