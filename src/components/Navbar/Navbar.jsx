import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Navbar.css'

export default function Navbar() {
  const { authenticated, userInfo, userRole, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const authLinks = [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/gis-map', label: '🗺️ GIS Map' },
    { to: '/alerts', label: '🚨 Alerts' },
    { to: '/analytics', label: '📈 Analytics' },
    { to: '/report', label: '📝 Report' },
    ...(userRole?.includes('Authority') ? [{ to: '/admin', label: '⚙️ Admin' }] : []),
  ]

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/report', label: '📝 Report Hazard' },
  ]

  const navLinks = authenticated ? authLinks : publicLinks

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <div className="brand-logo">🛡️</div>
          <div className="brand-text">
            <span className="brand-name">BhuRakshak <span className="brand-ai">AI</span></span>
            <span className="brand-tagline">AI for Safer Hills</span>
          </div>
        </Link>

        <div className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          {authenticated ? (
            <div className="user-profile">
              <div className="user-avatar">{userInfo?.name?.charAt(0).toUpperCase()}</div>
              <div className="user-meta">
                <span className="user-name">{userInfo?.name}</span>
                <span className={`user-role-badge ${userRole?.includes('Authority') ? 'role-authority' : 'role-citizen'}`}>
                  {userRole?.includes('Authority') ? '🏛️ Authority' : '👤 Citizen'}
                </span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign Out</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link key={link.to} to={link.to} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
        {authenticated ? (
          <button className="mobile-nav-link mobile-logout" onClick={handleLogout}>🚪 Sign Out</button>
        ) : (
          <>
            <Link to="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/register" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
