import { useState, useRef } from 'react'
import { submitHazardReport } from '../../api/apiClient.js'
import { NER_STATES, HAZARD_TYPES } from '../../data/mockData.js'
import { useAuth } from '../../context/AuthContext.jsx'
import './CitizenReporting.css'

const DISTRICTS = {
  'Assam': ['Kamrup', 'Barpeta', 'Nagaon', 'Dibrugarh', 'Jorhat', 'Goalpara', 'Kokrajhar'],
  'Meghalaya': ['East Khasi Hills', 'West Khasi Hills', 'Ri Bhoi', 'Jaintia Hills', 'Garo Hills'],
  'Mizoram': ['Aizawl', 'Champhai', 'Lunglei', 'Kolasib', 'Serchhip'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Mon'],
  'Manipur': ['Imphal East', 'Imphal West', 'Churachandpur', 'Bishnupur', 'Senapati'],
  'Sikkim': ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim'],
  'Tripura': ['West Tripura', 'North Tripura', 'South Tripura', 'Gomati'],
  'Arunachal Pradesh': ['West Kameng', 'East Kameng', 'Lower Subansiri', 'Siang', 'Dibang Valley'],
}

export default function CitizenReporting() {
  const { addToast } = useAuth()
  const fileRef = useRef(null)
  const [form, setForm] = useState({
    reporterName: '', phone: '', state: '', district: '',
    lat: '', lon: '', landmark: '', hazardType: '', description: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedId, setSubmittedId] = useState('')

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.state || !form.hazardType || !form.description) {
      addToast('Please fill in State, Hazard Type, and Description.', 'error')
      return
    }
    setSubmitting(true)
    const result = await submitHazardReport({ ...form, hasImage: !!imageFile })
    const id = result.report_id || `RPT-${Date.now()}`
    setSubmittedId(id)
    setSubmitted(true)
    addToast(`Hazard report ${id} submitted successfully! ✅`, 'success')
    setSubmitting(false)
  }

  const handleReset = () => {
    setForm({ reporterName: '', phone: '', state: '', district: '', lat: '', lon: '', landmark: '', hazardType: '', description: '' })
    setImageFile(null)
    setImagePreview(null)
    setSubmitted(false)
    setSubmittedId('')
  }

  if (submitted) {
    return (
      <div className="reporting-page">
        <div className="container">
          <div className="success-card card">
            <div className="success-icon">✅</div>
            <h2>Report Submitted!</h2>
            <p>Your hazard report has been logged and forwarded to the nearest district emergency management unit.</p>
            <div className="success-id">
              <span>Report ID:</span>
              <code>{submittedId}</code>
            </div>
            <p className="success-note">
              Save this ID for follow-up. Field verification teams will be dispatched within 2–4 hours for high-priority reports.
            </p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={handleReset}>📝 Submit Another Report</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reporting-page">
      <div className="container">
        {/* Page Header */}
        <div className="reporting-header">
          <div>
            <h1 className="reporting-title">📝 Community Hazard Reporting Portal</h1>
            <p className="reporting-desc">
              Report landslide hazards, ground fissures, or terrain disturbances observed in your area.
              Your report directly alerts district emergency management units.
            </p>
          </div>
          <div className="reporting-guidelines card">
            <h4>📋 Submission Guidelines</h4>
            <ul>
              <li>Include precise location (coordinates or landmark)</li>
              <li>Describe what you observed, not what you think might happen</li>
              <li>Upload a photo if safe to capture</li>
              <li>For immediate emergencies, call <strong className="text-accent">112</strong></li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="reporting-form-grid">
          {/* Left: Location & Reporter */}
          <div className="report-col">
            <div className="card report-section">
              <h3 className="section-label">👤 Reporter Information <span className="optional-tag">(Optional for anonymity)</span></h3>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className="form-input" placeholder="Leave blank to report anonymously" value={form.reporterName} onChange={update('reporterName')} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={update('phone')} />
              </div>
            </div>

            <div className="card report-section">
              <h3 className="section-label">📍 Location Details</h3>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select className="form-select" value={form.state} onChange={update('state')} required>
                    <option value="">Select State</option>
                    {NER_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <select className="form-select" value={form.district} onChange={update('district')} disabled={!form.state}>
                    <option value="">Select District</option>
                    {(DISTRICTS[form.state] || []).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input className="form-input" type="number" step="any" placeholder="e.g. 25.6747" value={form.lat} onChange={update('lat')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input className="form-input" type="number" step="any" placeholder="e.g. 93.6961" value={form.lon} onChange={update('lon')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Landmark / Description of Location</label>
                <input className="form-input" placeholder="e.g. Near NH-29, 3km from Kohima Market" value={form.landmark} onChange={update('landmark')} />
              </div>
            </div>
          </div>

          {/* Right: Hazard Details */}
          <div className="report-col">
            <div className="card report-section">
              <h3 className="section-label">⚠️ Hazard Details</h3>
              <div className="form-group">
                <label className="form-label">Hazard Type *</label>
                <select className="form-select" value={form.hazardType} onChange={update('hazardType')} required>
                  <option value="">Select Hazard Type</option>
                  {HAZARD_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe what you observed — extent of damage, direction of movement, any sounds, number of people affected..."
                  value={form.description}
                  onChange={update('description')}
                  rows={5}
                  required
                />
              </div>
            </div>

            <div className="card report-section">
              <h3 className="section-label">📷 Photo Evidence</h3>
              <div
                className={`upload-area ${imagePreview ? 'has-image' : ''}`}
                onClick={() => fileRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="image-preview-wrap">
                    <img src={imagePreview} alt="Hazard preview" className="image-preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null) }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">Click to upload photo</span>
                    <span className="upload-sub">JPG, PNG · Max 10MB</span>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
                onChange={handleImage}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-danger btn-full btn-submit ${submitting ? 'loading' : ''}`}
              disabled={submitting}
            >
              {submitting ? '⏳ Submitting Report...' : '🚨 Submit Hazard Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
