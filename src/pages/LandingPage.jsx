import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedStateIndex, setSelectedStateIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    agency: '',
    subject: '',
    message: '',
    inquiryType: 'General Inquiry',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // 8 North East Region States Data
  const nerStates = [
    {
      name: 'Assam',
      code: 'AS',
      status: 'Active',
      riskLevel: 'Moderate',
      riskColor: 'badge-moderate',
      monitoredSpots: 24,
      sensorsCount: 18,
      avgRainfall: '142 mm',
      coveragePct: 92,
      criticalZones: 'Dima Hasao, Karbi Anglong, Guwahati Hills & Barak Valley',
      description: 'Extensive slope monitoring along major road transport arteries and vulnerable railway links prone to torrential monsoon slope degradation.',
    },
    {
      name: 'Arunachal Pradesh',
      code: 'AR',
      status: 'Active',
      riskLevel: 'High',
      riskColor: 'badge-high',
      monitoredSpots: 18,
      sensorsCount: 14,
      avgRainfall: '198 mm',
      coveragePct: 88,
      criticalZones: 'Tawang Pass, Bhalukpong-Bomdila, West Kameng & Subansiri',
      description: 'Strategic high-altitude corridor early warning integration with geological shear displacement and snowmelt runoff detection.',
    },
    {
      name: 'Meghalaya',
      code: 'ML',
      status: 'Active',
      riskLevel: 'High',
      riskColor: 'badge-high',
      monitoredSpots: 16,
      sensorsCount: 12,
      avgRainfall: '245 mm',
      coveragePct: 94,
      criticalZones: 'Cherrapunji-Mawsynram belt, East Khasi Hills & Jaintia Hills',
      description: 'Specialized pore-pressure sensors deployed across the highest precipitation belts in the world to mitigate sudden rock falls.',
    },
    {
      name: 'Sikkim',
      code: 'SK',
      status: 'Active',
      riskLevel: 'High',
      riskColor: 'badge-high',
      monitoredSpots: 22,
      sensorsCount: 16,
      avgRainfall: '175 mm',
      coveragePct: 96,
      criticalZones: 'NH-10 Teesta Corridor, Gangtok Ridge & North Sikkim Axis',
      description: 'Continuous slope stability telemetry and InSAR satellite data assimilation guarding vital mountain highway lifelines.',
    },
    {
      name: 'Manipur',
      code: 'MN',
      status: 'Active',
      riskLevel: 'Moderate',
      riskColor: 'badge-moderate',
      monitoredSpots: 14,
      sensorsCount: 10,
      avgRainfall: '115 mm',
      coveragePct: 86,
      criticalZones: 'Noney Railway Yard, Tupul Valley & Imphal-Jiribam NH-37',
      description: 'Subsurface displacement monitoring deployed across key railway tunneling projects and clay-rich shale slope formations.',
    },
    {
      name: 'Nagaland',
      code: 'NL',
      status: 'Active',
      riskLevel: 'Moderate',
      riskColor: 'badge-moderate',
      monitoredSpots: 15,
      sensorsCount: 9,
      avgRainfall: '128 mm',
      coveragePct: 85,
      criticalZones: 'Kohima Bypass, Phek District & Dimapur-Kohima Highway NH-29',
      description: 'Dynamic creeping slope monitoring and piezometric alert triggers safeguarding major urban and inter-district trade corridors.',
    },
    {
      name: 'Mizoram',
      code: 'MZ',
      status: 'Active',
      riskLevel: 'Moderate',
      riskColor: 'badge-moderate',
      monitoredSpots: 19,
      sensorsCount: 11,
      avgRainfall: '160 mm',
      coveragePct: 90,
      criticalZones: 'Aizawl Urban Slopes, Lunglei Ridge & Champhai Border Zone',
      description: 'Urban slope stability surveillance with real-time geotechnical alarms protecting dense hillside municipal structures.',
    },
    {
      name: 'Tripura',
      code: 'TR',
      status: 'Active',
      riskLevel: 'Low',
      riskColor: 'badge-low',
      monitoredSpots: 14,
      sensorsCount: 6,
      avgRainfall: '98 mm',
      coveragePct: 82,
      criticalZones: 'Jampui Hills, Dhalai Valley & Gomati Basin escarpments',
      description: 'Hydrological runoff and sediment movement tracking across folded anticline ridges and rural highway passes.',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill in your name, email, and message.');
      return;
    }
    setFormSubmitted(true);
    setContactForm({
      name: '',
      email: '',
      agency: '',
      subject: '',
      message: '',
      inquiryType: 'General Inquiry',
    });
    setTimeout(() => {
      setFormSubmitted(false);
    }, 6000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedState = nerStates[selectedStateIndex];

  return (
    <div className="landing-page">
      {/* 1. TOP OFFICIAL NOTIFICATION BAR */}
      <div className="top-gov-bar">
        <div className="top-gov-left">
          <span className="national-flag-icon" role="img" aria-label="India Flag">🇮🇳</span>
          <span>Government of India • Ministry of Development of North Eastern Region (MDoNER) Collaboration</span>
        </div>
        <div className="top-gov-right">
          <div className="system-status-indicator">
            <span className="status-dot-pulse"></span>
            <span>Real-Time Sensor Grid: OPERATIONAL</span>
          </div>
          <Link to="/system-status" className="top-gov-link">
            System Telemetry &rarr;
          </Link>
        </div>
      </div>

      {/* 2. PUBLIC STICKY NAVIGATION */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <Link to="/" className="brand-wrapper">
            <img src="/logo.jpg" alt="BhuRakshak AI Logo" className="brand-logo-img" />
            <div className="brand-info">
              <span className="brand-title">BhuRakshak AI</span>
              <span className="brand-tagline">भू-रक्षक AI • North East Early Warning</span>
            </div>
          </Link>

          <div className="nav-links-desktop">
            <a href="#about" className="nav-anchor">About</a>
            <a href="#features" className="nav-anchor">Features</a>
            <a href="#how-it-works" className="nav-anchor">How It Works</a>
            <a href="#ner-coverage" className="nav-anchor">NER States</a>
            <a href="#contact" className="nav-anchor">Contact</a>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="btn-nav-login">Sign In</Link>
            <Link to="/dashboard" className="btn-nav-dashboard">
              <span>Go to Dashboard</span>
              <span>&rarr;</span>
            </Link>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#about" className="nav-anchor" onClick={() => setMobileMenuOpen(false)}>About Project</a>
          <a href="#features" className="nav-anchor" onClick={() => setMobileMenuOpen(false)}>System Features</a>
          <a href="#how-it-works" className="nav-anchor" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#ner-coverage" className="nav-anchor" onClick={() => setMobileMenuOpen(false)}>NER State Coverage</a>
          <a href="#contact" className="nav-anchor" onClick={() => setMobileMenuOpen(false)}>Emergency Contact</a>
          <Link to="/register" className="btn-nav-login" onClick={() => setMobileMenuOpen(false)}>Get Started / Register</Link>
          <Link to="/dashboard" className="btn-nav-dashboard" onClick={() => setMobileMenuOpen(false)}>Launch Dashboard &rarr;</Link>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <header className="hero-section">
        {/* Animated Background Shapes */}
        <div className="hero-bg-shapes">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
          <div className="topo-lines-overlay"></div>
        </div>

        <div className="hero-container">
          {/* Hero Content Left */}
          <div className="hero-content">
            <div className="hero-alert-pill">
              <span className="pill-glow"></span>
              <span>Real-Time Geo-Hazard Surveillance Active</span>
            </div>

            <h1 className="hero-main-title">
              BhuRakshak <span>AI</span>
            </h1>

            <p className="hero-tagline">
              AI-Based Early Warning & Landslide Risk Monitoring System for North East Region
            </p>

            <div className="hero-motto-wrapper">
              <span className="hero-motto-text">People • Planet • Prepared</span>
            </div>

            <p className="hero-description">
              Safeguarding mountain highways, remote hill settlements, and critical infrastructure across the 8 North Eastern States through high-precision AI forecasting, real-time IoT geotechnical sensors, and automated multi-agency hazard alerts.
            </p>

            <div className="hero-cta-group">
              <Link to="/register" className="hero-btn-primary">
                <span>Get Started</span>
                <span>⚡</span>
              </Link>
              <Link to="/dashboard" className="hero-btn-secondary">
                <span>Go to Dashboard</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="hero-micro-trust">
              <div className="trust-item">
                <span>🛡️</span>
                <span>NDMA & GSI Aligned</span>
              </div>
              <div className="trust-item">
                <span>🛰️</span>
                <span>ISRO / NESAC Telemetry</span>
              </div>
              <div className="trust-item">
                <span>⏱️</span>
                <span>Sub-Minute Alerting</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Right */}
          <div className="hero-visual-card">
            <div className="hero-visual-glow"></div>
            <div className="hero-visual-box">
              <div className="hero-logo-frame">
                <img src="/logo.jpg" alt="BhuRakshak AI Emblem" className="hero-logo-img" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                BhuRakshak AI
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#93c5fd', fontWeight: 600 }}>
                AI FOR SAFER HILLS
              </p>

              <div className="hero-visual-badges">
                <span className="v-badge">📡 Multi-Sensor IoT</span>
                <span className="v-badge">🧠 Neural Predictive</span>
                <span className="v-badge">🛰️ Sentinel SAR</span>
              </div>

              <div className="hero-telemetry-strip">
                <div className="telemetry-item">
                  <span className="telemetry-val">94.7%</span>
                  <span className="telemetry-lbl">Accuracy</span>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-val">&lt; 30s</span>
                  <span className="telemetry-lbl">Alert Latency</span>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-val">100%</span>
                  <span className="telemetry-lbl">Public Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. STATS BAR SECTION */}
      <section className="stats-bar-section">
        <div className="stats-grid">
          {/* Stat 1 */}
          <div className="stat-card">
            <div className="stat-icon-bubble icon-blue">
              📍
            </div>
            <div className="stat-content">
              <span className="stat-number">142+</span>
              <span className="stat-label">Monitored Locations</span>
              <span className="stat-subtext">Critical passes & arterial highways</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="stat-card">
            <div className="stat-icon-bubble icon-green">
              📡
            </div>
            <div className="stat-content">
              <span className="stat-number">96</span>
              <span className="stat-label">Active Sensors</span>
              <span className="stat-subtext">Piezometers, tiltmeters & rain gauges</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="stat-card">
            <div className="stat-icon-bubble icon-amber">
              🧠
            </div>
            <div className="stat-content">
              <span className="stat-number">94.7%</span>
              <span className="stat-label">AI Accuracy</span>
              <span className="stat-subtext">Validated slope failure prediction</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="stat-card">
            <div className="stat-icon-bubble icon-purple">
              🗺️
            </div>
            <div className="stat-content">
              <span className="stat-number">8</span>
              <span className="stat-label">NER States Covered</span>
              <span className="stat-subtext">Comprehensive regional coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section id="about" className="section-wrapper">
        <div className="about-container">
          <div className="about-text-col">
            <div className="section-tag-badge">
              <span>🛡️ Mission & Architecture</span>
            </div>
            <h2 className="section-heading">
              Next-Generation Geo-Intelligence for <span>Mountain Resilience</span>
            </h2>
            <p className="about-lead">
              The fragile geological terrain of the North Eastern Region faces recurrent monsoon landslides, disrupting essential supply lifelines and risking thousands of lives annually.
            </p>
            <p className="about-body">
              <strong>BhuRakshak AI</strong> unifies space-borne Earth Observation data, in-situ subsurface geotechnical sensors, Doppler weather radar precipitation tracking, and deep ensemble learning models. Our platform converts complex geological data into actionable 24 to 72-hour advance alerts for disaster management officers, highway patrol teams, and mountain communities.
            </p>

            <div className="about-pillars-grid">
              <div className="pillar-card">
                <span className="pillar-icon">🏔️</span>
                <div>
                  <h4 className="pillar-title">Geological Terrain Modeling</h4>
                  <p className="pillar-desc">
                    High-resolution Digital Elevation Models (DEM) merged with lithological fault mapping and slope curvature analysis.
                  </p>
                </div>
              </div>

              <div className="pillar-card">
                <span className="pillar-icon">🌦️</span>
                <div>
                  <h4 className="pillar-title">IMD Precipitation Anomaly Tracking</h4>
                  <p className="pillar-desc">
                    Continuous monitoring of cumulative rainfall thresholds and soil moisture saturation index to catch sudden slip events.
                  </p>
                </div>
              </div>

              <div className="pillar-card">
                <span className="pillar-icon">🤝</span>
                <div>
                  <h4 className="pillar-title">Hyperlocal Community Protection</h4>
                  <p className="pillar-desc">
                    Direct integration with citizen ground observers, emergency sirens, and district disaster management command centers.
                  </p>
                </div>
              </div>
            </div>

            <div className="about-action-row">
              <Link to="/about" className="btn-primary">
                <span>Explore Technical Specs</span>
                <span>&rarr;</span>
              </Link>
              <Link to="/risk-map" className="btn-secondary">
                <span>View Live Risk Map</span>
              </Link>
            </div>
          </div>

          {/* About Visual Column */}
          <div className="about-visual-col">
            <div className="about-graphic-frame">
              <div className="graphic-header">
                <span className="graphic-title">LIVE GEOTECHNICAL TELEMETRY</span>
                <span className="graphic-live-tag">LIVE FEED</span>
              </div>

              <div className="sensor-node-mock">
                <div className="node-top">
                  <span className="node-name">Teesta Valley Axis • Node-04</span>
                  <span className="node-status">🟢 Calibrated</span>
                </div>
                <div className="node-metrics">
                  <div className="metric-box">
                    <div className="metric-val">1.42 mm</div>
                    <div className="metric-lbl">Displacement</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-val">78.4%</div>
                    <div className="metric-lbl">Soil Moisture</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-val">14.2 kPa</div>
                    <div className="metric-lbl">Pore Pressure</div>
                  </div>
                </div>
              </div>

              <div className="sensor-node-mock">
                <div className="node-top">
                  <span className="node-name">Dima Hasao Slopes • Node-11</span>
                  <span className="node-status">🟢 Calibrated</span>
                </div>
                <div className="node-metrics">
                  <div className="metric-box">
                    <div className="metric-val">0.68 mm</div>
                    <div className="metric-lbl">Displacement</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-val">62.1%</div>
                    <div className="metric-lbl">Soil Moisture</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-val">9.8 kPa</div>
                    <div className="metric-lbl">Pore Pressure</div>
                  </div>
                </div>
              </div>

              <div className="radar-sweep-visual">
                <div className="radar-sweep-line"></div>
                <div className="radar-center-text">
                  <span style={{ fontSize: '1.5rem' }}>🛰️</span>
                  <p>InSAR Coherence Scanning • Sentinel-1 Pass Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES SECTION */}
      <section id="features" className="features-section-bg section-wrapper" style={{ maxWidth: '100%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="section-header-center">
            <div className="section-tag-badge">
              <span>⚡ Core Capabilities</span>
            </div>
            <h2 className="section-heading">
              Comprehensive AI & IoT <span>Landslide Monitoring</span>
            </h2>
            <p className="section-subtext">
              Engineered specifically for the rugged terrain and distinct meteorological conditions of North East India.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                🗺️
              </div>
              <h3 className="feature-title">GIS Risk Mapping</h3>
              <p className="feature-description">
                Interactive spatial maps with multi-layer overlays displaying terrain slope gradients, lithological fragility, drainage basins, and dynamic high-risk landslide heatmaps.
              </p>
              <div className="feature-tags-list">
                <span className="feature-tag-chip">Leaflet & MapLibre</span>
                <span className="feature-tag-chip">Contour Layers</span>
                <span className="feature-tag-chip">Hazard Zones</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                🧠
              </div>
              <h3 className="feature-title">AI Prediction</h3>
              <p className="feature-description">
                Advanced machine learning ensemble models (LSTM + Random Forest) processing spatio-temporal indicators to project slope stability thresholds up to 72 hours ahead.
              </p>
              <div className="feature-tags-list">
                <span className="feature-tag-chip">94.7% Validation</span>
                <span className="feature-tag-chip">72h Early Window</span>
                <span className="feature-tag-chip">Displacement Index</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                🚨
              </div>
              <h3 className="feature-title">Real-time Alerts</h3>
              <p className="feature-description">
                Instantaneous hazard warnings dispatched via SMS sirens, push notifications, and automated emergency bulletins to District Magistrates, SDRF, and NHAI patrol units.
              </p>
              <div className="feature-tags-list">
                <span className="feature-tag-chip">Automated SMS</span>
                <span className="feature-tag-chip">District Protocols</span>
                <span className="feature-tag-chip">SDRF Integration</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                🌦️
              </div>
              <h3 className="feature-title">Weather Monitoring</h3>
              <p className="feature-description">
                Direct integration with India Meteorological Department (IMD) radar feeds, cloudburst indicators, 24-hour rainfall telemetry, and real-time runoff saturation tracking.
              </p>
              <div className="feature-tags-list">
                <span className="feature-tag-chip">IMD Doppler Sync</span>
                <span className="feature-tag-chip">Rain Thresholds</span>
                <span className="feature-tag-chip">Cloudburst Watch</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                📡
              </div>
              <h3 className="feature-title">Sensor Network</h3>
              <p className="feature-description">
                LoRaWAN and 4G IoT geotechnical network reading digital inclinometers, vibrating wire piezometers, soil moisture probes, and tiltmeters deployed across critical hillsides.
              </p>
              <div className="feature-tags-list">
                <span className="feature-tag-chip">96 IoT Nodes</span>
                <span className="feature-tag-chip">LoRa Long Range</span>
                <span className="feature-tag-chip">Solar Powered</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                👥
              </div>
              <h3 className="feature-title">Citizen Reporting</h3>
              <p className="feature-description">
                Community crowd-sourcing portal enabling mountain residents, travelers, and field scouts to submit geotagged photos of fresh ground cracks and road subsidence in seconds.
              </p>
              <div className="feature-tags-list">
                <span className="feature-tag-chip">Geo-tagged Photos</span>
                <span className="feature-tag-chip">Crowd Intelligence</span>
                <span className="feature-tag-chip">Rapid Verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="section-wrapper">
        <div className="section-header-center">
          <div className="section-tag-badge">
            <span>🔄 End-To-End Architecture</span>
          </div>
          <h2 className="section-heading">
            How <span>BhuRakshak AI</span> Works
          </h2>
          <p className="section-subtext">
            A continuous loop from physical hill sensor acquisition to automated civil defense activation.
          </p>
        </div>

        <div className="how-it-works-flow">
          {/* Step 1 */}
          <div className="flow-step-card">
            <span className="step-number-badge">STEP 01</span>
            <div className="step-icon">📡</div>
            <h3 className="step-title">Data Collection</h3>
            <p className="step-description">
              In-situ slope sensors, IMD precipitation radar streams, and satellite SAR imagery are gathered continuously at 5-minute sampling rates.
            </p>
            <div className="step-arrow-indicator">
              <span>Next Phase &rarr;</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flow-step-card">
            <span className="step-number-badge">STEP 02</span>
            <div className="step-icon">🧠</div>
            <h3 className="step-title">AI Analysis</h3>
            <p className="step-description">
              Deep neural networks and physical slope stability algorithms ingest hydrological pressure, rock density, and rainfall triggers.
            </p>
            <div className="step-arrow-indicator">
              <span>Next Phase &rarr;</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flow-step-card">
            <span className="step-number-badge">STEP 03</span>
            <div className="step-icon">📊</div>
            <h3 className="step-title">Risk Assessment</h3>
            <p className="step-description">
              Multi-tiered hazard modeling assigns real-time susceptibility indices to micro-catchments, highways, and community settlements.
            </p>
            <div className="step-arrow-indicator">
              <span>Next Phase &rarr;</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flow-step-card">
            <span className="step-number-badge">STEP 04</span>
            <div className="step-icon">🚨</div>
            <h3 className="step-title">Alert Generation</h3>
            <p className="step-description">
              Multi-channel warning alerts are broadcast to emergency authorities, traffic police, public sirens, and registered citizens.
            </p>
            <div className="step-arrow-indicator">
              <span>Action Complete ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NER MAP SECTION */}
      <section id="ner-coverage" className="ner-section-bg section-wrapper" style={{ maxWidth: '100%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="section-header-center">
            <div className="section-tag-badge">
              <span>🏔️ Regional Coverage</span>
            </div>
            <h2 className="section-heading">
              Monitoring All <span>8 North East States</span>
            </h2>
            <p className="section-subtext">
              Active telemetry deployed across strategic transport corridors, Himalayan fault zones, and tribal districts. Click on any state to view its real-time surveillance metrics.
            </p>
          </div>

          <div className="ner-layout-grid">
            {/* States List Cards */}
            <div className="ner-states-grid">
              {nerStates.map((state, index) => (
                <div
                  key={state.code}
                  className={`state-status-card ${selectedStateIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedStateIndex(index)}
                >
                  <div className="state-card-header">
                    <span className="state-name">{state.name}</span>
                    <span className={`state-badge ${state.riskColor}`}>{state.riskLevel} Risk</span>
                  </div>

                  <div className="state-metrics-row">
                    <span>{state.monitoredSpots} Critical Spots</span>
                    <span>{state.sensorsCount} Live Sensors</span>
                  </div>

                  <div className="state-coverage-bar">
                    <div className="coverage-fill" style={{ width: `${state.coveragePct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected State Telemetry Box */}
            <div className="ner-map-preview-box">
              <div className="ner-map-header">
                <span className="ner-map-title">State Geo-Profile</span>
                <p className="ner-map-sub">North Eastern Regional Command Grid</p>
              </div>

              {/* Graphical Representation of NE Region */}
              <div className="svg-map-wrapper">
                <svg className="ner-svg-canvas" viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Decorative map contours of NE India */}
                  <path
                    d="M 50 60 Q 90 40 140 70 T 230 50 T 320 80 Q 300 130 240 150 T 170 180 T 90 190 T 50 140 Z"
                    fill="rgba(26, 115, 232, 0.15)"
                    stroke="rgba(96, 165, 250, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  {/* State Node Pins */}
                  <circle cx="85" cy="115" r="7" fill={selectedStateIndex === 0 ? '#00e676' : '#60a5fa'} />
                  <text x="96" y="119" fill="#e2e8f0" fontSize="10" fontWeight="600">Assam</text>

                  <circle cx="195" cy="55" r="7" fill={selectedStateIndex === 1 ? '#00e676' : '#60a5fa'} />
                  <text x="206" y="59" fill="#e2e8f0" fontSize="10" fontWeight="600">Arunachal</text>

                  <circle cx="95" cy="145" r="7" fill={selectedStateIndex === 2 ? '#00e676' : '#60a5fa'} />
                  <text x="106" y="149" fill="#e2e8f0" fontSize="10" fontWeight="600">Meghalaya</text>

                  <circle cx="45" cy="75" r="7" fill={selectedStateIndex === 3 ? '#00e676' : '#60a5fa'} />
                  <text x="56" y="79" fill="#e2e8f0" fontSize="10" fontWeight="600">Sikkim</text>

                  <circle cx="195" cy="140" r="7" fill={selectedStateIndex === 4 ? '#00e676' : '#60a5fa'} />
                  <text x="206" y="144" fill="#e2e8f0" fontSize="10" fontWeight="600">Manipur</text>

                  <circle cx="215" cy="110" r="7" fill={selectedStateIndex === 5 ? '#00e676' : '#60a5fa'} />
                  <text x="226" y="114" fill="#e2e8f0" fontSize="10" fontWeight="600">Nagaland</text>

                  <circle cx="165" cy="180" r="7" fill={selectedStateIndex === 6 ? '#00e676' : '#60a5fa'} />
                  <text x="176" y="184" fill="#e2e8f0" fontSize="10" fontWeight="600">Mizoram</text>

                  <circle cx="115" cy="175" r="7" fill={selectedStateIndex === 7 ? '#00e676' : '#60a5fa'} />
                  <text x="126" y="179" fill="#e2e8f0" fontSize="10" fontWeight="600">Tripura</text>
                </svg>

                <div className="selected-state-telemetry">
                  <h4 className="sel-state-name">
                    {selectedState.name} ({selectedState.code})
                  </h4>
                  <p className="sel-state-desc">
                    {selectedState.description}
                  </p>

                  <div className="sel-state-specs">
                    <div className="spec-box">
                      <span className="spec-lbl">Monitored Spots</span>
                      <span className="spec-val">{selectedState.monitoredSpots} Locations</span>
                    </div>
                    <div className="spec-box">
                      <span className="spec-lbl">Current Risk</span>
                      <span className="spec-val">{selectedState.riskLevel} Level</span>
                    </div>
                    <div className="spec-box">
                      <span className="spec-lbl">24h Rainfall</span>
                      <span className="spec-val">{selectedState.avgRainfall}</span>
                    </div>
                    <div className="spec-box">
                      <span className="spec-lbl">Active Nodes</span>
                      <span className="spec-val">{selectedState.sensorsCount} Sensors</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>
                      Key Hazard Corridors:
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>
                      {selectedState.criticalZones}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/risk-map" className="btn-view-map-link">
                Open Full Interactive GIS Map &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION */}
      <section id="contact" className="contact-section-bg section-wrapper">
        <div className="section-header-center">
          <div className="section-tag-badge">
            <span>📞 Official Communications</span>
          </div>
          <h2 className="section-heading">
            Connect with <span>Emergency Operations</span>
          </h2>
          <p className="section-subtext">
            For inter-agency integrations, SDRF telemetry feeds, research data requests, and incident notifications.
          </p>
        </div>

        <div className="contact-layout-grid">
          {/* Contact Information Cards */}
          <div className="contact-info-cards">
            <div className="contact-card-box">
              <div className="contact-card-icon">🏢</div>
              <div className="contact-card-info">
                <h4>Regional Operations Center</h4>
                <p>North Eastern Space Applications Centre (NESAC) & State Disaster Management Cells</p>
                <span className="contact-card-highlight">Guwahati & Shillong Command Desks</span>
              </div>
            </div>

            <div className="contact-card-box">
              <div className="contact-card-icon">🚨</div>
              <div className="contact-card-info">
                <h4>24/7 Emergency Landslide Hotline</h4>
                <p>Toll-free emergency dispatch for landslides, road blockades, and structural fissures</p>
                <span className="contact-card-highlight">1800-419-7425 (BHURAKSHAK)</span>
              </div>
            </div>

            <div className="contact-card-box">
              <div className="contact-card-icon">✉️</div>
              <div className="contact-card-info">
                <h4>Official Telemetry Desk</h4>
                <p>Secure data exchange with district commissioners, GSI surveyors, and engineering units</p>
                <span className="contact-card-highlight">ops@bhurakshak.gov.in</span>
              </div>
            </div>

            <div className="contact-card-box">
              <div className="contact-card-icon">⏱️</div>
              <div className="contact-card-info">
                <h4>Disaster Response SLA</h4>
                <p>Immediate automated siren trigger | Within 15 minutes physical team dispatch</p>
                <span className="contact-card-highlight">SOP Level-1 Protocol Active</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <div className="contact-form-header">
              <h3 className="contact-form-title">Send Official Inquiry or Alert</h3>
              <p className="contact-form-sub">
                Our nodal operations team will respond promptly through official secure channels.
              </p>
            </div>

            {formSubmitted && (
              <div className="form-feedback-alert">
                <span>✓</span>
                <span>Thank you! Your inquiry has been routed to the Regional Operations Desk. Reference ID: #BR-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
            )}

            <form className="contact-form" onSubmit={handleFormSubmit}>
              <div className="contact-form-grid">
                <div>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="form-input-control"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email">Official Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    placeholder="e.g. name@gov.in / name@org.in"
                    className="form-input-control"
                    required
                  />
                </div>
              </div>

              <div className="contact-form-grid">
                <div>
                  <label htmlFor="agency">Agency / Department</label>
                  <input
                    type="text"
                    id="agency"
                    name="agency"
                    value={contactForm.agency}
                    onChange={handleInputChange}
                    placeholder="e.g. District Disaster Management, NHAI, SDRF"
                    className="form-input-control"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryType">Inquiry Category</label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={contactForm.inquiryType}
                    onChange={handleInputChange}
                    className="form-input-control"
                  >
                    <option value="General Inquiry">General Technical Inquiry</option>
                    <option value="Urgent Landslide Hazard">Urgent Landslide Incident Notification</option>
                    <option value="Sensor API Integration">Sensor Network / API Telemetry Request</option>
                    <option value="District Deployment">District Administration Deployment</option>
                    <option value="Citizen Observer Network">Citizen Observer Program</option>
                  </select>
                </div>
              </div>

              <div className="form-group-full">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  placeholder="Summary of request or location details"
                  className="form-input-control"
                  required
                />
              </div>

              <div className="form-group-full">
                <label htmlFor="message">Detailed Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  placeholder="Provide precise coordinates, road corridor, sensor identifier or inquiry description..."
                  className="form-input-control"
                  rows="4"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-form-submit">
                <span>Submit Transmission</span>
                <span>📤</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="landing-footer">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <img src="/logo.jpg" alt="BhuRakshak AI" className="footer-logo-img" />
              <span className="footer-brand-title">BhuRakshak AI</span>
            </div>
            <p className="footer-brand-desc">
              AI-Based Early Warning & Landslide Risk Monitoring System dedicated to safeguarding human lives and critical infrastructure across the North Eastern Region.
            </p>
            <div>
              <span className="footer-motto-tag">PEOPLE • PLANET • PREPARED</span>
            </div>
            <div className="footer-social-row">
              <a href="#about" className="social-btn" title="Government Portal">🏛️</a>
              <a href="#features" className="social-btn" title="National GIS">🗺️</a>
              <a href="#ner-coverage" className="social-btn" title="Satellite Grid">🛰️</a>
              <a href="#contact" className="social-btn" title="Emergency Comms">📻</a>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <h4 className="footer-col-title">Command Center</h4>
            <div className="footer-links-list">
              <Link to="/dashboard" className="footer-link-item">&rarr; Main Dashboard</Link>
              <Link to="/risk-map" className="footer-link-item">&rarr; GIS Risk Map</Link>
              <Link to="/ai-prediction" className="footer-link-item">&rarr; AI Prediction Engine</Link>
              <Link to="/sensor-monitoring" className="footer-link-item">&rarr; Sensor Grid Live</Link>
              <Link to="/alerts" className="footer-link-item">&rarr; Emergency Bulletins</Link>
            </div>
          </div>

          {/* Public Services Col */}
          <div>
            <h4 className="footer-col-title">Public Services</h4>
            <div className="footer-links-list">
              <Link to="/citizen-reports" className="footer-link-item">&rarr; Citizen Crack Reporting</Link>
              <Link to="/imd-monitoring" className="footer-link-item">&rarr; IMD Weather Tracking</Link>
              <Link to="/historical-data" className="footer-link-item">&rarr; Historical Landslide Data</Link>
              <Link to="/system-status" className="footer-link-item">&rarr; System Health & Nodes</Link>
              <Link to="/analytics" className="footer-link-item">&rarr; Regional Analytics</Link>
            </div>
          </div>

          {/* Authentication & Policy */}
          <div>
            <h4 className="footer-col-title">Access & Portal</h4>
            <div className="footer-links-list">
              <Link to="/login" className="footer-link-item">&rarr; Official Sign In</Link>
              <Link to="/register" className="footer-link-item">&rarr; Register Personnel</Link>
              <Link to="/verify-otp" className="footer-link-item">&rarr; Verify Telemetry OTP</Link>
              <Link to="/admin-settings" className="footer-link-item">&rarr; Admin Configurations</Link>
              <a href="#contact" className="footer-link-item">&rarr; Technical Support</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-disclaimer">
            © 2026 BhuRakshak AI. All rights reserved. Developed for high-precision slope risk monitoring in North East India. Data synchronized with National Disaster Management Authority (NDMA) & Geological Survey of India (GSI) standards.
          </div>
          <button className="footer-back-to-top" onClick={scrollToTop}>
            <span>Back to top</span>
            <span>↑</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
