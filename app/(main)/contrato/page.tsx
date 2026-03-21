'use client';

import { useState } from 'react';

interface ContractResult {
  txid: string;
  explorerUrl: string;
  contractSummary: {
    program: string;
    institution: string;
    totalCost: number;
    deposit: number;
    loanAmount: number;
    termMonths: number;
    monthlyPayment: number;
    lateInterestRate: number;
    status: string;
    network: string;
  };
}

interface PaymentResult {
  txid: string;
  explorerUrl: string;
  paymentsMade: number;
  missedPayments: number;
  status: string;
  sanction: { type: string; action: string; severity: string } | null;
}

const DEMO_PROGRAMS = [
  { name: 'Maestría en Inteligencia Artificial', institution: 'UNAM', cost: 80000, duration: 24 },
  { name: 'Maestría en Educación', institution: 'IPN', cost: 50000, duration: 24 },
  { name: 'Diplomado en Data Science', institution: 'TEC de Monterrey', cost: 25000, duration: 6 },
  { name: 'Certificado en Blockchain', institution: 'UDEM', cost: 15000, duration: 3 },
];

export default function ContratoPage() {
  const [selected, setSelected] = useState(0);
  const [borrower, setBorrower] = useState('GAZMSTBJCRNWVLRP3KZS6EIC3ZTS3O3N25VTYSINNC2UB6VBRNN2PG3U');
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<ContractResult | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [payResult, setPayResult] = useState<PaymentResult | null>(null);
  const [missedSim, setMissedSim] = useState(0);

  const prog = DEMO_PROGRAMS[selected];
  const deposit = Math.round(prog.cost * 0.10);
  const loan = prog.cost - deposit;
  const term = prog.duration + 6;
  const monthly = Math.round(loan / term);

  async function handleCreateContract() {
    setLoading(true);
    setContract(null);
    setPayResult(null);
    try {
      const res = await fetch('/api/loan/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerAddress: borrower,
          programName: prog.name,
          institution: prog.institution,
          totalCost: prog.cost,
          depositAmount: deposit,
          durationMonths: prog.duration,
        }),
      });
      const data = await res.json();
      if (data.success) setContract(data);
      else alert('Error: ' + data.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSimulatePayment() {
    setPayLoading(true);
    try {
      const res = await fetch('/api/loan/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentsMade: Math.max(0, 3 - missedSim),
          missedPayments: missedSim,
        }),
      });
      const data = await res.json();
      if (data.success) setPayResult(data);
      else alert('Error: ' + data.error);
    } finally {
      setPayLoading(false);
    }
  }

  const statusColor = (s: string) =>
    s === 'active' ? '#16a34a' : s === 'defaulted' ? '#dc2626' : '#2d4fae';

  return (
    <main style={{ minHeight: '100vh', background: '#eef1f6', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0a1a 0%, #112a68 60%, #2d4fae 100%)',
          borderRadius: 20, padding: '28px 28px', color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <span style={{ fontSize: 36 }}>⛓️</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Smart Contract — Préstamo Educativo</h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#b8c9ff' }}>
                Stellar Blockchain · Testnet · Skill Route v8.0
              </p>
            </div>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 14, color: '#dbe6ff', lineHeight: 1.6 }}>
            El contrato se registra on-chain mediante operaciones <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>manageData</code> en Stellar.
            Cada cláusula es inmutable y verificable públicamente en StellarExpert.
          </p>
        </div>

        {/* Selector de programa */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#111827' }}>
            1. Selecciona el programa educativo
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {DEMO_PROGRAMS.map((p, i) => (
              <button
                key={i}
                onClick={() => { setSelected(i); setContract(null); setPayResult(null); }}
                style={{
                  padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                  border: selected === i ? '2px solid #2d4fae' : '1px solid #e5e7eb',
                  background: selected === i ? '#f0f4ff' : 'white',
                  transition: '0.2s',
                }}
              >
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#111827' }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{p.institution} · ${p.cost.toLocaleString('es-MX')} MXN · {p.duration} meses</p>
              </button>
            ))}
          </div>

          {/* Resumen de condiciones */}
          <div style={{ marginTop: 20, background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#374151' }}>
              Cláusulas del contrato
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Programa', value: prog.name },
                { label: 'Institución', value: prog.institution },
                { label: 'Costo total', value: `$${prog.cost.toLocaleString('es-MX')} MXN` },
                { label: 'Depósito (10%)', value: `$${deposit.toLocaleString('es-MX')} MXN` },
                { label: 'Monto del préstamo', value: `$${loan.toLocaleString('es-MX')} MXN` },
                { label: 'Plazo de pago', value: `${term} meses (${prog.duration}m + 6 gracia)` },
                { label: 'Cuota mensual', value: `$${monthly.toLocaleString('es-MX')} MXN/mes` },
                { label: 'Interés por mora', value: '10% sobre cuota vencida' },
                { label: '1er incumplimiento', value: 'Cargo 10% + descuento depósito' },
                { label: '2+ incumplimientos', value: 'Ejecución fianza + Boletín Moroso' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, letterSpacing: '0.5px' }}>{label.toUpperCase()}</span>
                  <span style={{ fontSize: 13, color: '#1f2937', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Wallet Stellar del postulante (borrowerAddress)
            </label>
            <input
              value={borrower}
              onChange={e => setBorrower(e.target.value)}
              style={{ width: '100%', height: 40, border: '1px solid #d1d5db', borderRadius: 10, padding: '0 12px', fontSize: 13, fontFamily: 'monospace', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleCreateContract}
            disabled={loading}
            style={{
              marginTop: 16, width: '100%', height: 48, borderRadius: 12, border: 'none',
              background: loading ? '#9ca3af' : '#112a68', color: 'white',
              fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⏳ Firmando en Stellar...' : '⛓️ Crear Smart Contract en Testnet'}
          </button>
        </div>

        {/* Resultado del contrato */}
        {contract && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '2px solid #16a34a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>✅</span>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#16a34a' }}>Contrato registrado en Stellar</h2>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>Inmutable · Verificable · Firmado digitalmente</p>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#15803d', letterSpacing: '0.5px' }}>TRANSACTION ID (TXID)</p>
              <p style={{ margin: 0, fontSize: 13, fontFamily: 'monospace', color: '#1f2937', wordBreak: 'break-all' }}>{contract.txid}</p>
            </div>

            <a
              href={contract.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center', padding: '12px 0', borderRadius: 10,
                background: '#2d4fae', color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none',
                marginBottom: 16,
              }}
            >
              🔗 Ver en StellarExpert ↗
            </a>

            {/* Simulador de pagos */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#111827' }}>
                2. Simular ejecución del contrato
              </h3>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280' }}>
                Simula el registro de pagos y activación de sanciones automáticas:
              </p>

              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {[
                  { label: '✅ Pago puntual', missed: 0 },
                  { label: '⚠️ 1 incumplimiento', missed: 1 },
                  { label: '🚨 2+ incumplimientos', missed: 2 },
                ].map(({ label, missed }) => (
                  <button
                    key={missed}
                    onClick={() => setMissedSim(missed)}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      border: missedSim === missed ? '2px solid #2d4fae' : '1px solid #e5e7eb',
                      background: missedSim === missed ? '#f0f4ff' : 'white',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSimulatePayment}
                disabled={payLoading}
                style={{
                  width: '100%', height: 44, borderRadius: 10, border: 'none',
                  background: payLoading ? '#9ca3af' : '#374151', color: 'white',
                  fontSize: 15, fontWeight: 700, cursor: payLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {payLoading ? '⏳ Registrando en Stellar...' : '⚡ Ejecutar en blockchain'}
              </button>
            </div>
          </div>
        )}

        {/* Resultado del pago */}
        {payResult && (
          <div style={{
            background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            border: `2px solid ${payResult.sanction?.severity === 'critical' ? '#dc2626' : payResult.sanction?.severity === 'warning' ? '#f59e0b' : '#16a34a'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>
                {payResult.sanction?.severity === 'critical' ? '🚨' : payResult.sanction?.severity === 'warning' ? '⚠️' : '✅'}
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: statusColor(payResult.status) }}>
                  Estado: {payResult.status === 'active' ? 'Activo' : payResult.status === 'defaulted' ? 'MOROSO' : payResult.status}
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>Registrado on-chain · Inmutable</p>
              </div>
            </div>

            {payResult.sanction && (
              <div style={{
                background: payResult.sanction.severity === 'critical' ? '#fef2f2' : '#fffbeb',
                border: `1px solid ${payResult.sanction.severity === 'critical' ? '#fecaca' : '#fcd34d'}`,
                borderRadius: 10, padding: 14, marginBottom: 14,
              }}>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: payResult.sanction.severity === 'critical' ? '#dc2626' : '#d97706' }}>
                  🤖 Sanción ejecutada automáticamente por el Smart Contract
                </p>
                <p style={{ margin: 0, fontSize: 13, color: '#374151' }}>{payResult.sanction.action}</p>
              </div>
            )}

            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px' }}>TXID DEL REGISTRO</p>
              <p style={{ margin: 0, fontSize: 12, fontFamily: 'monospace', color: '#1f2937', wordBreak: 'break-all' }}>{payResult.txid}</p>
            </div>

            <a
              href={payResult.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center', padding: '12px 0', borderRadius: 10,
                background: '#111827', color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}
            >
              🔗 Ver sanción en StellarExpert ↗
            </a>
          </div>
        )}

      </div>
    </main>
  );
}
