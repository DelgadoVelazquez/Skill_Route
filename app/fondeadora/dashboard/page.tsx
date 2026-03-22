'use client';

import { useState } from 'react';
import Link from 'next/link';

const COLOR = '#0e7490';
const COLOR_LIGHT = '#22d3ee';

// Datos simulados del fondo
const FONDO = {
  nombre: 'Fundación BBVA México',
  programa: 'Chavos que Inspiran — Continuidad Educativa',
  montoTotal: 5_000_000,
  montoDispersado: 3_750_000,
  fee: 0.05,
  tipoFondo: 'Revolvente',
  fechaInicio: 'Enero 2026',
  red: 'Stellar Testnet',
};

const BECARIOS = [
  { id: 1, nombre: 'María García López',    programa: 'Maestría en IA — UNAM',            estado: 'Egresada',   badgeEmitido: true,  salarioAntes: 18000, salarioDespues: 32000, txid: 'a3f2e1...b4c9', meses: 24 },
  { id: 2, nombre: 'Carlos Ramírez Torres', programa: 'Diplomado en Data Science — TEC',  estado: 'Cursando',   badgeEmitido: false, salarioAntes: 12000, salarioDespues: null,  txid: 'd7e8f1...2a3b', meses: 4  },
  { id: 3, nombre: 'Ana Herrera Mendoza',   programa: 'Certificado Blockchain — UDEM',    estado: 'Egresada',   badgeEmitido: true,  salarioAntes: 15000, salarioDespues: 24000, txid: 'f9a0b2...c1d4', meses: 3  },
  { id: 4, nombre: 'Luis Moreno Castillo',  programa: 'Maestría en Educación — IPN',      estado: 'Cursando',   badgeEmitido: false, salarioAntes: 14000, salarioDespues: null,  txid: '3b4c5d...e6f7', meses: 12 },
  { id: 5, nombre: 'Sofía Vega Romero',     programa: 'Maestría en Finanzas — ITAM',      estado: 'Morosa',     badgeEmitido: false, salarioAntes: 20000, salarioDespues: null,  txid: '7e8f9a...0b1c', meses: 18 },
  { id: 6, nombre: 'Jorge Pérez Alvarado',  programa: 'Diplomado en Ciberseguridad — UNAM', estado: 'Egresado', badgeEmitido: true,  salarioAntes: 16000, salarioDespues: 28000, txid: '2c3d4e...5f6a', meses: 8  },
];

const TXIDS_DISPERSIONES = [
  { concepto: 'Dispersión — Maestría IA UNAM (García López)',   txid: 'a3f2e1c8b4d9f0a2', monto: 72000, fecha: '15 Ene 2026' },
  { concepto: 'Dispersión — Data Science TEC (Ramírez Torres)', txid: 'd7e8f12a3b4c5d6e', monto: 22500, fecha: '3 Feb 2026'  },
  { concepto: 'Dispersión — Blockchain UDEM (Herrera Mendoza)', txid: 'f9a0b2c1d4e5f6a7', monto: 13500, fecha: '10 Feb 2026' },
  { concepto: 'Dispersión — Maestría Educación IPN (Moreno)',   txid: '3b4c5d6e7f8a9b0c', monto: 45000, fecha: '1 Mar 2026'  },
];

function StatCard({ icon, label, value, sub, color = COLOR, bg = '#0a1a1f' }: {
  icon: string; label: string; value: string; sub?: string; color?: string; bg?: string;
}) {
  return (
    <div style={{
      background: bg, borderRadius: 16, padding: '20px 22px',
      border: `1px solid ${color}33`, flex: 1, minWidth: 160,
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <p style={{ margin: '0 0 2px', fontSize: 26, fontWeight: 900, color: 'white' }}>{value}</p>
      <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color, letterSpacing: 0.5 }}>{label}</p>
      {sub && <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{sub}</p>}
    </div>
  );
}

