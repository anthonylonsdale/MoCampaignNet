import { Button, Layout, Typography } from 'antd'
import { getFunctions, httpsCallable } from 'firebase/functions'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingScreen from '../LoadingScreen.jsx'
import { usePermissions } from '../auth/Permissions.jsx'
import Auth from '../auth/auth.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import Sidebar from '../components/SideBar.jsx'
import MappingContainer from '../mapping/MapContainer.jsx'
import './MappingApp.css'

const { Content } = Layout
const { Text } = Typography

function MappingApp() {
  const { user, handleSignOut } = usePermissions()
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  const functions = getFunctions()
  const validateSession = httpsCallable(functions, 'validateSession')
  const navigate = useNavigate()

  useEffect(() => {
    const userId = user?.uid
    const sessionId = localStorage.getItem('sessionId')

    const validate = async () => {
      const isValidSession = await validateSession({ userId, sessionId })
      setIsCheckingSession(!isValidSession)
    }

    validate()
  }, [])

  if (isCheckingSession) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <>
      <Layout className="campaign-layout">
        <CustomHeader />
        <Layout>
          <Sidebar user={user} />
          <Content className="content">
            {user ? (
          <>
            <div className="user-container">
              <div className="text-container">
                <Text className="welcome-text">Welcome, {user.displayName}</Text>
              </div>
              <div className="title-container">
                <Text className="interactive-title" onClick={() => navigate('/campaign-tools')}>Interactive Mapping Client</Text>
              </div>
              <div className="button-container">
                <Button className="action-button" onClick={handleSignOut}>
                  Logout
                </Button>
              </div>
            </div>
            <div className="divider"></div>
            <MappingContainer />
          </>
          ) : (
            <Auth />
          )}
          </Content>
        </Layout>
      </Layout>
      <AppFooter />
    </>
  )
}

export default MappingApp
