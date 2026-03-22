import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await db
      .from('users')
      .select('email, full_name, stellar_public_key')
      .eq('email', email.toLowerCase())
      .eq('password', password)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    return NextResponse.json({
      success:           true,
      email:             data.email,
      fullName:          data.full_name,
      stellarPublicKey:  data.stellar_public_key,
    });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
