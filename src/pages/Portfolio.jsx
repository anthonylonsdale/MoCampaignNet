import { Divider, Layout, Space, Typography } from 'antd'
import React from 'react'

import './Homescreen.css'

import TypingEffect from '../components/TypingEffect.jsx'

const { Content } = Layout
const { Title, Paragraph } = Typography


function Portfolio() {
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
        </Space>
      </Content>
    </Layout>
  )
}

export default Portfolio
