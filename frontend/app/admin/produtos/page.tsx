"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type PipelineStage =
  | "ideacao"
  | "estruturacao"
  | "criacao"
  | "producao"
  | "revisao"
  | "prevenda"
  | "live"
  | "escala"
  | "beta"
  | "aguardando";

type ProductStatus = "live" | "prevenda" | "soon" | "beta" | "dev";

type Categoria =
  | "Trilogia LEAP"
  | "Bundle"
  | "Formação"
  | "High Ticket"
  | "Consultoria"
  | "Plataforma";

interface Produto {
  id: string;
  nome: string;
  tipo: string;
  categoria: Categoria;
  precoT0: number | null;
  precoRegular: number | null;
  status: ProductStatus;
  pipeline: PipelineStage;
  desc: string;
  lancamento: string;
}

// ─── Catálogo de SKUs ─────────────────────────────────────────────────────────
// Regra da marca: todos os preços terminam com o dígito 8

const PRODUTOS: Produto[] = [
  {
    id: "LEAP-BUILD",
    nome: "LEAP BUILD",
    tipo: "Curso Gravado",
    categoria: "Trilogia LEAP",
    precoT0: 498,
    precoRegular: 998,
    status: "live",
    pipeline: "escala",
    desc: "Do problema ao sistema — 22 aulas + 4 bônus. Case real: sistema de gestão de frota corporativa do zero ao deploy.",
    lancamento: "15/05/2025",
  },
  {
    id: "LEAP-RUN",
    nome: "LEAP RUN",
    tipo: "Curso Gravado",
    categoria: "Trilogia LEAP",
    precoT0: 498,
    precoRegular: 998,
    status: "soon",
    pipeline: "criacao",
    desc: "Criando seu assistente pessoal de IA — produtividade no modo gestor.",
    lancamento: "Pós-FGI · Jul/2025",
  },
  {
    id: "LEAP-SCALE",
    nome: "LEAP SCALE",
    tipo: "Curso Gravado",
    categoria: "Trilogia LEAP",
    precoT0: 498,
    precoRegular: 998,
    status: "soon",
    pipeline: "criacao",
    desc: "Atendimento, SDR e follow-up — vendas no piloto automático 24/7.",
    lancamento: "Pós-FGI · Jul/2025",
  },
  {
    id: "TRILOGIA-BUNDLE",
    nome: "Bundle Trilogia LEAP",
    tipo: "Pack · Leve 3 Pague 2",
    categoria: "Bundle",
    precoT0: 998,
    precoRegular: 1998,
    status: "soon",
    pipeline: "aguardando",
    desc: "Os três cursos pelo preço de dois. Alunos turma zero BUILD garantem preço ao pagar diferença.",
    lancamento: "Pós RUN + SCALE",
  },
  {
    id: "FGI-ESSENCIAL",
    nome: "FGI — Essencial",
    tipo: "Imersão ao Vivo",
    categoria: "Formação",
    precoT0: null,
    precoRegular: 1498,
    status: "prevenda",
    pipeline: "producao",
    desc: "Formação Gestores de IA. Imersão completa que cria a nova categoria profissional.",
    lancamento: "Junho/2025",
  },
  {
    id: "FGI-PREMIUM",
    nome: "FGI — Premium",
    tipo: "Imersão ao Vivo + Bônus",
    categoria: "Formação",
    precoT0: null,
    precoRegular: 2498,
    status: "prevenda",
    pipeline: "producao",
    desc: "FGI com mentoria em grupo, acesso premium e materiais exclusivos.",
    lancamento: "Junho/2025",
  },
  {
    id: "MENTORIA-IND",
    nome: "Mentoria Individual",
    tipo: "Serviço 1:1",
    categoria: "High Ticket",
    precoT0: null,
    precoRegular: 8008,
    status: "live",
    pipeline: "escala",
    desc: "Aplicação guiada do Método LEAP no negócio do cliente. Alto ticket, alto resultado.",
    lancamento: "Disponível",
  },
  {
    id: "CONSULT-ESS",
    nome: "Consultoria Essencial",
    tipo: "Por Projeto",
    categoria: "Consultoria",
    precoT0: null,
    precoRegular: 1498,
    status: "live",
    pipeline: "escala",
    desc: "Implementação de automações e sistemas IA — frota, viagens ou atendimento.",
    lancamento: "Disponível",
  },
  {
    id: "CONSULT-ADV",
    nome: "Consultoria Avançada",
    tipo: "Por Projeto",
    categoria: "Consultoria",
    precoT0: null,
    precoRegular: 3098,
    status: "live",
    pipeline: "escala",
    desc: "Projeto completo com múltiplos sistemas integrados — do mapeamento ao deploy.",
    lancamento: "Disponível",
  },
  {
    id: "OCTUS-SAAS",
    nome: "OCTUS",
    tipo: "SaaS",
    categoria: "Plataforma",
    precoT0: null,
    precoRegular: null,
    status: "beta",
    pipeline: "beta",
    desc: "Plataforma de criação, planejamento e postagem de conteúdo com IA. Prova viva do Método LEAP.",
    lancamento: "Beta · Preço a definir",
  },
];

