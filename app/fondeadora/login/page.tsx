'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function FondeadoraLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Correo o contraseña incorrectos.');
    } else {
      router.push('/programas');
    }
    setLoading(false);
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>

        <div style={styles.header}>
          <div style={styles.avatarRing}>
            <span style={{ fontSize: 34 }}>💼</span>
          </div>
          <h1 style={styles.title}>Fondeadoras</h1>
          <p style={styles.subtitle}>Accede para gestionar programas educativos</p>
        </div>

        <div style={styles.body}>
          <form onSubmit={handleLogin} style={styles.form}>

            <div style={styles.group}>
              <label style={styles.label}>CORREO ORGANIZACIONAL</label>
              <input
                type="email"
                placeholder="contacto@fondeadora.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>CONTRASEÑA</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? 'Ingresando...' : 'Acceder'}
            </button>

            <div style={styles.links}>
              <Link href="/fondeadora/register" style={styles.link}>
                ¿Primera vez? Registrar fondeadora →
              </Link>
              <Link href="/" style={styles.linkSecondary}>← Volver al inicio</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

const COLOR = '#0e7490';

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
    background: `linear-gradient(160deg, ${COLOR} 0%, #0a0a1a 100%)`,
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
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  group: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#22d3ee' },
  input: {
    height: 44, background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
    padding: '0 14px', fontSize: 14, color: 'white', outline: 'none',
  },
  error: { margin: 0, fontSize: 13, color: '#f87171', textAlign: 'center' },
  btn: {
    height: 48, borderRadius: 12, border: 'none',
    background: COLOR, color: 'white', fontSize: 15,
    fontWeight: 700, cursor: 'pointer',
  },
  links: { display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', marginTop: 4 },
  link: { fontSize: 13, color: '#22d3ee', textDecoration: 'none', fontWeight: 600 },
  linkSecondary: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' },
};
