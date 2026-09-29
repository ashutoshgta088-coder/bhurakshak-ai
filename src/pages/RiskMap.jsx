import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { monitoredLocations, nerStates } from '../data/mockData';
import './RiskMap.css';

// Circular Progress Gauge Component (CSS/SVG only, no libraries)
function CircularGauge({ score, riskLevel }) {
  const size = 52;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'var(--danger)';
      case 'High':
        return 'var(--warning)';
      case 'Moderate':
        return '#f59e0b';
      case 'Low':
        return 'var(--success)';
      default:
        return 'var(--primary-green)';
    }
  };

  const strokeColor = getColor(riskLevel);

  return (
    <div className="circular-gauge-wrapper" style={{ width: size, height: size }}>
      <svg className="gauge-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="gauge-inner-text">
        <span className="gauge-inner-val" style={{ color: strokeColor }}>
          {score}
        </span>
        <span className="gauge-inner-lbl">risk</span>
      </div>
    </div>
  );
}

export default function RiskMap() {
  // Filter States
  const [selectedState, setSelectedState] = useState('All');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Map States
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState('terrain'); // 'terrain' | 'satellite' | 'topographic'
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1); // 1, 1.2, 1.4

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedState('All');
    setSelectedRiskLevel('All');
    setSearchQuery('');
  };

  // Filtered Locations List
  const filteredLocations = useMemo(() => {
    return monitoredLocations.filter((loc) => {
      const matchState =
        selectedState === 'All' || loc.state.toLowerCase() === selectedState.toLowerCase();
      const matchRisk =
        selectedRiskLevel === 'All' || loc.riskLevel.toLowerCase() === selectedRiskLevel.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.state.toLowerCase().includes(searchQuery.toLowerCase());

      return matchState && matchRisk && matchSearch;
    });
  }, [selectedState, selectedRiskLevel, searchQuery]);

  // Overall statistics for summary bar
  const totalLocationsCount = monitoredLocations.length;
  const criticalCount = monitoredLocations.filter((l) => l.riskLevel === 'Critical').length;
  const highCount = monitoredLocations.filter((l) => l.riskLevel === 'High').length;
  const moderateCount = monitoredLocations.filter((l) => l.riskLevel === 'Moderate').length;
  const lowCount = monitoredLocations.filter((l) => l.riskLevel === 'Low').length;

  // Projection formula for positioning markers on the simulated North-East India map
  // Bound: Lat 23.0 to 28.2 N, Lng 88.0 to 95.0 E
  const getMarkerPosition = (lat, lng, locId) => {
    const minLat = 23.0;
    const maxLat = 28.2;
    const minLng = 88.0;
    const maxLng = 95.0;

    let left = 8 + ((lng - minLng) / (maxLng - minLng)) * 82;
    let top = 10 + ((maxLat - lat) / (maxLat - minLat)) * 78;

    // Fine-tune offset to prevent direct overlap between Mawsynram and Cherrapunji
    if (locId === 3) {
      left -= 2.2;
      top -= 2.0;
    }

    return {
      left: `${Math.max(6, Math.min(94, left))}%`,
      top: `${Math.max(8, Math.min(90, top))}%`,
    };
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'var(--danger)';
      case 'High':
        return 'var(--warning)';
      case 'Moderate':
        return '#f59e0b';
      case 'Low':
        return 'var(--success)';
      default:
        return 'var(--primary-green)';
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(1.4, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(1, Number((prev - 0.15).toFixed(2))));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setSelectedLocation(null);
  };

  return (
    <div className="risk-map-container">
      {/* 1. Header Section */}
      <header className="risk-map-header">
        <div className="risk-map-title-group">
          <div className="risk-map-badge-title">
            <h1>
              <span className="risk-map-title-icon">🗺️</span>
              GIS Risk Map
            </h1>
            <span className="live-telemetry-badge">
              <span className="pulse-dot"></span>
              Live Spatial Feed
            </span>
          </div>
          <p className="risk-map-subtitle">
            Geospatial Landslide Susceptibility & Early Warning Mapping across 8 North-Eastern States.
            Integrating real-time IMD precipitation grids, IoT sensor telemetry, and AI hazard prediction.
          </p>
        </div>

        <div className="header-meta-stats">
          <div className="meta-chip">
            <span className="meta-chip-label">Datum:</span>
            <span className="meta-chip-val">WGS84 / EPSG:4326</span>
          </div>
          <div className="meta-chip">
            <span className="meta-chip-label">Monitored Zones:</span>
            <span className="meta-chip-val">{totalLocationsCount}</span>
          </div>
          <div className="meta-chip">
            <span className="meta-chip-label">Sensor Telemetry:</span>
            <span className="meta-chip-val" style={{ color: 'var(--success)' }}>
              100% Online
            </span>
          </div>
        </div>
      </header>

      {/* 2. Filters Bar */}
      <section className="risk-map-filters-card">
        <div className="filters-wrapper">
          <div className="filters-left">
            {/* State filter */}
            <div className="filter-group">
              <label htmlFor="state-filter" className="filter-label">
                State:
              </label>
              <select
                id="state-filter"
                className="filter-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="All">All NER States (8)</option>
                {nerStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Level filter */}
            <div className="filter-group">
              <label htmlFor="risk-filter" className="filter-label">
                Risk Level:
              </label>
              <select
                id="risk-filter"
                className="filter-select"
                value={selectedRiskLevel}
                onChange={(e) => setSelectedRiskLevel(e.target.value)}
              >
                <option value="All">All Risk Levels</option>
                <option value="Critical">🔴 Critical Risk (80-100)</option>
                <option value="High">🟠 High Risk (60-79)</option>
                <option value="Moderate">🟡 Moderate Risk (31-59)</option>
                <option value="Low">🟢 Low Risk (0-30)</option>
              </select>
            </div>

            {/* Location Search Input */}
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search location or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="filters-right">
            <div className="filter-count-badge">
              Showing <span className="filter-count-highlight">{filteredLocations.length}</span> of{' '}
              {totalLocationsCount} locations
            </div>
            {(selectedState !== 'All' || selectedRiskLevel !== 'All' || searchQuery !== '') && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={handleResetFilters}
                title="Reset all filters"
              >
                <span>🔄</span> Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Main Content: Simulated Map Area + Location Cards Panel */}
      <div className="risk-map-main-grid">
        {/* Map Area */}
        <section className="gis-map-card">
          {/* Top Map Toolbar Controls */}
          <div className="gis-map-toolbar">
            <div className="toolbar-group-left">
              {/* Map Layer Selectors */}
              <button
                type="button"
                className={`map-control-btn ${mapStyle === 'terrain' ? 'active' : ''}`}
                onClick={() => setMapStyle('terrain')}
              >
                🏔️ Terrain Relief
              </button>
              <button
                type="button"
                className={`map-control-btn ${mapStyle === 'satellite' ? 'active' : ''}`}
                onClick={() => setMapStyle('satellite')}
              >
                🛰️ Satellite View
              </button>
              <button
                type="button"
                className={`map-control-btn ${mapStyle === 'topographic' ? 'active' : ''}`}
                onClick={() => setMapStyle('topographic')}
              >
                📐 Topographic
              </button>

              {/* Heatmap Toggle */}
              <button
                type="button"
                className={`map-control-btn ${showHeatmap ? 'active' : ''}`}
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                🔥 {showHeatmap ? 'Heatmap: ON' : 'Heatmap: OFF'}
              </button>

              {/* Grid Toggle */}
              <button
                type="button"
                className={`map-control-btn ${showGrid ? 'active' : ''}`}
                onClick={() => setShowGrid(!showGrid)}
              >
                🌐 {showGrid ? 'Grid' : 'No Grid'}
              </button>
            </div>

            <div className="toolbar-group-right">
              {/* Zoom Buttons */}
              <div className="map-zoom-controls">
                <button
                  type="button"
                  className="map-zoom-btn"
                  onClick={handleZoomIn}
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  className="map-zoom-btn"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                >
                  −
                </button>
              </div>

              {zoomLevel > 1 && (
                <button
                  type="button"
                  className="map-control-btn"
                  onClick={handleZoomReset}
                  title="Reset Zoom"
                >
                  ↺ 1x
                </button>
              )}

              {/* North Arrow Indicator */}
              <div className="compass-rose" title="Geographic Orientation">
                <span className="compass-arrow">▲</span>
                <span>N</span>
              </div>
            </div>
          </div>

          {/* Simulated Map Viewport */}
          <div
            className={`gis-canvas-viewport style-${mapStyle}`}
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: '50% 50%',
            }}
          >
            {/* Topography & Rivers SVG Layer */}
            <svg
              className="gis-terrain-svg"
              viewBox="0 0 1000 650"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4fc3f7" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0288d1" stopOpacity="0.8" />
                </linearGradient>
                <radialGradient id="mountainHimalaya" cx="40%" cy="20%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>

              {/* Himalayan Mountain Massif Shading in North */}
              <path
                d="M 50 160 Q 200 80 400 110 T 750 90 T 950 140 L 950 0 L 50 0 Z"
                fill="url(#mountainHimalaya)"
              />

              {/* Contour Elevation Curves */}
              <path
                d="M 70 180 Q 240 140 430 150 T 800 130 T 950 180"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4,4"
              />
              <path
                d="M 60 240 Q 280 200 500 220 T 850 190 T 960 250"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="3,3"
              />
              <path
                d="M 120 320 Q 320 280 540 290 T 840 270 T 940 330"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="4,4"
              />
              <path
                d="M 180 450 Q 380 420 570 410 T 800 440 T 920 480"
                stroke="rgba(255, 255, 255, 0.14)"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="3,3"
              />
              <path
                d="M 220 550 Q 420 520 620 510 T 820 530 T 920 580"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="4,4"
              />

              {/* Brahmaputra River Basin Flow Line */}
              <path
                d="M 940 160 C 820 180 720 210 580 230 C 440 250 360 280 290 340 C 230 400 210 460 200 580"
                stroke="url(#riverGrad)"
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Barak River Tributary */}
              <path
                d="M 780 430 Q 680 440 600 460 T 480 520 T 360 560"
                stroke="url(#riverGrad)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeOpacity="0.7"
              />
            </svg>

            {/* Latitude and Longitude Grid Lines Overlay */}
            {showGrid && (
              <div className="gis-grid-overlay">
                <div className="grid-cell">
                  <span className="lat-label">28.0° N</span>
                  <span className="lng-label">88.5° E</span>
                </div>
                <div className="grid-cell">
                  <span className="lng-label">89.8° E</span>
                </div>
                <div className="grid-cell">
                  <span className="lat-label">27.0° N</span>
                  <span className="lng-label">91.2° E</span>
                </div>
                <div className="grid-cell">
                  <span className="lng-label">92.5° E</span>
                </div>
                <div className="grid-cell">
                  <span className="lat-label">26.0° N</span>
                  <span className="lng-label">93.8° E</span>
                </div>
                <div className="grid-cell">
                  <span className="lng-label">95.0° E</span>
                </div>
                <div className="grid-cell">
                  <span className="lat-label">25.0° N</span>
                </div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell">
                  <span className="lat-label">24.0° N</span>
                </div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell">
                  <span className="lat-label">23.0° N</span>
                </div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
              </div>
            )}

            {/* NER State Geography Watermarks */}
            <span className="gis-state-watermark" style={{ left: '15%', top: '23%' }}>
              SIKKIM
            </span>
            <span className="gis-state-watermark" style={{ left: '60%', top: '16%' }}>
              ARUNACHAL PRADESH
            </span>
            <span className="gis-state-watermark" style={{ left: '66%', top: '35%' }}>
              ASSAM VALLEY
            </span>
            <span className="gis-state-watermark" style={{ left: '49%', top: '53%' }}>
              MEGHALAYA
            </span>
            <span className="gis-state-watermark" style={{ left: '84%', top: '44%' }}>
              NAGALAND
            </span>
            <span className="gis-state-watermark" style={{ left: '80%', top: '63%' }}>
              MANIPUR
            </span>
            <span className="gis-state-watermark" style={{ left: '44%', top: '77%' }}>
              TRIPURA
            </span>
            <span className="gis-state-watermark" style={{ left: '65%', top: '81%' }}>
              MIZORAM
            </span>

            {/* Heatmap Layer Overlays (Risk Clusters) */}
            {showHeatmap && (
              <div className="gis-heatmap-layer">
                {/* Cherrapunji / Mawsynram Zone (Highest Precipitation & Risk) */}
                <div
                  className="heat-spot critical"
                  style={{
                    left: '51%',
                    top: '54%',
                    width: '210px',
                    height: '210px',
                  }}
                />
                {/* NH-44 Barak Valley Zone (Critical) */}
                <div
                  className="heat-spot critical"
                  style={{
                    left: '64%',
                    top: '61%',
                    width: '170px',
                    height: '170px',
                  }}
                />
                {/* Gangtok-Nathula Pass (Critical) */}
                <div
                  className="heat-spot critical"
                  style={{
                    left: '15%',
                    top: '23%',
                    width: '160px',
                    height: '160px',
                  }}
                />
                {/* Kohima Ridge (High) */}
                <div
                  className="heat-spot high"
                  style={{
                    left: '80%',
                    top: '48%',
                    width: '150px',
                    height: '150px',
                  }}
                />
                {/* Aizawl Highway (High) */}
                <div
                  className="heat-spot high"
                  style={{
                    left: '63%',
                    top: '77%',
                    width: '130px',
                    height: '130px',
                  }}
                />
                {/* Shillong Peak (High) */}
                <div
                  className="heat-spot moderate"
                  style={{
                    left: '54%',
                    top: '49%',
                    width: '120px',
                    height: '120px',
                  }}
                />
              </div>
            )}

            {/* Location Markers */}
            {filteredLocations.map((loc) => {
              const position = getMarkerPosition(loc.lat, loc.lng, loc.id);
              const isSelected = selectedLocation?.id === loc.id;
              const markerColor = getRiskColor(loc.riskLevel);
              const isCriticalOrHigh = loc.riskLevel === 'Critical' || loc.riskLevel === 'High';

              return (
                <div
                  key={loc.id}
                  className={`gis-marker-container ${isSelected ? 'active-marker' : ''}`}
                  style={{ left: position.left, top: position.top }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(loc);
                  }}
                  title={`${loc.name} - Risk Score: ${loc.riskScore}`}
                >
                  <div className="marker-pin-wrapper">
                    {/* Pulsing warning radar ring */}
                    {isCriticalOrHigh && (
                      <div
                        className={`marker-pulse-ring ${
                          loc.riskLevel === 'Critical' ? 'pulse-critical' : 'pulse-high'
                        }`}
                      />
                    )}

                    {/* Pin Head */}
                    <div
                      className="marker-pin-head"
                      style={{
                        backgroundColor: markerColor,
                        boxShadow: isSelected
                          ? `0 0 16px 4px ${markerColor}`
                          : '0 4px 10px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      <span className="marker-pin-icon">
                        {loc.riskLevel === 'Critical' ? '!' : '●'}
                      </span>
                    </div>

                    {/* Small text pill */}
                    <span className="marker-title-tag">{loc.name.split(' ')[0]}</span>
                  </div>

                  {/* Interactive Map Callout Popup */}
                  {isSelected && (
                    <div
                      className="gis-map-callout"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="callout-header">
                        <div>
                          <div className="callout-title">{loc.name}</div>
                          <div className="callout-sub">
                            📍 {loc.district}, {loc.state}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="callout-close-btn"
                          onClick={() => setSelectedLocation(null)}
                          title="Close"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="callout-stats-grid">
                        <div className="callout-stat-box">
                          <span className="callout-stat-lbl">Risk Score</span>
                          <span
                            className="callout-stat-val"
                            style={{ color: markerColor }}
                          >
                            {loc.riskScore}/100 ({loc.riskLevel})
                          </span>
                        </div>
                        <div className="callout-stat-box">
                          <span className="callout-stat-lbl">Rainfall</span>
                          <span className="callout-stat-val">🌧️ {loc.rainfall} mm</span>
                        </div>
                        <div className="callout-stat-box">
                          <span className="callout-stat-lbl">Soil Moisture</span>
                          <span className="callout-stat-val">💧 {loc.soilMoisture}%</span>
                        </div>
                        <div className="callout-stat-box">
                          <span className="callout-stat-lbl">Elevation & Slope</span>
                          <span className="callout-stat-val">
                            ⛰️ {loc.elevation}m / {loc.slope}°
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/location-details/${loc.id}`}
                        className="callout-action-link"
                      >
                        View Geological Details →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map Footer Overlay Elements (Scale & Legend) */}
          <div className="gis-canvas-footer">
            {/* Map Scale bar */}
            <div className="map-scale-box">
              <span>Scale 1:500,000</span>
              <div className="scale-ruler"></div>
              <span>50 km | 31 mi</span>
            </div>

            {/* Map Legend Overlay */}
            <div className="gis-legend-overlay">
              <div className="legend-title">
                <span>🛡️</span> Hazard Classification
              </div>
              <div className="legend-items-list">
                <div className="legend-item-row">
                  <div className="legend-item-indicator">
                    <span
                      className="legend-color-dot"
                      style={{ backgroundColor: 'var(--danger)' }}
                    />
                    <span>Critical Risk</span>
                  </div>
                  <span className="legend-score-range">80-100</span>
                </div>
                <div className="legend-item-row">
                  <div className="legend-item-indicator">
                    <span
                      className="legend-color-dot"
                      style={{ backgroundColor: 'var(--warning)' }}
                    />
                    <span>High Risk</span>
                  </div>
                  <span className="legend-score-range">60-79</span>
                </div>
                <div className="legend-item-row">
                  <div className="legend-item-indicator">
                    <span
                      className="legend-color-dot"
                      style={{ backgroundColor: '#f59e0b' }}
                    />
                    <span>Moderate Risk</span>
                  </div>
                  <span className="legend-score-range">31-59</span>
                </div>
                <div className="legend-item-row">
                  <div className="legend-item-indicator">
                    <span
                      className="legend-color-dot"
                      style={{ backgroundColor: 'var(--success)' }}
                    />
                    <span>Low Risk</span>
                  </div>
                  <span className="legend-score-range">0-30</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Risk Heatmap Legend Bar (Bottom of Map Area) */}
          <div className="heatmap-gradient-bar-section">
            <div className="gradient-bar-header">
              <span className="gradient-title">
                <span>🌈</span> Multi-Factor Landslide Risk Heatmap Gradient
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Index: Cumulative Rainfall + Saturation + Slope Instability
              </span>
            </div>
            <div className="gradient-track"></div>
            <div className="gradient-labels-row">
              <div className="gradient-label-stop low">
                <span>Low Risk</span>
                <span>(0 - 30)</span>
              </div>
              <div className="gradient-label-stop moderate">
                <span>Moderate</span>
                <span>(31 - 59)</span>
              </div>
              <div className="gradient-label-stop high">
                <span>High</span>
                <span>(60 - 79)</span>
              </div>
              <div className="gradient-label-stop critical">
                <span>Critical Zone</span>
                <span>(80 - 100)</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Location Cards Panel (Right Sidebar on Desktop, Stacks on Mobile) */}
        <aside className="locations-panel-card">
          <div className="locations-panel-header">
            <h2 className="locations-panel-title">
              <span>📍</span> Monitored Sectors
            </h2>
            <span className="locations-panel-count">
              {filteredLocations.length} locations
            </span>
          </div>

          <div className="locations-list-scroll">
            {filteredLocations.length === 0 ? (
              <div className="locations-empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">No Locations Found</div>
                <p className="empty-state-msg">
                  No monitoring zones match your current search and filter criteria.
                </p>
                <button
                  type="button"
                  className="reset-filters-btn"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                const riskClass = loc.riskLevel.toLowerCase();

                return (
                  <div
                    key={loc.id}
                    className={`location-item-card risk-${riskClass} ${
                      isSelected ? 'selected-card' : ''
                    }`}
                    onClick={() => setSelectedLocation(loc)}
                  >
                    {/* Top Row: Location Name & Risk Badge */}
                    <div className="card-top-row">
                      <div className="card-name-group">
                        <h3 className="card-loc-name">{loc.name}</h3>
                        <div className="card-loc-sub">
                          <span>📍</span>
                          <span>
                            {loc.district}, {loc.state}
                          </span>
                        </div>
                      </div>
                      <span className={`badge-risk ${riskClass}`}>
                        {loc.riskLevel}
                      </span>
                    </div>

                    {/* Middle Row: Circular Gauge & Key Metrics */}
                    <div className="card-content-grid">
                      <CircularGauge score={loc.riskScore} riskLevel={loc.riskLevel} />
                      <div className="card-metrics-cols">
                        <div className="metric-item">
                          <span className="metric-lbl">🌧️ Rainfall</span>
                          <span className="metric-val">{loc.rainfall} mm</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-lbl">💧 Moisture</span>
                          <span className="metric-val">{loc.soilMoisture}%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-lbl">⛰️ Elevation</span>
                          <span className="metric-val">{loc.elevation} m</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-lbl">📐 Slope</span>
                          <span className="metric-val">{loc.slope}°</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Timestamp & View Details Link */}
                    <div className="card-action-row">
                      <span className="card-updated-time">
                        <span>🕒</span>
                        <span>{loc.lastUpdated.split(' ')[1]} IST</span>
                      </span>
                      <Link
                        to={`/location-details/${loc.id}`}
                        className="card-view-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>

      {/* 6. Summary Bar at Bottom */}
      <footer className="risk-map-summary-bar">
        <div className="summary-stats-cluster">
          {/* Total Locations */}
          <div className="summary-stat-card">
            <div className="summary-stat-icon-wrap total">📍</div>
            <div className="summary-stat-info">
              <span className="summary-stat-number">{totalLocationsCount}</span>
              <span className="summary-stat-label">Total Locations</span>
            </div>
          </div>

          {/* Critical Risk */}
          <div className="summary-stat-card">
            <div className="summary-stat-icon-wrap critical">🚨</div>
            <div className="summary-stat-info">
              <span className="summary-stat-number" style={{ color: 'var(--danger)' }}>
                {criticalCount}
              </span>
              <span className="summary-stat-label">Critical Zones</span>
            </div>
          </div>

          {/* High Risk */}
          <div className="summary-stat-card">
            <div className="summary-stat-icon-wrap high">⚠️</div>
            <div className="summary-stat-info">
              <span className="summary-stat-number" style={{ color: 'var(--warning)' }}>
                {highCount}
              </span>
              <span className="summary-stat-label">High Risk</span>
            </div>
          </div>

          {/* Moderate Risk */}
          <div className="summary-stat-card">
            <div className="summary-stat-icon-wrap moderate">⚡</div>
            <div className="summary-stat-info">
              <span className="summary-stat-number" style={{ color: '#d97706' }}>
                {moderateCount}
              </span>
              <span className="summary-stat-label">Moderate</span>
            </div>
          </div>

          {/* Low Risk */}
          <div className="summary-stat-card">
            <div className="summary-stat-icon-wrap low">🛡️</div>
            <div className="summary-stat-info">
              <span className="summary-stat-number" style={{ color: 'var(--success)' }}>
                {lowCount}
              </span>
              <span className="summary-stat-label">Low Risk</span>
            </div>
          </div>
        </div>

        <div className="summary-telemetry-meta">
          <div className="telemetry-system-tag">
            <span>⚙️</span>
            <span>Spatial Computation Engine v3.2</span>
          </div>
          <div className="telemetry-system-tag">
            <span>📡</span>
            <span>Real-time Telemetry: Live</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
