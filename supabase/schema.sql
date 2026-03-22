-- ============================================================
-- Skill Route · Schema completo
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

-- Usuarios estudiantes (wallet generada automáticamente al registrarse)
CREATE TABLE IF NOT EXISTS users (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email              text UNIQUE NOT NULL,
  full_name          text,
  password           text,
  stellar_public_key text,
  created_at         timestamptz DEFAULT now()
);

-- Si la tabla ya existe, agrega la columna password:
ALTER TABLE users ADD COLUMN IF NOT EXISTS password text;

-- Instituciones que emiten badges
CREATE TABLE IF NOT EXISTS instituciones (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  email      text UNIQUE NOT NULL,
  password   text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Fondeadoras que publican programas
CREATE TABLE IF NOT EXISTS fondeadoras (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  email      text UNIQUE NOT NULL,
  password   text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Badges creados por instituciones
CREATE TABLE IF NOT EXISTS badges (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code              text UNIQUE NOT NULL,
  title             text NOT NULL,
  issuer            text NOT NULL,
  event             text,
  description       text,
  image_url         text,
  institucion_email text,
  claim_url         text,
  created_at        timestamptz DEFAULT now()
);

-- Reclamaciones de badges por usuarios
CREATE TABLE IF NOT EXISTS badge_claims (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_code    text NOT NULL REFERENCES badges(code) ON DELETE CASCADE,
  claimer_name  text NOT NULL,
  claimer_email text NOT NULL,
  txid          text,
  explorer_url  text,
  claimed_at    timestamptz DEFAULT now(),
  UNIQUE(badge_code, claimer_email)
);

-- Habilitar RLS (Row Level Security) — acceso libre vía service role desde API
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE instituciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE fondeadoras   ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges        ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_claims  ENABLE ROW LEVEL SECURITY;

-- Políticas abiertas (el acceso se controla desde la API con service role)
CREATE POLICY "service_role_all" ON users         FOR ALL USING (true);
CREATE POLICY "service_role_all" ON instituciones FOR ALL USING (true);
CREATE POLICY "service_role_all" ON fondeadoras   FOR ALL USING (true);
CREATE POLICY "service_role_all" ON badges        FOR ALL USING (true);
CREATE POLICY "service_role_all" ON badge_claims  FOR ALL USING (true);
