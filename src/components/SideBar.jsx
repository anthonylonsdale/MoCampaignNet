import React, {useState} from 'react'
import {Button, Layout, Menu} from 'antd'
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'


const {Header, Sider, Content} = Layout

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">Logo</div>
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
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

export default Sidebar
