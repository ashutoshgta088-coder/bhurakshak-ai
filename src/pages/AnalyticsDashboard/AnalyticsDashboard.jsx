import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import './AnalyticsDashboard.css'

const MONTHLY_RISK = [
  { month: 'Jan', veryHigh: 2, high: 5, moderate: 8, low: 12 },
  { month: 'Feb', veryHigh: 1, high: 4, moderate: 7, low: 14 },
  { month: 'Mar', veryHigh: 3, high: 6, moderate: 9, low: 10 },
  { month: 'Apr', veryHigh: 4, high: 8, moderate: 11, low: 9 },
  { month: 'May', veryHigh: 6, high: 10, moderate: 12, low: 8 },
  { month: 'Jun', veryHigh: 9, high: 14, moderate: 15, low: 6 },
  { month: 'Jul', veryHigh: 14, high: 18, moderate: 16, low: 4 },
  { month: 'Aug', veryHigh: 12, high: 16, moderate: 14, low: 5 },
  { month: 'Sep', veryHigh: 8, high: 12, moderate: 13, low: 7 },
  { month: 'Oct', veryHigh: 5, high: 8, moderate: 10, low: 9 },
  { month: 'Nov', veryHigh: 3, high: 5, moderate: 8, low: 11 },
  { month: 'Dec', veryHigh: 2, high: 4, moderate: 7, low: 13 },
]

const RAINFALL_TREND = [
  { week: 'W1', rainfall: 45, threshold: 100 },
  { week: 'W2', rainfall: 78, threshold: 100 },
  { week: 'W3', rainfall: 112, threshold: 100 },
  { week: 'W4', rainfall: 156, threshold: 100 },
  { week: 'W5', rainfall: 189, threshold: 100 },
  { week: 'W6', rainfall: 201, threshold: 100 },
  { week: 'W7', rainfall: 176, threshold: 100 },
  { week: 'W8', rainfall: 142, threshold: 100 },
]

const STATE_RISK_PIE = [
  { name: 'Arunachal Pradesh', value: 28, color: '#EF4444' },
  { name: 'Sikkim', value: 22, color: '#F97316' },
  { name: 'Nagaland', value: 18, color: '#EAB308' },
  { name: 'Meghalaya', value: 15, color: '#38BDF8' },
  { name: 'Mizoram', value: 10, color: '#10B981' },
  { name: 'Others', value: 7, color: '#64748B' },
]

const INCIDENT_TYPES = [
  { type: 'Rockfall', count: 34, pct: 38 },
  { type: 'Mudslide', count: 28, pct: 31 },
  { type: 'Ground Fissure', count: 15, pct: 17 },
  { type: 'Soil Erosion', count: 8, pct: 9 },
  { type: 'Drainage Block', count: 5, pct: 5 },
]

const ACCURACY_TREND = [
  { month: 'Jan', accuracy: 89.2 }, { month: 'Feb', accuracy: 90.1 },
  { month: 'Mar', accuracy: 91.5 }, { month: 'Apr', accuracy: 92.0 },
  { month: 'May', accuracy: 92.8 }, { month: 'Jun', accuracy: 93.4 },
  { month: 'Jul', accuracy: 93.9 }, { month: 'Aug', accuracy: 94.2 },
]

const SUMMARY_STATS = [
  { icon: '📍', label: 'Total Incidents (YTD)', value: '342', change: '+12%', up: true },
  { icon: '✅', label: 'False Alarms Averted', value: '87', change: '-5%', up: false },
  { icon: '🏘️', label: 'Communities Protected', value: '214', change: '+18%', up: true },
  { icon: '⏱️', label: 'Avg Response Time', value: '14 min', change: '-23%', up: false },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map(p => (
          <div key={p.dataKey} className="tooltip-row" style={{ color: p.color }}>
            <span>{p.name}: </span><strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('monthly')

  return (
    <div className="analytics-page">
      <div className="container">
        {/* Header */}
        <div className="analytics-header">
          <div>
            <h1 className="analytics-title">📊 Analytics Dashboard</h1>
            <p className="analytics-sub">Comprehensive risk intelligence and trend analysis for NER</p>
          </div>
          <div className="period-toggle">
            {['weekly', 'monthly', 'yearly'].map(p => (
              <button
                key={p}
                className={`period-btn ${period === p ? 'active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="analytics-stats-grid">
          {SUMMARY_STATS.map(s => (
            <div key={s.label} className="analytics-stat-card card">
              <div className="asc-icon">{s.icon}</div>
              <div className="asc-value">{s.value}</div>
              <div className="asc-label">{s.label}</div>
              <div className={`asc-change ${s.up ? 'change-up' : 'change-down'}`}>
                {s.up ? '↑' : '↓'} {s.change} vs last period
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="charts-row">
          {/* Monthly Risk Distribution */}
          <div className="card chart-card chart-lg">
            <div className="chart-header">
              <h3>📈 Monthly Risk Zone Distribution</h3>
              <span className="chart-sub">Stacked bar — 12-month view</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MONTHLY_RISK} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94A3B8' }} />
                <Bar dataKey="veryHigh" name="Very High" fill="#EF4444" stackId="a" radius={[0,0,0,0]} />
                <Bar dataKey="high" name="High" fill="#F97316" stackId="a" />
                <Bar dataKey="moderate" name="Moderate" fill="#EAB308" stackId="a" />
                <Bar dataKey="low" name="Low" fill="#10B981" stackId="a" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rainfall vs Threshold */}
          <div className="card chart-card chart-sm">
            <div className="chart-header">
              <h3>🌧️ Rainfall vs. Alert Threshold</h3>
              <span className="chart-sub">8-week area chart (mm)</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={RAINFALL_TREND} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#38BDF8" fill="url(#rainfallGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="threshold" name="Alert Threshold" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-row">
          {/* State Pie */}
          <div className="card chart-card chart-sm">
            <div className="chart-header">
              <h3>🗺️ Risk Incidents by State</h3>
              <span className="chart-sub">Proportional distribution</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={STATE_RISK_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, pct }) => `${name.split(' ')[0]}`}>
                  {STATE_RISK_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {STATE_RISK_PIE.map(s => (
                <div key={s.name} className="pie-legend-item">
                  <span className="pie-dot" style={{ background: s.color }} />
                  <span>{s.name}</span>
                  <span className="pie-val">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Types */}
          <div className="card chart-card chart-sm">
            <div className="chart-header">
              <h3>⚠️ Incident Type Breakdown</h3>
              <span className="chart-sub">YTD categorization</span>
            </div>
            <div className="incident-list">
              {INCIDENT_TYPES.map(inc => (
                <div key={inc.type} className="incident-row">
                  <span className="incident-type">{inc.type}</span>
                  <div className="incident-bar-wrap">
                    <div className="incident-bar" style={{ width: `${inc.pct}%` }} />
                  </div>
                  <span className="incident-count">{inc.count}</span>
                  <span className="incident-pct">{inc.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Accuracy */}
          <div className="card chart-card chart-sm">
            <div className="chart-header">
              <h3>🤖 AI Model Accuracy Trend</h3>
              <span className="chart-sub">XGBoost precision over time</span>
            </div>
            <div className="accuracy-big">{ACCURACY_TREND[ACCURACY_TREND.length - 1].accuracy}%</div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={ACCURACY_TREND} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[87, 96]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#10B981" strokeWidth={2.5} dot={{ fill: '#10B981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
