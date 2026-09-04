import { useParams, useNavigate } from 'react-router-dom'
import { MONITORED_ZONES, RISK_COLOR_MAP, RISK_BADGE_CLASS, ADVISORY_MAP } from '../../data/mockData.js'
import GaugeChart from '../../components/GaugeChart/GaugeChart.jsx'
import SHAPChart from '../../components/SHAPChart/SHAPChart.jsx'
import AlertBanner from '../../components/AlertBanner/AlertBanner.jsx'
import { MapContainer, TileLayer, CircleMarker, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './LocationDetails.css'

const RAINFALL_HISTORY = [185, 220, 195, 240, 189, 156, 201, 176, 142, 168, 195, 212]
const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

export default function LocationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const zone = MONITORED_ZONES.find(z => z.id === parseInt(id)) || MONITORED_ZONES[0]

  const maxRain = Math.max(...RAINFALL_HISTORY)

  return (
    <div className="location-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button className="breadcrumb-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <span>›</span>
          <button className="breadcrumb-link" onClick={() => navigate('/gis-map')}>GIS Map</button>
          <span>›</span>
          <span className="breadcrumb-current">{zone.name}</span>
        </div>

        {/* Page Header */}
        <div className="loc-header">
          <div className="loc-header-left">
            <div className="loc-title-row">
              <h1 className="loc-title">{zone.name}</h1>
              <span className={`badge ${RISK_BADGE_CLASS[zone.risk]}`} style={{ fontSize: 13 }}>
                {zone.risk} Risk
              </span>
            </div>
            <p className="loc-meta">
              📍 {zone.district}, {zone.state} &nbsp;·&nbsp;
              🌐 {zone.lat.toFixed(4)}°N, {zone.lon.toFixed(4)}°E &nbsp;·&nbsp;
              📐 Elevation: {zone.elevation}m
            </p>
          </div>
          <div className="loc-header-actions">
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/gis-map')}>← Back to Map</button>
            <button className="btn btn-danger btn-sm">🚨 Issue Alert</button>
          </div>
        </div>

        {/* Advisory */}
        <AlertBanner risk={zone.risk} />

        {/* Main Grid */}
        <div className="loc-main-grid">
          {/* Mini Map */}
          <div className="loc-mini-map card" style={{ padding: 0 }}>
            <div className="mini-map-header">
              <span>📍 Zone Location</span>
            </div>
            <MapContainer
              center={[zone.lat, zone.lon]}
              zoom={10}
              style={{ height: 260 }}
              zoomControl={false}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <ZoomControl position="bottomright" />
              <CircleMarker
                center={[zone.lat, zone.lon]}
                radius={20}
                pathOptions={{ color: RISK_COLOR_MAP[zone.risk], fillColor: RISK_COLOR_MAP[zone.risk], fillOpacity: 0.7, weight: 2 }}
              />
            </MapContainer>
          </div>

          {/* Gauge + Env Metrics */}
          <div className="card">
            <GaugeChart score={zone.riskScore} risk={zone.risk} />
            <div className="divider" style={{ margin: '12px 0' }} />
            <div className="env-grid-2">
              {[
                { icon: '🌧️', label: 'Rainfall', value: `${zone.rainfall}mm`, color: '#38BDF8' },
                { icon: '⛰️', label: 'Slope', value: `${zone.slope}°`, color: '#F59E0B' },
                { icon: '💧', label: 'Soil Moisture', value: `${zone.soilMoisture}%`, color: '#10B981' },
                { icon: '📐', label: 'Elevation', value: `${zone.elevation}m`, color: '#A78BFA' },
              ].map(m => (
                <div key={m.label} className="env-chip" style={{ '--c': m.color }}>
                  <span className="env-chip-icon">{m.icon}</span>
                  <span className="env-chip-value" style={{ color: m.color }}>{m.value}</span>
                  <span className="env-chip-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SHAP */}
          <div className="card">
            <SHAPChart shap={zone.shap} />
            <div className="divider" style={{ margin: '12px 0' }} />
            <div className="shap-insight">
              <h4>🧠 AI Insight</h4>
              <p>
                Rainfall intensity is the primary driver of risk at this location ({(zone.shap.rainfall * 100).toFixed(0)}% contribution),
                followed by slope steepness ({(zone.shap.slope * 100).toFixed(0)}%). Ground saturation sensors show critical levels.
                Recommend immediate preventive measures.
              </p>
            </div>
          </div>
        </div>

        {/* Rainfall History */}
        <div className="card rainfall-history-card">
          <h3>📈 12-Month Rainfall History (mm)</h3>
          <div className="rainfall-bars">
            {RAINFALL_HISTORY.map((val, i) => (
              <div key={i} className="rain-bar-item">
                <div className="rain-bar-wrap">
                  <div
                    className="rain-bar"
                    style={{
                      height: `${(val / maxRain) * 100}%`,
                      background: val > 180
                        ? 'linear-gradient(180deg, #EF4444, #F97316)'
                        : val > 130
                        ? 'linear-gradient(180deg, #F59E0B, #EAB308)'
                        : 'linear-gradient(180deg, #38BDF8, #10B981)',
                    }}
                    title={`${val}mm`}
                  />
                </div>
                <span className="rain-label">{MONTHS[i]}</span>
                <span className="rain-val">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Info Cards */}
        <div className="loc-info-grid">
          <div className="card loc-info-card">
            <h4>🏛️ Administrative</h4>
            <div className="info-rows">
              <div className="info-row"><span>State</span><span>{zone.state}</span></div>
              <div className="info-row"><span>District</span><span>{zone.district}</span></div>
              <div className="info-row"><span>Zone ID</span><span>NER-{String(zone.id).padStart(4, '0')}</span></div>
              <div className="info-row"><span>Monitoring Since</span><span>2022</span></div>
            </div>
          </div>
          <div className="card loc-info-card">
            <h4>🌍 Terrain Profile</h4>
            <div className="info-rows">
              <div className="info-row"><span>Elevation</span><span>{zone.elevation}m</span></div>
              <div className="info-row"><span>Slope Angle</span><span>{zone.slope}°</span></div>
              <div className="info-row"><span>Soil Type</span><span>Laterite / Clay</span></div>
              <div className="info-row"><span>Vegetation</span><span>Dense Forest</span></div>
            </div>
          </div>
          <div className="card loc-info-card">
            <h4>📡 Sensor Status</h4>
            <div className="info-rows">
              <div className="info-row"><span>Rain Gauge</span><span className="status-ok">🟢 Active</span></div>
              <div className="info-row"><span>Soil Probe</span><span className="status-ok">🟢 Active</span></div>
              <div className="info-row"><span>Seismic</span><span className="status-warn">🟡 Intermittent</span></div>
              <div className="info-row"><span>Last Sync</span><span>2 mins ago</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
