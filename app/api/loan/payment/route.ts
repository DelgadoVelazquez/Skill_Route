import { NextRequest, NextResponse } from 'next/server';
import { recordLoanPayment } from '@/lib/stellar';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentsMade, missedPayments, newStatus } = body;

    if (paymentsMade === undefined || missedPayments === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos: paymentsMade, missedPayments' },
        { status: 400 }
      );
    }

    // Lógica de sanciones automáticas (equivalente al Smart Contract)
    let sanction = null;

    if (missedPayments === 1) {
      sanction = {
        type: 'primer_incumplimiento',
        action: 'Se aplica 10% de interés sobre cuota vencida y se descuenta del depósito inicial',
        severity: 'warning',
      };
    } else if (missedPayments >= 2) {
      sanction = {
        type: 'incumplimiento_multiple',
        action: 'Se ejecuta la fianza educativa del aval. Se genera Boletín de Estudiante Moroso visible para todas las instituciones.',
        severity: 'critical',
      };
    }

    const txid = await recordLoanPayment({ paymentsMade, missedPayments, newStatus });
    const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${txid}`;

    return NextResponse.json({
      success: true,
      txid,
      explorerUrl,
      paymentsMade,
      missedPayments,
      status: missedPayments >= 2 ? 'defaulted' : 'active',
      sanction,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[loan/payment]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
