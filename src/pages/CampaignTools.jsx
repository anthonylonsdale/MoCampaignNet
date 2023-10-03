import { Button, Layout, Space, Typography } from 'antd'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import AccountSettingsModal from '../auth/AccountSettingsModal.jsx'
import Auth from '../auth/auth.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import Sidebar from '../components/SideBar.jsx'

import HtmlDisplay from '../components/HtmlDisplay.jsx'

import './CampaignTools.css'

const { Content } = Layout
const { Text } = Typography

function CampaignTools() {
  const [collapsed, setCollapsed] = useState(true)
  const [user, setUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const auth = getAuth()

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

  const userContainer = () => {
    return (
      <Space direction="vertical" className="user-space">
        <div className="user-info">
          <div className="text-container">
            <Text className="welcome-text">Welcome, {user.displayName}</Text>
            <Button className="action-button" onClick={() =>
              setModalVisible(true)}>
              Account Settings
            </Button>
          </div>
          <div className="button-container">
            <Button className="action-button" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </Space>
    )
  }

  return (
    <Layout className="campaign-layout">
      <CustomHeader />
      <AccountSettingsModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      />
      <Layout>
        <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <Content className="content">
          {user ? (
          <>
            <div className="user-container">
              {userContainer()}
            </div>
            <div className="html-container">
              <HtmlDisplay />
            </div>
          </>
          ) : (
            <Auth handleSignIn={handleSignIn} />
        )}
        </Content>
      </Layout>
    </Layout>
  )
}

export default CampaignTools
