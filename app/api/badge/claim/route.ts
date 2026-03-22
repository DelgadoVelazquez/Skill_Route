import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { issueBadgeSBT } from '@/lib/stellar';

export async function POST(req: NextRequest) {
  try {
    const { email, badgeCode } = await req.json();

    if (!email || !badgeCode) {
      return NextResponse.json({ error: 'email y badgeCode son requeridos' }, { status: 400 });
    }

    // Obtener la wallet del usuario desde MySQL
    const [rows] = await pool.query(
      'SELECT stellar_public_key FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    ) as any[];

    const user = rows[0];

    if (!user?.stellar_public_key) {
      return NextResponse.json(
        { error: 'Usuario sin wallet Stellar. Vuelve a registrarte.' },
        { status: 404 }
      );
    }

    const result = await issueBadgeSBT({
      badgeCode: badgeCode.slice(0, 12).replace(/[^A-Z0-9]/gi, 'X'),
      recipientAddress: user.stellar_public_key,
      missedPayments: 0,
    });

    if ('blocked' in result) {
      return NextResponse.json({ blocked: true, reason: result.reason });
    }

    const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${result.txid}`;
    return NextResponse.json({ success: true, txid: result.txid, explorerUrl });
  } catch (err) {
    console.error('[badge/claim]', err);
    return NextResponse.json({ error: 'Error al emitir badge en Stellar' }, { status: 500 });
  }
}
