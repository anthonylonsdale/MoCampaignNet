import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const ReactCodeDisplay = () => {
  const codeString = `import {
  Button, Carousel, Divider,
  Layout, Space,
  Typography,
} from 'antd'
import React, { useRef } from 'react'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import TypingEffect from '../components/TypingEffect.jsx'

...

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
                  ...
                </Carousel>
              </div>
            </div>
            <Divider />
            <div className="center-container">
              <div className="carousel-container">
                <Title level={3}>Our Valued Partnerships</Title>
                <Carousel autoplay ref={partnershipRef}>
                  <img className="carousel-image" src={logo1} />
                  ...
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

export default Homescreen`

  return (
    <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
      {codeString}
    </SyntaxHighlighter>
  )
}

export default ReactCodeDisplay
