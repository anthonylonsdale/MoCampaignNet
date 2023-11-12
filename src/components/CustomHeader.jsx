import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Image, Layout, Menu } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logoblank.png'
import './CustomHeader.css'

const { Header } = Layout

function CustomHeader() {
  return (
    <Header className="site-layout-background">
      <Link to="/" className="logo-link">
        <Image src={logo} alt="Logo" className="header-logo" preview={false} />
      </Link>
      <div className='header-title'>Bernoulli Technologies</div>
      <div className="header-right">
        <Menu theme="dark" mode="horizontal" className="disable-select custom-menu">
          <Menu.Item key="1" className="custom-menu-item" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" className="custom-menu-item" icon={<UserOutlined />}>
            <Link to="/portfolio">Portfolio</Link>
          </Menu.Item>
          <Menu.Item key="3" className="custom-menu-item" icon={<SettingOutlined />}>
            <Link to="/campaign-tools">Campaign Tools</Link>
          </Menu.Item>
        </Menu>
      </div>
    </Header>
  )
}

export default CustomHeader
