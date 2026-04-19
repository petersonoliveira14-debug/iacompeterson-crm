import { supabase } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface FormData {
  nome_contato: string;
  nome_empresa?: string;
  whatsapp: string;
  segmento: string;
  tipo_solucao: string;
  tipos_solucao?: string[];
  segmento_outro?: string;
  cnpj?: string;
  cpf?: string;
  porte_empresa?: string;
  faturamento_mensal?: string;
  tempo_empresa?: string;
  como_gerencia_hoje?: string;
  dores_b2b?: string[];
  dor_outra?: string;
  volume_atendimentos?: string;
  budget_mensal?: string;
  resultado_esperado?: string;
  prazo_desejado?: string;
  faixa_investimento?: string;
  diferencial?: string;
  icp?: string;
  canal_aquisicao?: string;
  experiencia_tech?: string;
  restricoes?: string;
}

export interface Proposta {
  id: string;
  token: string;
  status: string;
  validade_ate: string;
  cliente: {
    nome_contato: string;
    nome_empresa?: string;
  };
  pacotes: PacoteProposta[];
}

export interface PacoteProposta {
  id: string;
  nome: string;
  descricao?: string;
  itens: string[];
  valor: number;
  prazo_dias: number;
  destaque: boolean;
}

export async function submitForm(data: FormData): Promise<{ id: string }> {
  const { data: result, error } = await supabase
    .from("clientes")
    .insert({ ...data, status: "formulario_recebido" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: result.id };
}

export async function getProposta(token: string): Promise<Proposta> {
  const res = await fetch(`${API_URL}/api/propostas/${token}`);
  if (!res.ok) throw new Error("Proposta não encontrada");
  return res.json();
}

export async function aceitarProposta(token: string, pacoteId: string, nome: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/propostas/${token}/aceitar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pacote_id: pacoteId, nome_assinante: nome }),
  });
  if (!res.ok) throw new Error("Erro ao aceitar proposta");
}

// Admin (com auth)
export async function getClientes(token: string) {
  const res = await fetch(`${API_URL}/api/admin/clientes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Não autorizado");
  return res.json();
}

export async function getCliente(token: string, id: string) {
  const res = await fetch(`${API_URL}/api/admin/clientes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Cliente não encontrado");
  return res.json();
}

export async function updateClienteStatus(token: string, id: string, status: string) {
  const res = await fetch(`${API_URL}/api/admin/clientes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar");
  return res.json();
}
