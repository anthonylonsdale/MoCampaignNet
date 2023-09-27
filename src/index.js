import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CampaignTools from './pages/CampaignTools.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<App />} />
        <Route exact path='/campaign-tools' element={<CampaignTools />} />
      </Routes>
    </BrowserRouter>,
)
