import Link from 'next/link';
import { notFound } from 'next/navigation';

const PROGRAMAS: Record<string, {
  id: string; nombre: string; institucion: string; tipo: string;
  costo: number; duracion: string; duracionMeses: number; requisito: string;
  icon: string; color: string; badge: string;
  descripcion: string; perfil: string;
}> = {
  '1': {
    id: '1', nombre: 'Maestría en Inteligencia Artificial', institucion: 'UNAM',
    tipo: 'Maestría', costo: 80000, duracion: '24 meses', duracionMeses: 24,
    requisito: 'Licenciatura', icon: '🤖',
    color: 'linear-gradient(135deg, #112a68, #2d4fae)',
    badge: 'Maestro en IA — UNAM',
    descripcion: 'Forma especialistas en machine learning, deep learning y sistemas de IA aplicada. Incluye laboratorios con GPU, proyectos de investigación y vinculación con la industria tecnológica.',
    perfil: 'Profesional del área de tecnología, ingeniería o ciencias con experiencia en programación y deseo de especializarse en inteligencia artificial.',
  },
  '2': {
    id: '2', nombre: 'Maestría en Educación', institucion: 'IPN',
    tipo: 'Maestría', costo: 50000, duracion: '24 meses', duracionMeses: 24,
    requisito: 'Licenciatura', icon: '📚',
    color: 'linear-gradient(135deg, #7b2ff7, #2d4fae)',
    badge: 'Maestro en Educación — IPN',
    descripcion: 'Forma educadores con perfil investigador capaces de diseñar, implementar y evaluar programas educativos innovadores con enfoque en tecnología y aprendizaje activo.',
    perfil: 'Profesional del área educativa con experiencia docente o de gestión escolar que busca especializarse en investigación y diseño curricular.',
  },
  '3': {
    id: '3', nombre: 'Diplomado en Data Science', institucion: 'TEC de Monterrey',
    tipo: 'Diplomado', costo: 25000, duracion: '6 meses', duracionMeses: 6,
    requisito: 'Preparatoria', icon: '📊',
    color: 'linear-gradient(135deg, #0f766e, #0d9488)',
    badge: 'Data Scientist — TEC',
    descripcion: 'Programa intensivo en análisis de datos, visualización, estadística aplicada y machine learning con Python. Proyecto final con datos reales de la industria.',
    perfil: 'Profesional de cualquier área interesado en el análisis de datos y la toma de decisiones basada en evidencia. No se requiere experiencia previa en programación.',
  },
  '4': {
    id: '4', nombre: 'Certificado en Blockchain y Web3', institucion: 'UDEM',
    tipo: 'Certificado', costo: 15000, duracion: '3 meses', duracionMeses: 3,
    requisito: 'Preparatoria', icon: '⛓️',
    color: 'linear-gradient(135deg, #f57c00, #ffa726)',
    badge: 'Blockchain Developer — UDEM',
    descripcion: 'Fundamentos de blockchain, desarrollo de smart contracts en Solidity y Soroban (Stellar), NFTs, DeFi y casos de uso empresariales de Web3.',
    perfil: 'Profesional tecnológico o emprendedor interesado en desarrollar soluciones descentralizadas y comprender el ecosistema blockchain a nivel técnico.',
  },
  '5': {
    id: '5', nombre: 'Maestría en Finanzas Digitales', institucion: 'ITAM',
    tipo: 'Maestría', costo: 95000, duracion: '24 meses', duracionMeses: 24,
    requisito: 'Licenciatura', icon: '💹',
    color: 'linear-gradient(135deg, #1a237e, #283593)',
    badge: 'Maestro en Finanzas — ITAM',
    descripcion: 'Especialización en fintech, criptoactivos, regulación financiera digital, banca abierta y modelos de riesgo aplicados a activos digitales.',
    perfil: 'Profesional de finanzas, economía o derecho con interés en la transformación digital del sector financiero y los mercados de capitales digitales.',
  },
  '6': {
    id: '6', nombre: 'Diplomado en Ciberseguridad', institucion: 'UNAM',
    tipo: 'Diplomado', costo: 30000, duracion: '8 meses', duracionMeses: 8,
    requisito: 'Preparatoria', icon: '🔐',
    color: 'linear-gradient(135deg, #b71c1c, #e53935)',
    badge: 'Cybersecurity Specialist — UNAM',
    descripcion: 'Seguridad ofensiva y defensiva, análisis forense digital, gestión de incidentes, cumplimiento normativo (ISO 27001, NIST) y hacking ético certificado.',
    perfil: 'Profesional de tecnología o administración que busca especializarse en la protección de infraestructuras digitales y gestión de riesgos de ciberseguridad.',
  },
};

