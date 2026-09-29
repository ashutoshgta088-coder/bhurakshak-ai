import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const ROLES = [
  { value: 'Admin', label: 'Admin (State Disaster Management)' },
  { value: 'District Officer', label: 'District Officer (DDMA)' },
  { value: 'Field Officer', label: 'Field Officer (BRO / Ground Team)' },
  { value: 'Citizen', label: 'Citizen / Community Volunteer' }
];

const DEMO_ACCOUNTS = {
  Admin: { email: 'admin.sdma@bhurakshak.gov.in', pass: 'Admin#2026' },
  'District Officer': { email: 'kamrup.ddma@bhurakshak.gov.in', pass: 'Officer#2026' },
  'Field Officer': { email: 'field.unit@bhurakshak.gov.in', pass: 'Field#2026' },
  Citizen: { email: 'citizen.volunteer@gmail.com', pass: 'Citizen#2026' }
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'District Officer',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleDemoSelect = (roleKey) => {
    const demo = DEMO_ACCOUNTS[roleKey];
    setFormData({
      email: demo.email,
      password: demo.pass,
      role: roleKey,
      rememberMe: true
    });
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setErrorMessage('Please enter your official email address.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Save session info to localStorage for mock persistence
    localStorage.setItem(
      'bhurakshak_user',
      JSON.stringify({
        email: formData.email,
        role: formData.role,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      })
    );

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2400);
  };

  return (
    <div className="auth-container">
      {/* Left Branding Side - Desktop View */}
      <div className="auth-brand-side">
        <div className="brand-pattern-grid" />

        <div className="brand-top-bar">
          <div className="gov-badge">
            <span className="gov-badge-icon">🏛️</span>
            <span>Government of India • North Eastern Region</span>
          </div>

          <div className="brand-identity">
            <img src="/logo.jpg" alt="BhuRakshak AI" className="brand-logo-img" />
            <div className="brand-title-wrap">
              <h1>BhuRakshak AI</h1>
              <p className="brand-tagline">AI for Safer Hills & Landslide Early Warning</p>
            </div>
          </div>
        </div>

        <div className="brand-hero-content">
          <h2 className="brand-hero-headline">
            Intelligent Landslide Risk Monitoring & Multi-Agency Early Warning
          </h2>
          <p className="brand-hero-desc">
            Equipping district authorities, scientific bodies, and emergency response teams with
            real-time geological telemetry, predictive rainfall hazard mapping, and instant citizen alerts.
          </p>

          <div className="brand-highlights">
            <div className="highlight-card">
              <div className="highlight-icon-box">📡</div>
              <div className="highlight-text">
                <h4>IoT Sensor Telemetry</h4>
                <p>Real-time pore-pressure, tilt, and soil moisture analysis</p>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon-box">🤖</div>
              <div className="highlight-text">
                <h4>AI Hazard Forecasting</h4>
                <p>Machine learning models calibrated for 8 North Eastern states</p>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon-box">🚨</div>
              <div className="highlight-text">
                <h4>Automated Early Alerts</h4>
                <p>Direct integration with NDMA, SDMA, BRO, and community radio</p>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <div className="brand-footer-item">
            <span>🛡️</span>
            <span>256-Bit SSL Encrypted Official Portal</span>
          </div>
          <div className="brand-footer-item">
            <span>🌐</span>
            <span>v2.4 LTS</span>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="mobile-auth-header">
            <div className="mobile-logo-row">
              <img src="/logo.jpg" alt="BhuRakshak AI" className="mobile-logo-img" />
              <div className="mobile-brand-title">BhuRakshak AI</div>
            </div>
            <div className="mobile-tagline">AI-Based Early Warning & Landslide Risk Monitoring</div>
          </div>

          <div className="auth-card-header">
            <h2 className="auth-card-title">Portal Login</h2>
            <p className="auth-card-subtitle">
              Sign in with your designated credentials to access live risk dashboards.
            </p>
          </div>

          {/* Quick Demo Credentials Selector */}
          <div className="demo-accounts-pill-container">
            <div className="demo-pills-label">
              <span>⚡ Quick Demo Credentials</span>
              <span style={{ fontSize: '0.7rem', color: '#546e7a' }}>Click to autofill</span>
            </div>
            <div className="demo-pills-grid">
              {['District Officer', 'Admin', 'Field Officer', 'Citizen'].map((roleKey) => (
                <button
                  type="button"
                  key={roleKey}
                  className={`demo-pill-btn ${formData.role === roleKey ? 'active' : ''}`}
                  onClick={() => handleDemoSelect(roleKey)}
                  title={`Fill credentials for ${roleKey}`}
                >
                  {roleKey === 'District Officer' ? 'District' : roleKey === 'Field Officer' ? 'Field' : roleKey}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Selection Dropdown */}
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                <span>Select Your Role</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon-prefix">🛡️</span>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input-field input-with-icon select-field"
                  required
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span>Official / Registered Email</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon-prefix">✉️</span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. officer@bhurakshak.gov.in"
                  className="input-field input-with-icon"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span>Password</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon-prefix">🔒</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your security password"
                  className="input-field input-with-icon input-with-toggle"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options-row">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="remember-checkbox"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary submit-btn">
              <span>Sign In to Dashboard</span>
              <span className="btn-arrow-icon">➔</span>
            </button>
          </form>

          {/* Registration Navigation Link */}
          <div className="auth-switch-prompt">
            Don't have an official account?
            <Link to="/register" className="auth-switch-link">
              Register Here
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="forgot-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="forgot-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="forgot-modal-icon">🔑</div>
            <h3 className="forgot-modal-title">Reset Portal Password</h3>
            <p className="forgot-modal-desc">
              Enter your registered official email. A secure verification link will be dispatched
              via national NIC / SMS gateway.
            </p>

            {forgotSent ? (
              <div className="auth-alert auth-alert-success">
                <span>✓</span>
                <span>Reset link dispatched! Check your official inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter official email"
                    className="input-field"
                    required
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1, padding: '10px' }}
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
