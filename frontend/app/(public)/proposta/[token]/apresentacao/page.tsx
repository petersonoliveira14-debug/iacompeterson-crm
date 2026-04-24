"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ─── Mapas de rótulos ─────────────────────────────────────────────────────────

const TIPO_LABELS: Record<string, { label: string; emoji: string; desc: string }> = {
  sistema:     { emoji: "⚙️", label: "Sistema interno",            desc: "CRM, ERP, estoque, dashboard, pipeline comercial" },
  atendimento: { emoji: "🤖", label: "Atendimento automatizado",   desc: "Bot no WhatsApp, Instagram DM, chat no site 24/7" },
  assistente:  { emoji: "🧠", label: "Assistente com IA",          desc: "IA personalizada para uso interno ou com clientes" },
  site_lp:     { emoji: "🌐", label: "Site / Landing Page",        desc: "Site institucional, LP de campanha, página de vendas" },
  plataforma:  { emoji: "👥", label: "Plataforma de usuários",     desc: "Portal, área de membros, app web personalizado" },
};

const DORES_LABELS: Record<string, string> = {
  sem_followup:           "Perda de clientes por falta de follow-up",
  sem_registro:           "Equipe não registra processos",
  atendimento_lento:      "Atendimento lento perdendo vendas",
  sem_visibilidade_funil: "Sem visibilidade do funil comercial",
  tarefas_repetitivas:    "Tempo perdido em tarefas repetitivas",
  escala_sem_contratar:   "Difícil crescer sem contratar mais",
  sem_metricas:           "Sem rastreamento de resultados",
  vendas_desorganizadas:  "Processo de vendas desorganizado",
};

const PORTE_LABELS: Record<string, string> = {
  somente_eu: "Só eu", "2_5": "2–5 pessoas", "6_20": "6–20 pessoas",
  "21_50": "21–50 pessoas", "51_mais": "51+ pessoas",
};

const BUDGET_LABELS: Record<string, string> = {
  menos_5k: "menos de R$5k/mês", "5k_15k": "R$5k–R$15k/mês",
  "15k_50k": "R$15k–R$50k/mês", mais_50k: "mais de R$50k/mês",
};

const PRAZO_LABELS: Record<string, string> = {
  urgente: "Urgente (< 30 dias)", "1_2_meses": "1 a 2 meses",
  "3_meses": "3+ meses", sem_pressa: "Sem pressa",
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Pacote {
  id: string; nome: string; descricao?: string;
  itens: string[]; valor: number; prazo_dias: number; destaque: boolean;
}

interface ApresentacaoData {
  token: string;
  validade_ate?: string;
  pacotes: Pacote[];
  cliente: {
    nome_contato: string; nome_empresa?: string; segmento?: string;
    tipos_solucao?: string[]; tipo_solucao?: string;
    dores_b2b?: string[]; budget_mensal?: string;
    resultado_esperado?: string; porte_empresa?: string;
    diferencial?: string; faixa_investimento?: string; prazo_desejado?: string;
  };
}

// ─── Helpers de estilo ────────────────────────────────────────────────────────

const NAVY = "#0f2044";
const GOLD  = "#c9a84c";

function GoldBadge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: GOLD }}
      className="inline-block px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
      {children}
    </span>
  );
}

function SlideWrapper({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 overflow-auto"
      style={{ background: dark ? NAVY : "#f8fafc" }}>
      {children}
    </div>
  );
}

// ─── Slides ───────────────────────────────────────────────────────────────────

