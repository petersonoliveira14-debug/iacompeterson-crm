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

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-full bg-gold-100 text-navy-800 text-xs font-medium mr-1.5 mb-1.5">
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
      <dt className="text-xs font-medium text-slate-500 mb-0.5">{label}</dt>
      <dd className="text-sm text-slate-800 bg-slate-50 rounded-lg px-3 py-2">{value}</dd>
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

  const updateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    const { error } = await supabase
      .from("clientes")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar status.");
    } else {
      setCliente((c: any) => ({ ...c, status: newStatus }));
      toast.success("Status atualizado!");
    }
    setUpdatingStatus(false);
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">

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
          <div className="flex gap-2">
            <Link href={`/admin/clientes/${id}/proposta`} className="btn-primary text-sm py-2">+ Criar proposta</Link>
            <Link href={`/admin/clientes/${id}/prd`} className="btn-secondary text-sm py-2">PRD</Link>
          </div>
        </div>

        {/* Pipeline */}
        <div className="card p-5 mb-4">
          <h2 className="font-bold text-slate-500 text-xs uppercase tracking-wider mb-3">Estágio no pipeline</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={cliente.status}
              onChange={e => updateStatus(e.target.value)}
              disabled={updatingStatus}
              className="input-field w-auto text-sm"
            >
              {PIPELINE_STAGES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {updatingStatus && <span className="text-xs text-slate-400">Salvando...</span>}
          </div>
        </div>

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
