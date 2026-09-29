import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  dashboardStats,
  monitoredLocations,
  activeAlerts,
  recentActivities,
  riskTrends
} from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [hoveredBar, setHoveredBar] = useState(null);

  // Update current time display
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setCurrentDateTime(now.toLocaleDateString('en-IN', options));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Quick navigation items
  const quickActions = [
    { title: 'Risk Map', subtitle: 'GIS 3D Layer', path: '/risk-map', icon: '🗺️', color: 'blue' },
    { title: 'IMD Weather', subtitle: 'Live Radar & Sat', path: '/imd-monitoring', icon: '🌧️', color: 'cyan' },
    { title: 'Sensors', subtitle: 'Telemetry Nodes', path: '/sensor-monitoring', icon: '📡', color: 'green' },
    { title: 'AI Prediction', subtitle: 'Neural Forecast', path: '/ai-prediction', icon: '🤖', color: 'purple' },
    { title: 'Alerts Hub', subtitle: 'Emergency SOP', path: '/alerts', icon: '🚨', color: 'red' },
    { title: 'Citizen Reports', subtitle: 'Crowdsourced', path: '/citizen-reports', icon: '📋', color: 'amber' },
  ];

  // Helper to determine bar height and styling
  const getRiskBarStyle = (avgRisk) => {
    if (avgRisk >= 75) return 'bar-critical';
    if (avgRisk >= 60) return 'bar-high';
    if (avgRisk >= 45) return 'bar-moderate';
    return 'bar-normal';
  };

  // Helper to get risk level badge class
  const getRiskBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'badge badge-danger';
      case 'high':
        return 'badge badge-warning';
      case 'moderate':
        return 'badge badge-info';
      case 'low':
      case 'very low':
        return 'badge badge-success';
      default:
        return 'badge badge-info';
    }
  };

  // Helper to get progress bar color for risk scores
  const getProgressBarClass = (score) => {
    if (score >= 80) return 'bar-danger';
    if (score >= 60) return 'bar-warning';
    if (score >= 40) return 'bar-moderate';
    return 'bar-low';
  };

  // Top 6 locations and top 4 active alerts
  const topLocations = monitoredLocations.slice(0, 6);
  const priorityAlerts = activeAlerts.slice(0, 4);

  return (
    <div className="dashboard-container fade-in">
      {/* 1. Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="banner-badge">
            <span className="pulse-dot"></span>
            <span>NER Disaster Preparedness Network • Live Operational Mode</span>
          </div>

          <h1 className="welcome-title">Welcome back, Admin!</h1>

          <div className="welcome-datetime">
            <span>📅</span>
            <span>{currentDateTime || 'Monday, 28 Sep 2026 • 09:00 PM IST'}</span>
            <span style={{ margin: '0 4px', opacity: 0.7 }}>•</span>
            <span style={{ color: '#00e676', fontWeight: 600 }}>Operational Status: Optimal</span>
          </div>

          <p className="welcome-summary">
            Continuous AI surveillance is active across 8 North-Eastern states. 
            Currently, <strong>{dashboardStats.criticalZones} critical landslide zones</strong> and{' '}
            <strong>{dashboardStats.activeAlerts} high-priority alerts</strong> require immediate departmental observation 
            due to elevated precipitation thresholds.
          </p>

          <div className="welcome-actions">
            <Link to="/risk-map" className="btn-banner-primary">
              <span>🗺️</span> View High-Risk Map
            </Link>
            <Link to="/alerts" className="btn-banner-secondary">
              <span>🚨</span> Review Active Alerts ({dashboardStats.activeAlerts})
            </Link>
          </div>
        </div>

        <div className="welcome-visual">
          <div className="welcome-logo-container">
            <img src="/logo.jpg" alt="BhuRakshak AI Logo" className="welcome-logo-img" />
          </div>
          <div className="welcome-status-chip">
            🛡️ AI Core Online (v4.2)
          </div>
        </div>
      </section>

      {/* 2. Stats Cards Row */}
      <section className="stats-grid">
        {/* Card 1: Monitored Locations */}
        <div 
          className="stat-card blue" 
          onClick={() => navigate('/risk-map')} 
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/risk-map')}
        >
          <div className="stat-icon-wrapper">🗺️</div>
          <div className="stat-details">
            <div className="stat-title">Total Monitored Locations</div>
            <div className="stat-value">{dashboardStats.totalLocations}</div>
            <div className="stat-trend trend-positive">
              <span>↗</span> +4 new sectors this month
            </div>
          </div>
        </div>

        {/* Card 2: Critical Zones */}
        <div 
          className="stat-card red" 
          onClick={() => navigate('/alerts')} 
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/alerts')}
        >
          <div className="stat-icon-wrapper">🚨</div>
          <div className="stat-details">
            <div className="stat-title">Critical Zones</div>
            <div className="stat-value">{dashboardStats.criticalZones}</div>
            <div className="stat-trend trend-alert">
              <span>⚠️</span> 2 escalated past 24h
            </div>
          </div>
        </div>

        {/* Card 3: Active Alerts */}
        <div 
          className="stat-card orange" 
          onClick={() => navigate('/alerts')} 
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/alerts')}
        >
          <div className="stat-icon-wrapper">⚠️</div>
          <div className="stat-details">
            <div className="stat-title">Active Alerts</div>
            <div className="stat-value">{dashboardStats.activeAlerts}</div>
            <div className="stat-trend trend-warning">
              <span>🔔</span> 3 high severity advisories
            </div>
          </div>
        </div>

        {/* Card 4: Sensors Online */}
        <div 
          className="stat-card green" 
          onClick={() => navigate('/sensor-monitoring')} 
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/sensor-monitoring')}
        >
          <div className="stat-icon-wrapper">📡</div>
          <div className="stat-details">
            <div className="stat-title">Sensors Online</div>
            <div className="stat-value">
              {dashboardStats.sensorsOnline}
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                /{dashboardStats.totalSensors}
              </span>
            </div>
            <div className="stat-trend trend-positive">
              <span>🟢</span> 92.7% network uptime
            </div>
          </div>
        </div>
      </section>

      {/* 3. Second Row: Risk Trend Chart + Active Alerts List */}
      <section className="dashboard-grid-2col">
        {/* Left: Pure CSS Bar Chart for 8 Days Risk Trends */}
        <div className="dash-card chart-container">
          <div className="card-header-flex">
            <div className="card-title-group">
              <h2><span>📊</span> 8-Day Regional Landslide Risk Trend</h2>
              <p className="card-subtitle">
                Composite risk index (%) calculated from satellite radar, soil saturation, and IMD rainfall
              </p>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-indicator high-risk"></span>
                <span>Critical (&ge;75%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-indicator mod-risk"></span>
                <span>High (60-74%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-indicator low-risk"></span>
                <span>Moderate (&lt;60%)</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="trend-bars-wrapper">
            {/* Horizontal Grid Lines */}
            <div className="chart-grid-lines">
              <div className="grid-line-row">
                <span className="grid-line-label">100%</span>
                <div className="grid-line-dash"></div>
              </div>
              <div className="grid-line-row">
                <span className="grid-line-label">75%</span>
                <div className="grid-line-dash"></div>
              </div>
              <div className="grid-line-row">
                <span className="grid-line-label">50%</span>
                <div className="grid-line-dash"></div>
              </div>
              <div className="grid-line-row">
                <span className="grid-line-label">25%</span>
                <div className="grid-line-dash"></div>
              </div>
              <div className="grid-line-row">
                <span className="grid-line-label">0%</span>
                <div className="grid-line-dash"></div>
              </div>
            </div>

            {/* Bars */}
            <div className="bars-track">
              {riskTrends.map((item, index) => {
                const barClass = getRiskBarStyle(item.avgRisk);
                const isHovered = hoveredBar === index;

                return (
                  <div 
                    key={item.date} 
                    className="bar-column"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip on top of bar */}
                    <div 
                      className="bar-value-tooltip" 
                      style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(6px)' }}
                    >
                      {item.avgRisk}% Risk • {item.alerts} Alerts
                    </div>

                    {/* Bar fill element */}
                    <div 
                      className={`bar-fill ${barClass}`}
                      style={{ height: `${item.avgRisk}%` }}
                    >
                      {item.alerts > 0 && (
                        <div className="bar-alert-badge" title={`${item.alerts} alerts on ${item.date}`}>
                          {item.alerts}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="bar-x-labels">
            {riskTrends.map((item) => (
              <div key={item.date} className="x-label-item">
                {item.date}
              </div>
            ))}
          </div>

          {/* Chart Summary Footer */}
          <div className="chart-footer-metrics">
            <div className="metric-summary-box">
              <div className="metric-summary-label">Current Peak</div>
              <div className="metric-summary-val" style={{ color: 'var(--danger)' }}>78% Risk</div>
            </div>
            <div className="metric-summary-box">
              <div className="metric-summary-label">8-Day Average</div>
              <div className="metric-summary-val" style={{ color: 'var(--primary-blue)' }}>59.5%</div>
            </div>
            <div className="metric-summary-box">
              <div className="metric-summary-label">Total Alerts Issued</div>
              <div className="metric-summary-val" style={{ color: '#e65100' }}>28 Alerts</div>
            </div>
            <div className="metric-summary-box">
              <div className="metric-summary-label">Trajectory</div>
              <div className="metric-summary-val" style={{ color: 'var(--danger)' }}>↗ Escalating</div>
            </div>
          </div>
        </div>

        {/* Right: Active Alerts List */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-group">
              <h2><span>🚨</span> Active Early Warning Alerts</h2>
              <p className="card-subtitle">Highest severity warnings requiring field attention</p>
            </div>
            <Link to="/alerts" className="card-action-link">
              View All ({activeAlerts.length}) &rarr;
            </Link>
          </div>

          <div className="alerts-list-wrapper">
            {priorityAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`alert-item-card ${alert.type === 'Critical' ? 'alert-critical' : 'alert-high'}`}
              >
                <div className="alert-header">
                  <div className="alert-loc-title">
                    <span>📍</span>
                    <span>{alert.location}</span>
                    <span className="alert-state-tag">({alert.state})</span>
                    {alert.isNew && (
                      <span className="badge-new-pulse">NEW</span>
                    )}
                  </div>
                  <div className="alert-time">
                    <span>⏱️</span>
                    <span>{alert.time}</span>
                  </div>
                </div>

                <p className="alert-message">{alert.message}</p>

                <div className="alert-footer">
                  <span className={`alert-score-pill ${alert.type === 'Critical' ? 'score-critical' : 'score-high'}`}>
                    Risk Score: {alert.riskScore}/100
                  </span>
                  <span className={alert.type === 'Critical' ? 'badge badge-danger' : 'badge badge-warning'}>
                    {alert.type} Advisory
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Third Row: Monitored Locations Table + Environmental Metrics */}
      <section className="dashboard-grid-3col">
        {/* Left: Monitored Locations Table */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-group">
              <h2><span>📌</span> Monitored Priority Locations</h2>
              <p className="card-subtitle">Real-time risk status of strategic highways and mountain settlements</p>
            </div>
            <Link to="/risk-map" className="card-action-link">
              Full Map View &rarr;
            </Link>
          </div>

          <div className="table-responsive">
            <table className="custom-dash-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>State</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {topLocations.map((loc) => (
                  <tr key={loc.id}>
                    <td>
                      <div className="location-name-cell">
                        <span className="loc-main-name">{loc.name}</span>
                        <span className="loc-sub-district">{loc.district}</span>
                      </div>
                    </td>
                    <td>
                      <span className="state-badge-tag">{loc.state}</span>
                    </td>
                    <td>
                      <div className="risk-progress-container">
                        <div className="risk-progress-track">
                          <div 
                            className={`risk-progress-bar ${getProgressBarClass(loc.riskScore)}`}
                            style={{ width: `${loc.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="risk-score-num">{loc.riskScore}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={getRiskBadgeClass(loc.riskLevel)}>
                        {loc.riskLevel}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {loc.lastUpdated.split(' ')[1]} IST
                    </td>
                    <td>
                      <Link 
                        to={`/location-details/${loc.id}`} 
                        className="btn-table-action"
                        title="View Telemetry & Sensor Details"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Environmental Metrics */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-group">
              <h2><span>⛅</span> Environmental Telemetry</h2>
              <p className="card-subtitle">Aggregated regional parameters across sensor network</p>
            </div>
            <Link to="/imd-monitoring" className="card-action-link">
              IMD Feed &rarr;
            </Link>
          </div>

          <div className="env-metrics-grid">
            {/* Metric 1: Avg Rainfall */}
            <div className="env-metric-card rainfall">
              <div className="env-card-header">
                <span className="env-card-label">Avg Rainfall</span>
                <div className="env-card-icon">🌧️</div>
              </div>
              <div className="env-card-value">185 mm</div>
              <div className="env-card-meter">
                <div className="env-meter-fill" style={{ width: '74%' }}></div>
              </div>
              <div className="env-card-status">
                <span style={{ color: 'var(--danger)', fontWeight: 700 }}>+42mm</span> above 24h baseline
              </div>
            </div>

            {/* Metric 2: Avg Soil Moisture */}
            <div className="env-metric-card moisture">
              <div className="env-card-header">
                <span className="env-card-label">Avg Soil Moisture</span>
                <div className="env-card-icon">💧</div>
              </div>
              <div className="env-card-value">72%</div>
              <div className="env-card-meter">
                <div className="env-meter-fill" style={{ width: '72%' }}></div>
              </div>
              <div className="env-card-status">
                <span style={{ color: '#e65100', fontWeight: 700 }}>Saturated</span> soil matrix
              </div>
            </div>

            {/* Metric 3: Avg Temperature */}
            <div className="env-metric-card temperature">
              <div className="env-card-header">
                <span className="env-card-label">Avg Temperature</span>
                <div className="env-card-icon">🌡️</div>
              </div>
              <div className="env-card-value">21°C</div>
              <div className="env-card-meter">
                <div className="env-meter-fill" style={{ width: '52%' }}></div>
              </div>
              <div className="env-card-status">
                <span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>Stable</span> highland ambient
              </div>
            </div>

            {/* Metric 4: Humidity */}
            <div className="env-metric-card humidity">
              <div className="env-card-header">
                <span className="env-card-label">Humidity</span>
                <div className="env-card-icon">💨</div>
              </div>
              <div className="env-card-value">82%</div>
              <div className="env-card-meter">
                <div className="env-meter-fill" style={{ width: '82%' }}></div>
              </div>
              <div className="env-card-status">
                <span style={{ color: 'var(--medium-blue)', fontWeight: 700 }}>High vapor</span> condensation
              </div>
            </div>
          </div>

          {/* Meteorological Notice */}
          <div className="env-advisory-box">
            <span className="advisory-icon">📢</span>
            <div className="advisory-text">
              <strong>IMD Special Heavy Rainfall Alert:</strong> East Khasi Hills, Kamrup, and East Sikkim under Red/Orange alert. Slope saturation thresholds exceeded in 6 sectors.
            </div>
          </div>
        </div>
      </section>

      {/* 5. Quick Access Buttons */}
      <section className="quick-access-section">
        <div className="section-title" style={{ marginBottom: '8px' }}>
          <span>⚡</span> Quick Navigation & Operational Modules
        </div>

        <div className="quick-access-grid">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.path} className="quick-action-card">
              <div className="quick-action-icon-circle">
                {action.icon}
              </div>
              <div className="quick-action-label">{action.title}</div>
              <div className="quick-action-hint">{action.subtitle}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Recent Activity Timeline */}
      <section className="dash-card timeline-card">
        <div className="card-header-flex">
          <div className="card-title-group">
            <h2><span>🕒</span> Live System Activity & Sensor Audit Trail</h2>
            <p className="card-subtitle">Chronological event log of automated AI detections, alerts, and field updates</p>
          </div>
          <div className="card-action-link" style={{ background: 'rgba(76, 175, 80, 0.1)', color: 'var(--primary-green)' }}>
            <span>●</span> Live Streaming
          </div>
        </div>

        <div className="timeline-list">
          {recentActivities.map((act) => (
            <div key={act.id} className="timeline-item">
              <div className="timeline-icon-node" title={act.type}>
                {act.icon}
              </div>
              <div className="timeline-content-card">
                <div className="timeline-body">
                  <div className="timeline-msg">{act.message}</div>
                  <div className="timeline-meta">
                    <span className={`timeline-type-pill type-${act.type}`}>
                      {act.type}
                    </span>
                    <span>•</span>
                    <span>Automated Trigger</span>
                  </div>
                </div>
                <div className="timeline-time-badge">
                  {act.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
