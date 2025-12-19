-- Migration: User Domain Setup
-- Description: Creates tables and constraints for User bounded context
-- Date: 2025-12-19

-- ============================================================================
-- Create users table
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(100) NOT NULL,
  cpf VARCHAR(11),
  birth_date DATE,
  gender VARCHAR(30),
  photo_url TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  email_before_deletion VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,

  -- Constraint: email é obrigatório exceto quando deletado
  CONSTRAINT check_email_not_null_unless_deleted CHECK (
    (email IS NOT NULL AND deleted_at IS NULL) OR
    (email IS NULL AND deleted_at IS NOT NULL)
  ),

  -- Unique: email quando não deletado
  CONSTRAINT unique_email_not_deleted UNIQUE (email)
);

-- Index para busca por CPF
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf) WHERE cpf IS NOT NULL;

-- Index para busca por email deletado
CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NOT NULL;

-- ============================================================================
-- Create user_phones table
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_phones (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  label VARCHAR(50) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  is_whatsapp BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Partial unique index: apenas 1 telefone primary por usuário
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_primary_phone
  ON user_phones(user_id)
  WHERE is_primary = TRUE;

-- Index para busca de telefones por usuário
CREATE INDEX IF NOT EXISTS idx_user_phones_user_id ON user_phones(user_id);

-- ============================================================================
-- Create user_providers table
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_providers (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_email VARCHAR(255),
  linked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Unique: provider + provider_id global
  CONSTRAINT unique_provider_user UNIQUE (provider, provider_id),

  -- Unique: user não pode ter 2 providers do mesmo tipo
  CONSTRAINT unique_user_provider_type UNIQUE (user_id, provider)
);

-- Index para busca de providers por usuário
CREATE INDEX IF NOT EXISTS idx_user_providers_user_id ON user_providers(user_id);

-- Index para busca por provider
CREATE INDEX IF NOT EXISTS idx_user_providers_provider ON user_providers(provider, provider_id);
