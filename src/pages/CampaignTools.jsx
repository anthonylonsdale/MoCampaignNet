import { Button, Layout, Typography } from 'antd'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import Auth from '../auth/auth.jsx'
import { db } from '../auth/firebase.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import Sidebar from '../components/SideBar.jsx'
import MappingContainer from '../mapping/MapContainer.jsx'
import './CampaignTools.css'

const { Content } = Layout
const { Text, Title } = Typography

function CampaignTools() {
  const [user, setUser] = useState(null)

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
        const userDoc = doc(db, 'users', currentUser.uid)
        const docSnap = await getDoc(userDoc)

        if (docSnap.exists()) {
          setUser(currentUser)
        } else {
          alert('Error with User...')
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
              <div className="button-container">
                <Button className="action-button" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>

            <MappingContainer />

            <div className="html-container">
              <Title level={4}>
                (Demo) Backend Server Integration Test
              </Title>
              <Button onClick={sendMessage}>Send Message</Button>
            </div>
            {/*
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
            </div>
            */}
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
