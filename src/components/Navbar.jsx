import { useLocation } from 'react-router-dom';
import './Navbar.css';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/risk-map': 'Risk Map',
  '/imd-monitoring': 'IMD Monitoring',
  '/sensor-monitoring': 'Sensor Monitoring',
  '/ai-prediction': 'AI Risk Prediction',
  '/alerts': 'Alerts Management',
  '/analytics': 'Analytics',
  '/historical-data': 'Historical Data',
  '/citizen-reports': 'Citizen Reports',
  '/admin-settings': 'Admin Settings',
  '/system-status': 'System Status',
  '/location-details': 'Location Details',
};

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={onToggleSidebar}>
          ☰
        </button>
        <div className="navbar-breadcrumb">
          <span>🏠</span>
          <span>/</span>
          <span className="current">{currentPage}</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-status">
          <span className="navbar-status-dot"></span>
          System Online
        </div>
        <div className="navbar-search">
          <span className="navbar-search-icon">🔍</span>
          <input type="text" placeholder="Search locations, alerts..." />
        </div>
        <div className="navbar-actions">
          <button className="navbar-action-btn" title="Notifications">
            🔔
            <span className="notification-dot"></span>
          </button>
          <button className="navbar-action-btn" title="Settings">
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
