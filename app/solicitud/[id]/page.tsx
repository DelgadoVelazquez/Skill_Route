'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const PROGRAMAS: Record<string, { nombre: string; institucion: string; costo: number; duracionMeses: number; requisito: string; icon: string }> = {
  '1': { nombre: 'Maestría en Inteligencia Artificial', institucion: 'UNAM',        costo: 80000, duracionMeses: 24, requisito: 'Licenciatura', icon: '🤖' },
  '2': { nombre: 'Maestría en Educación',               institucion: 'IPN',         costo: 50000, duracionMeses: 24, requisito: 'Licenciatura', icon: '📚' },
  '3': { nombre: 'Diplomado en Data Science',           institucion: 'TEC',         costo: 25000, duracionMeses: 6,  requisito: 'Preparatoria', icon: '📊' },
  '4': { nombre: 'Certificado en Blockchain y Web3',    institucion: 'UDEM',        costo: 15000, duracionMeses: 3,  requisito: 'Preparatoria', icon: '⛓️' },
  '5': { nombre: 'Maestría en Finanzas Digitales',      institucion: 'ITAM',        costo: 95000, duracionMeses: 24, requisito: 'Licenciatura', icon: '💹' },
  '6': { nombre: 'Diplomado en Ciberseguridad',         institucion: 'UNAM',        costo: 30000, duracionMeses: 8,  requisito: 'Preparatoria', icon: '🔐' },
};

type Step = 'prevalidacion' | 'garantia' | 'contrato' | 'confirmado';

