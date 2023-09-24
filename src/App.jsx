import React, {useState} from 'react'
import {Layout, Menu} from 'antd'

import Sidebar from './components/SideBar.jsx'
import {Header} from 'antd/es/layout/layout.js'

function App() {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Header
        className="site-layout-background"
        style={{padding: 0, display: 'flex', alignItems: 'center'}}
      >
        <div style={{flex: 1}}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item key="2">Portfolio</Menu.Item>
            <Menu.Item key="3">Campaign Tools</Menu.Item>
          </Menu>
        </div>
      </Header>
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <div
        style={{
          padding: 24,
          minHeight: 280,
          transition: 'margin-left 0.3s',
          marginLeft: collapsed ? 80 : 200, // Adjust the width when collapsed
        }}
      >
          Content goes here. This content is in the App component.
      </div>
    </Layout>
  )
}

export default App
