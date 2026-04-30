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
    dores_b2b?: string[];
    tipos_solucao?: string[];
    tipo_solucao?: string;
    budget_mensal?: string;
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
  const { data, error } = await supabase
    .from("propostas")
    .select(`
      id, token, status, validade_ate,
      clientes (nome_contato, nome_empresa, dores_b2b, tipos_solucao, tipo_solucao, budget_mensal),
      proposta_pacotes (id, nome, descricao, itens, valor, prazo_dias, destaque)
    `)
    .eq("token", token)
    .single();

  if (error || !data) throw new Error("Proposta não encontrada");

  const cliente = Array.isArray(data.clientes) ? data.clientes[0] : data.clientes;
  const pacotes = (Array.isArray(data.proposta_pacotes) ? data.proposta_pacotes : []) as PacoteProposta[];

  return {
    id: data.id,
    token: data.token,
    status: data.status,
    validade_ate: data.validade_ate,
    cliente: {
      nome_contato: cliente?.nome_contato || "",
      nome_empresa: cliente?.nome_empresa || undefined,
      dores_b2b: cliente?.dores_b2b || [],
      tipos_solucao: cliente?.tipos_solucao || [],
      tipo_solucao: cliente?.tipo_solucao || undefined,
      budget_mensal: cliente?.budget_mensal || undefined,
    },
    pacotes,
  };
}

export async function aceitarProposta(token: string, pacoteId: string, nome: string): Promise<void> {
  const { data: proposta, error: fetchError } = await supabase
    .from("propostas")
    .select("id, cliente_id")
    .eq("token", token)
    .single();

  if (fetchError || !proposta) throw new Error("Proposta não encontrada");

  const { error: updateError } = await supabase
    .from("propostas")
    .update({
      status: "aceita",
      pacote_escolhido: pacoteId,
      aceito_em: new Date().toISOString(),
      aceito_por_nome: nome,
    })
    .eq("token", token);

  if (updateError) throw new Error("Erro ao registrar aceite");

  await supabase
    .from("clientes")
    .update({ status: "proposta_aceita" })
    .eq("id", proposta.cliente_id);
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
