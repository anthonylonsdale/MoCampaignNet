import { Button, Layout, Tabs, Typography } from 'antd'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import AccountSettingsModal from '../auth/AccountSettingsModal.jsx'
import Auth from '../auth/auth.jsx'
import { db } from '../auth/firebase.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import HtmlDisplay from '../components/HtmlDisplay.jsx'
import Sidebar from '../components/SideBar.jsx'
import missouriDotMap from '../images/mokan.png'
import MappingContainer from '../mapping/MapContainer.jsx'
import './CampaignTools.css'

const { Content } = Layout
const { Text, Title } = Typography
const { TabPane } = Tabs

function CampaignTools() {
  const [user, setUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [isAdministrator, setIsAdministrator] = useState(false)

  const auth = getAuth()

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider()
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)

        const userDoc = doc(db, 'users', currentUser.email)
        const docSnap = await getDoc(userDoc)

        if (docSnap.exists()) {
          setIsAdministrator(docSnap.data().isAdministrator)
        }
      }
    })

    return () => unsubscribe()
  }, [auth])

  const sendMessage = async () => {
    try {
      const functionUrl = 'https://us-central1-leaddrive-pro.cloudfunctions.net/addmessage'
      const response = await fetch(functionUrl, {
        method: 'POST',
        body: JSON.stringify({ text: 'gibs' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()

      alert(`Message sent! ID: ${result.result}`)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while sending the message.')
    }
  }

  const userContainer = () => {
    return (
      <div className="user-info">
        <div className="text-container">
          <Text className="welcome-text">Welcome, {user.displayName}</Text>
          <Button className="action-button" onClick={() => setModalVisible(true)}>
            Account Settings
          </Button>
        </div>
        <div className="button-container">
          <Button className="action-button" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Layout className="campaign-layout">
        <AccountSettingsModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
        />
        <CustomHeader />
        <Layout>
          <Sidebar isAdministrator={isAdministrator} />
          <Content className="content">
            {user ? (
          <>
            <div className="user-container">
              {userContainer()}
            </div>
            <MappingContainer />
            <div className="html-container">
              <Title level={4}>
                Common Geographic Subdivisions:
              </Title>
            </div>
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
            <div className="html-container">
              <Title level={4}>
                (Demo) Backend Server Integration Test
              </Title>
              <Button onClick={sendMessage}>Send Message</Button>
            </div>
            <div className="html-container">
              <Title level={4}>
                Premium Data Map:
              </Title>
            </div>
            <div style={{ 'backgroundColor': '#000' }}>
              <img src={missouriDotMap} />
            </div>
            <div className="html-container">
              <Title level={4}>
                (Demo) Clay County Traffic Route Map:
              </Title>
              <HtmlDisplay fileName={'route_map'} />
              <Title level={4}>
                (Demo) Travelling Salesman Problem Solver for Voters in Walkbook:
              </Title>
              <HtmlDisplay fileName={'optimized_route_map'} />
            </div>
          </>
          ) : (
            <Auth handleSignIn={handleSignIn} />
          )}
          </Content>
        </Layout>
      </Layout>
      <AppFooter />
    </>
  )
}

export default CampaignTools
