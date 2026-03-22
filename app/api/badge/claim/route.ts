import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { issueBadgeSBT } from '@/lib/stellar';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { email, badgeCode, title } = await req.json();

    if (!email || !badgeCode) {
      return NextResponse.json({ error: 'email y badgeCode son requeridos' }, { status: 400 });
    }

    // Obtener la wallet del usuario desde Supabase
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('stellar_public_key')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !userData?.stellar_public_key) {
      return NextResponse.json(
        { error: 'Usuario sin wallet Stellar. Vuelve a registrarte.' },
        { status: 404 },
      );
    }

    // Emitir el badge SBT en Stellar (firmado por el issuer de la plataforma)
    const result = await issueBadgeSBT({
      badgeCode: badgeCode.slice(0, 12).replace(/[^A-Z0-9]/gi, 'X'),
      recipientAddress: userData.stellar_public_key,
      missedPayments: 0,
    });

    if ('blocked' in result) {
      return NextResponse.json({ blocked: true, reason: result.reason });
    }

    const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${result.txid}`;

    return NextResponse.json({ success: true, txid: result.txid, explorerUrl });
  } catch (err) {
    console.error('Error emitiendo badge SBT:', err);
    return NextResponse.json({ error: 'Error al emitir badge en Stellar' }, { status: 500 });
  }
}
