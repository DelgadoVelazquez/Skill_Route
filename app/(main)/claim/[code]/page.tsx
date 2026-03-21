'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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
}

export default function ClaimBadgePage() {
  const params = useParams();
  const code = params.code as string;

  const [badge, setBadge]       = useState<BadgeData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [claimed, setClaimed]   = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    const all: BadgeData[] = JSON.parse(localStorage.getItem('sr_badges_created') ?? '[]');
    const found = all.find(b => b.code === code);
    if (!found) {
      setNotFound(true);
    } else {
      setBadge(found);
    }
  }, [code]);

  function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Check if this email already claimed this badge
    const allClaims: Record<string, ClaimRecord[]> = JSON.parse(localStorage.getItem('sr_badge_claims') ?? '{}');
    const userClaims = allClaims[email.toLowerCase()] ?? [];
    const alreadyHas = userClaims.some(c => c.code === code);

    if (alreadyHas) {
      setAlreadyClaimed(true);
      setLoading(false);
      return;
    }

    const claim: ClaimRecord = {
      code,
      title: badge!.title,
      issuer: badge!.issuer,
      event: badge!.event,
      description: badge!.description,
      imageUrl: badge!.imageUrl,
      claimedAt: new Date().toISOString(),
      claimerName: name,
      claimerEmail: email.toLowerCase(),
    };

    const updatedClaims = {
      ...allClaims,
      [email.toLowerCase()]: [...userClaims, claim],
    };
    localStorage.setItem('sr_badge_claims', JSON.stringify(updatedClaims));

    setLoading(false);
    setClaimed(true);
  }

  if (notFound) {
    return (
      <main style={{ minHeight: '100vh', background: '#eef1f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 40, textAlign: 'center', maxWidth: 400, width: '90%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#111827' }}>Badge no encontrado</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
            El código <strong>{code}</strong> no corresponde a ningún badge activo.
          </p>
        </div>
      </main>
    );
  }

  if (!badge) {
    return (
      <main style={{ minHeight: '100vh', background: '#eef1f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Cargando badge...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#eef1f6', paddingBottom: 60 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #112a68 60%, #2d4fae 100%)',
        padding: '32px 24px 40px', color: 'white', textAlign: 'center',
      }}>
        <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#b8c9ff' }}>
          SKILL ROUTE · RECLAMO DE INSIGNIA
        </p>
        <h1 style={{ margin: '0 0 10px', fontSize: 26, fontWeight: 800 }}>Reclamar Badge Digital</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#dbe6ff', maxWidth: 440, marginInline: 'auto' }}>
          Verifica tu identidad para agregar este badge a tu Skill Route Passport.
        </p>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 16px' }}>

        {/* Badge Card */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20, flexShrink: 0,
              background: badge.imageUrl ? 'transparent' : 'linear-gradient(135deg, #112a68, #2d4fae)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', border: '2px solid #dbe6ff',
            }}>
              {badge.imageUrl
                ? <img src={badge.imageUrl} alt="badge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 34 }}>🏅</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: '#111827' }}>{badge.title}</p>
              <p style={{ margin: '0 0 6px', fontSize: 13, color: '#6b7280' }}>{badge.issuer} · {badge.event}</p>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                background: '#f0f4ff', color: '#2d4fae', border: '1px solid #dbe6ff',
              }}>
                🔗 STELLAR · SBT · {badge.code}
              </span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
            <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px' }}>DESCRIPCIÓN</p>
            <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{badge.description}</p>
          </div>
        </div>

        {/* Claim Form / States */}
        {claimed ? (
          <div style={{
            background: 'white', borderRadius: 20, padding: 32, textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #16a34a',
          }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#111827' }}>¡Badge reclamado!</h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6b7280' }}>
              El badge fue agregado a tu Skill Route Passport. Inicia sesión con <strong>{email}</strong> para verlo.
            </p>
            <div style={{
              background: '#f0fdf4', borderRadius: 12, padding: '12px 16px',
              border: '1px solid #bbf7d0', marginBottom: 20,
            }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#16a34a', letterSpacing: '0.5px' }}>⛓️ REGISTRADO EN STELLAR TESTNET</p>
              <p style={{ margin: 0, fontSize: 12, fontFamily: 'monospace', color: '#374151' }}>{badge.code}</p>
            </div>
            <a
              href="/passport"
              style={{
                display: 'block', textAlign: 'center', height: 48, lineHeight: '48px',
                borderRadius: 12, background: '#112a68', color: 'white',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}
            >
              Ir a mi Passport →
            </a>
          </div>
        ) : alreadyClaimed ? (
          <div style={{
            background: 'white', borderRadius: 20, padding: 32, textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #f59e0b',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#111827' }}>Badge ya reclamado</h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6b7280' }}>
              Este badge ya está asociado a <strong>{email}</strong>. Puedes verlo en tu Passport.
            </p>
            <a
              href="/passport"
              style={{
                display: 'block', textAlign: 'center', height: 48, lineHeight: '48px',
                borderRadius: 12, background: '#112a68', color: 'white',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}
            >
              Ver mi Passport →
            </a>
          </div>
        ) : (
          <form onSubmit={handleClaim} style={{
            background: 'white', borderRadius: 20, padding: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb',
          }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: '#111827' }}>Verifica tu identidad</h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6b7280' }}>
              Ingresa el correo de tu cuenta Skill Route para recibir el badge.
            </p>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Nombre completo *
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: María García López"
                required
                style={{ width: '100%', height: 44, border: '1px solid #d1d5db', borderRadius: 10, padding: '0 12px', fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Correo electrónico *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                style={{ width: '100%', height: 44, border: '1px solid #d1d5db', borderRadius: 10, padding: '0 12px', fontSize: 14, boxSizing: 'border-box' }}
              />
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#9ca3af' }}>
                Usa el mismo correo con el que iniciaste sesión en Skill Route.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 50, borderRadius: 12, border: 'none',
                background: loading ? '#9ca3af' : '#112a68',
                color: 'white', fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⏳ Procesando...' : '🏅 Reclamar badge'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
