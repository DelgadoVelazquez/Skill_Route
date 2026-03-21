import { NextRequest, NextResponse } from 'next/server';
import { createLoanContract } from '@/lib/stellar';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      borrowerAddress,
      programName,
      institution,
      totalCost,
      depositAmount,
      durationMonths,
      lateInterestRate = 0.10,
    } = body;

    // Validaciones básicas
    if (!borrowerAddress || !programName || !institution || !totalCost) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: borrowerAddress, programName, institution, totalCost' },
        { status: 400 }
      );
    }

    const deposit = depositAmount ?? Math.round(totalCost * 0.10);
    const loanAmount = totalCost - deposit;
    const termMonths = (durationMonths ?? 24) + 6; // duración + 6 meses de gracia
    const monthlyPayment = Math.round(loanAmount / termMonths);

    const txid = await createLoanContract({
      borrowerAddress,
      programName,
      institution,
      totalCost,
      depositAmount: deposit,
      termMonths,
      monthlyPayment,
      lateInterestRate,
    });

    const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${txid}`;

    return NextResponse.json({
      success: true,
      txid,
      explorerUrl,
      contractSummary: {
        program: programName,
        institution,
        totalCost,
        deposit,
        loanAmount,
        termMonths,
        monthlyPayment,
        lateInterestRate,
        status: 'active',
        network: process.env.STELLAR_NETWORK ?? 'TESTNET',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[loan/contract]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
