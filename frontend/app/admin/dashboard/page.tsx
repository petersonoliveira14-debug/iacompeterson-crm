"use client";

import { useEffect, useState, useMemo } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Cliente {
  id: string;
  nome_contato: string;
  nome_empresa?: string;
  tipo_solucao: string;
  status: string;
  created_at: string;
  valor_fechamento?: number;
  data_fechamento?: string;
  data_inicio_execucao?: string;
  prazo_execucao_dias?: number;
  faixa_investimento?: string;
}

interface ChecklistRow {
  cliente_id: string;
  itens: ChecklistItem[] | null;
}

interface ChecklistItem {
  feito?: boolean;
  done?: boolean;
  concluido?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  lead_captado:          { label: "Lead",          color: "bg-slate-100 text-slate-700" },
  formulario_recebido:   { label: "Formulário",    color: "bg-blue-100 text-blue-700" },
  reuniao_1:             { label: "Reunião",        color: "bg-indigo-100 text-indigo-700" },
  prd_elaborado:         { label: "PRD",            color: "bg-purple-100 text-purple-700" },
  prd_aprovado:          { label: "PRD aprovado",  color: "bg-violet-100 text-violet-700" },
  proposta_elaborada:    { label: "Proposta",       color: "bg-amber-100 text-amber-700" },
  proposta_enviada:      { label: "Enviada",        color: "bg-orange-100 text-orange-700" },
  proposta_aceita:       { label: "Aceita",         color: "bg-green-100 text-green-700" },
  em_execucao:           { label: "Em execução",   color: "bg-sky-100 text-sky-700" },
  entregue:              { label: "Entregue",       color: "bg-teal-100 text-teal-700" },
  pos_venda:             { label: "Pós-venda",      color: "bg-cyan-100 text-cyan-700" },
  cancelado:             { label: "Cancelado",      color: "bg-red-100 text-red-700" },
  pausado:               { label: "Pausado",        color: "bg-slate-100 text-slate-600" },
};

const NEGOTIATION_STATUSES = [
  "formulario_recebido",
  "prd_elaborado",
  "reuniao_1",
  "prd_aprovado",
  "proposta_elaborada",
  "proposta_enviada",
];

const MONTH_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calcProgress(itens: ChecklistItem[] | null | undefined): number {
  if (!itens || itens.length === 0) return 0;
  const done = itens.filter((i) => i.feito || i.done || i.concluido).length;
  return Math.round((done / itens.length) * 100);
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 0 });
}

function calcDiasRestantes(
  dataInicio: string | undefined,
  prazo: number | undefined
): number | null {
  if (!dataInicio || !prazo) return null;
  const inicio = new Date(dataInicio);
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + prazo);
  const hoje = new Date();
  const diff = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="h-3 bg-slate-200 rounded w-20 mb-4" />
          <div className="h-7 bg-slate-200 rounded w-14" />
        </div>
      ))}
    </div>
  );
}

function MetricCard({
  emoji,
  label,
  value,
  highlight,
}: {
  emoji: string;
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`card p-6 transition-shadow hover:shadow-md ${
        highlight ? "border-gold-200 bg-gold-50/50" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg" aria-hidden="true">{emoji}</span>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-gold-600" : "text-slate-900"
        }`}
        style={{ fontFamily: "'General Sans', sans-serif" }}
      >
        {value}
      </p>
    </div>
  );
}

