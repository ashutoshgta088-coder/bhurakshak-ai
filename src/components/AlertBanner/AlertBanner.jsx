import { ADVISORY_MAP } from '../../data/mockData.js'
import './AlertBanner.css'

export default function AlertBanner({ risk }) {
  const advisory = ADVISORY_MAP[risk] || ADVISORY_MAP['Low']

  return (
    <div
      className="alert-banner"
      style={{
        '--banner-color': advisory.color,
        '--banner-bg': `${advisory.color}15`,
        '--banner-border': `${advisory.color}40`,
      }}
    >
      <div className="banner-icon">{advisory.icon}</div>
      <div className="banner-body">
        <div className="banner-level" style={{ color: advisory.color }}>
          {advisory.level}
        </div>
        <div className="banner-message">{advisory.message}</div>
      </div>
      <div className="banner-actions">
        <button className="btn btn-sm" style={{ background: advisory.color, color: '#fff', border: 'none' }}>
          Issue Alert
        </button>
      </div>
    </div>
  )
}
