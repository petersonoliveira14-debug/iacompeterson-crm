"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

// ─── Pipeline ─────────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { value: "lead_captado", label: "Lead Captado" },
  { value: "discovery_call", label: "Discovery Call" },
  { value: "formulario_enviado", label: "Form. Enviado" },
  { value: "formulario_recebido", label: "Form. Recebido" },
  { value: "prd_elaborado", label: "PRD Elaborado" },
  { value: "reuniao_1", label: "Reunião 1" },
  { value: "prd_aprovado", label: "PRD Aprovado" },
  { value: "proposta_elaborada", label: "Proposta Pronta" },
  { value: "proposta_enviada", label: "Proposta Enviada" },
  { value: "proposta_aceita", label: "Aceito 🎉" },
  { value: "em_execucao", label: "Em Execução" },
  { value: "entregue", label: "Entregue" },
  { value: "pos_venda", label: "Pós-venda" },
];

const MODAL_STAGES = ["proposta_enviada", "proposta_aceita", "em_execucao"];

const MODAL_CONFIG: Record<string, { title: string; icon: string }> = {
  proposta_enviada: { title: "Proposta Enviada", icon: "📤" },
  proposta_aceita: { title: "Fechamento Registrado", icon: "🤝" },
  em_execucao: { title: "Início da Execução", icon: "🚀" },
};

// ─── Mapas de rótulos legíveis ────────────────────────────────────────────────

const TIPO_LABELS: Record<string, string> = {
  sistema: "⚙️ Sistema interno",
  atendimento: "🤖 Atendimento automatizado",
  assistente: "🧠 Assistente com IA",
  site_lp: "🌐 Site / LP / Página de vendas",
  plataforma: "👥 Plataforma de usuários",
};

const PORTE_LABELS: Record<string, string> = {
  somente_eu: "👤 Só eu",
  "2_5": "👥 2–5 pessoas",
  "6_20": "👨‍👩‍👦 6–20 pessoas",
  "21_50": "🏢 21–50 pessoas",
  "51_mais": "🏭 51+ pessoas",
};

const FATURAMENTO_LABELS: Record<string, string> = {
  ate_20k: "Até R$20k/mês",
  "20k_80k": "R$20k – R$80k",
  "80k_250k": "R$80k – R$250k",
  "250k_1m": "R$250k – R$1M",
  acima_1m: "Acima de R$1M",
};

const TEMPO_LABELS: Record<string, string> = {
  menos_1ano: "Menos de 1 ano",
  "1_3anos": "1–3 anos",
  "3_10anos": "3–10 anos",
  mais_10anos: "Mais de 10 anos",
};

const GESTAO_LABELS: Record<string, string> = {
  whatsapp_informal: "📱 WhatsApp informal",
  planilha: "📋 Planilha Excel",
  sistema_proprio: "💻 Sistema próprio",
  nao_gerencio: "🤷 Ainda não gerencia",
};

const VOLUME_LABELS: Record<string, string> = {
  menos_10: "Menos de 10/dia",
  "10_50": "10 a 50/dia",
  "50_200": "50 a 200/dia",
  mais_200: "Mais de 200/dia",
};

const DORES_LABELS: Record<string, string> = {
  sem_followup: "📉 Sem follow-up",
  sem_registro: "📋 Equipe não registra",
  atendimento_lento: "⏰ Atendimento lento",
  sem_visibilidade_funil: "🔍 Sem visibilidade do funil",
  tarefas_repetitivas: "🔁 Tarefas repetitivas",
  escala_sem_contratar: "📈 Difícil escalar",
  sem_metricas: "📊 Sem métricas",
  vendas_desorganizadas: "🗂️ Vendas desorganizadas",
};

const PRAZO_LABELS: Record<string, string> = {
  urgente: "🔥 Urgente (<30 dias)",
  "1_2_meses": "📅 1–2 meses",
  "3_meses": "🗓️ 3+ meses",
  sem_pressa: "😌 Sem pressa",
};

const INVESTIMENTO_LABELS: Record<string, string> = {
  ate_2k: "Até R$2.000",
  "2k_5k": "R$2k – R$5k",
  "5k_15k": "R$5k – R$15k",
  acima_15k: "Acima de R$15k",
};

