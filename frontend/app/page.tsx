"use client";

import Link from "next/link";
import { CarouselTrack, SocialLinks } from "@/components/layout/TechCarousel";

// ─── Design tokens ─────────────────────────────────────────────────────────────
// Copy por Ladeirinha — agente copywriter estilo Leandro Ladeira

const NAVY = "#0f2044";
const GOLD = "#c9a84c";

// ─── Dados dos produtos ────────────────────────────────────────────────────────

const CURSOS = [
  {
    tag: "Disponível agora",
    tagColor: "#34d399",
    nome: "LEAP BUILD",
    tagline: "Do problema ao sistema",
    desc: "Você constrói um sistema real de gestão de frota corporativa — do zero ao deploy — em 22 aulas. Sem programar uma linha de código.",
    preco: "R$498",
    precoFull: "R$998 depois",
    cta: "Entrar no BUILD",
    href: "/cliente",
    accent: GOLD,
    features: ["22 aulas + 4 bônus", "Case real de frota corporativa", "Método LEAP fase a fase", "Acesso vitalício"],
  },
  {
    tag: "Em breve",
    tagColor: "#60a5fa",
    nome: "LEAP RUN",
    tagline: "Produtividade no modo gestor",
    desc: "Seu assistente pessoal de IA configurado para a rotina do gestor — agenda, briefings, follow-ups, pesquisas e decisões.",
    preco: "R$498",
    precoFull: "R$998 depois",
    cta: "Garantir preço zero",
    href: "/cliente",
    accent: "#60a5fa",
    features: ["Assistente IA personalizado", "Rotina de gestor automatizada", "Sem ferramentas genéricas", "Acesso prioritário BUILD"],
  },
  {
    tag: "Em breve",
    tagColor: "#60a5fa",
    nome: "LEAP SCALE",
    tagline: "Vendas no piloto automático",
    desc: "Sistema completo de atendimento, qualificação de leads e follow-up automatizado. O negócio vendendo 24/7 sem depender de você.",
    preco: "R$498",
    precoFull: "R$998 depois",
    cta: "Garantir preço zero",
    href: "/cliente",
    accent: "#34d399",
    features: ["Atendimento IA 24/7", "SDR automatizado", "Follow-up inteligente", "Acesso prioritário BUILD"],
  },
];

const DORES = [
  "Você já testou ChatGPT, Copilot, n8n, Zapier, Make… e ainda não automatizou nada de verdade.",
  "Você assiste vídeos sobre IA no YouTube mas sua operação continua igual.",
  "Você sente que seus concorrentes estão avançando enquanto você ainda está no 'vou começar semana que vem'.",
  "Você sabe que IA pode transformar seu negócio mas não sabe por onde começar.",
];

const RESULTADOS = [
  { numero: "60%", desc: "de redução em tarefas operacionais nos primeiros 30 dias" },
  { numero: "10", desc: "dias para montar o primeiro sistema funcionando" },
  { numero: "24/7", desc: "sua operação trabalhando mesmo quando você está dormindo" },
  { numero: "0", desc: "linhas de código necessárias para aplicar o Método LEAP" },
];

