import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Image, Layout, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logoblank.png'
import './CustomHeader.css'

const { Header } = Layout

function CustomHeader() {
  const [visible, setVisible] = useState(true)
  let lastScrollTop = 0

  const handleScroll = () => {
    const currentScrollPos = window.scrollY
    if (currentScrollPos > lastScrollTop && currentScrollPos > 0) {
      setVisible(false)
    }
    lastScrollTop = currentScrollPos <= 0 ? 0 : currentScrollPos
  }

  const debounce = (func, wait = 50) => {
    let timeout
    return function(...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll)
    window.addEventListener('scroll', debouncedHandleScroll)

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll)
    }
  }, [])

  return (
    <Header className={`site-layout-background ${!visible && 'header-hidden'}`}>
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
