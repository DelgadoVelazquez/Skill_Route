'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import '../ClaimBadgePage.css';

interface BadgeData {
  code: string;
  title: string;
  issuer: string;
  event: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  claimUrl: string;
}

interface ClaimRecord {
  code: string;
  title: string;
  issuer: string;
  event: string;
  description: string;
  imageUrl: string;
  claimedAt: string;
  claimerName: string;
  claimerEmail: string;
  txid?: string;
  explorerUrl?: string;
}

function ClaimBadgeContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [badge, setBadge] = useState<BadgeData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    if (!code) {
      setNotFound(true);
      return;
    }
    const all: BadgeData[] = JSON.parse(localStorage.getItem('sr_badges_created') ?? '[]');
    const found = all.find(b => b.code === code);
    if (!found) {
      setNotFound(true);
    } else {
      setBadge(found);
    }
  }, [code]);

  async function handleClaim(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!badge) return;
    setLoading(true);

    const allClaims: Record<string, ClaimRecord[]> = JSON.parse(localStorage.getItem('sr_badge_claims') ?? '{}');
    const userClaims = allClaims[email.toLowerCase()] ?? [];
    const alreadyHas = userClaims.some(c => c.code === badge.code);

    if (alreadyHas) {
      setAlreadyClaimed(true);
      setLoading(false);
      return;
    }

    // Emitir badge SBT en Stellar vinculado a la wallet del usuario
    let txid: string | undefined;
    let explorerUrl: string | undefined;
    try {
      const res = await fetch('/api/badge/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), badgeCode: badge.code, title: badge.title }),
      });
      const data = await res.json();
      if (data.success) {
        txid = data.txid;
        explorerUrl = data.explorerUrl;
      }
    } catch {
      // Si falla Stellar, igual guardamos el claim localmente
    }

    const claim: ClaimRecord = {
      code: badge.code,
      title: badge.title,
      issuer: badge.issuer,
      event: badge.event,
      description: badge.description,
      imageUrl: badge.imageUrl,
      claimedAt: new Date().toISOString(),
      claimerName: name,
      claimerEmail: email.toLowerCase(),
      txid,
      explorerUrl,
    };

    localStorage.setItem('sr_badge_claims', JSON.stringify({
      ...allClaims,
      [email.toLowerCase()]: [...userClaims, claim],
    }));

    setLoading(false);
    setClaimed(true);
  }

  if (notFound) {
    return (
      <main className="claim-page">
        <div className="claim-wrapper" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#1A1B5E' }}>Badge no encontrado</h2>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: '#555' }}>
            El código <strong>{code ?? '(vacío)'}</strong> no corresponde a ningún badge activo.
          </p>
          <Link href="/" className="claim-button" style={{ maxWidth: 260, margin: '0 auto' }}>
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  if (!badge) {
    return (
      <main className="claim-page">
        <div className="claim-wrapper" style={{ textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: 15 }}>Cargando badge...</p>
        </div>
      </main>
    );
  }

  if (claimed) {
    return (
      <main className="claim-page">
        <div className="claim-wrapper">
          <div className="claim-top">
            <div className="claim-pill">• BADGE RECLAMADO EXITOSAMENTE</div>
            <div className="claim-badge-circle">
              {badge.imageUrl
                ? <img src={badge.imageUrl} alt={badge.title} className="claim-badge-img" />
                : (
                  <>
                    <div className="claim-badge-emoji">🏅</div>
                    <span className="claim-badge-text">BADGE</span>
                  </>
                )
              }
            </div>
          </div>

          <section className="claim-hero">
            <h1 className="claim-title">¡{badge.title}!</h1>
            <p className="claim-meta">
              Emitido por <strong>{badge.issuer}</strong> · {badge.event}
            </p>
            <div className="claim-chip">🔗 {badge.code} · Stellar Blockchain</div>
          </section>

          <div className="claim-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 className="claim-card-title">¡Insignia agregada a tu Passport!</h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#555' }}>
              Inicia sesión con <strong>{email}</strong> para verla en Mi Passport.
            </p>
            <Link href="/passport" className="claim-button">
              Ir a mi Passport →
            </Link>
            <p className="claim-note" style={{ marginTop: 12 }}>
              🔒 Registrado en Stellar Blockchain · {badge.code}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (alreadyClaimed) {
    return (
      <main className="claim-page">
        <div className="claim-wrapper">
          <div className="claim-top">
            <div className="claim-pill">• BADGE YA RECLAMADO</div>
            <div className="claim-badge-circle">
              {badge.imageUrl
                ? <img src={badge.imageUrl} alt={badge.title} className="claim-badge-img" />
                : (
                  <>
                    <div className="claim-badge-emoji">⚠️</div>
                    <span className="claim-badge-text">BADGE</span>
                  </>
                )
              }
            </div>
          </div>
          <section className="claim-hero">
            <h1 className="claim-title">{badge.title}</h1>
            <p className="claim-meta">Este badge ya está asociado a <strong>{email}</strong></p>
          </section>
          <div className="claim-card" style={{ textAlign: 'center' }}>
            <Link href="/passport" className="claim-button">
              Ver mi Passport →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const createdDate = new Date(badge.createdAt).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <main className="claim-page">
      <div className="claim-wrapper">
        <div className="claim-top">
          <div className="claim-pill">• {badge.event}</div>

          <div className="claim-badge-circle">
            {badge.imageUrl
              ? <img src={badge.imageUrl} alt={badge.title} className="claim-badge-img" />
              : (
                <>
                  <div className="claim-badge-emoji">🏅</div>
                  <span className="claim-badge-text">BADGE</span>
                </>
              )
            }
          </div>
        </div>

        <section className="claim-hero">
          <h1 className="claim-title">{badge.title}</h1>
          <p className="claim-meta">
            Emitido por <strong>{badge.issuer}</strong> · {createdDate}
          </p>
          <div className="claim-chip">🔗 {badge.code} · Stellar Blockchain</div>
        </section>

        <section className="claim-card">
          <h2 className="claim-card-title">Reclama tu insignia</h2>

          <form className="claim-form" onSubmit={handleClaim}>
            <div className="claim-group">
              <label htmlFor="name">NOMBRE COMPLETO</label>
              <input
                id="name"
                type="text"
                placeholder="Ej. Ana García López"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="claim-group">
              <label htmlFor="email">CORREO ELECTRÓNICO</label>
              <input
                id="email"
                type="email"
                placeholder="ana@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="claim-button"
              disabled={loading}
              style={{ border: 'none', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Procesando...' : 'Reclamar mi insignia →'}
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

export default function ClaimBadgePage() {
  return (
    <Suspense fallback={
      <main className="claim-page">
        <div className="claim-wrapper" style={{ textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: 15 }}>Cargando...</p>
        </div>
      </main>
    }>
      <ClaimBadgeContent />
    </Suspense>
  );
}
