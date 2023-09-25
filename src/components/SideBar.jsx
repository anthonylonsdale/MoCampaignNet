import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React from 'react'


const { Sider } = Layout

function Sidebar({ collapsed, toggleSidebar }) {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={collapsed ? 50 : 150}
    >
      <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
        <Menu.Item
          key="1"
          onClick={toggleSidebar}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        >
          {collapsed === false && 'Collapse'}
        </Menu.Item>
        <Menu.Item key="2" icon={<HomeOutlined />}>
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
