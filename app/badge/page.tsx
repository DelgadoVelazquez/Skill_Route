import Link from "next/link";

export default function BadgePage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="avatar-ring">
            <div className="avatar-core">🤖</div>
          </div>

          <h1 className="login-title">csa</h1>
          <p className="login-subtitle">Pionero en Inteligencia Artificial</p>
          <p className="login-meta">Summit IA México 2026 - TechSummit México</p>
        </div>

        <div className="login-body">
          <div className="badge-content">
            <div className="badge-row">
              <span className="badge-label">Evento</span>
              <span className="badge-value">Summit IA México 2026</span>
            </div>

            <div className="badge-row">
              <span className="badge-label">Emisor</span>
              <span className="badge-value">TechSummit México</span>
            </div>

            <div className="badge-row">
              <span className="badge-label">Fecha</span>
              <span className="badge-value">13 de marzo de 2026</span>
            </div>

            <div className="badge-row">
              <span className="badge-label">Descripción</span>
              <span className="badge-value">
                Reconocimiento por participación activa en el Summit de
                Inteligencia Artificial más importante de México.
              </span>
            </div>

            <div className="badge-verify-box">
              <div className="badge-check">✓</div>

              <div>
                <div className="badge-verify-title">
                  Verificado en Stellar Blockchain
                </div>
                <div className="badge-verify-text">TXID</div>
                <div className="badge-verify-text">
                  f3474ce2ee6e50e8e34f...
                </div>
              </div>
            </div>

            <div className="badge-actions">
              <button className="badge-action-button">in LinkedIn</button>
              <button className="badge-action-button">Copiar link</button>
              <button className="badge-action-button">WhatsApp</button>
            </div>

            <div className="badge-passport-box">
              <h2 className="badge-passport-title">
                ¿Quieres guardar todos tus badges?
              </h2>

              <p className="badge-passport-text">
                Crea tu Passport gratuito y ten tu portafolio verificado siempre
                disponible. Gratis hasta 5 badges.
              </p>

              <Link href="/login" className="badge-passport-button">
                Crear mi Passport — es gratis →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}