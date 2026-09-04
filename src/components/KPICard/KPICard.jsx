import './KPICard.css'

export default function KPICard({ icon, label, value, sub, accent, pulse = false }) {
  return (
    <div className="kpi-card" style={{ '--kpi-accent': accent }}>
      <div className="kpi-icon-wrap">
        <span className="kpi-icon">{icon}</span>
      </div>
      <div className="kpi-content">
        <span className="kpi-value" style={{ color: accent }}>
          {value}
          {pulse && <span className="kpi-pulse" />}
        </span>
        <span className="kpi-label">{label}</span>
        {sub && <span className="kpi-sub">{sub}</span>}
      </div>
    </div>
  )
}