const BUDGET_LABELS: Record<string, string> = {
  menos_5k: "💚 Menos de R$5k/mês",
  "5k_15k": "💛 R$5k – R$15k/mês",
  "15k_50k": "🧡 R$15k – R$50k/mês",
  mais_50k: "❤️ Mais de R$50k/mês",
};

const CANAL_LABELS: Record<string, string> = {
  indicacao: "🗣️ Indicação de clientes",
  google_seo: "🔍 Google / SEO / Blog",
  social_media: "📱 Instagram / TikTok",
  linkedin: "💼 LinkedIn / Outreach",
  portais: "🏢 Portais e marketplaces",
  cold_outreach: "✉️ Prospecção ativa",
};

const TECH_LABELS: Record<string, string> = {
  leigo: "🙋 Leigo — precisa de suporte",
  intermediario: "🧑‍💻 Intermediário",
  avancado: "⚙️ Avançado — tem equipe técnica",
};

// ─── Utilitários ──────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function calcDiasRestantes(dataInicio: string, prazoDias: number): number {
  const inicio = new Date(dataInicio);
  const hoje = new Date();
  const diffMs = hoje.getTime() - inicio.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return prazoDias - diffDias;
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-gold-100 text-navy-800 text-sm font-medium mr-1.5 mb-1.5">
      {text}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5 mb-4">
      <h2 className="font-bold text-slate-500 text-xs uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-sm font-medium text-slate-500 mb-1">{label}</dt>
      <dd className="text-base text-slate-800 bg-slate-50 rounded-lg px-4 py-2.5">{value}</dd>
    </div>
  );
}

// ─── Modal de status ──────────────────────────────────────────────────────────

