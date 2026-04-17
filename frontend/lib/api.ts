const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface FormData {
  nome_contato: string;
  nome_empresa?: string;
  whatsapp: string;
  segmento: string;
  tipo_solucao: string;
  subtipo?: string;
  como_gerencia_hoje?: string;
  maior_dor?: string;
  volume_atendimentos?: string;
  resultado_esperado?: string;
  prazo_desejado?: string;
  faixa_investimento?: string;
  observacoes?: string;
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
  const res = await fetch(`${API_URL}/api/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao enviar formulário");
  return res.json();
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