export default function SolicitudPage() {
  const params = useParams();
  const id = params.id as string;
  const p = PROGRAMAS[id] ?? PROGRAMAS['1'];

  const deposito   = Math.round(p.costo * 0.10);
  const prestamo   = p.costo - deposito;
  const termMeses  = p.duracionMeses + 6;
  const cuota      = Math.round(prestamo / termMeses);

  const [step, setStep]           = useState<Step>('prevalidacion');
  const [validating, setValidating] = useState(false);
  const [validated, setValidated]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [txid, setTxid]             = useState('');
  const [explorerUrl, setExplorerUrl] = useState('');

  // Form state
  const [aval, setAval]   = useState({ nombre: '', rfc: '', relacion: '' });
  const [wallet, setWallet] = useState('GAZMSTBJCRNWVLRP3KZS6EIC3ZTS3O3N25VTYSINNC2UB6VBRNN2PG3U');

  async function handlePrevalidar() {
    setValidating(true);
    await new Promise(r => setTimeout(r, 2000)); // simula consulta a Passport Pro
    setValidating(false);
    setValidated(true);
  }

  async function handleCrearContrato() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/loan/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerAddress: wallet,
          programName:     p.nombre,
          institution:     p.institucion,
          totalCost:       p.costo,
          depositAmount:   deposito,
          durationMonths:  p.duracionMeses,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTxid(data.txid);
        setExplorerUrl(data.explorerUrl);
        setStep('confirmado');
      } else {
        alert('Error al crear contrato: ' + data.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const STEPS: { key: Step; label: string }[] = [
    { key: 'prevalidacion', label: 'Pre-validación' },
    { key: 'garantia',      label: 'Garantía' },
    { key: 'contrato',      label: 'Contrato' },
    { key: 'confirmado',    label: 'Confirmado' },
  ];
  const stepIndex = STEPS.findIndex(s => s.key === step);

  return (
    <main style={{ minHeight: '100vh', background: '#eef1f6', paddingBottom: 60 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #112a68 60%, #2d4fae 100%)',
        padding: '24px 24px 28px', color: 'white',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <Link href={`/programas/${id}`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 12 }}>
            ← Volver al programa
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>{p.icon}</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Solicitud de Préstamo Educativo</h1>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#b8c9ff' }}>{p.nombre} · {p.institucion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                  background: i < stepIndex ? '#16a34a' : i === stepIndex ? '#112a68' : '#e5e7eb',
                  color: i <= stepIndex ? 'white' : '#9ca3af',
                }}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: i === stepIndex ? '#112a68' : '#9ca3af', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < stepIndex ? '#16a34a' : '#e5e7eb', margin: '0 6px', marginBottom: 18 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* STEP 1: Pre-validación */}
        {step === 'prevalidacion' && (
          <>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: '#111827' }}>Pre-validación automática</h2>
              <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6b7280' }}>
                Skill Route verificará tus credenciales del Passport Pro para confirmar que cumples el requisito mínimo del programa.
              </p>

              <div style={{ background: '#f0f4ff', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #dbe6ff' }}>
                <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#2d4fae' }}>📋 Requisitos a verificar</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Passport Pro activo', icon: validated ? '✅' : '⏳' },
                    { label: `Título de ${p.requisito} verificado en Stellar`, icon: validated ? '✅' : '⏳' },
                    { label: 'Sin boletín de morosidad activo', icon: validated ? '✅' : '⏳' },
                  ].map(({ label, icon }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151' }}>
                      <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{icon}</span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {!validated ? (
                <button
                  onClick={handlePrevalidar}
                  disabled={validating}
                  style={{
                    width: '100%', height: 48, borderRadius: 12, border: 'none',
                    background: validating ? '#9ca3af' : '#112a68', color: 'white',
                    fontSize: 16, fontWeight: 700, cursor: validating ? 'not-allowed' : 'pointer',
                  }}
                >
                  {validating ? '🔍 Verificando Passport Pro en Stellar...' : '🔍 Iniciar pre-validación'}
                </button>
              ) : (
                <div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 14, marginBottom: 16, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#16a34a', fontSize: 15 }}>
                      ✅ Pre-validación aprobada
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
                      Cumples todos los requisitos para el programa
                    </p>
                  </div>
                  <button
                    onClick={() => setStep('garantia')}
                    style={{
                      width: '100%', height: 48, borderRadius: 12, border: 'none',
                      background: '#112a68', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Continuar → Garantía de pago
                  </button>
                </div>
              )}
            </div>

            {/* Resumen financiero */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Resumen del préstamo</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Costo total', value: `$${p.costo.toLocaleString()} MXN` },
                  { label: 'Depósito inicial (10%)', value: `$${deposito.toLocaleString()} MXN` },
                  { label: 'Monto del préstamo', value: `$${prestamo.toLocaleString()} MXN`, bold: true },
                  { label: 'Plazo', value: `${termMeses} meses` },
                  { label: 'Cuota mensual', value: `$${cuota.toLocaleString()} MXN/mes`, bold: true },
                ].map(({ label, value, bold }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: 14, color: '#6b7280' }}>{label}</span>
                    <span style={{ fontSize: 14, fontWeight: bold ? 700 : 600, color: bold ? '#2d4fae' : '#111827' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* STEP 2: Garantía */}
        {step === 'garantia' && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: '#111827' }}>Garantía de pago</h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6b7280' }}>
              Para formalizar el préstamo, proporciona los datos del aval y confirma el depósito inicial.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Depósito */}
              <div style={{ background: '#f0f4ff', borderRadius: 12, padding: 16, border: '1px solid #dbe6ff' }}>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#2d4fae' }}>💰 Depósito inicial requerido</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#112a68' }}>${deposito.toLocaleString()} MXN</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>Reserva de emergencia ante primer incumplimiento</p>
              </div>

              {/* Wallet */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  Tu wallet Stellar (Passport Pro)
                </label>
                <input
                  value={wallet}
                  onChange={e => setWallet(e.target.value)}
                  style={{ width: '100%', height: 42, border: '1px solid #d1d5db', borderRadius: 10, padding: '0 12px', fontSize: 12, fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>

              {/* Datos del aval */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
                <p style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#374151' }}>Datos del Aval</p>
                {[
                  { label: 'Nombre completo del aval', key: 'nombre', placeholder: 'Ej: María López Hernández' },
                  { label: 'RFC del aval', key: 'rfc', placeholder: 'Ej: LOHE850312AB1' },
                  { label: 'Relación con el postulante', key: 'relacion', placeholder: 'Ej: Madre, cónyuge, familiar...' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{label}</label>
                    <input
                      value={aval[key as keyof typeof aval]}
                      onChange={e => setAval(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{ width: '100%', height: 42, border: '1px solid #d1d5db', borderRadius: 10, padding: '0 12px', fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>

              {/* Documentos */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14, border: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#374151' }}>📎 Documentos requeridos</p>
                {['INE vigente del postulante', 'INE vigente del aval', 'Fianza educativa firmada'].map(doc => (
                  <div key={doc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ fontSize: 13, color: '#374151' }}>📄 {doc}</span>
                    <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>Subir PDF</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setStep('prevalidacion')}
                  style={{ flex: 1, height: 46, borderRadius: 10, border: '1px solid #d1d5db', background: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setStep('contrato')}
                  style={{ flex: 2, height: 46, borderRadius: 10, border: 'none', background: '#112a68', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                >
                  Continuar → Ver contrato
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Contrato */}
        {step === 'contrato' && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: '#111827' }}>Revisión del Smart Contract</h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6b7280' }}>
              Revisa todas las condiciones antes de firmar. El contrato se registrará en Stellar Blockchain y no podrá modificarse.
            </p>

            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e5e7eb', marginBottom: 16 }}>
              <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#374151' }}>⛓️ Cláusulas del contrato on-chain</p>
              {[
                { label: 'Programa', value: p.nombre },
                { label: 'Institución', value: p.institucion },
                { label: 'Postulante (wallet)', value: wallet.slice(0, 12) + '...' + wallet.slice(-6) },
                { label: 'Aval', value: aval.nombre || 'No especificado' },
                { label: 'Costo total', value: `$${p.costo.toLocaleString()} MXN` },
                { label: 'Depósito inicial', value: `$${deposito.toLocaleString()} MXN` },
                { label: 'Monto del préstamo', value: `$${prestamo.toLocaleString()} MXN` },
                { label: 'Plazo de pago', value: `${termMeses} meses` },
                { label: 'Cuota mensual', value: `$${cuota.toLocaleString()} MXN` },
                { label: 'Interés por mora', value: '10% sobre cuota vencida' },
                { label: 'Red blockchain', value: 'Stellar Testnet' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', maxWidth: '55%', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#fffbeb', borderRadius: 12, padding: 14, border: '1px solid #fcd34d', marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>
                ⚠️ Al firmar, aceptas que el contrato es inmutable en Stellar Blockchain. Las sanciones se ejecutarán automáticamente según las condiciones acordadas.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setStep('garantia')}
                style={{ flex: 1, height: 46, borderRadius: 10, border: '1px solid #d1d5db', background: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
              >
                ← Atrás
              </button>
              <button
                onClick={handleCrearContrato}
                disabled={submitting}
                style={{ flex: 2, height: 46, borderRadius: 10, border: 'none', background: submitting ? '#9ca3af' : '#112a68', color: 'white', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 15 }}
              >
                {submitting ? '⏳ Firmando en Stellar...' : '⛓️ Firmar y registrar en blockchain'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmado */}
        {step === 'confirmado' && (
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#111827' }}>¡Préstamo aprobado!</h2>
            <p style={{ margin: '0 0 20px', fontSize: 15, color: '#6b7280' }}>
              Tu contrato ha sido registrado en Stellar Blockchain. La universidad ha sido notificada para procesar tu inscripción.
            </p>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16, marginBottom: 20, textAlign: 'left' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#15803d', letterSpacing: '0.5px' }}>TXID DEL CONTRATO</p>
              <p style={{ margin: 0, fontSize: 12, fontFamily: 'monospace', color: '#1f2937', wordBreak: 'break-all' }}>{txid}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', padding: '13px 0', borderRadius: 10, background: '#2d4fae', color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}
              >
                🔗 Ver contrato en StellarExpert ↗
              </a>
              <Link
                href="/passport"
                style={{ display: 'block', padding: '13px 0', borderRadius: 10, background: '#f3f4f6', color: '#374151', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}
              >
                Ir a mi Passport
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
