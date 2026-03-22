'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import '../ClaimBadgePage.css';

interface BadgeData {
  code:        string;
  title:       string;
  issuer:      string;
  event:       string;
  description: string;
  image_url:   string;
  created_at:  string;
  claim_url:   string;
}

function ClaimBadgeContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [badge, setBadge]       = useState<BadgeData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [claimed, setClaimed]   = useState(false);
  const [txid, setTxid]         = useState('');
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    if (!code) { setNotFound(true); return; }
    const all = JSON.parse(localStorage.getItem('sr_badges_created') ?? '[]');
    const found = all.find((b: { code: string }) => b.code === code);
    if (!found) { setNotFound(true); return; }
    setBadge({
      code:       found.code,
      title:      found.title,
      issuer:     found.issuer,
      event:      found.event,
      description: found.description,
      image_url:  found.imageUrl ?? '',
      created_at: found.createdAt,
      claim_url:  found.claimUrl,
    });
  }, [code]);

  function handleClaim(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!badge) return;
    setClaimError('');
    setLoading(true);

    // Verificar si ya reclamó
    const claimsRaw = JSON.parse(localStorage.getItem('sr_badge_claims') ?? '[]');
    const claims: Array<{
      code: string; title: string; issuer: string; event: string;
      description: string; imageUrl: string; claimedAt: string;
      claimerName: string; claimerEmail: string;
    }> = Array.isArray(claimsRaw) ? claimsRaw : [];

    const alreadyClaimed = claims.some(
      c => c.code === badge.code && c.claimerEmail.toLowerCase() === email.toLowerCase()
    );
    if (alreadyClaimed) {
      setClaimError('Este correo ya reclamó este badge.');
      setLoading(false);
      return;
    }

    // Guardar claim
    claims.push({
      code:         badge.code,
      title:        badge.title,
      issuer:       badge.issuer,
      event:        badge.event,
      description:  badge.description,
      imageUrl:     badge.image_url,
      claimedAt:    new Date().toISOString(),
      claimerName:  name,
      claimerEmail: email.toLowerCase(),
    });
    localStorage.setItem('sr_badge_claims', JSON.stringify(claims));

    // Guardar en sesión del usuario si está logueado con ese email
    const session = JSON.parse(localStorage.getItem('sr_user_session') ?? 'null');
    if (session && session.email === email.toLowerCase()) {
      // Ya está en sr_badge_claims, passport lo leerá desde ahí
    }

    setTxid('');
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
              {badge.image_url
                ? <img src={badge.image_url} alt={badge.title} className="claim-badge-img" />
                : <><div className="claim-badge-emoji">🏅</div><span className="claim-badge-text">BADGE</span></>
              }
            </div>
          </div>

          <section className="claim-hero">
            <h1 className="claim-title">¡{badge.title}!</h1>
            <p className="claim-meta">Emitido por <strong>{badge.issuer}</strong> · {badge.event}</p>
            <div className="claim-chip">🔗 {badge.code} · Stellar Blockchain</div>
          </section>

          <div className="claim-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 className="claim-card-title">¡Insignia agregada a tu Passport!</h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#555' }}>
              Inicia sesión con <strong>{email}</strong> para verla en Mi Passport.
            </p>
            {txid && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txid}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', marginBottom: 12, fontSize: 13, color: '#2d4fae', fontWeight: 600 }}
              >
                🔗 Ver en StellarExpert ↗
              </a>
            )}
            <Link href="/passport" className="claim-button">Ir a mi Passport →</Link>
            <p className="claim-note" style={{ marginTop: 12 }}>🔒 Registrado en Stellar Blockchain · {badge.code}</p>
          </div>
        </div>
      </main>
    );
  }

  const createdDate = new Date(badge.created_at).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <main className="claim-page">
      <div className="claim-wrapper">
        <div className="claim-top">
          <div className="claim-pill">• {badge.event || 'BADGE DIGITAL'}</div>
          <div className="claim-badge-circle">
            {badge.image_url
              ? <img src={badge.image_url} alt={badge.title} className="claim-badge-img" />
              : <><div className="claim-badge-emoji">🏅</div><span className="claim-badge-text">BADGE</span></>
            }
          </div>
        </div>

        <section className="claim-hero">
          <h1 className="claim-title">{badge.title}</h1>
          <p className="claim-meta">Emitido por <strong>{badge.issuer}</strong> · {createdDate}</p>
          <div className="claim-chip">🔗 {badge.code} · Stellar Blockchain</div>
        </section>

        <section className="claim-card">
          <h2 className="claim-card-title">Reclama tu insignia</h2>

          <form className="claim-form" onSubmit={handleClaim}>
            <div className="claim-group">
              <label htmlFor="name">NOMBRE COMPLETO</label>
              <input id="name" type="text" placeholder="Ej. Ana García López"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="claim-group">
              <label htmlFor="email">CORREO ELECTRÓNICO</label>
              <input id="email" type="email" placeholder="ana@ejemplo.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            {claimError && (
              <p style={{ margin: 0, fontSize: 13, color: '#dc2626', textAlign: 'center' }}>{claimError}</p>
            )}

            <button type="submit" className="claim-button" disabled={loading}
              style={{ border: 'none', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Procesando...' : 'Reclamar mi insignia →'}
            </button>

            <p className="claim-note">🔒 Sin wallet ni app necesaria · Solo tu email</p>
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