function BarChart({
  meses,
}: {
  meses: Array<{ mes: string; valor: number }>;
}) {
  const maxValor = Math.max(...meses.map((m) => m.valor), 1);
  const temDados = meses.some((m) => m.valor > 0);
  const BAR_MAX_HEIGHT = 120;

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="font-bold text-slate-900 text-lg">Faturamento Mensal</h2>
        <p className="text-sm text-slate-600 mt-0.5">Últimos 6 meses</p>
      </div>

      {!temDados && (
        <p className="text-sm text-slate-500 text-center py-4">
          Sem fechamentos registrados neste período.
        </p>
      )}

      <div
        className="flex items-end justify-between gap-2"
        role="img"
        aria-label="Gráfico de barras: faturamento mensal dos últimos 6 meses"
      >
        {meses.map((m) => {
          const barHeight =
            m.valor > 0
              ? Math.max(Math.round((m.valor / maxValor) * BAR_MAX_HEIGHT), 4)
              : 4;
          const isEmpty = m.valor === 0;

          return (
            <div
              key={m.mes}
              className="flex flex-col items-center gap-1 flex-1"
            >
              {/* Valor acima da barra */}
              <span
                className={`text-xs font-medium ${
                  isEmpty ? "text-slate-300" : "text-slate-700"
                }`}
                style={{ minHeight: "1rem" }}
              >
                {isEmpty ? "" : `R$ ${formatBRL(m.valor)}`}
              </span>

              {/* Barra */}
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: isEmpty ? "#e2e8f0" : "#c9a84c",
                  minHeight: "4px",
                }}
                title={`${m.mes}: R$ ${formatBRL(m.valor)}`}
              />

              {/* Label do mês */}
              <span className="text-xs text-slate-500 mt-1">{m.mes}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  const clipped = Math.min(Math.max(percent, 0), 100);
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={clipped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${clipped}% concluído`}
    >
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${clipped}%`,
            backgroundColor: clipped === 100 ? "#14b8a6" : "#c9a84c",
          }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 w-9 text-right">
        {clipped}%
      </span>
    </div>
  );
}

function DiasRestantesBadge({ dias }: { dias: number | null }) {
  if (dias === null) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  if (dias < 0) {
    return (
      <span className="text-xs font-semibold text-red-600">
        {Math.abs(dias)}d atrasado
      </span>
    );
  }
  if (dias <= 3) {
    return (
      <span className="text-xs font-semibold text-amber-600">{dias}d</span>
    );
  }
  return <span className="text-xs text-slate-600">{dias}d</span>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const router = useRouter();
  const [todosClientes, setTodosClientes] = useState<Cliente[]>([]);
  const [checklistMap, setChecklistMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [custos, setCustos] = useState<{ ia: number; fixo: number; variavel: number }>({ ia: 0, fixo: 0, variavel: 0 });

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) {
      router.push("/admin/login");
      return;
    }

    const savedCustos = localStorage.getItem("dashboard_custos");
    if (savedCustos) {
      try { setCustos(JSON.parse(savedCustos)); } catch {}
    }

    Promise.all([
      supabase
        .from("clientes")
        .select(
          "id, nome_contato, nome_empresa, tipo_solucao, status, created_at, valor_fechamento, data_fechamento, data_inicio_execucao, prazo_execucao_dias, faixa_investimento"
        )
        .order("created_at", { ascending: false }),
      supabase.from("checklists").select("cliente_id, itens"),
    ])
      .then(([clientesRes, checklistsRes]) => {
        if (clientesRes.error) throw clientesRes.error;

        const clientes: Cliente[] = clientesRes.data || [];
        setTodosClientes(clientes);

        // Montar mapa cliente_id → % progresso
        const map: Record<string, number> = {};
        if (!checklistsRes.error && checklistsRes.data) {
          (checklistsRes.data as ChecklistRow[]).forEach((row) => {
            map[row.cliente_id] = calcProgress(row.itens);
          });
        }
        setChecklistMap(map);
      })
      .catch((err: Error) => {
        setError(err.message || "Erro ao carregar dados.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  // -------------------------------------------------------------------------
  // Derived metrics
  // -------------------------------------------------------------------------

  const totalLeads = todosClientes.length;

  const emNegociacao = useMemo(
    () => todosClientes.filter((c) => NEGOTIATION_STATUSES.includes(c.status)).length,
    [todosClientes]
  );

  const emExecucao = useMemo(
    () => todosClientes.filter((c) => c.status === "em_execucao").length,
    [todosClientes]
  );

  const entregues = useMemo(
    () => todosClientes.filter((c) => c.status === "entregue").length,
    [todosClientes]
  );

  const receitaMes = useMemo(() => {
    const hoje = new Date();
    return todosClientes
      .filter((c) => {
        if (!c.data_fechamento || !c.valor_fechamento) return false;
        const d = new Date(c.data_fechamento);
        return (
          d.getMonth() === hoje.getMonth() &&
          d.getFullYear() === hoje.getFullYear()
        );
      })
      .reduce((sum, c) => sum + (c.valor_fechamento ?? 0), 0);
  }, [todosClientes]);

  const receitaMesLabel =
    receitaMes > 0 ? `R$ ${formatBRL(receitaMes)}` : "R$ —";

  // -------------------------------------------------------------------------
  // Chart data — últimos 6 meses
  // -------------------------------------------------------------------------

  const chartMeses = useMemo(() => {
    const meses = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - (5 - i));
      return {
        mes: MONTH_SHORT[d.getMonth()],
        ano: d.getFullYear(),
        monthIdx: d.getMonth(),
        valor: 0,
      };
    });

    todosClientes.forEach((c) => {
      if (!c.data_fechamento || !c.valor_fechamento) return;
      const d = new Date(c.data_fechamento);
      const entry = meses.find(
        (m) => m.monthIdx === d.getMonth() && m.ano === d.getFullYear()
      );
      if (entry) entry.valor += c.valor_fechamento;
    });

    return meses;
  }, [todosClientes]);

  // -------------------------------------------------------------------------
  // Projetos em execução
  // -------------------------------------------------------------------------

  const projetosEmExecucao = useMemo(
    () => todosClientes.filter((c) => c.status === "em_execucao"),
    [todosClientes]
  );

  // -------------------------------------------------------------------------
  // Últimos 8 clientes
  // -------------------------------------------------------------------------

  const recentes = useMemo(
    () => todosClientes.slice(0, 8),
    [todosClientes]
  );

  // -------------------------------------------------------------------------
  // Funil de conversão
  // -------------------------------------------------------------------------

  const emNegociacaoFunil = useMemo(
    () => todosClientes.filter(c => ["formulario_recebido","prd_elaborado","reuniao_1","prd_aprovado","proposta_elaborada"].includes(c.status)).length,
    [todosClientes]
  );
  const emPropostaFunil = useMemo(
    () => todosClientes.filter(c => ["proposta_enviada","proposta_aceita"].includes(c.status)).length,
    [todosClientes]
  );
  const fechadosFunil = useMemo(
    () => todosClientes.filter(c => ["proposta_aceita","em_execucao","entregue","pos_venda"].includes(c.status)).length,
    [todosClientes]
  );
  const negativasFunil = useMemo(
    () => todosClientes.filter(c => c.status === "negativa").length,
    [todosClientes]
  );

  // -------------------------------------------------------------------------
  // Pipeline de faturamento
  // -------------------------------------------------------------------------

  const FAIXA_VALORES: Record<string, number> = { ate_2k: 2000, "2k_5k": 3500, "5k_15k": 10000, acima_15k: 20000 };
  const receitaRealizada = useMemo(
    () => todosClientes.reduce((sum, c) => sum + (c.valor_fechamento ?? 0), 0),
    [todosClientes]
  );
  const pipelineEmAberto = useMemo(
    () => todosClientes.filter(c => ["proposta_enviada","proposta_elaborada"].includes(c.status)),
    [todosClientes]
  );
  const pipelineValor = useMemo(
    () => pipelineEmAberto.reduce((sum, c) => sum + (FAIXA_VALORES[c.faixa_investimento || ""] || 0), 0),
    [pipelineEmAberto]
  );

  // -------------------------------------------------------------------------
  // ROI
  // -------------------------------------------------------------------------

  const projFechados = fechadosFunil;
  const custoTotal = custos.ia + custos.fixo + (projFechados * custos.variavel);
  const lucro = receitaRealizada - custoTotal;
  const roi = custoTotal > 0 ? Math.round((lucro / custoTotal) * 100) : null;

  function saveCustos(newCustos: typeof custos) {
    setCustos(newCustos);
    localStorage.setItem("dashboard_custos", JSON.stringify(newCustos));
  }

  // -------------------------------------------------------------------------
  // Clipboard
  // -------------------------------------------------------------------------

  function handleCopyLink() {
    const link = `${window.location.origin}/cliente`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-slate-900">Dashboard</h1>
          <p className="text-base text-slate-600 mt-1">Visão geral do seu negócio</p>
        </div>

        {/* Loading state */}
        {loading && <SkeletonGrid count={5} />}

        {/* Error state */}
        {!loading && error && (
          <div
            className="card p-6 border-red-200 bg-red-50 text-red-700"
            role="alert"
          >
            <p className="font-semibold">Erro ao carregar dashboard</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="space-y-6">

            {/* ── KPI Cards ──────────────────────────────────────────────── */}
            <section aria-label="Métricas gerais">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard emoji="📥" label="Total de leads"   value={totalLeads} />
                <MetricCard emoji="💼" label="Em negociação"    value={emNegociacao} />
                <MetricCard emoji="🔨" label="Em execução"      value={emExecucao} />
                <MetricCard emoji="✅" label="Entregues"        value={entregues} />
                <MetricCard
                  emoji="💰"
                  label="Receita este mês"
                  value={receitaMesLabel}
                  highlight
                />
              </div>
            </section>

            {/* ── Gráfico + Projetos em execução ─────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* Gráfico de barras */}
              <section aria-label="Faturamento mensal">
                <BarChart meses={chartMeses} />
              </section>

              {/* Projetos em execução */}
              <section aria-label="Projetos em execução">
                <div className="card h-full">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900 text-lg">Projetos em execução</h2>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {projetosEmExecucao.length} projeto{projetosEmExecucao.length !== 1 ? "s" : ""} ativo{projetosEmExecucao.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {projetosEmExecucao.length === 0 ? (
                    <p className="p-6 text-sm text-slate-500 text-center">
                      Nenhum projeto em execução no momento.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" aria-label="Tabela de projetos em execução">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Projeto</th>
                            <th className="text-left text-xs font-semibold text-slate-500 px-3 py-3 hidden md:table-cell">Início</th>
                            <th className="text-right text-xs font-semibold text-slate-500 px-3 py-3 hidden md:table-cell">Restam</th>
                            <th className="text-left text-xs font-semibold text-slate-500 px-3 py-3 pr-6">Progresso</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {projetosEmExecucao.map((c) => {
                            const diasRestantes = calcDiasRestantes(
                              c.data_inicio_execucao,
                              c.prazo_execucao_dias
                            );
                            const progress = checklistMap[c.id] ?? 0;

                            return (
                              <tr
                                key={c.id}
                                className="hover:bg-slate-50 transition-colors"
                              >
                                <td className="px-6 py-3">
                                  <Link
                                    href={`/admin/clientes/${c.id}`}
                                    className="font-medium text-slate-800 hover:text-gold-600 transition-colors focus:outline-none focus:underline"
                                  >
                                    {c.nome_empresa || c.nome_contato}
                                  </Link>
                                  <p className="text-xs text-slate-500 mt-0.5">{c.tipo_solucao}</p>
                                </td>
                                <td className="px-3 py-3 text-slate-600 hidden md:table-cell whitespace-nowrap">
                                  {c.data_inicio_execucao
                                    ? new Date(c.data_inicio_execucao).toLocaleDateString("pt-BR")
                                    : <span className="text-slate-400">—</span>}
                                </td>
                                <td className="px-3 py-3 text-right hidden md:table-cell">
                                  <DiasRestantesBadge dias={diasRestantes} />
                                </td>
                                <td className="px-3 py-3 pr-6 min-w-[120px]">
                                  <ProgressBar percent={progress} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ── Funil de Conversão ─────────────────────────────────────── */}
            <section aria-label="Funil de conversão">
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-1">Funil de Conversão</h2>
                <p className="text-sm text-slate-500 mb-6">Do lead ao projeto fechado</p>
                <div className="flex items-center justify-between gap-2 overflow-x-auto">
                  {[
                    { label: "Leads", value: totalLeads, color: "#64748b" },
                    { label: "Negociação", value: emNegociacaoFunil, color: "#8b5cf6" },
                    { label: "Proposta", value: emPropostaFunil, color: "#c9a84c" },
                    { label: "Fechados", value: fechadosFunil, color: "#10b981" },
                    { label: "Negativas", value: negativasFunil, color: "#ef4444" },
                  ].map((etapa, i, arr) => (
                    <div key={etapa.label} className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-center min-w-[72px]">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-1"
                          style={{ background: etapa.color }}>
                          {etapa.value}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{etapa.label}</p>
                        {i > 0 && totalLeads > 0 && (
                          <p className="text-xs font-semibold mt-0.5" style={{ color: etapa.color }}>
                            {Math.round((etapa.value / totalLeads) * 100)}%
                          </p>
                        )}
                      </div>
                      {i < arr.length - 1 && (
                        <span className="text-slate-300 text-xl flex-shrink-0">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Pipeline de Faturamento + ROI ─────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* Pipeline de faturamento */}
              <section aria-label="Pipeline de faturamento">
                <div className="card p-6 h-full">
                  <h2 className="font-bold text-slate-900 text-lg mb-1">Pipeline de Faturamento</h2>
                  <p className="text-sm text-slate-500 mb-6">Receita realizada vs potencial em aberto</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Receita realizada</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: "'General Sans',sans-serif" }}>
                          R$ {formatBRL(receitaRealizada)}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{fechadosFunil} projetos fechados</p>
                      </div>
                      <span className="text-3xl">✅</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#c9a84c" }}>Potencial em pipeline</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: "'General Sans',sans-serif" }}>
                          R$ {formatBRL(pipelineValor)}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{pipelineEmAberto.length} proposta{pipelineEmAberto.length !== 1 ? "s" : ""} em aberto</p>
                      </div>
                      <span className="text-3xl">📤</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total acumulado</p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: "'General Sans',sans-serif" }}>
                          R$ {formatBRL(receitaRealizada + pipelineValor)}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">realizado + pipeline</p>
                      </div>
                      <span className="text-3xl">📊</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ROI */}
              <section aria-label="ROI do negócio">
                <div className="card p-6 h-full">
                  <h2 className="font-bold text-slate-900 text-lg mb-1">ROI do Negócio</h2>
                  <p className="text-sm text-slate-500 mb-4">Informe seus custos para calcular o retorno</p>
                  <div className="space-y-3 mb-5">
                    {[
                      { key: "ia" as const, label: "💻 Custo com IA / APIs (mensal)", placeholder: "0" },
                      { key: "fixo" as const, label: "🏠 Custo fixo mensal", placeholder: "0" },
                      { key: "variavel" as const, label: "📦 Custo variável por projeto", placeholder: "0" },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="text-xs font-medium text-slate-500 block mb-1">{label}</label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400 font-medium">R$</span>
                          <input
                            type="number"
                            min={0}
                            value={custos[key] || ""}
                            onChange={(e) => saveCustos({ ...custos, [key]: Number(e.target.value) || 0 })}
                            placeholder={placeholder}
                            className="input-field flex-1 text-sm h-10"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Receita realizada</span>
                      <span className="font-semibold text-slate-800">R$ {formatBRL(receitaRealizada)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Custos estimados</span>
                      <span className="font-semibold text-slate-800">R$ {formatBRL(custoTotal)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-100">
                      <span style={{ color: lucro >= 0 ? "#10b981" : "#ef4444" }}>Lucro estimado</span>
                      <span style={{ color: lucro >= 0 ? "#10b981" : "#ef4444" }}>R$ {formatBRL(lucro)}</span>
                    </div>
                    {roi !== null && (
                      <div className="mt-3 text-center py-3 rounded-xl" style={{ background: roi >= 0 ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)" }}>
                        <p className="text-xs text-slate-500 mb-0.5">ROI</p>
                        <p className="text-3xl font-bold" style={{ color: roi >= 0 ? "#10b981" : "#ef4444", fontFamily: "'General Sans',sans-serif" }}>
                          {roi > 0 ? "+" : ""}{roi}%
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 text-center pt-1">💡 Valores salvos localmente no navegador</p>
                  </div>
                </div>
              </section>
            </div>

            {/* ── Últimos clientes ───────────────────────────────────────── */}
            <section aria-label="Últimos clientes">
              <div className="card">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900 text-lg">Últimos clientes</h2>
                  <Link
                    href="/admin/clientes"
                    className="text-sm text-gold-600 hover:text-gold-700 hover:underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 rounded"
                  >
                    Ver todos →
                  </Link>
                </div>

                <div className="divide-y divide-slate-100">
                  {recentes.length === 0 ? (
                    <p className="p-6 text-sm text-slate-500 text-center">
                      Nenhum cliente ainda. Compartilhe o link do formulário!
                    </p>
                  ) : (
                    recentes.map((c) => {
                      const st =
                        STATUS_LABELS[c.status] || {
                          label: c.status,
                          color: "bg-slate-100 text-slate-600",
                        };
                      return (
                        <Link
                          key={c.id}
                          href={`/admin/clientes/${c.id}`}
                          className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors focus:outline-none focus:bg-slate-50"
                        >
                          <div className="min-w-0 mr-4">
                            <p className="font-medium text-slate-800 text-base truncate">
                              {c.nome_empresa || c.nome_contato}
                            </p>
                            <p className="text-sm text-slate-600 mt-0.5 truncate">
                              {c.nome_empresa ? c.nome_contato + " · " : ""}
                              {c.tipo_solucao}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${st.color}`}
                            >
                              {st.label}
                            </span>
                            <span className="text-sm text-slate-500 hidden sm:inline whitespace-nowrap">
                              {new Date(c.created_at).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

            {/* ── Link do formulário ─────────────────────────────────────── */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-gold-200 bg-gold-50/50">
              <p className="text-sm font-semibold text-navy-800 mb-2">
                🔗 Link do formulário para clientes:
              </p>
              <div className="flex items-center gap-3">
                <code className="text-sm text-navy-800 bg-white border border-gold-200 rounded-lg px-3 py-2 flex-1 overflow-x-auto block">
                  {typeof window !== "undefined"
                    ? window.location.origin
                    : "https://iacompeterson.com.br"}
                  /cliente
                </code>
                <button
                  onClick={handleCopyLink}
                  aria-label="Copiar link do formulário"
                  className="btn-primary py-2 px-4 text-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
                >
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
