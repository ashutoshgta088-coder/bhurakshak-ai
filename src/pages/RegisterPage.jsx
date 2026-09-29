import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

// 8 North Eastern States with required exact district mappings
const DISTRICT_DATA = {
  Assam: ['Kamrup', 'Dibrugarh', 'Nagaon'],
  Meghalaya: ['East Khasi Hills', 'West Khasi Hills', 'Ri Bhoi'],
  Mizoram: ['Aizawl', 'Lunglei'],
  Manipur: ['Imphal East', 'Imphal West'],
  Nagaland: ['Kohima', 'Dimapur'],
  Tripura: ['West Tripura', 'South Tripura'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang'],
  Sikkim: ['East Sikkim', 'West Sikkim']
};

const NE_STATES = Object.keys(DISTRICT_DATA);

const ROLES = [
  { value: 'District Officer', label: 'District Officer (DDMA)' },
  { value: 'Field Officer', label: 'Field Officer (BRO / Ground Unit)' },
  { value: 'Citizen', label: 'Citizen / Community Volunteer' },
  { value: 'Admin', label: 'Admin (State Disaster Management)' }
];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    state: 'Assam',
    district: 'Kamrup',
    organization: '',
    role: 'District Officer',
    password: '',
    confirmPassword: '',
    termsAgreed: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle standard input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMessage) setErrorMessage('');
  };

  // Handle state change with dynamic district population
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const districtsForState = DISTRICT_DATA[selectedState] || [];
    setFormData(prev => ({
      ...prev,
      state: selectedState,
      district: districtsForState.length > 0 ? districtsForState[0] : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.organization.trim()) {
      setErrorMessage('Please enter your organization / department.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (!formData.termsAgreed) {
      setErrorMessage('Please agree to the official terms & data policy.');
      return;
    }

    // Store pending user registration data
    const pendingData = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      state: formData.state,
      district: formData.district,
      organization: formData.organization,
      role: formData.role
    };

    localStorage.setItem('bhurakshak_pending_user', JSON.stringify(pendingData));

    // Navigate to OTP verification page with router state
    navigate('/verify-otp', {
      state: {
        email: formData.email,
        mobile: formData.mobile,
        fullName: formData.fullName
      }
    });
  };

  const currentDistricts = DISTRICT_DATA[formData.state] || [];
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="register-container">
      {/* Left Branding Panel - Desktop View */}
      <div className="register-brand-side">
        <div className="register-pattern-grid" />

        <div className="register-brand-top">
          <div className="gov-badge">
            <span className="gov-badge-icon">🏛️</span>
            <span>NDMA &amp; SDMA Early Warning Network</span>
          </div>

          <div className="register-brand-identity">
            <img src="/logo.jpg" alt="BhuRakshak AI" className="register-logo-img" />
            <div>
              <h1 className="register-brand-title">BhuRakshak AI</h1>
              <p className="register-brand-tagline">AI-Based Landslide Risk Monitoring System</p>
            </div>
          </div>
        </div>

        <div className="register-brand-content">
          <h2>Official Portal Registration</h2>
          <p>
            Join India&apos;s unified AI-driven landslide hazard mitigation platform. Register to receive
            high-precision geotechnical alerts, rainfall thresholds, and regional evacuation alerts.
          </p>

          {/* 8 NE States Coverage Badges */}
          <div className="ne-states-coverage-card">
            <div className="coverage-title">
              <span>📍</span>
              <span>8 North Eastern States Network Coverage</span>
            </div>
            <div className="coverage-state-chips">
              {NE_STATES.map((st) => (
                <span key={st} className="state-chip">
                  {st}
                </span>
              ))}
            </div>
          </div>

          {/* Key Advantages */}
          <div className="register-features-list">
            <div className="reg-feature-item">
              <span className="reg-feature-icon">✓</span>
              <span>Automated IMD weather radar synchronisation every 15 minutes</span>
            </div>
            <div className="reg-feature-item">
              <span className="reg-feature-icon">✓</span>
              <span>Direct field telemetry from tiltmeters and pore-pressure piezometers</span>
            </div>
            <div className="reg-feature-item">
              <span className="reg-feature-icon">✓</span>
              <span>Instant multi-channel notifications (SMS, WhatsApp, sirens &amp; portal)</span>
            </div>
          </div>
        </div>

        <div className="register-brand-footer">
          <div>🛡️ Role-Based Access Control</div>
          <div>NIC Certified Gateway</div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="register-form-side">
        <div className="register-form-card">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="register-mobile-header">
            <div className="mobile-logo-row">
              <img src="/logo.jpg" alt="BhuRakshak AI" className="mobile-logo-img" />
              <div className="mobile-brand-title">BhuRakshak AI</div>
            </div>
            <div className="mobile-tagline">Official Landslide Early Warning Portal</div>
          </div>

          <div className="register-header">
            <h2>Create Official Account</h2>
            <p>Register as a monitoring officer, field operator, or community volunteer</p>
          </div>

          {errorMessage && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                <span>Full Name</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon-prefix">👤</span>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Dr. Rajesh Baruah"
                  className="input-field input-with-icon"
                  required
                />
              </div>
            </div>

            {/* Email & Mobile Number 2-Column */}
            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">
                  <span>Official Email</span>
                  <span className="form-label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-prefix">✉️</span>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="officer@sdma.gov.in"
                    className="input-field input-with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="mobile" className="form-label">
                  <span>Mobile Number</span>
                  <span className="form-label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-prefix">📱</span>
                  <input
                    id="mobile"
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className="input-field input-with-icon"
                    required
                  />
                </div>
              </div>
            </div>

            {/* State & District Dropdown 2-Column */}
            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  <span>State (North East)</span>
                  <span className="form-label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-prefix">🗺️</span>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className="input-field input-with-icon select-field"
                    required
                  >
                    {NE_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="district" className="form-label">
                  <span>District</span>
                  <span className="form-label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-prefix">📍</span>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="input-field input-with-icon select-field"
                    required
                  >
                    {currentDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Organization & Role 2-Column */}
            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="organization" className="form-label">
                  <span>Organization / Dept</span>
                  <span className="form-label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-prefix">🏢</span>
                  <input
                    id="organization"
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    placeholder="e.g. DDMA Kamrup / BRO"
                    className="input-field input-with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-role" className="form-label">
                  <span>Role</span>
                  <span className="form-label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-prefix">🛡️</span>
                  <select
                    id="reg-role"
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
            </div>

            {/* Password & Confirm Password 2-Column */}
            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">
                  <span>Create Password</span>
                  <span className="form-label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-prefix">🔒</span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    className="input-field input-with-icon input-with-toggle"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span>Confirm Password</span>
                  <span className="form-label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-prefix">🔐</span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repeat password"
                    className="input-field input-with-icon input-with-toggle"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '👁️' : '🙈'}
                  </button>
                </div>
                {passwordsMatch && (
                  <span className="password-match-hint hint-success">
                    ✓ Passwords match
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="password-match-hint hint-error">
                    ✕ Passwords do not match
                  </span>
                )}
              </div>
            </div>

            {/* Terms and Policy */}
            <div className="terms-agreement-row">
              <label className="terms-label">
                <input
                  type="checkbox"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleInputChange}
                  className="terms-checkbox"
                />
                <span>
                  I confirm that all provided information is accurate and agree to abide by the
                  Geological Disaster Early Warning Protocol &amp; Data Security Guidelines.
                </span>
              </label>
            </div>

            {/* Submit / Proceed to OTP button */}
            <button type="submit" className="btn-primary submit-btn">
              <span>Continue to Verification (OTP)</span>
              <span className="btn-arrow-icon">➔</span>
            </button>
          </form>

          {/* Login switch prompt */}
          <div className="auth-switch-prompt">
            Already have an official account?
            <Link to="/login" className="auth-switch-link">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
