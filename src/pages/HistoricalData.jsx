import { useState, useMemo } from 'react';
import { historicalLandslides, nerStates } from '../data/mockData';
import './HistoricalData.css';

export default function HistoricalData() {
  const [selectedState, setSelectedState] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Overall Statistics from complete dataset
  const overallStats = useMemo(() => {
    const totalRecords = historicalLandslides.length;
    const severeEvents = historicalLandslides.filter(item => item.severity === 'Severe').length;
    const totalCasualties = historicalLandslides.reduce((acc, curr) => acc + (curr.casualties || 0), 0);
    const affectedStates = new Set(historicalLandslides.map(item => item.state)).size;
    return { totalRecords, severeEvents, totalCasualties, affectedStates };
  }, []);

  // Filtered dataset according to user criteria
  const filteredRecords = useMemo(() => {
    return historicalLandslides.filter(item => {
      // Filter by State
      if (selectedState !== 'All' && item.state !== selectedState) {
        return false;
      }
      // Filter by Severity
      if (selectedSeverity !== 'All' && item.severity.toLowerCase() !== selectedSeverity.toLowerCase()) {
        return false;
      }
      // Filter by Search Term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesLocation = item.location.toLowerCase().includes(query);
        const matchesDistrict = item.district.toLowerCase().includes(query);
        const matchesState = item.state.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesLocation && !matchesDistrict && !matchesState && !matchesDesc) {
          return false;
        }
      }
      // Filter by Date Range
      if (fromDate && item.date < fromDate) {
        return false;
      }
      if (toDate && item.date > toDate) {
        return false;
      }
      return true;
    });
  }, [selectedState, selectedSeverity, searchTerm, fromDate, toDate]);

  // Yearly data for bar chart: 2024: 3, 2025: 4, 2026: 3
  const yearlyTrend = [
    { year: '2024', count: 3, avgRainfall: '296 mm' },
    { year: '2025', count: 4, avgRainfall: '243 mm' },
    { year: '2026', count: 3, avgRainfall: '350 mm' },
  ];
  const maxYearlyCount = 5; // Chart scale upper bound

  // Severity Distribution: Minor 30%, Moderate 20%, Major 30%, Severe 20%
  const severityBreakdown = [
    { type: 'Minor', percentage: '30%', count: 3, colorClass: 'minor' },
    { type: 'Moderate', percentage: '20%', count: 2, colorClass: 'moderate' },
    { type: 'Major', percentage: '30%', count: 3, colorClass: 'major' },
    { type: 'Severe', percentage: '20%', count: 2, colorClass: 'severe' },
  ];

  // Reset filters handler
  const handleResetFilters = () => {
    setSelectedState('All');
    setSelectedSeverity('All');
    setSearchTerm('');
    setFromDate('');
    setToDate('');
  };

  const isFilterActive = selectedState !== 'All' || selectedSeverity !== 'All' || searchTerm !== '' || fromDate !== '' || toDate !== '';

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Location', 'State', 'District', 'Severity', 'Rainfall (mm)', 'Casualties', 'Description'];
    const rows = filteredRecords.map(item => [
      item.id,
      `"${item.date}"`,
      `"${item.location}"`,
      `"${item.state}"`,
      `"${item.district}"`,
      `"${item.severity}"`,
      item.rainfall,
      item.casualties,
      `"${item.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhurakshak_landslides_archive_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="historical-page">
      {/* 1. Page Header */}
      <div className="historical-header">
        <div className="historical-title-group">
          <div className="historical-title-icon">📜</div>
          <div>
            <h1>Historical Landslide Records</h1>
            <p>Comprehensive geological archive, incident reports, and casualty history for North Eastern States</p>
          </div>
        </div>
        <div className="historical-header-badge">
          <span>🏛️</span> National Disaster Management Database
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="historical-stats-grid">
        <div className="historical-stat-card">
          <div className="stat-icon-wrapper blue">🗄️</div>
          <div className="stat-details">
            <span className="stat-value">{overallStats.totalRecords}</span>
            <span className="stat-label">Total Records</span>
            <span className="stat-subtext">Verified historical incidents</span>
          </div>
        </div>

        <div className="historical-stat-card">
          <div className="stat-icon-wrapper red">🚨</div>
          <div className="stat-details">
            <span className="stat-value">{overallStats.severeEvents}</span>
            <span className="stat-label">Severe Events</span>
            <span className="stat-subtext">High impact & highway blocks</span>
          </div>
        </div>

        <div className="historical-stat-card">
          <div className="stat-icon-wrapper orange">👥</div>
          <div className="stat-details">
            <span className="stat-value">{overallStats.totalCasualties}</span>
            <span className="stat-label">Total Casualties</span>
            <span className="stat-subtext">Documented lives lost</span>
          </div>
        </div>

        <div className="historical-stat-card">
          <div className="stat-icon-wrapper green">🗺️</div>
          <div className="stat-details">
            <span className="stat-value">{overallStats.affectedStates}</span>
            <span className="stat-label">States Affected</span>
            <span className="stat-subtext">Across North Eastern Region</span>
          </div>
        </div>
      </div>

      {/* 3. Charts Section */}
      <div className="historical-charts-grid">
        {/* Historical Trend Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><span>📊</span> Historical Landslides per Year</h3>
            <span className="chart-tag">3-Year Trend</span>
          </div>
          <div className="bar-chart-wrapper">
            <div className="bar-chart-body">
              <div className="bar-grid-lines">
                <div className="bar-grid-line" style={{ top: '0%' }} title="5 Events"></div>
                <div className="bar-grid-line" style={{ top: '25%' }} title="4 Events"></div>
                <div className="bar-grid-line" style={{ top: '50%' }} title="3 Events"></div>
                <div className="bar-grid-line" style={{ top: '75%' }} title="2 Events"></div>
                <div className="bar-grid-line" style={{ top: '100%' }} title="0 Events"></div>
              </div>

              {yearlyTrend.map((item) => {
                const heightPercent = Math.round((item.count / maxYearlyCount) * 100);
                return (
                  <div key={item.year} className="bar-column">
                    <span className="bar-value">{item.count} events</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ height: `${heightPercent}%` }}
                        title={`${item.year}: ${item.count} recorded landslides (Avg rain: ${item.avgRainfall})`}
                      ></div>
                    </div>
                    <span className="bar-label">{item.year}</span>
                    <span className="bar-sublabel">{item.avgRainfall}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Severity Distribution Donut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><span>🎯</span> Severity Distribution</h3>
            <span className="chart-tag">Classification</span>
          </div>
          <div className="donut-chart-container">
            <div className="donut-visual">
              <div className="donut-disc"></div>
              <div className="donut-center">
                <span className="donut-center-number">10</span>
                <span className="donut-center-label">Events</span>
              </div>
            </div>

            <div className="donut-legend">
              {severityBreakdown.map((item) => (
                <div key={item.type} className="legend-item">
                  <div className="legend-info">
                    <span className={`legend-color-dot ${item.colorClass}`}></span>
                    <span className="legend-name">{item.type}</span>
                  </div>
                  <div className="legend-stats">
                    <span className="legend-count">({item.count})</span>
                    <span className="legend-percent">{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter Bar Card */}
      <div className="historical-filter-card">
        <div className="filters-grid">
          {/* Search input */}
          <div className="filter-group">
            <label htmlFor="search-input">Search Records</label>
            <div className="filter-input-wrap">
              <span className="filter-search-icon">🔍</span>
              <input
                id="search-input"
                type="text"
                placeholder="Search location, district, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* State dropdown */}
          <div className="filter-group">
            <label htmlFor="state-select">State</label>
            <select
              id="state-select"
              className="filter-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="All">All NER States</option>
              {nerStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Severity dropdown */}
          <div className="filter-group">
            <label htmlFor="severity-select">Severity</label>
            <select
              id="severity-select"
              className="filter-select"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="All">All Severities</option>
              <option value="Minor">Minor</option>
              <option value="Moderate">Moderate</option>
              <option value="Major">Major</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          {/* From Date */}
          <div className="filter-group">
            <label htmlFor="from-date">From Date</label>
            <input
              id="from-date"
              type="date"
              className="filter-date-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          {/* To Date */}
          <div className="filter-group">
            <label htmlFor="to-date">To Date</label>
            <input
              id="to-date"
              type="date"
              className="filter-date-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="filter-actions">
            {isFilterActive && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={handleResetFilters}
                title="Reset all filters"
              >
                <span>✕</span> Reset
              </button>
            )}
            <button
              type="button"
              className="btn-export"
              onClick={handleExportCSV}
              title="Export filtered records to CSV"
            >
              <span>📥</span> Export CSV
            </button>
          </div>
        </div>

        {/* Filter Results Status */}
        <div className="filter-status-row">
          <div>
            Showing <span className="results-count">{filteredRecords.length}</span> of {historicalLandslides.length} historical landslide records
            {selectedState !== 'All' && <span> • State: <strong>{selectedState}</strong></span>}
            {selectedSeverity !== 'All' && <span> • Severity: <strong>{selectedSeverity}</strong></span>}
            {searchTerm && <span> • Keyword: "<strong>{searchTerm}</strong>"</span>}
          </div>
          {filteredRecords.length > 0 && (
            <div style={{ color: 'var(--text-muted)' }}>
              Latest event: {filteredRecords[0].date}
            </div>
          )}
        </div>
      </div>

      {/* 5. Data Table */}
      <div className="historical-table-card">
        {filteredRecords.length > 0 ? (
          <div className="table-responsive">
            <table className="historical-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Location</th>
                  <th>State & District</th>
                  <th>Severity</th>
                  <th>Rainfall</th>
                  <th>Casualties</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((item) => {
                  const severityClass = `severity-${item.severity.toLowerCase()}`;
                  return (
                    <tr key={item.id}>
                      <td className="td-date">📅 {item.date}</td>
                      <td className="td-location">{item.location}</td>
                      <td className="td-state">
                        <span className="td-state-name">{item.state}</span>
                        <span className="td-district">{item.district}</span>
                      </td>
                      <td>
                        <span className={`severity-badge ${severityClass}`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="td-rainfall">
                        <span className="rainfall-tag">💧 {item.rainfall} mm</span>
                      </td>
                      <td className="td-casualties">
                        {item.casualties > 0 ? (
                          <span className="casualty-alert">⚠️ {item.casualties} {item.casualties === 1 ? 'person' : 'people'}</span>
                        ) : (
                          <span className="casualty-zero">0 None</span>
                        )}
                      </td>
                      <td className="td-description">{item.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-empty-state">
            <div className="empty-state-icon">🔍</div>
            <h4>No Historical Records Found</h4>
            <p>No landslide events matched your active filter settings. Try adjusting or clearing your filters.</p>
            <button className="btn-secondary" onClick={handleResetFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
