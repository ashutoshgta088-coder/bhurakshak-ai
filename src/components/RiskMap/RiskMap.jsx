import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { RISK_COLOR_MAP } from '../../data/mockData.js'
import './RiskMap.css'

const RISK_RADIUS = {
  'Very High': 18,
  'High': 14,
  'Moderate': 11,
  'Low': 9,
}

export default function RiskMap({ zones, onSelect, selectedId }) {
  return (
    <div className="risk-map-wrap">
      <div className="map-header">
        <span className="map-title">🗺️ Live Terrain Risk Map — Northeast India</span>
        <div className="map-legend">
          {Object.entries(RISK_COLOR_MAP).map(([level, color]) => (
            <span key={level} className="legend-item">
              <span className="legend-dot" style={{ background: color }} />
              {level}
            </span>
          ))}
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={[26.2006, 92.9376]}
          zoom={7}
          style={{ height: '100%', width: '100%', borderRadius: '0 0 10px 10px' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />

          {zones.map(zone => (
            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lon]}
              radius={RISK_RADIUS[zone.risk] || 10}
              pathOptions={{
                color: selectedId === zone.id ? '#fff' : RISK_COLOR_MAP[zone.risk],
                fillColor: RISK_COLOR_MAP[zone.risk],
                fillOpacity: 0.85,
                weight: selectedId === zone.id ? 3 : 1.5,
              }}
              eventHandlers={{ click: () => onSelect(zone) }}
            >
              <Popup className="map-popup">
                <div className="popup-content">
                  <div className="popup-title">{zone.name}</div>
                  <div className="popup-grid">
                    <span>📍 {zone.state}</span>
                    <span className="popup-risk" style={{ color: RISK_COLOR_MAP[zone.risk] }}>
                      ● {zone.risk} Risk
                    </span>
                    <span>🌧️ Rainfall: {zone.rainfall} mm</span>
                    <span>⛰️ Slope: {zone.slope}°</span>
                    <span>💧 Moisture: {zone.soilMoisture}%</span>
                    <span>📊 Score: {zone.riskScore}%</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
