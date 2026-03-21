'use client';

import { ConnectButton } from 'accesly';

export default function PassportLoginPage() {
  return (
    <main className="login-page">
      <div className="login-card">

        <div className="login-header">
          <div className="avatar-ring">
            <div className="avatar-core">🎓</div>
          </div>
          <h1 className="login-title">Mi Passport</h1>
          <p className="login-subtitle">Credenciales verificables en blockchain</p>
          <p className="login-meta">Conecta tu wallet Stellar para continuar</p>
        </div>

        <div className="login-body">

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

            <div style={{
              background: '#f0f4ff',
              borderRadius: 14,
              padding: '20px 24px',
              width: '100%',
              textAlign: 'center',
              border: '1px solid #dbe6ff',
            }}>
              <p style={{ margin: '0 0 6px', fontSize: 14, color: '#384152', fontWeight: 600 }}>
                🔗 Powered by Stellar Blockchain
              </p>
              <p style={{ margin: 0, fontSize: 13, color: '#667085' }}>
                Tu identidad se verifica con tu wallet Stellar. Sin contraseñas.
              </p>
            </div>

            <ConnectButton />

            <p style={{ margin: 0, fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
              Al conectar, aceptas que Skill Route use tu wallet para verificar
              tus credenciales académicas de forma segura e inmutable.
            </p>

          </div>

          <div style={{ marginTop: 28, borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280', textAlign: 'center', fontWeight: 600 }}>
              ¿Qué puedes hacer con tu Passport?
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '🏅', text: 'Almacenar badges verificados en blockchain' },
                { icon: '📄', text: 'Subir títulos académicos con hash SHA-256' },
                { icon: '🎓', text: 'Solicitar Préstamos Educativos (Plan Pro)' },
                { icon: '🔗', text: 'Compartir tu perfil verificado con empleadores' },
              ].map(({ icon, text }) => (
                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151' }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </main>
  );
}
