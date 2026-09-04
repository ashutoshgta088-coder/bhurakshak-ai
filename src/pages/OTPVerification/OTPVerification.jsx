import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './OTPVerification.css'

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [status, setStatus] = useState('idle') // idle | success | error
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast, login } = useAuth()

  const email = location.state?.email || 'your@email.com'
  const password = location.state?.password || ''
  const role = location.state?.role || ''

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '')
    const newOtp = [...otp]
    paste.split('').forEach((ch, i) => { if (i < 6) newOtp[i] = ch })
    setOtp(newOtp)
    inputRefs.current[Math.min(paste.length, 5)]?.focus()
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) { setErrorMsg('Please enter all 6 digits.'); return }
    setLoading(true)
    setErrorMsg('')
    await new Promise(r => setTimeout(r, 1200))

    // Mock: 123456 or 000000 are valid OTPs for demo
    if (code === '123456' || code === '000000') {
      setStatus('success')
      // Complete login after showing success
      setTimeout(() => {
        const result = login(email, password, role)
        if (result.success) {
          navigate(result.role?.includes('Authority') ? '/dashboard' : '/report')
        } else {
          // fallback for registered users
          navigate('/dashboard')
        }
      }, 1800)
    } else {
      setStatus('error')
      setErrorMsg('Invalid OTP. Use 123456 or 000000 for demo.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
    setLoading(false)
  }

  const handleResend = () => {
    setTimer(60)
    setStatus('idle')
    setErrorMsg('')
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    addToast('OTP resent successfully!', 'info')
  }

  if (status === 'success') {
    return (
      <div className="otp-page">
        <div className="otp-card">
          <div className="success-animation">
            <div className="success-circle">
              <span className="success-check">✓</span>
            </div>
          </div>
          <h2 className="otp-title">Verified!</h2>
          <p className="otp-sub">Your account has been verified. Redirecting to dashboard...</p>
          <div className="otp-loader-bar">
            <div className="otp-loader-fill" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="otp-page">
      <div className="otp-glow otp-glow-1" />
      <div className="otp-glow otp-glow-2" />

      <div className="otp-card">
        {/* Header */}
        <div className="otp-icon-wrap">
          <span className="otp-icon">📱</span>
        </div>
        <h2 className="otp-title">OTP Verification</h2>
        <p className="otp-sub">
          Verify your account to access the<br />
          <strong>Landslide Monitoring Dashboard</strong>
        </p>
        <p className="otp-email-hint">
          A 6-digit code was sent to <span className="text-accent">{email}</span>
        </p>
        <p className="otp-demo-hint">🧪 Demo OTP: <code>123456</code></p>

        {/* OTP Inputs */}
        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`otp-digit ${status === 'error' ? 'otp-digit-error' : ''} ${digit ? 'otp-digit-filled' : ''}`}
            />
          ))}
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="otp-error">⚠️ {errorMsg}</div>
        )}

        {/* Verify Button */}
        <button
          className={`btn btn-primary otp-btn ${loading ? 'loading' : ''}`}
          onClick={handleVerify}
          disabled={loading || otp.join('').length < 6}
        >
          {loading ? '⏳ Verifying...' : '✅ Verify OTP'}
        </button>

        {/* Resend */}
        <div className="otp-resend">
          {timer > 0 ? (
            <span className="otp-countdown">
              Resend OTP in <span className="text-accent">{timer}s</span>
            </span>
          ) : (
            <button className="btn btn-ghost otp-resend-btn" onClick={handleResend}>
              🔄 Resend OTP
            </button>
          )}
        </div>

        {/* Timer ring */}
        {timer > 0 && (
          <div className="timer-ring-wrap">
            <svg className="timer-ring" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#1E293B" strokeWidth="4" />
              <circle
                cx="30" cy="30" r="26"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - timer / 60)}`}
                strokeLinecap="round"
                transform="rotate(-90 30 30)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
              <text x="30" y="35" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700">
                {timer}s
              </text>
            </svg>
          </div>
        )}

        <p className="otp-back">
          Wrong email? <a href="/register" className="text-accent">Go back →</a>
        </p>
      </div>
    </div>
  )
}
