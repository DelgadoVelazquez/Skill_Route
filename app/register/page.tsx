'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.includes('@'))          { setError('Ingresa un correo válido.'); return; }
    if (password !== confirmPassword)  { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 4)          { setError('Contraseña mínimo 4 caracteres.'); return; }

    setLoading(true);

    const accounts: { email: string; fullName: string; password: string; stellarPublicKey: string }[] =
      JSON.parse(localStorage.getItem('sr_user_accounts') ?? '[]');

    if (accounts.some(a => a.email === email.toLowerCase())) {
      setError('Este correo ya está registrado.');
      setLoading(false);
      return;
    }

    // Generar wallet Stellar simulada (formato válido de public key)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const stellarPublicKey = 'G' + Array.from({ length: 55 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    const newUser = { email: email.toLowerCase(), fullName, password, stellarPublicKey };
    accounts.push(newUser);
    localStorage.setItem('sr_user_accounts', JSON.stringify(accounts));

    localStorage.setItem('sr_user_session', JSON.stringify({
      email:            newUser.email,
      fullName:         newUser.fullName,
      stellarPublicKey: newUser.stellarPublicKey,
      role:             'usuario',
    }));

    router.push('/passport');
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
              <input id="name" type="text" placeholder="Ingresa tu nombre completo"
                value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" type="text" placeholder="Ingresa tu correo"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" placeholder="Crea una contraseña"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input id="confirmPassword" type="password" placeholder="Confirma tu contraseña"
                value={confirmPassword} onChange={e => setConfirm(e.target.value)} required />
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
