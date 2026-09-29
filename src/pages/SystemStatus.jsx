import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { systemStatus, monitoredLocations, predictionFactors } from '../data/mockData';
import './SystemStatus.css';

export default function SystemStatus() {
  const { id } = useParams(); // URL params support

  // Services state initialized from mockData's systemStatus
  const [services, setServices] = useState(() => {
    return Object.entries(systemStatus).map(([key, item]) => {
      let icon = '⚙️';
      let category = 'Core Platform';
      let endpoint = 'https://api.bhurakshak.gov.in';

      if (key === 'apiServer') { icon = '🌐'; category = 'API Gateway'; endpoint = '/api/v1/health'; }
      else if (key === 'database') { icon = '🗄️'; category = 'Data Storage'; endpoint = 'postgres-ner-primary'; }
      else if (key === 'aiEngine') { icon = '🤖'; category = 'Machine Learning'; endpoint = 'model-inference-worker-3'; }
      else if (key === 'sensorNetwork') { icon = '📡'; category = 'IoT Telemetry'; endpoint = 'lora-hub-ner-gateway'; }
      else if (key === 'notifications') { icon = '🔔'; category = 'Messaging'; endpoint = 'sms-push-dispatch'; }
      else if (key === 'gisService') { icon = '🗺️'; category = 'Geospatial'; endpoint = 'bhuvan-gis-wms'; }
      else if (key === 'imdFeed') { icon = '🌧️'; category = 'External Ingestion'; endpoint = 'imd.gov.in/radar-feed'; }
      else if (key === 'storage') { icon = '☁️'; category = 'Object Storage'; endpoint = 's3-bucket-satellite-tiles'; }

      return {
        key,
        name: item.name,
        status: item.status,
        uptime: item.uptime,
        latency: item.latency,
        icon,
        category,
        endpoint,
        lastChecked: 'Just now',
        numericLatency: parseInt(item.latency) || 50,
        uptimePercent: parseFloat(item.uptime) || 99.9
      };
    });
  });

  // Last refresh timestamp
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // User Preferences State
  const [themePreference, setThemePreference] = useState('Light');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('30s');
  const [notificationPrefs, setNotificationPrefs] = useState({
    criticalPushes: true,
    smsFailover: true,
    sensorAnomalyAudio: false,
    dailyDigest: true
  });

  const [pingFeedback, setPingFeedback] = useState(null);

  // Derive overall status
  const hasOffline = services.some(s => s.status.toLowerCase() === 'offline');
  const hasDegraded = services.some(s => s.status.toLowerCase() === 'degraded');
  const overallStatus = hasOffline ? 'Degraded Performance' : (hasDegraded ? 'Degraded Performance' : 'All Systems Operational');
  const overallClass = hasOffline ? 'offline' : (hasDegraded ? 'degraded' : 'operational');

  // Counts
  const onlineCount = services.filter(s => s.status.toLowerCase() === 'online').length;
  const degradedCount = services.filter(s => s.status.toLowerCase() === 'degraded').length;
  const offlineCount = services.filter(s => s.status.toLowerCase() === 'offline').length;
  const avgLatency = Math.round(services.reduce((acc, s) => acc + s.numericLatency, 0) / services.length);

  // Manual Ping simulation
  const handlePing = (serviceName) => {
    setPingFeedback(`Pinging ${serviceName}...`);
    setTimeout(() => {
      setPingFeedback(`✅ ${serviceName} responded in ${Math.floor(Math.random() * 30 + 15)}ms with HTTP 200 OK.`);
      setTimeout(() => setPingFeedback(null), 4000);
    }, 600);
  };

  // Full Refresh
  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsRefreshing(false);
      setPingFeedback('All 8 nodes and integrations re-polled successfully.');
      setTimeout(() => setPingFeedback(null), 3000);
    }, 700);
  };

  // Resolve degraded service test toggle
  const handleResolveDegraded = (serviceKey) => {
    setServices(prev => prev.map(s => {
      if (s.key === serviceKey) {
        const nextStatus = s.status === 'Degraded' ? 'Online' : 'Degraded';
        return {
          ...s,
          status: nextStatus,
          latency: nextStatus === 'Online' ? '68ms' : '320ms',
          numericLatency: nextStatus === 'Online' ? 68 : 320
        };
      }
      return s;
    }));
  };

  const handleTogglePref = (key) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="system-status-container">
      {/* Page Header */}
      <div className="status-header">
        <div className="status-header-title">
          <div className="status-header-icon">⚙️</div>
          <div>
            <h1>System Health & Status</h1>
            <p>Real-time cluster telemetry, microservices latency, and external meteorological link uptime</p>
          </div>
        </div>

        <div className="status-header-actions">
          <div className="refresh-indicator">
            <span className="pulse-dot-mini"></span>
            <span>Live telemetry active • Updated at {lastRefreshed}</span>
          </div>
          <button
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.88rem' }}
            onClick={handleRefreshAll}
            disabled={isRefreshing}
          >
            {isRefreshing ? '⏳ Polling...' : '🔄 Refresh Health'}
          </button>
        </div>
      </div>

      {/* Ping Feedback Banner */}
      {pingFeedback && (
        <div style={{
          padding: '12px 18px',
          background: '#e3f2fd',
          border: '1px solid #90caf9',
          color: 'var(--dark-blue)',
          borderRadius: '10px',
          marginBottom: '20px',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{pingFeedback}</span>
          <button
            onClick={() => setPingFeedback(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Overall Status Banner */}
      <div className={`overall-status-banner ${overallClass}`}>
        <div className="banner-left">
          <div className="banner-pulse-icon">
            {overallClass === 'operational' ? '🟢' : '🟡'}
          </div>
          <div className="banner-text">
            <h2>{overallStatus}</h2>
            <p>
              {overallClass === 'operational'
                ? 'All primary microservices, geospatial compute layers, and telemetry relays are functioning within nominal parameters.'
                : 'Sensor telemetry network experiencing localized packet latency in high-altitude zones. AI inference and alert engines are fully operational.'}
            </p>
          </div>
        </div>

        <div className="banner-stats">
          <div className="banner-stat-box">
            <div className="stat-box-val" style={{ color: 'var(--primary-green)' }}>
              {onlineCount} / {services.length}
            </div>
            <div className="stat-box-lbl">Online Nodes</div>
          </div>

          <div className="banner-stat-box">
            <div className="stat-box-val" style={{ color: degradedCount > 0 ? '#f57f17' : 'var(--text-dark)' }}>
              {degradedCount}
            </div>
            <div className="stat-box-lbl">Degraded</div>
          </div>

          <div className="banner-stat-box">
            <div className="stat-box-val">
              {avgLatency}ms
            </div>
            <div className="stat-box-lbl">Avg Latency</div>
          </div>

          <div className="banner-stat-box">
            <div className="stat-box-val" style={{ color: 'var(--primary-blue)' }}>
              99.94%
            </div>
            <div className="stat-box-lbl">30-Day SLA</div>
          </div>
        </div>
      </div>

      {/* Service Status Cards Grid */}
      <div className="section-heading-row">
        <h2>
          <span>🧩</span> Core Microservices & Pipeline Health
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Active monitored locations: <strong>{monitoredLocations.length} regional sectors</strong>
        </span>
      </div>

      <div className="service-grid">
        {services.map((service) => {
          const statusLower = service.status.toLowerCase();
          const latencyNum = service.numericLatency;
          const latencyClass = latencyNum < 80 ? 'fast' : (latencyNum < 250 ? 'medium' : 'slow');

          return (
            <div key={service.key} className="service-card">
              <div>
                <div className="service-card-header">
                  <div className="service-title-wrap">
                    <div className="service-symbol">{service.icon}</div>
                    <div>
                      <div className="service-name">{service.name}</div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <span className={`service-status-pill ${statusLower}`}>
                    <span className={`status-pulse-dot ${statusLower}`}></span>
                    {service.status}
                  </span>
                </div>

                {/* Uptime Progress */}
                <div className="uptime-section">
                  <div className="uptime-label-row">
                    <span>Uptime SLA</span>
                    <span className="uptime-val">{service.uptime}</span>
                  </div>
                  <div className="uptime-bar-track">
                    <div
                      className={`uptime-bar-fill ${statusLower}`}
                      style={{ width: `${Math.min(100, service.uptimePercent)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="service-card-meta">
                  <div className={`latency-metric ${latencyClass}`}>
                    <span>⚡ Latency:</span>
                    <span>{service.latency}</span>
                  </div>
                  <button
                    className="ping-btn"
                    onClick={() => handlePing(service.name)}
                    title="Send immediate diagnostic ping packet"
                  >
                    📡 Ping
                  </button>
                </div>

                {service.key === 'sensorNetwork' && (
                  <div style={{ marginTop: '10px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleResolveDegraded(service.key)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '0.74rem',
                        color: 'var(--primary-blue)',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      {service.status === 'Degraded' ? '🔧 Test Simulate Reconnect' : '⚠️ Simulate Network Degrade'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connectivity Table */}
      <div className="section-heading-row">
        <h2>
          <span>📋</span> Comprehensive Endpoint & Connectivity Matrix
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Target: North Eastern Regional Gateway Clusters
        </span>
      </div>

      <div className="connectivity-table-wrap">
        <table className="connectivity-table">
          <thead>
            <tr>
              <th>Service / Subsystem</th>
              <th>Category</th>
              <th>Endpoint / Gateway</th>
              <th>Status</th>
              <th>Uptime (30d)</th>
              <th>Latency</th>
              <th>Last Checked</th>
              <th style={{ textAlign: 'center' }}>Diagnostics</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const statusLower = service.status.toLowerCase();
              return (
                <tr key={service.key}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <span>{service.icon}</span>
                      <span>{service.name}</span>
                    </div>
                  </td>

                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {service.category}
                  </td>

                  <td>
                    <code style={{
                      background: 'rgba(0, 0, 0, 0.05)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace'
                    }}>
                      {service.endpoint}
                    </code>
                  </td>

                  <td>
                    <span className={`service-status-pill ${statusLower}`}>
                      <span className={`status-pulse-dot ${statusLower}`}></span>
                      {service.status}
                    </span>
                  </td>

                  <td style={{ fontWeight: 600 }}>{service.uptime}</td>

                  <td>
                    <span style={{
                      fontWeight: 600,
                      color: service.numericLatency < 80 ? 'var(--primary-green)' : (service.numericLatency < 250 ? '#f57f17' : 'var(--danger)')
                    }}>
                      {service.latency}
                    </span>
                  </td>

                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {service.lastChecked}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="ping-btn"
                      onClick={() => handlePing(service.name)}
                    >
                      Run Healthcheck
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* User Preferences Section */}
      <div className="preferences-card">
        <div className="section-heading-row" style={{ marginBottom: '8px' }}>
          <h2>
            <span>🎛️</span> User & Control Room Preferences
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Customized for current workstation session
          </span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Configure visual parameters, localized languages, audio warning klaxons, and telemetry update cadences.
        </p>

        <div className="preferences-grid">
          {/* Theme Selector */}
          <div className="pref-box">
            <div className="pref-box-title">
              <span>🎨</span> Display Theme
            </div>
            <div className="pref-box-desc">Select UI contrast suitable for current lighting environment.</div>
            <div className="theme-options-row">
              {['Light', 'Dark', 'Contrast'].map((mode) => (
                <button
                  key={mode}
                  className={`theme-opt-btn ${themePreference === mode ? 'active' : ''}`}
                  onClick={() => setThemePreference(mode)}
                >
                  {mode === 'Light' && '☀️ '}
                  {mode === 'Dark' && '🌙 '}
                  {mode === 'Contrast' && '⚡ '}
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="pref-box">
            <div className="pref-box-title">
              <span>🌐</span> Regional Language
            </div>
            <div className="pref-box-desc">Interface translation for North-Eastern administrative desks.</div>
            <select
              className="user-filter-select"
              style={{ width: '100%' }}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="English">English (National Official)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Assamese">অসমীয়া (Assamese)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Mizo">Mizo ṭawng (Mizoram)</option>
              <option value="Manipuri">মৈতৈলোন্ (Manipuri)</option>
            </select>
          </div>

          {/* Auto Refresh */}
          <div className="pref-box">
            <div className="pref-box-title">
              <span>⏱️</span> Telemetry Polling Rate
            </div>
            <div className="pref-box-desc">Frequency of automated websocket / REST health requests.</div>
            <select
              className="user-filter-select"
              style={{ width: '100%' }}
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(e.target.value)}
            >
              <option value="15s">Every 15 Seconds (Emergency Surge)</option>
              <option value="30s">Every 30 Seconds (Default Active)</option>
              <option value="60s">Every 60 Seconds (Standard Ops)</option>
              <option value="5m">Every 5 Minutes (Low Bandwidth)</option>
              <option value="manual">Manual Refresh Only</option>
            </select>
          </div>

          {/* Notifications Checklist */}
          <div className="pref-box">
            <div className="pref-box-title">
              <span>🔔</span> Station Notification Toggles
            </div>
            <div className="pref-box-desc">Immediate alerts to sound on this workstation.</div>
            <div className="notif-checkbox-group">
              <label className="notif-checkbox-label">
                <input
                  type="checkbox"
                  checked={notificationPrefs.criticalPushes}
                  onChange={() => handleTogglePref('criticalPushes')}
                />
                <span>Red Alert Audio Klaxon</span>
              </label>

              <label className="notif-checkbox-label">
                <input
                  type="checkbox"
                  checked={notificationPrefs.smsFailover}
                  onChange={() => handleTogglePref('smsFailover')}
                />
                <span>SMS Failover for Broken Webhooks</span>
              </label>

              <label className="notif-checkbox-label">
                <input
                  type="checkbox"
                  checked={notificationPrefs.dailyDigest}
                  onChange={() => handleTogglePref('dailyDigest')}
                />
                <span>Automatic 08:00 AM SDMA Digest</span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Link to="/admin-settings" className="btn-secondary">
            👥 Configure Admin Thresholds
          </Link>
          <button
            className="btn-primary"
            onClick={() => {
              setPingFeedback('Workstation preferences saved to local profile.');
              setTimeout(() => setPingFeedback(null), 3000);
            }}
          >
            💾 Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
