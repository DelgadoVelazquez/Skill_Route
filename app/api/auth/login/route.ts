import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    const [rows] = await pool.query(
      'SELECT email, full_name, password_hash, role FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    ) as any[];

    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos.' }, { status: 401 });
    }

    const token = await signToken({
      email:     user.email,
      full_name: user.full_name ?? user.email.split('@')[0],
      role:      user.role,
    });

    const response = NextResponse.json({ ok: true, role: user.role });
    setSessionCookie(response, token);
    return response;

  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
