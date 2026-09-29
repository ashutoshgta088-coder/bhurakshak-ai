import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import RiskMap from './pages/RiskMap';
import IMDMonitoring from './pages/IMDMonitoring';
import SensorMonitoring from './pages/SensorMonitoring';
import AIRiskPrediction from './pages/AIRiskPrediction';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import HistoricalData from './pages/HistoricalData';
import CitizenReports from './pages/CitizenReports';
import AdminSettings from './pages/AdminSettings';
import SystemStatus from './pages/SystemStatus';
import LocationDetails from './pages/LocationDetails';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OTPVerification />} />

        {/* Dashboard pages with sidebar layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/risk-map" element={<RiskMap />} />
          <Route path="/imd-monitoring" element={<IMDMonitoring />} />
          <Route path="/sensor-monitoring" element={<SensorMonitoring />} />
          <Route path="/ai-prediction" element={<AIRiskPrediction />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/historical-data" element={<HistoricalData />} />
          <Route path="/citizen-reports" element={<CitizenReports />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/system-status" element={<SystemStatus />} />
          <Route path="/location-details/:id" element={<LocationDetails />} />
          <Route path="/location-details" element={<LocationDetails />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
