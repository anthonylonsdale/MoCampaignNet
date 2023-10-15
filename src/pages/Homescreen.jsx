import {
  Button, Carousel, Divider,
  Layout, Space,
  Typography,
} from 'antd'
import React, { useRef } from 'react'
import TypingEffect from '../components/TypingEffect.jsx'
import logo2 from '../images/JCRPlogo.jpg'
import logo1 from '../images/JacksonCountyLogo.jpg'
import logo4 from '../images/KCFOPLogo.png'
import logo3 from '../images/NLStrongLogo.jpg'
import './Homescreen.css'

import billallen from '../images/bill_allen.jpg'
import clonsdale from '../images/chris_lonsdale_crowd_sign.jpg'
import debbieflorido from '../images/debbieflorido.jpg'
import jayjohnson from '../images/jay_johnson.jpg'
import jennbauer from '../images/jenn_bauer.jpg'
import josiahtown from '../images/josiah_town.jpg'
import lancepollard from '../images/lance_pollard.jpg'
import nathanwillett from '../images/nathan_willett_crowd.jpg'

const { Content } = Layout
const { Title } = Typography

function Homescreen() {
  const partnershipRef = useRef()

  return (
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
          <div className="carousel-container-2">
            <Title level={3}>
              Our Record of Success in America&apos;s Heartland
            </Title>
            <Carousel autoplay>
              <img className="carousel-image" src={clonsdale} alt="img1" />
              <img className="carousel-image" src={billallen} alt="img2" />
              <img className="carousel-image" src={jennbauer} alt="img3" />
              <img className="carousel-image" src={jayjohnson} alt="img4" />
              <img className="carousel-image" src={debbieflorido} alt="img5" />
              <img className="carousel-image" src={josiahtown} alt="img6" />
              <img className="carousel-image" src={lancepollard} alt="img7" />
              <img className="carousel-image" src={nathanwillett} alt="img8" />
            </Carousel>
          </div>
          <Divider />
          <div className="carousel-container">
            <Title level={3}>Our Valued Partnerships</Title>
            <Carousel autoplay ref={partnershipRef}>
              <img className="carousel-image" src={logo1} alt="img1" />
              <img className="carousel-image" src={logo2} alt="img2" />
              <img className="carousel-image" src={logo3} alt="img3" />
              <img className="carousel-image" src={logo4} alt="img4" />
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
