import { useState, useEffect } from 'react'
import { fetchMonitoredZones } from '../../api/apiClient.js'
import { KPI_DATA, RISK_COLOR_MAP, RISK_BADGE_CLASS } from '../../data/mockData.js'
import KPICard from '../../components/KPICard/KPICard.jsx'
import RiskMap from '../../components/RiskMap/RiskMap.jsx'
import GaugeChart from '../../components/GaugeChart/GaugeChart.jsx'
import SHAPChart from '../../components/SHAPChart/SHAPChart.jsx'
import AlertBanner from '../../components/AlertBanner/AlertBanner.jsx'
import './Dashboard.css'

const ENV_METRICS = [
  { key: 'rainfall', icon: '🌧️', label: 'Rainfall', unit: 'mm', color: '#38BDF8' },
  { key: 'slope', icon: '⛰️', label: 'Slope', unit: '°', color: '#F59E0B' },
  { key: 'soilMoisture', icon: '💧', label: 'Soil Moisture', unit: '%', color: '#10B981' },
  { key: 'elevation', icon: '📐', label: 'Elevation', unit: 'm', color: '#A78BFA' },
]

export default function Dashboard() {
  const [zones, setZones] = useState([])
  const [selectedZone, setSelectedZone] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMonitoredZones().then(data => {
      setZones(data)
      setSelectedZone(data[0])
      setLoading(false)
    })
  }, [])

  const handleZoneChange = (e) => {
    const zone = zones.find(z => z.id === parseInt(e.target.value))
    if (zone) setSelectedZone(zone)
  }

  const handleMapSelect = (zone) => setSelectedZone(zone)

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="loading-spinner" />
        <span>Loading terrain intelligence...</span>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Page Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">📊 Monitoring Command Center</h1>
            <p className="dash-subtitle">
              Real-time landslide risk intelligence — North Eastern Region
              <span className="live-indicator">
                <span className="pulse-dot" /> LIVE
              </span>
            </p>
          </div>
          <div className="dash-time">
            <span>🕐 {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
            <span className="text-muted">IST</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <KPICard
            icon="📍"
            label="Monitored Zones"
            value={KPI_DATA.totalZones}
            sub="Across 8 NER States"
            accent="#38BDF8"
          />
          <KPICard
            icon="⚠️"
            label="High & Very High Risk"
            value={KPI_DATA.highRiskZones}
            sub="Immediate attention required"
            accent="#EF4444"
            pulse
          />
          <KPICard
            icon="🔔"
            label="Active Advisories"
            value={`${KPI_DATA.activeAdvisories} Active`}
            sub="Issued in last 24 hours"
            accent="#F59E0B"
          />
          <KPICard
            icon="🌧️"
            label="Avg 24h Rainfall"
            value={`${KPI_DATA.avgRainfall} mm`}
            sub="NER composite average"
            accent="#10B981"
          />
        </div>

        {/* Main Grid */}
        <div className="dash-main-grid">
          {/* Left: Map */}
          <div className="dash-map-col">
            <RiskMap
              zones={zones}
              onSelect={handleMapSelect}
              selectedId={selectedZone?.id}
            />
          </div>

          {/* Right: Drilldown */}
          <div className="dash-drilldown-col">
            <div className="drilldown-card card">
              <div className="drilldown-header">
                <span className="drilldown-label">🎯 Zone Drilldown</span>
                <select
                  className="form-select drilldown-select"
                  value={selectedZone?.id || ''}
                  onChange={handleZoneChange}
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>

              {selectedZone && (
                <>
                  <div className="zone-info">
                    <div className="zone-info-name">{selectedZone.name}</div>
                    <div className="zone-info-sub">
                      {selectedZone.district}, {selectedZone.state}
                      <span className={`badge ${RISK_BADGE_CLASS[selectedZone.risk]}`} style={{ marginLeft: 8 }}>
                        {selectedZone.risk}
                      </span>
                    </div>
                  </div>

                  {/* Gauge */}
                  <GaugeChart
                    score={selectedZone.riskScore}
                    risk={selectedZone.risk}
                  />

                  <div className="divider" style={{ margin: '12px 0' }} />

                  {/* Env Metrics */}
                  <div className="env-grid">
                    {ENV_METRICS.map(m => (
                      <div key={m.key} className="env-metric" style={{ '--env-color': m.color }}>
                        <span className="env-icon">{m.icon}</span>
                        <span className="env-value" style={{ color: m.color }}>
                          {selectedZone[m.key]}{m.unit}
                        </span>
                        <span className="env-label">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="divider" style={{ margin: '12px 0' }} />

                  {/* SHAP Chart */}
                  <SHAPChart shap={selectedZone.shap} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Advisory Banner */}
        {selectedZone && (
          <div className="dash-advisory">
            <AlertBanner risk={selectedZone.risk} />
          </div>
        )}

        {/* Zone Table */}
        <div className="card zones-table-card">
          <div className="table-header">
            <h3>All Monitored Zones</h3>
            <span className="text-muted" style={{ fontSize: 12 }}>{zones.length} zones tracked</span>
          </div>
          <div className="table-wrap">
            <table className="zones-table">
              <thead>
                <tr>
                  <th>Zone Name</th>
                  <th>State</th>
                  <th>Risk Level</th>
                  <th>Score</th>
                  <th>Rainfall</th>
                  <th>Slope</th>
                  <th>Moisture</th>
                </tr>
              </thead>
              <tbody>
                {zones
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .map(z => (
                    <tr
                      key={z.id}
                      className={`zone-row ${selectedZone?.id === z.id ? 'zone-row-selected' : ''}`}
                      onClick={() => setSelectedZone(z)}
                    >
                      <td className="zone-name-cell">{z.name}</td>
                      <td>{z.state}</td>
                      <td>
                        <span className={`badge ${RISK_BADGE_CLASS[z.risk]}`}>{z.risk}</span>
                      </td>
                      <td>
                        <div className="score-cell">
                          <span style={{ color: RISK_COLOR_MAP[z.risk], fontWeight: 700 }}>{z.riskScore}%</span>
                          <div className="score-bar">
                            <div
                              className="score-fill"
                              style={{ width: `${z.riskScore}%`, background: RISK_COLOR_MAP[z.risk] }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>{z.rainfall} mm</td>
                      <td>{z.slope}°</td>
                      <td>{z.soilMoisture}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
