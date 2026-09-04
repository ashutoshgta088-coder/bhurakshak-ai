import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="logo-icon">🛡️</span>
          <span className="footer-name">BhuRakshak AI</span>
          <span className="footer-tag">AI for Safer Hills — People · Planet · Prepared</span>
        </div>
        <div className="footer-links">
          <span>© 2026 BhuRakshak AI</span>
          <span className="footer-sep">·</span>
          <span>Monitor · Predict · Alert · Protect</span>
          <span className="footer-sep">·</span>
          <a
            href="https://github.com/ashutoshgta088-coder/bhurakshak-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-github-link"
          >
            💻 GitHub Repository
          </a>
        </div>
        <div className="footer-badges">
          <span className="f-badge">🇮🇳 NER Region</span>
          <span className="f-badge">🤖 XGBoost + SHAP</span>
          <span className="f-badge">🗺️ GIS Enabled</span>
        </div>
      </div>
    </footer>
  )
}
