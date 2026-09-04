import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Register.css'

const ORGANIZATIONS = [
  'NDMA', 'SDRF', 'CWC', 'IMD', 'GSI',
  'District Administration', 'State Disaster Management Authority',
  'Police / Paramilitary', 'NGO / Relief Organization', 'Citizen',
]

const NER_STATES = [
  'Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Sikkim', 'Tripura',
]

const DISTRICTS = {
  'Assam': ['Kamrup', 'Barpeta', 'Nagaon', 'Dibrugarh', 'Jorhat'],
  'Meghalaya': ['East Khasi Hills', 'West Khasi Hills', 'Ri Bhoi', 'Jaintia Hills'],
  'Mizoram': ['Aizawl', 'Champhai', 'Lunglei', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
  'Manipur': ['Imphal East', 'Imphal West', 'Churachandpur', 'Bishnupur'],
  'Sikkim': ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim'],
  'Tripura': ['West Tripura', 'North Tripura', 'South Tripura', 'Gomati'],
  'Arunachal Pradesh': ['West Kameng', 'East Kameng', 'Lower Subansiri', 'Siang'],
}

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', organization: 'Citizen',
    state: '', district: '', role: 'Citizen / General Public',
    password: '', confirmPassword: '',
  })
  const [idCard, setIdCard] = useState(null)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    if (!form.email.includes('@')) errs.email = 'Valid email is required.'
    if (!form.mobile || form.mobile.length < 10) errs.mobile = 'Valid mobile number required.'
    if (!form.state) errs.state = 'State is required.'
    if (!form.password || form.password.length < 6) errs.password = 'Password must be ≥6 chars.'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    if (!agreed) errs.agreed = 'You must accept the Terms & Conditions.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    // Redirect to OTP page, passing email & role
    navigate('/otp-verify', { state: { email: form.email, password: form.password, role: form.role } })
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-1" />
      <div className="auth-glow auth-glow-2" />

      <div className="auth-container auth-container-wide" style={{ maxWidth: 1000 }}>
        {/* Left */}
        <div className="auth-left">
          <div className="auth-brand">
            <span className="auth-logo">🛡️</span>
            <div>
              <div className="auth-name">BhuRakshak <span className="text-accent">AI</span></div>
              <div className="auth-tagline">AI for Safer Hills</div>
            </div>
          </div>
          <h2 className="auth-left-title">Join the NER Disaster Response Network</h2>
          <p className="auth-left-desc">
            Register to access real-time landslide monitoring, GIS risk maps,
            and automated alerts across all 8 North Eastern states.
          </p>
          <div className="reg-features">
            {['🗺️ Live GIS Risk Mapping', '🚨 Real-Time Alerts', '📊 Analytics Dashboard', '📝 Hazard Reporting', '🤖 AI Risk Predictions'].map(f => (
              <div key={f} className="reg-feature-item">{f}</div>
            ))}
          </div>
          <div className="sih-badge">
            <span>🏆</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Smart India Hackathon 2024</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ministry of Earth Sciences | NDMA</div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="auth-right">
          <div className="auth-form-card">
            <h3 className="form-title">Create Account</h3>
            <p className="form-subtitle">Fill all fields to register your access.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className={`form-input ${errors.name ? 'input-error' : ''}`} placeholder="Rajiv Sharma" value={form.name} onChange={update('name')} />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className={`form-input ${errors.email ? 'input-error' : ''}`} type="email" placeholder="officer@ndma.gov.in" value={form.email} onChange={update('email')} />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input className={`form-input ${errors.mobile ? 'input-error' : ''}`} type="tel" placeholder="+91 98765 43210" value={form.mobile} onChange={update('mobile')} />
                  {errors.mobile && <span className="field-error">{errors.mobile}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Organization / Department</label>
                  <select className="form-select" value={form.organization} onChange={update('organization')}>
                    {ORGANIZATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select className={`form-select ${errors.state ? 'input-error' : ''}`} value={form.state} onChange={update('state')}>
                    <option value="">Select State</option>
                    {NER_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="field-error">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <select className="form-select" value={form.district} onChange={update('district')} disabled={!form.state}>
                    <option value="">Select District</option>
                    {(DISTRICTS[form.state] || []).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Access Role *</label>
                <div className="role-grid">
                  {[
                    { val: 'Authority / Field Responder', icon: '🏛️', label: 'Authority' },
                    { val: 'Administrator', icon: '⚙️', label: 'Administrator' },
                    { val: 'Field Team', icon: '🪖', label: 'Field Team' },
                    { val: 'Citizen / General Public', icon: '👤', label: 'Citizen' },
                  ].map(r => (
                    <label key={r.val} className={`role-chip ${form.role === r.val ? 'role-chip-active' : ''}`}>
                      <input type="radio" name="role" value={r.val} checked={form.role === r.val} onChange={update('role')} style={{ display: 'none' }} />
                      <span>{r.icon}</span>
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className={`form-input ${errors.password ? 'input-error' : ''}`} type="password" placeholder="Min 6 characters" value={form.password} onChange={update('password')} />
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`} type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={update('confirmPassword')} />
                  {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* ID Card Upload */}
              <div className="form-group">
                <label className="form-label">Upload Identity Card <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                <label className="id-upload-label">
                  <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => setIdCard(e.target.files[0])} />
                  <span className="id-upload-icon">📎</span>
                  <span>{idCard ? idCard.name : 'Click to upload ID card (JPG / PNG / PDF)'}</span>
                </label>
              </div>

              {/* Terms */}
              <label className={`terms-label ${errors.agreed ? 'terms-error' : ''}`}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <span>I agree to the <a href="#" className="text-accent">Terms of Service</a> and <a href="#" className="text-accent">Privacy Policy</a> of BhuRakshak AI</span>
              </label>
              {errors.agreed && <span className="field-error">{errors.agreed}</span>}

              <button type="submit" className={`btn btn-primary btn-full ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? '⏳ Creating Account...' : '✅ Register & Send OTP'}
              </button>
            </form>

            <div className="divider" />
            <p className="auth-switch">
              Already have an account? <Link to="/login" className="text-accent">Sign In →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
