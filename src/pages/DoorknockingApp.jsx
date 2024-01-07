import { Button, Layout, Typography } from 'antd'
import { getFunctions, httpsCallable } from 'firebase/functions'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import LoadingScreen from '../LoadingScreen.jsx'
import { usePermissions } from '../auth/Permissions.jsx'
import Auth from '../auth/auth.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import Sidebar from '../components/SideBar.jsx'
import './MappingApp.css'

const { Content } = Layout
const { Text } = Typography

const DoorknockingApp = () => {
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
                <Text className="interactive-title" onClick={() => navigate('/campaign-tools')}>Doorknocking Client</Text>
              </div>
              <div className="button-container">
                <Button className="action-button" onClick={handleSignOut}>
                  Logout
                </Button>
              </div>
            </div>
            <div className="divider"></div>

            <div className="interactive-mapper-container">
              <MapContainer center={[38.573936, -92.603760]} zoom={13} fullscreenControl={true}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                  attribution='Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
                />
                <FeatureGroup>
                  {/* Add basic features here if needed */}
                </FeatureGroup>
              </MapContainer>
            </div>
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

export default DoorknockingApp
