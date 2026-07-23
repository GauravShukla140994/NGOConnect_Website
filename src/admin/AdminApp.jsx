import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import LoginPage from './pages/LoginPage'
import OverviewPage from './pages/OverviewPage'
import OrganisationsPage from './pages/OrganisationsPage'
import MembersPage from './pages/MembersPage'
import SettingsPage from './pages/SettingsPage'
import LookupManagementPage from './pages/LookupManagementPage'
import CommunicationDashboardPage from './pages/communication/CommunicationDashboardPage'
import CampaignsPage from './pages/communication/CampaignsPage'
import CampaignWizardPage from './pages/communication/CampaignWizardPage'
import './admin.css'

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="orgs" element={<OrganisationsPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="communication" element={<Navigate to="/admin/communication/dashboard" replace />} />
            <Route path="communication/dashboard" element={<CommunicationDashboardPage />} />
            <Route path="communication/campaigns" element={<CampaignsPage />} />
            <Route path="communication/campaigns/:campaignId" element={<CampaignWizardPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="lookup" element={<LookupManagementPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Routes>
    </AdminAuthProvider>
  )
}
