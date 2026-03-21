import Link from 'next/link';

const PROGRAMAS = [
  {
    id: '1',
    nombre: 'Maestría en Inteligencia Artificial',
    institucion: 'UNAM',
    tipo: 'Maestría',
    costo: 80000,
    duracion: '24 meses',
    requisito: 'Licenciatura',
    icon: '🤖',
    color: 'linear-gradient(135deg, #112a68, #2d4fae)',
    badge: 'Maestro en IA — UNAM',
  },
  {
    id: '2',
    nombre: 'Maestría en Educación',
    institucion: 'IPN',
    tipo: 'Maestría',
    costo: 50000,
    duracion: '24 meses',
    requisito: 'Licenciatura',
    icon: '📚',
    color: 'linear-gradient(135deg, #7b2ff7, #2d4fae)',
    badge: 'Maestro en Educación — IPN',
  },
  {
    id: '3',
    nombre: 'Diplomado en Data Science',
    institucion: 'TEC de Monterrey',
    tipo: 'Diplomado',
    costo: 25000,
    duracion: '6 meses',
    requisito: 'Preparatoria',
    icon: '📊',
    color: 'linear-gradient(135deg, #0f766e, #0d9488)',
    badge: 'Data Scientist — TEC',
  },
  {
    id: '4',
    nombre: 'Certificado en Blockchain y Web3',
    institucion: 'UDEM',
    tipo: 'Certificado',
    costo: 15000,
    duracion: '3 meses',
    requisito: 'Preparatoria',
    icon: '⛓️',
    color: 'linear-gradient(135deg, #f57c00, #ffa726)',
    badge: 'Blockchain Developer — UDEM',
  },
  {
    id: '5',
    nombre: 'Maestría en Finanzas Digitales',
    institucion: 'ITAM',
    tipo: 'Maestría',
    costo: 95000,
    duracion: '24 meses',
    requisito: 'Licenciatura',
    icon: '💹',
    color: 'linear-gradient(135deg, #1a237e, #283593)',
    badge: 'Maestro en Finanzas — ITAM',
  },
  {
    id: '6',
    nombre: 'Diplomado en Ciberseguridad',
    institucion: 'UNAM',
    tipo: 'Diplomado',
    costo: 30000,
    duracion: '8 meses',
    requisito: 'Preparatoria',
    icon: '🔐',
    color: 'linear-gradient(135deg, #b71c1c, #e53935)',
    badge: 'Cybersecurity Specialist — UNAM',
  },
];

const TIPO_COLORS: Record<string, string> = {
  'Maestría':  '#2d4fae',
  'Diplomado': '#0d9488',
  'Certificado': '#f57c00',
};

export default function ProgramasPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#eef1f6', paddingBottom: 60 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #112a68 60%, #2d4fae 100%)',
        padding: '36px 24px 40px', color: 'white', textAlign: 'center',
      }}>
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#b8c9ff' }}>
          SKILL ROUTE · FINANCIAMIENTO EDUCATIVO
        </p>
        <h1 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 700 }}>
          Catálogo de Programas
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: '#dbe6ff', maxWidth: 500, marginInline: 'auto' }}>
          Financia tu posgrado con credenciales verificables en Stellar Blockchain.
          Sin aval bancario. Sin burocracia.
        </p>
      </div>

      {/* Filtros */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 0' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          {['Todos', 'Maestría', 'Diplomado', 'Certificado'].map(f => (
            <span key={f} style={{
              padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700,
              background: f === 'Todos' ? '#112a68' : 'white',
              color: f === 'Todos' ? 'white' : '#374151',
              border: '1px solid #d1d5db', cursor: 'pointer',
            }}>
              {f}
            </span>
          ))}
        </div>

        {/* Grid de programas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {PROGRAMAS.map(p => {
            const deposito = Math.round(p.costo * 0.10);
            const prestamo = p.costo - deposito;
            const meses = parseInt(p.duracion) + 6;
            const cuota = Math.round(prestamo / meses);

            return (
              <div key={p.id} style={{
                background: 'white', borderRadius: 18, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb',
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Card header */}
                <div style={{ background: p.color, padding: '20px 20px 16px', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: 'rgba(255,255,255,0.15)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 26,
                    }}>
                      {p.icon}
                    </div>
                    <div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: 1,
                        background: 'rgba(255,255,255,0.2)', padding: '2px 8px',
                        borderRadius: 999, display: 'inline-block', marginBottom: 4,
                      }}>
                        {p.tipo.toUpperCase()}
                      </span>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{p.nombre}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{p.institucion}</p>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Costo total', value: `$${p.costo.toLocaleString()} MXN` },
                      { label: 'Duración', value: p.duracion },
                      { label: 'Depósito (10%)', value: `$${deposito.toLocaleString()} MXN` },
                      { label: 'Cuota aprox.', value: `$${cuota.toLocaleString()}/mes` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', fontWeight: 700, letterSpacing: '0.5px' }}>{label.toUpperCase()}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 700, color: '#111827' }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>Requisito mínimo:</span>
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 999,
                      background: '#f0f4ff', color: '#2d4fae', border: '1px solid #dbe6ff',
                    }}>
                      {p.requisito} verificado en Passport
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>🏅</span>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>Badge de egreso: <strong style={{ color: '#374151' }}>{p.badge}</strong></span>
                  </div>

                  <Link
                    href={`/programas/${p.id}`}
                    style={{
                      display: 'block', textAlign: 'center', marginTop: 'auto',
                      padding: '12px 0', borderRadius: 10,
                      background: '#112a68', color: 'white',
                      fontWeight: 700, fontSize: 15, textDecoration: 'none',
                      transition: '0.2s',
                    }}
                  >
                    Ver programa y solicitar →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
