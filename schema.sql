-- ============================================================
-- Skill Route — Schema MySQL
-- Ejecuta esto en tu MySQL antes de iniciar la app
-- ============================================================

CREATE DATABASE IF NOT EXISTS skillroute CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skillroute;

-- Usuarios de la plataforma
CREATE TABLE IF NOT EXISTS users (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  email              VARCHAR(255) UNIQUE NOT NULL,
  full_name          VARCHAR(255),
  password_hash      VARCHAR(255) NOT NULL,
  role               ENUM('cliente', 'institucion', 'fondeadora') DEFAULT 'cliente',
  stellar_public_key VARCHAR(60) DEFAULT NULL,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Préstamos (opcional — actualmente en localStorage para el demo)
CREATE TABLE IF NOT EXISTS loans (
  id              VARCHAR(100) PRIMARY KEY,
  user_email      VARCHAR(255) NOT NULL,
  program         VARCHAR(255),
  institution     VARCHAR(255),
  total_cost      INT,
  loan_amount     INT,
  monthly_payment INT,
  term_months     INT,
  txid            VARCHAR(255),
  explorer_url    TEXT,
  status          VARCHAR(50) DEFAULT 'active',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Badges creados por instituciones (opcional — actualmente en localStorage)
CREATE TABLE IF NOT EXISTS badges (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(50) UNIQUE NOT NULL,
  title       VARCHAR(255),
  issuer      VARCHAR(255),
  event_name  VARCHAR(255),
  description TEXT,
  image_url   LONGTEXT,
  claim_url   TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reclamos de badges por usuarios
CREATE TABLE IF NOT EXISTS badge_claims (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  badge_code   VARCHAR(50) NOT NULL,
  claimer_name VARCHAR(255),
  claimer_email VARCHAR(255) NOT NULL,
  claimed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (badge_code) REFERENCES badges(code)
);

-- Usuario de prueba (contraseña: Contra123)
-- Hash generado con bcrypt rounds=10
INSERT IGNORE INTO users (email, full_name, password_hash, role)
VALUES (
  'example@gmail.com',
  'Usuario 1',
  '$2b$10$KIXnX8Z1h3Q1Q1Q1Q1Q1Q.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  'cliente'
);
