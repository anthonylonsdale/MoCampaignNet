// index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import ProtectedRoute from './auth/protectedRoute.jsx'; // Import ProtectedRoute
import './index.css'
import CampaignTools from './pages/CampaignTools.jsx'

import Signup from './auth/Signup.jsx'
import Auth from './auth/auth.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<App />} />
        <Route exact path='/login' element={<Auth />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route path='/campaign-tools' element={
          <ProtectedRoute>
            <CampaignTools />
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>,
)