export default function FondeadoraDashboard() {
  const [activeTab, setActiveTab] = useState<'impacto' | 'becarios' | 'blockchain'>('impacto');

  const egresados   = BECARIOS.filter(b => b.estado === 'Egresada' || b.estado === 'Egresado');
  const cursando    = BECARIOS.filter(b => b.estado === 'Cursando');
  const morosos     = BECARIOS.filter(b => b.estado === 'Morosa' || b.estado === 'Moroso');
  const tasaConclusion = Math.round((egresados.length / BECARIOS.length) * 100);

  const aumentoPromedio = egresados
    .filter(b => b.salarioDespues)
    .map(b => Math.round(((b.salarioDespues! - b.salarioAntes) / b.salarioAntes) * 100));
  const avgAumento = Math.round(aumentoPromedio.reduce((a, b) => a + b, 0) / aumentoPromedio.length);

  const roiSocial = egresados.reduce((acc, b) => acc + (b.salarioDespues! - b.salarioAntes) * 12, 0);
  const pctDispersado = Math.round((FONDO.montoDispersado / FONDO.montoTotal) * 100);

  const estadoColor = (e: string) =>
    e === 'Egresada' || e === 'Egresado' ? '#16a34a' :
    e === 'Cursando' ? '#2d4fae' :
    '#dc2626';

  const TABS = [
    { key: 'impacto',     label: '📊 Impacto Social' },
    { key: 'becarios',    label: '🎓 Becarios' },
    { key: 'blockchain',  label: '⛓️ Trust Protocol' },
  ] as const;

  return (
    <main style={{ minHeight: '100vh', background: '#06060f', color: 'white' }}>

      {/* Top nav */}
      <nav style={{
        height: 56, padding: '0 28px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', background: '#0a0a1a',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⛓️</span>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Skill Route</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 6px' }}>|</span>
          <span style={{ fontSize: 13, color: COLOR_LIGHT, fontWeight: 600 }}>Panel Fondeadora</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
            background: `${COLOR}33`, color: COLOR_LIGHT, border: `1px solid ${COLOR}55`,
            letterSpacing: 0.5,
          }}>
            🔒 TRUST PROTOCOL ACTIVO
          </span>
          <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            Cerrar sesión
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Header del fondo */}
        <div style={{
          background: `linear-gradient(135deg, ${COLOR}22 0%, #0a0a1a 60%)`,
          border: `1px solid ${COLOR}44`, borderRadius: 20,
          padding: '28px 32px', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLOR_LIGHT }}>
                DASHBOARD DE IMPACTO SOCIAL · {FONDO.red.toUpperCase()}
              </p>
              <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900 }}>{FONDO.nombre}</h1>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                {FONDO.programa}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: `${COLOR}33`, color: COLOR_LIGHT, border: `1px solid ${COLOR}55` }}>
                  💰 Fondo {FONDO.tipoFondo}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(45,79,174,0.2)', color: '#7c9eff', border: '1px solid rgba(45,79,174,0.4)' }}>
                  ⛓️ Stellar Verificable
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(22,163,74,0.15)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.3)' }}>
                  ✓ ESR / CEMEFI Ready
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: 1 }}>
                FONDOS DISPERSADOS
              </p>
              <p style={{ margin: '0 0 2px', fontSize: 32, fontWeight: 900, color: 'white' }}>
                ${FONDO.montoDispersado.toLocaleString('es-MX')}
              </p>
              <p style={{ margin: '0 0 8px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                de ${FONDO.montoTotal.toLocaleString('es-MX')} MXN ({pctDispersado}%)
              </p>
              {/* Progress bar */}
              <div style={{ width: 200, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, marginLeft: 'auto' }}>
                <div style={{ width: `${pctDispersado}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${COLOR}, ${COLOR_LIGHT})` }} />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
          <StatCard icon="🎓" label="BECARIOS TOTALES"   value={String(BECARIOS.length)} sub={`${cursando.length} cursando · ${egresados.length} egresados`} />
          <StatCard icon="✅" label="TASA DE CONCLUSIÓN" value={`${tasaConclusion}%`}     sub="Meta Año 1: >60%" color="#16a34a" />
          <StatCard icon="📈" label="AUMENTO SALARIAL"   value={`+${avgAumento}%`}        sub="Promedio egresados" color="#f59e0b" />
          <StatCard icon="💹" label="ROI SOCIAL"          value={`$${(roiSocial / 1000).toFixed(0)}K`} sub="Aumento salarial anual acumulado" color="#a78bfa" />
          <StatCard icon="🏅" label="BADGES EN STELLAR"  value={String(egresados.filter(b => b.badgeEmitido).length)} sub="Credenciales on-chain" color={COLOR_LIGHT} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px', background: 'transparent', border: 'none',
                borderBottom: activeTab === tab.key ? `2px solid ${COLOR_LIGHT}` : '2px solid transparent',
                color: activeTab === tab.key ? COLOR_LIGHT : 'rgba(255,255,255,0.45)',
                fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: '0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Impacto Social */}
        {activeTab === 'impacto' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Métricas de impacto */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Antes / Después */}
              <div style={{ background: '#0e0e20', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>📊 Transformación Salarial — Egresados</p>
                {egresados.filter(b => b.salarioDespues).map(b => {
                  const pct = Math.round(((b.salarioDespues! - b.salarioAntes) / b.salarioAntes) * 100);
                  return (
                    <div key={b.id} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{b.nombre.split(' ')[0]} {b.nombre.split(' ')[1]}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>+{pct}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ flex: b.salarioAntes / 1000, height: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 999 }} />
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>${b.salarioAntes.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <div style={{ flex: b.salarioDespues! / 1000, height: 10, background: `linear-gradient(90deg, ${COLOR}, ${COLOR_LIGHT})`, borderRadius: 999 }} />
                        <span style={{ fontSize: 11, color: COLOR_LIGHT, whiteSpace: 'nowrap' }}>${b.salarioDespues!.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Distribución por estado */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#0e0e20', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.07)', flex: 1 }}>
                  <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>🎯 Estado del Fondo</p>
                  {[
                    { label: 'Egresados con Badge', count: egresados.length, color: '#4ade80', pct: Math.round(egresados.length/BECARIOS.length*100) },
                    { label: 'En curso',            count: cursando.length,  color: '#60a5fa', pct: Math.round(cursando.length/BECARIOS.length*100) },
                    { label: 'Morosos',             count: morosos.length,   color: '#f87171', pct: Math.round(morosos.length/BECARIOS.length*100) },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.count} ({item.pct}%)</span>
                      </div>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                        <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 999, transition: '0.5s' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#0e0e20', borderRadius: 16, padding: 20, border: `1px solid ${COLOR}33` }}>
                  <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: COLOR_LIGHT, letterSpacing: 0.5 }}>
                    📋 REPORTE ESR / CEMEFI
                  </p>
                  <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                    Exporta el reporte de impacto verificable en blockchain para tu renovación ESR o reporte ante organismos multilaterales.
                  </p>
                  <button style={{
                    width: '100%', height: 40, borderRadius: 10, border: `1px solid ${COLOR}`,
                    background: 'transparent', color: COLOR_LIGHT, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}>
                    ⬇ Exportar reporte verificable
                  </button>
                </div>
              </div>
            </div>

            {/* ROI Social */}
            <div style={{
              background: `linear-gradient(135deg, #a78bfa22 0%, #0e0e20 60%)`,
              borderRadius: 16, padding: 28, border: '1px solid rgba(167,139,250,0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: '#a78bfa' }}>ROI SOCIAL TOTAL VERIFICADO</p>
                  <p style={{ margin: '0 0 4px', fontSize: 36, fontWeight: 900 }}>
                    ${roiSocial.toLocaleString('es-MX')} MXN/año
                  </p>
                  <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                    Aumento salarial acumulado anual de los {egresados.length} egresados. Cada peso del fondo generó ${(roiSocial / FONDO.montoDispersado).toFixed(2)} de valor económico anual.
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 48, fontWeight: 900, color: '#a78bfa' }}>
                    {(roiSocial / FONDO.montoDispersado).toFixed(1)}x
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                    RETORNO SOBRE INVERSIÓN
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Becarios */}
        {activeTab === 'becarios' && (
          <div style={{ background: '#0e0e20', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Lista de Becarios — {BECARIOS.length} registros</p>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Actualizado en tiempo real</span>
            </div>
            {BECARIOS.map((b, i) => (
              <div key={b.id} style={{
                padding: '16px 24px',
                borderBottom: i < BECARIOS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: `${estadoColor(b.estado)}22`, border: `1px solid ${estadoColor(b.estado)}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {b.estado === 'Egresada' || b.estado === 'Egresado' ? '🎓' : b.estado === 'Cursando' ? '📚' : '⚠️'}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 700 }}>{b.nombre}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{b.programa} · {b.meses} meses</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                    background: `${estadoColor(b.estado)}22`, color: estadoColor(b.estado),
                    border: `1px solid ${estadoColor(b.estado)}44`,
                  }}>
                    {b.estado}
                  </span>
                  {b.badgeEmitido ? (
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: `${COLOR}22`, color: COLOR_LIGHT, border: `1px solid ${COLOR}44` }}>
                      🏅 Badge on-chain
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Badge pendiente
                    </span>
                  )}
                  {b.salarioDespues && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>
                      +{Math.round(((b.salarioDespues - b.salarioAntes) / b.salarioAntes) * 100)}% salario
                    </span>
                  )}
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                    {b.txid}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: Trust Protocol */}
        {activeTab === 'blockchain' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Trust Protocol header */}
            <div style={{
              background: 'linear-gradient(135deg, #112a6822 0%, #0e0e20 60%)',
              borderRadius: 16, padding: '24px 28px',
              border: '1px solid rgba(45,79,174,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <span style={{ fontSize: 36 }}>🔒</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Trust Protocol</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    Capa de verificación inmutable sobre Stellar Blockchain
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  { icon: '🔐', title: 'Cero Fraude', desc: 'Hash SHA-256 de títulos y documentos. Cualquier alteración es detectada automáticamente.' },
                  { icon: '⛓️', title: 'Smart Contracts', desc: 'El capital se libera únicamente cuando el becario cumple hitos verificables en blockchain.' },
                  { icon: '🎓', title: 'Passport Pro', desc: 'Cada egresado recibe un Badge SBT inmutable como activo profesional permanente.' },
                ].map(item => (
                  <div key={item.title} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 18, border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                    <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700 }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispersiones on-chain */}
            <div style={{ background: '#0e0e20', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>⛓️ Dispersiones Registradas en Stellar</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  Cada transferencia de fondos tiene un TXID inmutable y verificable públicamente
                </p>
              </div>
              {TXIDS_DISPERSIONES.map((d, i) => (
                <div key={i} style={{
                  padding: '14px 24px',
                  borderBottom: i < TXIDS_DISPERSIONES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
                }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 600 }}>{d.concepto}</p>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 11, color: COLOR_LIGHT }}>{d.txid}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700 }}>${d.monto.toLocaleString()} MXN</p>
                      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{d.fecha}</p>
                    </div>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${d.txid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 8,
                        background: `${COLOR}33`, color: COLOR_LIGHT,
                        border: `1px solid ${COLOR}55`, textDecoration: 'none', whiteSpace: 'nowrap',
                      }}
                    >
                      Ver en StellarExpert ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Badges on-chain */}
            <div style={{ background: '#0e0e20', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>🏅 Badges de Egreso Emitidos en Stellar</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {egresados.filter(b => b.badgeEmitido).map(b => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 16px',
                    border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 24 }}>🏅</span>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700 }}>{b.nombre}</p>
                        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{b.programa}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: COLOR_LIGHT }}>{b.txid}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(22,163,74,0.15)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.3)' }}>
                        ✓ SBT Verificado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
