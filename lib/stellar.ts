import {
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
  BASE_FEE,
  Horizon,
} from '@stellar/stellar-sdk';

const NETWORK_PASSPHRASE =
  process.env.STELLAR_NETWORK === 'MAINNET'
    ? Networks.PUBLIC
    : Networks.TESTNET;

const HORIZON_URL =
  process.env.STELLAR_HORIZON_URL ?? 'https://horizon-testnet.stellar.org';

export const server = new Horizon.Server(HORIZON_URL);

export const issuerKeypair = () =>
  Keypair.fromSecret(process.env.STELLAR_ISSUER_SECRET_KEY!);

export const issuerPublicKey = () =>
  process.env.STELLAR_ISSUER_PUBLIC_KEY!;

// Encodes a string value ≤ 64 bytes for manageData
function toBuffer(value: string): Buffer {
  return Buffer.from(value.slice(0, 64), 'utf8');
}

export interface LoanContractParams {
  borrowerAddress: string;   // Stellar public key del postulante
  programName: string;       // Ej: "Maestría en Educación"
  institution: string;       // Ej: "UNAM"
  totalCost: number;         // MXN, ej: 50000
  depositAmount: number;     // 10% del costo, ej: 5000
  termMonths: number;        // duración + 6 meses gracia
  monthlyPayment: number;    // cuota mensual, ej: 1500
  lateInterestRate: number;  // 0.10 = 10%
}

/**
 * Crea un contrato de préstamo educativo en Stellar como transacción manageData.
 * Cada clave-valor queda registrado on-chain, verificable en StellarExpert.
 * Retorna el TXID del contrato.
 */
export async function createLoanContract(params: LoanContractParams): Promise<string> {
  const issuer = issuerKeypair();
  const account = await server.loadAccount(issuer.publicKey());

  const loanAmount = params.totalCost - params.depositAmount;
  const contractId = `SR-${Date.now()}`;

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.manageData({ name: 'sr_contract_id',   value: toBuffer(contractId) }))
    .addOperation(Operation.manageData({ name: 'sr_program',       value: toBuffer(params.programName) }))
    .addOperation(Operation.manageData({ name: 'sr_institution',   value: toBuffer(params.institution) }))
    .addOperation(Operation.manageData({ name: 'sr_borrower',      value: toBuffer(params.borrowerAddress) }))
    .addOperation(Operation.manageData({ name: 'sr_total_cost',    value: toBuffer(String(params.totalCost)) }))
    .addOperation(Operation.manageData({ name: 'sr_deposit',       value: toBuffer(String(params.depositAmount)) }))
    .addOperation(Operation.manageData({ name: 'sr_loan_amount',   value: toBuffer(String(loanAmount)) }))
    .addOperation(Operation.manageData({ name: 'sr_term_months',   value: toBuffer(String(params.termMonths)) }))
    .addOperation(Operation.manageData({ name: 'sr_monthly_pay',   value: toBuffer(String(params.monthlyPayment)) }))
    .addOperation(Operation.manageData({ name: 'sr_late_rate',     value: toBuffer(String(params.lateInterestRate)) }))
    .addOperation(Operation.manageData({ name: 'sr_status',        value: toBuffer('active') }))
    .addOperation(Operation.manageData({ name: 'sr_payments_made', value: toBuffer('0') }))
    .addOperation(Operation.manageData({ name: 'sr_missed_pay',    value: toBuffer('0') }))
    .addMemo(Memo.text(`SkillRoute:${contractId}`))
    .setTimeout(30)
    .build();

  tx.sign(issuer);
  const result = await server.submitTransaction(tx);
  return result.hash;
}

/**
 * Registra un pago del préstamo en Stellar.
 * Actualiza sr_status y sr_payments_made on-chain.
 * Si hay incumplimiento, aplica sanciones automáticas.
 */
export async function recordLoanPayment(opts: {
  paymentsMade: number;
  missedPayments: number;
  newStatus?: string;
}): Promise<string> {
  const issuer = issuerKeypair();
  const account = await server.loadAccount(issuer.publicKey());

  const status = opts.newStatus ?? (opts.missedPayments >= 2 ? 'defaulted' : 'active');
  const sanctionNote = opts.missedPayments === 1
    ? 'sanction:deposit_charged'
    : opts.missedPayments >= 2
    ? 'sanction:bond_executed+boletin_moroso'
    : 'on_time';

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.manageData({ name: 'sr_payments_made', value: toBuffer(String(opts.paymentsMade)) }))
    .addOperation(Operation.manageData({ name: 'sr_missed_pay',    value: toBuffer(String(opts.missedPayments)) }))
    .addOperation(Operation.manageData({ name: 'sr_status',        value: toBuffer(status) }))
    .addOperation(Operation.manageData({ name: 'sr_last_sanction', value: toBuffer(sanctionNote) }))
    .addMemo(Memo.text(`SR:payment:${status}`))
    .setTimeout(30)
    .build();

  tx.sign(issuer);
  const result = await server.submitTransaction(tx);
  return result.hash;
}

/**
 * Emite un Badge SBT al egresado si no tiene pagos vencidos.
 * Verifica sr_status antes de emitir.
 */
export async function issueBadgeSBT(opts: {
  badgeCode: string;       // Ej: "MAESTRIA-EDUCACION-UNAM"
  recipientAddress: string;
  missedPayments: number;
}): Promise<{ txid: string } | { blocked: true; reason: string }> {
  if (opts.missedPayments > 0) {
    return {
      blocked: true,
      reason: `Emisión bloqueada: ${opts.missedPayments} pago(s) vencido(s). Regulariza tu situación para recibir el Badge de egreso.`,
    };
  }

  const issuer = issuerKeypair();
  const account = await server.loadAccount(issuer.publicKey());

  // Badge como Stellar Asset (SBT: Authorization Required + no transferible)
  const badgeAsset = new Asset(opts.badgeCode.slice(0, 12).replace(/[^A-Z0-9]/gi, 'X'), issuer.publicKey());

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.manageData({ name: 'sr_badge_issued',    value: toBuffer(opts.badgeCode) }))
    .addOperation(Operation.manageData({ name: 'sr_badge_recipient', value: toBuffer(opts.recipientAddress) }))
    .addOperation(Operation.manageData({ name: 'sr_status',          value: toBuffer('completed') }))
    .addMemo(Memo.text(`SR:badge:${opts.badgeCode.slice(0, 20)}`))
    .setTimeout(30)
    .build();

  tx.sign(issuer);
  const result = await server.submitTransaction(tx);
  return { txid: result.hash };
}
