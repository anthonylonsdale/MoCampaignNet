/* eslint-disable react/no-unescaped-entities */
import { Button, Layout, Modal, Typography } from 'antd'
import React, { useState } from 'react'
import CustomHeader from '../components/CustomHeader.jsx'
import './Portfolio.css'

const { Title, Paragraph } = Typography

function Portfolio() {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <Layout className="campaign-layout">
      <CustomHeader onClick={showModal} />
      <Title>
        Portfolio
      </Title>
      <div className="portfolio-container">
        <div className="portfolio-item">
          <Title level={3}>Algorithmic Trader</Title>
          <p>Some brief description about the project.</p>
          <img src="path_to_algorithmic_trader_image1.jpg" />
          <img src="path_to_algorithmic_trader_image2.jpg" />
          <pre>
            <code className="keyword">function</code>
            <code className="function">algorithmTrader</code>() {'{'}
            <code className="comment">This is a comment</code>
            <code className="string">This is a string</code>;
            {'}'}
          </pre>
        </div>
        <div className="portfolio-item">
          <Title level={3}>Collection of Projects</Title>
          <Paragraph>
            <Title level={4}>Personal Website</Title>
            <Title level={4}>Homescreen</Title>
            <pre>
              <code className="keyword">import</code> {'{'}
              <code className="function">Button, Carousel, Divider,
              Layout, Space, Typography</code>
              {'}'} <code className="keyword">from </code>
              <code className="string">'antd'</code>
              <br/>
              <code className="keyword">import</code> <code className="keyword">React</code>, {'{'}
              <code className="function">useRef</code> {'}'} <code className="keyword">from</code> <code className="string">'react'</code>
              <br/>
              <code className="keyword">import</code> CustomHeader <code className="keyword">from</code> <code className="string">'../components/CustomHeader.jsx'</code>
              <br/>
              {/* Continue with the rest of the imports */}
              <br/>
              <code className="keyword">const</code> {'{'}
              <code className="function">Content</code>
              {'}'} = Layout
              <br/>
              <code className="keyword">const</code> {'{'}
              <code className="function">Title</code>
              {'}'} = Typography
              <br/>
              <code className="keyword">function</code> <code className="function">Homescreen</code>() {'{'}
              <br/>
              <code className="keyword">const</code> partnershipRef = <code className="function">useRef</code>()
              <br/>
              <code className="keyword">return</code> {'('}
              <br/>
              {'&lt;'}CustomHeader /{'&gt;'}
              <br/>
              {/* Continue with the rest of the Homescreen JSX */}
              <br/>
              {'&lt;'}Layout <code className="keyword">className</code>=<code className="string">"layout-min-height"</code>{'&gt;'}
              <br/>
                ...
              <br/>
              {'&lt;'}Title <code className="keyword">level</code>={'{'}2{'}'} <code className="keyword">style</code>={'{'}
              <code className="keyword">
                {'{'} marginBlockStart: '36px' {'}'}</code>{'&gt;'}
              <br/>
                Specializing in&nbsp;
              <br/>
              {'&lt;'}/Title{'&gt;'}
              <br/>
                ...
              <br/>
              {'&lt;'}/Layout{'&gt;'}
              <br/>
              {'&lt;'}AppFooter /{'&gt;'}
              <br/>
              {')'}
              <br/>
              {'}'}
            </pre>
          </Paragraph>
          <img src="path_to_collection_image1.jpg" alt="Collection Image 1" />
          <img src="path_to_collection_image2.jpg" alt="Collection Image 2" />
        </div>
      </div>

      <Modal
        title="Header Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {/* The CustomHeader code can be rendered here as a component or its preview */}
        {/* You can also add the code directly but since it's already a component, it's better to reuse */}
        <CustomHeader />
      </Modal>
    </Layout>
  )
}

export default Portfolio
