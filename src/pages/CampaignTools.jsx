import { InboxOutlined } from '@ant-design/icons'
import { Button, Layout, Space, Tabs, Typography, Upload, message } from 'antd'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import AccountSettingsModal from '../auth/AccountSettingsModal.jsx'
import Auth from '../auth/auth.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import HtmlDisplay from '../components/HtmlDisplay.jsx'
import Sidebar from '../components/SideBar.jsx'
import missouriDotMap from '../images/mokan.png'
import InteractiveMapper from '../mapping/InteractiveMapper.jsx'
import ExcelColumnSelector from '../modals/ExcelColumnSelector.jsx'
import './CampaignTools.css'

const { Content } = Layout
const { Text, Title } = Typography
const { TabPane } = Tabs
const { Dragger } = Upload

function CampaignTools() {
  const [user, setUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [excelModalVisible, setExcelModalVisible] = useState(false)
  const [droppedFile, setDroppedFile] = useState(null)
  const [mapPoints, setMapPoints] = useState([])

  const auth = getAuth()

  const clearMapPoints = () => {
    setMapPoints([])
  }

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
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [auth])

  const sendMessage = async () => {
    try {
      const functionUrl = 'https://us-central1-leaddrive-pro.cloudfunctions.net/addmessage'
      const response = await fetch(functionUrl, {
        method: 'POST',
        body: JSON.stringify({ text: 'test' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      console.log(result)
      alert(`Message sent! ID: ${result.result}`)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while sending the message.')
    }
  }

  const userContainer = () => {
    return (
      <Space direction="vertical" className="user-space">
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
      </Space>
    )
  }

  return (
    <>
      <Layout className="campaign-layout">
        <ExcelColumnSelector
          visible={excelModalVisible}
          onCancel={() => setExcelModalVisible(false)}
          droppedFile={droppedFile}
          setMapPoints={setMapPoints}
        />
        <AccountSettingsModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
        />
        <CustomHeader />
        <Layout>
          <Sidebar />
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
            <div className="html-container">
              <Title level={4}>
                Format Excel Data Into Walkbook:
              </Title>
            </div>
            <div className="upload-container">
              <Dragger
                beforeUpload={(file) => {
                  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
                    message.error('File is not in Excel format', 3)
                    return Upload.LIST_IGNORE
                  }
                  setDroppedFile(file)
                  setExcelModalVisible(true)
                  return false
                }}
                multiple={false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Drag and drop an Excel file here or click here to select one</p>
              </Dragger>
            </div>
            <div className="html-container">
              <Title level={4}>
                Data Visualization
              </Title>
              {mapPoints.length > 0 && (
                <Button onClick={clearMapPoints} style={{ marginBottom: '10px' }}>
                  Clear Data
                </Button>
              )}
            </div>
            <div>
              <InteractiveMapper mapPoints={mapPoints} clearMapPoints={clearMapPoints} />
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
