import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, role = 'cliente' } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    // Verificar que no exista
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    ) as any[];

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Este correo ya está registrado.' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (email, full_name, password_hash, role) VALUES (?, ?, ?, ?)',
      [email.toLowerCase().trim(), fullName ?? null, hash, role]
    );

    const token = await signToken({
      email:     email.toLowerCase().trim(),
      full_name: fullName ?? email.split('@')[0],
      role,
    });

    const response = NextResponse.json({ ok: true });
    setSessionCookie(response, token);
    return response;

  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