export default async function ProgramaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = PROGRAMAS[id];
  if (!p) notFound();

  const deposito = Math.round(p.costo * 0.10);
  const prestamo = p.costo - deposito;
  const termMeses = p.duracionMeses + 6;
  const cuota = Math.round(prestamo / termMeses);

  return (
    <main style={{ minHeight: '100vh', background: '#eef1f6', paddingBottom: 60 }}>

      {/* Header del programa */}
      <div style={{ background: p.color, padding: '28px 24px 32px', color: 'white' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <Link href="/programas" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 16 }}>
            ← Volver al catálogo
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'rgba(255,255,255,0.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0,
            }}>
              {p.icon}
            </div>
            <div>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1,
                background: 'rgba(255,255,255,0.2)', padding: '3px 10px',
                borderRadius: 999, display: 'inline-block', marginBottom: 6,
              }}>
                {p.tipo.toUpperCase()} · {p.institucion}
              </span>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>{p.nombre}</h1>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Descripción */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 700, color: '#111827' }}>Sobre el programa</h2>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{p.descripcion}</p>
          <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#374151' }}>Perfil del postulante</h3>
          <p style={{ margin: 0, fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{p.perfil}</p>
        </div>

        {/* Condiciones del préstamo */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700, color: '#111827' }}>
            Condiciones del Préstamo Educativo
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Costo total del programa', value: `$${p.costo.toLocaleString()} MXN`, highlight: false },
              { label: 'Depósito inicial (10%)', value: `$${deposito.toLocaleString()} MXN`, highlight: false },
              { label: 'Monto del préstamo', value: `$${prestamo.toLocaleString()} MXN`, highlight: true },
              { label: 'Plazo de pago', value: `${termMeses} meses`, highlight: false },
              { label: 'Cuota mensual estimada', value: `$${cuota.toLocaleString()} MXN/mes`, highlight: true },
              { label: 'Interés por mora', value: '10% sobre cuota vencida', highlight: false },
            ].map(({ label, value, highlight }) => (
              <div key={label} style={{
                padding: 14, borderRadius: 12,
                background: highlight ? '#f0f4ff' : '#f8fafc',
                border: highlight ? '1px solid #dbe6ff' : '1px solid #e5e7eb',
              }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: '#9ca3af', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {label.toUpperCase()}
                </p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: highlight ? '#2d4fae' : '#111827' }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Sanciones */}
          <div style={{ marginTop: 16, background: '#fffbeb', borderRadius: 12, padding: 14, border: '1px solid #fcd34d' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#92400e' }}>⚡ Sanciones automáticas (Smart Contract)</p>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li style={{ fontSize: 13, color: '#78350f' }}>1er incumplimiento: 10% de interés + cargo al depósito</li>
              <li style={{ fontSize: 13, color: '#78350f' }}>2+ incumplimientos: Ejecución fianza del aval + Boletín Moroso</li>
            </ul>
          </div>
        </div>

        {/* Badge de egreso */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 700, color: '#111827' }}>
            Badge de egreso
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f0f4ff', borderRadius: 12, padding: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: p.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0,
            }}>
              {p.icon}
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: '#111827' }}>{p.badge}</p>
              <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                Credencial SBT verificable en Stellar Blockchain · Emitida al concluir el programa
              </p>
              <span style={{
                display: 'inline-block', marginTop: 6, fontSize: 11, fontWeight: 700,
                background: 'rgba(45,79,174,0.1)', color: '#2d4fae',
                padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(45,79,174,0.2)',
              }}>
                🔗 STELLAR · SBT
              </span>
            </div>
          </div>
        </div>

        {/* Requisito del Passport */}
        <div style={{ background: '#0a0a1a', borderRadius: 16, padding: 24, color: 'white' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700 }}>Requisito: Passport Pro</h2>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#9ca3af', lineHeight: 1.6 }}>
            Para solicitar el préstamo necesitas un Passport Pro con tu título de <strong style={{ color: 'white' }}>{p.requisito}</strong> verificado con hash SHA-256 en Stellar Blockchain.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              href="/passport/login"
              style={{
                flex: 1, display: 'block', textAlign: 'center', padding: '13px 0',
                borderRadius: 10, background: 'white', color: '#112a68',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}
            >
              Acceder a mi Passport
            </Link>
            <Link
              href={`/solicitud/${p.id}`}
              style={{
                flex: 1, display: 'block', textAlign: 'center', padding: '13px 0',
                borderRadius: 10, background: '#2d4fae', color: 'white',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}
            >
              Solicitar préstamo →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
