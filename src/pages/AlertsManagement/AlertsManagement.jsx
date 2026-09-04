import { useState, useEffect } from 'react'
import { fetchActiveAlerts } from '../../api/apiClient.js'
import { NER_STATES } from '../../data/mockData.js'
import './AlertsManagement.css'

const URGENCY_ORDER = { Critical: 0, High: 1, Moderate: 2, Low: 3 }
const URGENCY_COLOR = { Critical: '#EF4444', High: '#F97316', Moderate: '#EAB308', Low: '#10B981' }
const URGENCY_BADGE = { Critical: 'badge-red', High: 'badge-amber', Moderate: 'badge-yellow', Low: 'badge-green' }

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
  a.download = `BhuRakshak_Alerts_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AlertsManagement() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterState, setFilterState] = useState('')
  const [filterUrgency, setFilterUrgency] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [checklist, setChecklist] = useState({})
  const [expandedId, setExpandedId] = useState(null)
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set())

  useEffect(() => {
    fetchActiveAlerts().then(data => { setAlerts(data); setLoading(false) })
  }, [])

  const toggleCheck = (id) => setChecklist(c => ({ ...c, [id]: !c[id] }))
  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id)
  const acknowledge = (id, e) => {
    e.stopPropagation()
    setAcknowledgedIds(prev => new Set([...prev, id]))
  }

  const filtered = alerts
    .filter(a => !filterState || a.state === filterState)
    .filter(a => !filterUrgency || a.urgency === filterUrgency)
    .filter(a => !searchQuery || a.zone.toLowerCase().includes(searchQuery.toLowerCase()) || a.district.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])

  const completedChecks = Object.values(checklist).filter(Boolean).length

  if (loading) return (
    <div className="am-page"><div className="container dash-loading"><div className="loading-spinner" /><span>Loading alerts...</span></div></div>
  )

  return (
    <div className="am-page">
      <div className="container">
        {/* Header */}
        <div className="am-header">
          <div>
            <h1 className="am-title">🚨 Alerts Management</h1>
            <p className="am-sub">Manage and respond to active landslide warnings across NER</p>
          </div>
          <div className="am-header-actions">
            <button className="btn btn-danger btn-sm">📢 Broadcast All Critical</button>
            <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV(filtered)}>⬇️ Export CSV</button>
          </div>
        </div>

        {/* Summary Chips */}
        <div className="urgency-summary">
          {['Critical', 'High', 'Moderate', 'Low'].map(u => {
            const count = alerts.filter(a => a.urgency === u).length
            return (
              <div
                key={u}
                className={`urgency-chip ${filterUrgency === u ? 'urgency-chip-active' : ''}`}
                style={{ '--uc': URGENCY_COLOR[u] }}
                onClick={() => setFilterUrgency(filterUrgency === u ? '' : u)}
              >
                <span className="uc-count" style={{ color: URGENCY_COLOR[u] }}>{count}</span>
                <span className="uc-label">{u}</span>
              </div>
            )
          })}
        </div>

        <div className="am-main-grid">
          {/* Left: Alerts */}
          <div className="am-left">
            {/* Filters */}
            <div className="am-filters card">
              <input
                className="form-input filter-search"
                placeholder="🔍 Search by zone or district..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <select className="form-select filter-select" value={filterState} onChange={e => setFilterState(e.target.value)}>
                <option value="">All States</option>
                {NER_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {(filterState || filterUrgency || searchQuery) && (
                <button className="btn btn-ghost btn-sm" onClick={() => { setFilterState(''); setFilterUrgency(''); setSearchQuery('') }}>
                  ✕ Clear Filters
                </button>
              )}
              <span className="filter-result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Alert Cards */}
            <div className="am-alerts-list">
              {filtered.length === 0 ? (
                <div className="alerts-empty card">✅ No alerts match the current filters.</div>
              ) : filtered.map(alert => (
                <div
                  key={alert.id}
                  className={`am-alert-card card ${expandedId === alert.id ? 'expanded' : ''} ${acknowledgedIds.has(alert.id) ? 'acknowledged' : ''}`}
                  onClick={() => toggleExpand(alert.id)}
                >
                  <div className="am-alert-header">
                    <div className="am-alert-left">
                      <div className="urgency-stripe" style={{ background: URGENCY_COLOR[alert.urgency] }} />
                      <div className="am-alert-info">
                        <div className="am-alert-top">
                          <span className={`badge ${URGENCY_BADGE[alert.urgency]}`}>{alert.urgency}</span>
                          {acknowledgedIds.has(alert.id) && <span className="badge badge-green">✓ Acknowledged</span>}
                        </div>
                        <div className="am-zone-name">{alert.zone}</div>
                        <div className="am-zone-meta">{alert.district}, {alert.state} · {alert.time}</div>
                      </div>
                    </div>
                    <div className="am-alert-right">
                      {!acknowledgedIds.has(alert.id) && (
                        <button
                          className="btn btn-ghost btn-sm ack-btn"
                          onClick={(e) => acknowledge(alert.id, e)}
                        >
                          ✓ Ack
                        </button>
                      )}
                      <span className="expand-chevron">{expandedId === alert.id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedId === alert.id && (
                    <div className="am-alert-body">
                      <div className="am-alert-message">
                        ⚠️ {alert.message}
                      </div>
                      <div className="am-alert-footer">
                        <span className="am-issued-by">📡 Issued by: {alert.issuedBy}</span>
                        <div className="am-action-btns">
                          <button className="btn btn-outline btn-sm" style={{ fontSize: 12 }}>🗺️ View on Map</button>
                          <button className="btn btn-danger btn-sm" style={{ fontSize: 12 }}>📢 Broadcast</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Decision Support */}
          <div className="am-right">
            {/* Response Checklist */}
            <div className="card">
              <div className="checklist-header">
                <h3>🏛️ Response Checklist</h3>
                <span className="check-progress" style={{ color: 'var(--safe-green)', fontSize: 12, fontWeight: 700 }}>
                  {completedChecks}/{CHECKLIST_ITEMS.length}
                </span>
              </div>
              <div className="checklist-progress-bar">
                <div className="checklist-bar" style={{ width: `${(completedChecks / CHECKLIST_ITEMS.length) * 100}%` }} />
              </div>
              <div className="checklist-items-list">
                {CHECKLIST_ITEMS.map(item => (
                  <label key={item.id} className="checklist-item">
                    <input type="checkbox" checked={!!checklist[item.id]} onChange={() => toggleCheck(item.id)} />
                    <span className={checklist[item.id] ? 'checked-label' : ''}>{item.label}</span>
                  </label>
                ))}
              </div>
              {completedChecks === CHECKLIST_ITEMS.length && (
                <div className="all-done-badge">✅ All response actions completed!</div>
              )}
            </div>

            {/* Alert Stats */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📊 Alert Breakdown</h3>
              {['Critical', 'High', 'Moderate', 'Low'].map(u => {
                const count = alerts.filter(a => a.urgency === u).length
                const ackCount = alerts.filter(a => a.urgency === u && acknowledgedIds.has(a.id)).length
                return (
                  <div key={u} className="alert-stat-row-full">
                    <span className={`badge ${URGENCY_BADGE[u]}`} style={{ width: 80, justifyContent: 'center' }}>{u}</span>
                    <div className="ast-bar-wrap">
                      <div className="ast-bar-bg">
                        <div className="ast-bar" style={{ width: `${alerts.length ? (count / alerts.length) * 100 : 0}%`, background: URGENCY_COLOR[u] }} />
                        <div className="ast-bar-ack" style={{ width: `${alerts.length ? (ackCount / alerts.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: URGENCY_COLOR[u], width: 20, textAlign: 'right' }}>{count}</span>
                  </div>
                )
              })}
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                {acknowledgedIds.size}/{alerts.length} alerts acknowledged
              </p>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚡ Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'flex-start', fontSize: 13 }}>
                  📢 Broadcast RED ALERT to All
                </button>
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', fontSize: 13 }}>
                  📑 Generate Situation Report
                </button>
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', fontSize: 13 }} onClick={() => downloadCSV(alerts)}>
                  📥 Download Alert CSV
                </button>
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', fontSize: 13 }}>
                  📧 Notify District Collectors
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
