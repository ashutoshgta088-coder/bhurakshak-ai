import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { systemStatus, monitoredLocations, predictionFactors } from '../data/mockData';
import './AdminSettings.css';

export default function AdminSettings() {
  const { id } = useParams(); // URL params support if routed with params

  // Active Tab State
  const [activeTab, setActiveTab] = useState('users');

  // User Management State (5 initial users)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Dr. Rajesh Sharma',
      email: 'r.sharma@nesac.gov.in',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: 'Today, 14:32',
      department: 'NESAC / ISRO'
    },
    {
      id: 2,
      name: 'Priya Sengupta',
      email: 'p.sengupta@sdma.meghalaya.gov.in',
      role: 'District Officer',
      status: 'Active',
      lastLogin: 'Yesterday, 09:15',
      department: 'Meghalaya SDMA'
    },
    {
      id: 3,
      name: 'Col. Anand Verma',
      email: 'a.verma@bro.nic.in',
      role: 'Field Officer',
      status: 'Active',
      lastLogin: '26 Sep 2026, 17:40',
      department: 'Border Roads Org'
    },
    {
      id: 4,
      name: 'Biren Das',
      email: 'biren.das@assam.gov.in',
      role: 'District Officer',
      status: 'Inactive',
      lastLogin: '18 Sep 2026, 11:20',
      department: 'Assam Disaster Mgmt'
    },
    {
      id: 5,
      name: 'Anita Devi',
      email: 'anita.devi@community.org',
      role: 'Citizen',
      status: 'Active',
      lastLogin: 'Today, 16:05',
      department: 'Public Watch Volunteer'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'District Officer',
    department: '',
    status: 'Active'
  });

  // Alert Thresholds State
  const [thresholds, setThresholds] = useState({
    criticalRisk: 80,
    highRisk: 60,
    rainfall: 200,
    soilMoisture: 80,
    groundMovement: 2.0,
    evacuationScore: 90
  });

  // System Config State
  const [config, setConfig] = useState({
    emailNotifications: true,
    smsAlerts: true,
    autoEscalation: true,
    darkMode: false,
    dataRetention: '1 Year',
    auditLogging: true,
    gisPollingRate: 'Every 5 Minutes',
    ndrfWebhook: 'https://ndrf.gov.in/api/v1/webhook'
  });

  // Feedback Toasts
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // User Actions
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      showNotification('Please provide both name and email.', 'warning');
      return;
    }
    const createdUser = {
      id: Date.now(),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: newUser.status,
      department: newUser.department || 'General Administration',
      lastLogin: 'Never'
    };
    setUsers([createdUser, ...users]);
    setNewUser({ name: '', email: '', role: 'District Officer', department: '', status: 'Active' });
    setIsAddUserModalOpen(false);
    showNotification(`User ${createdUser.name} added successfully.`);
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to remove user "${name}"?`)) {
      setUsers(users.filter(u => u.id !== id));
      showNotification(`User "${name}" was removed.`);
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        showNotification(`User ${u.name} is now ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Filtered Users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Threshold handlers
  const handleThresholdChange = (key, value) => {
    setThresholds(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    if (thresholds.highRisk >= thresholds.criticalRisk) {
      showNotification('High Risk threshold must be strictly lower than Critical Risk threshold.', 'warning');
      return;
    }
    showNotification('Alert thresholds updated and synchronized with AI inference engine.');
  };

  const handleResetThresholds = () => {
    setThresholds({
      criticalRisk: 80,
      highRisk: 60,
      rainfall: 200,
      soilMoisture: 80,
      groundMovement: 2.0,
      evacuationScore: 90
    });
    showNotification('Thresholds reset to national disaster mitigation baseline values.');
  };

  // Config handlers
  const handleToggleConfig = (key) => {
    setConfig(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showNotification(`${key.replace(/([A-Z])/g, ' $1')} is now ${next[key] ? 'ENABLED' : 'DISABLED'}.`);
      return next;
    });
  };

  const handleSaveConfig = () => {
    showNotification('System configuration parameters saved and propagated across cluster.');
  };

  // Roles definition
  const rolesData = [
    {
      role: 'Super Admin',
      icon: '🛡️',
      colorClass: 'role-super-admin',
      desc: 'Full administrative authority over platform parameters, AI model hyper-parameters, user authentication, and government feeds.',
      userCount: users.filter(u => u.role === 'Super Admin').length,
      permissions: [
        'Manage All Users & Role Assignment',
        'Modify National Alert Thresholds',
        'Configure GIS & IMD Satellite Integrations',
        'Trigger Emergency NDRF Red Broadcasts',
        'Access Audit Trail & Raw Telemetry Data'
      ]
    },
    {
      role: 'District Officer',
      icon: '🏢',
      colorClass: 'role-district-officer',
      desc: 'District Disaster Management Authority (DDMA) officials responsible for validating local warnings, evacuation alerts, and resource dispatch.',
      userCount: users.filter(u => u.role === 'District Officer').length,
      permissions: [
        'Review & Authorize District Alerts',
        'Manage District Evacuation Notices',
        'Verify Field Sensor Anomalies',
        'Dispatch SDRF Emergency Response Teams',
        'Export District Risk Analytics Reports'
      ]
    },
    {
      role: 'Field Officer',
      icon: '👷',
      colorClass: 'role-field-officer',
      desc: 'Border Roads Organisation (BRO), PWD engineers, and geological field teams operating physical sensors and inspecting hill slopes.',
      userCount: users.filter(u => u.role === 'Field Officer').length,
      permissions: [
        'Submit Ground Geotechnical Inspections',
        'Calibrate On-Site Soil & Tilt Sensors',
        'Report Road Closures & Slope Slips',
        'Verify Citizen Landslide Sightings',
        'Receive Priority Tactical Pushes'
      ]
    },
    {
      role: 'Citizen',
      icon: '👥',
      colorClass: 'role-citizen',
      desc: 'Public residents, tourists, and village volunteers living across North-Eastern hill districts seeking hazard awareness.',
      userCount: users.filter(u => u.role === 'Citizen').length,
      permissions: [
        'View Public Landslide Risk & Safe Routes',
        'Report Slope Cracks & Debris Flow with Photos',
        'Receive Local SMS & WhatsApp Emergency Warnings',
        'Access Emergency Helpline Directory',
        'View Community Preparedness Guidelines'
      ]
    }
  ];

  return (
    <div className="admin-settings-container">
      {/* Page Header */}
      <div className="admin-header">
        <div className="admin-header-title">
          <div className="admin-header-icon">👥</div>
          <div>
            <h1>Admin Settings</h1>
            <p>Manage system governance, access control, risk scoring thresholds, and platform services</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="admin-badge-gov">
            🏛️ Government of India • Ministry of DoNER
          </span>
          <Link to="/system-status" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            ⚙️ View System Status
          </Link>
        </div>
      </div>

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className={`admin-toast ${toastMessage.type === 'warning' ? 'warning' : ''}`}>
          <span>
            {toastMessage.type === 'warning' ? '⚠️ ' : '✅ '}
            {toastMessage.msg}
          </span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="admin-tabs-nav">
        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span className="tab-icon">👤</span>
          <span>User Management</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <span className="tab-icon">🔑</span>
          <span>Role Management</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'thresholds' ? 'active' : ''}`}
          onClick={() => setActiveTab('thresholds')}
        >
          <span className="tab-icon">⚡</span>
          <span>Alert Thresholds</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <span className="tab-icon">⚙️</span>
          <span>System Config</span>
        </button>
      </div>

      {/* ================= TAB 1: USER MANAGEMENT ================= */}
      {activeTab === 'users' && (
        <div className="tab-content-area">
          <div className="user-mgmt-header">
            <div className="user-mgmt-controls">
              <div className="user-search-box">
                <span className="user-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search user by name, email, or dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="user-search-input"
                />
              </div>

              <select
                className="user-filter-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles ({users.length})</option>
                <option value="Super Admin">Super Admin</option>
                <option value="District Officer">District Officer</option>
                <option value="Field Officer">Field Officer</option>
                <option value="Citizen">Citizen</option>
              </select>
            </div>

            <button className="btn-primary" onClick={() => setIsAddUserModalOpen(true)}>
              <span>➕</span> Add User
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <div className="user-name-title">{user.name}</div>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              {user.department}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ color: 'var(--primary-blue)', fontWeight: 500 }}>
                        {user.email}
                      </td>

                      <td>
                        <span className={`user-role-badge ${
                          user.role === 'Super Admin' ? 'role-super-admin' :
                          user.role === 'District Officer' ? 'role-district-officer' :
                          user.role === 'Field Officer' ? 'role-field-officer' : 'role-citizen'
                        }`}>
                          {user.role === 'Super Admin' && '🛡️ '}
                          {user.role === 'District Officer' && '🏢 '}
                          {user.role === 'Field Officer' && '👷 '}
                          {user.role === 'Citizen' && '👥 '}
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          title="Click to toggle status"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <span className={`status-badge ${user.status.toLowerCase()}`}>
                            <span className="status-dot"></span>
                            {user.status}
                          </span>
                        </button>
                      </td>

                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        {user.lastLogin}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div className="action-btns" style={{ justifyContent: 'center' }}>
                          <button
                            className="btn-icon-action edit"
                            onClick={() => handleToggleStatus(user.id)}
                            title="Toggle status"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-icon-action delete"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            title="Delete user"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                      No personnel or users match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ROLE MANAGEMENT ================= */}
      {activeTab === 'roles' && (
        <div className="roles-grid">
          {rolesData.map((roleItem, index) => (
            <div key={index} className="role-card">
              <div>
                <div className="role-card-top">
                  <div className={`role-icon-box ${roleItem.colorClass}`}>
                    {roleItem.icon}
                  </div>
                  <div className="role-card-title">
                    <h3>{roleItem.role}</h3>
                    <div className="role-user-count">{roleItem.userCount} Active Users</div>
                  </div>
                </div>

                <p className="role-desc">{roleItem.desc}</p>

                <div className="permissions-title">System Permissions</div>
                <div className="permissions-list">
                  {roleItem.permissions.map((perm, pIdx) => (
                    <div key={pIdx} className="permission-item">
                      <span className="perm-check">✓</span>
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="role-footer">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Policy ID: POL-NER-{100 + index}
                </span>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={() => showNotification(`Role specifications for "${roleItem.role}" are actively enforced.`)}
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 3: ALERT THRESHOLDS ================= */}
      {activeTab === 'thresholds' && (
        <div className="thresholds-wrapper">
          <form className="thresholds-form-card" onSubmit={handleSaveThresholds}>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                Operational Risk Trigger Thresholds
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Set mathematical cutoffs for autonomous warning sirens, SMS broadcasts, and NDMA dispatch advisories.
              </p>
            </div>

            {/* Critical Risk Score */}
            <div className="threshold-group">
              <div className="threshold-label-row">
                <span className="threshold-title">
                  🚨 Critical Risk Score Threshold
                </span>
                <span className="threshold-val-badge critical">
                  Score &ge; {thresholds.criticalRisk} / 100
                </span>
              </div>
              <div className="threshold-slider-row">
                <input
                  type="range"
                  min="65"
                  max="95"
                  value={thresholds.criticalRisk}
                  onChange={(e) => handleThresholdChange('criticalRisk', e.target.value)}
                  className="threshold-slider"
                />
                <input
                  type="number"
                  min="65"
                  max="95"
                  value={thresholds.criticalRisk}
                  onChange={(e) => handleThresholdChange('criticalRisk', e.target.value)}
                  className="threshold-num-input"
                />
              </div>
              <p className="threshold-help">
                Triggers Red Alert, automated siren alerts, and emergency NDRF notifications.
              </p>
            </div>

            {/* High Risk Score */}
            <div className="threshold-group">
              <div className="threshold-label-row">
                <span className="threshold-title">
                  ⚠️ High Risk Score Threshold
                </span>
                <span className="threshold-val-badge high">
                  Score &ge; {thresholds.highRisk} / 100
                </span>
              </div>
              <div className="threshold-slider-row">
                <input
                  type="range"
                  min="45"
                  max="79"
                  value={thresholds.highRisk}
                  onChange={(e) => handleThresholdChange('highRisk', e.target.value)}
                  className="threshold-slider"
                />
                <input
                  type="number"
                  min="45"
                  max="79"
                  value={thresholds.highRisk}
                  onChange={(e) => handleThresholdChange('highRisk', e.target.value)}
                  className="threshold-num-input"
                />
              </div>
              <p className="threshold-help">
                Triggers Orange Alert, field patrol deployment, and advisory warnings for mountain highways.
              </p>
            </div>

            {/* Rainfall Alert Threshold */}
            <div className="threshold-group">
              <div className="threshold-label-row">
                <span className="threshold-title">
                  🌧️ Rainfall Alert Threshold (24-Hour Cumulative)
                </span>
                <span className="threshold-val-badge info">
                  {thresholds.rainfall} mm / 24h
                </span>
              </div>
              <div className="threshold-slider-row">
                <input
                  type="range"
                  min="100"
                  max="400"
                  step="5"
                  value={thresholds.rainfall}
                  onChange={(e) => handleThresholdChange('rainfall', e.target.value)}
                  className="threshold-slider"
                />
                <input
                  type="number"
                  min="100"
                  max="500"
                  value={thresholds.rainfall}
                  onChange={(e) => handleThresholdChange('rainfall', e.target.value)}
                  className="threshold-num-input"
                />
              </div>
              <p className="threshold-help">
                IMD precipitation rate threshold that forces AI model into rapid re-assessment mode.
              </p>
            </div>

            {/* Soil Moisture Alert Threshold */}
            <div className="threshold-group">
              <div className="threshold-label-row">
                <span className="threshold-title">
                  💧 Soil Moisture Alert Threshold
                </span>
                <span className="threshold-val-badge info">
                  {thresholds.soilMoisture} % Saturation
                </span>
              </div>
              <div className="threshold-slider-row">
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={thresholds.soilMoisture}
                  onChange={(e) => handleThresholdChange('soilMoisture', e.target.value)}
                  className="threshold-slider"
                />
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={thresholds.soilMoisture}
                  onChange={(e) => handleThresholdChange('soilMoisture', e.target.value)}
                  className="threshold-num-input"
                />
              </div>
              <p className="threshold-help">
                Ground pore pressure limit where slope liquefaction is deemed statistically imminent.
              </p>
            </div>

            <div className="threshold-actions">
              <button type="submit" className="btn-primary">
                💾 Save Threshold Policies
              </button>
              <button type="button" className="btn-secondary" onClick={handleResetThresholds}>
                🔄 Reset to Defaults
              </button>
            </div>
          </form>

          {/* Threshold Preview & Impact card */}
          <div className="threshold-preview-card">
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
                Active Threat Classification
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Based on currently selected values, regional zones are categorized into four operational bands:
              </p>
            </div>

            <div className="preview-scale-box">
              <div className="scale-visual-bar">
                <div className="scale-segment low" style={{ width: `${thresholds.highRisk * 0.6}%` }}>LOW</div>
                <div className="scale-segment mod" style={{ width: `${(thresholds.highRisk - 40)}%` }}>MOD</div>
                <div className="scale-segment high" style={{ width: `${thresholds.criticalRisk - thresholds.highRisk}%` }}>HIGH</div>
                <div className="scale-segment crit" style={{ width: `${100 - thresholds.criticalRisk}%` }}>CRITICAL</div>
              </div>

              <div className="scale-legend-items">
                <div className="scale-legend-row">
                  <div className="scale-legend-label">
                    <span className="legend-color-dot" style={{ background: '#e53935' }}></span>
                    <span>Critical Risk</span>
                  </div>
                  <strong>Score &ge; {thresholds.criticalRisk}</strong>
                </div>

                <div className="scale-legend-row">
                  <div className="scale-legend-label">
                    <span className="legend-color-dot" style={{ background: '#ff9800' }}></span>
                    <span>High Risk</span>
                  </div>
                  <strong>Score {thresholds.highRisk} - {thresholds.criticalRisk - 1}</strong>
                </div>

                <div className="scale-legend-row">
                  <div className="scale-legend-label">
                    <span className="legend-color-dot" style={{ background: '#ffb300' }}></span>
                    <span>Moderate Risk</span>
                  </div>
                  <strong>Score 40 - {thresholds.highRisk - 1}</strong>
                </div>

                <div className="scale-legend-row">
                  <div className="scale-legend-label">
                    <span className="legend-color-dot" style={{ background: '#4caf50' }}></span>
                    <span>Low Risk</span>
                  </div>
                  <strong>Score &lt; 40</strong>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(26, 115, 232, 0.06)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(26, 115, 232, 0.2)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark-blue)', marginBottom: '4px' }}>
                📍 Monitored Locations Impact
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Currently {monitoredLocations.filter(m => m.riskScore >= thresholds.criticalRisk).length} of {monitoredLocations.length} monitored key hill passes fall into the <strong>Critical</strong> severity band with these thresholds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: SYSTEM CONFIG ================= */}
      {activeTab === 'config' && (
        <div className="config-layout">
          <div className="config-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
              Platform Automation & Communications
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Manage autonomous escalation queues, multi-channel alerting dispatch, and archival windows.
            </p>

            {/* Email Notifications */}
            <div className="config-toggle-item">
              <div className="config-toggle-info">
                <h4>📧 Email Notifications</h4>
                <p>Send immediate hazard briefings to district magistrates and SDMA personnel.</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.emailNotifications}
                  onChange={() => handleToggleConfig('emailNotifications')}
                />
                <span className="slider-switch"></span>
              </label>
            </div>

            {/* SMS Alerts */}
            <div className="config-toggle-item">
              <div className="config-toggle-info">
                <h4>📱 SMS Alerts</h4>
                <p>Broadcast high-priority SMS alerts through the Telecom Regulatory gateway for vulnerable pin codes.</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.smsAlerts}
                  onChange={() => handleToggleConfig('smsAlerts')}
                />
                <span className="slider-switch"></span>
              </label>
            </div>

            {/* Auto-escalation */}
            <div className="config-toggle-item">
              <div className="config-toggle-info">
                <h4>⚡ Auto-Escalation Engine</h4>
                <p>Escalate unattended alerts to State Emergency Operations Centre (SEOC) after 15 minutes.</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.autoEscalation}
                  onChange={() => handleToggleConfig('autoEscalation')}
                />
                <span className="slider-switch"></span>
              </label>
            </div>

            {/* Dark Mode */}
            <div className="config-toggle-item">
              <div className="config-toggle-info">
                <h4>🌙 Dark Mode Control Room Interface</h4>
                <p>High-contrast visual profile suited for 24/7 disaster management command centers.</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.darkMode}
                  onChange={() => handleToggleConfig('darkMode')}
                />
                <span className="slider-switch"></span>
              </label>
            </div>

            {/* Data Retention Period */}
            <div className="config-toggle-item" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '10px' }}>
              <div className="config-toggle-info">
                <h4>🗄️ Data Retention Period</h4>
                <p>Configures historical telemetry and sensor time-series storage before automated deep archival.</p>
              </div>
              <select
                className="user-filter-select"
                style={{ width: '100%', maxWidth: '320px' }}
                value={config.dataRetention}
                onChange={(e) => setConfig({ ...config, dataRetention: e.target.value })}
              >
                <option value="30 Days">30 Days (Standard buffer)</option>
                <option value="90 Days">90 Days (Quarterly cycle)</option>
                <option value="180 Days">180 Days (Half-Yearly)</option>
                <option value="1 Year">1 Year (Recommended for Seasonal Monsoons)</option>
                <option value="3 Years">3 Years (Statutory Geotechnical Archive)</option>
                <option value="Permanent">Permanent Storage (National Repository)</option>
              </select>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button className="btn-primary" onClick={handleSaveConfig}>
                💾 Save System Configuration
              </button>
            </div>
          </div>

          {/* System Specs Card */}
          <div className="config-side-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)' }}>
              Environment Specifications
            </h3>

            <div>
              <div className="spec-info-row">
                <span className="spec-info-label">Platform Version</span>
                <span className="spec-info-val">v2.4.1 (Stable Release)</span>
              </div>
              <div className="spec-info-row">
                <span className="spec-info-label">AI Inference Engine</span>
                <span className="spec-info-val">TensorFlow 2.15 / GeoAI</span>
              </div>
              <div className="spec-info-row">
                <span className="spec-info-label">IMD Radar Polling</span>
                <span className="spec-info-val">Every 15 min</span>
              </div>
              <div className="spec-info-row">
                <span className="spec-info-label">Active Sensors Online</span>
                <span className="spec-info-val" style={{ color: 'var(--primary-green)' }}>
                  {systemStatus.sensorNetwork ? systemStatus.sensorNetwork.uptime : '98.5%'} Uptime
                </span>
              </div>
              <div className="spec-info-row">
                <span className="spec-info-label">Telemetry Ingestion</span>
                <span className="spec-info-val">MQTT / LoRaWAN Gateways</span>
              </div>
              <div className="spec-info-row">
                <span className="spec-info-label">Cloud Deployment</span>
                <span className="spec-info-val">NIC Meghalaya Data Centre</span>
              </div>
            </div>

            <div style={{ padding: '14px', background: '#f5f7fa', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              🔒 <strong>Compliance Note:</strong> System parameters are configured in accordance with the National Disaster Management Guidelines for Landslides & Snow Avalanches (NDMA-2024).
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><span>➕</span> Add System User</h3>
              <button className="modal-close-btn" onClick={() => setIsAddUserModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tsering Norbu"
                    className="input-field"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Official Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tsering@arunachal.gov.in"
                    className="input-field"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Department / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Geological Survey of India"
                    className="input-field"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Assigned Role *</label>
                  <select
                    className="input-field"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="District Officer">District Officer</option>
                    <option value="Field Officer">Field Officer</option>
                    <option value="Citizen">Citizen</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Initial Account Status</label>
                  <select
                    className="input-field"
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
