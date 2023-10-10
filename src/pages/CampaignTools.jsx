import './CampaignTools.css'

import { Button, Layout, Space, Tabs, Typography } from 'antd'
import {
  GoogleAuthProvider, getAuth, signInWithPopup,
  signOut,
} from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import AccountSettingsModal from '../auth/AccountSettingsModal.jsx'
import Auth from '../auth/auth.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import HtmlDisplay from '../components/HtmlDisplay.jsx'
import Sidebar from '../components/SideBar.jsx'

const { TabPane } = Tabs
const { Content } = Layout
const { Text, Title } = Typography

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
              <Title level={4}>
                Common Geographic Subdivisions:
              </Title>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Missouri House Districts (2022)" key="1">
                  <HtmlDisplay fileName={'mohouse'} />
                </TabPane>
                <TabPane tab="Missouri House Districts (2011)" key="2">
                  <HtmlDisplay fileName={'mohouse2011'} />
                </TabPane>
                <TabPane tab="Missouri Senate Districts (2022)" key="3">
                  <HtmlDisplay fileName={'mosenate'} />
                </TabPane>
                <TabPane tab="Missouri Senate Districts (2012)" key="4">
                  <HtmlDisplay fileName={'mosenate2011'} />
                </TabPane>
                <TabPane tab="Missouri Cities (2022)" key="5">
                  <HtmlDisplay fileName={'mocities'} />
                </TabPane>
              </Tabs>
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
