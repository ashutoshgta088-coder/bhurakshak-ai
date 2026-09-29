import { useState, useMemo } from 'react';
import { sensorData, weatherData } from '../data/mockData';
import './SensorMonitoring.css';

export default function SensorMonitoring() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [selectedSensorModal, setSelectedSensorModal] = useState(null);

  // Type counts for filter pills
  const typeCounts = useMemo(() => {
    return {
      All: sensorData.length,
      'Soil Moisture': sensorData.filter((s) => s.type === 'Soil Moisture').length,
      Rainfall: sensorData.filter((s) => s.type === 'Rainfall').length,
      'Ground Movement': sensorData.filter((s) => s.type === 'Ground Movement').length,
    };
  }, []);

  // Filter sensor data based on Type, Status and Search query
  const filteredSensors = useMemo(() => {
    return sensorData.filter((sensor) => {
      const matchesType = selectedType === 'All' || sensor.type === selectedType;
      const matchesStatus =
        selectedStatus === 'All' || sensor.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchesSearch =
        sensor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sensor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sensor.type.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [selectedType, selectedStatus, searchQuery]);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime('Just now');
    }, 700);
  };

  // Helper for sensor type icons & metadata
  const getTypeMeta = (type) => {
    switch (type) {
      case 'Soil Moisture':
        return {
          icon: '🌱',
          label: 'Volumetric Water Content',
          boxClass: 'icon-soil',
          metricDesc: 'Subsurface Saturation',
        };
      case 'Rainfall':
        return {
          icon: '🌧️',
          label: 'Tipping Bucket Rain Gauge',
          boxClass: 'icon-rain',
          metricDesc: 'Cumulative 24h Precipitation',
        };
      case 'Ground Movement':
        return {
          icon: '📐',
          label: 'Inclinometer / Extensometer',
          boxClass: 'icon-ground',
          metricDesc: 'Displacement Velocity',
        };
      default:
        return {
          icon: '📡',
          label: 'Telemetry Node',
          boxClass: 'icon-soil',
          metricDesc: 'Telemetry Reading',
        };
    }
  };

  // Battery color coding specified: >70% green, 30-70% yellow, <30% red
  const getBatteryClass = (battery) => {
    if (battery > 70) return 'battery-high';
    if (battery >= 30) return 'battery-med';
    return 'battery-low';
  };

  const getBatteryLabel = (battery) => {
    if (battery > 70) return `${battery}% (Good)`;
    if (battery >= 30) return `${battery}% (Fair)`;
    return `${battery}% (Low)`;
  };

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'online':
        return 'status-online';
      case 'warning':
        return 'status-warning';
      case 'offline':
      default:
        return 'status-offline';
    }
  };

  // Value color styling based on risk severity
  const getValueColorClass = (sensor) => {
    if (sensor.status === 'Offline') return 'val-red';
    if (sensor.type === 'Soil Moisture' && sensor.value > 85) return 'val-red';
    if (sensor.type === 'Soil Moisture' && sensor.value > 70) return 'val-yellow';
    if (sensor.type === 'Rainfall' && sensor.value > 250) return 'val-red';
    if (sensor.type === 'Rainfall' && sensor.value > 150) return 'val-yellow';
    if (sensor.type === 'Ground Movement' && sensor.value >= 2.5) return 'val-red';
    if (sensor.type === 'Ground Movement' && sensor.value >= 1.5) return 'val-yellow';
    return 'val-blue';
  };

  return (
    <div className="sensor-monitoring-page">
      {/* 1. Page Header */}
      <div className="sensor-header glass-card">
        <div className="sensor-header-left">
          <div className="sensor-header-icon" title="Geotechnical IoT Sensor Array">
            📡
          </div>
          <div className="sensor-header-text">
            <h1>Sensor Monitoring Network</h1>
            <p>
              Autonomous Geotechnical IoT Telemetry: Borehole Piezometers, Inclinometers, and Automated Rain Gauges
            </p>
          </div>
        </div>

        <div className="sensor-header-actions">
          {/* 6. Live Data Indicator */}
          <div className="sensor-live-indicator">
            <span className="pulse-beacon-dot"></span>
            LIVE DATA FEED
          </div>

          <button
            className={`sensor-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            title="Poll all LoRaWAN and 4G IoT Gateway Nodes"
          >
            <span className="refresh-icon">🔄</span>
            {isRefreshing ? 'Polling Network...' : 'Refresh Nodes'}
          </button>
        </div>
      </div>

      {/* 2. Sensor Summary Cards (4 Cards) */}
      <div className="sensor-summary-grid">
        {/* Card 1: Total Sensors (12) */}
        <div className="sensor-summary-card total-card glass-card">
          <div className="summary-card-header">
            <span className="summary-card-title">Total Sensors</span>
            <div className="summary-card-icon">📡</div>
          </div>
          <div className="summary-card-value">12</div>
          <div className="summary-card-footer">
            <span>Deployed in 8 High-Risk Zones</span>
            <span className="summary-badge summary-badge-blue">100% Deployed</span>
          </div>
        </div>

        {/* Card 2: Online (10 - green) */}
        <div className="sensor-summary-card online-card glass-card">
          <div className="summary-card-header">
            <span className="summary-card-title">Online</span>
            <div className="summary-card-icon">✅</div>
          </div>
          <div className="summary-card-value">10</div>
          <div className="summary-card-footer">
            <span>Nominal Telemetry Ping</span>
            <span className="summary-badge summary-badge-green">Operational</span>
          </div>
        </div>

        {/* Card 3: Warning (2 - yellow) */}
        <div className="sensor-summary-card warning-card glass-card">
          <div className="summary-card-header">
            <span className="summary-card-title">Warning</span>
            <div className="summary-card-icon">⚠️</div>
          </div>
          <div className="summary-card-value">2</div>
          <div className="summary-card-footer">
            <span>RF-003 (Rain) & GM-003 (Shear)</span>
            <span className="summary-badge summary-badge-yellow">Attention Req</span>
          </div>
        </div>

        {/* Card 4: Offline (1 - red) */}
        <div className="sensor-summary-card offline-card glass-card">
          <div className="summary-card-header">
            <span className="summary-card-title">Offline</span>
            <div className="summary-card-icon">❌</div>
          </div>
          <div className="summary-card-value">1</div>
          <div className="summary-card-footer">
            <span>SM-005 (Tawang Pass)</span>
            <span className="summary-badge summary-badge-red">Battery &lt;15%</span>
          </div>
        </div>
      </div>

      {/* 3. Sensor Type Filter & Search Controls */}
      <div className="sensor-filters-wrap glass-card">
        <div className="type-filter-group">
          <span className="type-filter-label">
            <span>🔍</span> Filter Type:
          </span>
          <button
            className={`type-filter-btn ${selectedType === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedType('All')}
          >
            <span>🌐</span> All Types
            <span className="filter-count">{typeCounts.All}</span>
          </button>
          <button
            className={`type-filter-btn ${selectedType === 'Soil Moisture' ? 'active' : ''}`}
            onClick={() => setSelectedType('Soil Moisture')}
          >
            <span>🌱</span> Soil Moisture
            <span className="filter-count">{typeCounts['Soil Moisture']}</span>
          </button>
          <button
            className={`type-filter-btn ${selectedType === 'Rainfall' ? 'active' : ''}`}
            onClick={() => setSelectedType('Rainfall')}
          >
            <span>🌧️</span> Rainfall
            <span className="filter-count">{typeCounts.Rainfall}</span>
          </button>
          <button
            className={`type-filter-btn ${selectedType === 'Ground Movement' ? 'active' : ''}`}
            onClick={() => setSelectedType('Ground Movement')}
          >
            <span>📐</span> Ground Movement
            <span className="filter-count">{typeCounts['Ground Movement']}</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="sensor-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search sensor ID or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 4. Sensor Data Grid */}
      <div className="sensor-data-grid">
        {filteredSensors.length > 0 ? (
          filteredSensors.map((sensor) => {
            const meta = getTypeMeta(sensor.type);
            const statusClass = `card-${sensor.status.toLowerCase()}`;
            const batteryFillClass = getBatteryClass(sensor.battery);

            return (
              <div key={sensor.id} className={`sensor-card ${statusClass} glass-card`}>
                <div>
                  {/* Card Top: ID, Type Icon & Status Badge */}
                  <div className="sensor-card-top">
                    <div className="sensor-badge-group">
                      <div className={`sensor-type-icon-box ${meta.boxClass}`} title={sensor.type}>
                        {meta.icon}
                      </div>
                      <div className="sensor-identity">
                        <span className="sensor-id-text">{sensor.id}</span>
                        <span className="sensor-type-label">{sensor.type}</span>
                      </div>
                    </div>
                    <span className={`sensor-status-badge ${getStatusBadgeClass(sensor.status)}`}>
                      <span className="status-dot-sm"></span>
                      {sensor.status}
                    </span>
                  </div>

                  {/* Location Info */}
                  <div className="sensor-location-row">
                    <span>📍</span>
                    <span>{sensor.location}</span>
                  </div>

                  {/* Current Value with Unit */}
                  <div className="sensor-value-block">
                    <span className={`sensor-val-number ${getValueColorClass(sensor)}`}>
                      {sensor.value}
                    </span>
                    <span className="sensor-val-unit">{sensor.unit}</span>
                  </div>
                  <div className="sensor-metric-name">{meta.metricDesc}</div>
                </div>

                <div>
                  {/* Battery Level Progress Bar */}
                  <div className="sensor-battery-section">
                    <div className="battery-header">
                      <span>🔋 Battery Charge</span>
                      <span>{getBatteryLabel(sensor.battery)}</span>
                    </div>
                    <div className="battery-track">
                      <div
                        className={`battery-bar-fill ${batteryFillClass}`}
                        style={{ width: `${Math.min(100, Math.max(5, sensor.battery))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Last Reading & Telemetry Footer */}
                  <div className="sensor-card-footer">
                    <div className="reading-timestamp">
                      <span>⏱️</span>
                      <span>{sensor.lastReading}</span>
                    </div>
                    <div className="signal-strength">
                      <span>📶</span>
                      <span>{sensor.status === 'Offline' ? 'No Link' : '4G LTE (Nominal)'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="sensor-empty-state">
            <div style={{ fontSize: '2.5rem' }}>🔍</div>
            <h3>No Sensors Found</h3>
            <p>
              No sensor nodes matched the current filter: type "{selectedType}" and query "{searchQuery}".
            </p>
            <button
              className="type-filter-btn"
              style={{ marginTop: '14px', display: 'inline-flex' }}
              onClick={() => {
                setSelectedType('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 5. Sensor Health Overview Summary Table */}
      <div className="sensor-health-card glass-card">
        <div className="sensor-health-header">
          <div className="sensor-health-title">
            <span style={{ fontSize: '1.4rem' }}>🛠️</span>
            <div>
              <h3>Sensor Health & Telemetry Diagnostics Overview</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Hardware diagnostics, LoRaWAN / Cellular RSSI metrics & calibration intervals
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Network Sync: <strong>{lastSyncTime}</strong> | Packet Reliability: <strong>99.6%</strong>
          </div>
        </div>

        <div className="table-responsive-health">
          <table className="sensor-health-table">
            <thead>
              <tr>
                <th>Sensor ID</th>
                <th>Subsystem Type</th>
                <th>Installation Zone</th>
                <th>Latest Telemetry</th>
                <th>Battery Level</th>
                <th>Signal (RSSI)</th>
                <th>Health Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sensorData.map((sensor) => {
                const meta = getTypeMeta(sensor.type);
                const batteryFill = getBatteryClass(sensor.battery);
                const isNominal = sensor.status === 'Online';
                const isWarning = sensor.status === 'Warning';

                return (
                  <tr key={sensor.id}>
                    <td>
                      <strong style={{ color: 'var(--dark-blue)' }}>{sensor.id}</strong>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span>{meta.icon}</span>
                        <span>{sensor.type}</span>
                      </span>
                    </td>
                    <td>📍 {sensor.location}</td>
                    <td>
                      <strong>
                        {sensor.value} {sensor.unit}
                      </strong>
                    </td>
                    <td>
                      <div className="battery-cell-wrap">
                        <div className="mini-battery-track">
                          <div
                            className={`battery-bar-fill ${batteryFill}`}
                            style={{ width: `${sensor.battery}%` }}
                          ></div>
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>{sensor.battery}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {sensor.status === 'Offline' ? 'Disconnected' : '-72 dBm'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`health-status-pill ${
                          isNominal
                            ? 'health-nominal'
                            : isWarning
                            ? 'health-warning'
                            : 'health-critical'
                        }`}
                      >
                        {isNominal ? '● Operational' : isWarning ? '▲ High Load' : '✕ Fault State'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="health-action-btn"
                        onClick={() => alert(`Diagnostics initiated for ${sensor.id} at ${sensor.location}`)}
                      >
                        Diagnostics
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
