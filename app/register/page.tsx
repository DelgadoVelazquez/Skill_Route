'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    // 1. Crear usuario en auth.users
    const { data, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Generar wallet Stellar y guardar en tabla users
    await fetch('/api/user/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName }),
    });

    router.push('/passport');
    setLoading(false);
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="avatar-ring">
            <div className="avatar-core">📝</div>
          </div>
          <h1 className="login-title">Crear cuenta</h1>
        </div>

        <div className="login-body">
          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Crea una contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#dc2626', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>

            <div className="login-links">
              <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
