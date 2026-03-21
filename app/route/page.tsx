import Link from 'next/link';

const FONDOS = [
  {
    categoria: 'FUNDACIONES CORPORATIVAS',
    descripcion: 'Capital privado con impacto social',
    color: '#112a68',
    fondos: [
      { nombre: 'Fundación BBVA México', monto: '$50M MXN', foco: 'Educación superior', icon: '🏦' },
      { nombre: 'Fundación Santander',   monto: '$30M MXN', foco: 'Becas posgrado',     icon: '🎓' },
      { nombre: 'Fundación Carlos Slim', monto: '$80M MXN', foco: 'STEM y tecnología',  icon: '💡' },
      { nombre: 'FUNED',                 monto: '$15M MXN', foco: 'Posgrado nacional',   icon: '📚' },
    ],
  },
  {
    categoria: 'ORGANISMOS MULTILATERALES',
    descripcion: 'Inclusión financiera a escala',
    color: '#0f766e',
    fondos: [
      { nombre: 'BID Lab',              monto: '$20M USD', foco: 'EdTech / FinTech',   icon: '🌎' },
      { nombre: 'OEA – Fondo Rowe',     monto: '$5M USD',  foco: 'Becas LATAM',        icon: '🤝' },
      { nombre: 'UNICEF Venture Fund',  monto: '$10M USD', foco: 'Innovación social',  icon: '🌱' },
      { nombre: 'AMEXCID',              monto: '$8M MXN',  foco: 'Cooperación Mx',     icon: '🇲🇽' },
    ],
  },
  {
    categoria: 'FONDOS PÚBLICOS',
    descripcion: 'Infraestructura de confianza para el Estado',
    color: '#7b2ff7',
    fondos: [
      { nombre: 'FIDERH – Banxico',     monto: '$200M MXN', foco: 'Crédito educativo', icon: '🏛️' },
      { nombre: 'SEP – PRONABES',       monto: '$100M MXN', foco: 'Educación pública', icon: '📋' },
      { nombre: 'SECIHTI',              monto: '$50M MXN',  foco: 'Ciencia y tech',    icon: '🔬' },
    ],
  },
  {
    categoria: 'ECOSISTEMA BLOCKCHAIN',
    descripcion: 'Adopción real en Stellar',
    color: '#f57c00',
    fondos: [
      { nombre: 'Stellar Dev Foundation', monto: '$2M USD', foco: 'Volumen on-chain',   icon: '⭐' },
      { nombre: 'SCF – Stellar Community', monto: '$500K USD', foco: 'Proyectos Stellar', icon: '⛓️' },
    ],
  },
];

const COMO_FUNCIONA = [
  { num: '01', icon: '🏅', titulo: 'Asiste y gana tu Badge', desc: 'Participas en un evento o programa. La institución emite un Badge SBT en Stellar.' },
  { num: '02', icon: '📁', titulo: 'Construye tu Passport', desc: 'Los badges se acumulan en tu Passport — credenciales inmutables verificables sin wallet.' },
  { num: '03', icon: '🗺️', titulo: 'Descubre tu Route', desc: 'El sistema analiza tu Passport y sugiere el siguiente programa: diplomado, maestría o doctorado.' },
  { num: '04', icon: '💰', titulo: 'Accede al financiamiento', desc: 'Un fondo aliado financia el programa. Skill Route gestiona la dispersión directa a la universidad.' },
];

