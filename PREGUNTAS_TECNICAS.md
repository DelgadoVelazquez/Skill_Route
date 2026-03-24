# Skill Route — Preguntas para Jueces
## General, Smart Contracts, Stellar & Arquitectura
Marzo 2026

====================================================================
SECCIÓN 1 — PREGUNTAS GENERALES (cualquier juez)
====================================================================

---

¿Qué es Skill Route en una oración?

  Skill Route es el primer operador de fondos filantrópicos para educación
  en LATAM que garantiza, mediante blockchain, que cada peso invertido por
  una fundación llega a la institución correcta, es trazable en tiempo real
  y genera evidencia de impacto social irreversible.

---

¿Qué problema concreto resuelve?

  Las fundaciones que donan dinero para becas no tienen manera de saber si
  el dinero realmente llegó a la universidad, si el alumno completó el
  programa, ni qué impacto generó su inversión. Todo se maneja con PDFs,
  correos y reportes anuales fáciles de falsificar.

  Skill Route reemplaza eso con:
    - Contratos registrados en blockchain (verificables por cualquier auditor)
    - Badges de egreso emitidos on-chain al completar el programa
    - Dashboard de impacto en tiempo real para la fundación

---

¿Para quién es el producto?

  Hay tres actores:

  FONDEADORA → La fundación (BBVA, Carlos Slim, BID Lab, SDF) que pone el dinero.
               Es nuestro cliente principal — nos paga la comisión de gestión.

  CAPACITADOR → La universidad o centro que imparte el programa.
                Recibe el pago directamente via smart contract.
                Emite el badge de egreso al alumno al terminar.

  BENEFICIARIO → El estudiante o profesionista que recibe el apoyo.
                 Tiene su Passport Pro donde guarda sus credenciales y badges.

---

¿Cómo hace dinero Skill Route?

  Tres fuentes:
    1. Fee de administración: 3% a 7% del monto que administramos
    2. Success Fee: bono por cada alumno que concluye el programa
    3. Interés por mora: 10% sobre pagos vencidos en fondos revolventes
       (esto lo ejecuta automáticamente el smart contract)

---

¿Qué es el Passport Pro?

  Es el repositorio personal de credenciales académicas del beneficiario.
  Funciona como un LinkedIn pero verificado en blockchain.

  Contiene:
    - Títulos académicos (PDF con hash SHA-256 registrado on-chain)
    - Badges de programas completados (tokens no transferibles en Stellar)
    - Préstamos activos con TXID verificable en StellarExpert
    - Historial de pagos

  Las fundaciones pueden consultar el Passport de un candidato antes de
  otorgar el apoyo y ver evidencia inmutable de sus credenciales.

---

¿Qué es un Badge?

  Es una credencial digital verificable emitida al completar un programa.
  A diferencia de un certificado en PDF que se puede falsificar, el badge
  de Skill Route vive en Stellar Blockchain — es inmutable, tiene timestamp
  de emisión y solo puede ser emitido por la institución autorizada.

  Es un SBT (Soulbound Token): no se puede transferir ni vender.
  Solo le pertenece al egresado que cumplió el programa Y sus obligaciones
  con el fondo (si hay mora activa, el badge se bloquea automáticamente).

---

¿Por qué una fundación confiaría en Skill Route y no seguiría haciendo
las cosas a mano?

  Porque Skill Route resuelve los tres problemas que más les duelen:

  1. TRANSPARENCIA: cada dispersión de fondos genera un TXID verificable
     públicamente. No hay forma de desviar el dinero sin dejar huella.

  2. SELECCIÓN: no evaluamos historial crediticio sino potencial futuro —
     el perfil académico verificado del candidato en su Passport Pro.

  3. IMPACTO: el dashboard muestra en tiempo real cuántos alumnos terminaron,
     cuánto aumentó su salario estimado y el ROI social de la inversión.
     Esto es exactamente lo que necesitan para renovar su Distintivo ESR
     y reportar ante el CEMEFI o el BID.

---

¿Qué tan grande es el mercado?

  TAM → $12,500 millones USD al año
        (toda la inversión en becas y apoyos educativos en LATAM)

  SAM → $450 millones USD al año
        (fondos privados y corporativos para posgrado en México)

  Meta Año 1 → $22.5 millones USD administrados
               (el 5% del SAM, aprox 100 becas en el primer semestre)

---

¿Cuál es su diferenciador frente a otras plataformas de becas?

  Las plataformas de becas existentes (Bekamax, FUNED, portales SEP)
  son directorios o formularios. No tienen:
    - Verificación automática de credenciales
    - Contratos inmutables en blockchain
    - Badges verificables como evidencia de egreso
    - Dashboard de impacto en tiempo real para el donante

  Skill Route no es una plataforma de becas. Es la INFRAESTRUCTURA DE
  CONFIANZA que cualquier fundación puede usar para administrar sus fondos
  con transparencia total.

