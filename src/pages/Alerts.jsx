import { useState } from 'react';
import { activeAlerts as initialActiveAlerts, alertHistory as initialAlertHistory } from '../data/mockData';
import './Alerts.css';

export default function Alerts() {
  // Tab state: 'active' | 'history'
  const [activeTab, setActiveTab] = useState('active');

  // Alerts data state
  const [alerts, setAlerts] = useState(
    initialActiveAlerts.map(alert => ({ ...alert, acknowledged: false }))
  );
  const [history, setHistory] = useState(initialAlertHistory);

  // Filters & Search
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [historySearch, setHistorySearch] = useState('');

  // Modals & Notifications
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Broadcast Form State
  const [broadcastForm, setBroadcastForm] = useState({
    targetState: 'All NER States',
    severity: 'Critical',
    channels: ['SMS Broadcast', 'Sirens & PA Systems', 'NDMA Emergency Cell'],
    customMessage: 'Emergency evacuation advisory: Imminent slope destabilization detected. Proceed to designated safe zones immediately.',
  });

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Stats calculation
  const totalActive = alerts.length;
  const criticalCount = alerts.filter(a => a.type === 'Critical' && !a.acknowledged).length;
  const highCount = alerts.filter(a => a.type === 'High' && !a.acknowledged).length;
  const resolvedCount = history.length;

  // Filtered active alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filterType === 'All' ? true : alert.type.toLowerCase() === filterType.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      alert.location.toLowerCase().includes(query) ||
      alert.state.toLowerCase().includes(query) ||
      alert.message.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  // Filtered history
  const filteredHistory = history.filter(item => {
    const query = historySearch.trim().toLowerCase();
    return (
      query === '' ||
      item.location.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query) ||
      item.date.includes(query) ||
      item.id.toString().includes(query)
    );
  });

  // Action Handlers
  const handleAcknowledge = (id) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    showToast(`✓ Alert #${id} acknowledged. Field teams and SEOC notified.`);
  };

  const handleDismiss = (id) => {
    const alertToDismiss = alerts.find(a => a.id === id);
    if (!alertToDismiss) return;

    // Remove from active alerts
    setAlerts(prev => prev.filter(a => a.id !== id));

    // Append to history as resolved
    const newHistoryItem = {
      id: 100 + alertToDismiss.id + Math.floor(Math.random() * 900),
      location: alertToDismiss.location,
      date: '2026-09-28',
      type: alertToDismiss.type,
      message: `Alert resolved: ${alertToDismiss.message}`,
      status: 'Resolved',
    };
    setHistory(prev => [newHistoryItem, ...prev]);
    showToast(`Alert #${id} for ${alertToDismiss.location} marked as resolved and archived.`);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setBroadcastModalOpen(false);
    showToast(`📢 Emergency alert broadcasted successfully across ${broadcastForm.targetState}!`);
  };

  const handleExportBulletins = () => {
    showToast(`📥 Exporting Northeast Landslide Hazard Bulletin [PDF]...`);
  };

  const emergencyContacts = [
    { name: 'NDRF Disaster Helpline', number: '1078 / 011-24363260', tag: 'Central 24x7', icon: '🛡️' },
    { name: 'State Disaster Mgmt (SDMA)', number: '1070', tag: 'State Emergency Cell', icon: '🏛️' },
    { name: 'Unified Emergency Services', number: '112', tag: 'Police / Fire / Ambulance', icon: '🚨' },
    { name: 'BhuRakshak AI Sensor SOC', number: '1800-425-BHU', tag: 'Toll-Free Telemetry Desk', icon: '📡' },
  ];

  const safeZones = [
    {
      name: 'Silchar District Indoor Complex',
      location: 'Cachar, Assam',
      distance: '3.2 km',
      capacity: '1,200 persons',
      status: 'Ready & Stocked',
    },
    {
      name: 'Cherrapunji Community Relief Centre',
      location: 'East Khasi Hills, Meghalaya',
      distance: '1.8 km',
      capacity: '850 persons',
      status: 'Medical Camp Active',
    },
    {
      name: 'Gangtok Sports Pavilion Safe Zone',
      location: 'East Sikkim, Sikkim',
      distance: '4.1 km',
      capacity: '2,500 persons',
      status: 'Helipad Functional',
    },
    {
      name: 'Kohima Town Hall Emergency Center',
      location: 'Kohima, Nagaland',
      distance: '2.5 km',
      capacity: '1,000 persons',
      status: 'Power Backup Online',
    },
  ];

  return (
    <div className="alerts-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="alerts-toast">
          <span>{toastMessage}</span>
          <button className="toast-close-btn" onClick={() => setToastMessage(null)}>
            ✕
          </button>
        </div>
      )}

      {/* 1. Page Header */}
      <header className="alerts-header">
        <div className="alerts-header-left">
          <div className="alerts-header-icon">🚨</div>
          <div className="alerts-header-title">
            <h1>Alert Management</h1>
            <p>Real-Time Landslide Early Warning, Threat Response & Hazard Mitigation Protocols</p>
          </div>
        </div>

        <div className="alerts-header-actions">
          <div className="live-indicator-pill">
            <span className="pulse-dot"></span>
            LIVE MONITORING ACTIVE
          </div>

          <button
            className="btn-outline-action"
            onClick={handleExportBulletins}
            title="Download latest landslide bulletin"
          >
            📄 Export Bulletin
          </button>

          <button
            className="btn-broadcast"
            onClick={() => setBroadcastModalOpen(true)}
          >
            📢 Broadcast Emergency Alert
          </button>
        </div>
      </header>

      {/* 2. Alert Stats Row (4 cards) */}
      <div className="alerts-stats-grid">
        {/* Total Active Alerts */}
        <div className="stat-card stat-red">
          <div className="stat-info">
            <span className="stat-title">Total Active Alerts</span>
            <div className="stat-number">{totalActive}</div>
            <span className="stat-subtext">⚠️ Active monitored zones</span>
          </div>
          <div className="stat-icon-wrapper">🔔</div>
        </div>

        {/* Critical Alerts */}
        <div className="stat-card stat-dark-red">
          <div className="stat-info">
            <span className="stat-title">Critical Alerts</span>
            <div className="stat-number">{criticalCount}</div>
            <span className="stat-subtext">🚨 Immediate evacuation advised</span>
          </div>
          <div className="stat-icon-wrapper">🚨</div>
        </div>

        {/* High Priority */}
        <div className="stat-card stat-orange">
          <div className="stat-info">
            <span className="stat-title">High Priority</span>
            <div className="stat-number">{highCount}</div>
            <span className="stat-subtext">⚡ Heightened surveillance</span>
          </div>
          <div className="stat-icon-wrapper">🔶</div>
        </div>

        {/* Resolved Today */}
        <div className="stat-card stat-green">
          <div className="stat-info">
            <span className="stat-title">Resolved Today</span>
            <div className="stat-number">{resolvedCount}</div>
            <span className="stat-subtext">✅ Threats mitigated & cleared</span>
          </div>
          <div className="stat-icon-wrapper">🛡️</div>
        </div>
      </div>

      {/* 3. Tab Navigation */}
      <div className="alerts-tabs-container">
        <div className="alerts-tabs-group">
          <button
            className={`alerts-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <span>Active Alerts</span>
            <span className="tab-badge tab-badge-active">{alerts.length}</span>
          </button>

          <button
            className={`alerts-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span>Alert History</span>
            <span className="tab-badge tab-badge-history">{history.length}</span>
          </button>
        </div>
      </div>

      {/* 4. Active Alerts Tab Content */}
      {activeTab === 'active' && (
        <div className="alerts-list-container">
          {/* Emergency Banner at top for critical alerts */}
          {criticalCount > 0 && (
            <div className="emergency-banner">
              <div className="emergency-banner-content">
                <div className="emergency-beacon">⚠️</div>
                <div className="emergency-banner-text">
                  <h3>CRITICAL HAZARD WARNING: {criticalCount} High-Risk Landslide Sectors Active</h3>
                  <p>
                    Rainfall threshold exceeded 350mm/24hr in East Khasi Hills and Cachar Valley.
                    National Disaster Management Authority (NDMA) & state response forces mobilized.
                  </p>
                </div>
              </div>
              <div className="emergency-banner-actions">
                <button
                  className="btn-emergency-action"
                  onClick={() => {
                    const recSection = document.getElementById('recommendations-panel');
                    if (recSection) recSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Evacuation Protocols ⬇
                </button>
                <button
                  className="btn-emergency-secondary"
                  onClick={() => {
                    setAlerts(prev => prev.map(a => (a.type === 'Critical' ? { ...a, acknowledged: true } : a)));
                    showToast('All critical alerts acknowledged by incident commander.');
                  }}
                >
                  Acknowledge All
                </button>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="alerts-filter-bar">
            <div className="filter-pills-group">
              <span className="filter-label">Filter Severity:</span>
              <button
                className={`filter-pill ${filterType === 'All' ? 'active' : ''}`}
                onClick={() => setFilterType('All')}
              >
                All ({alerts.length})
              </button>
              <button
                className={`filter-pill pill-critical ${filterType === 'Critical' ? 'active' : ''}`}
                onClick={() => setFilterType('Critical')}
              >
                🔴 Critical ({alerts.filter(a => a.type === 'Critical').length})
              </button>
              <button
                className={`filter-pill pill-high ${filterType === 'High' ? 'active' : ''}`}
                onClick={() => setFilterType('High')}
              >
                🟠 High ({alerts.filter(a => a.type === 'High').length})
              </button>
              <button
                className={`filter-pill pill-moderate ${filterType === 'Moderate' ? 'active' : ''}`}
                onClick={() => setFilterType('Moderate')}
              >
                🟡 Moderate ({alerts.filter(a => a.type === 'Moderate').length})
              </button>
            </div>

            <div className="filter-search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search location, state, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Alerts List */}
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => {
              const isCritical = alert.type === 'Critical';
              const isHigh = alert.type === 'High';
              const severityClass = isCritical
                ? 'severity-critical'
                : isHigh
                ? 'severity-high'
                : 'severity-moderate';

              return (
                <div
                  key={alert.id}
                  className={`alert-card ${severityClass} ${
                    isCritical && !alert.acknowledged ? 'pulsing' : ''
                  } ${alert.acknowledged ? 'acknowledged-card' : ''}`}
                >
                  <div className="alert-card-top">
                    <div className="alert-location-wrapper">
                      <div className="alert-type-icon">
                        {isCritical ? '🚨' : isHigh ? '⚠️' : '⚡'}
                      </div>
                      <div className="alert-title-details">
                        <div className="alert-location-name">
                          <span>📍 {alert.location}</span>
                          <span className="alert-state-badge">{alert.state}</span>
                          {alert.isNew && <span className="badge-new-alert">NEW ALERT</span>}
                          {alert.acknowledged && (
                            <span className="acknowledged-status-pill">
                              ✓ Acknowledged
                            </span>
                          )}
                        </div>
                        <div className="alert-time-badge">
                          <span>⏱️ {alert.time}</span>
                          <span>•</span>
                          <span>Source: Sensor Telemetry & IMD Radar</span>
                        </div>
                      </div>
                    </div>

                    <div className="alert-badges-wrapper">
                      <div
                        className={`risk-score-badge ${
                          alert.riskScore >= 80
                            ? 'risk-critical'
                            : alert.riskScore >= 60
                            ? 'risk-high'
                            : 'risk-moderate'
                        }`}
                      >
                        <span>Risk Score:</span>
                        <strong>{alert.riskScore} / 100</strong>
                      </div>

                      <span
                        className={`severity-pill-badge ${
                          isCritical
                            ? 'sev-critical'
                            : isHigh
                            ? 'sev-high'
                            : 'sev-moderate'
                        }`}
                      >
                        {alert.type}
                      </span>
                    </div>
                  </div>

                  <div className="alert-card-message">
                    {alert.message}
                  </div>

                  <div className="alert-card-actions">
                    <button
                      className="btn-card-action btn-view-details"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      📊 View Details & Telemetry
                    </button>

                    <button
                      className={`btn-card-action btn-acknowledge ${
                        alert.acknowledged ? 'btn-acknowledged' : ''
                      }`}
                      onClick={() => !alert.acknowledged && handleAcknowledge(alert.id)}
                      disabled={alert.acknowledged}
                    >
                      {alert.acknowledged ? '✓ Acknowledged' : '👁️ Acknowledge'}
                    </button>

                    <button
                      className="btn-card-action btn-dismiss"
                      onClick={() => handleDismiss(alert.id)}
                      title="Resolve and archive this alert"
                    >
                      ✕ Dismiss
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-alerts-state">
              <div className="empty-icon">🛡️</div>
              <h3>No Alerts Found Matching Your Criteria</h3>
              <p>Try resetting your severity filters or clearing the search query.</p>
              <button
                className="btn-outline-action"
                onClick={() => {
                  setFilterType('All');
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Alert History Tab Content */}
      {activeTab === 'history' && (
        <div className="history-container">
          {/* History Search & Stats Header */}
          <div className="alerts-filter-bar">
            <div className="filter-pills-group">
              <span className="filter-label">Archived Landslide Incident Logs ({filteredHistory.length})</span>
            </div>

            <div className="filter-search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search history by location, ID, date..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />
              {historySearch && (
                <button className="search-clear-btn" onClick={() => setHistorySearch('')}>
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="history-card">
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Severity Type</th>
                    <th>Incident Summary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map(item => (
                    <tr key={item.id}>
                      <td className="history-id-cell">#{item.id}</td>
                      <td className="history-date-cell">📅 {item.date}</td>
                      <td className="history-location-cell">📍 {item.location}</td>
                      <td>
                        <span
                          className={`severity-pill-badge ${
                            item.type === 'Critical'
                              ? 'sev-critical'
                              : item.type === 'High'
                              ? 'sev-high'
                              : 'sev-moderate'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="history-message-cell">{item.message}</td>
                      <td>
                        <span className="status-badge-resolved">
                          ✓ {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '36px' }}>
                        No incident history records found matching "{historySearch}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Emergency Recommendations Panel */}
      <section className="emergency-recommendations-panel" id="recommendations-panel">
        <div className="panel-header">
          <div className="panel-header-title">
            <div className="panel-header-icon">🧭</div>
            <div>
              <h2>Emergency Response & Preparedness Guidelines</h2>
              <p>Standard Operating Procedures approved by NDMA & North Eastern Council</p>
            </div>
          </div>
          <div className="protocol-badge">
            <span>🛡️ SOP LEVEL-4 ACTIVATED</span>
          </div>
        </div>

        {/* Top Grid: Evacuation Guidelines & Emergency Contacts */}
        <div className="recommendations-grid">
          {/* Evacuation Guidelines */}
          <div className="rec-subcard">
            <h3 className="rec-subcard-title">
              <span>🚶</span> Evacuation Guidelines
            </h3>
            <div className="guideline-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-text">
                  <h4>Immediate Ridge-Line Evacuation</h4>
                  <p>Inhabitants within 500m of designated slope failure zones must vacate downhill dwellings to upland relief camps.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-text">
                  <h4>Avoid Debris Paths & River Gullies</h4>
                  <p>Never take refuge in natural drainage courses, dry river beds, or steep ravines prone to flash mudflows.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-text">
                  <h4>Secure Utility Inlets</h4>
                  <p>Shut off main electrical breaker, LPG gas regulators, and primary water lines prior to evacuation.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-text">
                  <h4>Follow Designated Collector Routes</h4>
                  <p>Follow marked evacuation arterial corridors; avoid bypasses and unpaved hill cuts during heavy downpours.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="rec-subcard">
            <h3 className="rec-subcard-title">
              <span>📞</span> 24x7 Emergency Helplines & Control Rooms
            </h3>
            <div className="contacts-grid">
              {emergencyContacts.map((contact, idx) => (
                <div key={idx} className="contact-item">
                  <div className="contact-info">
                    <h5>{contact.icon} {contact.name}</h5>
                    <span>{contact.tag}</span>
                  </div>
                  <div className="contact-number">{contact.number}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>📡 VHF Radio Reserve Frequency:</strong>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Assam/Meghalaya Sector: 146.520 MHz • Sikkim/Arunachal: 147.240 MHz
              </div>
            </div>
          </div>
        </div>

        {/* Nearest Safe Zones */}
        <div className="rec-subcard" style={{ background: 'transparent', padding: '0', border: 'none' }}>
          <h3 className="rec-subcard-title" style={{ marginBottom: '14px' }}>
            <span>🏕️</span> Nearest Safe Zones & Relief Shelters
          </h3>
          <div className="safe-zones-grid">
            {safeZones.map((zone, idx) => (
              <div key={idx} className="safe-zone-card">
                <div className="zone-header">
                  <h5>{zone.name}</h5>
                  <span className="zone-distance">{zone.distance}</span>
                </div>
                <div className="zone-meta">
                  <span>📍 {zone.location}</span>
                  <span>👥 {zone.capacity}</span>
                </div>
                <span className="zone-tag">✓ {zone.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Do's and Don'ts List */}
        <div className="dos-donts-container">
          {/* DO's */}
          <div className="dos-column">
            <div className="dos-header">
              <span>✅</span>
              <span>DO's (Actionable Best Practices)</span>
            </div>
            <div className="dos-list">
              <div className="dos-item">
                <span className="dos-icon">✔</span>
                <span>Listen continuously to IMD weather radar updates and local SDMA announcements.</span>
              </div>
              <div className="dos-item">
                <span className="dos-icon">✔</span>
                <span>Watch for sudden changes in spring water flow (murky water or sudden cessation of trickles).</span>
              </div>
              <div className="dos-item">
                <span className="dos-icon">✔</span>
                <span>Prepare an emergency Go-Bag with waterproof torch, dry rations, first-aid, and medicines.</span>
              </div>
              <div className="dos-item">
                <span className="dos-icon">✔</span>
                <span>Assist elderly citizens, children, and differently-abled neighbors during orderly retreat.</span>
              </div>
              <div className="dos-item">
                <span className="dos-icon">✔</span>
                <span>Report newly spotted ground fissures, leaning power poles, or tree tilting to 112 immediately.</span>
              </div>
            </div>
          </div>

          {/* DON'Ts */}
          <div className="donts-column">
            <div className="donts-header">
              <span>❌</span>
              <span>DON'Ts (Hazard Avoidance)</span>
            </div>
            <div className="donts-list">
              <div className="donts-item">
                <span className="donts-icon">✖</span>
                <span>Do NOT attempt to drive or walk through active slurry, rushing mud, or submerged culverts.</span>
              </div>
              <div className="donts-item">
                <span className="donts-icon">✖</span>
                <span>Do NOT take shelter underneath steep retaining walls, unsupported masonry, or cliff faces.</span>
              </div>
              <div className="donts-item">
                <span className="donts-icon">✖</span>
                <span>Do NOT re-enter evacuated residences until structural stability is certified by PWD engineers.</span>
              </div>
              <div className="donts-item">
                <span className="donts-icon">✖</span>
                <span>Do NOT stay near river banks during heavy upstream downpours due to sudden landslide dam breach.</span>
              </div>
              <div className="donts-item">
                <span className="donts-icon">✖</span>
                <span>Do NOT forward unverified rumors or panic-inducing misinformation across social media channels.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. View Details Modal */}
      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className={`severity-pill-badge ${
                      selectedAlert.type === 'Critical'
                        ? 'sev-critical'
                        : selectedAlert.type === 'High'
                        ? 'sev-high'
                        : 'sev-moderate'
                    }`}
                  >
                    {selectedAlert.type} ALERT
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Alert ID #{selectedAlert.id}
                  </span>
                </div>
                <h2>📍 {selectedAlert.location}, {selectedAlert.state}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedAlert(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Telemetry Metrics */}
              <div className="modal-metric-cards">
                <div className="modal-metric-card">
                  <span className="modal-metric-label">Landslide Risk Score</span>
                  <div className="modal-metric-val" style={{ color: selectedAlert.riskScore >= 80 ? '#d32f2f' : '#f57c00' }}>
                    {selectedAlert.riskScore} / 100
                  </div>
                  <span className="modal-metric-sub">AI Multimodal Hazard Model</span>
                </div>

                <div className="modal-metric-card">
                  <span className="modal-metric-label">24h Cumulative Rain</span>
                  <div className="modal-metric-val" style={{ color: '#0288d1' }}>
                    {selectedAlert.riskScore > 80 ? '380 mm' : '210 mm'}
                  </div>
                  <span className="modal-metric-sub">Extreme Threshold &gt; 250mm</span>
                </div>

                <div className="modal-metric-card">
                  <span className="modal-metric-label">Soil Pore Saturation</span>
                  <div className="modal-metric-val" style={{ color: '#2e7d32' }}>
                    {selectedAlert.riskScore > 80 ? '94.2 %' : '76.8 %'}
                  </div>
                  <span className="modal-metric-sub">Sensor Status: High Saturation</span>
                </div>
              </div>

              {/* Alert Advisory Summary */}
              <div>
                <div className="modal-section-title">
                  <span>🚨</span> Sensor Advisory & Ground Condition
                </div>
                <div className="modal-advisory-box">
                  <strong>Trigger Observation: </strong>
                  {selectedAlert.message} Slope destabilization index has surged due to antecedent precipitation.
                  Ground displacement velocity measured at +3.1 mm/day along the critical shear plane.
                </div>
              </div>

              {/* Action Checklist */}
              <div>
                <div className="modal-section-title">
                  <span>📋</span> Incident Response Protocol Checklist
                </div>
                <div className="modal-checklist">
                  <div className="modal-checklist-item done">
                    <span>✅</span>
                    <span>Automated SMS Flash Warning issued to 4,800 registered local cell numbers.</span>
                  </div>
                  <div className="modal-checklist-item done">
                    <span>✅</span>
                    <span>State Emergency Operations Centre (SEOC) alert dispatch acknowledged.</span>
                  </div>
                  <div className="modal-checklist-item done">
                    <span>✅</span>
                    <span>Traffic advisory broadcasted on NH-44 / arterial hill corridors.</span>
                  </div>
                  <div className="modal-checklist-item">
                    <span>🔄</span>
                    <span>NDRF Rapid Deployment Unit moving to sector staging grounds.</span>
                  </div>
                  <div className="modal-checklist-item">
                    <span>⏳</span>
                    <span>Relief shelter intake counters initialized and staffed.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {!selectedAlert.acknowledged && (
                <button
                  className="btn-card-action btn-acknowledge"
                  onClick={() => {
                    handleAcknowledge(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                >
                  👁️ Acknowledge Alert
                </button>
              )}
              <button
                className="btn-broadcast"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => {
                  setSelectedAlert(null);
                  setBroadcastModalOpen(true);
                }}
              >
                📢 Broadcast Flash Siren
              </button>
              <button
                className="btn-outline-action"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Broadcast Emergency Alert Modal */}
      {broadcastModalOpen && (
        <div className="modal-overlay" onClick={() => setBroadcastModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="severity-pill-badge sev-critical">GOVERNMENT AUTHORIZED</span>
                </div>
                <h2>📢 Trigger Emergency Mass Broadcast</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setBroadcastModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                      Target State / Region:
                    </label>
                    <select
                      className="input-field"
                      value={broadcastForm.targetState}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, targetState: e.target.value })}
                    >
                      <option value="All NER States">All 8 Northeast States (Regional Emergency)</option>
                      <option value="Meghalaya (East Khasi Hills)">Meghalaya (East Khasi Hills / Cherrapunji)</option>
                      <option value="Assam (Barak Valley / Silchar)">Assam (Barak Valley / Silchar Corridor)</option>
                      <option value="Sikkim (Gangtok / Nathula)">Sikkim (East Sikkim / Nathula Pass)</option>
                      <option value="Nagaland (Kohima Ridge)">Nagaland (Kohima / Dimapur)</option>
                      <option value="Mizoram (Aizawl Region)">Mizoram (Aizawl - Lunglei)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                      Severity Classification:
                    </label>
                    <select
                      className="input-field"
                      value={broadcastForm.severity}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, severity: e.target.value })}
                    >
                      <option value="Critical">🔴 Critical (Immediate Evacuation Advisory)</option>
                      <option value="High">🟠 High Priority (Warning - Limit Travel)</option>
                      <option value="Watch">🟡 Advisory Watch (Precautionary)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                      Broadcast Channels Activated:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                      {['Cellular Broadcast (SMS)', 'Acoustic Sirens & PA System', 'NDMA / CAP Gateway', 'State TV & Radio Relay'].map((chan, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#334155' }}>
                          <input type="checkbox" defaultChecked readOnly />
                          <span>{chan}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                      Public Warning Message Text:
                    </label>
                    <textarea
                      className="input-field"
                      rows="3"
                      value={broadcastForm.customMessage}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, customMessage: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline-action"
                  onClick={() => setBroadcastModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-broadcast"
                >
                  🚨 Dispatch Emergency Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
