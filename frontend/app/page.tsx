"use client";

import Link from "next/link";
import { useState } from "react";
import { CarouselTrack, SocialLinks } from "@/components/layout/TechCarousel";

// ─── Design tokens ─────────────────────────────────────────────────────────────
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
  { numero: "10",  desc: "dias para montar o primeiro sistema funcionando" },
  { numero: "24/7", desc: "sua operação trabalhando mesmo quando você está dormindo" },
  { numero: "0",   desc: "linhas de código necessárias para aplicar o Método LEAP" },
];

const SAAS_CASES = [
  { nome: "IAra",       categoria: "Assistente de IA",                          stack: ["Claude", "Next.js"],          accent: GOLD,      emoji: "🤖" },
  { nome: "OCTUS",      categoria: "Criação de conteúdo com IA",                stack: ["Claude Code", "Supabase"],    accent: "#60a5fa", emoji: "✍️" },
  { nome: "Lead Radar", categoria: "Gestão de desempenho para pequenas equipes", stack: ["IA", "Automação"],           accent: "#34d399", emoji: "📡" },
  { nome: "Black Table",categoria: "Reserva de mesas e descontos",               stack: ["IA", "Next.js"],             accent: "#a78bfa", emoji: "🍽️" },
  { nome: "SafeNow",    categoria: "ERP para controle de EPIs",                  stack: ["IA", "Supabase"],            accent: "#f97316", emoji: "🦺" },
];

const FAQ_ITEMS = [
  { q: "Preciso saber programar?", a: "Não. O Método LEAP foi criado especificamente para gestores, não desenvolvedores. Você vai construir sistemas reais de IA sem escrever uma única linha de código." },
  { q: "Funciona para o meu nicho?", a: "Sim. Qualquer operação com processos repetitivos se beneficia de IA. Já foram construídos sistemas para varejo, saúde, advocacia, educação, logística e muito mais." },
  { q: "Quanto tempo por semana preciso dedicar?", a: "De 2 a 4 horas por semana durante as primeiras 4 semanas é suficiente para entregar o primeiro sistema funcionando." },
  { q: "Qual a diferença entre LEAP e FGI?", a: "LEAP é o método prático em formato de cursos online — você aprende construindo. FGI é a imersão ao vivo com certificado de Gestor de IA, para quem quer ir além e ter formação reconhecida." },
  { q: "E se eu não gostar?", a: "Garantia incondicional de 7 dias. Se em qualquer momento dentro dos primeiros 7 dias você sentir que não era o que esperava, devolvo 100% do valor sem perguntas e sem burocracia." },
  { q: "Posso parcelar?", a: "Sim, em até 12x no cartão de crédito. O valor de R$498 fica em parcelas de menos de R$42/mês — menos que uma assinatura de streaming." },
];

