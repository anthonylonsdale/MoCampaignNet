import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React, { useState } from 'react'
import PermissionsModal from '../modals/PermissionsModal.jsx'

const { Sider } = Layout

function Sidebar({ isAdministrator }) {
  const [collapsed, setCollapsed] = useState(false)
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false)

  return (
    <Sider
      trigger={null}
      collapsed={collapsed}
      width={collapsed ? 50 : 150}
      style={{ position: 'sticky', top: 0, height: '100vh' }}
    >
      <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" onClick={() => setCollapsed(!collapsed)} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} >
          {!collapsed ? 'Collapse': 'Expand'}
        </Menu.Item>
        <Menu.Item key="2" icon={<HomeOutlined />} onClick={() => window.scrollTo(0, 0)}>
          Home
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />} onClick={() => setPermissionsModalVisible(!permissionsModalVisible)}>
          Settings
        </Menu.Item>
      </Menu>
      <PermissionsModal
        visible={permissionsModalVisible}
        onClose={() => setPermissionsModalVisible(!permissionsModalVisible)}
        userRole={isAdministrator ? 'administrator' : 'user'}
      />
    </Sider>
  )
}

export default Sidebar