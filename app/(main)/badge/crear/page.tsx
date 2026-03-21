'use client';

import { useState } from 'react';

interface CreatedBadge {
  code: string;
  title: string;
  issuer: string;
  event: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  claimUrl: string;
}

export default function CrearBadgePage() {
  const [title, setTitle]       = useState('');
  const [issuer, setIssuer]     = useState('');
  const [event, setEvent]       = useState('');
  const [description, setDesc]  = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setPreview] = useState('');
  const [loading, setLoading]   = useState(false);
  const [created, setCreated]   = useState<CreatedBadge | null>(null);
  const [copied, setCopied]     = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setImageUrl(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Generar código único
    const code = 'BADGE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const claimUrl = `${window.location.origin}/claim_badge?code=${code}`;

    const badge: CreatedBadge = {
      code,
      title,
      issuer,
      event,
      description,
      imageUrl,
      createdAt: new Date().toISOString(),
      claimUrl,
    };

    // Guardar en localStorage
    const existing = JSON.parse(localStorage.getItem('sr_badges_created') ?? '[]');
    localStorage.setItem('sr_badges_created', JSON.stringify([...existing, badge]));

    setCreated(badge);
    setLoading(false);
  }

  function handleCopy() {
    if (!created) return;
    navigator.clipboard.writeText(created.claimUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setCreated(null);
    setTitle(''); setIssuer(''); setEvent(''); setDesc('');
    setImageUrl(''); setPreview('');
  }

  return (
    <main style={{ minHeight: '100vh', background: '#eef1f6', paddingBottom: 60 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #112a68 60%, #2d4fae 100%)',
        padding: '32px 24px 36px', color: 'white', textAlign: 'center',
      }}>
        <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#b8c9ff' }}>
          PILAR BADGE · EMISIÓN DE INSIGNIAS
        </p>
        <h1 style={{ margin: '0 0 10px', fontSize: 28, fontWeight: 800 }}>Crear Badge Digital</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#dbe6ff', maxWidth: 480, marginInline: 'auto' }}>
          Crea una insignia verificable en Stellar Blockchain. Genera un link de reclamo para tus participantes.
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 16px' }}>

        {!created ? (
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Preview del badge */}
            <div style={{
              background: 'white', borderRadius: 16, padding: 24,
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20, flexShrink: 0,
                background: imagePreview ? 'transparent' : 'linear-gradient(135deg, #112a68, #2d4fae)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', border: '2px dashed #dbe6ff',
              }}>
                {imagePreview
                  ? <img src={imagePreview} alt="badge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 32 }}>🏅</span>
                }
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: title ? '#111827' : '#9ca3af' }}>
                  {title || 'Nombre del badge'}
                </p>
                <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6b7280' }}>
                  {issuer || 'Institución emisora'} {event ? `· ${event}` : ''}
                </p>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                  background: '#f0f4ff', color: '#2d4fae', border: '1px solid #dbe6ff',
                }}>
                  🔗 STELLAR · SBT
                </span>
              </div>
            </div>

            {/* Formulario */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Datos del badge</h2>

              {[
                { label: 'Título del badge *', value: title, set: setTitle, placeholder: 'Ej: Pionero en Inteligencia Artificial', required: true },
                { label: 'Institución emisora *', value: issuer, set: setIssuer, placeholder: 'Ej: TechSummit México', required: true },
                { label: 'Evento o programa *', value: event, set: setEvent, placeholder: 'Ej: Summit IA México 2026', required: true },
              ].map(({ label, value, set, placeholder, required }) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{label}</label>
                  <input
                    value={value}
                    onChange={e => set(e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    style={{ width: '100%', height: 42, border: '1px solid #d1d5db', borderRadius: 10, padding: '0 12px', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Descripción *</label>
                <textarea
                  value={description}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Describe el logro o participación que representa este badge..."
                  required
                  rows={3}
                  style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Imagen opcional */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  Imagen del badge <span style={{ fontWeight: 400, color: '#9ca3af' }}>(opcional)</span>
                </label>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  border: '2px dashed #d1d5db', borderRadius: 10, padding: '14px 16px',
                  background: '#f8fafc', transition: '0.2s',
                }}>
                  <span style={{ fontSize: 24 }}>🖼️</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                      {imagePreview ? 'Imagen cargada ✓' : 'Subir imagen PNG o JPG'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9ca3af' }}>Mínimo 500×500px · Proporción 1:1</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                height: 50, borderRadius: 12, border: 'none',
                background: loading ? '#9ca3af' : '#112a68',
                color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⏳ Generando badge...' : '🏅 Crear Badge y generar link de reclamo'}
            </button>
          </form>

        ) : (
          /* Badge creado */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{
              background: 'white', borderRadius: 16, padding: 24,
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '2px solid #16a34a', textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#111827' }}>¡Badge creado!</h2>
              <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6b7280' }}>
                Comparte el link o código con tus participantes para que lo reclamen.
              </p>

              {/* Preview */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: '#f8fafc', borderRadius: 14, padding: 16, marginBottom: 20, textAlign: 'left',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16, flexShrink: 0, overflow: 'hidden',
                  background: created.imageUrl ? 'transparent' : 'linear-gradient(135deg, #112a68, #2d4fae)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {created.imageUrl
                    ? <img src={created.imageUrl} alt="badge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 28 }}>🏅</span>
                  }
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#111827' }}>{created.title}</p>
                  <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6b7280' }}>{created.issuer} · {created.event}</p>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#f0f4ff', color: '#2d4fae', border: '1px solid #dbe6ff' }}>
                    🔗 {created.code}
                  </span>
                </div>
              </div>

              {/* Link de reclamo */}
              <div style={{ background: '#f0f4ff', borderRadius: 12, padding: '12px 16px', marginBottom: 14, textAlign: 'left' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#2d4fae', letterSpacing: '0.5px' }}>LINK DE RECLAMO</p>
                <p style={{ margin: 0, fontSize: 13, fontFamily: 'monospace', color: '#111827', wordBreak: 'break-all' }}>{created.claimUrl}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={handleCopy}
                  style={{
                    height: 46, borderRadius: 10, border: 'none',
                    background: copied ? '#16a34a' : '#112a68',
                    color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {copied ? '✓ ¡Link copiado!' : '🔗 Copiar link de reclamo'}
                </button>

                <a
                  href={created.claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block', textAlign: 'center', height: 46, lineHeight: '46px',
                    borderRadius: 10, border: '1px solid #d1d5db',
                    background: 'white', color: '#374151', fontSize: 15, fontWeight: 700, textDecoration: 'none',
                  }}
                >
                  👁️ Ver página de reclamo →
                </a>

                <button
                  onClick={handleReset}
                  style={{
                    height: 46, borderRadius: 10, border: '1px solid #d1d5db',
                    background: 'white', color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Crear otro badge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
