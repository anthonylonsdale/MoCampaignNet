import React from 'react'

import './App.css'

import CustomHeader from './components/CustomHeader.jsx'
import AppFooter from './components/Footer.jsx'
import Homescreen from './pages/Homescreen.jsx'

function App() {
  return (
    <>
      <CustomHeader />
      <Homescreen />
      <AppFooter />
    </>
  )
}

export default App
