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
import KnockingContainer from '../doorknocking/KnockingContainer.jsx'
import styles from './DoorknockingApp.module.css'

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
      <Layout className={styles.campaignLayout}>
        <CustomHeader />
        <Layout>
          <Sidebar user={user} />
          <Content className={styles.content}>
            {user ? (
              <>
                <div className={styles.userContainer}>
                  <div className={styles.textContainer}>
                    <Text className={styles.welcomeText}>Welcome, {user.displayName}</Text>
                  </div>
                  <div className={styles.titleContainer}>
                    <Text className={styles.interactiveTitle} onClick={() => navigate('/campaign-tools')}>Doorknocking Client</Text>
                  </div>
                  <div>
                    <Button className={styles.actionButton} onClick={handleSignOut}>
                      Logout
                    </Button>
                  </div>
                </div>
                <div className={styles.divider}></div>
                <KnockingContainer />
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
