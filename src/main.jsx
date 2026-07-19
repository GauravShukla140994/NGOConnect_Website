import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import PrivacyPolicy from './pages/legal/PrivacyPolicy.jsx'
import TermsOfService from './pages/legal/TermsOfService.jsx'
import SecurityPolicy from './pages/legal/SecurityPolicy.jsx'
import CookiePolicy from './pages/legal/CookiePolicy.jsx'
import About from './pages/company/About.jsx'
import Careers from './pages/company/Careers.jsx'
import Press from './pages/company/Press.jsx'
import Contact from './pages/company/Contact.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/security" element={<SecurityPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
