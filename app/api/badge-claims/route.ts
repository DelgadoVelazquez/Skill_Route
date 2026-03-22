import { NextRequest, NextResponse } from 'next/server';
import { issueBadgeSBT } from '@/lib/stellar';
import { db } from '@/lib/supabaseAdmin';

// GET /api/badge-claims?email=xxx  →  badges reclamados por ese usuario
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'email requerido' }, { status: 400 });

  const { data, error } = await db
    .from('badge_claims')
    .select('*, badges(*)')
    .eq('claimer_email', email.toLowerCase())
    .order('claimed_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// POST /api/badge-claims  →  reclamar badge
export async function POST(req: NextRequest) {
  try {
    const { badgeCode, claimerName, claimerEmail } = await req.json();

    if (!badgeCode || !claimerName || !claimerEmail) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    // Verificar que el badge existe
    const { data: badge, error: badgeErr } = await db
      .from('badges')
      .select('*')
      .eq('code', badgeCode)
      .single();

    if (badgeErr || !badge) {
      return NextResponse.json({ error: 'Badge no encontrado' }, { status: 404 });
    }

    // Verificar duplicado
    const { data: existing } = await db
      .from('badge_claims')
      .select('id')
      .eq('badge_code', badgeCode)
      .eq('claimer_email', claimerEmail.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Este badge ya fue reclamado con ese correo' }, { status: 409 });
    }

    // Obtener wallet del usuario (si existe en la tabla users)
    let txid: string | null = null;
    let explorerUrl: string | null = null;

    const { data: userData } = await db
      .from('users')
      .select('stellar_public_key')
      .eq('email', claimerEmail.toLowerCase())
      .single();

    if (userData?.stellar_public_key) {
      const result = await issueBadgeSBT({
        badgeCode: badgeCode.slice(0, 12).replace(/[^A-Z0-9]/gi, 'X'),
        recipientAddress: userData.stellar_public_key,
        missedPayments: 0,
      });

      if (!('blocked' in result)) {
        txid        = result.txid;
        explorerUrl = `https://stellar.expert/explorer/testnet/tx/${result.txid}`;
      }
    }

    // Guardar claim en DB
    const { data: claim, error: claimErr } = await db
      .from('badge_claims')
      .insert({
        badge_code:    badgeCode,
        claimer_name:  claimerName,
        claimer_email: claimerEmail.toLowerCase(),
        txid,
        explorer_url:  explorerUrl,
      })
      .select()
      .single();

    if (claimErr) return NextResponse.json({ error: claimErr.message }, { status: 500 });

    return NextResponse.json({ success: true, claim, txid, explorerUrl });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
