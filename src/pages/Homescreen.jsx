import { GlobalOutlined, LineChartOutlined, MailOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Layout,
  Row,
  Space,
  Typography,
} from 'antd'
import React, { useRef } from 'react'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import TypingEffect from '../components/TypingEffect.jsx'
import logo2 from '../images/JCRPlogo.jpg'
import logo1 from '../images/JacksonCountyLogo.jpg'
import logo4 from '../images/KCFOPLogo.png'
import logo3 from '../images/NLStrongLogo.jpg'
import sendgrid from '../images/SendgridDashboard.png'
import billallen from '../images/bill_allen.jpg'
import clonsdale from '../images/chris_lonsdale_crowd_sign.jpg'
import debbieflorido from '../images/debbieflorido.jpg'
import githubpages from '../images/ghub_pages.jpg'
import jayjohnson from '../images/jay_johnson.jpg'
import jennbauer from '../images/jenn_bauer.jpg'
import josiahtown from '../images/josiah_town.jpg'
import lancepollard from '../images/lance_pollard.jpg'
import nathanwillett from '../images/nathan_willett_crowd.jpg'
import reactspin from '../images/reactspin.gif'
import robocalls from '../images/robocalling.jpg'
import textmsgs from '../images/text_messages.jpg'
import walkbooks from '../images/walkbook_gen.JPG'
import './Homescreen.css'

const { Content } = Layout
const { Title } = Typography

function Homescreen() {
  const partnershipRef = useRef()

  return (
    <>
      <CustomHeader />
      <Layout className="layout-min-height">
        <Content className="content-style">
          <Space direction="vertical" className="space-direction">
            <div className="center-container">
              <div className="flex-container">
                <Title level={2} style={{ marginBlockStart: '36px' }}>
                  Specializing in&nbsp;
                </Title>
                <TypingEffect
                  phrases={[
                    'Innovative Political Strategies',
                    'Advanced Data Modeling and Analysis',
                    'Affordability and Reliability',
                    'Delivering Conservative Victories',
                  ]}
                  typingSpeed={50}
                  untypeSpeed={25}
                  pauseDuration={1500}
                />
              </div>
            </div>
            <Divider />
            <div className="center-container">
              <div className="carousel-container">
                <Title level={3}>
                Proven Record of Success in America&apos;s Heartland
                </Title>
                <Carousel autoplay>
                  <img className="carousel-image" src={clonsdale} />
                  <img className="carousel-image" src={billallen} />
                  <img className="carousel-image" src={jennbauer} />
                  <img className="carousel-image" src={jayjohnson} />
                  <img className="carousel-image" src={debbieflorido} />
                  <img className="carousel-image" src={josiahtown} />
                  <img className="carousel-image" src={lancepollard} />
                  <img className="carousel-image" src={nathanwillett} />
                </Carousel>
              </div>
            </div>
            <Divider />
            <div className="center-container">
              <Title level={3}>
                What We Offer
              </Title>
            </div>
            <div style={{ backgroundColor: 'grey' }}>
              <Row gutter={[16, 16]} className="offer-section">
                {/* Mass Email Campaigns */}
                <Col xs={24} md={12}>
                  <Card className="offer-card">
                    <MailOutlined className="icon-style" />
                    <Title level={3}>Mass Email Campaigns</Title>
                    <div className="custom-list">
                      <div className="custom-list-item">Custom-designed email templates tailored to campaign branding</div>
                      <div className="custom-list-item">Advanced segmentation for targeted outreach</div>
                      <div className="custom-list-item">Comprehensive analytics for campaign optimization</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12} className="image-container custom-height-1">
                  <div style={{ backgroundImage: `url(${sendgrid})` }} className="offer-image" alt="Mass Email Campaigns"></div>
                </Col>
              </Row>
              <Row gutter={[16, 16]} className="offer-section">
                {/* Mass Text Campaigns */}
                <Col xs={24} md={12} className="image-container custom-height-2">
                  <div style={{ backgroundImage: `url(${textmsgs})` }} className="offer-image" alt="Mass Email Campaigns"></div>
                </Col>
                <Col xs={24} md={12}>
                  <Card className="offer-card">
                    <MessageOutlined className="icon-style" />
                    <Title level={3}>Mass Text Campaigns</Title>
                    <div className="custom-list">
                      <div className="custom-list-item">Personalized SMS campaigns with high open rates</div>
                      <div className="custom-list-item">Image and video MMS capabilities for engaging content</div>
                      <div className="custom-list-item">Opt-in and compliance management</div>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]} className="offer-section">
                {/* Robocall Campaigns */}
                <Col xs={24} md={12}>
                  <Card className="offer-card">
                    <PhoneOutlined className="icon-style" />
                    <Title level={3}>Robocalling: Surveys, Polling and Advertising</Title>
                    <div className="custom-list">
                      <div className="custom-list-item">Interactive voice response for surveys and polls</div>
                      <div className="custom-list-item">Efficient message delivery with voicemail drop</div>
                      <div className="custom-list-item">Scalable solutions for large-scale outreach</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12} className="image-container custom-height-3">
                  <img className="offer-image" src={robocalls} alt="Robocall Campaigns" />
                </Col>
              </Row>
              <Row gutter={[16, 16]} className="offer-section">
                {/* Campaign Analytics */}
                <Col xs={24} md={12} className="image-container custom-height-4">
                  <img className="offer-image" src={walkbooks} alt="Campaign Analytics" />
                </Col>
                <Col xs={24} md={12}>
                  <Card className="offer-card">
                    <LineChartOutlined className="icon-style" />
                    <Title level={3}>Walkbook Building and Voter Analytics</Title>
                    <div className="custom-list">
                      <div className="custom-list-item">Custom walkbook creation for effective canvassing</div>
                      <div className="custom-list-item">Data-driven voter analytics for informed strategy decisions</div>
                      <div className="custom-list-item">Integration with existing campaign tools</div>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]} className="offer-section">
                {/* Websites */}
                <Col xs={24} md={12}>
                  <Card className="offer-card">
                    <GlobalOutlined className="icon-style" />
                    <Title level={3}>Website and Digital Presence Building</Title>
                    <div className="custom-list">
                      <div className="custom-list-item">Responsive web design for all devices</div>
                      <div className="custom-list-item">SEO optimization for increased visibility</div>
                      <div className="custom-list-item">Integrated fundraising and volunteer sign-up capabilities</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12} className="image-container custom-height-5">
                  <div className="image-row">
                    <img className="offer-image" src={githubpages} alt="Website and Digital Presence Building" />
                    <div className="plus-sign">+</div>
                    <img className="offer-image" src={reactspin} alt="Website and Digital Presence Building" />
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />
            <div className="center-container">
              <div className="carousel-container">
                <Title level={3}>Our Valued Partnerships</Title>
                <Carousel autoplay ref={partnershipRef}>
                  <img className="carousel-image" src={logo1} />
                  <img className="carousel-image" src={logo2} />
                  <img className="carousel-image" src={logo3} />
                  <img className="carousel-image" src={logo4} />
                </Carousel>
                <Button className="carousel-arrow carousel-arrow-left"
                  onClick={() => {
                    partnershipRef.current.prev()
                  }}>&lt;</Button>
                <Button className="carousel-arrow carousel-arrow-right"
                  onClick={() => {
                    partnershipRef.current.next()
                  }}>&gt;</Button>
              </div>
            </div>
          </Space>
        </Content>
      </Layout>
      <AppFooter />
    </>
  )
}

export default Homescreen
