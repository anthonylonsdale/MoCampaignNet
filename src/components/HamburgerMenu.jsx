import { HomeOutlined, MailOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './HamburgerMenu.css'

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <div className="hamburger-menu-container">
      <button
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <div className={`menu-dropdown ${isOpen ? 'open' : ''}`}>
        <Link to="/" className="menu-item" onClick={closeMenu}>
          <HomeOutlined className="menu-icon" />
          <span>Home</span>
        </Link>
        <Link to="/contact" className="menu-item" onClick={closeMenu}>
          <MailOutlined className="menu-icon" />
          <span>Contact</span>
        </Link>
      </div>

      {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </div>
  )
}

export default HamburgerMenu
