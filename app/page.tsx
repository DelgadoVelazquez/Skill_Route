'use client';

import { useState } from 'react';
import Link from 'next/link';

type Role = 'usuario' | 'institucion' | 'fondeadora';

const ROLES = [
  { key: 'usuario',     label: 'Usuarios',      icon: '🎓' },
  { key: 'institucion', label: 'Instituciones',  icon: '🏛️' },
  { key: 'fondeadora',  label: 'Fondeadoras',    icon: '💼' },
] as const;

const CONTENT: Record<Role, {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  loginHref: string;
  registerHref: string;
  loginLabel: string;
  registerLabel: string;
  color: string;
}> = {
  usuario: {
    title: 'Impulsa tu carrera',
    subtitle: 'Passport de credenciales verificables en blockchain',
    description: 'Acumula badges de eventos y programas, solicita préstamos educativos y comparte tu perfil verificado con empleadores.',
    features: [
      '🏅 Badges verificados en Stellar Blockchain',
      '📄 Passport digital de credenciales',
      '💳 Préstamos educativos con Smart Contracts',
      '🔗 Perfil compartible y verificable',
    ],
    loginHref: '/login',
    registerHref: '/register',
    loginLabel: 'Iniciar sesión',
    registerLabel: 'Crear cuenta',
    color: '#2d4fae',
  },
  institucion: {
    title: 'Emite credenciales verificables',
    subtitle: 'Crea y distribuye badges digitales para tus participantes',
    description: 'Diseña insignias para tus eventos, cursos y programas. Genera links de reclamo que tus participantes guardan en su Passport.',
    features: [
      '🏅 Creación de badges personalizados',
      '🔗 Links de reclamo únicos por badge',
      '⛓️ Verificación inmutable en Stellar',
      '📊 Registro de participantes',
    ],
    loginHref: '/institucion/login',
    registerHref: '/institucion/register',
    loginLabel: 'Acceder',
    registerLabel: 'Registrar institución',
    color: '#7c3aed',
  },
  fondeadora: {
    title: 'Financia el futuro educativo',
    subtitle: 'Publica programas y financia talento con contratos inteligentes',
    description: 'Crea programas educativos, establece condiciones de financiamiento y supervisa contratos on-chain. Impacta carreras con transparencia total.',
    features: [
      '📚 Publicación de programas educativos',
      '⛓️ Contratos de financiamiento en blockchain',
      '🔒 Garantías automáticas y sanciones',
      '📈 Seguimiento de beneficiarios',
    ],
    loginHref: '/fondeadora/login',
    registerHref: '/fondeadora/register',
    loginLabel: 'Acceder',
    registerLabel: 'Registrar fondeadora',
    color: '#0e7490',
  },
};

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState<Role>('usuario');
  const content = CONTENT[activeRole];

  return (
    <main style={{
      minHeight: '100vh',
      background: '#06060f',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Top bar */}
      <header style={{
        padding: '0 32px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: '#0a0a1a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>⛓️</span>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>Skill Route</span>
        </div>
        <Link href="/login" style={{
          fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)',
          textDecoration: 'none', padding: '6px 14px',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
        }}>
          Iniciar sesión →
        </Link>
      </header>

      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '64px 24px 48px',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #06060f 100%)',
      }}>
        <div style={{
          display: 'inline-block',
          fontSize: 11, fontWeight: 700, letterSpacing: 3,
          color: '#7c9eff', background: 'rgba(45,79,174,0.15)',
          border: '1px solid rgba(45,79,174,0.3)', borderRadius: 999,
          padding: '5px 14px', marginBottom: 24,
        }}>
          PLATAFORMA EDUCATIVA · STELLAR BLOCKCHAIN
        </div>
        <h1 style={{
          margin: '0 0 16px', fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: 900, color: 'white', lineHeight: 1.1,
          letterSpacing: -1,
        }}>
          Credenciales educativas<br />
          <span style={{
            background: 'linear-gradient(90deg, #4f8dff, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            verificadas en blockchain
          </span>
        </h1>
        <p style={{
          margin: '0 auto', maxWidth: 520, fontSize: 17,
          color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
        }}>
          Conectamos estudiantes, instituciones educativas y fondeadoras
          con tecnología Stellar para un ecosistema de talento transparente.
        </p>
      </section>

      {/* Role selector tabs */}
      <section style={{
        maxWidth: 860, margin: '0 auto', width: '100%',
        padding: '0 20px 60px',
      }}>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 2,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '14px 14px 0 0',
          padding: '6px 6px 0',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
        }}>
          {ROLES.map(role => {
            const isActive = activeRole === role.key;
            return (
              <button
                key={role.key}
                onClick={() => setActiveRole(role.key)}
                style={{
                  flex: 1, padding: '12px 10px',
                  borderRadius: '10px 10px 0 0',
                  border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  transition: '0.2s',
                  background: isActive
                    ? CONTENT[role.key].color
                    : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.45)',
                }}
              >
                <span style={{ fontSize: 18 }}>{role.icon}</span>
                {role.label}
              </button>
            );
          })}
        </div>

        {/* Content card */}
        <div style={{
          background: '#0e0e20',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '0 0 20px 20px',
          overflow: 'hidden',
        }}>

          {/* Card header */}
          <div style={{
            padding: '36px 40px 32px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: `linear-gradient(135deg, ${content.color}22 0%, transparent 60%)`,
          }}>
            <p style={{
              margin: '0 0 8px', fontSize: 12, fontWeight: 700,
              letterSpacing: 2, color: content.color,
            }}>
              {ROLES.find(r => r.key === activeRole)?.icon} {ROLES.find(r => r.key === activeRole)?.label.toUpperCase()}
            </p>
            <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: 'white' }}>
              {content.title}
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
              {content.subtitle}
            </p>
          </div>

          {/* Card body */}
          <div style={{
            padding: '32px 40px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40,
          }}>

            {/* Left: description + features */}
            <div>
              <p style={{
                margin: '0 0 24px', fontSize: 15,
                color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
              }}>
                {content.description}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {content.features.map(f => (
                  <li key={f} style={{
                    fontSize: 14, color: 'rgba(255,255,255,0.75)',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: content.color, flexShrink: 0,
                    }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: actions */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>

              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '22px 24px',
              }}>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>
                  ¿YA TIENES CUENTA?
                </p>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                  Accede a tu panel y continúa donde lo dejaste.
                </p>
                <Link href={content.loginHref} style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px 0', borderRadius: 10,
                  background: content.color,
                  color: 'white', fontWeight: 700, fontSize: 15,
                  textDecoration: 'none',
                }}>
                  {content.loginLabel}
                </Link>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.12)',
                borderRadius: 14, padding: '22px 24px',
              }}>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>
                  ¿PRIMERA VEZ?
                </p>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                  Crea tu cuenta en menos de 2 minutos.
                </p>
                <Link href={content.registerHref} style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px 0', borderRadius: 10,
                  background: 'transparent',
                  border: `1px solid ${content.color}`,
                  color: content.color, fontWeight: 700, fontSize: 15,
                  textDecoration: 'none',
                }}>
                  {content.registerLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginTop: 32,
        }}>
          {[
            { label: 'Badges emitidos', value: '0', unit: 'on-chain' },
            { label: 'Programas activos', value: '0', unit: 'financiados' },
            { label: 'Red blockchain', value: 'Stellar', unit: 'Testnet' },
          ].map(({ label, value, unit }) => (
            <div key={label} style={{
              background: '#0e0e20',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '20px 24px', textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 2px', fontSize: 26, fontWeight: 900, color: 'white' }}>{value}</p>
              <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>
                {unit.toUpperCase()}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto', padding: '20px 32px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#0a0a1a',
      }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          ⛓️ Skill Route · Powered by Stellar Blockchain
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          Testnet · 2026
        </span>
      </footer>
    </main>
  );
}
