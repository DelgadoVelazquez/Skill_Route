import Link from "next/link";

export default function PassportPage() {
  return (
    <main className="passport-page">

      {/* Header con banner y avatar */}
      <div className="passport-card">
        <div className="passport-banner" />
        <div className="passport-profile">
          <div className="passport-avatar">A</div>
          <div className="passport-info">
            <div className="passport-name-row">
              <h1 className="passport-name">Ana García López</h1>
              <span className="passport-badge-free">⭐ FREE BETA</span>
            </div>
            <p className="passport-handle">@ana.garcia</p>
            <p className="passport-since">Miembro desde marzo 2026</p>
          </div>
        </div>

        {/* Stats */}
        <div className="passport-stats">
          <div className="passport-stat">
            <span className="passport-stat-number">3</span>
            <span className="passport-stat-label">BADGES GUARDADOS</span>
          </div>
          <div className="passport-stat">
            <span className="passport-stat-number">5</span>
            <span className="passport-stat-label">LÍMITE PLAN FREE</span>
          </div>
          <div className="passport-stat">
            <span className="passport-stat-number">1</span>
            <span className="passport-stat-label">EVENTO VERIFICADO</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="passport-actions">
        <button className="passport-btn-outline">🔗 Copiar perfil</button>
        <button className="passport-btn-solid">in Compartir en LinkedIn</button>
      </div>

      {/* Badges */}
      <div className="passport-section">
        <h2 className="passport-section-title">
          Mis badges verificados
          <span className="passport-count">3 de 5</span>
        </h2>

        <div className="passport-badges-grid">

          <div className="passport-badge-card">
            <div className="passport-badge-top">
              <div className="passport-badge-icon" style={{ background: "linear-gradient(135deg, #112a68, #2d4fae)" }}>🤖</div>
              <div>
                <p className="passport-badge-title">Pionero en Inteligencia Artificial</p>
                <p className="passport-badge-issuer">TechSummit México</p>
              </div>
            </div>
            <div className="passport-badge-bottom">
              <span className="passport-badge-date">13 Mar 2026</span>
              <div className="passport-badge-verify">
                <span className="passport-stellar-chip">🔗 STELLAR</span>
                <button className="passport-verify-btn">Verificar ↗</button>
              </div>
            </div>
          </div>

          <div className="passport-badge-card">
            <div className="passport-badge-top">
              <div className="passport-badge-icon" style={{ background: "linear-gradient(135deg, #7b2ff7, #2d4fae)" }}>🧠</div>
              <div>
                <p className="passport-badge-title">Innovador en Machine Learning</p>
                <p className="passport-badge-issuer">DataLab CDMX</p>
              </div>
            </div>
            <div className="passport-badge-bottom">
              <span className="passport-badge-date">20 Ene 2026</span>
              <div className="passport-badge-verify">
                <span className="passport-stellar-chip">🔗 STELLAR</span>
                <button className="passport-verify-btn">Verificar ↗</button>
              </div>
            </div>
          </div>

          <div className="passport-badge-card">
            <div className="passport-badge-top">
              <div className="passport-badge-icon" style={{ background: "linear-gradient(135deg, #f57c00, #ffd54f)" }}>⛓️</div>
              <div>
                <p className="passport-badge-title">Certificado en Blockchain</p>
                <p className="passport-badge-issuer">Stellar Foundation</p>
              </div>
            </div>
            <div className="passport-badge-bottom">
              <span className="passport-badge-date">5 Feb 2026</span>
              <div className="passport-badge-verify">
                <span className="passport-stellar-chip">🔗 STELLAR</span>
                <button className="passport-verify-btn">Verificar ↗</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Barra de capacidad */}
      <div className="passport-capacity">
        <div className="passport-capacity-row">
          <span className="passport-capacity-label">Capacidad del plan Free</span>
          <span className="passport-capacity-label">3 / 5 badges</span>
        </div>
        <div className="passport-capacity-bar">
          <div className="passport-capacity-fill" style={{ width: "60%" }} />
        </div>
      </div>

      {/* Footer */}
      <div className="passport-footer">
        <button className="passport-footer-btn">Verificando en StellarExpert...</button>
      </div>

    </main>
  );
}