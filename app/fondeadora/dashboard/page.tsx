'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Programa {
  id: string;
  nombre: string;
  institucion: string;
  descripcion: string;
  perfil: string;
  costo: number;
  duracion: string;
  tipo: string;
  requisito: string;
  badge: string;
  icon: string;
  fondeadoraEmail: string;
  creadoEn: string;
}

interface Solicitud {
  programaId: string;
  programaNombre: string;
  usuarioEmail: string;
  usuarioNombre: string;
  solicitadoEn: string;
}

interface BadgeClaim {
  code: string;
  title: string;
  issuer: string;
  claimerEmail: string;
  claimerName: string;
  claimedAt: string;
}

type Tab = 'programas' | 'solicitudes' | 'badges';

export default function FondeadoraDashboard() {
  const router = useRouter();
  const [session, setSession]       = useState<{ name: string; email: string } | null>(null);
  const [programas, setProgramas]   = useState<Programa[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [badgesInfo, setBadgesInfo] = useState<{ email: string; badges: BadgeClaim[] }[]>([]);
  const [tab, setTab]               = useState<Tab>('programas');

  // Crear programa
  const [showForm, setShowForm]     = useState(false);
  const [pNombre, setPNombre]       = useState('');
  const [pInstitucion, setPInstitucion] = useState('');
  const [pDesc, setPDesc]           = useState('');
  const [pPerfil, setPPerfil]       = useState('');
  const [pCosto, setPCosto]         = useState('');
  const [pDuracion, setPDuracion]   = useState('');
  const [pTipo, setPTipo]           = useState('Maestría');
  const [pRequisito, setPRequisito] = useState('Licenciatura');
  const [pBadge, setPBadge]         = useState('');
  const [pIcon, setPIcon]           = useState('🎓');

  useEffect(() => {
    const raw = localStorage.getItem('sr_org_session');
    if (!raw) { router.push('/fondeadora/login'); return; }
    const sess = JSON.parse(raw);
    if (sess.role !== 'fondeadora') { router.push('/fondeadora/login'); return; }
    setSession(sess);
    loadAll(sess.email);
  }, [router]);

  function loadAll(fondeadoraEmail: string) {
    // Programas de esta fondeadora
    const allProgramas: Programa[] = JSON.parse(localStorage.getItem('sr_programas') ?? '[]');
    const myProgramas = allProgramas.filter(p => p.fondeadoraEmail === fondeadoraEmail);
    setProgramas(myProgramas);

    // Solicitudes de usuarios a esos programas
    const allSolicitudes: Solicitud[] = JSON.parse(localStorage.getItem('sr_solicitudes') ?? '[]');
    const myIds = new Set(myProgramas.map(p => p.id));
    const mySolicitudes = allSolicitudes.filter(s => myIds.has(s.programaId));
    setSolicitudes(mySolicitudes);

    // Badges de cada usuario que solicitó
    const allClaims: BadgeClaim[] = Array.isArray(JSON.parse(localStorage.getItem('sr_badge_claims') ?? '[]'))
      ? JSON.parse(localStorage.getItem('sr_badge_claims') ?? '[]') : [];

    const emails = [...new Set(mySolicitudes.map(s => s.usuarioEmail))];
    const badgesPorUsuario = emails.map(email => ({
      email,
      badges: allClaims.filter(c => c.claimerEmail === email),
    }));
    setBadgesInfo(badgesPorUsuario);
  }

  function handleCrearPrograma(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;

    const nuevo: Programa = {
      id:              'PROG-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      nombre:          pNombre,
      institucion:     pInstitucion,
      descripcion:     pDesc,
      perfil:          pPerfil,
      costo:           Number(pCosto),
      duracion:        pDuracion,
      tipo:            pTipo,
      requisito:       pRequisito,
      badge:           pBadge,
      icon:            pIcon,
      fondeadoraEmail: session.email,
      creadoEn:        new Date().toISOString(),
    };

    const all: Programa[] = JSON.parse(localStorage.getItem('sr_programas') ?? '[]');
    all.push(nuevo);
    localStorage.setItem('sr_programas', JSON.stringify(all));

    setPNombre(''); setPInstitucion(''); setPDesc(''); setPPerfil('');
    setPCosto(''); setPDuracion(''); setPBadge(''); setPIcon('🎓');
    setShowForm(false);
    loadAll(session.email);
  }

  function signOut() {
    localStorage.removeItem('sr_org_session');
    router.push('/');
  }

  if (!session) return null;

  const TABS: { key: Tab; label: string }[] = [
    { key: 'programas',   label: `📚 Programas (${programas.length})` },
    { key: 'solicitudes', label: `👥 Solicitudes (${solicitudes.length})` },
    { key: 'badges',      label: `🏅 Badges de usuarios (${badgesInfo.reduce((a, b) => a + b.badges.length, 0)})` },
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#06060f' }}>

      {/* Navbar */}
      <nav style={{
        background: '#0a0a1a', padding: '0 28px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>💼</span>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>{session.name}</span>
          <span style={{ fontSize: 11, background: '#0e7490', color: 'white', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
            FONDEADORA
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => { setShowForm(true); setTab('programas'); }} style={{
            background: '#0e7490', color: 'white', padding: '7px 16px',
            borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
          }}>
            📚 Crear Programa
          </button>
          <button onClick={signOut} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.6)', padding: '7px 14px', borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#22d3ee' }}>PANEL DE FONDEADORA</p>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: 'white' }}>Bienvenida, {session.name}</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{session.email}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { icon: '📚', label: 'Programas activos',  value: programas.length },
            { icon: '👥', label: 'Solicitudes totales', value: solicitudes.length },
            { icon: '🏅', label: 'Badges de usuarios',  value: badgesInfo.reduce((a, b) => a + b.badges.length, 0) },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ background: '#0e0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 900, color: 'white' }}>{icon} {value}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 12,
              background: tab === t.key ? '#0e7490' : 'transparent',
              color: tab === t.key ? 'white' : 'rgba(255,255,255,0.4)',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Programas */}
        {tab === 'programas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Formulario crear */}
            {showForm && (
              <form onSubmit={handleCrearPrograma} style={{
                background: '#0e0e20', border: '1px solid #0e7490',
                borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <h3 style={{ margin: '0 0 4px', color: 'white', fontSize: 16, fontWeight: 800 }}>Nuevo programa</h3>

                {/* Tipo */}
                <div>
                  <label style={fLabel}>TIPO DE PROGRAMA</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Maestría','Diplomado','Certificado'].map(t => (
                      <button key={t} type="button" onClick={() => setPTipo(t)} style={{
                        flex: 1, height: 38, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                        background: pTipo === t ? '#0e7490' : 'rgba(255,255,255,0.05)',
                        color: pTipo === t ? 'white' : 'rgba(255,255,255,0.45)',
                      }}>{t}</button>
                    ))}
                  </div>
                </div>

                {/* Icon */}
                <div>
                  <label style={fLabel}>ÍCONO DEL PROGRAMA</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['🎓','🤖','📚','📊','⛓️','💹','🔐','💼','🏫','🔬','🎨','🌐'].map(ic => (
                      <button key={ic} type="button" onClick={() => setPIcon(ic)} style={{
                        width: 40, height: 40, borderRadius: 8, border: pIcon === ic ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.12)',
                        background: pIcon === ic ? 'rgba(14,116,144,0.3)' : 'rgba(255,255,255,0.05)',
                        fontSize: 20, cursor: 'pointer',
                      }}>{ic}</button>
                    ))}
                  </div>
                </div>

                {/* Campos texto */}
                {[
                  { label: 'NOMBRE DEL PROGRAMA', val: pNombre,     set: setPNombre,     ph: 'Maestría en Educación Digital', multiline: false },
                  { label: 'INSTITUCIÓN',          val: pInstitucion, set: setPInstitucion, ph: 'UNAM / TEC de Monterrey',       multiline: false },
                  { label: 'DURACIÓN',             val: pDuracion,   set: setPDuracion,   ph: '24 meses',                       multiline: false },
                  { label: 'BADGE DE EGRESO',      val: pBadge,      set: setPBadge,      ph: 'Maestro en IA — UNAM',           multiline: false },
                ].map(({ label, val, set, ph }) => (
                  <div key={label}>
                    <label style={fLabel}>{label}</label>
                    <input value={val} onChange={e => set(e.target.value)} placeholder={ph} required
                      style={fInput} />
                  </div>
                ))}

                {/* Costo */}
                <div>
                  <label style={fLabel}>COSTO TOTAL (MXN)</label>
                  <input type="number" value={pCosto} onChange={e => setPCosto(e.target.value)} placeholder="50000" required style={fInput} />
                </div>

                {/* Requisito */}
                <div>
                  <label style={fLabel}>REQUISITO MÍNIMO</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Preparatoria','Licenciatura','Posgrado'].map(r => (
                      <button key={r} type="button" onClick={() => setPRequisito(r)} style={{
                        flex: 1, height: 38, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12,
                        background: pRequisito === r ? '#0e7490' : 'rgba(255,255,255,0.05)',
                        color: pRequisito === r ? 'white' : 'rgba(255,255,255,0.45)',
                      }}>{r}</button>
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label style={fLabel}>DESCRIPCIÓN DEL PROGRAMA</label>
                  <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Describe el programa educativo..." required rows={3}
                    style={{ ...fInput, height: 'auto', padding: '10px 14px', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>

                {/* Perfil */}
                <div>
                  <label style={fLabel}>PERFIL DEL POSTULANTE</label>
                  <textarea value={pPerfil} onChange={e => setPPerfil(e.target.value)} placeholder="Describe el perfil ideal del postulante..." required rows={2}
                    style={{ ...fInput, height: 'auto', padding: '10px 14px', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" style={{ flex: 1, height: 44, borderRadius: 10, border: 'none', background: '#0e7490', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    Publicar programa
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ height: 44, padding: '0 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {programas.length === 0 && !showForm ? (
              <div style={{ background: '#0e0e20', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
                <p style={{ margin: '0 0 6px', fontWeight: 700, color: 'white' }}>Sin programas todavía</p>
                <p style={{ margin: '0 0 20px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Crea tu primer programa educativo.</p>
                <button onClick={() => setShowForm(true)} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#0e7490', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  📚 Crear Programa →
                </button>
              </div>
            ) : programas.map(p => (
              <div key={p.id} style={{ background: '#0e0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ margin: '0 0 3px', fontWeight: 700, color: 'white', fontSize: 15 }}>{p.nombre}</p>
                    <p style={{ margin: '0 0 6px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{p.institucion} · {p.duracion}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(14,116,144,0.3)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}>
                        {p.id}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(22,163,74,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                        👥 {solicitudes.filter(s => s.programaId === p.id).length} solicitudes
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#22d3ee' }}>
                    ${p.costo.toLocaleString()} MXN
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{p.descripcion}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Solicitudes */}
        {tab === 'solicitudes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {solicitudes.length === 0 ? (
              <div style={{ background: '#0e0e20', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)' }}>Aún no hay solicitudes a tus programas.</p>
              </div>
            ) : solicitudes.map((s, i) => (
              <div key={i} style={{ background: '#0e0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, color: 'white', fontSize: 14 }}>{s.usuarioNombre}</p>
                  <p style={{ margin: '0 0 5px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.usuarioEmail}</p>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(14,116,144,0.3)', color: '#22d3ee' }}>
                    {s.programaNombre}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  {new Date(s.solicitadoEn).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Badges de usuarios */}
        {tab === 'badges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {badgesInfo.length === 0 ? (
              <div style={{ background: '#0e0e20', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)' }}>Aún no hay usuarios con solicitudes a tus programas.</p>
              </div>
            ) : badgesInfo.map(({ email, badges }) => (
              <div key={email} style={{ background: '#0e0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 22px' }}>
                <p style={{ margin: '0 0 12px', fontWeight: 700, color: 'white', fontSize: 14 }}>
                  👤 {email}
                  <span style={{ marginLeft: 10, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(22,163,74,0.2)', color: '#4ade80' }}>
                    {badges.length} badge{badges.length !== 1 ? 's' : ''}
                  </span>
                </p>
                {badges.length === 0 ? (
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Sin badges reclamados.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {badges.map((b, i) => (
                      <div key={i} style={{ background: 'rgba(91,33,182,0.2)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 10, padding: '8px 14px' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: 'white' }}>{b.title}</p>
                        <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{b.issuer} · {b.code}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const fLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#22d3ee', display: 'block', marginBottom: 6 };
const fInput: React.CSSProperties = { width: '100%', height: 42, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0 14px', fontSize: 14, color: 'white', outline: 'none', boxSizing: 'border-box' };
