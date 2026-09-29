import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { systemStatus, monitoredLocations, predictionFactors } from '../data/mockData';
import './LocationDetails.css';

export default function LocationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find location by URL param id; fallback to first monitored location
  const location = useMemo(() => {
    if (!id) return monitoredLocations[0];
    const found = monitoredLocations.find(loc => loc.id.toString() === id.toString());
    return found || monitoredLocations[0];
  }, [id]);

  const [actionNotice, setActionNotice] = useState(null);

  const handleAction = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Determine risk level color & text styling
  const getRiskDetails = (score) => {
    if (score >= 80) {
      return {
        level: 'Critical',
        color: '#e53935',
        badgeClass: 'critical',
        advice: 'Immediate Evacuation Advisory & Route Lockdown',
        fillClass: 'critical'
      };
    } else if (score >= 60) {
      return {
        level: 'High',
        color: '#ff9800',
        badgeClass: 'high',
        advice: 'Intensified Patrol & Precautionary Diversion',
        fillClass: 'high'
      };
    } else if (score >= 40) {
      return {
        level: 'Moderate',
        color: '#f57f17',
        badgeClass: 'moderate',
        advice: 'Continuous Monitoring & Hillside Clearance',
        fillClass: 'moderate'
      };
    } else {
      return {
        level: 'Low',
        color: '#4caf50',
        badgeClass: 'low',
        advice: 'Normal Geological Activity Observed',
        fillClass: 'low'
      };
    }
  };

  const currentRisk = getRiskDetails(location.riskScore);

  // 7-Day Historical Trend Data (Synthesized based on current score)
  const trendData = useMemo(() => {
    const days = ['Sep 22', 'Sep 23', 'Sep 24', 'Sep 25', 'Sep 26', 'Sep 27', 'Sep 28'];
    const current = location.riskScore;
    // Calculate realistic previous 6 days leading to current score
    const deltas = [-26, -20, -14, -18, -9, -3, 0];
    return days.map((day, idx) => {
      const score = Math.max(15, Math.min(99, Math.round(current + deltas[idx])));
      return { day, score };
    });
  }, [location]);

  // Generate SVG coordinates for 7-day trend chart
  const svgWidth = 650;
  const svgHeight = 180;
  const paddingX = 45;
  const paddingY = 25;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const points = trendData.map((d, index) => {
    const x = paddingX + (index / (trendData.length - 1)) * chartWidth;
    // SVG y=0 is top, y=svgHeight is bottom; score ranges 0 to 100
    const y = svgHeight - paddingY - (d.score / 100) * chartHeight;
    return { x, y, score: d.score, day: d.day };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
  }, '');

  // Area path closing at the bottom
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  // Recommendations generator
  const getRecommendations = (level) => {
    if (level === 'Critical') {
      return [
        { icon: '🚨', text: 'Issue immediate Section 144 evacuation advisory for 350m down-slope inhabited structures.' },
        { icon: '🛑', text: 'Suspend heavy commercial truck transit along vulnerable cut-slope corridors.' },
        { icon: '🚁', text: 'Keep NDRF 1st Battalion (Guwahati) & SDRF emergency quick-reaction teams on 30-min standby.' },
        { icon: '📡', text: 'Increase tiltmeter and borehole pore-pressure transmission rate from 15 min to 1 min frequency.' },
        { icon: '📢', text: 'Trigger localized CAP-SACHET multi-lingual mobile broadcast alerts in local dialects.' }
      ];
    } else if (level === 'High') {
      return [
        { icon: '⚠️', text: 'Deploy Highway Patrol & Border Roads Organisation (BRO) clearing dozers at designated staging points.' },
        { icon: '🚜', text: 'Clear drainage culverts and divert surface runoff away from known tension cracks.' },
        { icon: '🚸', text: 'Restrict night-time vehicular traffic between 20:00 and 06:00 along mountain passes.' },
        { icon: '👁️', text: 'Dispatch ground verification squads to inspect tension fissure widening.' }
      ];
    } else if (level === 'Moderate') {
      return [
        { icon: '🌧️', text: 'Monitor continuous IMD radar precipitation forecasts for sudden cloudburst signatures.' },
        { icon: '🌿', text: 'Verify hill-slope bio-engineering vegetative barriers and retaining gabion integrity.' },
        { icon: '📻', text: 'Issue general caution notices through District Disaster Management Authority (DDMA).' }
      ];
    } else {
      return [
        { icon: '✅', text: 'Maintain baseline telemetry ingestion and scheduled monthly sensor battery checks.' },
        { icon: '📋', text: 'Update regional GIS susceptibility database with recent geological drone surveys.' }
      ];
    }
  };

  const recommendations = getRecommendations(currentRisk.level);

  return (
    <div className="location-details-container">
      {/* Top Bar with Navigation & Location Switcher */}
      <div className="location-top-bar">
        <Link to="/risk-map" className="back-link">
          <span>←</span> Back to Risk Map
        </Link>

        <div className="location-switcher-wrap">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            📍 Select Monitored Sector:
          </span>
          <select
            className="location-select-dropdown"
            value={location.id}
            onChange={(e) => navigate(`/location-details/${e.target.value}`)}
          >
            {monitoredLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.state}) - {loc.riskScore}/100
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div style={{
          padding: '12px 20px',
          background: '#e8f5e9',
          border: '1.5px solid var(--primary-green)',
          color: '#1b5e20',
          borderRadius: '10px',
          marginBottom: '20px',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <span>✅ {actionNotice}</span>
          <button
            onClick={() => setActionNotice(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Location Header Hero Card */}
      <div className="location-hero-card">
        <div className="location-hero-info">
          <div className="location-title-row">
            <h1>{location.name}</h1>
            <span className={`risk-badge ${currentRisk.badgeClass}`}>
              ● {location.riskLevel || currentRisk.level} Risk ({location.riskScore}/100)
            </span>
          </div>

          <div className="location-submeta">
            <span>
              <strong>District:</strong> {location.district}
            </span>
            <span>
              <strong>State:</strong> {location.state} (NER)
            </span>
            <span>
              <strong>Coordinates:</strong>{' '}
              <span className="geo-coords-badge">
                {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
              </span>
            </span>
            <span>
              <strong>Last Telemetry:</strong> {location.lastUpdated}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => handleAction(`Full Geotechnical Dossier generated for ${location.name}.`)}
          >
            📄 Export Dossier
          </button>
          <button
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => handleAction(`Field patrol alert dispatched to ${location.district} Emergency Operations Center.`)}
          >
            🚨 Dispatch Field Advisory
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="location-main-grid">
        {/* Left Column: Gauge Card & Recommendations */}
        <div className="left-column">
          {/* Circular Gauge Risk Card */}
          <div className="risk-gauge-card">
            <div className="gauge-title">AI Composite Risk Score</div>
            <div className="gauge-subtitle">Multi-Factor Hazard Index</div>

            {/* Circular Gauge with conic-gradient */}
            <div
              className="gauge-outer-circle"
              style={{
                background: `conic-gradient(${currentRisk.color} 0% ${location.riskScore}%, #e2e8f0 ${location.riskScore}% 100%)`
              }}
            >
              <div className="gauge-inner-circle">
                <div className={`gauge-score-value ${currentRisk.fillClass}`}>
                  {location.riskScore}
                </div>
                <div className="gauge-score-max">OUT OF 100</div>
              </div>
            </div>

            <div
              className="gauge-status-desc"
              style={{
                color: currentRisk.color,
                background: `${currentRisk.color}15`,
                border: `1px solid ${currentRisk.color}40`
              }}
            >
              {currentRisk.advice}
            </div>

            <div className="gauge-confidence-pill">
              AI Confidence Score: <strong>94.2%</strong> • Sensor Sync: Live
            </div>
          </div>

          {/* Recommended Actions Card */}
          <div className="recommendations-card">
            <div className="rec-title-row">
              <div className="rec-title">
                <span>🛡️</span> Safety & Mitigation Protocol
              </div>
              <span className={`risk-badge ${currentRisk.badgeClass}`} style={{ fontSize: '0.72rem', padding: '3px 10px' }}>
                Level: {currentRisk.level}
              </span>
            </div>

            <div className="rec-list">
              {recommendations.map((rec, index) => (
                <div key={index} className="rec-item">
                  <span className="rec-icon">{rec.icon}</span>
                  <span>{rec.text}</span>
                </div>
              ))}
            </div>

            <div className="rec-buttons-row">
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '10px 14px', fontSize: '0.84rem' }}
                onClick={() => handleAction(`Emergency SMS broadcast queued for ${location.district} local cell towers.`)}
              >
                📢 Broadcast Alert
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '10px 14px', fontSize: '0.84rem' }}
                onClick={() => handleAction(`Direct notification sent to ${location.district} District Magistrate.`)}
              >
                📞 DM Connect
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Metrics, AI Explanation, Factors, and Trend */}
        <div className="right-column">
          {/* Metrics Grid (4 cards) */}
          <div className="metrics-grid-4">
            {/* Rainfall */}
            <div className="metric-card-tile">
              <div className="metric-tile-icon icon-rainfall">🌧️</div>
              <div className="metric-tile-info">
                <span className="metric-tile-label">Rainfall (24h)</span>
                <span className="metric-tile-val">{location.rainfall} mm</span>
                <span className="metric-tile-status" style={{ color: location.rainfall > 200 ? 'var(--danger)' : 'var(--primary-green)' }}>
                  {location.rainfall > 200 ? '⚠️ Exceeds Threshold (200mm)' : '✓ Normal Precipitation'}
                </span>
              </div>
            </div>

            {/* Soil Moisture */}
            <div className="metric-card-tile">
              <div className="metric-tile-icon icon-moisture">💧</div>
              <div className="metric-tile-info">
                <span className="metric-tile-label">Soil Moisture</span>
                <span className="metric-tile-val">{location.soilMoisture} %</span>
                <span className="metric-tile-status" style={{ color: location.soilMoisture > 80 ? 'var(--danger)' : '#f57f17' }}>
                  {location.soilMoisture > 80 ? '🔴 High Saturation / Liquefaction' : '🟡 Moderate Pore Pressure'}
                </span>
              </div>
            </div>

            {/* Elevation */}
            <div className="metric-card-tile">
              <div className="metric-tile-icon icon-elevation">⛰️</div>
              <div className="metric-tile-info">
                <span className="metric-tile-label">Elevation (AMSL)</span>
                <span className="metric-tile-val">{location.elevation} m</span>
                <span className="metric-tile-status" style={{ color: 'var(--text-secondary)' }}>
                  {location.elevation > 1500 ? 'High-Altitude Ridge' : 'Valley / Hill Cut Segment'}
                </span>
              </div>
            </div>

            {/* Slope Gradient */}
            <div className="metric-card-tile">
              <div className="metric-tile-icon icon-slope">📐</div>
              <div className="metric-tile-info">
                <span className="metric-tile-label">Slope Gradient</span>
                <span className="metric-tile-val">{location.slope}°</span>
                <span className="metric-tile-status" style={{ color: location.slope >= 35 ? 'var(--danger)' : 'var(--primary-blue)' }}>
                  {location.slope >= 35 ? '🚨 Steep Hazardous Grade (&ge;35°)' : '✓ Moderate Incline Grade'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Risk Explanation Card */}
          <div className="ai-explanation-card">
            <div className="ai-header-bar">
              <div className="ai-header-title">
                <span>🤖</span>
                <span>BhuRakshak AI Risk Intelligence & Inference Synthesis</span>
              </div>
              <span className="ai-model-tag">
                Ensemble Random Forest + LSTM v3.2
              </span>
            </div>

            <p className="ai-paragraph">
              The AI model has evaluated <strong>{location.name}</strong> ({location.district}, {location.state}) by cross-referencing live IMD radar rainfall (<strong>{location.rainfall} mm</strong>), ground soil saturation (<strong>{location.soilMoisture}%</strong>), and geotechnical slope geometry (<strong>{location.slope}°</strong>).
              {location.riskScore >= 75
                ? ' Elevated rainfall over the preceding 48 hours has led to extreme pore-water pressure, reducing effective shear strength in underlying shale-sandstone strata. Historical analogs indicate a high probability of rotational slope failure under continuous monsoon runoff.'
                : ' Soil moisture and pore pressure metrics remain within sustainable equilibrium thresholds, though elevated slope gradients require ongoing surveillance during localized convective rain cells.'}
            </p>

            <div className="ai-key-points-grid">
              <div className="ai-point-item">
                <span className="ai-point-bullet">▶</span>
                <span><strong>Primary Driver:</strong> Heavy precipitation exceeding threshold by {Math.max(0, location.rainfall - 200)} mm.</span>
              </div>

              <div className="ai-point-item">
                <span className="ai-point-bullet">▶</span>
                <span><strong>Soil Instability:</strong> Saturation level is at {location.soilMoisture}%, approaching liquid limit.</span>
              </div>

              <div className="ai-point-item">
                <span className="ai-point-bullet">▶</span>
                <span><strong>Topographical Strain:</strong> {location.slope}° cut-slope promotes accelerated shear velocity.</span>
              </div>

              <div className="ai-point-item">
                <span className="ai-point-bullet">▶</span>
                <span><strong>Analogous Events:</strong> Strong correlation with monsoon slips documented in Aug 2024 / Jul 2025.</span>
              </div>
            </div>
          </div>

          {/* Contributing Factors Horizontal Bar Chart */}
          <div className="factors-card">
            <div className="ai-header-bar">
              <div className="ai-header-title">
                <span>📊</span>
                <span>Contributing Hazard Factors & Feature Weights</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Feature Impact Analysis (SHAP Weights)
              </span>
            </div>

            <div className="factors-list">
              {predictionFactors.map((item, index) => {
                const statusLower = item.status.toLowerCase();
                return (
                  <div key={index} className="factor-item">
                    <div className="factor-header-row">
                      <span className="factor-title">{item.factor}</span>
                      <div className="factor-meta-right">
                        <span className="factor-weight">Model Weight: {item.weight}%</span>
                        <span className={`factor-val-badge ${
                          statusLower === 'critical' ? 'badge-danger' :
                          statusLower === 'high' ? 'badge-warning' : 'badge-info'
                        }`}>
                          {item.value}% Impact ({item.status})
                        </span>
                      </div>
                    </div>

                    <div className="factor-bar-track">
                      <div
                        className={`factor-bar-fill ${statusLower}`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Trend Chart (CSS / SVG) */}
          <div className="trend-card">
            <div className="ai-header-bar">
              <div className="ai-header-title">
                <span>📈</span>
                <span>7-Day Risk Progression Trend</span>
              </div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 12, height: 2, background: 'var(--danger)', display: 'inline-block' }}></span>
                  Critical Limit (80)
                </span>
                <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 12, height: 2, background: 'var(--warning)', display: 'inline-block' }}></span>
                  High Risk (60)
                </span>
              </div>
            </div>

            <div className="trend-chart-container">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="trend-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1a73e8" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                {/* 80 Critical Line */}
                <line
                  x1={paddingX}
                  y1={svgHeight - paddingY - (80 / 100) * chartHeight}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - paddingY - (80 / 100) * chartHeight}
                  className="trend-svg-critical-line"
                />
                {/* 60 High Line */}
                <line
                  x1={paddingX}
                  y1={svgHeight - paddingY - (60 / 100) * chartHeight}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - paddingY - (60 / 100) * chartHeight}
                  className="trend-svg-high-line"
                />
                {/* 40 Moderate Line */}
                <line
                  x1={paddingX}
                  y1={svgHeight - paddingY - (40 / 100) * chartHeight}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - paddingY - (40 / 100) * chartHeight}
                  className="trend-svg-grid-line"
                />

                {/* Area under curve */}
                <path d={areaD} className="trend-svg-area" />

                {/* Main line path */}
                <path d={pathD} className="trend-svg-path" />

                {/* Data Points and Value Callouts */}
                {points.map((pt, idx) => (
                  <g key={idx}>
                    {/* Vertical grid line */}
                    <line
                      x1={pt.x}
                      y1={svgHeight - paddingY}
                      x2={pt.x}
                      y2={pt.y}
                      stroke="rgba(0, 0, 0, 0.04)"
                      strokeDasharray="2 2"
                    />

                    {/* Circle marker */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      className="trend-data-point"
                      stroke={pt.score >= 80 ? 'var(--danger)' : pt.score >= 60 ? 'var(--warning)' : 'var(--primary-blue)'}
                    />

                    {/* Score value above circle */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      className="trend-score-callout"
                      fill={pt.score >= 80 ? 'var(--danger)' : pt.score >= 60 ? '#e65100' : 'var(--text-dark)'}
                    >
                      {pt.score}
                    </text>

                    {/* Day label below baseline */}
                    <text
                      x={pt.x}
                      y={svgHeight - 6}
                      className="trend-label-text"
                    >
                      {pt.day}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
