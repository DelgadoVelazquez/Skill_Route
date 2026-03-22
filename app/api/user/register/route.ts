import { NextRequest, NextResponse } from 'next/server';
import { Keypair } from '@stellar/stellar-sdk';
import { db } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'email y contraseña son requeridos' }, { status: 400 });
    }
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Correo inválido' }, { status: 400 });
    }

    // Generar wallet Stellar
    const keypair          = Keypair.random();
    const stellarPublicKey = keypair.publicKey();

    const { error } = await db
      .from('users')
      .insert({
        email:              email.toLowerCase(),
        full_name:          fullName ?? email.split('@')[0],
        password,
        stellar_public_key: stellarPublicKey,
      });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Este correo ya está registrado' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      email:   email.toLowerCase(),
      fullName: fullName ?? email.split('@')[0],
      stellarPublicKey,
    });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
