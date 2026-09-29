import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/risk-map', icon: '🗺️', label: 'Risk Map' },
  { path: '/imd-monitoring', icon: '🌧️', label: 'IMD Monitoring' },
  { path: '/sensor-monitoring', icon: '📡', label: 'Sensor Monitoring' },
  { path: '/ai-prediction', icon: '🤖', label: 'AI Risk Prediction' },
  { path: '/alerts', icon: '🚨', label: 'Alerts', badge: 6 },
  { path: '/analytics', icon: '📊', label: 'Analytics' },
  { path: '/historical-data', icon: '📜', label: 'Historical Data' },
  { path: '/citizen-reports', icon: '📋', label: 'Citizen Reports' },
];

const adminItems = [
  { path: '/admin-settings', icon: '👥', label: 'Admin Settings' },
  { path: '/system-status', icon: '⚙️', label: 'System Status' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/logo.jpg" alt="BhuRakshak AI" />
          <div className="sidebar-brand-text">
            <h3>BhuRakshak AI</h3>
            <span>AI for Safer Hills</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main Menu</div>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </NavLink>
          ))}

          <div className="sidebar-section-title">Administration</div>
          {adminItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">AG</div>
            <div className="sidebar-user-info">
              <h4>Admin User</h4>
              <span>Super Admin</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
