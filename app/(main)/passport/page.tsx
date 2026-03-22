'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Loan {
  id: string;
  program: string;
  institution: string;
  totalCost: number;
  loanAmount: number;
  monthlyPayment: number;
  termMonths: number;
  txid: string;
  explorerUrl: string;
  status: string;
  createdAt: string;
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

export default function PassportPage() {
  const router = useRouter();
  const [user, setUser]     = useState<{ email: string; full_name: string } | null>(null);
  const [loans, setLoans]   = useState<Loan[]>([]);
  const [badges, setBadges] = useState<ClaimRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        router.push('/login');
        return;
      }

      const { user: sessionUser } = await res.json();

      setUser({ email: sessionUser.email, full_name: sessionUser.full_name });

      // Préstamos guardados en localStorage
      const saved = localStorage.getItem('sr_loans');
      if (saved) setLoans(JSON.parse(saved));

      // Badges reclamados por este usuario
      const allClaims: Record<string, ClaimRecord[]> = JSON.parse(localStorage.getItem('sr_badge_claims') ?? '{}');
      const userEmail = sessionUser.email?.toLowerCase() ?? '';
      setBadges(allClaims[userEmail] ?? []);

      setLoading(false);
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef1f6' }}>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Cargando Passport...</p>
      </main>
    );
  }

  const initial    = user?.full_name?.[0]?.toUpperCase() ?? '?';
  const handle     = '@' + (user?.email?.split('@')[0] ?? 'usuario');
  const name       = user?.full_name ?? user?.email ?? 'Usuario';
  const badgeCount = badges.length;
  const badgeLimit = 5;

  return (
    <main className="passport-page">

      {/* Header */}
      <div className="passport-card">
        <div className="passport-banner" />
        <div className="passport-profile">
          <div className="passport-avatar">{initial}</div>
          <div className="passport-info">
            <div className="passport-name-row">
              <h1 className="passport-name">{name}</h1>
              <span className="passport-badge-free">⭐ FREE BETA</span>
            </div>
            <p className="passport-handle">{handle}</p>
            <p className="passport-since">Miembro desde marzo 2026 · {user?.email}</p>
          </div>
        </div>

        <div className="passport-stats">
          <div className="passport-stat">
            <span className="passport-stat-number">{badgeCount}</span>
            <span className="passport-stat-label">BADGES GUARDADOS</span>
          </div>
          <div className="passport-stat">
            <span className="passport-stat-number">{badgeLimit}</span>
            <span className="passport-stat-label">LÍMITE PLAN FREE</span>
          </div>
          <div className="passport-stat">
            <span className="passport-stat-number">{loans.length}</span>
            <span className="passport-stat-label">PRÉSTAMOS ACTIVOS</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="passport-actions">
        <button className="passport-btn-outline">🔗 Copiar perfil</button>
        <button className="passport-btn-solid">in Compartir en LinkedIn</button>
      </div>

      {/* Préstamos activos */}
      {loans.length > 0 && (
        <div className="passport-section">
          <h2 className="passport-section-title">
            Mis préstamos educativos
            <span className="passport-count">{loans.length} activo{loans.length > 1 ? 's' : ''}</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {loans.map(loan => (
              <div key={loan.id} style={{
                background: 'white', borderRadius: 16, padding: 20,
                border: '2px solid #dbe6ff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#111827' }}>{loan.program}</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{loan.institution}</p>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999,
                    background: loan.status === 'active' ? '#f0fdf4' : '#fef2f2',
                    color: loan.status === 'active' ? '#16a34a' : '#dc2626',
                    border: `1px solid ${loan.status === 'active' ? '#bbf7d0' : '#fecaca'}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {loan.status === 'active' ? '✓ Activo' : loan.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                  {[
                    { label: 'PRÉSTAMO',  value: `$${loan.loanAmount.toLocaleString()} MXN` },
                    { label: 'CUOTA/MES', value: `$${loan.monthlyPayment.toLocaleString()} MXN` },
                    { label: 'PLAZO',     value: `${loan.termMonths} meses` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', border: '1px solid #e5e7eb' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px' }}>{label}</p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#2d4fae' }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#f0f4ff', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#2d4fae', letterSpacing: '0.5px' }}>⛓️ SMART CONTRACT · STELLAR TESTNET</p>
                  <p style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', color: '#374151', wordBreak: 'break-all' }}>{loan.txid}</p>
                </div>

                <a
                  href={loan.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block', textAlign: 'center', padding: '10px 0', borderRadius: 10,
                    background: '#112a68', color: 'white', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                  }}
                >
                  🔗 Ver contrato en StellarExpert ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="passport-section">
        <h2 className="passport-section-title">
          Mis badges verificados
          <span className="passport-count">{badgeCount} de {badgeLimit}</span>
        </h2>

        {badges.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 16, padding: 32, textAlign: 'center',
            border: '2px dashed #e5e7eb', color: '#9ca3af',
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🏅</div>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#374151' }}>Sin badges todavía</p>
            <p style={{ margin: 0, fontSize: 13 }}>Reclama badges de eventos y programas para verlos aquí.</p>
          </div>
        ) : (
          <div className="passport-badges-grid">
            {badges.map(badge => (
              <div key={badge.code} className="passport-badge-card">
                <div className="passport-badge-top">
                  <div className="passport-badge-icon" style={{
                    background: badge.imageUrl ? 'transparent' : 'linear-gradient(135deg, #112a68, #2d4fae)',
                    overflow: 'hidden',
                  }}>
                    {badge.imageUrl
                      ? <img src={badge.imageUrl} alt={badge.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '🏅'
                    }
                  </div>
                  <div>
                    <p className="passport-badge-title">{badge.title}</p>
                    <p className="passport-badge-issuer">{badge.issuer}</p>
                  </div>
                </div>
                <div className="passport-badge-bottom">
                  <span className="passport-badge-date">
                    {new Date(badge.claimedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="passport-badge-verify">
                    <span className="passport-stellar-chip">🔗 STELLAR</span>
                    {badge.explorerUrl ? (
                      <a
                        href={badge.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="passport-verify-btn"
                        style={{ textDecoration: 'none' }}
                      >
                        Verificar ↗
                      </a>
                    ) : (
                      <span className="passport-verify-btn" style={{ opacity: 0.4, cursor: 'default' }}>
                        Sin TXID
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Barra de capacidad */}
      <div className="passport-capacity">
        <div className="passport-capacity-row">
          <span className="passport-capacity-label">Capacidad del plan Free</span>
          <span className="passport-capacity-label">{badgeCount} / {badgeLimit} badges</span>
        </div>
        <div className="passport-capacity-bar">
          <div className="passport-capacity-fill" style={{ width: `${(badgeCount / badgeLimit) * 100}%` }} />
        </div>
      </div>

      <div className="passport-footer">
        <button className="passport-footer-btn">Verificando en StellarExpert...</button>
      </div>

    </main>
  );
}