interface StatusModalProps {
  status: string;
  data: { data: string; valor: string; prazo: string };
  onChange: (field: "data" | "valor" | "prazo", value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function StatusModal({ status, data, onChange, onConfirm, onCancel, loading }: StatusModalProps) {
  const config = MODAL_CONFIG[status];
  if (!config) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(e) => { if (e.key === "Escape") onCancel(); }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl" aria-hidden="true">{config.icon}</span>
          <h2 id="modal-title" className="text-lg font-semibold text-slate-800">
            {config.title}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* Campo de data — presente em todos os status */}
          <div>
            <label htmlFor="modal-data" className="text-sm font-medium text-slate-600 block mb-1">
              {status === "proposta_enviada" && "Data de envio"}
              {status === "proposta_aceita" && "Data de fechamento"}
              {status === "em_execucao" && "Data de início"}
            </label>
            <input
              id="modal-data"
              type="date"
              value={data.data}
              onChange={(e) => onChange("data", e.target.value)}
              className="input-field w-full"
              disabled={loading}
            />
          </div>

          {/* Valor de fechamento — apenas proposta_aceita */}
          {status === "proposta_aceita" && (
            <div>
              <label htmlFor="modal-valor" className="text-sm font-medium text-slate-600 block mb-1">
                Valor de fechamento
              </label>
              <input
                id="modal-valor"
                type="text"
                value={data.valor}
                onChange={(e) => onChange("valor", e.target.value)}
                placeholder="R$ 0,00"
                className="input-field w-full"
                disabled={loading}
              />
            </div>
          )}

          {/* Prazo em dias úteis — apenas em_execucao */}
          {status === "em_execucao" && (
            <div>
              <label htmlFor="modal-prazo" className="text-sm font-medium text-slate-600 block mb-1">
                Prazo em dias úteis
              </label>
              <input
                id="modal-prazo"
                type="number"
                value={data.prazo}
                onChange={(e) => onChange("prazo", e.target.value)}
                placeholder="Ex: 30"
                min={1}
                className="input-field w-full"
                disabled={loading}
              />
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Estado do modal
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [modalData, setModalData] = useState({
    data: new Date().toISOString().split("T")[0],
    valor: "",
    prazo: "",
  });

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) { router.push("/admin/login"); return; }
    supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { router.push("/admin/clientes"); return; }
        setCliente(data);
        setLoading(false);
      });
  }, [id, router]);

  const updateStatus = async (newStatus: string, extraData: Record<string, any> = {}) => {
    setUpdatingStatus(true);
    const updates: Record<string, any> = { status: newStatus, ...extraData };
    const { error } = await supabase
      .from("clientes")
      .update(updates)
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar status.");
    } else {
      setCliente((c: any) => ({ ...c, status: newStatus, ...extraData }));
      toast.success("Status atualizado!");
    }
    setUpdatingStatus(false);
  };

  const handleStatusChange = (newStatus: string) => {
    if (MODAL_STAGES.includes(newStatus)) {
      setPendingStatus(newStatus);
      setModalData({ data: new Date().toISOString().split("T")[0], valor: "", prazo: "" });
    } else {
      updateStatus(newStatus, {});
    }
  };

  const handleModalConfirm = async () => {
    if (!pendingStatus) return;
    const extraData: Record<string, any> = {};

    if (pendingStatus === "proposta_enviada") {
      extraData.data_proposta_enviada = modalData.data;
    } else if (pendingStatus === "proposta_aceita") {
      extraData.data_fechamento = modalData.data;
      if (modalData.valor) {
        extraData.valor_fechamento = parseFloat(modalData.valor.replace(/\D/g, "")) / 100;
      }
    } else if (pendingStatus === "em_execucao") {
      extraData.data_inicio_execucao = modalData.data;
      if (modalData.prazo) {
        extraData.prazo_execucao_dias = parseInt(modalData.prazo, 10);
      }
    }

    await updateStatus(pendingStatus, extraData);
    setPendingStatus(null);
  };

  const handleModalCancel = () => {
    setPendingStatus(null);
  };

  const handleModalFieldChange = (field: "data" | "valor" | "prazo", value: string) => {
    setModalData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center text-slate-400">Carregando...</div>
    </div>
  );

  if (!cliente) return null;

  const tiposSolucao: string[] = cliente.tipos_solucao || (cliente.tipo_solucao ? cliente.tipo_solucao.split(", ") : []);
  const doresB2b: string[] = cliente.dores_b2b || [];

  const diasRestantes =
    cliente.data_inicio_execucao && cliente.prazo_execucao_dias
      ? calcDiasRestantes(cliente.data_inicio_execucao, cliente.prazo_execucao_dias)
      : null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">

        {/* Modal contextual de status */}
        {pendingStatus && (
          <StatusModal
            status={pendingStatus}
            data={modalData}
            onChange={handleModalFieldChange}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
            loading={updatingStatus}
          />
        )}

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/admin/clientes" className="hover:text-slate-600">Clientes</Link>
          <span>›</span>
          <span className="text-slate-700 font-medium">{cliente.nome_empresa || cliente.nome_contato}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl text-slate-900">{cliente.nome_empresa || cliente.nome_contato}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {cliente.nome_empresa ? `${cliente.nome_contato} · ` : ""}
              {cliente.segmento} · {cliente.whatsapp}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {/* Registrar aceite — proposta enviada/elaborada sem fechamento registrado */}
            {["proposta_elaborada", "proposta_enviada"].includes(cliente.status) && !cliente.data_fechamento && (
              <button
                onClick={() => handleStatusChange("proposta_aceita")}
                className="text-sm py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none" }}
              >
                ✅ Registrar aceite
              </button>
            )}
            {/* Registrar fechamento — qualquer estágio pós-proposta sem valor registrado */}
            {["proposta_aceita", "em_execucao", "entregue", "pos_venda"].includes(cliente.status) && !cliente.data_fechamento && (
              <button
                onClick={() => {
                  setPendingStatus("proposta_aceita");
                  setModalData({ data: new Date().toISOString().split("T")[0], valor: "", prazo: "" });
                }}
                className="text-sm py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #c9a84c, #a07830)", color: "white", border: "none" }}
              >
                💰 Registrar fechamento
              </button>
            )}
            {/* Editar fechamento quando já existe */}
            {cliente.data_fechamento && (
              <button
                onClick={() => {
                  setPendingStatus("proposta_aceita");
                  setModalData({ data: cliente.data_fechamento?.split("T")[0] || new Date().toISOString().split("T")[0], valor: cliente.valor_fechamento ? String(cliente.valor_fechamento * 100) : "", prazo: "" });
                }}
                className="btn-secondary text-sm py-2"
              >
                ✏️ Editar fechamento
              </button>
            )}
            <Link href={`/admin/clientes/${id}/proposta`} className="btn-primary text-sm py-2">+ Proposta</Link>
            <Link href={`/admin/clientes/${id}/prd`} className="btn-secondary text-sm py-2">PRD</Link>
          </div>
        </div>

        {/* Pipeline */}
        <div className="card p-5 mb-4">
          <h2 className="font-bold text-slate-500 text-xs uppercase tracking-wider mb-3">Estágio no pipeline</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={cliente.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              className="input-field w-auto text-sm"
              aria-label="Estágio no pipeline"
            >
              {PIPELINE_STAGES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {updatingStatus && <span className="text-xs text-slate-400">Salvando...</span>}
          </div>
        </div>

        {/* Banner de fechamento */}
        {(cliente.data_fechamento || cliente.valor_fechamento) && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            <span aria-hidden="true">✅</span>
            <span>
              {cliente.data_fechamento && (
                <>Fechado em <strong>{formatDate(cliente.data_fechamento)}</strong></>
              )}
              {cliente.data_fechamento && cliente.valor_fechamento && <span className="mx-1.5 text-emerald-400">|</span>}
              {cliente.valor_fechamento && (
                <>Valor: <strong>{formatCurrency(cliente.valor_fechamento)}</strong></>
              )}
            </span>
          </div>
        )}

        {/* Banner de execução */}
        {cliente.data_inicio_execucao && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm">
            <span aria-hidden="true">🚀</span>
            <span>
              Execução iniciada em <strong>{formatDate(cliente.data_inicio_execucao)}</strong>
              {cliente.prazo_execucao_dias && (
                <>
                  <span className="mx-1.5 text-blue-400">|</span>
                  Prazo: <strong>{cliente.prazo_execucao_dias} dias</strong>
                  {diasRestantes !== null && (
                    <>
                      <span className="mx-1.5 text-blue-400">|</span>
                      <span className={diasRestantes < 0 ? "text-red-600 font-semibold" : ""}>
                        {diasRestantes < 0
                          ? `${Math.abs(diasRestantes)} dias em atraso`
                          : `${diasRestantes} dias restantes`}
                      </span>
                    </>
                  )}
                </>
              )}
            </span>
          </div>
        )}

        {/* ── Identificação ── */}
        <Section title="📋 Identificação">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nome do contato" value={cliente.nome_contato} />
            <Field label="Empresa" value={cliente.nome_empresa} />
            <Field label="WhatsApp" value={cliente.whatsapp} />
            <Field label="Segmento" value={cliente.segmento} />
            {cliente.cnpj && <Field label="CNPJ" value={cliente.cnpj} />}
            {cliente.cpf && <Field label="CPF" value={cliente.cpf} />}
          </dl>
        </Section>

        {/* ── Perfil da empresa ── */}
        {(cliente.porte_empresa || cliente.faturamento_mensal || cliente.tempo_empresa) && (
          <Section title="🏢 Perfil da empresa">
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Porte" value={PORTE_LABELS[cliente.porte_empresa]} />
              <Field label="Faturamento mensal" value={FATURAMENTO_LABELS[cliente.faturamento_mensal]} />
              <Field label="Tempo no mercado" value={TEMPO_LABELS[cliente.tempo_empresa]} />
            </dl>
          </Section>
        )}

        {/* ── O que precisa ── */}
        <Section title="💡 O que precisa">
          {tiposSolucao.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-slate-500 mb-1.5">Tipos de solução</p>
              <div>
                {tiposSolucao.map((t: string) => (
                  <Badge key={t} text={TIPO_LABELS[t] || t} />
                ))}
              </div>
            </div>
          )}
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            <Field label="Como gerencia hoje" value={GESTAO_LABELS[cliente.como_gerencia_hoje] || cliente.como_gerencia_hoje} />
            <Field label="Volume de atendimentos/dia" value={VOLUME_LABELS[cliente.volume_atendimentos] || cliente.volume_atendimentos} />
          </dl>
        </Section>

        {/* ── Dores ── */}
        {(doresB2b.length > 0 || cliente.dor_outra) && (
          <Section title="🔥 Dores identificadas">
            {doresB2b.length > 0 && (
              <div className="mb-3">
                {doresB2b.map((d: string) => (
                  <Badge key={d} text={DORES_LABELS[d] || d} />
                ))}
              </div>
            )}
            {cliente.dor_outra && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Outra dor (livre)</p>
                <p className="text-sm text-slate-800 bg-slate-50 rounded-lg px-3 py-2">{cliente.dor_outra}</p>
              </div>
            )}
          </Section>
        )}

        {/* ── Expectativas ── */}
        <Section title="💰 Expectativas">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Custo mensal atual (base do ROI)" value={BUDGET_LABELS[cliente.budget_mensal]} />
            <Field label="Prazo desejado" value={PRAZO_LABELS[cliente.prazo_desejado] || cliente.prazo_desejado} />
            <Field label="Faixa de investimento no projeto" value={INVESTIMENTO_LABELS[cliente.faixa_investimento] || cliente.faixa_investimento} />
            {cliente.resultado_esperado && (
              <div className="md:col-span-2">
                <dt className="text-xs font-medium text-slate-500 mb-0.5">Resultado esperado em 3 meses</dt>
                <dd className="text-sm text-slate-800 bg-slate-50 rounded-lg px-3 py-2">{cliente.resultado_esperado}</dd>
              </div>
            )}
          </dl>
        </Section>

        {/* ── Sobre o negócio ── */}
        {(cliente.diferencial || cliente.icp || cliente.canal_aquisicao || cliente.experiencia_tech || cliente.restricoes) && (
          <Section title="🎯 Sobre o negócio">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cliente.diferencial && (
                <div className="md:col-span-2">
                  <dt className="text-xs font-medium text-slate-500 mb-0.5">Diferencial da empresa</dt>
                  <dd className="text-sm text-slate-800 bg-slate-50 rounded-lg px-3 py-2">{cliente.diferencial}</dd>
                </div>
              )}
              {cliente.icp && (
                <div className="md:col-span-2">
                  <dt className="text-xs font-medium text-slate-500 mb-0.5">Cliente ideal (ICP)</dt>
                  <dd className="text-sm text-slate-800 bg-slate-50 rounded-lg px-3 py-2">{cliente.icp}</dd>
                </div>
              )}
              <Field label="Canal de aquisição" value={CANAL_LABELS[cliente.canal_aquisicao]} />
              <Field label="Maturidade tecnológica" value={TECH_LABELS[cliente.experiencia_tech]} />
              {cliente.restricoes && (
                <div className="md:col-span-2">
                  <dt className="text-xs font-medium text-slate-500 mb-0.5">Restrições / integrações obrigatórias</dt>
                  <dd className="text-sm text-slate-800 bg-slate-50 rounded-lg px-3 py-2">{cliente.restricoes}</dd>
                </div>
              )}
            </dl>
          </Section>
        )}

        {/* Ações rápidas */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          <Link href={`/admin/clientes/${id}/prd`} className="card p-4 hover:border-gold-400 transition-colors text-center">
            <p className="text-2xl mb-1">📄</p>
            <p className="text-sm font-medium text-slate-700">PRD</p>
          </Link>
          <Link href={`/admin/clientes/${id}/proposta`} className="card p-4 hover:border-gold-400 transition-colors text-center">
            <p className="text-2xl mb-1">💰</p>
            <p className="text-sm font-medium text-slate-700">Proposta</p>
          </Link>
          <Link href={`/admin/clientes/${id}/checklist`} className="card p-4 hover:border-gold-400 transition-colors text-center">
            <p className="text-2xl mb-1">✅</p>
            <p className="text-sm font-medium text-slate-700">Checklist</p>
          </Link>
        </div>

      </main>
    </div>
  );
}
