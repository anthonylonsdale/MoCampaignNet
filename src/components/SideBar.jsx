import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React, { useState } from 'react'


const { Sider } = Layout

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <Sider
      trigger={null}
      collapsed={collapsed}
      width={collapsed ? 50 : 150}
      style={collapsed ? { position: 'sticky', top: '64px', height: '100vh' } :
      { position: 'sticky', top: '64px', height: '100vh' }}
    >
      <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
        <Menu.Item
          key="1"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        >
          {collapsed === false && 'Collapse'}
        </Menu.Item>
        <Menu.Item key="2" icon={<HomeOutlined />}
          onClick={() => window.scrollTo(0, 0)}
        >
          Home
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
      </Menu>
    </Sider>

  )
}

export default Sidebar