function Slide1Capa({ data }: { data: ApresentacaoData }) {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  return (
    <SlideWrapper dark>
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-8"
          style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
          🤖
        </div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>
          Proposta Comercial
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'General Sans', sans-serif" }}>
          {data.cliente.nome_empresa || data.cliente.nome_contato}
        </h1>
        <p className="text-lg mb-8" style={{ color: "#d0def4" }}>
          Preparada especialmente por <strong className="text-white">IA com Peterson</strong>
        </p>
        {data.validade_ate && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: "rgba(201,168,76,0.15)", color: GOLD, border: "1px solid rgba(201,168,76,0.3)" }}>
            ⏰ Válida até {new Date(data.validade_ate).toLocaleDateString("pt-BR")}
          </div>
        )}
        <p className="text-xs mt-6" style={{ color: "#8ba3c7" }}>{hoje}</p>
      </div>
    </SlideWrapper>
  );
}

function Slide2Negocio({ data }: { data: ApresentacaoData }) {
  const { cliente } = data;
  return (
    <SlideWrapper>
      <div className="max-w-3xl mx-auto w-full">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
          O que entendemos
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
          Sobre o seu negócio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "🏢", label: "Segmento", value: cliente.segmento },
            { icon: "👥", label: "Porte", value: PORTE_LABELS[cliente.porte_empresa || ""] },
            { icon: "⏱️", label: "Prazo desejado", value: PRAZO_LABELS[cliente.prazo_desejado || ""] },
            { icon: "💰", label: "Custo atual com a operação", value: BUDGET_LABELS[cliente.budget_mensal || ""] },
          ].filter(i => i.value).map(item => (
            <div key={item.label} className="bg-white rounded-2xl p-5 border border-slate-200 flex items-start gap-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">{item.label}</p>
                <p className="font-semibold text-slate-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        {cliente.diferencial && (
          <div className="mt-4 bg-white rounded-2xl p-5 border border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-1">✨ Diferencial da empresa</p>
            <p className="text-slate-800 font-medium">{cliente.diferencial}</p>
          </div>
        )}
      </div>
    </SlideWrapper>
  );
}

function Slide3Dores({ data }: { data: ApresentacaoData }) {
  const dores: string[] = data.cliente.dores_b2b || [];
  return (
    <SlideWrapper dark>
      <div className="max-w-3xl mx-auto w-full">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
          Suas dores
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: "'General Sans', sans-serif" }}>
          O que está te impedindo de crescer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dores.map(d => (
            <div key={d} className="flex items-center gap-3 rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: GOLD, color: NAVY }}>✓</span>
              <p className="text-white text-base font-medium">{DORES_LABELS[d] || d}</p>
            </div>
          ))}
        </div>
        {data.cliente.resultado_esperado && (
          <div className="mt-6 rounded-2xl p-5" style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: GOLD }}>🎯 O que você quer alcançar</p>
            <p className="text-white">{data.cliente.resultado_esperado}</p>
          </div>
        )}
      </div>
    </SlideWrapper>
  );
}

