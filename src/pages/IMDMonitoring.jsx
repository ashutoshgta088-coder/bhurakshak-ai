import { useState, useMemo } from 'react';
import { weatherData, sensorData } from '../data/mockData';
import './IMDMonitoring.css';

export default function IMDMonitoring() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [activeBarIndex, setActiveBarIndex] = useState(null);

  // 7-day rainfall forecast dataset specified: 380, 320, 290, 250, 180, 120, 90 mm
  const forecastDays = [
    { day: 'Mon', date: '29 Sep', rainfall: 380, alert: 'Red', condition: 'Extremely Heavy' },
    { day: 'Tue', date: '30 Sep', rainfall: 320, alert: 'Red', condition: 'Very Heavy' },
    { day: 'Wed', date: '01 Oct', rainfall: 290, alert: 'Orange', condition: 'Heavy Rain' },
    { day: 'Thu', date: '02 Oct', rainfall: 250, alert: 'Orange', condition: 'Moderate to Heavy' },
    { day: 'Fri', date: '03 Oct', rainfall: 180, alert: 'Yellow', condition: 'Scattered Showers' },
    { day: 'Sat', date: '04 Oct', rainfall: 120, alert: 'Yellow', condition: 'Light Rain' },
    { day: 'Sun', date: '05 Oct', rainfall: 90, alert: 'Green', condition: 'Isolated Passing Rain' },
  ];

  const maxForecastRainfall = 380; // for 100% chart scaling

  // Weather condition cards with large emoji icons
  const weatherConditionsList = [
    {
      icon: '🌧️',
      name: 'Heavy Rain',
      count: '3 Districts',
      level: 'red',
      desc: 'Sustained precipitation exceeding 15mm/hr. High soil saturation risk.',
      precip: '240 - 380 mm',
    },
    {
      icon: '⛈️',
      name: 'Thunderstorm',
      count: '2 Districts',
      level: 'orange',
      desc: 'Electrical activity with localized torrential bursts and slope wash.',
      precip: '190 - 260 mm',
    },
    {
      icon: '🌦️',
      name: 'Moderate Rain',
      count: '1 District',
      level: 'orange',
      desc: 'Intermittent precipitation with steady surface infiltration.',
      precip: '140 - 195 mm',
    },
    {
      icon: '🌧️',
      name: 'Light Rain',
      count: '2 Districts',
      level: 'yellow',
      desc: 'Continuous drizzle with slow groundwater percolation.',
      precip: '100 - 140 mm',
    },
    {
      icon: '🌤️',
      name: 'Partly Cloudy',
      count: '1 District',
      level: 'green',
      desc: 'Scattered cumulus clouds with dry spells allowing slope drying.',
      precip: '< 90 mm',
    },
    {
      icon: '🌫️',
      name: 'Mountain Mist',
      count: 'Ridge Passes',
      level: 'yellow',
      desc: 'Dense condensation at elevation >1400m, high ambient humidity.',
      precip: '85 - 95% RH',
    },
  ];

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
    }, 800);
  };

  // Filtered weather data based on search and alert pills
  const filteredWeatherData = useMemo(() => {
    return weatherData.filter((item) => {
      const matchesSearch =
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.condition.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAlert =
        selectedFilter === 'All' || item.alertLevel.toLowerCase() === selectedFilter.toLowerCase();

      return matchesSearch && matchesAlert;
    });
  }, [searchQuery, selectedFilter]);

  // Helper for alert badge styling
  const getAlertBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'red':
        return 'alert-badge-red';
      case 'orange':
        return 'alert-badge-orange';
      case 'yellow':
        return 'alert-badge-yellow';
      case 'green':
      default:
        return 'alert-badge-green';
    }
  };

  // Helper for condition icon
  const getConditionEmoji = (condition) => {
    if (!condition) return '🌧️';
    const lower = condition.toLowerCase();
    if (lower.includes('thunder')) return '⛈️';
    if (lower.includes('heavy')) return '🌧️';
    if (lower.includes('moderate')) return '🌧️';
    if (lower.includes('light')) return '🌦️';
    if (lower.includes('partly') || lower.includes('cloud')) return '🌤️';
    return '🌧️';
  };

  return (
    <div className="imd-monitoring-page">
      {/* 1. Page Header */}
      <div className="imd-header glass-card">
        <div className="imd-header-left">
          <div className="imd-header-icon" title="IMD Hydro-meteorological Radar">
            🌧️
          </div>
          <div className="imd-header-text">
            <h1>IMD Weather Monitoring</h1>
            <p>
              India Meteorological Department Doppler Radar Telemetry & Northeast Regional Hydrological Early Warning System
            </p>
          </div>
        </div>
        <div className="imd-header-actions">
          <div className="imd-live-pill">
            <span className="live-pulse-dot"></span>
            RADAR TELEMETRY LIVE
          </div>
          <button
            className={`imd-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            title="Refresh Doppler and AWS feeds"
          >
            <span className="refresh-icon">🔄</span>
            {isRefreshing ? 'Syncing...' : 'Sync Feed'}
          </button>
        </div>
      </div>

      {/* 2. Weather Summary Cards Row (4 cards) */}
      <div className="imd-summary-grid">
        {/* Card 1: Current Avg Temperature */}
        <div className="weather-stat-card temp-card glass-card">
          <div className="weather-stat-top">
            <span className="weather-stat-label">Current Avg Temperature</span>
            <div className="weather-stat-icon-wrap">🌡️</div>
          </div>
          <div className="weather-stat-value">22°C</div>
          <div className="weather-stat-footer">
            <span>Range: 8°C (Tawang) - 30°C (Tripura)</span>
            <span className="weather-stat-badge badge-temp">Nominal</span>
          </div>
        </div>

        {/* Card 2: Total Rainfall Today */}
        <div className="weather-stat-card rain-card glass-card">
          <div className="weather-stat-top">
            <span className="weather-stat-label">Total Rainfall Today</span>
            <div className="weather-stat-icon-wrap">🌧️</div>
          </div>
          <div className="weather-stat-value">245 mm</div>
          <div className="weather-stat-footer">
            <span>Peak: 380 mm (Cherrapunji)</span>
            <span className="weather-stat-badge badge-rain">Heavy Inflow</span>
          </div>
        </div>

        {/* Card 3: Avg Humidity */}
        <div className="weather-stat-card humidity-card glass-card">
          <div className="weather-stat-top">
            <span className="weather-stat-label">Avg Humidity</span>
            <div className="weather-stat-icon-wrap">💧</div>
          </div>
          <div className="weather-stat-value">82%</div>
          <div className="weather-stat-footer">
            <span>Peak: 95% (East Khasi Hills)</span>
            <span className="weather-stat-badge badge-humidity">High Saturation</span>
          </div>
        </div>

        {/* Card 4: Active Weather Alerts */}
        <div className="weather-stat-card alert-card glass-card">
          <div className="weather-stat-top">
            <span className="weather-stat-label">Active Weather Alerts</span>
            <div className="weather-stat-icon-wrap">🚨</div>
          </div>
          <div className="weather-stat-value">3</div>
          <div className="weather-stat-footer">
            <span>2 Red Alerts, 1 Orange Alert</span>
            <span className="weather-stat-badge badge-alert">Critical</span>
          </div>
        </div>
      </div>

      {/* 3. IMD Alert Banner */}
      <div className="imd-alert-banner">
        <div className="imd-alert-banner-header">
          <div className="imd-alert-tag">
            <span className="imd-alert-pulse"></span>
            IMD SPECIAL WEATHER BULLETIN • BULLETIN NO: RMC-GH-2026/09
          </div>
          <div className="imd-alert-timestamp">
            Valid: Next 24-48 Hours | Issued by IMD Regional Centre Guwahati
          </div>
        </div>

        <div className="imd-alert-main">
          <div className="imd-alert-icon">⚠️</div>
          <div className="imd-alert-body">
            <h2>RED ALERT: EXTREME HEAVY RAINFALL & FLASH FLOOD ADVISORY</h2>
            <p>
              Under the influence of a cyclonic circulation over the Bay of Bengal and steep moisture convergence, 
              extremely heavy precipitation (&gt;200mm to 380mm) is occurring over <strong>East Khasi Hills (Meghalaya)</strong>, 
              <strong>Silchar (Assam)</strong>, and <strong>East Sikkim</strong>. Extremely high probability of slope instability, 
              debris flows, and road blockages across NH-44, NH-6, and arterial hill routes.
            </p>
          </div>
        </div>

        <div className="imd-alert-points">
          <div className="imd-alert-point">
            <span>⛔</span>
            <span>Immediate traffic regulation on high slope corridors</span>
          </div>
          <div className="imd-alert-point">
            <span>🚨</span>
            <span>NDRF & State Disaster Response Forces placed on high standby</span>
          </div>
          <div className="imd-alert-point">
            <span>📡</span>
            <span>Automated rain gauges polling at 60-second intervals</span>
          </div>
        </div>
      </div>

      {/* 4 & 5. Forecast Bar Chart & Telemetry Split */}
      <div className="imd-grid-split">
        {/* Rainfall Forecast Chart */}
        <div className="forecast-chart-card glass-card">
          <div className="forecast-header">
            <div className="forecast-title">
              <span style={{ fontSize: '1.4rem' }}>📊</span>
              <div>
                <h3>7-Day Rainfall Forecast (IMD Numerical Weather Prediction)</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Multi-model ensemble precipitation projection for Northeast Hill Region
                </span>
              </div>
            </div>
            <div className="forecast-legend">
              <div className="legend-item">
                <span className="legend-swatch swatch-extreme"></span>
                <span>&gt;300mm (Red)</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-heavy"></span>
                <span>200-300mm (Orange)</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-moderate"></span>
                <span>100-200mm (Yellow)</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-light"></span>
                <span>&lt;100mm (Green)</span>
              </div>
            </div>
          </div>

          {/* CSS Bar Chart */}
          <div className="css-bar-chart-container">
            {/* Danger mark threshold guide line */}
            <div className="chart-threshold-guide" style={{ top: `${100 - (200 / maxForecastRainfall) * 100}%` }}>
              <span>⚠️ Landslide Threshold (200 mm)</span>
            </div>

            <div className="chart-bars-wrap">
              {forecastDays.map((item, index) => {
                const heightPercent = Math.round((item.rainfall / maxForecastRainfall) * 100);
                const barClass =
                  item.rainfall >= 300
                    ? 'bar-extreme'
                    : item.rainfall >= 200
                    ? 'bar-heavy'
                    : item.rainfall >= 100
                    ? 'bar-moderate'
                    : 'bar-light';

                return (
                  <div
                    key={item.day}
                    className="chart-bar-column"
                    onMouseEnter={() => setActiveBarIndex(index)}
                    onMouseLeave={() => setActiveBarIndex(null)}
                    title={`${item.day} (${item.date}): ${item.rainfall} mm - ${item.condition}`}
                  >
                    <span className="bar-val-badge">{item.rainfall} mm</span>
                    <div
                      className={`chart-bar-fill ${barClass}`}
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* Labels Row */}
            <div className="chart-labels-row">
              {forecastDays.map((item) => (
                <div key={item.day} className="chart-label-item">
                  <span className="chart-label-day">{item.day}</span>
                  <span className="chart-label-sub">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doppler Radar & Precipitation Telemetry Side Card */}
        <div className="imd-telemetry-side">
          <div className="radar-status-card glass-card">
            <div className="radar-header">
              <h4>
                <span>📡</span> Doppler Radar (S-Band)
              </h4>
              <span className="badge badge-success">ACTIVE TRACKING</span>
            </div>

            {/* Animated Radar Sweep Visual */}
            <div className="radar-screen">
              <div className="radar-grid-lines"></div>
              <div className="radar-sweep"></div>
              <div className="radar-center-point"></div>
              <div className="radar-blip blip-1" title="Cherrapunji Cell (Echo: 54 dBZ)"></div>
              <div className="radar-blip blip-2" title="Silchar Valley Cell (Echo: 48 dBZ)"></div>
              <div className="radar-blip blip-3" title="East Sikkim Ridge (Echo: 45 dBZ)"></div>
            </div>

            <div className="radar-stats-list">
              <div className="radar-stat-item">
                <span>Radar Station:</span>
                <span>Guwahati Airport (DWR)</span>
              </div>
              <div className="radar-stat-item">
                <span>Echo Intensity (Max):</span>
                <span style={{ color: 'var(--danger)' }}>54 dBZ (Severe)</span>
              </div>
              <div className="radar-stat-item">
                <span>Precipitation Cloud Base:</span>
                <span>450 m AGL</span>
              </div>
              <div className="radar-stat-item">
                <span>Cloud Drift Velocity:</span>
                <span>28 km/h North-East</span>
              </div>
              <div className="radar-stat-item">
                <span>Last Telemetry Sync:</span>
                <span style={{ color: 'var(--primary-green)' }}>{lastRefreshed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Weather Condition Icons */}
      <div className="conditions-section">
        <div className="section-title">
          <span>🌦️</span> Regional Weather Conditions & Ground Impact
        </div>
        <div className="conditions-grid">
          {weatherConditionsList.map((cond, idx) => (
            <div key={idx} className="condition-card glass-card">
              <div className="condition-icon-large">{cond.icon}</div>
              <div className="condition-name">{cond.name}</div>
              <span className={`condition-count count-${cond.level}`}>
                {cond.count}
              </span>
              <p className="condition-desc">{cond.desc}</p>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {cond.precip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. District-wise Weather Table */}
      <div className="weather-table-card glass-card">
        <div className="table-header-controls">
          <div className="table-title-wrap">
            <span style={{ fontSize: '1.4rem' }}>🗺️</span>
            <div>
              <h3>District-wise Weather Observation Table</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Automated Weather Station (AWS) network feeds across Northeast states
              </span>
            </div>
          </div>

          <div className="table-filters">
            {/* Search Input */}
            <div className="table-search-input">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search district or state..."
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

            {/* Alert Level Filter Pills */}
            <div className="alert-filter-pills">
              {['All', 'Red', 'Orange', 'Yellow', 'Green'].map((level) => (
                <button
                  key={level}
                  className={`filter-pill ${
                    selectedFilter === level ? `active pill-${level.toLowerCase()}` : ''
                  }`}
                  onClick={() => setSelectedFilter(level)}
                >
                  {level === 'All' ? 'All Alerts' : `${level}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive">
          <table className="imd-data-table">
            <thead>
              <tr>
                <th>District</th>
                <th>State</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Rainfall (mm)</th>
                <th>Wind Speed</th>
                <th>Condition</th>
                <th>Alert Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredWeatherData.length > 0 ? (
                filteredWeatherData.map((item, index) => {
                  const rainfallPercent = Math.min(100, Math.round((item.rainfall / 400) * 100));
                  const isExtreme = item.rainfall >= 250;
                  const isHeavy = item.rainfall >= 180 && item.rainfall < 250;

                  return (
                    <tr key={index}>
                      <td>
                        <div className="district-cell">
                          <span>📍</span>
                          <span>{item.district}</span>
                        </div>
                      </td>
                      <td>
                        <span className="state-badge">{item.state}</span>
                      </td>
                      <td className="temp-cell">{item.temp}°C</td>
                      <td className="humidity-cell">{item.humidity}%</td>
                      <td>
                        <div className="rainfall-cell-wrap">
                          <strong style={{ minWidth: '55px' }}>{item.rainfall} mm</strong>
                          <div className="rainfall-bar-bg" title={`${item.rainfall} mm recorded`}>
                            <div
                              className={`rainfall-bar-fill ${
                                isExtreme ? 'extreme' : isHeavy ? 'heavy' : ''
                              }`}
                              style={{ width: `${rainfallPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>{item.windSpeed} km/h</td>
                      <td>
                        <div className="condition-pill">
                          <span>{getConditionEmoji(item.condition)}</span>
                          <span>{item.condition}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`alert-badge ${getAlertBadgeClass(item.alertLevel)}`}>
                          ● {item.alertLevel} Alert
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                    🔍 No districts match the filter criteria "{searchQuery || selectedFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-info">
          <span>
            Showing <strong>{filteredWeatherData.length}</strong> of <strong>{weatherData.length}</strong> monitored districts
          </span>
          <span>Source: IMD Automated Weather Stations (AWS) & Doppler Radar Mesh</span>
        </div>
      </div>
    </div>
  );
}