// ─── Configurações visuais ────────────────────────────────────────────────────

const CATEGORIA_COLORS: Record<Categoria, { bg: string; text: string }> = {
  "Trilogia LEAP": { bg: "rgba(240,196,25,0.15)", text: "#f0c419" },
  "Bundle":        { bg: "rgba(124,58,237,0.15)",  text: "#a78bfa" },
  "Formação":      { bg: "rgba(59,130,246,0.15)",  text: "#60a5fa" },
  "High Ticket":   { bg: "rgba(16,185,129,0.15)",  text: "#34d399" },
  "Consultoria":   { bg: "rgba(16,185,129,0.10)",  text: "#6ee7b7" },
  "Plataforma":    { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" },
};

const STATUS_CONFIG: Record<ProductStatus, { label: string; bg: string; text: string; dot: string }> = {
  live:     { label: "Disponível",  bg: "rgba(16,185,129,0.15)",  text: "#34d399", dot: "#34d399" },
  prevenda: { label: "Pré-venda",   bg: "rgba(240,196,25,0.15)",  text: "#f0c419", dot: "#f0c419" },
  soon:     { label: "Em Breve",    bg: "rgba(59,130,246,0.15)",  text: "#60a5fa", dot: "#60a5fa" },
  beta:     { label: "Beta",        bg: "rgba(124,58,237,0.15)",  text: "#a78bfa", dot: "#a78bfa" },
  dev:      { label: "Em Desenv.",  bg: "rgba(107,114,128,0.15)", text: "#9ca3af", dot: "#9ca3af" },
};

const PIPELINE_CONFIG: Record<PipelineStage, { label: string; color: string; step: number }> = {
  ideacao:       { label: "Ideação",        color: "#6b7280", step: 1 },
  estruturacao:  { label: "Estruturação",   color: "#f59e0b", step: 2 },
  criacao:       { label: "Criação",        color: "#f0c419", step: 3 },
  producao:      { label: "Produção",       color: "#3b82f6", step: 4 },
  revisao:       { label: "Revisão",        color: "#8b5cf6", step: 5 },
  prevenda:      { label: "Pré-venda",      color: "#06b6d4", step: 6 },
  live:          { label: "Live",           color: "#10b981", step: 7 },
  escala:        { label: "Escala",         color: "#34d399", step: 8 },
  beta:          { label: "Beta",           color: "#a78bfa", step: 4 },
  aguardando:    { label: "Aguardando",     color: "#6b7280", step: 0 },
};

const TODAS_CATEGORIAS = ["Todas", "Trilogia LEAP", "Bundle", "Formação", "High Ticket", "Consultoria", "Plataforma"] as const;
const TODOS_STATUS      = ["Todos", "live", "prevenda", "soon", "beta", "dev"] as const;

function formatPreco(valor: number | null): string {
  if (valor === null) return "—";
  return `R$${valor.toLocaleString("pt-BR")}`;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ProdutosPage() {
  const [filtroCategoria, setFiltroCategoria] = useState<string>("Todas");
  const [filtroStatus, setFiltroStatus]       = useState<string>("Todos");
  const [expanded, setExpanded]               = useState<string | null>(null);

  const filtrados = PRODUTOS.filter((p) => {
    const catOk    = filtroCategoria === "Todas" || p.categoria === filtroCategoria;
    const statusOk = filtroStatus === "Todos"    || p.status === filtroStatus;
    return catOk && statusOk;
  });

  // Totais
  const totalMRR = PRODUTOS.filter((p) => p.status === "live" && p.precoRegular)
    .reduce((acc, p) => acc + (p.precoRegular ?? 0), 0);
  const totalSKUs    = PRODUTOS.length;
  const liveSKUs     = PRODUTOS.filter((p) => p.status === "live").length;
  const pipelineSKUs = PRODUTOS.filter((p) => p.status !== "live" && p.status !== "beta").length;

  return (
    <div className="flex min-h-screen" style={{ background: "#080e1c" }}>
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#c9a84c" }}>
            Gestão de Produtos
          </p>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'General Sans', sans-serif" }}>
            Catálogo de SKUs
          </h1>
          <p className="text-sm text-white/40">
            Ecossistema IA com Peterson · Método LEAP · {totalSKUs} produtos
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de SKUs",      value: totalSKUs,                            sub: "produtos cadastrados",    color: "#c9a84c" },
            { label: "Live / Vendendo",    value: liveSKUs,                             sub: "disponíveis agora",       color: "#34d399" },
            { label: "Em Pipeline",        value: pipelineSKUs,                         sub: "em criação ou pré-venda", color: "#60a5fa" },
            { label: "Ticket Máximo",      value: "R$8.008",                            sub: "Mentoria Individual",     color: "#a78bfa" },
          ].map((kpi) => (
            <div key={kpi.label}
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: kpi.color }}>
                {kpi.label}
              </p>
              <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
              <p className="text-xs text-white/40">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1.5 flex-wrap">
            {TODAS_CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                style={filtroCategoria === cat
                  ? { background: "#c9a84c", color: "#0f2044" }
                  : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap ml-auto">
            {TODOS_STATUS.map((st) => {
              const cfg = st !== "Todos" ? STATUS_CONFIG[st as ProductStatus] : null;
              return (
                <button
                  key={st}
                  onClick={() => setFiltroStatus(st)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                  style={filtroStatus === st
                    ? { background: cfg?.bg ?? "rgba(201,168,76,0.2)", color: cfg?.text ?? "#c9a84c", border: `1px solid ${cfg?.dot ?? "#c9a84c"}40` }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }
                  }
                >
                  {cfg ? cfg.label : "Todos"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabela de produtos */}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {/* Cabeçalho */}
          <div className="grid text-xs font-bold uppercase tracking-widest px-6 py-3"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)",
              gridTemplateColumns: "2fr 1fr 1fr 120px 120px 1fr 120px" }}
          >
            <span>Produto / SKU</span>
            <span>Categoria</span>
            <span>Tipo</span>
            <span>Preço T0</span>
            <span>Preço Regular</span>
            <span>Pipeline</span>
            <span>Status</span>
          </div>

          {/* Linhas */}
          {filtrados.map((p, i) => {
            const cat    = CATEGORIA_COLORS[p.categoria];
            const status = STATUS_CONFIG[p.status];
            const pipe   = PIPELINE_CONFIG[p.pipeline];
            const isExp  = expanded === p.id;

            return (
              <div key={p.id}>
                {/* Linha principal */}
                <div
                  onClick={() => setExpanded(isExp ? null : p.id)}
                  className="grid px-6 py-4 cursor-pointer transition-all duration-150"
                  style={{
                    gridTemplateColumns: "2fr 1fr 1fr 120px 120px 1fr 120px",
                    background: isExp ? "rgba(201,168,76,0.06)" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  {/* Nome + SKU */}
                  <div className="flex flex-col justify-center">
                    <span className="text-white font-semibold text-sm">{p.nome}</span>
                    <span className="text-white/30 text-xs font-mono mt-0.5">{p.id}</span>
                  </div>

                  {/* Categoria */}
                  <div className="flex items-center">
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold"
                      style={{ background: cat.bg, color: cat.text }}>
                      {p.categoria}
                    </span>
                  </div>

                  {/* Tipo */}
                  <div className="flex items-center">
                    <span className="text-white/50 text-xs">{p.tipo}</span>
                  </div>

                  {/* Preço T0 */}
                  <div className="flex items-center">
                    <span className="text-white/70 text-sm font-medium">{formatPreco(p.precoT0)}</span>
                  </div>

                  {/* Preço Regular */}
                  <div className="flex items-center">
                    <span className="text-white font-bold text-sm">{formatPreco(p.precoRegular)}</span>
                  </div>

                  {/* Pipeline */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pipe.color }} />
                    <span className="text-xs" style={{ color: pipe.color }}>{pipe.label}</span>
                    {pipe.step > 0 && (
                      <span className="text-white/20 text-xs">({pipe.step}/8)</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: status.bg, color: status.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Linha expandida */}
                {isExp && (
                  <div className="px-6 py-4 border-t" style={{ background: "rgba(201,168,76,0.04)", borderColor: "rgba(201,168,76,0.12)" }}>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#c9a84c" }}>Descrição</p>
                        <p className="text-sm text-white/60 leading-relaxed">{p.desc}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#c9a84c" }}>Lançamento</p>
                        <p className="text-sm text-white/60">{p.lancamento}</p>
                        <p className="text-xs font-bold uppercase tracking-widest mt-3 mb-1" style={{ color: "#c9a84c" }}>Pipeline Stage</p>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {(["ideacao","estruturacao","criacao","producao","revisao","prevenda","live","escala"] as PipelineStage[]).map((stage) => {
                            const s = PIPELINE_CONFIG[stage];
                            const isCurrent = stage === p.pipeline;
                            const isPast = s.step > 0 && pipe.step > 0 && s.step < pipe.step;
                            return (
                              <span key={stage} className="px-2 py-0.5 rounded text-[10px] font-semibold"
                                style={{
                                  background: isCurrent ? `${pipe.color}25` : isPast ? "rgba(255,255,255,0.05)" : "transparent",
                                  color: isCurrent ? s.color : isPast ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
                                  border: isCurrent ? `1px solid ${s.color}50` : "1px solid transparent",
                                }}>
                                {s.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#c9a84c" }}>Resumo de Preços</p>
                        <div className="space-y-1.5">
                          {p.precoT0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-white/40">Turma Zero</span>
                              <span className="text-white font-medium">{formatPreco(p.precoT0)}</span>
                            </div>
                          )}
                          {p.precoRegular && (
                            <div className="flex justify-between text-sm">
                              <span className="text-white/40">Regular</span>
                              <span className="font-bold" style={{ color: "#c9a84c" }}>{formatPreco(p.precoRegular)}</span>
                            </div>
                          )}
                          {p.precoT0 && p.precoRegular && (
                            <div className="flex justify-between text-xs pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                              <span className="text-white/30">Economia T0</span>
                              <span className="text-green-400">{formatPreco(p.precoRegular - p.precoT0)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtrados.length === 0 && (
            <div className="px-6 py-12 text-center text-white/30 text-sm">
              Nenhum produto encontrado com os filtros selecionados.
            </div>
          )}
        </div>

        {/* Funil de preços */}
        <div className="mt-8 rounded-2xl p-6 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c9a84c" }}>
            Funil de Preços · Do Topo ao High Ticket
          </p>
          <div className="flex items-end gap-2 overflow-x-auto pb-2">
            {[
              { label: "LEAP BUILD", price: "R$498", color: "#f0c419", height: 40 },
              { label: "LEAP RUN",   price: "R$498", color: "#f0c419", height: 40 },
              { label: "LEAP SCALE", price: "R$498", color: "#f0c419", height: 40 },
              { label: "Bundle",     price: "R$998", color: "#a78bfa", height: 55 },
              { label: "FGI Ess.",   price: "R$1.498", color: "#60a5fa", height: 70 },
              { label: "FGI Prem.",  price: "R$2.498", color: "#60a5fa", height: 85 },
              { label: "Consult E.", price: "R$1.498", color: "#34d399", height: 70 },
              { label: "Consult A.", price: "R$3.098", color: "#34d399", height: 90 },
              { label: "Mentoria",   price: "R$8.008", color: "#f87171", height: 130 },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.price}</span>
                <div className="w-14 rounded-t-lg transition-all"
                  style={{ height: `${item.height}px`, background: `${item.color}20`, border: `1px solid ${item.color}40` }} />
                <span className="text-[9px] text-white/40 text-center w-14 leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nota Ladeirinha */}
        <div className="mt-6 rounded-xl p-4 border-l-4" style={{ background: "rgba(201,168,76,0.06)", borderColor: "#c9a84c" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#c9a84c" }}>
            Agente Ladeirinha · Regra de Precificação
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            <strong className="text-white/80">Todos os preços terminam com o dígito 8.</strong>{" "}
            R$498, R$998, R$1.498, R$2.498, R$3.098, R$8.008. Essa consistência cria uma assinatura de marca reconhecível e comunica premium sem parecer arbitrário.
          </p>
        </div>
      </main>
    </div>
  );
}
