import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import PrivacyPolicy from './pages/legal/PrivacyPolicy.jsx'
import TermsOfService from './pages/legal/TermsOfService.jsx'
import SecurityPolicy from './pages/legal/SecurityPolicy.jsx'
import CookiePolicy from './pages/legal/CookiePolicy.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/security" element={<SecurityPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
