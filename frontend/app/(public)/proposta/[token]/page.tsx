"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProposta, aceitarProposta, type Proposta, type PacoteProposta } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { TechCarousel, SocialLinks } from "@/components/layout/TechCarousel";

// ─── Design tokens ────────────────────────────────────────────────────────────

const NAVY = "#0f2044";
const GOLD  = "#c9a84c";

// ─── Mapeamentos Antes / Depois ───────────────────────────────────────────────

const DORES_ANTES: Record<string, string> = {
  sem_followup: "Clientes perdidos por falta de follow-up",
  sem_registro: "Equipe não registra o que acontece em cada atendimento",
  atendimento_lento: "Atendimento lento fazendo perder vendas",
  sem_visibilidade_funil: "Funil comercial invisível, sem controle",
  tarefas_repetitivas: "Tempo desperdiçado em tarefas que se repetem todo dia",
  escala_sem_contratar: "Impossível crescer sem contratar mais gente",
  sem_metricas: "Decisões tomadas no achômetro, sem dados",
  vendas_desorganizadas: "Processo de vendas bagunçado e imprevisível",
};

const SOLUCOES_DEPOIS: Record<string, string> = {
  sistema: "Sistema personalizado gerenciando tudo automaticamente",
  atendimento: "Bot de IA atendendo e qualificando 24/7 no WhatsApp",
  assistente: "Assistente de IA treinado no seu negócio",
  site_lp: "Presença digital que converte visitante em cliente",
  plataforma: "Plataforma completa com área de membros e gestão",
};

// ─── Página principal ─────────────────────────────────────────────────────────

