import { DeploymentUnitOutlined, HomeOutlined, NodeCollapseOutlined } from '@ant-design/icons'
import { Button, Card, Col, Layout, Row, Typography } from 'antd'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePermissions } from '../auth/Permissions.jsx'
import Auth from '../auth/auth.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import Sidebar from '../components/SideBar.jsx'
import styles from './CampaignTools.module.css'; // Import CSS module

const { Content } = Layout
const { Text } = Typography

const applications = [
  {
    route: '/mapping',
    type: 'mapping',
    permissionKey: 'View Mapping Client',
  },
  {
    route: '/doorknocking',
    type: 'doorknocking',
    permissionKey: 'View Doorknocking Client',
  },
  {
    route: '/electionsim',
    type: 'electionsim',
    permissionKey: 'View Election Simulator',
  },
]

const ApplicationCard = ({ app }) => {
  const navigate = useNavigate()
  const { permissions } = usePermissions()
  const hasPermission = permissions[app.permissionKey]

  const handleClick = () => {
    if (hasPermission) {
      navigate(app.route)
    }
  }

  const renderAvatar = () => {
    switch (app.type) {
      case 'mapping':
        return <DeploymentUnitOutlined style={{ fontSize: '350%' }} />
      case 'doorknocking':
        return <HomeOutlined style={{ fontSize: '350%' }} />
      case 'electionsim':
        return <NodeCollapseOutlined style={{ fontSize: '350%' }} />
    }
  }

  const renderCardContent = () => {
    switch (app.type) {
      case 'mapping':
        return (
          <div className={styles.mappingClientContainer}>
            <Text className={styles.interactiveTitle}>Interactive Mapping Client</Text>
          </div>
        )
      case 'doorknocking':
        return (
          <div className={styles.mappingClientContainer}>
            <Text className={styles.interactiveTitle}>Doorknocking Client</Text>
          </div>
        )
      case 'electionsim':
        return (
          <div className={styles.mappingClientContainer}>
            <Text className={styles.interactiveTitle}>Election Simulator</Text>
          </div>
        )
    }
  }

  return (
    <Col xs={24} sm={12} md={10} lg={8} xl={8}>
      <Card
        hoverable={hasPermission}
        onClick={handleClick}
        className={hasPermission ? styles.applicationCard : styles.blurredCard}
      >
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
              <div className={styles.userContainer}>
                <div className={styles.textContainer}>
                  <Text className={styles.welcomeText}>Welcome, {user.displayName}</Text>
                </div>
                <div>
                  <Button className={styles.actionButton} onClick={handleSignOut}>
                  Logout
                  </Button>
                </div>
              </div>
              <Row gutter={[16, 16]} className={styles.rowPadding}>
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
