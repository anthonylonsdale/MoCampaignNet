import { Col, Divider, Layout, List, Row, Typography } from 'antd'
import React from 'react'

import { Link } from 'react-router-dom'
import './Footer.css'; // Import the CSS file


const { Footer } = Layout
const { Title, Text } = Typography

const importantLinks = [
  { title: 'About Us', path: '/about' },
  { title: 'Services', path: '/services' },
]

function AppFooter() {
  return (
    <Footer className="footer">
      <Divider />
      <Row justify={'space-around'}>
        <Col>
          <div>
            <Title level={4}>Contact Us</Title>
            <Text>Email: alonsdale@bernoullitechnologies.net</Text><br />
            <Text>Phone: (816) 872-7762</Text><br />
            <Text>Address: 1320 Huntington Drive, Liberty MO 64068</Text>
          </div>
        </Col>
        <Col>
          <div className="important-links">
            <Title level={4}>Important Links</Title>
            <List
              size="small"
              bordered
              dataSource={importantLinks}
              renderItem={(item) => (
                <List.Item>
                  <Link to={item.path}>{item.title}</Link>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
      <Divider />
      <div className="copyright">
        <Text>&copy; {new Date().getFullYear()} Bernoulli Technologies.
        All rights reserved.</Text>
      </div>
    </Footer>
  )
}

export default AppFooter