export default function PropostaPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [nomeAssinante, setNomeAssinante] = useState("");
  const [aceiteConfirmado, setAceiteConfirmado] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProposta(token)
      .then(setProposta)
      .catch(() => toast.error("Proposta não encontrada ou expirada."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAceitar = async () => {
    if (!selected || !nomeAssinante || !aceiteConfirmado) {
      toast.error("Selecione um pacote, informe seu nome e confirme o aceite.");
      return;
    }
    setSubmitting(true);
    try {
      await aceitarProposta(token, selected, nomeAssinante);
      router.push(`/proposta/${token}/aceita`);
    } catch {
      toast.error("Erro ao registrar aceite. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Estados de carregamento / erro ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: GOLD, borderTopColor: "transparent" }} />
          <p className="text-slate-500">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (!proposta) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
        <div className="text-center max-w-sm px-6">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Proposta não encontrada</h2>
          <p className="text-slate-500">Este link pode ter expirado ou sido desativado. Entre em contato com Peterson.</p>
        </div>
      </div>
    );
  }

  if (proposta.status === "aceita") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
        <div className="text-center max-w-sm px-6">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Proposta já aceita!</h2>
          <p className="text-slate-500">Esta proposta já foi aceita. Em breve entraremos em contato.</p>
        </div>
      </div>
    );
  }

  const firstName = proposta.cliente.nome_contato.split(" ")[0];
  const pacoteSelecionado = proposta.pacotes.find(p => p.id === selected);

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>

      {/* ── 1. HEADER ── */}
      <header style={{ background: NAVY }} className="py-5 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
            🤖
          </div>
          <div>
            <p className="text-white font-bold" style={{ fontFamily: "'General Sans', sans-serif" }}>
              IA com Peterson
            </p>
            <p className="text-xs font-medium" style={{ color: GOLD }}>Proposta Comercial</p>
          </div>
        </div>
      </header>

      {/* ── 2. HERO ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-step-in">
          <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: GOLD }}>
            Proposta exclusiva
          </p>
          <h1 className="text-5xl font-bold mb-5" style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
            Olá, {firstName}!
          </h1>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed">
            Preparei esta proposta especialmente para a{" "}
            <strong className="text-slate-800">{proposta.cliente.nome_empresa || "sua empresa"}</strong>.
          </p>

          {/* Badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
            {proposta.validade_ate && (
              <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200
                               text-amber-700 text-sm px-5 py-2.5 rounded-full font-medium">
                ⏰ Válida até {new Date(proposta.validade_ate).toLocaleDateString("pt-BR")}
              </span>
            )}
            <Link
              href={`/proposta/${proposta.token}/apresentacao`}
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full font-semibold transition-all hover:opacity-90"
              style={{ background: NAVY, color: "white" }}
            >
              📊 Ver apresentação
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { icon: "🛡️", text: "30 dias de suporte incluídos" },
              { icon: "✅", text: "Aceite digital com validade legal" },
              { icon: "🚀", text: "Início imediato após aceite" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-500">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2b. ANTES / DEPOIS ── */}
      {(() => {
        const doresCliente = proposta.cliente.dores_b2b || [];
        const tiposCliente: string[] = proposta.cliente.tipos_solucao || (proposta.cliente.tipo_solucao ? proposta.cliente.tipo_solucao.split(", ") : []);

        const itensAntes = doresCliente.length > 0
          ? doresCliente.map((d: string) => DORES_ANTES[d] || d)
          : ["Processos manuais consumindo tempo da equipe", "Falta de automação no atendimento ao cliente", "Dificuldade para escalar sem aumentar custos", "Decisões tomadas sem dados confiáveis"];

        const itensDepois = tiposCliente.length > 0
          ? tiposCliente.map((t: string) => SOLUCOES_DEPOIS[t] || t)
          : ["Sistema automatizado funcionando 24/7", "Equipe focada em atividades estratégicas", "Escala sem necessidade de contratar mais", "Dados e métricas em tempo real"];

        return (
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                A transformação
              </p>
              <h2 className="text-center text-2xl font-bold mb-10" style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
                O que muda com esta solução
              </h2>

              <div className="relative grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
                {/* Coluna ANTES */}
                <div className="p-6 bg-slate-50">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-sm text-red-500 font-bold">✗</span>
                    <p className="font-bold text-slate-700">Situação atual</p>
                  </div>
                  <ul className="space-y-3">
                    {itensAntes.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">✗</span>
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divisor visual central */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center text-lg font-bold shadow-md" style={{ borderColor: GOLD, color: GOLD }}>→</div>
                </div>

                {/* Coluna DEPOIS */}
                <div className="p-6" style={{ background: "rgba(15,32,68,0.03)" }}>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "rgba(201,168,76,0.15)", color: GOLD }}>✓</span>
                    <p className="font-bold" style={{ color: NAVY }}>Com a solução</p>
                  </div>
                  <ul className="space-y-3">
                    {itensDepois.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: GOLD }}>✓</span>
                        <span className="text-sm text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── 3. PACKAGES ── */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            Investimento
          </p>
          <h2 className="text-center text-3xl font-bold mb-12" style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
            Escolha o plano ideal para você
          </h2>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {proposta.pacotes.map((pacote) => (
              <PacoteCard
                key={pacote.id}
                pacote={pacote}
                selected={selected === pacote.id}
                onSelect={() => setSelected(pacote.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. COMPARISON TABLE ── */}
      <ComparisonTable
        pacotes={proposta.pacotes}
        selected={selected}
        onSelect={setSelected}
      />

      {/* ── 5. TECH CAROUSEL ── */}
      <TechCarousel />

      {/* ── 6. ACCEPTANCE FORM ── */}
      {selected && (
        <section className="py-20 px-6">
          <div className="max-w-xl mx-auto animate-step-in">
            <div className="bg-white rounded-2xl border-2 p-8" style={{ borderColor: NAVY }}>
              <h3 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>
                Confirmar aceite
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                Você está prestes a assinar digitalmente esta proposta.
              </p>

              {/* Resumo do plano */}
              <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(15,32,68,0.04)", border: `1px solid rgba(15,32,68,0.1)` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>
                  Plano selecionado
                </p>
                <p className="text-lg font-bold" style={{ color: NAVY }}>
                  {pacoteSelecionado?.nome}
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
                  R$ {pacoteSelecionado?.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Nome */}
              <div className="mb-5">
                <label className="block text-base font-medium text-slate-700 mb-1.5">
                  Seu nome completo <span className="text-slate-400 font-normal">(assinatura digital)</span>
                </label>
                <input
                  className="input-field"
                  placeholder="Digite seu nome completo"
                  value={nomeAssinante}
                  onChange={(e) => setNomeAssinante(e.target.value)}
                />
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer mb-7">
                <input
                  type="checkbox"
                  checked={aceiteConfirmado}
                  onChange={(e) => setAceiteConfirmado(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded"
                  style={{ accentColor: NAVY }}
                />
                <span className="text-base text-slate-600 leading-relaxed">
                  Declaro que li e aceito os termos desta proposta, incluindo escopo, valores e condições.
                  Estou ciente que este aceite tem validade legal.
                </span>
              </label>

              <button
                onClick={handleAceitar}
                disabled={submitting || !nomeAssinante || !aceiteConfirmado}
                className="w-full py-4 rounded-xl text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: NAVY, color: "white" }}
              >
                {submitting ? "Registrando aceite..." : "✅ Aceitar e assinar proposta"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="py-12 text-center px-6" style={{ background: NAVY }}>
        <SocialLinks className="mb-4" />
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Dúvidas? Fale com Peterson pelo WhatsApp antes de assinar.
        </p>
      </footer>

    </div>
  );
}

// ─── PacoteCard ───────────────────────────────────────────────────────────────

function PacoteCard({ pacote, selected, onSelect }: {
  pacote: PacoteProposta;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative text-left w-full rounded-2xl transition-all duration-300"
      style={{
        border: `2px solid ${selected ? NAVY : pacote.destaque ? GOLD : "#e2e8f0"}`,
        background: selected ? NAVY : pacote.destaque ? "#fffbf0" : "white",
        boxShadow: selected
          ? "0 20px 60px rgba(15,32,68,0.25)"
          : pacote.destaque
          ? "0 8px 30px rgba(201,168,76,0.2)"
          : "0 1px 3px rgba(0,0,0,0.06)",
        transform: pacote.destaque && !selected ? "scale(1.03)" : "scale(1)",
      }}
    >
      {pacote.destaque && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap"
          style={{ background: GOLD, color: NAVY }}
        >
          ⭐ Mais escolhido
        </div>
      )}

      <div className="p-7">
        {/* Nome */}
        <p className="text-lg font-bold mb-1" style={{ color: selected ? "white" : NAVY }}>
          {pacote.nome}
        </p>

        {/* Descrição */}
        {pacote.descricao && (
          <p className="text-sm mb-5 leading-relaxed"
            style={{ color: selected ? "rgba(255,255,255,0.65)" : "#64748b" }}>
            {pacote.descricao}
          </p>
        )}

        {/* Preço */}
        <p className="text-3xl font-bold mb-1"
          style={{ color: selected ? GOLD : NAVY, fontFamily: "'General Sans', sans-serif" }}>
          R$ {pacote.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm mb-6"
          style={{ color: selected ? "rgba(255,255,255,0.45)" : "#94a3b8" }}>
          Prazo: {pacote.prazo_dias} dias úteis
        </p>

        {/* Divisor */}
        <div className="h-px mb-6"
          style={{ background: selected ? "rgba(255,255,255,0.12)" : "#f1f5f9" }} />

        {/* Itens */}
        <ul className="space-y-3 mb-7">
          {pacote.itens.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-base">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                style={{
                  background: selected ? "rgba(201,168,76,0.2)" : "rgba(15,32,68,0.07)",
                  color: selected ? GOLD : NAVY,
                }}
              >✓</span>
              <span style={{ color: selected ? "rgba(255,255,255,0.85)" : "#334155" }}>
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          className="w-full py-3 rounded-xl text-base font-bold text-center"
          style={{
            background: selected ? GOLD : pacote.destaque ? NAVY : "#f1f5f9",
            color: selected ? NAVY : pacote.destaque ? "white" : "#64748b",
          }}
        >
          {selected ? "✓ Selecionado" : "Selecionar plano"}
        </div>
      </div>
    </button>
  );
}

// ─── ComparisonTable ──────────────────────────────────────────────────────────

function ComparisonTable({ pacotes, selected, onSelect }: {
  pacotes: PacoteProposta[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  if (pacotes.length === 0) return null;

  // Todos os itens únicos, ordenados do mais comum para o mais exclusivo
  const allItems = Array.from(new Set(pacotes.flatMap(p => p.itens)));
  const sorted = [...allItems].sort((a, b) => {
    const ca = pacotes.filter(p => p.itens.includes(a)).length;
    const cb = pacotes.filter(p => p.itens.includes(b)).length;
    return cb - ca;
  });

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
          Detalhes
        </p>
        <h2 className="text-center text-3xl font-bold mb-12"
          style={{ color: NAVY, fontFamily: "'General Sans', sans-serif" }}>
          Comparativo completo
        </h2>

        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: NAVY }}>
                <th className="text-left px-6 py-5 text-sm font-semibold w-2/5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Recurso
                </th>
                {pacotes.map(p => (
                  <th key={p.id} className="text-center px-5 py-5 text-sm font-bold text-white">
                    {p.nome}
                    {p.destaque && <span className="ml-1.5 text-xs" style={{ color: GOLD }}>★</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, i) => (
                <tr key={item} style={{ background: i % 2 === 0 ? "white" : "#f8fafc" }}>
                  <td className="px-6 py-4 text-sm text-slate-600 border-t border-slate-100">
                    {item}
                  </td>
                  {pacotes.map(p => (
                    <td key={p.id} className="px-5 py-4 text-center border-t border-slate-100">
                      {p.itens.includes(item)
                        ? <span className="text-xl font-bold" style={{ color: GOLD }}>✓</span>
                        : <span className="text-slate-200 text-xl">—</span>}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Linha de preço */}
              <tr style={{ background: "#f0f4f8", borderTop: `2px solid #e2e8f0` }}>
                <td className="px-6 py-5 text-base font-bold" style={{ color: NAVY }}>
                  Investimento total
                </td>
                {pacotes.map(p => (
                  <td key={p.id} className="px-5 py-5 text-center">
                    <span className="text-base font-bold" style={{ color: NAVY }}>
                      R$ {p.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Linha de CTA */}
              <tr style={{ background: NAVY }}>
                <td className="px-6 py-5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Selecionar plano
                </td>
                {pacotes.map(p => (
                  <td key={p.id} className="px-5 py-5 text-center">
                    <button
                      onClick={() => onSelect(p.id)}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: selected === p.id ? GOLD : "rgba(255,255,255,0.1)",
                        color: selected === p.id ? NAVY : "white",
                        border: `1px solid ${selected === p.id ? GOLD : "rgba(255,255,255,0.2)"}`,
                      }}
                    >
                      {selected === p.id ? "✓ Escolhido" : "Escolher"}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// TechCarousel is now imported from @/components/layout/TechCarousel
