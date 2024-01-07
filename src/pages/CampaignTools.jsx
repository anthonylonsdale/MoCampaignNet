import { DeploymentUnitOutlined, HomeOutlined } from '@ant-design/icons'
import { Button, Card, Col, Layout, Row, Typography } from 'antd'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePermissions } from '../auth/Permissions.jsx'
import Auth from '../auth/auth.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import Sidebar from '../components/SideBar.jsx'
import './CampaignTools.css'

const { Content } = Layout
const { Text } = Typography

const applications = [
  {
    route: '/mapping',
    type: 'mapping',
  },
  {
    route: '/doorknocking',
    type: 'doorknocking',
  },
]

const ApplicationCard = ({ app }) => {
  const navigate = useNavigate()

  const renderAvatar = () => {
    switch (app.type) {
      case 'mapping':
        return <DeploymentUnitOutlined style={{ fontSize: '350%' }} />
      case 'doorknocking':
        return <HomeOutlined style={{ fontSize: '350%' }} />
    }
  }

  const renderCardContent = () => {
    switch (app.type) {
      case 'mapping':
        return (
          <div className="mapping-client-container">
            <Text className="interactive-title">Interactive Mapping Client</Text>
          </div>
        )
      case 'doorknocking':
        return (
          <div className="mapping-client-container">
            <Text className="interactive-title">Doorknocking Client</Text>
          </div>
        )
    }
  }

  return (
    <Col xs={24} sm={12} md={10} lg={8} xl={8}>
      <Card hoverable onClick={() => navigate(app.route)} className="application-card">
        <Card.Meta
          avatar={renderAvatar()}
          description={renderCardContent()}
          className="card-meta"
        />
      </Card>
    </Col>
  )
}

function CampaignTools() {
  const { user, handleSignOut } = usePermissions()

  return (
    <>
      <CustomHeader />
      <Layout>
        <Sidebar user={user} />
        <Content>
          {user ? (
          <>
            <div className="user-container">
              <div className="text-container">
                <Text className="welcome-text">Welcome, {user.displayName}</Text>
              </div>
              <div className="button-container">
                <Button className="action-button" onClick={handleSignOut}>
                  Logout
                </Button>
              </div>
            </div>
            <Row gutter={[16, 16]} className="row-padding">
              {applications.map((app, index) => (
                <ApplicationCard key={index} app={app} />
              ))}
            </Row>
          </>
          ) : (
            <Auth />
          )}
        </Content>
      </Layout>
      <AppFooter />
    </>
  )
}

export default CampaignTools
