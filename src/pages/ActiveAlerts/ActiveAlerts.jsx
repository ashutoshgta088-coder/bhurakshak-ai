import { useState, useEffect } from 'react'
import { fetchActiveAlerts } from '../../api/apiClient.js'
import { NER_STATES, RISK_BADGE_CLASS } from '../../data/mockData.js'
import './ActiveAlerts.css'

const URGENCY_ORDER = { Critical: 0, High: 1, Moderate: 2, Low: 3 }

const URGENCY_BADGE = {
  Critical: 'badge-red',
  High: 'badge-amber',
  Moderate: 'badge-yellow',
  Low: 'badge-green',
}

const CHECKLIST_ITEMS = [
  { id: 'broadcast', label: '📢 Issue Public Broadcast via IVR & SMS' },
  { id: 'diversion', label: '🚧 Enforce Highway Diversions on Affected Routes' },
  { id: 'verify', label: '🔍 Deploy Ground Verification Team' },
  { id: 'ndrf', label: '🪖 Alert NDRF / SDRF Teams for Standby' },
  { id: 'hospital', label: '🏥 Notify Nearest District Hospital' },
  { id: 'dc', label: '📞 Brief District Collector & SDM' },
]

function downloadCSV(alerts) {
  const headers = ['ID', 'Zone', 'District', 'State', 'Urgency', 'Message', 'Time', 'Issued By']
  const rows = alerts.map(a => [a.id, a.zone, a.district, a.state, a.urgency, `"${a.message}"`, a.time, a.issuedBy])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `BhuRakshak_Alerts_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ActiveAlerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterState, setFilterState] = useState('')
  const [filterUrgency, setFilterUrgency] = useState('')
  const [checklist, setChecklist] = useState({})
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchActiveAlerts().then(data => {
      setAlerts(data)
      setLoading(false)
    })
  }, [])

  const toggleCheck = (id) => setChecklist(c => ({ ...c, [id]: !c[id] }))
  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id)

  const filtered = alerts
    .filter(a => (!filterState || a.state === filterState))
    .filter(a => (!filterUrgency || a.urgency === filterUrgency))
    .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])

  const completedChecks = Object.values(checklist).filter(Boolean).length

  if (loading) {
    return (
      <div className="alerts-page">
        <div className="container dash-loading">
          <div className="loading-spinner" />
          <span>Loading active alerts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="alerts-page">
      <div className="container">
        {/* Header */}
        <div className="alerts-header">
          <div>
            <h1 className="alerts-title">🚨 Active Alerts & Decision Support</h1>
            <p className="alerts-sub">
              {filtered.length} alert{filtered.length !== 1 ? 's' : ''} matching current filters
            </p>
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => downloadCSV(filtered)}
          >
            ⬇️ Export CSV
          </button>
        </div>

        <div className="alerts-main-grid">
          {/* Left: Alerts Table */}
          <div className="alerts-left">
            {/* Filters */}
            <div className="alerts-filters card">
              <span className="filter-label">🔍 Filter Alerts:</span>
              <select
                className="form-select filter-select"
                value={filterState}
                onChange={e => setFilterState(e.target.value)}
              >
                <option value="">All States</option>
                {NER_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                className="form-select filter-select"
                value={filterUrgency}
                onChange={e => setFilterUrgency(e.target.value)}
              >
                <option value="">All Urgency</option>
                <option value="Critical">🔴 Critical</option>
                <option value="High">🟠 High</option>
                <option value="Moderate">🟡 Moderate</option>
                <option value="Low">🟢 Low</option>
              </select>
              {(filterState || filterUrgency) && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setFilterState(''); setFilterUrgency('') }}
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Alerts List */}
            <div className="alerts-list">
              {filtered.length === 0 ? (
                <div className="alerts-empty">
                  <span>✅ No alerts match the current filters.</span>
                </div>
              ) : filtered.map(alert => (
                <div
                  key={alert.id}
                  className={`alert-item card ${expandedId === alert.id ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(alert.id)}
                >
                  <div className="alert-item-header">
                    <div className="alert-item-left">
                      <span className={`badge ${URGENCY_BADGE[alert.urgency] || 'badge-blue'}`}>
                        {alert.urgency}
                      </span>
                      <span className="alert-zone">{alert.zone}</span>
                    </div>
                    <div className="alert-item-right">
                      <span className="alert-time">{alert.time}</span>
                      <span className="alert-expand-icon">{expandedId === alert.id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedId === alert.id && (
                    <div className="alert-item-body">
                      <div className="alert-detail-grid">
                        <span><strong>District:</strong> {alert.district}</span>
                        <span><strong>State:</strong> {alert.state}</span>
                        <span><strong>Issued By:</strong> {alert.issuedBy}</span>
                      </div>
                      <div className="alert-message">
                        ⚠️ {alert.message}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Decision Support */}
          <div className="alerts-right">
            {/* Response Checklist */}
            <div className="card checklist-card">
              <div className="checklist-header">
                <h3>🏛️ Authority Response Checklist</h3>
                <span className="check-progress">
                  {completedChecks}/{CHECKLIST_ITEMS.length} completed
                </span>
              </div>
              <div className="checklist-progress">
                <div
                  className="checklist-bar"
                  style={{ width: `${(completedChecks / CHECKLIST_ITEMS.length) * 100}%` }}
                />
              </div>
              <div className="checklist-items">
                {CHECKLIST_ITEMS.map(item => (
                  <label key={item.id} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={!!checklist[item.id]}
                      onChange={() => toggleCheck(item.id)}
                    />
                    <span className={checklist[item.id] ? 'checked-label' : ''}>{item.label}</span>
                  </label>
                ))}
              </div>
              {completedChecks === CHECKLIST_ITEMS.length && (
                <div className="checklist-complete">
                  ✅ All response actions completed!
                </div>
              )}
            </div>

            {/* Alert Summary Stats */}
            <div className="card stats-card">
              <h3>📊 Alert Summary</h3>
              {['Critical', 'High', 'Moderate', 'Low'].map(u => {
                const count = alerts.filter(a => a.urgency === u).length
                return (
                  <div key={u} className="alert-stat-row">
                    <div className="alert-stat-left">
                      <span className={`badge ${URGENCY_BADGE[u]}`}>{u}</span>
                    </div>
                    <div className="alert-stat-bar-wrap">
                      <div
                        className="alert-stat-bar"
                        style={{
                          width: `${alerts.length ? (count / alerts.length) * 100 : 0}%`,
                          background: u === 'Critical' ? '#EF4444' : u === 'High' ? '#F97316' : u === 'Moderate' ? '#EAB308' : '#10B981',
                        }}
                      />
                    </div>
                    <span className="alert-stat-count">{count}</span>
                  </div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="card quick-actions-card">
              <h3>⚡ Quick Actions</h3>
              <div className="quick-actions-list">
                <button className="btn btn-danger quick-btn">
                  📢 Broadcast RED ALERT
                </button>
                <button className="btn btn-outline quick-btn">
                  📑 Generate Situation Report
                </button>
                <button className="btn btn-ghost quick-btn" onClick={() => downloadCSV(alerts)}>
                  📥 Download Alert CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
