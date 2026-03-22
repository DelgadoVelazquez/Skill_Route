import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await db
      .from('fondeadoras')
      .select('name, email')
      .eq('email', email.toLowerCase())
      .eq('password', password)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    return NextResponse.json({ success: true, name: data.name, email: data.email, role: 'fondeadora' });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
