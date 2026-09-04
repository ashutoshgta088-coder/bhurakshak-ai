import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchMonitoredZones } from '../../api/apiClient.js'
import { RISK_COLOR_MAP, RISK_BADGE_CLASS } from '../../data/mockData.js'
import './GISMap.css'

const { BaseLayer } = LayersControl

const RISK_RADIUS = { 'Very High': 22, 'High': 16, 'Moderate': 12, 'Low': 9 }

export default function GISMap() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRisk, setFilterRisk] = useState('All')
  const [mapStyle, setMapStyle] = useState('dark')
  const navigate = useNavigate()

  useEffect(() => {
    fetchMonitoredZones().then(data => { setZones(data); setLoading(false) })
  }, [])

  const filtered = filterRisk === 'All' ? zones : zones.filter(z => z.risk === filterRisk)

  const MAP_TILES = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  }

  const riskCount = (level) => zones.filter(z => z.risk === level).length

  if (loading) return (
    <div className="gis-loading">
      <div className="loading-spinner" />
      <span>Loading GIS terrain data...</span>
    </div>
  )

  return (
    <div className="gis-page">
      {/* Sidebar */}
      <div className="gis-sidebar">
        <div className="gis-sidebar-header">
          <h2>🗺️ GIS Risk Map</h2>
          <p>Northeast India Terrain Intelligence</p>
        </div>

        {/* Risk Filter */}
        <div className="gis-section">
          <div className="gis-section-label">Risk Level Filter</div>
          <div className="risk-filter-btns">
            {['All', 'Very High', 'High', 'Moderate', 'Low'].map(r => (
              <button
                key={r}
                className={`risk-filter-btn ${filterRisk === r ? 'active' : ''}`}
                style={{ '--btn-color': r === 'All' ? '#38BDF8' : RISK_COLOR_MAP[r] }}
                onClick={() => setFilterRisk(r)}
              >
                {r !== 'All' && <span className="filter-dot" style={{ background: RISK_COLOR_MAP[r] }} />}
                {r}
                <span className="filter-count">
                  {r === 'All' ? zones.length : riskCount(r)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Map Style */}
        <div className="gis-section">
          <div className="gis-section-label">Map Style</div>
          <div className="map-style-btns">
            {[
              { key: 'dark', label: '🌑 Dark', },
              { key: 'satellite', label: '🛰️ Satellite' },
              { key: 'terrain', label: '🏔️ Terrain' },
            ].map(s => (
              <button
                key={s.key}
                className={`map-style-btn ${mapStyle === s.key ? 'active' : ''}`}
                onClick={() => setMapStyle(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zone List */}
        <div className="gis-section gis-zone-list">
          <div className="gis-section-label">{filtered.length} Zone{filtered.length !== 1 ? 's' : ''} Shown</div>
          <div className="zone-list-scroll">
            {filtered
              .sort((a, b) => b.riskScore - a.riskScore)
              .map(zone => (
                <div
                  key={zone.id}
                  className="zone-list-item"
                  onClick={() => navigate(`/location/${zone.id}`)}
                >
                  <div className="zleft">
                    <span className="zdot" style={{ background: RISK_COLOR_MAP[zone.risk] }} />
                    <div>
                      <div className="zname">{zone.name}</div>
                      <div className="zstate">{zone.state}</div>
                    </div>
                  </div>
                  <div className="zright">
                    <span className="zscore" style={{ color: RISK_COLOR_MAP[zone.risk] }}>
                      {zone.riskScore}%
                    </span>
                    <span className="zchevron">›</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Legend */}
        <div className="gis-section">
          <div className="gis-section-label">Risk Legend</div>
          <div className="gis-legend">
            {Object.entries(RISK_COLOR_MAP).map(([level, color]) => (
              <div key={level} className="gis-legend-item">
                <div className="gis-legend-dot" style={{ background: color }} />
                <span>{level}</span>
              </div>
            ))}
          </div>
          <div className="gis-legend-note">
            Circle size indicates relative risk intensity
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="gis-map-area">
        <MapContainer
          center={[26.2006, 92.9376]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            key={mapStyle}
            attribution={mapStyle === 'dark' ? '© CartoDB' : mapStyle === 'satellite' ? '© Esri' : '© OpenTopoMap'}
            url={MAP_TILES[mapStyle]}
          />
          <ZoomControl position="bottomright" />

          {filtered.map(zone => (
            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lon]}
              radius={RISK_RADIUS[zone.risk] || 10}
              pathOptions={{
                color: RISK_COLOR_MAP[zone.risk],
                fillColor: RISK_COLOR_MAP[zone.risk],
                fillOpacity: 0.75,
                weight: 2,
              }}
              eventHandlers={{ click: () => navigate(`/location/${zone.id}`) }}
            >
              <Popup className="map-popup">
                <div className="popup-content">
                  <div className="popup-title">{zone.name}</div>
                  <div className="popup-grid">
                    <span>📍 {zone.district}, {zone.state}</span>
                    <span style={{ color: RISK_COLOR_MAP[zone.risk], fontWeight: 700 }}>
                      ● {zone.risk} Risk — {zone.riskScore}%
                    </span>
                    <span>🌧️ Rainfall: {zone.rainfall} mm</span>
                    <span>⛰️ Slope: {zone.slope}°</span>
                    <span>💧 Moisture: {zone.soilMoisture}%</span>
                    <span>📐 Elevation: {zone.elevation}m</span>
                  </div>
                  <button
                    className="popup-detail-btn"
                    onClick={() => navigate(`/location/${zone.id}`)}
                  >
                    View Full Analysis →
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Overlay controls */}
        <div className="gis-overlay-stats">
          <div className="overlay-stat">
            <span style={{ color: '#EF4444' }}>●</span>
            <span>{riskCount('Very High')} Very High</span>
          </div>
          <div className="overlay-stat">
            <span style={{ color: '#F97316' }}>●</span>
            <span>{riskCount('High')} High</span>
          </div>
          <div className="overlay-stat">
            <span style={{ color: '#EAB308' }}>●</span>
            <span>{riskCount('Moderate')} Moderate</span>
          </div>
          <div className="overlay-stat">
            <span style={{ color: '#10B981' }}>●</span>
            <span>{riskCount('Low')} Low</span>
          </div>
        </div>
      </div>
    </div>
  )
}
