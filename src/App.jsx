import React from 'react'

import './App.css'

import CustomHeader from './components/CustomHeader.jsx'
import Sidebar from './components/SideBar.jsx'
import CampaignTools from './pages/CampaignTools.jsx'
import Homescreen from './pages/Homescreen.jsx'

function App() {
  return (
    <>
      <CustomHeader />
      <Homescreen />
      <CampaignTools />
      <Sidebar />
    </>
  )
}

export default App