---

¿Qué tan avanzado está el producto?

  MVP funcional con:
    - Login y Passport Pro del beneficiario
    - Catálogo de programas educativos
    - Flujo completo de solicitud de préstamo (3 pasos)
    - Smart contract registrado en Stellar Testnet con TXID verificable
    - Sistema de badges: crear → generar código → reclamar → aparecer en Passport
    - Dashboard de impacto social para la fondeadora
    - Login separado para fondeadoras con su propio panel

  Próximos pasos: migración a Mainnet + contratos Soroban + integración de
  pagos reales (Stripe/Conekta).

---

====================================================================
SECCIÓN 2 — SMART CONTRACTS (jueces técnicos o de blockchain)
====================================================================

---

¿Tienen un smart contract real o solo simulado?

  Para el MVP del hackathon usamos operaciones nativas de Stellar llamadas
  `manageData` — escriben las condiciones del préstamo directamente on-chain
  en una sola transacción. El resultado es verificable en StellarExpert igual
  que cualquier smart contract.

  El smart contract ejecutable real de Stellar se llama SOROBAN (contratos
  en Rust compilados a WebAssembly). Está en nuestra Fase 3 del roadmap
  (días 180-270), donde las sanciones y liberaciones de fondos se ejecutarán
  automáticamente sin intervención humana.

---

¿Qué datos guarda el contrato on-chain?

  Una transacción de préstamo escribe 13 cláusulas en blockchain:

    sr_contract_id   → ID único del contrato (ej: SR-1711234567890)
    sr_program       → Nombre del programa educativo
    sr_institution   → Institución capacitadora
    sr_borrower      → Wallet Stellar del beneficiario
    sr_total_cost    → Costo total del programa en MXN
    sr_deposit       → Depósito inicial (10% del costo)
    sr_loan_amount   → Monto del préstamo (costo - depósito)
    sr_term_months   → Plazo total de pago (duración + 6 meses gracia)
    sr_monthly_pay   → Cuota mensual calculada
    sr_late_rate     → Tasa de interés por mora (0.10 = 10%)
    sr_status        → Estado: active / defaulted / completed
    sr_payments_made → Número de pagos realizados
    sr_missed_pay    → Número de pagos vencidos

  Todo esto queda registrado con timestamp irrefutable. Cualquier juez puede
  ir ahora mismo a stellar.expert y verificarlo.

---

¿Qué pasa exactamente cuando alguien no paga?

  El sistema registra en blockchain las sanciones según el nivel de mora:

  1 pago vencido:
    → sr_last_sanction = "sanction:deposit_charged"
    → Se ejecuta el depósito de garantía (el 10% inicial)
    → La institución y la fondeadora son notificadas

  2 o más pagos vencidos:
    → sr_last_sanction = "sanction:bond_executed+boletin_moroso"
    → sr_status = "defaulted"
    → Se ejecuta la fianza del aval
    → El alumno entra al Boletín de Estudiante Moroso
    → El badge de egreso queda BLOQUEADO hasta regularizar

  En la versión Soroban, esto ocurre automáticamente en la fecha de vencimiento
  sin que nadie tenga que presionar ningún botón.

---

¿Cómo se bloquea el badge si hay mora?

  La función `issueBadgeSBT()` verifica `missedPayments` antes de emitir.
  Si hay aunque sea 1 pago vencido, la función retorna un objeto bloqueado:

    { blocked: true, reason: "Emisión bloqueada: X pago(s) vencido(s)..." }

  El badge no se emite hasta que el alumno regularice su situación.
  Este mecanismo vincula directamente las obligaciones financieras con
  las credenciales académicas — algo que ningún sistema tradicional puede hacer.

---

¿Qué es Soroban exactamente y cuándo lo van a implementar?

  Soroban es la plataforma de smart contracts de Stellar. Características:

    - Lenguaje: Rust (compilado a WebAssembly)
    - Ejecución: determinística, en sandbox dentro de la red Stellar
    - Estado: explícito y predecible (diferente al EVM de Ethereum)
    - Fees: predecibles, sin gas spikes
    - Activado en Stellar Mainnet: octubre 2024

  Para Skill Route, Soroban permitirá:
    - Liberar fondos automáticamente al confirmar inscripción del alumno
    - Ejecutar cobros en fechas específicas sin intervención humana
    - Emitir el badge de egreso automáticamente al completar el programa
    - Aplicar sanciones progresivas sin que el operador intervenga

  Roadmap: Fase 3, días 180-270 del plan de implementación.

---

