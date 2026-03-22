'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Badge {
  code: string; title: string; issuer: string; event: string;
  description: string; imageUrl: string; createdAt: string; claimUrl: string;
}
interface Claim {
  code: string; claimerName: string; claimerEmail: string; claimedAt: string;
}

export default function InstitucionDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
  const [badges, setBadges]   = useState<Badge[]>([]);
  const [claims, setClaims]   = useState<Claim[]>([]);
  const [tab, setTab]         = useState<'badges' | 'reclamados'>('badges');
  const [copied, setCopied]   = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('sr_org_session');
    if (!raw) { router.push('/institucion/login'); return; }
    const sess = JSON.parse(raw);
    if (sess.role !== 'institucion') { router.push('/institucion/login'); return; }
    setSession(sess);

    const allBadges: Badge[] = JSON.parse(localStorage.getItem('sr_badges_created') ?? '[]');
    const myBadges = allBadges.filter(b =>
      (b as Badge & { institucionEmail?: string }).institucionEmail === sess.email ||
      b.issuer === sess.name ||
      b.issuer === sess.email
    );
    setBadges(myBadges);

    const allClaims: Claim[] = Array.isArray(JSON.parse(localStorage.getItem('sr_badge_claims') ?? '[]'))
      ? JSON.parse(localStorage.getItem('sr_badge_claims') ?? '[]') : [];
    const myCodes = new Set(myBadges.map(b => b.code));
    setClaims(allClaims.filter(c => myCodes.has(c.code)));
  }, [router]);

  function copyLink(url: string, code: string) {
    navigator.clipboard.writeText(url);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  }

  function signOut() {
    localStorage.removeItem('sr_org_session');
    router.push('/');
  }

  if (!session) return null;

  return (
    <main style={{ minHeight: '100vh', background: '#06060f' }}>

      {/* Navbar */}
      <nav style={{
        background: '#0a0a1a', padding: '0 28px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🏛️</span>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>{session.name}</span>
          <span style={{ fontSize: 11, background: '#5b21b6', color: 'white', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
            INSTITUCIÓN
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/badge_crear" style={{
            background: '#5b21b6', color: 'white', padding: '7px 16px',
            borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none',
          }}>
            🏅 Crear Badge
          </Link>
          <button onClick={signOut} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.6)', padding: '7px 14px', borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#a78bfa' }}>
            PANEL DE INSTITUCIÓN
          </p>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: 'white' }}>
            Bienvenida, {session.name}
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{session.email}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { icon: '🏅', label: 'Badges creados',    value: badges.length },
            { icon: '✅', label: 'Badges reclamados', value: claims.length },
            { icon: '👥', label: 'Participantes',     value: new Set(claims.map(c => c.claimerEmail)).size },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              background: '#0e0e20', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '20px 22px',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 900, color: 'white' }}>
                {icon} {value}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
          {(['badges', 'reclamados'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13,
              background: tab === t ? '#5b21b6' : 'transparent',
              color: tab === t ? 'white' : 'rgba(255,255,255,0.4)',
            }}>
              {t === 'badges' ? `🏅 Mis badges (${badges.length})` : `✅ Reclamados (${claims.length})`}
            </button>
          ))}
        </div>

        {/* Tab: Badges */}
        {tab === 'badges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {badges.length === 0 ? (
              <div style={{
                background: '#0e0e20', border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: 16, padding: 40, textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏅</div>
                <p style={{ margin: '0 0 6px', fontWeight: 700, color: 'white' }}>Sin badges todavía</p>
                <p style={{ margin: '0 0 20px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                  Crea tu primer badge y comparte el link de reclamo.
                </p>
                <Link href="/badge_crear" style={{
                  display: 'inline-block', padding: '10px 24px', borderRadius: 10,
                  background: '#5b21b6', color: 'white', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                }}>
                  🏅 Crear Badge →
                </Link>
              </div>
            ) : badges.map(badge => (
              <div key={badge.code} style={{
                background: '#0e0e20', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, flexShrink: 0, overflow: 'hidden',
                  background: badge.imageUrl ? 'transparent' : 'linear-gradient(135deg, #5b21b6, #2d4fae)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>
                  {badge.imageUrl ? <img src={badge.imageUrl} alt={badge.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏅'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 3px', fontWeight: 700, color: 'white', fontSize: 15 }}>{badge.title}</p>
                  <p style={{ margin: '0 0 6px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{badge.event}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(91,33,182,0.3)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
                      {badge.code}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, background: 'rgba(22,163,74,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                      ✅ {claims.filter(c => c.code === badge.code).length} reclamado{claims.filter(c => c.code === badge.code).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => copyLink(badge.claimUrl, badge.code)} style={{
                    padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: copied === badge.code ? '#16a34a' : '#5b21b6',
                    color: 'white', fontWeight: 700, fontSize: 12,
                  }}>
                    {copied === badge.code ? '✓ Copiado' : '🔗 Copiar link'}
                  </button>
                  <a href={badge.claimUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: 'block', textAlign: 'center', padding: '7px 14px', borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600, fontSize: 12, textDecoration: 'none',
                  }}>
                    👁️ Ver
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Reclamados */}
        {tab === 'reclamados' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {claims.length === 0 ? (
              <div style={{ background: '#0e0e20', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)' }}>Aún no hay reclamaciones.</p>
              </div>
            ) : claims.map((c, i) => (
              <div key={i} style={{
                background: '#0e0e20', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '14px 18px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, color: 'white', fontSize: 14 }}>{c.claimerName}</p>
                  <p style={{ margin: '0 0 4px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{c.claimerEmail}</p>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(91,33,182,0.3)', color: '#a78bfa' }}>{c.code}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  {new Date(c.claimedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
