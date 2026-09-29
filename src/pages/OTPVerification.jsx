import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './OTPVerification.css';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email and phone from route state or pending registration in localStorage
  const pendingData = (() => {
    try {
      const stored = localStorage.getItem('bhurakshak_pending_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const rawEmail = location.state?.email || pendingData?.email || 'officer@bhurakshak.gov.in';
  const rawMobile = location.state?.mobile || pendingData?.mobile || '9876543210';

  // Function to mask email safely (e.g. j****n@gov.in)
  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return 'o******r@gov.in';
    const [user, domain] = email.split('@');
    if (user.length <= 2) {
      return `${user[0]}*@${domain}`;
    }
    const firstChar = user[0];
    const lastChar = user[user.length - 1];
    const masked = `${firstChar}${'*'.repeat(Math.max(4, user.length - 2))}${lastChar}`;
    return `${masked}@${domain}`;
  };

  const maskPhone = (phone) => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) return '+91 ******3210';
    return `+91 ******${clean.slice(-4)}`;
  };

  // 6 individual OTP input state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Refs for each input to manage focus
  const inputRefs = useRef([]);

  // 60-second countdown timer effect
  useEffect(() => {
    if (timerSeconds <= 0) return;

    const intervalId = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerSeconds]);

  // Handle single digit input and auto-focus next
  const handleDigitChange = (index, value) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (cleanVal.length > 0) {
      newOtp[index] = cleanVal.slice(-1);
      setOtp(newOtp);
      setErrorMessage('');

      // Auto-focus next input box if available
      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // Handle keyboard backspace and arrow navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    setErrorMessage('');

    // Focus last filled index or next empty
    const nextIdx = Math.min(pastedData.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  // Handle Resend OTP click
  const handleResendOtp = () => {
    if (timerSeconds > 0) return;

    // Reset OTP boxes
    setOtp(['', '', '', '', '', '']);
    setTimerSeconds(60);
    setErrorMessage('');
    setInfoMessage('A new 6-digit verification code has been dispatched.');

    // Clear info notice after 4 seconds
    setTimeout(() => {
      setInfoMessage('');
    }, 4000);

    inputRefs.current[0]?.focus();
  };

  // Autofill demo code for quick testing
  const handleAutofillDemo = () => {
    const demoCode = ['4', '8', '2', '9', '1', '0'];
    setOtp(demoCode);
    setErrorMessage('');
    inputRefs.current[5]?.focus();
  };

  // Handle verification submit
  const handleVerify = (e) => {
    e.preventDefault();
    const enteredCode = otp.join('');

    if (enteredCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    // Persist verified session
    const currentUser = {
      email: rawEmail,
      isVerified: true,
      role: pendingData?.role || 'District Officer',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('bhurakshak_user', JSON.stringify(currentUser));

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const isComplete = otp.every((d) => d !== '');
  const formattedTimer = `00:${timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}`;

  return (
    <div className="otp-container">
      {/* Left Branding Panel - Desktop View */}
      <div className="otp-brand-side">
        <div className="otp-pattern-grid" />

        <div className="otp-brand-top">
          <div className="gov-badge">
            <span className="gov-badge-icon">🏛️</span>
            <span>Government of India • Multi-Factor Verification</span>
          </div>

          <div className="otp-brand-identity">
            <img src="/logo.jpg" alt="BhuRakshak AI" className="otp-logo-img" />
            <div>
              <h1 className="otp-brand-title">BhuRakshak AI</h1>
              <p className="otp-brand-tagline">AI for Safer Hills &amp; Landslide Early Warning</p>
            </div>
          </div>
        </div>

        <div className="otp-brand-content">
          <h2 className="otp-brand-headline">Authorized Personnel Identity Verification</h2>
          <p className="otp-brand-desc">
            To ensure zero unauthorized dissemination of geological risk data and emergency siren
            triggers, identity verification is mandated across all 8 North Eastern states.
          </p>

          <div className="otp-security-badges">
            <div className="security-badge-item">
              <div className="security-badge-icon">🔒</div>
              <div className="security-badge-text">
                <h4>Time-based One-Time Token (TOTP)</h4>
                <p>Single-use security token valid for 60 seconds via NIC gateway</p>
              </div>
            </div>

            <div className="security-badge-item">
              <div className="security-badge-icon">🛰️</div>
              <div className="security-badge-text">
                <h4>Dual-Channel Dispatch</h4>
                <p>Simultaneous push to authorized government email &amp; encrypted SMS</p>
              </div>
            </div>

            <div className="security-badge-item">
              <div className="security-badge-icon">🛡️</div>
              <div className="security-badge-text">
                <h4>NDMA Compliant Security</h4>
                <p>Meets National Disaster Management Authority security standard Level 3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="otp-brand-footer">
          <div>🔐 2FA Security Layer Enabled</div>
          <div>C-DAC / NIC Protected</div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="otp-form-side">
        <div className="otp-form-card">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="otp-mobile-header">
            <div className="mobile-logo-row">
              <img src="/logo.jpg" alt="BhuRakshak AI" className="mobile-logo-img" />
              <div className="mobile-brand-title">BhuRakshak AI</div>
            </div>
            <div className="mobile-tagline">Identity Verification Gateway</div>
          </div>

          {/* Verification Badge */}
          <div className="otp-header-icon-box">🔐</div>

          <h2 className="otp-title">Verify Your Account</h2>
          <p className="otp-description">
            We have dispatched a 6-digit authentication code to your registered credentials:
          </p>

          <div className="otp-target-pill">
            <span>✉️ {maskEmail(rawEmail)}</span>
            <span>•</span>
            <span>📱 {maskPhone(rawMobile)}</span>
          </div>

          {infoMessage && (
            <div className="auth-alert auth-alert-success">
              <span>✓</span>
              <span>{infoMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Demo helper */}
          <div className="otp-demo-helper">
            <span>Demo Test OTP: <strong>482910</strong></span>
            <button type="button" className="demo-fill-btn" onClick={handleAutofillDemo}>
              Autofill
            </button>
          </div>

          <form onSubmit={handleVerify}>
            {/* 6 Individual Digit Inputs */}
            <div className="otp-inputs-grid" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`otp-digit-box ${digit ? 'filled' : ''}`}
                  autoFocus={idx === 0}
                  aria-label={`Digit ${idx + 1} of verification code`}
                />
              ))}
            </div>

            {/* Countdown Timer & Resend Button */}
            <div className="otp-timer-section">
              {timerSeconds > 0 ? (
                <div className="otp-countdown-active">
                  <span>⏳</span>
                  <span>Resend code in {formattedTimer}</span>
                </div>
              ) : (
                <div>
                  <span>Didn&apos;t receive the code? </span>
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="btn-primary otp-verify-btn"
              disabled={!isComplete}
            >
              <span>Verify &amp; Access Dashboard</span>
              <span>➔</span>
            </button>
          </form>

          {/* Back links */}
          <div className="otp-back-link-wrap">
            <span>Entered the wrong details?</span>
            <Link to="/register" className="otp-back-link">
              Back to Registration
            </Link>
            <span> or </span>
            <Link to="/login" className="otp-back-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
