import './App.css'

import {Breadcrumb, Collapse, Layout, Menu} from 'antd'
import {LaptopOutlined, NotificationOutlined,
  UserOutlined} from '@ant-design/icons'

import React from 'react'

const {SubMenu} = Menu
const {Header, Content, Sider} = Layout
const {Panel} = Collapse

function App() {
  return (
    <Layout style={{minHeight: '100vh'}}>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">Portfolio</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Collapse defaultActiveKey={['menu']} >
            <Panel key="menu" header="Menu">
              <Menu
                mode="vertical">
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                  <Menu.Item key="1">Tom</Menu.Item>
                  <Menu.Item key="2">Bill</Menu.Item>
                  <Menu.Item key="3">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<LaptopOutlined />} title="Device">
                  <Menu.Item key="4">Desktop</Menu.Item>
                  <Menu.Item key="5">Tablet</Menu.Item>
                  <Menu.Item key="6">Mobile</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" icon={<NotificationOutlined />}
                  title="Notification">
                  <Menu.Item key="7">Email</Menu.Item>
                  <Menu.Item key="8">Message</Menu.Item>
                  <Menu.Item key="9">App</Menu.Item>
                </SubMenu>
              </Menu>
            </Panel>
          </Collapse>
        </Sider>
        <Layout style={{padding: '0 24px 24px'}}>
          <Breadcrumb style={{margin: '16px 0'}}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App
