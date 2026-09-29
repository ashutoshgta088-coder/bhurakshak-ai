import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { monthlyRainfallData, riskTrends, monitoredLocations } from '../data/mockData';
import './Analytics.css';

// State Risk Assessment Data for NE Region
const stateRiskData = [
  { state: 'Meghalaya', riskScore: 82, level: 'Critical', districtCount: 5, activeSensors: 24 },
  { state: 'Sikkim', riskScore: 78, level: 'High', districtCount: 4, activeSensors: 18 },
  { state: 'Assam', riskScore: 65, level: 'High', districtCount: 7, activeSensors: 22 },
  { state: 'Nagaland', riskScore: 62, level: 'High', districtCount: 5, activeSensors: 16 },
  { state: 'Mizoram', riskScore: 58, level: 'Moderate', districtCount: 5, activeSensors: 12 },
  { state: 'Arunachal Pradesh', riskScore: 52, level: 'Moderate', districtCount: 5, activeSensors: 14 },
  { state: 'Manipur', riskScore: 45, level: 'Moderate', districtCount: 5, activeSensors: 10 },
  { state: 'Tripura', riskScore: 35, level: 'Low', districtCount: 4, activeSensors: 8 },
];

export default function Analytics() {
  const navigate = useNavigate();

  // Date Range Filter States
  const [activePreset, setActivePreset] = useState('30 Days');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-28');
  const [appliedNotice, setAppliedNotice] = useState('Showing data for: Past 30 Days (Sep 1, 2026 - Sep 28, 2026)');

  // Hovered item states for interactive charts
  const [hoveredTrend, setHoveredTrend] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Preset button handler
  const handlePresetChange = (preset) => {
    setActivePreset(preset);
    const end = '2026-09-28';
    let start = '2026-09-01';

    if (preset === '7 Days') {
      start = '2026-09-21';
    } else if (preset === '30 Days') {
      start = '2026-09-01';
    } else if (preset === '90 Days') {
      start = '2026-07-01';
    } else if (preset === '1 Year') {
      start = '2025-10-01';
    }

    setStartDate(start);
    setEndDate(end);
    setAppliedNotice(`Showing data for: Past ${preset} (${start} to ${end})`);
  };

  // Custom filter apply handler
  const handleCustomApply = (e) => {
    e.preventDefault();
    setActivePreset('Custom');
    setAppliedNotice(`Showing custom range: ${startDate} to ${endDate}`);
  };

  // Top 5 High Risk Locations sorted by riskScore
  const topHighRiskLocations = useMemo(() => {
    return [...monitoredLocations]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);
  }, []);

  // Helper for risk badge styling
  const getBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'badge-danger';
      case 'high':
        return 'badge-warning';
      case 'moderate':
        return 'badge-info';
      case 'low':
      case 'very low':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

  // Helper for meter bar gradient class
  const getMeterClass = (score) => {
    if (score >= 80) return 'risk-critical';
    if (score >= 60) return 'risk-high';
    if (score >= 40) return 'risk-moderate';
    return 'risk-low';
  };

  // Simulated download
  const handleExport = (format) => {
    alert(`Generating and downloading official BhuRakshak AI ${format} Analytics Report...`);
  };

  return (
    <div className="analytics-container">
      {/* 1. Page Header */}
      <header className="analytics-header">
        <div className="header-title-group">
          <h1>
            <span className="header-icon">📊</span>
            Analytics Dashboard
          </h1>
          <p className="header-subtitle">
            Comprehensive Landslide Hazard Analytics, Precipitation Impact Modeling & Geotechnical Risk Intelligence for the North Eastern Region
          </p>
        </div>
        <div className="header-actions">
          <div className="status-pill">
            <span className="pulse-dot"></span>
            Telemetry Synced (Real-time)
          </div>
          <button className="btn-export" onClick={() => handleExport('PDF')}>
            <span>📥</span> Export PDF Report
          </button>
          <button className="btn-export" onClick={() => handleExport('CSV')}>
            <span>📊</span> Export CSV
          </button>
        </div>
      </header>

      {/* 2. Date Range Selector Bar */}
      <section className="filter-bar" aria-label="Date Range Filter">
        <div className="filter-presets">
          <span className="filter-label">
            <span>📅</span> Time Window:
          </span>
          {['7 Days', '30 Days', '90 Days', '1 Year'].map((preset) => (
            <button
              key={preset}
              type="button"
              className={`preset-btn ${activePreset === preset ? 'active' : ''}`}
              onClick={() => handlePresetChange(preset)}
            >
              {preset}
            </button>
          ))}
        </div>

        <form className="custom-range-group" onSubmit={handleCustomApply}>
          <div className="date-input-wrap">
            <span>From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="Start date"
            />
          </div>
          <div className="date-input-wrap">
            <span>To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="End date"
            />
          </div>
          <button type="submit" className="btn-apply">
            Apply Range
          </button>
        </form>
      </section>

      {/* 3. KPI Cards Row (4 cards) */}
      <section className="kpi-grid" aria-label="Key Performance Indicators">
        {/* Card 1: Total Predictions */}
        <div className="kpi-card">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Total Predictions Made</span>
              <div className="kpi-icon-wrap" style={{ background: '#e3f2fd', color: '#1a73e8' }}>
                🤖
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">2,847</span>
              <span className="kpi-unit">runs</span>
            </div>
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="kpi-footer">
            <span className="trend-badge positive">↑ +14.2%</span>
            <span className="kpi-subtext">vs previous 30 days</span>
          </div>
        </div>

        {/* Card 2: Average Risk Score */}
        <div className="kpi-card kpi-warning">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Average Risk Score</span>
              <div className="kpi-icon-wrap" style={{ background: '#fff3e0', color: '#f57c00' }}>
                ⚠️
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">58</span>
              <span className="kpi-unit">/ 100</span>
            </div>
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill fill-warning" style={{ width: '58%' }}></div>
            </div>
          </div>
          <div className="kpi-footer">
            <span className="trend-badge neutral">↑ +4.8 pts</span>
            <span className="kpi-subtext">Moderate risk index</span>
          </div>
        </div>

        {/* Card 3: Prediction Accuracy */}
        <div className="kpi-card kpi-success">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Prediction Accuracy</span>
              <div className="kpi-icon-wrap" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                🎯
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">94.7%</span>
              <span className="kpi-unit">precision</span>
            </div>
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill fill-success" style={{ width: '94.7%' }}></div>
            </div>
          </div>
          <div className="kpi-footer">
            <span className="trend-badge positive">↑ +1.8%</span>
            <span className="kpi-subtext">Sentinel-1 SAR verified</span>
          </div>
        </div>

        {/* Card 4: Alerts Generated */}
        <div className="kpi-card kpi-danger">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Alerts Generated</span>
              <div className="kpi-icon-wrap" style={{ background: '#ffebee', color: '#e53935' }}>
                🚨
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">156</span>
              <span className="kpi-unit">alerts</span>
            </div>
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill fill-warning" style={{ width: '68%' }}></div>
            </div>
          </div>
          <div className="kpi-footer">
            <span className="trend-badge danger">38 Critical</span>
            <span className="kpi-subtext">118 High/Moderate</span>
          </div>
        </div>
      </section>

      {/* 4. Risk Trend Chart */}
      <section className="chart-card" aria-label="Risk Trend Analysis">
        <div className="chart-card-header">
          <div className="chart-title-area">
            <h2>
              <span>📈</span> 8-Day Geological Risk Trend & Alert Activity
            </h2>
            <p>Correlation between regional average risk index and emergency early warning alerts</p>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color blue"></span>
              <span>Avg Risk Score (0 - 100)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color amber-dot"></span>
              <span>Active Alerts Issued (0 - 8)</span>
            </div>
          </div>
        </div>

        <div className="risk-trend-container">
          {/* Left Y-Axis: Risk Score */}
          <div className="y-axis-left" title="Risk Score Axis">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          {/* Plot Area */}
          <div className="chart-plot-area">
            {/* Horizontal Grid lines */}
            <div className="grid-lines-container">
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
            </div>

            {/* Overlaid SVG connecting line for alerts */}
            <svg
              viewBox="0 0 800 100"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 4,
              }}
            >
              <polyline
                fill="none"
                stroke="#ff9800"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                points={riskTrends
                  .map((item, idx) => {
                    // 8 items distributed horizontally
                    const x = (idx + 0.5) * (800 / riskTrends.length);
                    // y-scale: 0 to 8 alerts mapped to 100 to 0 (SVG y is inverted)
                    const y = 100 - (item.alerts / 8) * 100;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            </svg>

            {/* Bars and Dots Columns */}
            <div className="trend-bars-wrapper">
              {riskTrends.map((item, idx) => {
                const barHeightPercent = Math.min(100, Math.max(5, item.avgRisk));
                // Dot height based on alert count (max alert scale = 8)
                const dotBottomPercent = Math.min(94, Math.max(6, (item.alerts / 8) * 100));

                return (
                  <div
                    key={idx}
                    className="trend-bar-column"
                    onMouseEnter={() => setHoveredTrend(item)}
                    onMouseLeave={() => setHoveredTrend(null)}
                  >
                    {/* Tooltip on hover */}
                    <div className="chart-tooltip-box">
                      <strong>{item.date}</strong>
                      <div>Risk Index: <b>{item.avgRisk}/100</b></div>
                      <div>Alerts: <b>{item.alerts} issued</b></div>
                      <div style={{ color: item.avgRisk >= 70 ? '#ff5252' : '#ffb74d', marginTop: '2px' }}>
                        {item.avgRisk >= 70 ? '● High Hazard Zone' : '● Guarded State'}
                      </div>
                    </div>

                    {/* Overlaid Alert Dot */}
                    <div
                      className="alert-marker-dot"
                      style={{ bottom: `calc(${dotBottomPercent}% - 7px)` }}
                      title={`${item.alerts} alerts on ${item.date}`}
                    >
                      <span className="alert-dot-label">{item.alerts}</span>
                    </div>

                    {/* Value label above bar */}
                    <span className="trend-bar-val">{item.avgRisk}</span>

                    {/* Bar Pillar */}
                    <div
                      className="trend-bar-pillar"
                      style={{ height: `${barHeightPercent}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Y-Axis: Alerts Count */}
          <div className="y-axis-right" title="Alerts Issued Axis">
            <span>8</span>
            <span>6</span>
            <span>4</span>
            <span>2</span>
            <span>0</span>
          </div>
        </div>

        {/* X-Axis Dates */}
        <div className="x-axis-row">
          {riskTrends.map((item, idx) => (
            <div key={idx} className="x-axis-date">
              {item.date}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Monthly Rainfall vs Landslides Dual Chart */}
      <section className="chart-card" aria-label="Monthly Precipitation vs Landslide Events">
        <div className="chart-card-header">
          <div className="chart-title-area">
            <h2>
              <span>🌧️</span> Annual Precipitation vs. Landslide Frequency (Dual Axis)
            </h2>
            <p>Annual historical distribution demonstrating correlation between monsoon peaks and slope failures</p>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color blue"></span>
              <span>Rainfall (mm) [Max: 800mm]</span>
            </div>
            <div className="legend-item">
              <span className="legend-color red"></span>
              <span>Landslide Events [Max: 15]</span>
            </div>
          </div>
        </div>

        <div className="dual-chart-container">
          {/* Left Y-Axis: Rainfall mm */}
          <div className="y-axis-left" title="Rainfall Axis in millimeters">
            <span>800mm</span>
            <span>600mm</span>
            <span>400mm</span>
            <span>200mm</span>
            <span>0mm</span>
          </div>

          {/* Plot Area */}
          <div className="chart-plot-area">
            <div className="grid-lines-container">
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
            </div>

            <div className="dual-bars-wrapper">
              {monthlyRainfallData.map((data, idx) => {
                // Max rainfall scale: 800mm
                const rainHeight = Math.min(100, Math.max(3, (data.rainfall / 800) * 100));
                // Max landslide scale: 15 events
                const slideHeight = Math.min(100, Math.max(data.landslides > 0 ? 5 : 0, (data.landslides / 15) * 100));

                return (
                  <div
                    key={idx}
                    className="month-group-column"
                    onMouseEnter={() => setHoveredMonth(data)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {/* Tooltip */}
                    <div className="chart-tooltip-box">
                      <strong>{data.month} 2026</strong>
                      <div style={{ color: '#64b5f6' }}>Precipitation: <b>{data.rainfall} mm</b></div>
                      <div style={{ color: '#ef5350' }}>Landslides: <b>{data.landslides} events</b></div>
                    </div>

                    {/* Dual Bars Side-by-Side */}
                    <div
                      className="dual-bar rainfall-bar"
                      style={{ height: `${rainHeight}%` }}
                      title={`${data.month}: ${data.rainfall} mm`}
                    ></div>
                    <div
                      className="dual-bar landslide-bar"
                      style={{ height: `${slideHeight}%` }}
                      title={`${data.month}: ${data.landslides} landslides`}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Y-Axis: Landslides count */}
          <div className="y-axis-right" title="Landslide Events Axis">
            <span>15</span>
            <span>11</span>
            <span>7</span>
            <span>3</span>
            <span>0</span>
          </div>
        </div>

        {/* Dual X-Axis Month Labels */}
        <div className="dual-x-axis">
          {monthlyRainfallData.map((data, idx) => (
            <div key={idx} className="dual-x-label">
              {data.month}
            </div>
          ))}
        </div>
      </section>

      {/* 6 & 7 Split Grid: State Distribution & Top 5 Locations */}
      <div className="analytics-two-col">
        {/* 6. Risk Distribution by State */}
        <section className="chart-card" aria-label="Risk Distribution by State">
          <div className="chart-card-header">
            <div className="chart-title-area">
              <h2>
                <span>🗺️</span> Regional Risk Distribution by State
              </h2>
              <p>Mean vulnerability index calculated across all monitored hill stations</p>
            </div>
            <span className="badge badge-info">NER 8 States</span>
          </div>

          <div className="state-bars-list">
            {stateRiskData.map((item, idx) => (
              <div key={item.state} className="state-bar-row">
                <div className="state-info-line">
                  <div className="state-name-area">
                    <span className="state-rank-pill">{idx + 1}</span>
                    <span>{item.state}</span>
                  </div>
                  <div className="state-score-tag">
                    <span style={{ color: 'var(--text-dark)' }}>{item.riskScore}</span>
                    <span className={`badge ${getBadgeClass(item.level)}`}>
                      {item.level}
                    </span>
                  </div>
                </div>

                <div className="state-meter-track">
                  <div
                    className={`state-meter-fill ${getMeterClass(item.riskScore)}`}
                    style={{ width: `${item.riskScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="state-summary-banner">
            <div className="banner-stat-block">
              <span className="banner-stat-val" style={{ color: 'var(--danger)' }}>Meghalaya (82)</span>
              <span className="banner-stat-lbl">Highest Risk State</span>
            </div>
            <div className="banner-stat-block">
              <span className="banner-stat-val" style={{ color: 'var(--primary-blue)' }}>59.6 / 100</span>
              <span className="banner-stat-lbl">NER Regional Average</span>
            </div>
            <div className="banner-stat-block">
              <span className="banner-stat-val" style={{ color: 'var(--primary-green)' }}>Tripura (35)</span>
              <span className="banner-stat-lbl">Lowest Vulnerability</span>
            </div>
          </div>
        </section>

        {/* 7. Top 5 High Risk Locations Table */}
        <section className="chart-card" aria-label="Top 5 High Risk Locations">
          <div className="chart-card-header">
            <div className="chart-title-area">
              <h2>
                <span>⚠️</span> Top 5 Critical Vulnerability Locations
              </h2>
              <p>Prioritized geotechnical hotspots requiring immediate engineering vigilance</p>
            </div>
            <button
              className="action-view-btn"
              onClick={() => navigate('/risk-map')}
              title="View all monitored locations on GIS Map"
            >
              GIS Map ➔
            </button>
          </div>

          <div className="locations-table-wrap">
            <table className="locations-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Location</th>
                  <th>State</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {topHighRiskLocations.map((loc, idx) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  return (
                    <tr key={loc.id}>
                      <td>
                        {idx < 3 ? (
                          <span className="rank-badge" title={`Rank ${idx + 1}`}>{medals[idx]}</span>
                        ) : (
                          <span className="rank-number">#{idx + 1}</span>
                        )}
                      </td>
                      <td>
                        <div className="location-cell">
                          <span className="location-name">{loc.name}</span>
                          <span className="location-district">District: {loc.district}</span>
                        </div>
                      </td>
                      <td className="state-cell">{loc.state}</td>
                      <td>
                        <div className="score-cell-group">
                          <div className="score-num-wrap">
                            <span>{loc.riskScore}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>/ 100</span>
                          </div>
                          <div className="table-meter-bar">
                            <div
                              className="table-meter-fill"
                              style={{
                                width: `${loc.riskScore}%`,
                                background: loc.riskScore >= 80 ? 'linear-gradient(90deg, #ff9800, #e53935)' : 'linear-gradient(90deg, #fbc02d, #ff9800)',
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getBadgeClass(loc.riskLevel)}`}>
                          {loc.riskLevel}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-view-btn"
                          onClick={() => navigate(`/location-details/${loc.id}`)}
                          title={`Inspect telemetry for ${loc.name}`}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 8. Monthly Report Summary Card */}
      <section className="report-summary-card" aria-label="Monthly Report Summary">
        <div className="report-header-banner">
          <div className="chart-title-area">
            <h2>
              <span>📋</span> Monthly Hazard Assessment & Highlights Report
            </h2>
            <p>Executive meteorological summary and automated early warning intelligence audit</p>
          </div>
          <div className="report-badge-meta">
            <div className="gov-emblem-badge">
              <img src="/logo.jpg" alt="BhuRakshak AI" className="gov-logo-img" />
              <span>Official NDMA & NESAC Joint Review</span>
            </div>
            <button className="btn-primary" onClick={() => handleExport('Official Summary PDF')}>
              <span>📥</span> Download Full Audit PDF
            </button>
          </div>
        </div>

        <div className="report-highlights-grid">
          {/* Highlight 1: Total events */}
          <div className="highlight-item-box">
            <div className="highlight-icon-tag red">⚡</div>
            <span className="highlight-title">Total Slope Events</span>
            <div className="highlight-main-val">32 Incidents</div>
            <p className="highlight-desc">
              Total slope instabilities & mudflow occurrences recorded across 8 NE states (72% correlated with high-intensity rain spells).
            </p>
          </div>

          {/* Highlight 2: Peak rainfall day */}
          <div className="highlight-item-box">
            <div className="highlight-icon-tag blue">🌧️</div>
            <span className="highlight-title">Peak Rainfall Day</span>
            <div className="highlight-main-val">July 18, 2026</div>
            <p className="highlight-desc">
              Cherrapunji Hills registered 380 mm continuous precipitation in 24 hours, triggering automated Grade-1 early warning evacuation.
            </p>
          </div>

          {/* Highlight 3: Most affected district */}
          <div className="highlight-item-box">
            <div className="highlight-icon-tag orange">📍</div>
            <span className="highlight-title">Most Affected District</span>
            <div className="highlight-main-val">East Khasi Hills</div>
            <p className="highlight-desc">
              Meghalaya's East Khasi Hills recorded 14 critical alert alerts and 3 significant road subsidence events along NH-6 corridors.
            </p>
          </div>

          {/* Highlight 4: Predictions accuracy improvement */}
          <div className="highlight-item-box">
            <div className="highlight-icon-tag green">📈</div>
            <span className="highlight-title">Accuracy Improvement</span>
            <div className="highlight-main-val">94.7% (+1.8%)</div>
            <p className="highlight-desc">
              AI model precision upgraded from 92.9% to 94.7% following fusion of Sentinel-1 InSAR ground deformation telemetry.
            </p>
          </div>
        </div>

        {/* Executive Actionable Advisory */}
        <div className="advisory-notice">
          <span className="advisory-icon">💡</span>
          <div>
            <strong>Executive Directives for Disaster Management Authorities (NDRF & State SDRF):</strong>
            <p style={{ marginTop: '4px' }}>
              High pore water pressures detected along Cherrapunji and Barak Valley slopes suggest continued soil saturation exceeding 90%. Pre-positioning of heavy clearing excavators and traffic diversions along NH-44 and Gangtok-Nathula highway should remain active through the upcoming weather cycle.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
