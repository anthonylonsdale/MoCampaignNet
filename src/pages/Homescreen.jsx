import { GlobalOutlined, LeftOutlined, LineChartOutlined, MailOutlined, MessageOutlined, PhoneOutlined, RightOutlined } from '@ant-design/icons'
import {
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
import HtmlDisplay from '../components/HtmlDisplay.jsx'
import DotToLineTextAnimation from '../components/styles/DotToLineTextAnimation.jsx'
import TypingEffect from '../components/styles/TypingEffect.jsx'
import logo2 from '../images/JCRPlogo.jpg'
import logo1 from '../images/JacksonCountyLogo.jpg'
import logo4 from '../images/KCFOPLogo.png'
import logo3 from '../images/NLStrongLogo.jpg'
import sendgrid from '../images/SendgridDashboard.png'
import voiceinsights from '../images/VoiceInsights.png'
import billallen from '../images/billallen.jpg'
import clonsdale from '../images/chrislonsdale.jpg'
import debbieflorido from '../images/debbieflorido.jpg'
import githubpages from '../images/ghub_pages.jpg'
import jayjohnson from '../images/jayjohnson.jpg'
import jennbauer from '../images/jenn_bauer.jpg'
import josiahtown from '../images/josiah_town.jpg'
import lancepollard from '../images/lance_pollard.jpg'
import nathanwillett from '../images/nathanwillett.jpg'
import reactspin from '../images/reactspin.gif'
import robocalls from '../images/robocalling.jpg'
import textmsgs from '../images/text_messages.jpg'
import walkbooks from '../images/walkbook_gen.JPG'
import './Homescreen.css'

const { Content } = Layout
const { Title } = Typography

function Homescreen() {
  const partnershipRef = useRef()

  const goToPrev2 = () => {
    partnershipRef.current.prev()
  }

  const goToNext2 = () => {
    partnershipRef.current.next()
  }

  return (
    <>
      <CustomHeader />
      <Layout className="layout-min-height">
        <Content>
          <Space direction="vertical" className="space-direction">
            <div className="record-container">
              <DotToLineTextAnimation text={'Proven Record of Success in Americas Heartland'}/>
            </div>
            <Divider />
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
            <div className="layout-container">

              <HtmlDisplay fileName={'city_council_districts_map'} />

              <div className="carousel-container">
                <Carousel autoplay>
                  <div className="carousel-item">
                    <img className="carousel-image" src={clonsdale} />
                    <div className="overlay">
                      <div className="text">Chris Lonsdale (MO R-38)</div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img className="carousel-image" src={billallen} />
                    <div className="overlay">
                      <div className="text">Bill Allen (MO R-17)</div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img className="carousel-image" src={jennbauer} />
                    <div className="overlay">
                      <div className="text">Jenn Bauer (Liberty Public Schools SB)</div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img className="carousel-image" src={jayjohnson} />
                    <div className="overlay">
                      <div className="text">Jay Johnson (Clay Co Eastern Commissioner)</div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img className="carousel-image" src={debbieflorido} />
                    <div className="overlay">
                      <div className="text">Debbie Florido (Clay Co Health Board)</div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img className="carousel-image" src={josiahtown} />
                    <div className="overlay">
                      <div className="text">Josiah Town (Henry Co Health Board)</div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img className="carousel-image" src={lancepollard} />
                    <div className="overlay">
                      <div className="text">Lance Pollard (Grain Valley School Board)</div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img className="carousel-image" src={nathanwillett} />
                    <div className="overlay">
                      <div className="text">KC Councilman Nathan Willett</div>
                    </div>
                  </div>
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
                      <div className="custom-list-item">Advanced audience segmentation for targeted outreach</div>
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
                      <div className="custom-list-item">Personalized political messaging campaigns with high deliverability rates</div>
                      <div className="custom-list-item">Image / Video MMS capabilities for engaging and impactful content</div>
                      <div className="custom-list-item">Opt-in and compliance management guaranteed</div>
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
                  <div className="image-row">
                    <img className="offer-image-2" src={robocalls} alt="Robocall Campaigns" />
                    <img className="offer-image-2" src={voiceinsights} alt="Robocall Insights" />
                  </div>
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
                      <div className="custom-list-item">Customized and deliberate walkbook creation for effective canvassing</div>
                      <div className="custom-list-item">Data-driven voter analytics for informed campaign decisions</div>
                      <div className="custom-list-item">Reliable voter data with modelled behavior analytics, party affiliation and voting records with 85%+ confidence</div>
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
                      <div className="custom-list-item">Search Engine Optimization for increased visibility</div>
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
            <div className="carousel-container">
              <Title level={3}>Our Valued Partnerships</Title>
              <Carousel autoplay ref={partnershipRef}>
                <img className="carousel-image" src={logo1} />
                <img className="carousel-image" src={logo2} />
                <img className="carousel-image" src={logo3} />
                <img className="carousel-image" src={logo4} />
              </Carousel>
              <div className="custom-prev-arrow custom-arrow" onClick={goToPrev2}>
                <LeftOutlined />
              </div>
              <div className="custom-next-arrow custom-arrow" onClick={goToNext2}>
                <RightOutlined />
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
