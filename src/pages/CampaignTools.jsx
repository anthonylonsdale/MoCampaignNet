import { Button, Layout, Space, Typography } from 'antd'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import '../App.css'
import AccountSettingsModal from '../auth/AccountSettingsModal.jsx'
import SignIn from '../auth/Signin.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import Sidebar from '../components/SideBar.jsx'

const { Content } = Layout
const { Title } = Typography

function CampaignTools() {
  const [collapsed, setCollapsed] = useState(true)
  const [user, setUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const auth = getAuth()
  console.log(auth)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider() // Using Google Sign-In
    try {
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
    } catch (error) {
      console.error('Sign in error:', error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error.message)
    }
  }

  useEffect(() => {
    // Check the current user's authentication status
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [auth])

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
            <Title level={2}>TEST</Title>
            {user ? (
              <>
                <Button onClick={handleSignOut}>Sign Out</Button>
                <Button onClick={() => setModalVisible(true)}>Account Settings</Button>
                <AccountSettingsModal
                  visible={modalVisible}
                  onCancel={() => setModalVisible(false)}
                />
              </>
            ) : (
              <SignIn handleSignIn={handleSignIn} />
            )}
          </Space>
        </Content>
      </Layout>
    </Layout>
  )
}

export default CampaignTools
