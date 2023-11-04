import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../auth/firebase.jsx'
import PermissionsModal from '../modals/PermissionsModal.jsx'

const { Sider } = Layout

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false)
  const [isAdministrator, setIsAdministrator] = useState(false)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, 'users', user.email)
        const docSnap = await getDoc(userDoc)

        if (docSnap.exists()) {
          setIsAdministrator(docSnap.data().isAdministrator)
        }
      }
    })

    return () => unsubscribe()
  }, [auth])

  const togglePermissionsModal = () => {
    setPermissionsModalVisible(!permissionsModalVisible)
  }

  return (
    <Sider
      trigger={null}
      collapsed={collapsed}
      width={collapsed ? 50 : 150}
      style={{ position: 'sticky', top: '64px', height: '100vh' }}
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
        <Menu.Item key="4" icon={<SettingOutlined />} onClick={togglePermissionsModal}>
          Settings
        </Menu.Item>
      </Menu>
      <PermissionsModal
        visible={permissionsModalVisible}
        onClose={togglePermissionsModal}
        userRole={isAdministrator ? 'administrator' : 'user'}
      />
    </Sider>
  )
}

export default Sidebar
