import { NextRequest, NextResponse } from 'next/server';
import { Keypair } from '@stellar/stellar-sdk';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { email, fullName } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'email requerido' }, { status: 400 });
    }

    // Generar keypair Stellar para la wallet del usuario
    const keypair = Keypair.random();
    const stellarPublicKey = keypair.publicKey();

    // Guardar en la tabla users (upsert por si ya existe)
    const { error } = await supabaseAdmin
      .from('users')
      .upsert(
        { email, full_name: fullName ?? email.split('@')[0], stellar_public_key: stellarPublicKey },
        { onConflict: 'email' },
      );

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, stellarPublicKey });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
