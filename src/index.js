import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'

import CampaignTools from './pages/CampaignTools.jsx'

import Signup from './auth/Signup.jsx'
import Auth from './auth/auth.jsx'
import { AuthProvider } from './auth/authContext.jsx'
import Portfolio from './pages/Portfolio.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<Auth />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/portfolio' element={<Portfolio />} />
        <Route path='/campaign-tools' element={
          <AuthProvider>
            <CampaignTools />
          </AuthProvider>} />
      </Routes>
    </BrowserRouter>,
)
