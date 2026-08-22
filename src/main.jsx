import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
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
import InvitePage from './pages/InvitePage.jsx'
import OrganisationProfilePage from './pages/OrganisationProfilePage.jsx'
import OpportunityLandingPage from './pages/OpportunityLandingPage.jsx'
import VerifyCertificatePage from './pages/VerifyCertificatePage.jsx'
import './index.css'

// Old share links generated before this rename used /ngo/{token}. Redirect
// them to the new /organisation/{token} full-profile page rather than
// breaking already-shared links. NgoLandingPage.jsx (the old auto-app-redirect
// card) is no longer routed to, but intentionally left in the repo, not
// deleted, in case any behavior from it is still wanted later.
function LegacyNgoRedirect() {
  const { token } = useParams()
  return <Navigate to={`/organisation/${token}`} replace />
}

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
        <Route path="/invite/:token" element={<InvitePage />} />
        <Route path="/organisation/:token" element={<OrganisationProfilePage />} />
        <Route path="/ngo/:token" element={<LegacyNgoRedirect />} />
        <Route path="/opportunity/:token" element={<OpportunityLandingPage />} />
        <Route path="/verify/:token" element={<VerifyCertificatePage />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
