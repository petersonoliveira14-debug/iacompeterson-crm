-- ============================================================
-- Schema: IA com Peterson CRM
-- Executar no Supabase SQL Editor (em ordem)
-- ============================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Tabela: clientes
-- ============================================================
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Pipeline status
  status VARCHAR(50) NOT NULL DEFAULT 'formulario_recebido',
  -- Valores válidos:
  -- lead_captado | discovery_call | formulario_enviado | formulario_recebido |
  -- prd_elaborado | reuniao_1 | prd_aprovado | proposta_elaborada |
  -- proposta_enviada | proposta_aceita | em_execucao | entregue | pos_venda

  -- Identificação
  nome_contato VARCHAR(255) NOT NULL,
  nome_empresa VARCHAR(255),
  whatsapp VARCHAR(30) NOT NULL,
  segmento VARCHAR(100),

  -- Tipo de solução (do formulário)
  tipo_solucao VARCHAR(50),
  -- Valores: sistema | atendimento | assistente | multiplo
  subtipo VARCHAR(100),
  -- Ex: crm | erp | estoque | pipeline | whatsapp | instagram | site | todos_canais

  -- Situação atual
  como_gerencia_hoje VARCHAR(100),
  maior_dor TEXT,
  volume_atendimentos VARCHAR(50),

  -- Expectativas
  resultado_esperado TEXT,
  prazo_desejado VARCHAR(50),
  faixa_investimento VARCHAR(50),

  -- Extra
  observacoes TEXT
);

-- Index para busca
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_created ON clientes(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Tabela: reunioes
-- ============================================================
CREATE TABLE IF NOT EXISTS reunioes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tipo VARCHAR(50) NOT NULL,
  -- Valores: discovery_call | alinhamento_1 | alinhamento_2 | kickoff | outro
  data_reuniao TIMESTAMPTZ,
  notas TEXT,
  decisao VARCHAR(50)
  -- Valores: aprovado | ajustes | reprovado | pendente
);

CREATE INDEX IF NOT EXISTS idx_reunioes_cliente ON reunioes(cliente_id);

-- ============================================================
-- Tabela: documentos (PRDs, prompts)
-- ============================================================
CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tipo VARCHAR(50) NOT NULL,
  -- Valores: prd | prompt_sistema
  versao INTEGER DEFAULT 1,
  conteudo TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'rascunho'
  -- Valores: rascunho | aprovado | reprovado
);

CREATE INDEX IF NOT EXISTS idx_documentos_cliente ON documentos(cliente_id);

-- ============================================================
-- Tabela: propostas
-- ============================================================
CREATE TABLE IF NOT EXISTS propostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  token VARCHAR(100) UNIQUE NOT NULL,
  validade_ate DATE,
  status VARCHAR(50) DEFAULT 'rascunho',
  -- Valores: rascunho | enviada | aceita | recusada | expirada
  pacote_escolhido VARCHAR(100),
  aceito_em TIMESTAMPTZ,
  aceito_por_nome VARCHAR(255),
  aceito_ip VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_propostas_token ON propostas(token);
CREATE INDEX IF NOT EXISTS idx_propostas_cliente ON propostas(cliente_id);

-- ============================================================
-- Tabela: proposta_pacotes
-- ============================================================
CREATE TABLE IF NOT EXISTS proposta_pacotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposta_id UUID NOT NULL REFERENCES propostas(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  itens TEXT[] DEFAULT '{}',
  valor DECIMAL(10, 2) NOT NULL,
  prazo_dias INTEGER NOT NULL,
  destaque BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_pacotes_proposta ON proposta_pacotes(proposta_id);

-- ============================================================
-- Row Level Security (RLS)
-- Desativar para uso com service_key no backend
-- ============================================================
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE reunioes DISABLE ROW LEVEL SECURITY;
ALTER TABLE documentos DISABLE ROW LEVEL SECURITY;
ALTER TABLE propostas DISABLE ROW LEVEL SECURITY;
ALTER TABLE proposta_pacotes DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- Dados de exemplo (opcional — remover em produção)
-- ============================================================
/*
INSERT INTO clientes (nome_contato, nome_empresa, whatsapp, segmento, tipo_solucao, subtipo, maior_dor, faixa_investimento)
VALUES
  ('Maria Silva', 'Clínica Vida Saudável', '(11) 99999-0001', 'Saúde', 'atendimento', 'whatsapp', 'Perco pacientes por demora no agendamento', '2k_5k'),
  ('João Mendes', 'JM Contabilidade', '(11) 99999-0002', 'Jurídico', 'sistema', 'crm', 'Não consigo acompanhar todos os clientes', '5k_15k');
*/
