import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'

// Pages
import Landing from './pages/Landing/Landing.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import OTPVerification from './pages/OTPVerification/OTPVerification.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import GISMap from './pages/GISMap/GISMap.jsx'
import LocationDetails from './pages/LocationDetails/LocationDetails.jsx'
import AlertsManagement from './pages/AlertsManagement/AlertsManagement.jsx'
import CitizenReporting from './pages/CitizenReporting/CitizenReporting.jsx'
import AnalyticsDashboard from './pages/AnalyticsDashboard/AnalyticsDashboard.jsx'
import AdminSettings from './pages/AdminSettings/AdminSettings.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="page-main">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp-verify" element={<OTPVerification />} />
            <Route path="/report" element={<CitizenReporting />} />

            {/* All Public */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gis-map" element={<GISMap />} />
            <Route path="/location/:id" element={<LocationDetails />} />
            <Route path="/alerts" element={<AlertsManagement />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/admin" element={<AdminSettings />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
