import { useState, useMemo } from 'react';
import { citizenReports as initialCitizenReports } from '../data/mockData';
import './CitizenReports.css';

export default function CitizenReports() {
  const [reports, setReports] = useState(initialCitizenReports);
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');

  // Form state
  const [reporterName, setReporterName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [gpsCoordinates, setGpsCoordinates] = useState('25.2700° N, 91.7100° E (Auto-detected)');
  const [priority, setPriority] = useState('Moderate');
  const [attachedImageName, setAttachedImageName] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  // Status Filter Tabs
  const statusTabs = ['All', 'Under Review', 'Verified', 'Resolved', 'Action Taken'];

  // Status counts calculation
  const statusCounts = useMemo(() => {
    const counts = { All: reports.length, 'Under Review': 0, 'Verified': 0, 'Resolved': 0, 'Action Taken': 0 };
    reports.forEach((r) => {
      if (counts[r.status] !== undefined) {
        counts[r.status] += 1;
      }
    });
    return counts;
  }, [reports]);

  // Filtered reports based on active tab
  const filteredReports = useMemo(() => {
    if (selectedStatusTab === 'All') return reports;
    return reports.filter((r) => r.status.toLowerCase() === selectedStatusTab.toLowerCase());
  }, [reports, selectedStatusTab]);

  // Form submission handler
  const handleSubmitReport = (e) => {
    e.preventDefault();

    if (!locationName.trim() || !description.trim()) {
      alert('Please fill out the required Location Name and Description fields.');
      return;
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    const newReportId = reports.length + 1;
    const finalReporterName = reporterName.trim() || 'Citizen Contributor';

    const newReport = {
      id: newReportId,
      reporter: finalReporterName,
      location: locationName.trim(),
      date: todayDate,
      description: description.trim(),
      status: 'Under Review',
      priority: priority,
      image: Boolean(attachedImageName),
      gps: gpsCoordinates,
    };

    setReports([newReport, ...reports]);
    setSubmissionFeedback({
      id: newReportId,
      location: locationName.trim(),
    });

    // Reset form fields
    setReporterName('');
    setLocationName('');
    setDescription('');
    setPriority('Moderate');
    setAttachedImageName('');
    setGpsCoordinates('25.2700° N, 91.7100° E (Auto-detected)');
  };

  // Simulated GPS detection
  const handleDetectGPS = () => {
    // Generate realistic NER coordinates (Meghalaya/Assam region)
    const lat = (25.0 + Math.random() * 2.5).toFixed(4);
    const lng = (91.5 + Math.random() * 2.5).toFixed(4);
    setGpsCoordinates(`${lat}° N, ${lng}° E (GPS Locked)`);
  };

  // Simulated Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAttachedImageName(file.name);
    } else {
      setAttachedImageName('incident_photo_' + Date.now().toString().slice(-4) + '.jpg');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'CC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'under review':
        return 'under-review';
      case 'verified':
        return 'verified';
      case 'resolved':
        return 'resolved';
      case 'action taken':
        return 'action-taken';
      default:
        return 'under-review';
    }
  };

  const getPriorityClass = (pri) => {
    switch (pri.toLowerCase()) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'high';
      case 'moderate':
        return 'moderate';
      case 'low':
        return 'low';
      default:
        return 'moderate';
    }
  };

  return (
    <div className="citizen-page">
      {/* 1. Page Header */}
      <div className="citizen-header">
        <div className="citizen-title-group">
          <div className="citizen-title-icon">📋</div>
          <div>
            <h1>Citizen Hazard Reports</h1>
            <p>Community crowd-sourced landslide warnings, slope cracks, and verified geological incident reporting</p>
          </div>
        </div>
        <div className="citizen-header-badge">
          <span className="pulsing-dot"></span>
          <span>Community Sentinel Network Active</span>
        </div>
      </div>

      {/* Submission Success Toast */}
      {submissionFeedback && (
        <div className="citizen-alert-toast">
          <div className="toast-message">
            <span className="toast-icon">✅</span>
            <div>
              <strong>Report #{submissionFeedback.id} Submitted Successfully!</strong>
              <div>Hazard report for &ldquo;{submissionFeedback.location}&rdquo; was logged and forwarded to District Disaster Authority for rapid verification.</div>
            </div>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setSubmissionFeedback(null)}
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Two-Column Layout */}
      <div className="citizen-grid">
        {/* Left Column: Report Form Card */}
        <div className="report-form-card">
          <div className="form-header">
            <h2>
              <span>📢</span> Report a Hazard
            </h2>
            <p>Observed slope displacement, retaining wall cracks, or sudden water runoff? Alert emergency teams immediately.</p>
          </div>

          <form className="hazard-form" onSubmit={handleSubmitReport}>
            {/* Contributor Name */}
            <div className="form-group">
              <label htmlFor="reporter-name">
                <span>Your Name</span>
                <span className="label-hint">Optional / Anonymous</span>
              </label>
              <input
                id="reporter-name"
                type="text"
                className="form-input"
                placeholder="e.g. Tenzing Norbu / Local Resident"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
              />
            </div>

            {/* Location Name */}
            <div className="form-group">
              <label htmlFor="location-name">
                <span>Location Name <span className="required">*</span></span>
                <span className="label-hint">Highway KM / Landmark</span>
              </label>
              <input
                id="location-name"
                type="text"
                className="form-input"
                placeholder="e.g. NH-29 Km 18 near Medziphema"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="hazard-description">
                <span>Hazard Description <span className="required">*</span></span>
                <span className="label-hint">Key physical signs</span>
              </label>
              <textarea
                id="hazard-description"
                className="form-textarea"
                placeholder="Describe visible ground cracks, rockfall, soil displacement, blocked culverts, or water seepage..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Upload Image Button */}
            <div className="form-group">
              <label>
                <span>Upload Field Photo</span>
                <span className="label-hint">Optional visual evidence</span>
              </label>
              <div className="upload-zone-wrapper">
                <label className="upload-button-styled">
                  <span>📷</span>
                  <span>{attachedImageName ? 'Change Incident Photo' : 'Upload Incident Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>

                {attachedImageName && (
                  <div className="attached-image-preview">
                    <div className="attached-image-info">
                      <span>🖼️</span>
                      <span>{attachedImageName}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-remove-attachment"
                      onClick={() => setAttachedImageName('')}
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* GPS Coordinates */}
            <div className="form-group">
              <label htmlFor="gps-coords">
                <span>GPS Coordinates</span>
                <span className="label-hint">Location pinning</span>
              </label>
              <div className="gps-input-group">
                <input
                  id="gps-coords"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 25.2700° N, 91.7100° E"
                  value={gpsCoordinates}
                  onChange={(e) => setGpsCoordinates(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-detect-gps"
                  onClick={handleDetectGPS}
                  title="Detect GPS coordinates"
                >
                  <span>📍</span> Detect
                </button>
              </div>
            </div>

            {/* Priority Dropdown */}
            <div className="form-group">
              <label htmlFor="priority-select">
                <span>Perceived Priority</span>
                <span className="label-hint">Risk level</span>
              </label>
              <select
                id="priority-select"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low - Minor hairline crack / minor debris</option>
                <option value="Moderate">Moderate - Noticeable slope slip / water flow</option>
                <option value="High">High - Significant road crack / falling boulders</option>
                <option value="Critical">Critical - Active sliding / highway blocked / imminent danger</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit-report">
              <span>🚀</span> Submit Hazard Report
            </button>

            <p className="form-disclaimer">
              🔒 Reports are verified by BhuRakshak AI algorithms and forwarded to state disaster management cells within minutes.
            </p>
          </form>
        </div>

        {/* Right Column: Existing Reports */}
        <div className="reports-feed-container">
          {/* Status Filter Tabs */}
          <div className="reports-filter-card">
            <div className="filter-tabs-wrapper">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-btn ${selectedStatusTab === tab ? 'active' : ''}`}
                  onClick={() => setSelectedStatusTab(tab)}
                >
                  <span>{tab}</span>
                  <span className="tab-count">{statusCounts[tab] || 0}</span>
                </button>
              ))}
            </div>
            <div className="feed-stats-text">
              Showing <strong>{filteredReports.length}</strong> reports
            </div>
          </div>

          {/* List of Citizen Reports */}
          <div className="reports-list">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => {
                const statusClass = getStatusClass(report.status);
                const priorityClass = getPriorityClass(report.priority);

                return (
                  <div
                    key={report.id}
                    className={`citizen-report-card priority-${priorityClass}`}
                  >
                    {/* Top Row: Reporter and Badges */}
                    <div className="report-card-top">
                      <div className="reporter-info">
                        <div className="reporter-avatar">
                          {getInitials(report.reporter)}
                        </div>
                        <div className="reporter-meta">
                          <span className="reporter-name">{report.reporter}</span>
                          <span className="report-date">📅 {report.date}</span>
                        </div>
                      </div>

                      <div className="report-badges-group">
                        <span className={`status-badge ${statusClass}`}>
                          ● {report.status}
                        </span>
                        <span className={`priority-badge ${priorityClass}`}>
                          {report.priority} Priority
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="report-location-row">
                      <span className="report-location-icon">📍</span>
                      <span>{report.location}</span>
                    </div>

                    {/* Description */}
                    <p className="report-body-text">{report.description}</p>

                    {/* Image Attachment Indicator */}
                    {report.image && (
                      <div className="report-card-attachment">
                        <div className="attachment-thumbnail-sim" title="Attached field photo">
                          🏞️
                        </div>
                        <div className="attachment-badge">
                          <span>📷</span> Field Photo Verified & Attached
                        </div>
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="report-card-footer">
                      <span className="report-id-tag">REF: CR-10{report.id}</span>
                      <div className="report-response-team">
                        <span className="response-status-indicator"></span>
                        <span>Disaster Response Cell Monitored</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="feed-empty-state">
                <div className="empty-icon">📭</div>
                <h4>No Reports Under &ldquo;{selectedStatusTab}&rdquo;</h4>
                <p>There are currently no citizen hazard reports with this status.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