// ─── Componente ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ background: NAVY, fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen">

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: "rgba(15,32,68,0.95)", borderColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
              🤖
            </div>
            <span className="font-bold text-white text-sm" style={{ fontFamily: "'General Sans', sans-serif" }}>
              IA com Peterson
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/member/login"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Área de membros →
            </Link>
            <Link href="/cliente"
              className="text-sm font-bold px-5 py-2 rounded-lg transition-all duration-200"
              style={{ background: GOLD, color: NAVY }}
            >
              Quero entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        {/* Gradientes de fundo */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: GOLD }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "#1a4fd6" }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: GOLD }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            LEAP BUILD aberto · Turma Zero · R$498
          </div>

          <h1 className="font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05 }}>
            Você usa IA.<br />
            Enquanto seu concorrente<br />
            <span style={{ color: GOLD }}>a comanda.</span>
          </h1>

          <p className="text-lg font-bold mb-6 max-w-2xl mx-auto"
            style={{ color: GOLD, fontFamily: "'General Sans', sans-serif", letterSpacing: "-0.01em" }}>
            Torne-se um Gestor de IA com o Método LEAP e saia da plateia de uma vez por todas.
          </p>

          <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Libre Baskerville', serif", fontStyle: "italic" }}>
            O Método LEAP transforma você no profissional que o mercado está buscando: quem não só usa IA, mas lidera, automatiza e faz o negócio escalar com ela. Sem programar uma linha de código.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cliente"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105"
              style={{ background: GOLD, color: NAVY, boxShadow: `0 0 40px rgba(201,168,76,0.3)` }}>
              Dê o salto agora →
            </Link>
            <Link href="/member/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}>
              Já sou membro
            </Link>
          </div>

          <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.25)" }}>
            LEAP BUILD · 22 aulas · Acesso vitalício · Garantia de 7 dias
          </p>
        </div>
      </section>

      {/* ── NÚMEROS ─────────────────────────────────────────────────────────── */}
      <section className="border-y py-12 px-6" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {RESULTADOS.map((r) => (
            <div key={r.numero} className="text-center">
              <div className="font-bold mb-1"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: GOLD, fontFamily: "'General Sans', sans-serif" }}>
                {r.numero}
              </div>
              <div className="w-8 h-0.5 mx-auto my-2 rounded-full" style={{ background: GOLD }} />
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DOR / AGITAÇÃO ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
            Seja honesto
          </p>
          <h2 className="font-bold text-white mb-10"
            style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1 }}>
            Você reconhece<br />
            <span style={{ color: GOLD }}>algum destes cenários?</span>
          </h2>

          <div className="space-y-4 mb-10">
            {DORES.map((dor, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: GOLD }}>→</span>
                <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{dor}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl border-l-4" style={{ background: "rgba(201,168,76,0.06)", borderColor: GOLD }}>
            <p className="font-bold text-white text-lg mb-2">
              O problema não é falta de informação. É falta de método.
            </p>
            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Você tem ferramentas. O que falta é saber como usá-las de forma integrada, estratégica e lucrativa — e é exatamente isso que o <strong className="text-white">Método LEAP</strong> ensina.
            </p>
          </div>
        </div>
      </section>

      {/* ── MÉTODO LEAP ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>A solução</p>
            <h2 className="font-bold text-white"
              style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1 }}>
              O Gestor de IA não usa mais ferramentas.<br />
              <span style={{ color: GOLD }}>Ele as comanda.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-3 mb-12">
            {[
              { letra: "L", titulo: "Liderar", desc: "Estratégia antes da ferramenta. O que automatizar vs. o que manter humano.", cor: GOLD },
              { letra: "E", titulo: "Escalar", desc: "O ecossistema certo — ferramentas que conversam entre si sem você tocar em código.", cor: "#60a5fa" },
              { letra: "A", titulo: "Automatizar", desc: "Agentes de IA trabalhando 24/7 — conteúdo, atendimento e vendas no automático.", cor: "#34d399" },
              { letra: "P", titulo: "Performar", desc: "IA sem métrica é brinquedo. Dashboard, otimização e monetização real.", cor: "#a78bfa" },
            ].map((fase) => (
              <div key={fase.letra}
                className="p-6 rounded-2xl border cursor-default transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                <div className="text-4xl font-bold mb-3" style={{ color: fase.cor, fontFamily: "'General Sans', sans-serif" }}>
                  {fase.letra}
                </div>
                <div className="font-bold text-white text-lg mb-2">{fase.titulo}</div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{fase.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center p-8 rounded-2xl"
            style={{ background: `linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(15,32,68,0) 100%)`, border: `1px solid rgba(201,168,76,0.2)` }}>
            <p className="text-lg font-bold text-white mb-2">
              Peterson Oliveira criou o Método LEAP e formou uma nova categoria profissional:
            </p>
            <p className="text-2xl font-bold" style={{ color: GOLD, fontFamily: "'General Sans', sans-serif" }}>
              O Gestor de IA.
            </p>
            <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              O profissional que lidera, escala, automatiza e performa com inteligência artificial — sem precisar saber programar.
            </p>
          </div>
        </div>
      </section>

      {/* ── TRILOGIA ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>Os produtos</p>
            <h2 className="font-bold text-white"
              style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1 }}>
              Três cursos.<br />
              <span style={{ color: GOLD }}>Uma jornada completa.</span>
            </h2>
            <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.4)" }}>
              Quem entrar no BUILD agora garante o preço turma zero nos três.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {CURSOS.map((curso) => (
              <div key={curso.nome} className="rounded-2xl overflow-hidden border flex flex-col"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                {/* Barra colorida */}
                <div className="h-1" style={{ background: curso.accent }} />

                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md"
                      style={{ background: `${curso.tagColor}18`, color: curso.tagColor }}>
                      {curso.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xl mb-1"
                    style={{ fontFamily: "'General Sans', sans-serif" }}>
                    {curso.nome}
                  </h3>
                  <p className="text-xs mb-4 font-medium" style={{ color: curso.accent }}>
                    {curso.tagline}
                  </p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {curso.desc}
                  </p>

                  <ul className="space-y-1.5">
                    {curso.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                        <span style={{ color: curso.accent }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-white"
                        style={{ fontFamily: "'General Sans', sans-serif" }}>
                        {curso.preco}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Turma zero · {curso.precoFull}
                      </p>
                    </div>
                  </div>
                  <Link href={curso.href}
                    className="w-full flex items-center justify-center py-3 rounded-xl font-bold text-sm transition-all duration-200"
                    style={{ background: `${curso.accent}20`, color: curso.accent, border: `1px solid ${curso.accent}40` }}>
                    {curso.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bundle */}
          <div className="p-6 md:p-8 rounded-2xl border-l-4 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: "rgba(124,58,237,0.08)", borderColor: "#7c3aed" }}>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Bundle · Leve 3 Pague 2</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2"
                style={{ fontFamily: "'General Sans', sans-serif" }}>
                Trilogia LEAP Completa
              </h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Os três cursos pelo preço de dois. Quem entra no BUILD agora garante esse preço quando os outros lançarem.
              </p>
            </div>
            <div className="text-center md:text-right flex-shrink-0">
              <p className="text-sm line-through" style={{ color: "rgba(255,255,255,0.25)" }}>3 × R$498 = R$1.494</p>
              <p className="text-5xl font-bold" style={{ color: "#a78bfa", fontFamily: "'General Sans', sans-serif" }}>R$998</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>bundle turma zero · R$1.998 depois</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FGI ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "rgba(59,130,246,0.04)", borderTop: "1px solid rgba(59,130,246,0.1)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="md:grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#60a5fa" }}>
                Formação Completa · Junho/2025
              </p>
              <h2 className="font-bold text-white mb-4"
                style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1.1 }}>
                FGI — Formação Gestores de IA
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                A imersão completa que cria a nova categoria profissional. Mais do que um curso — é uma certificação em uma profissão que o mercado está pedindo agora.
              </p>
              <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
                Quem faz o LEAP BUILD tem acesso prioritário à FGI — e os cases que você construiu no BUILD viram portfólio na imersão.
              </p>
              <Link href="/cliente"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200"
                style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}>
                Quero acesso prioritário →
              </Link>
            </div>
            <div className="mt-10 md:mt-0 grid grid-cols-1 gap-3">
              {[
                { plan: "FGI — Essencial", price: "R$1.498", features: ["Imersão ao vivo", "Certificado de Gestor de IA", "Material exclusivo", "Comunidade privada"] },
                { plan: "FGI — Premium", price: "R$2.498", features: ["Tudo do Essencial", "Mentoria em grupo", "Acesso lifetime às gravações", "Bônus exclusivos"] },
              ].map((p) => (
                <div key={p.plan} className="p-5 rounded-xl border"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(59,130,246,0.2)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white text-sm">{p.plan}</span>
                    <span className="font-bold text-xl" style={{ color: "#60a5fa", fontFamily: "'General Sans', sans-serif" }}>{p.price}</span>
                  </div>
                  <ul className="space-y-1">
                    {p.features.map((f) => (
                      <li key={f} className="text-xs flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <span style={{ color: "#60a5fa" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSULTORIA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "rgba(201,168,76,0.04)",
              borderLeft: "4px solid #c9a84c",
              border: "1px solid rgba(201,168,76,0.15)",
            }}>

            {/* Badge vagas limitadas */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Vagas limitadas
            </span>

            <div className="md:grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD, letterSpacing: "0.2em" }}>
                  Consultoria
                </p>
                <h2 className="font-bold text-white mb-4"
                  style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", lineHeight: 1.1 }}>
                  Seu negócio precisa de um sistema feito para ele.
                </h2>
                <p className="text-base mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Nem todo problema cabe dentro de um curso. Alguns precisam de um projeto.
                </p>
                <p className="text-base leading-loose mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Você tem uma operação com gargalos específicos. Um fluxo que precisa de IA customizada. Um sistema que não existe ainda. Peterson mergulha no seu negócio, mapeia os pontos de atrito e constrói a solução, sem deixar você para trás no processo.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Diagnóstico completo da operação",
                    "Mapeamento de automações prioritárias",
                    "Construção de agentes e sistemas sob medida",
                    "Acompanhamento até o sistema estar rodando",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      <span style={{ color: GOLD }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href="/cliente"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
                  style={{ background: GOLD, color: NAVY }}>
                  Quero um projeto →
                </Link>
              </div>

              <div className="mt-10 md:mt-0">
                <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="font-bold text-white mb-4 text-sm">O que você recebe:</p>
                  {[
                    { num: "01", titulo: "Discovery call", desc: "Peterson entende sua operação em profundidade antes de propor qualquer coisa" },
                    { num: "02", titulo: "Proposta sob medida", desc: "Escopo, prazo e investimento definidos juntos, sem surpresas" },
                    { num: "03", titulo: "Execução acompanhada", desc: "Você participa de cada decisão ao longo do desenvolvimento" },
                    { num: "04", titulo: "Entrega e treinamento", desc: "Sistema rodando e equipe treinada para manter tudo funcionando" },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-4 mb-5 last:mb-0">
                      <span className="font-bold text-xs flex-shrink-0 mt-0.5" style={{ color: GOLD }}>{step.num}</span>
                      <div>
                        <p className="font-bold text-white text-sm mb-0.5">{step.titulo}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4 text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Peterson atende poucos clientes por vez para garantir profundidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOBRE PETERSON ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Quem está por trás</p>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
            style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}>
            🤖
          </div>
          <h2 className="font-bold text-white mb-4"
            style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
            Peterson Oliveira
          </h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
            Criou o Método LEAP depois de perceber que o mercado estava cheio de ferramentas de IA e sem nenhum método para usá-las de forma estratégica. Construiu o OCTUS — uma plataforma de criação de conteúdo com IA — e usa tudo o que ensina no próprio negócio.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Não é guru. É quem faz, documenta e ensina o que funciona na prática — com sistema rodando, clientes reais e resultados mensuráveis.
          </p>
        </div>
      </section>

      {/* ── GARANTIA ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">🛡️</div>
          <h3 className="font-bold text-white text-2xl mb-3" style={{ fontFamily: "'General Sans', sans-serif" }}>
            Garantia incondicional de 7 dias
          </h3>
          <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Se você entrar no LEAP BUILD e em 7 dias sentir que não era para você — devolvo 100% do valor sem perguntas. O risco é zero. O arrependimento de não começar custa muito mais.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ background: `radial-gradient(ellipse at center, ${GOLD} 0%, transparent 70%)` }} />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: GOLD }}>
            A decisão é agora
          </p>
          <h2 className="font-bold text-white mb-4"
            style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.05 }}>
            O salto começa aqui.
          </h2>
          <p className="text-xl mb-10" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Libre Baskerville', serif", fontStyle: "italic" }}>
            R$498 hoje. R$998 depois. O preço de turma zero nunca volta.
          </p>

          <Link href="/cliente"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-200 hover:scale-105"
            style={{ background: GOLD, color: NAVY, boxShadow: `0 0 60px rgba(201,168,76,0.35)` }}>
            Entrar no LEAP BUILD →
          </Link>

          <p className="text-xs mt-5" style={{ color: "rgba(255,255,255,0.25)" }}>
            Turma zero · R$498 · 22 aulas + 4 bônus · Acesso vitalício · Garantia de 7 dias
          </p>

          <div className="mt-10 flex items-center justify-center gap-2">
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Já tem acesso?</span>
            <Link href="/member/login" className="text-sm font-medium underline" style={{ color: "rgba(255,255,255,0.4)" }}>
              Entrar na área de membros
            </Link>
          </div>
        </div>
      </section>

      {/* ── TECH CAROUSEL ───────────────────────────────────────────────────── */}
      <section className="py-16 overflow-hidden border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-2xl mx-auto text-center mb-10 px-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            Tecnologia de ponta
          </p>
          <h3 className="text-2xl font-bold text-white"
            style={{ fontFamily: "'General Sans', sans-serif" }}>
            Construído com as melhores ferramentas do mundo
          </h3>
        </div>
        <CarouselTrack />
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <SocialLinks />
          <div className="flex items-center gap-6 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            <Link href="/cliente" className="hover:text-white transition-colors">Formulário</Link>
            <Link href="/member/login" className="hover:text-white transition-colors">Admin</Link>
            <span>@iacompeterson · Método LEAP · {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