function Slide4Solucoes({ data }: { data: ApresentacaoData }) {
  const tipos: string[] = data.cliente.tipos_solucao ||
    (data.cliente.tipo_solucao ? data.cliente.tipo_solucao.split(", ") : []);
  return (
    <SlideWrapper>
      <div className="max-w-3xl mx-auto w-full">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
          A solução
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
          O que vamos construir para você
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tipos.map(t => {
            const info = TIPO_LABELS[t];
            if (!info) return null;
            return (
              <div key={t} className="bg-white rounded-2xl p-6 border-2 flex gap-4 items-start"
                style={{ borderColor: "rgba(201,168,76,0.3)" }}>
                <span className="text-3xl">{info.emoji}</span>
                <div>
                  <p className="font-bold text-slate-800 mb-1">{info.label}</p>
                  <p className="text-sm text-slate-500">{info.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        {tipos.length === 0 && (
          <p className="text-slate-500">Solução personalizada — detalhes nos pacotes abaixo.</p>
        )}
      </div>
    </SlideWrapper>
  );
}

function Slide5ROI({ data }: { data: ApresentacaoData }) {
  const budget = data.cliente.budget_mensal;
  const budgetLabel = budget ? BUDGET_LABELS[budget] : null;
  const pacoteDestaque = data.pacotes.find(p => p.destaque) || data.pacotes[1];
  return (
    <SlideWrapper dark>
      <div className="max-w-3xl mx-auto w-full text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
          O argumento financeiro
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'General Sans', sans-serif" }}>
          Por que investir agora?
        </h2>
        <p className="text-lg mb-10" style={{ color: "#d0def4" }}>
          Automatizar custa menos do que continuar pagando pelo problema
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "#8ba3c7" }}>Custo atual da operação</p>
            <p className="text-2xl font-bold text-white">{budgetLabel || "A calcular"}</p>
            <p className="text-xs mt-1" style={{ color: "#8ba3c7" }}>por mês</p>
          </div>
          <div className="rounded-2xl p-6 flex flex-col items-center justify-center">
            <span className="text-4xl">→</span>
            <p className="text-xs mt-2" style={{ color: GOLD }}>com IA</p>
          </div>
          {pacoteDestaque && (
            <div className="rounded-2xl p-6" style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <p className="text-xs font-medium mb-2" style={{ color: GOLD }}>Investimento no projeto</p>
              <p className="text-2xl font-bold text-white">
                R$ {pacoteDestaque.valor.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </p>
              <p className="text-xs mt-1" style={{ color: "#8ba3c7" }}>pagamento único</p>
            </div>
          )}
        </div>
        <div className="rounded-2xl p-5 text-left" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <p className="text-sm" style={{ color: "#d0def4" }}>
            💡 Se você gasta hoje <strong style={{ color: "white" }}>{budgetLabel || "valor significativo"}</strong> com processos manuais,
            a solução se paga em poucos meses — e o que sobra vira <strong style={{ color: GOLD }}>lucro direto</strong>.
          </p>
        </div>
      </div>
    </SlideWrapper>
  );
}

function Slide6Pacotes({ data }: { data: ApresentacaoData }) {
  return (
    <SlideWrapper>
      <div className="max-w-4xl mx-auto w-full">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
          Investimento
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
          Escolha o seu pacote
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.pacotes.map(p => (
            <div key={p.id}
              className="rounded-2xl p-5 border-2 flex flex-col relative"
              style={{
                borderColor: p.destaque ? GOLD : "#e2e8f0",
                background: p.destaque ? "#fffbf0" : "white",
              }}>
              {p.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ background: GOLD }}>
                  ⭐ Mais escolhido
                </div>
              )}
              <p className="text-base font-bold text-slate-800 mb-1">{p.nome}</p>
              {p.descricao && <p className="text-sm text-slate-500 mb-3">{p.descricao}</p>}
              <p className="text-2xl font-bold mb-0.5" style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
                R$ {p.valor.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-slate-400 mb-4">{p.prazo_dias} dias úteis</p>
              <ul className="space-y-2 flex-1">
                {p.itens.slice(0, 5).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span style={{ color: GOLD }} className="flex-shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
                {p.itens.length > 5 && (
                  <li className="text-sm text-slate-400">+{p.itens.length - 5} itens adicionais</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

function Slide7ProximosPassos({ data }: { data: ApresentacaoData }) {
  const steps = [
    { emoji: "✅", title: "Aceitar a proposta", desc: "Clique em \"Aceitar\" e assine digitalmente" },
    { emoji: "💬", title: "Confirmação via WhatsApp", desc: "Peterson confirma o recebimento em até 2h" },
    { emoji: "💳", title: "Instrução de pagamento", desc: "Você recebe os dados para transferência" },
    { emoji: "🚀", title: "Kickoff do projeto", desc: "Reunião inicial para alinhar todos os detalhes" },
    { emoji: "🔨", title: "Desenvolvimento", desc: `Em até ${data.pacotes[1]?.prazo_dias || 30} dias úteis, entregamos tudo funcionando` },
    { emoji: "🎉", title: "Entrega e treinamento", desc: "Suporte completo para sua equipe começar a usar" },
  ];
  return (
    <SlideWrapper>
      <div className="max-w-3xl mx-auto w-full">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
          Como funciona
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
          Próximos passos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-slate-200">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                style={{ background: NAVY }}>{i + 1}</div>
              <div>
                <p className="font-semibold text-slate-800 text-base">{s.emoji} {s.title}</p>
                <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

function Slide8CTA({ data }: { data: ApresentacaoData }) {
  return (
    <SlideWrapper dark>
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-6">🚀</div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>
          Vamos começar?
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'General Sans', sans-serif" }}>
          Pronto para transformar sua operação?
        </h2>
        <p className="text-lg mb-10" style={{ color: "#d0def4" }}>
          Acesse a proposta completa, escolha seu pacote e assine digitalmente.
        </p>
        <Link
          href={`/proposta/${data.token}`}
          className="inline-block px-8 py-4 rounded-2xl font-bold text-base transition-all"
          style={{ background: GOLD, color: NAVY }}
        >
          Ver proposta completa →
        </Link>
        <p className="text-xs mt-6" style={{ color: "#8ba3c7" }}>
          Dúvidas? Chame Peterson no WhatsApp antes de assinar.
        </p>
      </div>
    </SlideWrapper>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ApresentacaoPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<ApresentacaoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    supabase
      .from("propostas")
      .select(`
        id, token, status, validade_ate,
        clientes (
          nome_contato, nome_empresa, segmento, tipos_solucao, tipo_solucao,
          dores_b2b, budget_mensal, resultado_esperado, porte_empresa,
          diferencial, faixa_investimento, prazo_desejado
        ),
        proposta_pacotes (id, nome, descricao, itens, valor, prazo_dias, destaque)
      `)
      .eq("token", token)
      .single()
      .then(({ data: d, error }) => {
        if (error || !d) { setLoading(false); return; }
        const cliente = Array.isArray(d.clientes) ? d.clientes[0] : d.clientes;
        setData({
          token: d.token,
          validade_ate: d.validade_ate,
          pacotes: (Array.isArray(d.proposta_pacotes) ? d.proposta_pacotes : []) as Pacote[],
          cliente: cliente || {},
        });
        setLoading(false);
      });
  }, [token]);

  const TOTAL_SLIDES = 8;
  const prev = useCallback(() => setSlide(s => Math.max(0, s - 1)), []);
  const next = useCallback(() => setSlide(s => Math.min(TOTAL_SLIDES - 1, s + 1)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: GOLD, borderTopColor: "transparent" }} />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
      <div className="text-center text-white">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-xl font-bold">Apresentação não encontrada</p>
      </div>
    </div>
  );

  const slides = [
    <Slide1Capa    key={0} data={data} />,
    <Slide2Negocio key={1} data={data} />,
    <Slide3Dores   key={2} data={data} />,
    <Slide4Solucoes key={3} data={data} />,
    <Slide5ROI     key={4} data={data} />,
    <Slide6Pacotes key={5} data={data} />,
    <Slide7ProximosPassos key={6} data={data} />,
    <Slide8CTA     key={7} data={data} />,
  ];

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: NAVY }}>
      {/* Slide area */}
      <div className="w-full h-full">
        {slides[slide]}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <button
          onClick={prev}
          disabled={slide === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="rounded-full transition-all"
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                background: i === slide ? GOLD : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={slide === TOTAL_SLIDES - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
        >
          →
        </button>
      </div>

      {/* Slide counter */}
      <div className="fixed top-4 right-4 text-xs z-50 px-3 py-1.5 rounded-full"
        style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.6)" }}>
        {slide + 1} / {TOTAL_SLIDES}
      </div>

      {/* Close / voltar */}
      <Link
        href={`/proposta/${token}`}
        className="fixed top-4 left-4 z-50 text-xs px-3 py-1.5 rounded-full transition-all"
        style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
      >
        ← Proposta
      </Link>
    </div>
  );
}
