import { NextRequest, NextResponse } from 'next/server';
import { Keypair } from '@stellar/stellar-sdk';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, role = 'cliente' } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'email requerido' }, { status: 400 });
    }

    const keypair = Keypair.random();
    const stellarPublicKey = keypair.publicKey();

    await pool.query(
      `INSERT INTO users (email, full_name, stellar_public_key, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name = COALESCE(VALUES(full_name), full_name),
         stellar_public_key = COALESCE(stellar_public_key, VALUES(stellar_public_key))`,
      [email.toLowerCase().trim(), fullName ?? email.split('@')[0], stellarPublicKey, role]
    );

    return NextResponse.json({ success: true, stellarPublicKey });
  } catch (err) {
    console.error('[user/create]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
