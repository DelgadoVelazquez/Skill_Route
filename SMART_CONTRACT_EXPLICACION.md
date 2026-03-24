# Smart Contract en Skill Route (version tecnica)

## Version tecnica corta
En este proyecto no hay un contrato Soroban desplegado (Rust/WASM) dentro del repositorio.

El "smart contract" actual del MVP se implementa con operaciones nativas de Stellar (`manageData`) enviadas desde backend. Esas transacciones registran las clausulas del prestamo y sus cambios de estado en la blockchain (con TXID verificable en StellarExpert).

Componentes clave:

- `lib/stellar.ts`
  - `createLoanContract(...)`
  - `recordLoanPayment(...)`
  - `issueBadgeSBT(...)`
- `app/api/loan/contract/route.ts`
- `app/api/loan/payment/route.ts`

Conclusion corta:

- Contrato actual: backend + transacciones `manageData` on-chain.
- Soroban real desplegado: aun no implementado en este codigo.

## Version tecnica un poco mas larga
### 1) Como funciona hoy
El flujo actual construye y firma transacciones Stellar desde backend usando `@stellar/stellar-sdk`.

Al crear un prestamo, se escriben claves `manageData` como:

- `sr_contract_id`
- `sr_program`
- `sr_institution`
- `sr_borrower`
- `sr_total_cost`
- `sr_deposit`
- `sr_loan_amount`
- `sr_term_months`
- `sr_monthly_pay`
- `sr_late_rate`
- `sr_status`
- `sr_payments_made`
- `sr_missed_pay`

Luego, en cada evento de pago/mora, se registran actualizaciones (por ejemplo `sr_status` y `sr_last_sanction`) en nuevas transacciones.

### 2) Por que se considera "smart contract" en el MVP
Aunque no es un contrato Soroban, tiene propiedades equivalentes para demo y auditoria:

- Persistencia on-chain con hash de transaccion (TXID).
- Verificabilidad publica en explorador (StellarExpert).
- Clausulas y estados trazables en blockchain.

La diferencia principal es que la logica se ejecuta en backend y no dentro de una VM de contrato en la red.

### 3) Diferencia tecnica vs Soroban
Con Soroban, las reglas viven en el contrato mismo:

- Codigo en Rust compilado a WebAssembly.
- Ejecucion deterministica on-chain.
- Menor dependencia del backend para disparar ciertas reglas.

En este proyecto, Soroban esta documentado como fase futura del roadmap, pero no hay modulo de contrato Soroban implementado actualmente.

## Cierre tecnico
- Estado actual: "contrato" basado en transacciones `manageData` de Stellar.
- Estado futuro esperado: migracion a contrato Soroban para automatizacion on-chain completa.
