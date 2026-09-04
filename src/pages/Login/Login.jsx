import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Login.css'

const TEST_ACCOUNTS = [
  { email: 'admin@ner.gov.in', password: 'admin123', role: 'Authority / Field Responder', label: '🏛️ NDMA Authority' },
  { email: 'sdrf@assam.gov.in', password: 'sdrf2024', role: 'Authority / Field Responder', label: '🛡️ SDRF Officer' },
  { email: 'citizen@ner.in', password: 'guest123', role: 'Citizen / General Public', label: '👤 Citizen' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Authority / Field Responder')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 600))
    const result = login(email, password, role)
    if (result.success) {
      navigate(result.role?.includes('Authority') ? '/dashboard' : '/report')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const fillTestAccount = (acc) => {
    setEmail(acc.email)
    setPassword(acc.password)
    setRole(acc.role)
    setError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-1" />
      <div className="auth-glow auth-glow-2" />

      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-brand">
            <span className="auth-logo">🛡️</span>
            <div>
              <div className="auth-name">BhuRakshak <span className="text-accent">AI</span></div>
              <div className="auth-tagline">AI for Safer Hills</div>
            </div>
          </div>
          <h2 className="auth-left-title">Command Center Access</h2>
          <p className="auth-left-desc">
            Secure login for NDMA officers, SDRF personnel, district administrators,
            and field responders across the North Eastern Region.
          </p>

          <div className="test-accounts">
            <div className="test-accounts-label">🧪 Quick Test Accounts:</div>
            {TEST_ACCOUNTS.map((acc, i) => (
              <button
                key={i}
                className="test-account-btn"
                onClick={() => fillTestAccount(acc)}
                type="button"
              >
                <span>{acc.label}</span>
                <span className="test-email">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="auth-right">
          <div className="auth-form-card">
            <h3 className="form-title">Sign In</h3>
            <p className="form-subtitle">Enter your credentials to access the system.</p>

            {error && (
              <div className="auth-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email / Officer ID</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="admin@ner.gov.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="pwd-wrap">
                  <input
                    className="form-input"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="pwd-toggle"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Access Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="Authority / Field Responder">🏛️ Authority / Field Responder</option>
                  <option value="Citizen / General Public">👤 Citizen / General Public</option>
                </select>
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? '⏳ Authenticating...' : '🔐 Sign In'}
              </button>
            </form>

            <div className="divider" />

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent">Create an Account →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