export default function RoutePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#eef1f6', paddingBottom: 60 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #112a68 60%, #2d4fae 100%)',
        padding: '40px 24px 48px', color: 'white', textAlign: 'center',
      }}>
        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#b8c9ff' }}>
          PILAR ROUTE · FINANCIAMIENTO EDUCATIVO
        </p>
        <h1 style={{ margin: '0 0 14px', fontSize: 32, fontWeight: 800, lineHeight: 1.2 }}>
          La ruta hacia el siguiente<br />nivel profesional
        </h1>
        <p style={{ margin: '0 auto 28px', fontSize: 15, color: '#dbe6ff', maxWidth: 560, lineHeight: 1.6 }}>
          Skill Route conecta tu Passport verificado con fondos educativos de Fundaciones,
          Organismos Multilaterales y Fondos Públicos — sin intermediarios, sin fricciones.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/programas" style={{
            padding: '12px 28px', borderRadius: 10, background: 'white', color: '#112a68',
            fontWeight: 700, fontSize: 15, textDecoration: 'none',
          }}>
            Ver programas disponibles →
          </Link>
          <Link href="/passport/login" style={{
            padding: '12px 28px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.4)',
            color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none',
          }}>
            Conectar Passport
          </Link>
        </div>
      </div>

      {/* Cómo funciona */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 16px 0' }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#6b7280', margin: '0 0 8px' }}>CÓMO FUNCIONA</p>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, color: '#111827', margin: '0 0 32px' }}>
          Un ecosistema que se retroalimenta
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
          {COMO_FUNCIONA.map(({ num, icon, titulo, desc }) => (
            <div key={num} style={{
              background: 'white', borderRadius: 16, padding: 22,
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb',
              position: 'relative', overflow: 'hidden',
            }}>
              <span style={{ position: 'absolute', top: 12, right: 14, fontSize: 36, fontWeight: 800, color: '#f3f4f6' }}>{num}</span>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
              <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111827' }}>{titulo}</p>
              <p style={{ margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Propuesta de valor */}
        <div style={{ background: 'white', borderRadius: 20, padding: '28px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', marginBottom: 40 }}>
          <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#2d4fae' }}>TRUST PROTOCOL</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 800, color: '#111827' }}>
            Skill Route como operador fiduciario
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { icon: '🔗', titulo: 'Transparencia Stellar', desc: 'Cada dispersión de fondos queda registrada en Mainnet. Cualquier auditor puede verificarlo en tiempo real.' },
              { icon: '⚡', titulo: 'Smart Contracts (Soroban)', desc: 'Condiciones del préstamo inmutables. Sanciones por mora ejecutadas automáticamente — sin intervención humana.' },
              { icon: '🏅', titulo: 'Badge como cierre del ciclo', desc: 'Al concluir el programa, la universidad emite el Badge de egreso — la puerta al siguiente nivel de Route.' },
              { icon: '🚫', titulo: 'Cero fraude documentario', desc: 'Hash SHA-256 de cada título anclado en Stellar. Ninguna institución puede cuestionar la autenticidad.' },
            ].map(({ icon, titulo, desc }) => (
              <div key={titulo} style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#111827' }}>{titulo}</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
          {[
            { valor: '$12.5B', label: 'TAM becas LATAM (USD/año)' },
            { valor: '5–8%', label: 'Fee por beca/préstamo gestionado' },
            { valor: '$9.99', label: 'Passport Pro mensual' },
            { valor: '~$0', label: 'Costo por transacción en Stellar' },
          ].map(({ valor, label }) => (
            <div key={label} style={{
              background: 'linear-gradient(135deg, #112a68, #2d4fae)',
              borderRadius: 14, padding: '20px 16px', textAlign: 'center', color: 'white',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800 }}>{valor}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#b8c9ff', lineHeight: 1.4 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Ecosistema de fondos */}
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#6b7280', margin: '0 0 8px' }}>ECOSISTEMA DE FINANCIAMIENTO</p>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 28px' }}>
          Fondos que buscan candidatos verificados
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FONDOS.map(({ categoria, descripcion, color, fondos }) => (
            <div key={categoria} style={{
              background: 'white', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb',
            }}>
              <div style={{ background: color, padding: '14px 20px' }}>
                <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.7)' }}>{categoria}</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'white' }}>{descripcion}</p>
              </div>
              <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {fondos.map(({ nombre, monto, foco, icon }) => (
                  <div key={nombre} style={{
                    background: '#f8fafc', borderRadius: 10, padding: '12px 14px',
                    border: '1px solid #e5e7eb', display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#111827' }}>{nombre}</p>
                      <p style={{ margin: '0 0 2px', fontSize: 12, color: '#2d4fae', fontWeight: 600 }}>{monto}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>{foco}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div style={{
          marginTop: 40, background: 'linear-gradient(135deg, #0a0a1a, #112a68)',
          borderRadius: 20, padding: '32px 28px', textAlign: 'center', color: 'white',
        }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800 }}>¿Listo para financiar tu posgrado?</h3>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: '#b8c9ff' }}>
            Conecta tu Passport Pro y solicita financiamiento con credenciales verificadas en Stellar Blockchain.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/programas" style={{
              padding: '12px 28px', borderRadius: 10, background: 'white', color: '#112a68',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}>
              Ver programas →
            </Link>
            <Link href="/passport/login" style={{
              padding: '12px 28px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.3)',
              color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}>
              Conectar con Stellar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
