import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import './SHAPChart.css'

const FEATURE_LABELS = {
  rainfall: '🌧️ Rainfall Intensity',
  slope: '⛰️ Slope Steepness',
  soilMoisture: '💧 Soil Moisture',
  elevation: '📐 Elevation',
  vegetation: '🌿 Vegetation Loss',
}

const COLORS = ['#EF4444', '#F97316', '#EAB308', '#38BDF8', '#10B981']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="shap-tooltip">
        <strong>{payload[0].payload.name}</strong>
        <span>Impact: {(payload[0].value * 100).toFixed(1)}%</span>
      </div>
    )
  }
  return null
}

export default function SHAPChart({ shap }) {
  const data = Object.entries(shap)
    .map(([key, val]) => ({
      key,
      name: FEATURE_LABELS[key] || key,
      value: val,
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="shap-wrap">
      <div className="shap-title">
        🧠 SHAP Feature Importance
        <span className="shap-sub">What's driving the risk score?</span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
        >
          <XAxis
            type="number"
            domain={[0, 0.5]}
            tick={{ fill: '#64748B', fontSize: 10 }}
            tickFormatter={v => `${(v * 100).toFixed(0)}%`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={145}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(56,189,248,0.06)' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
            {data.map((entry, index) => (
              <Cell key={entry.key} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
