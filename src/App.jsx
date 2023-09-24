// App.jsx
import React, {useState} from 'react'
import {Button, Layout} from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import Sidebar from './components/SideBar.jsx'

const {Header, Content} = Layout

function App() {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{padding: 0}}>
          {collapsed ? (
            <Button
              className="trigger"
              onClick={toggleSidebar}
              icon={<MenuUnfoldOutlined />}
            />
          ) : (
            <Button
              className="trigger"
              onClick={toggleSidebar}
              icon={<MenuFoldOutlined />}
            />
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            minHeight: 280,
            transition: 'margin-left 0.3s',
            marginLeft: collapsed ? 80 : 200, // Adjust the width when collapsed
          }}
        >
          Content goes here.
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
