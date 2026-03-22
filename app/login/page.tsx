'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const accounts: { email: string; fullName: string; password: string; stellarPublicKey: string }[] =
      JSON.parse(localStorage.getItem('sr_user_accounts') ?? '[]');

    const match = accounts.find(
      a => a.email === email.toLowerCase() && a.password === password,
    );

    if (!match) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    localStorage.setItem('sr_user_session', JSON.stringify({
      email:            match.email,
      fullName:         match.fullName,
      stellarPublicKey: match.stellarPublicKey,
      role:             'usuario',
    }));

    router.push('/passport');
    setLoading(false);
  }

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
              <input id="email" type="text" placeholder="Ingresa tu correo"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" placeholder="Ingresa tu contraseña"
                value={password} onChange={e => setPassword(e.target.value)} required />
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
