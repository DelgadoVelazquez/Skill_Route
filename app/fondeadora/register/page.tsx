'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FondeadoraRegisterPage() {
  const router = useRouter();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  function handleRegister(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!email.includes('@'))  { setError('Ingresa un correo válido.'); return; }
    if (password !== confirm)  { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 4)   { setError('Contraseña mínimo 4 caracteres.'); return; }

    setLoading(true);

    const accounts: { name: string; email: string; password: string }[] =
      JSON.parse(localStorage.getItem('sr_fondeadora_accounts') ?? '[]');

    if (accounts.some(a => a.email === email.toLowerCase())) {
      setError('Este correo ya está registrado.');
      setLoading(false);
      return;
    }

    accounts.push({ name, email: email.toLowerCase(), password });
    localStorage.setItem('sr_fondeadora_accounts', JSON.stringify(accounts));
    localStorage.setItem('sr_org_session', JSON.stringify({ email: email.toLowerCase(), name, role: 'fondeadora' }));

    router.push('/fondeadora/dashboard');
  }

  return (
    <main style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.avatarRing}><span style={{ fontSize: 34 }}>💼</span></div>
          <h1 style={s.title}>Registrar fondeadora</h1>
          <p style={s.subtitle}>Publica programas y financia talento educativo</p>
        </div>
        <div style={s.body}>
          <form onSubmit={handleRegister} style={s.form}>
            {[
              { label: 'NOMBRE DE LA ORGANIZACIÓN', value: name,     set: setName,     type: 'text',     ph: 'Fondo Educativo Nacional' },
              { label: 'CORREO ORGANIZACIONAL',      value: email,    set: setEmail,    type: 'text',     ph: 'contacto@fondeadora.org' },
              { label: 'CONTRASEÑA',                 value: password, set: setPassword, type: 'password', ph: '••••••••' },
              { label: 'CONFIRMAR CONTRASEÑA',       value: confirm,  set: setConfirm,  type: 'password', ph: '••••••••' },
            ].map(({ label, value, set, type, ph }) => (
              <div key={label} style={s.group}>
                <label style={s.label}>{label}</label>
                <input type={type} placeholder={ph} value={value}
                  onChange={e => set(e.target.value)} required style={s.input} />
              </div>
            ))}
            {error && <p style={s.error}>{error}</p>}
            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? 'Registrando...' : 'Registrar fondeadora'}
            </button>
            <div style={s.links}>
              <Link href="/fondeadora/login" style={s.link}>¿Ya tienes cuenta? Iniciar sesión</Link>
              <Link href="/" style={s.linkSecondary}>← Volver al inicio</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

const C = '#0e7490';
const s: Record<string, React.CSSProperties> = {
  page:          { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#06060f' },
  card:          { width: '100%', maxWidth: 440, background: '#0e0e20', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' },
  header:        { background: `linear-gradient(160deg, ${C} 0%, #0a0a1a 100%)`, padding: '36px 24px 32px', textAlign: 'center', color: 'white' },
  avatarRing:    { width: 80, height: 80, borderRadius: '50%', margin: '0 auto 18px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' },
  title:         { margin: '0 0 6px', fontSize: 24, fontWeight: 800 },
  subtitle:      { margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  body:          { padding: '28px 32px 32px' },
  form:          { display: 'flex', flexDirection: 'column', gap: 14 },
  group:         { display: 'flex', flexDirection: 'column', gap: 7 },
  label:         { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#22d3ee' },
  input:         { height: 44, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0 14px', fontSize: 14, color: 'white', outline: 'none' },
  error:         { margin: 0, fontSize: 13, color: '#f87171', textAlign: 'center' },
  btn:           { height: 48, borderRadius: 12, border: 'none', background: C, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  links:         { display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' },
  link:          { fontSize: 13, color: '#22d3ee', textDecoration: 'none', fontWeight: 600 },
  linkSecondary: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' },
};
