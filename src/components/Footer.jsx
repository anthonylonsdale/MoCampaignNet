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
      <Row gutter={[16, 16]} justify="space-around">
        <Col xs={24} sm={12} md={8} lg={6}>
          <div className="contact-info">
            <Title level={4} className="title">Contact Us</Title>
            <address>
              <Text>Email: alonsdale@bernoullitechnologies.net</Text><br />
              <Text>Phone: (816) 872-7762</Text><br />
            </address>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div className="important-links">
            <Title level={4} className="title">Important Links</Title>
            <List
              size="small"
              bordered
              dataSource={importantLinks}
              renderItem={(item) => (
                <List.Item>
                  <Link to={item.path} className="link">{item.title}</Link>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
      <Divider />
      <div className="copyright">
        <Text>&copy; {new Date().getFullYear()} Bernoulli
        Technologies. All rights reserved.</Text>
      </div>
    </Footer>
  )
}

export default AppFooter