// ─── Divisor dourado ──────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 30%, rgba(201,168,76,0.5) 50%, rgba(201,168,76,0.3) 70%, transparent 100%)" }} />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function LandingPage() {
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

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

          {/* Links de âncora — ocultos em mobile */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: "Método", href: "#metodo" },
              { label: "Cursos", href: "#cursos" },
              { label: "Consultoria", href: "#consultoria" },
              { label: "Sobre", href: "#sobre" },
            ].map(item => (
              <a key={item.href} href={item.href}
                className="text-sm transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.45)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/member/login"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              Área de membros →
            </Link>
            <Link href="/cliente"
              className="text-sm font-bold px-5 py-2 rounded-lg transition-all duration-200"
              style={{ background: GOLD, color: NAVY }}>
              Quero entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: GOLD }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "#1a4fd6" }} />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 60%, ${GOLD} 0%, transparent 65%)` }} />

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
            style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, textShadow: "0 2px 40px rgba(0,0,0,0.3)" }}>
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
              style={{ background: GOLD, color: NAVY, boxShadow: `0 0 40px rgba(201,168,76,0.3)` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 60px rgba(201,168,76,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(201,168,76,0.3)"; }}>
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

      <GoldDivider />

      {/* ── DOR / AGITAÇÃO ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}>
            Seja honesto
          </p>
          <h2 className="font-bold text-white mb-10"
            style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1 }}>
            Você reconhece<br />
            <span style={{ color: GOLD }}>algum destes cenários?</span>
          </h2>

          <div className="space-y-4 mb-10">
            {DORES.map((dor, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
                <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: GOLD }}>→</span>
                <p className="text-base leading-loose" style={{ color: "rgba(255,255,255,0.65)" }}>{dor}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl border-l-4" style={{ background: "rgba(201,168,76,0.06)", borderColor: GOLD }}>
            <p className="font-bold text-white text-lg mb-2">
              O problema não é falta de informação. É falta de método.
            </p>
            <p className="leading-loose" style={{ color: "rgba(255,255,255,0.5)" }}>
              Você tem ferramentas. O que falta é saber como usá-las de forma integrada, estratégica e lucrativa — e é exatamente isso que o <strong className="text-white">Método LEAP</strong> ensina.
            </p>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── MÉTODO LEAP ─────────────────────────────────────────────────────── */}
      <section id="metodo" className="py-20 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD, letterSpacing: "0.2em" }}>A solução</p>
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
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
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

      <GoldDivider />

      {/* ── TRILOGIA ────────────────────────────────────────────────────────── */}
      <section id="cursos" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD, letterSpacing: "0.2em" }}>Os produtos</p>
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
                <div className="h-1" style={{ background: curso.accent }} />
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md"
                      style={{ background: `${curso.tagColor}18`, color: curso.tagColor }}>
                      {curso.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-xl mb-1" style={{ fontFamily: "'General Sans', sans-serif" }}>
                    {curso.nome}
                  </h3>
                  <p className="text-xs mb-4 font-medium" style={{ color: curso.accent }}>{curso.tagline}</p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>{curso.desc}</p>
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
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: "'General Sans', sans-serif" }}>{curso.preco}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Turma zero · {curso.precoFull}</p>
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
              <h3 className="text-2xl font-bold text-white mt-1 mb-2" style={{ fontFamily: "'General Sans', sans-serif" }}>Trilogia LEAP Completa</h3>
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

      <GoldDivider />

      {/* ── FGI ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "rgba(59,130,246,0.04)", borderTop: "1px solid rgba(59,130,246,0.1)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="md:grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#60a5fa", letterSpacing: "0.2em" }}>
                Formação Completa · Junho/2025
              </p>
              <h2 className="font-bold text-white mb-4"
                style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: 1.1 }}>
                FGI — Formação Gestores de IA
              </h2>
              <p className="text-base leading-loose mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                A imersão completa que cria a nova categoria profissional. Mais do que um curso: é uma certificação em uma profissão que o mercado está pedindo agora.
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
                { plan: "FGI — Premium",   price: "R$2.498", features: ["Tudo do Essencial", "Mentoria em grupo", "Acesso lifetime às gravações", "Bônus exclusivos"] },
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

      <GoldDivider />

      {/* ── CONSULTORIA ─────────────────────────────────────────────────────── */}
      <section id="consultoria" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{ background: "rgba(201,168,76,0.04)", borderLeft: "4px solid #c9a84c", border: "1px solid rgba(201,168,76,0.15)" }}>

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
                  {["Diagnóstico completo da operação", "Mapeamento de automações prioritárias", "Construção de agentes e sistemas sob medida", "Acompanhamento até o sistema estar rodando"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      <span style={{ color: GOLD }}>→</span>{item}
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

      <GoldDivider />

      {/* ── SOBRE PETERSON ──────────────────────────────────────────────────── */}
      <section id="sobre" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="md:grid md:grid-cols-[42%_58%] gap-14 items-center">

            {/* Coluna foto */}
            <div className="relative mb-10 md:mb-0">
              {/* Foto principal */}
              <div className="relative rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 0 0 1px rgba(201,168,76,0.3), 0 0 60px rgba(201,168,76,0.08)" }}>
                <img
                  src="/photos/peterson-headshot.jpg"
                  alt="Peterson Oliveira"
                  className="w-full object-cover"
                  style={{ maxHeight: 520, objectPosition: "top" }}
                />
                {/* Overlay gradiente inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-24"
                  style={{ background: "linear-gradient(to top, rgba(15,32,68,0.8), transparent)" }} />
              </div>

              {/* Thumbnail "em ação" */}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-xl overflow-hidden border-2"
                style={{ borderColor: NAVY, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                <img
                  src="/photos/peterson-evento.jpg"
                  alt="Peterson em evento"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Coluna bio */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: GOLD }}>
                Criador do Método LEAP
              </span>

              <h2 className="font-bold text-white mb-4"
                style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Peterson Oliveira
              </h2>

              <p className="text-base leading-loose mb-4" style={{ color: "rgba(255,255,255,0.60)" }}>
                Criou o Método LEAP depois de perceber que o mercado estava cheio de ferramentas de IA sem nenhum método para usá-las estrategicamente. Em menos de 3 meses, construiu mais de 10 sistemas de IA, 10 sites e landing pages e 5 SaaS que já estão rodando com clientes reais.
              </p>

              <p className="text-base leading-loose mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
                Não é guru. É quem faz, documenta e ensina o que funciona na prática. O OCTUS, uma plataforma de criação de conteúdo com IA, é o case mais visível do que ele ensina: construído por ele, usado por ele, vendido por ele.
              </p>

              {/* Credential strip */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[
                  { num: "10+", label: "Sistemas de IA" },
                  { num: "10+", label: "Sites & LPs" },
                  { num: "5",   label: "SaaS criados" },
                  { num: "3m",  label: "De entrega" },
                ].map(({ num, label }) => (
                  <div key={label} className="text-center p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-xl font-bold mb-0.5" style={{ color: GOLD, fontFamily: "'General Sans', sans-serif" }}>{num}</p>
                    <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* SaaS badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["IAra", "OCTUS", "Lead Radar", "Black Table", "SafeNow"].map((saas) => (
                  <span key={saas}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "rgba(255,255,255,0.6)" }}>
                    {saas}
                  </span>
                ))}
              </div>

              <SocialLinks />
            </div>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── PORTFOLIO / CASES ───────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD, letterSpacing: "0.2em" }}>Portfólio</p>
            <h2 className="font-bold text-white"
              style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1 }}>
              O que foi construído
            </h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
              Peterson não ensina o que leu. Ensina o que construiu. Cada um desses sistemas existe, roda e tem clientes reais.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {SAAS_CASES.map((s, i) => (
              <div
                key={s.nome}
                className="p-6 rounded-2xl border transition-all duration-200 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                  gridColumn: i === 4 ? "2" : undefined,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = s.accent + "60"; (e.currentTarget as HTMLElement).style.background = s.accent + "08"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              >
                <div className="text-3xl mb-4">{s.emoji}</div>
                <div className="h-0.5 w-8 rounded-full mb-4" style={{ background: s.accent }} />
                <h3 className="font-bold text-white text-xl mb-1" style={{ fontFamily: "'General Sans', sans-serif" }}>
                  {s.nome}
                </h3>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{s.categoria}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.stack.map(t => (
                    <span key={t} className="text-xs px-2 py-1 rounded-md"
                      style={{ background: `${s.accent}15`, color: s.accent, border: `1px solid ${s.accent}30` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── DEPOIMENTOS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD, letterSpacing: "0.2em" }}>Prova social</p>
            <h2 className="font-bold text-white"
              style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1 }}>
              O que estão dizendo
            </h2>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
              style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "#fbbf24" }} />
              <span className="text-xs font-medium" style={{ color: "#fbbf24" }}>Turma Zero em formação — depoimentos chegando em breve</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { inicial: "C", nome: "Carlos M.",    empresa: "E-commerce",        cargo: "Fundador",           texto: "O sistema de atendimento automatizado que construí no LEAP está respondendo 80% dos clientes sem minha intervenção." },
              { inicial: "A", nome: "Ana Paula S.", empresa: "Clínica de Saúde",  cargo: "Gestora",            texto: "Em 10 dias já tinha o primeiro fluxo rodando. Nunca imaginei que conseguiria sem saber programar." },
              { inicial: "R", nome: "Rafael T.",    empresa: "Agência Digital",   cargo: "Sócio-diretor",      texto: "O Método LEAP mudou como entrego resultados para meus clientes. IA deixou de ser custo e virou diferencial." },
            ].map((dep) => (
              <div key={dep.nome} className="relative rounded-2xl p-6 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* Conteúdo do card */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0"
                    style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)", color: GOLD }}>
                    {dep.inicial}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{dep.nome}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{dep.cargo} · {dep.empresa}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ color: GOLD }}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>"{dep.texto}"</p>

                {/* Overlay "em breve" */}
                <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
                  style={{ background: "rgba(15,32,68,0.82)", backdropFilter: "blur(4px)" }}>
                  <span className="text-2xl mb-3">✦</span>
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}>
                    Em breve
                  </span>
                  <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>coletando depoimentos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD, letterSpacing: "0.2em" }}>FAQ</p>
            <h2 className="font-bold text-white"
              style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1 }}>
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}
                className="rounded-xl overflow-hidden border transition-all duration-200"
                style={{ borderColor: faqAberto === i ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.08)" }}>
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-150"
                  style={{ background: faqAberto === i ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.03)" }}
                  onClick={() => setFaqAberto(faqAberto === i ? null : i)}
                >
                  <span className="font-semibold text-sm pr-4" style={{ color: faqAberto === i ? "white" : "rgba(255,255,255,0.75)" }}>
                    {item.q}
                  </span>
                  <span className="flex-shrink-0 text-base transition-transform duration-200"
                    style={{ color: GOLD, transform: faqAberto === i ? "rotate(45deg)" : "rotate(0deg)" }}>
                    +
                  </span>
                </button>
                {faqAberto === i && (
                  <div className="px-6 pb-5" style={{ background: "rgba(201,168,76,0.03)" }}>
                    <p className="text-sm leading-loose" style={{ color: "rgba(255,255,255,0.55)" }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── GARANTIA ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">🛡️</div>
          <h3 className="font-bold text-white text-2xl mb-3" style={{ fontFamily: "'General Sans', sans-serif" }}>
            Garantia incondicional de 7 dias
          </h3>
          <p className="text-base leading-loose" style={{ color: "rgba(255,255,255,0.5)" }}>
            Se você entrar no LEAP BUILD e em 7 dias sentir que não era para você, devolvo 100% do valor sem perguntas. O risco é zero. O arrependimento de não começar custa muito mais.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ background: `radial-gradient(ellipse at center, ${GOLD} 0%, transparent 70%)` }} />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: GOLD, letterSpacing: "0.2em" }}>
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
            style={{ background: GOLD, color: NAVY, boxShadow: `0 0 60px rgba(201,168,76,0.35)` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 80px rgba(201,168,76,0.55)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 60px rgba(201,168,76,0.35)"; }}>
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
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD, letterSpacing: "0.2em" }}>
            Tecnologia de ponta
          </p>
          <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'General Sans', sans-serif" }}>
            Construído com as melhores ferramentas do mundo
          </h3>
        </div>
        <CarouselTrack />
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo + tagline */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                  🤖
                </div>
                <span className="font-bold text-white text-sm" style={{ fontFamily: "'General Sans', sans-serif" }}>IA com Peterson</span>
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Método LEAP · Gestor de IA · {new Date().getFullYear()}</p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-xs flex-wrap justify-center" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Link href="/cliente" className="hover:text-white transition-colors">Formulário</Link>
              <a href="#metodo" className="hover:text-white transition-colors">Método LEAP</a>
              <a href="#cursos" className="hover:text-white transition-colors">Cursos</a>
              <a href="#consultoria" className="hover:text-white transition-colors">Consultoria</a>
              <Link href="/member/login" className="hover:text-white transition-colors">Membros</Link>
            </div>

            {/* Social */}
            <SocialLinks />
          </div>
        </div>
      </footer>
    </div>
  );
}
