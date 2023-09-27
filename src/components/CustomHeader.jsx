import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Image, Layout, Menu, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'

const { Header } = Layout
const { Text } = Typography

function CustomHeader() {
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/">
          <Image
            src={logo}
            alt="Logo"
            style={{ maxWidth: '64px', height: 'auto', cursor: 'pointer' }}
            preview={false}
          />
        </Link>
        <Text style={{ marginLeft: '5rem' }}>Bernoulli Technologies</Text>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          className="disable-select custom-menu"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flex: 1,
            maxWidth: '30rem',
          }}
        >
          <Menu.Item key="1" className="custom-menu-item"
            icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" className="custom-menu-item"
            icon={<UserOutlined />}>
            <Link to="/portfolio">Portfolio</Link>
          </Menu.Item>
          <Menu.Item key="3" className="custom-menu-item"
            icon={<SettingOutlined />}>
            <Link to="/campaign-tools">Campaign Tools</Link>
          </Menu.Item>
        </Menu>
      </div>
    </Header>
  )
}

export default CustomHeader
