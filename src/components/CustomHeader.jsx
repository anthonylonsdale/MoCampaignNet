import { Image, Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logoblank.png'
import HamburgerMenu from './HamburgerMenu.jsx'
import './CustomHeader.css'

const { Header } = Layout

function CustomHeader() {
  const [visible, setVisible] = useState(true)
  let lastScrollTop = 0

  const handleScroll = () => {
    const currentScrollPos = window.scrollY
    if (currentScrollPos > lastScrollTop && currentScrollPos > 0) {
      setVisible(false)
    } else {
      setVisible(true)
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
        <div className="header-title">
          <span>Bernoulli&nbsp;</span>
          <span>Technologies</span>
        </div>
      </Link>
      <div className="header-right">
        <HamburgerMenu />
      </div>
    </Header>
  )
}

export default CustomHeader