¿Por qué no usaron Soroban desde el principio?

  Dos razones prácticas:

  1. TIEMPO: desarrollar un contrato en Rust + Soroban requiere semanas de
     trabajo especializado. Para demostrar la propuesta de valor en un
     hackathon, `manageData` logra el mismo resultado visible para el juez.

  2. EQUIVALENCIA FUNCIONAL: el resultado de `manageData` es idéntico en
     términos de verificabilidad — el TXID existe, las condiciones están
     on-chain, y cualquier persona puede auditarlas en StellarExpert.
     La diferencia es que Soroban las ejecutaría automáticamente.

---

¿Cómo saben que la transacción no fue manipulada?

  Porque Stellar usa firmas criptográficas Ed25519.

  Cada transacción está firmada con la llave privada del operador de
  Skill Route. Para que alguien pueda modificar esa transacción necesitaría
  la llave privada — que nunca sale del servidor. Además, la red de
  validadores de Stellar rechazaría cualquier transacción con firma inválida.

  El hash SHA-256 de la transacción es el TXID. Si un solo bit cambia,
  el TXID cambia completamente. Por eso es inmutable.

---

¿Cómo garantizan que el dinero llega a la universidad y no a otra cuenta?

  En la versión MVP, la dirección de pago está codificada en el contrato
  on-chain (`sr_institution`). Con Soroban, el contrato ejecutará la
  transferencia de XLM/USDC directamente a la wallet verificada de la
  institución en cuanto se confirmen las condiciones (inscripción del alumno).

  La fondeadora puede ver el TXID de esa dispersión en StellarExpert y
  confirmar que el pago llegó exactamente a la wallet de la universidad —
  sin intermediarios, sin comisiones bancarias ocultas, en segundos.

---

¿Qué es un TXID y cómo lo uso para verificar?

  TXID (Transaction ID) es el identificador único de una transacción en
  Stellar. Es el hash SHA-256 de los contenidos de la transacción —
  una cadena de 64 caracteres hexadecimales.

  Para verificar cualquier contrato de Skill Route:
    1. Ir a stellar.expert/explorer/testnet
    2. Pegar el TXID en el buscador
    3. Ver todas las operaciones registradas: programa, institución,
       monto, plazo, estado — exactamente como los acordó el contrato

  Cualquier persona en el mundo puede hacerlo sin permisos ni cuenta.

---

====================================================================
SECCIÓN 3 — STELLAR TÉCNICO (jueces muy especializados)
====================================================================

---

¿Por qué Stellar y no Ethereum para esto?

  Stellar: fee fijo de ~$0.00001 USD, finalidad en 5 segundos,
           diseñado para pagos y activos, SDK JS oficial, Horizon API pública.

  Ethereum: fees variables (pueden ser $5-50 USD por transacción en congestion),
            finalidad en ~12 segundos, necesita nodo propio o Infura,
            más complejo para activos simples.

  Para el caso de uso de Skill Route (miles de transacciones de badges y
  contratos en LATAM), el costo en Ethereum haría inviable el modelo.
  En Stellar el costo es prácticamente cero.

---

¿Qué es el sequence number y por qué importa?

  Cada cuenta en Stellar tiene un número de secuencia que sube con cada
  transacción confirmada. Es la protección anti-replay de la red: no puedes
  reutilizar una transacción firmada porque su sequence number ya fue consumido.

  En el código, antes de construir cada transacción llamamos a
  server.loadAccount() para obtener el sequence number actual y evitar
  el error "tx_bad_seq".

---

¿Qué es BASE_FEE?

  100 stroops. 1 XLM = 10,000,000 stroops.
  Con XLM a ~$0.10 USD, 100 stroops = $0.000001 USD por operación.

  Una transacción de préstamo de Skill Route tiene 13 operaciones manageData.
  Costo total: ~$0.000013 USD. Prácticamente gratis.

  En Mainnet con congestión alta se puede usar Fee Bump para dar prioridad.

---

¿Qué es el network passphrase y para qué sirve?

  Es una cadena de texto única por red que se incluye en el hash de cada
  transacción. Previene que una transacción válida en Testnet se pueda
  reenviar en Mainnet (replay attack entre redes).

  Testnet: "Test SDF Network ; September 2015"
  Mainnet: "Public Global Stellar Network ; September 2015"

---

¿Cómo implementan el SBT (token no transferible)?

  En Stellar, un Asset tiene flags de autorización controlados por el emisor.
  Con "Authorization Required" activado, el emisor debe aprobar explícitamente
  cada trustline del receptor. Para hacer el token no transferible:

  El emisor (Skill Route) simplemente nunca aprueba transferencias del
  recipient a terceros. Si alguien intenta mover el asset, la operación
  payment/pathPayment falla porque el destino no tiene trustline aprobada.

  Resultado: el badge queda permanentemente en la cuenta del egresado.

---

Skill Route · Documento interno · Marzo 2026
Ernesto Juárez · Fundador
