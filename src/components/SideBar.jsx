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

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true)
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false)

  const togglePermissionsModal = () => {
    setPermissionsModalVisible(!permissionsModalVisible)
  }

  // Define permissions based on the user's role
  const userPermissions = ['View Dashboard', 'Edit Profile', 'Change Settings']
  const administratorPermissions = [
    ...userPermissions,
    'Add Users',
    'Remove Users',
  ]

  const userRole = 'administrator' // Change this to the user's actual role

  return (
    <Sider
      trigger={null}
      collapsed={collapsed}
      width={collapsed ? 50 : 150}
      style={{
        position: 'sticky',
        top: '64px',
        height: '100vh',
      }}
    >
      <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
        <Menu.Item
          key="1"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        >
          {!collapsed && 'Collapse'}
        </Menu.Item>
        <Menu.Item key="2" icon={<HomeOutlined />} onClick={() => window.scrollTo(0, 0)}>
          Home
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />} onClick={togglePermissionsModal}>
          Settings
        </Menu.Item>
      </Menu>

      {/* Permissions Modal */}
      <PermissionsModal
        visible={permissionsModalVisible}
        onClose={togglePermissionsModal}
        permissions={userRole === 'administrator' ? administratorPermissions : userPermissions}
      />
    </Sider>
  )
}

export default Sidebar
