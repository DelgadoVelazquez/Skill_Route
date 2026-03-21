'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <nav style={{
      background: '#0a0a1a',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>⛓️</span>
        <span style={{ color: 'white', fontWeight: 800, fontSize: 16, letterSpacing: 0.5 }}>Skill Route</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link href="/programas" style={navLink}>Programas</Link>
        <Link href="/route" style={navLink}>Route</Link>
        <Link href="/passport" style={navLink}>Mi Passport</Link>
        <Link href="/contrato" style={navLink}>Smart Contract</Link>
        <Link href="/badge/crear" style={{
          ...navLink,
          background: '#5b21b6',
          borderRadius: 8,
          padding: '6px 14px',
          color: 'white',
          fontWeight: 700,
        }}>
          🏅 Crear Badge
        </Link>
        <Link href="/passport/login" style={{
          ...navLink,
          background: '#2d4fae',
          borderRadius: 8,
          padding: '6px 14px',
          color: 'white',
          fontWeight: 700,
        }}>
          Conectar Wallet
        </Link>
        <button onClick={handleSignOut} style={{
          ...navLink,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8,
          padding: '6px 14px',
          color: 'rgba(255,255,255,0.75)',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: 14,
        }}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

const navLink: React.CSSProperties = {
  color: 'rgba(255,255,255,0.75)',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  padding: '6px 12px',
  borderRadius: 8,
  transition: '0.2s',
};
