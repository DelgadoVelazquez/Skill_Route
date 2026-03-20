
import '../ClaimBadgePage.css'; 
export default function ClaimBadgePage() {
  return (
    <main className="claim-page">
      <div className="claim-wrapper">
        <div className="claim-top">
          <div className="claim-pill">• EVENTO EN VIVO · hackathon 2026</div>

          <div className="claim-badge-circle">
  <img
    src="/img/image.png"
    alt="IA Badge"
    className="claim-badge-img"
  />
</div>
        </div>

        <section className="claim-hero">
          <h1 className="claim-title">hackathon</h1>

          <p className="claim-meta">
            Emitido por <strong>Stellar México</strong> · 20 Mar 2026
          </p>

          <div className="claim-chip">🔗 BADGE-SUMMIT26 · Stellar Blockchain</div>
        </section>

        <section className="claim-card">
          <h2 className="claim-card-title">Reclama tu insignia</h2>

          <form className="claim-form">
            <div className="claim-group">
              <label htmlFor="name">NOMBRE COMPLETO</label>
              <input
                id="name"
                type="text"
                placeholder="Ej. Ana García López"
              />
            </div>

            <div className="claim-group">
              <label htmlFor="email">CORREO ELECTRÓNICO</label>
              <input
                id="email"
                type="email"
                placeholder="ana@ejemplo.com"
              />
            </div>

            <button type="submit" className="claim-button">
              Reclamar mi insignia →
            </button>

            <p className="claim-note">
              🔒 Sin wallet ni app necesaria · Solo tu email
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}