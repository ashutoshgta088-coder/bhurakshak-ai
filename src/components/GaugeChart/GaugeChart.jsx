import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { RISK_COLOR_MAP } from '../../data/mockData.js'
import './GaugeChart.css'

function getColor(score) {
  if (score >= 75) return '#EF4444'
  if (score >= 50) return '#F97316'
  if (score >= 25) return '#EAB308'
  return '#10B981'
}

export default function GaugeChart({ score, risk }) {
  const color = getColor(score)
  const remaining = 100 - score

  const data = [
    { value: score },
    { value: remaining },
  ]

  return (
    <div className="gauge-wrap">
      <div className="gauge-title">⚡ Landslide Probability</div>
      <div className="gauge-chart-area">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="85%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              <Cell fill={color} />
              <Cell fill="#1E293B" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="gauge-overlay">
          <span className="gauge-score" style={{ color }}>{score}%</span>
          <span className="gauge-label" style={{ color }}>
            {risk}
          </span>
        </div>
      </div>

      {/* Threshold Labels */}
      <div className="gauge-thresholds">
        <span style={{ color: '#10B981' }}>Low</span>
        <span style={{ color: '#EAB308' }}>Moderate</span>
        <span style={{ color: '#F97316' }}>High</span>
        <span style={{ color: '#EF4444' }}>Very High</span>
      </div>

      <div className="gauge-bar-container">
        <div
          className="gauge-bar-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, #10B981, #EAB308, #F97316, ${color})`,
          }}
        />
      </div>
    </div>
  )
}
