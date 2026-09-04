import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Landing.css'

const HIGHLIGHTS = [
  {
    icon: '🧠',
    title: 'Explainable AI Risk Scoring',
    desc: 'Real-time XGBoost probability calculation with local SHAP factor breakdowns — understand exactly what drives each risk score.',
  },
  {
    icon: '🗺️',
    title: 'Interactive Geospatial Tracking',
    desc: 'Leaflet-powered terrain mapping with multi-severity zone indicators across all 8 NER states with live sensor feeds.',
  },
  {
    icon: '📡',
    title: 'Citizen Feedback Loop',
    desc: 'Crowdsourced hazard and incident reporting with photo evidence — turning field observers into first responders.',
  },
]

const FLOW_STEPS = [
  { step: '01', icon: '📡', title: 'Data Intake', desc: 'IMD sensors, satellite imagery, IoT soil probes & CWC gauges' },
  { step: '02', icon: '🤖', title: 'AI/ML Pipeline', desc: 'XGBoost + Random Forest ensemble with SHAP explainability' },
  { step: '03', icon: '🗺️', title: 'GIS Mapping', desc: 'Real-time Leaflet terrain overlay with severity zone clustering' },
  { step: '04', icon: '🔔', title: 'Alert Distribution', desc: 'SMS / IVR / API push alerts to NDMA, SDRF & district units' },
]

const STATS = [
  { value: '128', label: 'Monitored Zones' },
  { value: '8', label: 'NER States Covered' },
  { value: '< 2min', label: 'Alert Latency' },
  { value: '94.2%', label: 'Model Accuracy' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { authenticated } = useAuth()

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="container hero-inner">
          <div className="hero-badge">
            <span className="pulse-dot" />
            <span>LIVE Monitoring Active — All 8 NER States</span>
          </div>

          <div className="hero-logo-wrap">
            <div className="hero-logo-icon">🛡️</div>
          </div>

          <h1 className="hero-headline">
            AI-Powered Landslide<br />
            <span className="headline-accent">Early Warning System</span><br />
            <span className="headline-region">— North Eastern Region</span>
          </h1>

          <p className="hero-subtitle">
            Predictive terrain intelligence, real-time risk classification, and automated alerts
            to safeguard vulnerable communities across Assam, Meghalaya, Mizoram, Nagaland,
            Manipur, Sikkim, Tripura & Arunachal Pradesh.
          </p>

          <div className="hero-ctas">
            <button
              className="btn btn-primary btn-hero"
              onClick={() => navigate(authenticated ? '/dashboard' : '/login')}
            >
              🚀 Open Command Center
            </button>
            <button
              className="btn btn-outline btn-hero"
              onClick={() => navigate('/report')}
            >
              📝 Report Ground Hazard
            </button>
          </div>

          {/* Stats Row */}
          <div className="hero-stats">
            {STATS.map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Highlights */}
      <section className="section highlights-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">System Capabilities</h2>
            <p className="section-sub">Enterprise-grade disaster intelligence for NER's most vulnerable terrain</p>
          </div>
          <div className="highlights-grid">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="highlight-card card">
                <div className="hl-icon">{h.icon}</div>
                <h3 className="hl-title">{h.title}</h3>
                <p className="hl-desc">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Flow */}
      <section className="section flow-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">System Architecture</h2>
            <p className="section-sub">End-to-end data pipeline from terrain sensors to field alerts</p>
          </div>
          <div className="flow-grid">
            {FLOW_STEPS.map((step, i) => (
              <div key={i} className="flow-step card">
                <div className="flow-step-num">{step.step}</div>
                <div className="flow-icon">{step.icon}</div>
                <h4 className="flow-title">{step.title}</h4>
                <p className="flow-desc">{step.desc}</p>
                {i < FLOW_STEPS.length - 1 && <div className="flow-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="section cta-strip">
        <div className="container">
          <div className="cta-card">
            <div className="cta-text">
              <h3>Ready to access the Command Center?</h3>
              <p>Sign in as an authority officer or register to get full dashboard access.</p>
            </div>
            <div className="cta-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate(authenticated ? '/dashboard' : '/login')}
              >
                {authenticated ? '📊 Go to Dashboard' : '🔐 Sign In'}
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/report')}>
                📝 Report a Hazard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
