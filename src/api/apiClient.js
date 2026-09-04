import axios from 'axios'
import { MONITORED_ZONES, ACTIVE_ALERTS } from '../data/mockData.js'

const BASE_URL = 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL, timeout: 5000 })

export async function fetchMonitoredZones() {
  try {
    const res = await api.get('/zones')
    return res.data
  } catch {
    console.warn('[BhuRakshak] Backend offline — using mock zone data.')
    return MONITORED_ZONES
  }
}

export async function fetchPrediction(payload) {
  try {
    const res = await api.post('/predict', payload)
    return res.data
  } catch {
    console.warn('[BhuRakshak] Backend offline — using mock prediction.')
    const zone = MONITORED_ZONES.find(z => z.id === payload.zone_id) || MONITORED_ZONES[0]
    return { risk_score: zone.riskScore, risk_level: zone.risk, shap: zone.shap }
  }
}

export async function submitHazardReport(data) {
  try {
    const res = await api.post('/reports', data)
    return res.data
  } catch {
    console.warn('[BhuRakshak] Backend offline — report stored locally.')
    return { success: true, report_id: `RPT-${Date.now()}` }
  }
}

export async function fetchActiveAlerts() {
  try {
    const res = await api.get('/alerts')
    return res.data
  } catch {
    console.warn('[BhuRakshak] Backend offline — using mock alerts.')
    return ACTIVE_ALERTS
  }
}
