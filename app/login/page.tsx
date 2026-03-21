'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Correo o contraseña incorrectos.');
    } else {
      router.push('/passport');
    }
    setLoading(false);
  }

  // Google OAuth pendiente de habilitar en Supabase

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="avatar-ring">
            <div className="avatar-core">⛓️</div>
          </div>
          <h1 className="login-title">Iniciar sesión</h1>
        </div>

        <div className="login-body">

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#dc2626', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Ingresando...' : 'Entrar'}
            </button>

            <div className="login-links">
              <a href="/register">Crear cuenta</a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
