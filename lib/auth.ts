import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'skillroute-secret-dev-change-in-production'
);

const COOKIE_NAME = 'sr_session';
const MAX_AGE    = 60 * 60 * 24 * 7; // 7 días

export interface SessionPayload {
  email:     string;
  full_name: string;
  role:      string;
}

// Firma un JWT con los datos del usuario
export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

// Verifica y decodifica un JWT
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Lee la sesión actual desde la cookie (solo en Server Components / API Routes)
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Crea la cookie de sesión en una Response
export function setSessionCookie(response: Response, token: string): void {
  response.headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`
  );
}

// Elimina la cookie de sesión
export function clearSessionCookie(response: Response): void {
  response.headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
}

// Nombre de la cookie (para leerla en el cliente via document.cookie no httpOnly)
export { COOKIE_NAME };
