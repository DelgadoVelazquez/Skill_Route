import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Correo inválido' }, { status: 400 });
    }

    const { error } = await db
      .from('instituciones')
      .insert({ name, email: email.toLowerCase(), password });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Este correo ya está registrado' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, name, email: email.toLowerCase(), role: 'institucion' });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
