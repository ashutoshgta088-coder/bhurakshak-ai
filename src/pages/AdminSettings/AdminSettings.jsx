import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AdminSettings.css'

const TABS = ['Profile', 'Notifications', 'Alert Thresholds', 'User Management', 'System Config']

const MOCK_USERS = [
  { id: 1, name: 'Rajiv Sharma', email: 'admin@ner.gov.in', role: 'Authority', org: 'NDMA', status: 'Active' },
  { id: 2, name: 'Lt. Col. Priya Borah', email: 'sdrf@assam.gov.in', role: 'Authority', org: 'SDRF Assam', status: 'Active' },
  { id: 3, name: 'Aarav Khanna', email: 'citizen@ner.in', role: 'Citizen', org: 'Citizen', status: 'Active' },
  { id: 4, name: 'Dr. Meena Garg', email: 'cwc@gov.in', role: 'Field Team', org: 'CWC', status: 'Pending' },
  { id: 5, name: 'Sanjay Bhuyan', email: 'imd@met.gov.in', role: 'Authority', org: 'IMD', status: 'Active' },
]

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [thresholds, setThresholds] = useState({
    rainfallCritical: 180,
    rainfallHigh: 120,
    moistureCritical: 88,
    slopeHigh: 38,
    predictionCritical: 75,
  })
  const [notifSettings, setNotifSettings] = useState({
    sms: true, email: true, push: false, ivr: true,
    criticalOnly: false, dailyDigest: true,
  })
  const [savedMsg, setSavedMsg] = useState('')
  const { userInfo, userRole } = useAuth()

  const handleSave = () => {
    setSavedMsg('✅ Settings saved successfully!')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  const updateThreshold = (key, val) => setThresholds(t => ({ ...t, [key]: Number(val) }))
  const toggleNotif = (key) => setNotifSettings(n => ({ ...n, [key]: !n[key] }))

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">⚙️ Admin Settings</h1>
            <p className="admin-sub">Platform configuration and user management</p>
          </div>
          {savedMsg && <div className="save-toast">{savedMsg}</div>}
        </div>

        <div className="admin-layout">
          {/* Sidebar Tabs */}
          <div className="admin-sidebar card">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'Profile' && '👤 '}
                {tab === 'Notifications' && '🔔 '}
                {tab === 'Alert Thresholds' && '⚠️ '}
                {tab === 'User Management' && '👥 '}
                {tab === 'System Config' && '🖥️ '}
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="admin-content">
            {/* Profile Tab */}
            {activeTab === 'Profile' && (
              <div className="card admin-section">
                <h3 className="admin-section-title">👤 Profile Settings</h3>
                <div className="profile-avatar-row">
                  <div className="profile-avatar">{userInfo?.name?.charAt(0).toUpperCase() || 'U'}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{userInfo?.name || 'N/A'}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{userInfo?.email}</div>
                    <div className="profile-role-badge">{userRole}</div>
                  </div>
                </div>
                <div className="divider" />
                <div className="settings-form-grid">
                  {[
                    { label: 'Full Name', val: userInfo?.name || '' },
                    { label: 'Email Address', val: userInfo?.email || '' },
                    { label: 'Organization', val: userInfo?.organization || '' },
                    { label: 'Phone Number', val: '+91 98765 43210' },
                  ].map(f => (
                    <div key={f.label} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input className="form-input" defaultValue={f.val} />
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={handleSave}>💾 Save Profile</button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'Notifications' && (
              <div className="card admin-section">
                <h3 className="admin-section-title">🔔 Notification Preferences</h3>
                <div className="notif-list">
                  {[
                    { key: 'sms', label: '📱 SMS Alerts', desc: 'Receive alerts via SMS on mobile' },
                    { key: 'email', label: '📧 Email Notifications', desc: 'Detailed reports via email' },
                    { key: 'push', label: '🔔 Browser Push', desc: 'Desktop push notifications' },
                    { key: 'ivr', label: '📞 IVR Voice Calls', desc: 'Automated voice alert calls for Critical' },
                    { key: 'criticalOnly', label: '🚨 Critical Alerts Only', desc: 'Suppress Moderate/Low notifications' },
                    { key: 'dailyDigest', label: '📋 Daily Digest', desc: 'Summary email every morning at 7am' },
                  ].map(n => (
                    <div key={n.key} className="notif-row">
                      <div className="notif-info">
                        <div className="notif-label">{n.label}</div>
                        <div className="notif-desc">{n.desc}</div>
                      </div>
                      <button
                        className={`toggle-btn ${notifSettings[n.key] ? 'toggle-on' : 'toggle-off'}`}
                        onClick={() => toggleNotif(n.key)}
                      >
                        <span className="toggle-thumb" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={handleSave}>💾 Save Preferences</button>
              </div>
            )}

            {/* Alert Thresholds */}
            {activeTab === 'Alert Thresholds' && (
              <div className="card admin-section">
                <h3 className="admin-section-title">⚠️ Alert Threshold Configuration</h3>
                <p className="admin-section-desc">
                  Configure the sensor thresholds that trigger risk level transitions.
                  Changes affect the AI model's alert generation pipeline.
                </p>
                <div className="threshold-list">
                  {[
                    { key: 'rainfallCritical', label: 'Rainfall — Critical Threshold', unit: 'mm/24h', min: 50, max: 300 },
                    { key: 'rainfallHigh', label: 'Rainfall — High Alert Threshold', unit: 'mm/24h', min: 30, max: 200 },
                    { key: 'moistureCritical', label: 'Soil Moisture — Critical Level', unit: '%', min: 60, max: 100 },
                    { key: 'slopeHigh', label: 'Slope Angle — High Risk Trigger', unit: '°', min: 15, max: 60 },
                    { key: 'predictionCritical', label: 'AI Score — Critical Alert Trigger', unit: '%', min: 50, max: 95 },
                  ].map(t => (
                    <div key={t.key} className="threshold-row">
                      <div className="threshold-info">
                        <div className="threshold-label">{t.label}</div>
                        <div className="threshold-value" style={{ color: 'var(--accent-blue)' }}>
                          Current: <strong>{thresholds[t.key]} {t.unit}</strong>
                        </div>
                      </div>
                      <div className="threshold-slider-wrap">
                        <input
                          type="range"
                          min={t.min}
                          max={t.max}
                          value={thresholds[t.key]}
                          onChange={e => updateThreshold(t.key, e.target.value)}
                          className="threshold-slider"
                        />
                        <div className="slider-range">
                          <span>{t.min} {t.unit}</span>
                          <span>{t.max} {t.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="threshold-warn">
                  ⚠️ Changes to thresholds require retraining the prediction model. Contact the ML team before modifying.
                </div>
                <button className="btn btn-primary" onClick={handleSave}>💾 Save Thresholds</button>
              </div>
            )}

            {/* User Management */}
            {activeTab === 'User Management' && (
              <div className="card admin-section" style={{ padding: 0 }}>
                <div className="admin-table-header">
                  <h3 className="admin-section-title">👥 User Management</h3>
                  <button className="btn btn-primary btn-sm">+ Add User</button>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Organization</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_USERS.map(u => (
                        <tr key={u.id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{u.email}</td>
                          <td><span className={`badge ${u.role === 'Authority' ? 'badge-blue' : u.role === 'Field Team' ? 'badge-amber' : 'badge-green'}`}>{u.role}</span></td>
                          <td>{u.org}</td>
                          <td><span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>{u.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-ghost" style={{ padding: '3px 10px', fontSize: 11 }}>Edit</button>
                              <button className="btn btn-danger" style={{ padding: '3px 10px', fontSize: 11 }}>Revoke</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* System Config */}
            {activeTab === 'System Config' && (
              <div className="card admin-section">
                <h3 className="admin-section-title">🖥️ System Configuration</h3>
                <div className="sys-config-grid">
                  {[
                    { label: 'API Backend URL', val: 'http://localhost:8000', type: 'text' },
                    { label: 'Prediction Model Version', val: 'XGBoost v2.1.4', type: 'text' },
                    { label: 'Data Sync Interval (min)', val: '15', type: 'number' },
                    { label: 'Alert Broadcast Cooldown (min)', val: '30', type: 'number' },
                    { label: 'Map Default Zoom', val: '7', type: 'number' },
                    { label: 'Sensor Offline Timeout (min)', val: '10', type: 'number' },
                  ].map(c => (
                    <div key={c.label} className="form-group">
                      <label className="form-label">{c.label}</label>
                      <input className="form-input" type={c.type} defaultValue={c.val} />
                    </div>
                  ))}
                </div>
                <div className="sys-status-row">
                  {[
                    { label: 'API Backend', status: 'Offline', color: '#EF4444' },
                    { label: 'ML Pipeline', status: 'Simulated', color: '#EAB308' },
                    { label: 'GIS Engine', status: 'Online', color: '#10B981' },
                    { label: 'Alert Gateway', status: 'Online', color: '#10B981' },
                  ].map(s => (
                    <div key={s.label} className="sys-status-chip">
                      <span className="sys-status-dot" style={{ background: s.color }} />
                      <span>{s.label}</span>
                      <span style={{ color: s.color, fontWeight: 700, marginLeft: 'auto' }}>{s.status}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={handleSave}>💾 Save Configuration</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
