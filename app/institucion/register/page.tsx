'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function InstitucionRegisterPage() {
  const router = useRouter();
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  async function handleRegister(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role: 'institucion' } },
    });

    if (authError) {
      setError(authError.message);
    } else {
      // Guardar en tabla users con rol
      await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName: name, role: 'institucion' }),
      });
      router.push('/badge/crear');
    }
    setLoading(false);
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>

        <div style={styles.header}>
          <div style={styles.avatarRing}>
            <span style={{ fontSize: 34 }}>🏛️</span>
          </div>
          <h1 style={styles.title}>Registrar institución</h1>
          <p style={styles.subtitle}>Crea tu cuenta para emitir badges verificables</p>
        </div>

        <div style={styles.body}>
          <form onSubmit={handleRegister} style={styles.form}>

            {[
              { label: 'NOMBRE DE LA INSTITUCIÓN', value: name,     set: setName,     type: 'text',     ph: 'TechSummit México' },
              { label: 'CORREO INSTITUCIONAL',      value: email,    set: setEmail,    type: 'email',    ph: 'contacto@institucion.edu' },
              { label: 'CONTRASEÑA',                value: password, set: setPassword, type: 'password', ph: '••••••••' },
              { label: 'CONFIRMAR CONTRASEÑA',      value: confirm,  set: setConfirm,  type: 'password', ph: '••••••••' },
            ].map(({ label, value, set, type, ph }) => (
              <div key={label} style={styles.group}>
                <label style={styles.label}>{label}</label>
                <input
                  type={type}
                  placeholder={ph}
                  value={value}
                  onChange={e => set(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
            ))}

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? 'Creando cuenta...' : 'Registrar institución'}
            </button>

            <div style={styles.links}>
              <Link href="/institucion/login" style={styles.link}>
                ¿Ya tienes cuenta? Iniciar sesión
              </Link>
              <Link href="/" style={styles.linkSecondary}>← Volver al inicio</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

const COLOR = '#7c3aed';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 24, background: '#06060f',
  },
  card: {
    width: '100%', maxWidth: 440, background: '#0e0e20',
    borderRadius: 20, overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  header: {
    background: `linear-gradient(160deg, ${COLOR} 0%, #1A1B5E 100%)`,
    padding: '36px 24px 32px', textAlign: 'center', color: 'white',
  },
  avatarRing: {
    width: 80, height: 80, borderRadius: '50%', margin: '0 auto 18px',
    background: 'rgba(255,255,255,0.12)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    border: '2px solid rgba(255,255,255,0.2)',
  },
  title: { margin: '0 0 6px', fontSize: 24, fontWeight: 800 },
  subtitle: { margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  body: { padding: '28px 32px 32px' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  group: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: COLOR },
  input: {
    height: 44, background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
    padding: '0 14px', fontSize: 14, color: 'white', outline: 'none',
  },
  error: { margin: 0, fontSize: 13, color: '#f87171', textAlign: 'center' },
  btn: {
    height: 48, borderRadius: 12, border: 'none',
    background: COLOR, color: 'white', fontSize: 15,
    fontWeight: 700, cursor: 'pointer', marginTop: 4,
  },
  links: { display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' },
  link: { fontSize: 13, color: COLOR, textDecoration: 'none', fontWeight: 600 },
  linkSecondary: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' },
};
