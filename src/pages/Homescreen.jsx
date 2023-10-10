import './Homescreen.css'

import {
  Button, Carousel, Divider, Image, Layout, Space,
  Typography,
} from 'antd'
import React, { useRef } from 'react'
import TypingEffect from '../components/TypingEffect.jsx'

import logo2 from '../images/JCRPlogo.jpg'
import logo1 from '../images/JacksonCountyLogo.jpg'
import logo4 from '../images/KCFOPLogo.png'
import logo3 from '../images/NLStrongLogo.jpg'

const { Content } = Layout
const { Title, Paragraph } = Typography

function Homescreen() {
  const partnershipRef = useRef()

  return (
    <Layout className="layout-min-height">
      <Content className="content-style">
        <Space direction="vertical" className="space-direction">
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

          <Divider />
          <Paragraph>
              Welcome to our political campaign platform. Here, you can find
              valuable information, updates, and resources for your campaign.
          </Paragraph>
          <Divider />
          <Space size="large">
            <div>
              <Title level={3}>Campaign Images</Title>
              <img
                src="your-image-url.jpg"
                alt="Campaign Image"
                style={{ maxWidth: '100%' }}
              />
            </div>
            <div>
              <Title level={3}>Campaign Updates</Title>
              <Paragraph>
                  Stay tuned for the latest campaign updates and news.
              </Paragraph>
            </div>
          </Space>
          <Divider />
          <div className="carousel-container">
            <Title level={3}>Our Valued Partnerships</Title>
            <Carousel dots={false} autoplay ref={partnershipRef}>
              <div>
                <Image
                  src={logo1}
                  alt="Logo"
                  className="header-logo"
                  preview={false}
                />
              </div>
              <div>
                <Image
                  src={logo2}
                  alt="Logo"
                  className="header-logo"
                  preview={false}
                />
              </div>
              <div>
                <Image
                  src={logo3}
                  alt="Logo"
                  className="header-logo"
                  preview={false}
                />
              </div>
              <div>
                <Image
                  src={logo4}
                  alt="Logo"
                  className="header-logo"
                  preview={false}
                />
              </div>
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
        </Space>
      </Content>
    </Layout>)
}

export default Homescreen
