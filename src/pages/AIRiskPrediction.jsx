import { useState, useEffect, useMemo } from 'react';
import { monitoredLocations, predictionFactors } from '../data/mockData';
import './AIRiskPrediction.css';

export default function AIRiskPrediction() {
  // Selected location state (default to first location)
  const [selectedLocationId, setSelectedLocationId] = useState(
    monitoredLocations && monitoredLocations.length > 0 ? monitoredLocations[0].id : 1
  );

  // Animation trigger state
  const [animateBars, setAnimateBars] = useState(false);
  const [isInferring, setIsInferring] = useState(false);
  const [lastInferenceTime, setLastInferenceTime] = useState('Sep 28, 2026, 18:30 IST');

  // Trigger bar animation on mount and whenever location changes
  useEffect(() => {
    setAnimateBars(false);
    const timer = setTimeout(() => {
      setAnimateBars(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedLocationId]);

  // Find the selected location object
  const selectedLocation = useMemo(() => {
    return (
      monitoredLocations.find((loc) => loc.id === Number(selectedLocationId)) ||
      monitoredLocations[0]
    );
  }, [selectedLocationId]);

  // Color & severity helper functions
  const getRiskColor = (score) => {
    if (score >= 80) return '#e53935'; // Critical
    if (score >= 60) return '#f57c00'; // High
    if (score >= 40) return '#fbc02d'; // Moderate
    return '#4caf50'; // Low
  };

  const getRiskSecondaryColor = (score) => {
    if (score >= 80) return '#b71c1c';
    if (score >= 60) return '#e65100';
    if (score >= 40) return '#f57f17';
    return '#2e7d32';
  };

  const getRiskGlow = (score) => {
    if (score >= 80) return 'rgba(229, 57, 53, 0.28)';
    if (score >= 60) return 'rgba(245, 124, 0, 0.25)';
    if (score >= 40) return 'rgba(251, 192, 45, 0.25)';
    return 'rgba(76, 175, 80, 0.25)';
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Moderate';
    return 'Low';
  };

  const getRiskBadgeClass = (score) => {
    if (score >= 80) return 'badge-critical';
    if (score >= 60) return 'badge-high';
    if (score >= 40) return 'badge-moderate';
    return 'badge-low';
  };

  const getBarFillClass = (score) => {
    if (score >= 80) return 'fill-critical';
    if (score >= 60) return 'fill-high';
    if (score >= 40) return 'fill-moderate';
    return 'fill-low';
  };

  const getChartBarClass = (score) => {
    if (score >= 80) return 'bar-critical';
    if (score >= 60) return 'bar-high';
    if (score >= 40) return 'bar-moderate';
    return 'bar-low';
  };

  // Derive location-specific contributing factors dynamically
  const locationFactors = useMemo(() => {
    const loc = selectedLocation;
    return predictionFactors.map((f) => {
      let val = f.value;
      if (f.factor.toLowerCase().includes('rainfall')) {
        val = Math.min(99, Math.max(15, Math.round((loc.rainfall / 390) * 100)));
      } else if (f.factor.toLowerCase().includes('soil moisture')) {
        val = loc.soilMoisture;
      } else if (f.factor.toLowerCase().includes('slope')) {
        val = Math.min(98, Math.max(10, Math.round((loc.slope / 45) * 100)));
      } else if (f.factor.toLowerCase().includes('geological')) {
        val = Math.min(95, Math.max(20, Math.round(loc.riskScore * 0.74 + 12)));
      } else if (f.factor.toLowerCase().includes('vegetation')) {
        // Inverse relationship: less vegetation = higher risk factor
        val = Math.max(15, Math.min(90, Math.round(100 - loc.riskScore * 0.6)));
      } else if (f.factor.toLowerCase().includes('historical')) {
        val = Math.min(95, Math.max(10, Math.round(loc.riskScore * 0.85 + 6)));
      }

      const status = getRiskLevel(val);
      return {
        ...f,
        value: val,
        status: status,
      };
    });
  }, [selectedLocation]);

  // Last 7 days prediction history and trend data for selected location
  const historyData = useMemo(() => {
    const currentScore = selectedLocation.riskScore;
    const daysConfig = [
      { offset: 6, date: '2026-09-22', label: 'Sep 22', factor: 0.65, keyFactor: 'Baseline Meteorological Influx', action: 'Routine Automated AI Ingestion' },
      { offset: 5, date: '2026-09-23', label: 'Sep 23', factor: 0.70, keyFactor: 'Ground Displacement Polling', action: 'Normal Watch Protocol' },
      { offset: 4, date: '2026-09-24', label: 'Sep 24', factor: 0.75, keyFactor: 'Intermittent Rain Showers', action: 'Field Verification Completed' },
      { offset: 3, date: '2026-09-25', label: 'Sep 25', factor: 0.82, keyFactor: 'Slope Hydrostatic Pressure', action: 'Drainage Culverts Cleared' },
      { offset: 2, date: '2026-09-26', label: 'Sep 26', factor: 0.89, keyFactor: 'Elevated Soil Saturation', action: 'Precautionary Advisory to SDRF' },
      { offset: 1, date: '2026-09-27', label: 'Sep 27', factor: 0.94, keyFactor: 'Cumulative Precipitation Surge', action: 'Heavy Traffic Regulated on Passes' },
      { offset: 0, date: '2026-09-28', label: 'Sep 28', factor: 1.00, keyFactor: 'Extreme Pore-Water Saturation', action: currentScore >= 80 ? 'Red Alert Issued & Evacuation Order' : currentScore >= 60 ? 'High Alert & Road Patrol Dispatched' : 'Standard Advisory Monitoring' },
    ];

    return daysConfig.map((item) => {
      const rawScore = Math.round(currentScore * item.factor);
      const score = Math.max(12, Math.min(100, rawScore));
      const level = getRiskLevel(score);
      return {
        date: item.date,
        label: item.label,
        riskScore: score,
        riskLevel: level,
        confidence: '89%',
        keyFactor: item.keyFactor,
        actionTaken: item.action,
        isToday: item.offset === 0,
      };
    });
  }, [selectedLocation]);

  // Average and peak risk over 7 days
  const averageRisk = useMemo(() => {
    const total = historyData.reduce((acc, curr) => acc + curr.riskScore, 0);
    return Math.round(total / historyData.length);
  }, [historyData]);

  const peakRisk = useMemo(() => {
    return Math.max(...historyData.map((d) => d.riskScore));
  }, [historyData]);

  // Simulated re-inference action
  const handleRecalculate = () => {
    setIsInferring(true);
    setTimeout(() => {
      setIsInferring(false);
      const now = new Date();
      setLastInferenceTime(`Sep 28, 2026, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST (Fresh Ingest)`);
    }, 650);
  };

  const currentScore = selectedLocation.riskScore;
  const currentRiskLevel = getRiskLevel(currentScore);
  const primaryColor = getRiskColor(currentScore);
  const secondaryColor = getRiskSecondaryColor(currentScore);
  const glowColor = getRiskGlow(currentScore);

  // Conic-gradient angle calculations for CSS
  // Using 360-degree circular dial gauge
  const scoreAngleDeg = (currentScore / 100) * 360;

  return (
    <div className="ai-prediction-page">
      {/* 1. Page Header */}
      <header className="ai-page-header">
        <div className="ai-header-left">
          <div className="ai-header-icon" title="BhuRakshak AI Brain">
            🤖
          </div>
          <div className="ai-header-titles">
            <h1>
              AI Risk Prediction Engine
              <span className="ai-header-version">Neural Net v3.2</span>
            </h1>
            <p>
              Autonomous real-time landslide susceptibility and early hazard forecasting powered by multi-sensor telemetry,
              hydro-geological modeling, and deep spatial neural networks across North-Eastern India.
            </p>
          </div>
        </div>

        <div className="ai-header-right">
          <div className="ai-status-pill">
            <span className="ai-status-dot"></span>
            Real-Time Inference Active
          </div>
          <button
            className="recalculate-btn"
            onClick={handleRecalculate}
            disabled={isInferring}
            title="Trigger instant neural network forward-pass"
          >
            {isInferring ? (
              <>
                <span className="spinner"></span>
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Run AI Inference</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. AI Model Info Banner */}
      <section className="model-info-banner">
        <div className="model-brand-col">
          <img src="/logo.jpg" alt="BhuRakshak AI" className="model-logo-thumb" />
          <div className="model-brand-text">
            <h3>
              <span>🧠</span> BhuRakshak Neural Network v3.2
            </h3>
            <p>Hybrid CNN-LSTM + Geospatial Attention Architecture</p>
          </div>
        </div>

        <div className="model-metric-card">
          <span className="metric-label">
            <span>🎯</span> Model Accuracy
          </span>
          <div className="metric-value accuracy-val">
            94.7%
            <span className="metric-sub">(F1: 0.938)</span>
          </div>
          <span className="metric-caption">Validated on 2021-2026 NER Event Catalog</span>
        </div>

        <div className="model-metric-card">
          <span className="metric-label">
            <span>📅</span> Last Trained
          </span>
          <div className="metric-value">Sep 28, 2026</div>
          <span className="metric-caption">Automated bi-weekly gradient tuning</span>
        </div>

        <div className="model-metric-card">
          <span className="metric-label">
            <span>📚</span> Training Dataset
          </span>
          <div className="metric-value">15,000+</div>
          <span className="metric-caption">Historical slope & telemetry records</span>
        </div>
      </section>

      {/* 3. Location Selector */}
      <section className="location-selector-card">
        <div className="selector-header-row">
          <div className="selector-label-group">
            <span className="selector-label-icon">📍</span>
            <div>
              <h3>Monitored Target Location</h3>
              <p>Select an active monitoring sector to compute deep hazard inference</p>
            </div>
          </div>

          <div className="selector-controls">
            <div className="location-dropdown-wrapper">
              <select
                id="location-select"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(Number(e.target.value))}
                aria-label="Select Monitored Location"
              >
                {monitoredLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} - {loc.district}, {loc.state} (Score: {loc.riskScore})
                  </option>
                ))}
              </select>
              <span className="dropdown-chevron">▼</span>
            </div>
          </div>
        </div>

        {/* Selected Location Metadata Strip */}
        <div className="location-meta-strip">
          <span className="meta-chip highlight">
            <span>🌐</span> Sector: <strong>{selectedLocation.name}</strong>
          </span>
          <span className="meta-chip">
            <span>🏛️</span> District & State:{' '}
            <strong>
              {selectedLocation.district}, {selectedLocation.state}
            </strong>
          </span>
          <span className="meta-chip">
            <span>🧭</span> Coordinates:{' '}
            <strong>
              {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
            </strong>
          </span>
          <span className="meta-chip">
            <span>⛰️</span> Elevation: <strong>{selectedLocation.elevation} m</strong>
          </span>
          <span className="meta-chip">
            <span>📐</span> Slope Incline: <strong>{selectedLocation.slope}°</strong>
          </span>
          <span className="meta-chip">
            <span>🕒</span> Telemetry Sync: <strong>{lastInferenceTime}</strong>
          </span>
        </div>
      </section>

      {/* 4. Prediction Dashboard Grid */}
      <div className="prediction-dashboard-grid">
        {/* Left Column: Risk Gauge, Confidence & Classification */}
        <div className="gauge-overview-card">
          <div className="card-title-bar">
            <h2>
              <span>🎯</span> AI Landslide Hazard Index
            </h2>
            <span className="live-indicator">
              <span className="live-dot"></span> LIVE GAUGING
            </span>
          </div>

          {/* 4.a Circular Gauge with CSS conic-gradient */}
          <div className="gauge-wrapper">
            <div
              className="circular-gauge"
              style={{
                background: `conic-gradient(from 0deg, ${primaryColor} 0deg, ${secondaryColor} ${scoreAngleDeg}deg, #e2e8f0 ${scoreAngleDeg}deg 360deg)`,
                boxShadow: `0 8px 30px ${glowColor}`,
              }}
            >
              <div className="gauge-inner-circle">
                <span className="gauge-center-icon">
                  {currentScore >= 80 ? '🚨' : currentScore >= 60 ? '⚠️' : currentScore >= 40 ? '⚡' : '🛡️'}
                </span>
                <span
                  className="gauge-score-value"
                  style={{ color: primaryColor }}
                >
                  {currentScore}
                </span>
                <span className="gauge-score-total">Risk Index / 100</span>
              </div>
            </div>
          </div>

          <div className="gauge-scale-ticks">
            <span>0 (Low)</span>
            <span>40 (Moderate)</span>
            <span>60 (High)</span>
            <span>100 (Critical)</span>
          </div>

          {/* 4.b Model Confidence Percentage */}
          <div className="confidence-box">
            <div className="confidence-header">
              <span className="confidence-label">
                <span>🤖</span> Model Confidence Score
              </span>
              <span className="confidence-percent">89%</span>
            </div>
            <div className="confidence-progress-bg">
              <div
                className="confidence-progress-fill"
                style={{ width: animateBars ? '89%' : '0%' }}
              ></div>
            </div>
            <div className="confidence-meta-info">
              <span>Standard Error: ±1.8%</span>
              <span>Bayesian Prior: 99.2% Robust</span>
            </div>
          </div>

          {/* 4.c Risk Classification Badge & Operational Protocol */}
          <div
            className={`classification-banner level-${currentRiskLevel.toLowerCase()}`}
          >
            <div className="classification-icon">
              {currentScore >= 80
                ? '🚨'
                : currentScore >= 60
                ? '⚠️'
                : currentScore >= 40
                ? '⚡'
                : '🛡️'}
            </div>
            <div className="classification-details">
              <div className="classification-top-row">
                <span className="classification-level-title">
                  {currentRiskLevel} Risk Classification
                </span>
                <span className="classification-tag">
                  {currentScore >= 80
                    ? 'Tier 1 Priority'
                    : currentScore >= 60
                    ? 'Tier 2 Alert'
                    : currentScore >= 40
                    ? 'Tier 3 Watch'
                    : 'Tier 4 Normal'}
                </span>
              </div>
              <p className="classification-desc">
                {currentScore >= 80 &&
                  'Extreme landslide susceptibility detected. Soil pore-water pressure exceeds critical shear thresholds. Structural slope rupture imminent.'}
                {currentScore >= 60 && currentScore < 80 &&
                  'Elevated probability of slope dislocation and debris flow. Continuous precipitation is saturating overburden layers.'}
                {currentScore >= 40 && currentScore < 60 &&
                  'Guarded stability profile. Moisture thresholds warrant heightened sensory surveillance and localized road clearance.'}
                {currentScore < 40 &&
                  'Slope equilibrium remains structurally sound. Geotechnical telemetry confirms all parameters within benign baseline bounds.'}
              </p>
            </div>
          </div>

          {/* Operational Protocol Recommendations */}
          <div className="operational-advisories">
            <div className="advisory-title">
              <span>📋</span> Standard Operating Protocol
            </div>
            <div className="advisory-items">
              {currentScore >= 80 ? (
                <>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🔴</span>
                    <span>NDRF & District Magistrate red alert dispatch recommended.</span>
                  </div>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🔴</span>
                    <span>Precautionary evacuation of vulnerable hillside settlements.</span>
                  </div>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🔴</span>
                    <span>Suspension of heavy vehicular freight on adjoining corridors.</span>
                  </div>
                </>
              ) : currentScore >= 60 ? (
                <>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🟠</span>
                    <span>PWD rapid action squads stationed at critical choke points.</span>
                  </div>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🟠</span>
                    <span>Telemetry frequency elevated to 2-minute sensor heartbeat.</span>
                  </div>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🟠</span>
                    <span>Real-time SMS broadcast to local panchayat heads.</span>
                  </div>
                </>
              ) : currentScore >= 40 ? (
                <>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🟡</span>
                    <span>Standard advisory watch on regional highway portals.</span>
                  </div>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🟡</span>
                    <span>Verification of slope drainage canals and culvert blockages.</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🟢</span>
                    <span>Continuous automated baseline telemetry logging.</span>
                  </div>
                  <div className="advisory-item">
                    <span className="advisory-bullet">🟢</span>
                    <span>Routine maintenance and sensor battery diagnostic cycle.</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Explanation, Contributing Factors & Trend Chart */}
        <div className="dashboard-right-col">
          {/* 4.d AI Explanation Card */}
          <section className="ai-explanation-card">
            <div className="explanation-header">
              <h3>
                <span>🧠</span> AI Multi-Variate Diagnostic Summary
              </h3>
              <span className="explanation-badge">Neural Explainability (SHAP Value Analysis)</span>
            </div>

            <p className="explanation-text">
              The <strong>BhuRakshak AI Engine</strong> evaluates{' '}
              <strong>{selectedLocation.name}</strong> ({selectedLocation.district},{' '}
              {selectedLocation.state}) with an overall vulnerability index of{' '}
              <strong style={{ color: primaryColor }}>
                {selectedLocation.riskScore}/100 ({currentRiskLevel})
              </strong>
              .{' '}
              {currentScore >= 75
                ? `Severe saturation is triggered by accumulated 24h precipitation of ${selectedLocation.rainfall}mm, driving soil moisture to ${selectedLocation.soilMoisture}%. On an incline of ${selectedLocation.slope}° at ${selectedLocation.elevation}m altitude, buoyant pore pressure severely compromises basal shear friction, making structural detachment highly probable.`
                : currentScore >= 50
                ? `The sector exhibits significant strain due to rainfall of ${selectedLocation.rainfall}mm and ${selectedLocation.soilMoisture}% soil moisture on a ${selectedLocation.slope}° incline. While structural bedrock remains cohesive, topsoil plasticity is approaching plastic limit thresholds.`
                : `Environmental indices reflect steady stability with rainfall at ${selectedLocation.rainfall}mm and soil moisture at ${selectedLocation.soilMoisture}%. The ${selectedLocation.slope}° slope profile maintains adequate shear resistance with minimal pore-water destabilization.`}
            </p>

            <div className="explanation-key-drivers">
              <div className="driver-pill">
                <div className="driver-icon-box">🌧️</div>
                <div className="driver-text">
                  <span className="driver-title">{selectedLocation.rainfall} mm</span>
                  <span className="driver-desc">24h Cumulative Rain</span>
                </div>
              </div>

              <div className="driver-pill">
                <div className="driver-icon-box">💧</div>
                <div className="driver-text">
                  <span className="driver-title">{selectedLocation.soilMoisture}%</span>
                  <span className="driver-desc">Volumetric Soil Saturation</span>
                </div>
              </div>

              <div className="driver-pill">
                <div className="driver-icon-box">📐</div>
                <div className="driver-text">
                  <span className="driver-title">{selectedLocation.slope}° Incline</span>
                  <span className="driver-desc">Terrain Slope Gradient</span>
                </div>
              </div>

              <div className="driver-pill">
                <div className="driver-icon-box">⛰️</div>
                <div className="driver-text">
                  <span className="driver-title">{selectedLocation.elevation} m</span>
                  <span className="driver-desc">Mean Sea Level (MSL)</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Contributing Factors with Animated Horizontal Bars */}
          <section className="factors-card">
            <div className="factors-header">
              <div>
                <h3>
                  <span>📊</span> Model Feature Importance & Contributing Factors
                </h3>
                <span className="factors-subtext">
                  Weighted factor contributions dynamically calculated for {selectedLocation.name}
                </span>
              </div>
            </div>

            <div className="factors-list">
              {locationFactors.map((item, idx) => {
                const factorIcons = {
                  'Rainfall Intensity': '🌧️',
                  'Soil Moisture': '💧',
                  'Slope Gradient': '📐',
                  'Geological Formation': '🪨',
                  'Vegetation Cover': '🌿',
                  'Historical Pattern': '📜',
                };
                const icon = factorIcons[item.factor] || '📌';

                return (
                  <div key={idx} className="factor-row">
                    <div className="factor-meta-top">
                      <div className="factor-name-group">
                        <span className="factor-icon">{icon}</span>
                        <span className="factor-name">{item.factor}</span>
                        <span className="factor-weight-tag">Weight: {item.weight}%</span>
                      </div>

                      <div className="factor-value-group">
                        <span className="factor-value-num">{item.value}/100</span>
                        <span className={`status-badge badge-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="factor-bar-track">
                      <div
                        className={`factor-bar-fill ${getBarFillClass(item.value)}`}
                        style={{
                          width: animateBars ? `${item.value}%` : '0%',
                          transitionDelay: `${idx * 80}ms`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 7. Risk Trend Mini Chart (CSS Bar Chart over last 7 days) */}
          <section className="trend-chart-card">
            <div className="trend-header-row">
              <div>
                <h3>
                  <span>📈</span> 7-Day Risk Score Trajectory
                </h3>
              </div>
              <div className="trend-stats-pills">
                <span className="trend-stat-chip">
                  7-Day Avg: <strong>{averageRisk}/100</strong>
                </span>
                <span className="trend-stat-chip">
                  Peak Risk: <strong>{peakRisk}/100</strong>
                </span>
                <span className="trend-stat-chip">
                  Trend:{' '}
                  <strong
                    style={{
                      color:
                        historyData[6].riskScore > historyData[0].riskScore
                          ? 'var(--danger)'
                          : 'var(--primary-green)',
                    }}
                  >
                    {historyData[6].riskScore > historyData[0].riskScore
                      ? `▲ +${historyData[6].riskScore - historyData[0].riskScore}% Escalation`
                      : '▼ Stabilizing'}
                  </strong>
                </span>
              </div>
            </div>

            <div className="chart-container-outer">
              {/* Threshold dashed line */}
              <div className="chart-threshold-guide">
                <span className="threshold-label">Critical Threshold (75+)</span>
              </div>

              {/* Pure CSS Bar Chart */}
              <div className="css-bar-chart">
                {historyData.map((d, index) => {
                  const barHeight = Math.max(12, d.riskScore);
                  return (
                    <div
                      key={index}
                      className={`chart-bar-column ${d.isToday ? 'is-today' : ''}`}
                    >
                      <div className="bar-tooltip">
                        <strong>{d.label}: {d.riskScore}/100</strong>
                        <div>Level: {d.riskLevel}</div>
                        <div>Conf: {d.confidence}</div>
                      </div>

                      <span className="bar-value-label">{d.riskScore}</span>

                      <div
                        className={`bar-pillar ${getChartBarClass(d.riskScore)}`}
                        style={{
                          height: animateBars ? `${barHeight}%` : '6%',
                          transitionDelay: `${index * 60}ms`,
                        }}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="chart-x-labels">
                {historyData.map((d, index) => (
                  <div
                    key={index}
                    className={`chart-x-col ${d.isToday ? 'today-label' : ''}`}
                  >
                    {d.label}
                    {d.isToday && <div>(Today)</div>}
                  </div>
                ))}
              </div>

              {/* Chart Legend */}
              <div className="chart-legend">
                <div className="legend-item">
                  <span
                    className="legend-color-dot"
                    style={{ background: '#e53935' }}
                  ></span>
                  <span>Critical (80-100)</span>
                </div>
                <div className="legend-item">
                  <span
                    className="legend-color-dot"
                    style={{ background: '#ff9800' }}
                  ></span>
                  <span>High (60-79)</span>
                </div>
                <div className="legend-item">
                  <span
                    className="legend-color-dot"
                    style={{ background: '#fbc02d' }}
                  ></span>
                  <span>Moderate (40-59)</span>
                </div>
                <div className="legend-item">
                  <span
                    className="legend-color-dot"
                    style={{ background: '#4caf50' }}
                  ></span>
                  <span>Low (0-39)</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 6. Prediction History Table */}
      <section className="history-table-card">
        <div className="table-header-bar">
          <div>
            <h3>
              <span>📜</span> Historical Inferences & Action Log (Last 7 Runs)
            </h3>
            <span className="table-meta-note">
              Complete automated inference audit trail for {selectedLocation.name}
            </span>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Risk Score</th>
                <th>Risk Classification</th>
                <th>Model Confidence</th>
                <th>Primary Contributing Factor</th>
                <th>Institutional Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {historyData
                .slice()
                .reverse()
                .map((row, idx) => (
                  <tr key={idx} className={row.isToday ? 'row-today' : ''}>
                    <td>
                      <div className="table-date-cell">
                        <span className="date-main">{row.date}</span>
                        <span className="date-rel">
                          {row.isToday ? 'Today (Latest Run)' : `${idx} day(s) ago`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`table-score-badge ${getRiskBadgeClass(
                          row.riskScore
                        )}`}
                      >
                        {row.riskScore}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getRiskBadgeClass(
                          row.riskScore
                        )}`}
                      >
                        {row.riskLevel}
                      </span>
                    </td>
                    <td>
                      <span className="confidence-chip">{row.confidence}</span>
                    </td>
                    <td>
                      <span className="factor-tag">{row.keyFactor}</span>
                    </td>
                    <td>
                      <span
                        className={`action-taken-badge ${
                          row.riskScore >= 80
                            ? 'critical-action'
                            : row.riskScore >= 60
                            ? 'high-action'
                            : ''
                        }`}
                      >
                        {row.riskScore >= 80
                          ? '🚨 '
                          : row.riskScore >= 60
                          ? '⚠️ '
                          : '✅ '}
                        {row.actionTaken}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
