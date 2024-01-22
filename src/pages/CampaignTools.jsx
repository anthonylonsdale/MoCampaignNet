import { DeploymentUnitOutlined, DollarOutlined, GlobalOutlined, HomeOutlined, NodeCollapseOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, Col, Layout, Row, Typography } from 'antd'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePermissions } from '../auth/Permissions.jsx'
import Auth from '../auth/auth.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import Sidebar from '../components/SideBar.jsx'
import styles from './CampaignTools.module.css'

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
  {
    route: '/votercontacts',
    type: 'votercontacts',
    permissionKey: 'View Voter Contacts',
  },
  {
    route: '/fundraising',
    type: 'fundraising',
    permissionKey: 'View Fundraising Analytics',
  },
  {
    route: '/volunteermgmt',
    type: 'volunteermgmt',
    permissionKey: 'Volunteer Management',
  },
]

const EigApplications = [
  {
    route: '/eventcoordination',
    type: 'eventcoordination',
  },
]

const EigelApps = ({ app }) => {
  const navigate = useNavigate()
  const { permissions } = usePermissions()
  const hasPermission = permissions['Can View Eigel Tools']

  const handleClick = () => {
    if (hasPermission) {
      navigate(app.route)
    }
  }

  const renderAvatar = () => {
    switch (app.type) {
      case 'eventcoordination':
        return <TeamOutlined style={{ fontSize: '350%' }} />
    }
  }

  const renderCardContent = () => {
    switch (app.type) {
      case 'eventcoordination':
        return (
          <div className={styles.mappingClientContainer}>
            <Text className={styles.interactiveTitle}>Event Coordination</Text>
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
        return <GlobalOutlined style={{ fontSize: '350%' }} />
      case 'doorknocking':
        return <HomeOutlined style={{ fontSize: '350%' }} />
      case 'electionsim':
        return <NodeCollapseOutlined style={{ fontSize: '350%' }} />
      case 'votercontacts':
        return < DeploymentUnitOutlined style={{ fontSize: '350%' }} />
      case 'fundraising':
        return <DollarOutlined style={{ fontSize: '350%' }} />
      case 'volunteermgmt':
        return <TeamOutlined style={{ fontSize: '350%' }} />
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
            <Text className={styles.interactiveTitle}>Election Simulator *WIP*</Text>
          </div>
        )
      case 'votercontacts':
        return (
          <div className={styles.mappingClientContainer}>
            <Text className={styles.interactiveTitle}>Voter Contact Analysis *WIP*</Text>
          </div>
        )
      case 'fundraising':
        return (
          <div className={styles.mappingClientContainer}>
            <Text className={styles.interactiveTitle}>Fundraising Analytics *WIP*</Text>
          </div>
        )
      case 'volunteermgmt':
        return (
          <div className={styles.mappingClientContainer}>
            <Text className={styles.interactiveTitle}>Volunteer Management *WIP*</Text>
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

  const SectionSeparator = ({ title }) => {
    return (
      <div className={styles.sectionSeparator}>
        <Text className={styles.sectionTitle}>{title}</Text>
        <hr className={styles.sectionDivider} />
      </div>
    )
  }

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
              <SectionSeparator title="Eigel Campaign Tools" /> {/* Add this line */}
              <Row gutter={[16, 16]} className={styles.rowPadding}>
                {EigApplications.map((app, index) => (
                  <EigelApps key={index} app={app} />
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
