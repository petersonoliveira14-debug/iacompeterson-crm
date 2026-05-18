"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CarouselTrack, SocialLinks } from "@/components/layout/TechCarousel";

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const NAVY  = "#0f2044";
const DARK  = "#050d1a";   // fundo mais escuro — DNA/LaunchDarkly inspired
const GOLD  = "#c9a84c";
const MONO  = "'Courier New', 'Fira Code', monospace";

/* ─── Dados ──────────────────────────────────────────────────────────────────── */
const CURSOS = [
  {
    tag: "Disponível agora", tagColor: "#34d399", active: true,
    nome: "LEAP BUILD", tagline: "Do problema ao sistema",
    desc: "Você constrói um sistema real de gestão de frota corporativa — do zero ao deploy — em 22 aulas. Sem programar uma linha de código.",
    preco: "R$498", precoFull: "R$998 depois", cta: "Entrar no BUILD →", href: "/cliente", accent: GOLD,
    features: ["22 aulas + 4 bônus", "Case real de frota corporativa", "Método LEAP fase a fase", "Acesso vitalício"],
  },
  {
    tag: "Em breve", tagColor: "#60a5fa", active: false,
    nome: "LEAP RUN", tagline: "Produtividade no modo gestor",
    desc: "Seu assistente pessoal de IA configurado para a rotina do gestor — agenda, briefings, follow-ups, pesquisas e decisões.",
    preco: "R$498", precoFull: "R$998 depois", cta: "Garantir preço zero →", href: "/cliente", accent: "#60a5fa",
    features: ["Assistente IA personalizado", "Rotina de gestor automatizada", "Sem ferramentas genéricas", "Acesso prioritário BUILD"],
  },
  {
    tag: "Em breve", tagColor: "#60a5fa", active: false,
    nome: "LEAP SCALE", tagline: "Vendas no piloto automático",
    desc: "Sistema completo de atendimento, qualificação de leads e follow-up automatizado. O negócio vendendo 24/7 sem depender de você.",
    preco: "R$498", precoFull: "R$998 depois", cta: "Garantir preço zero →", href: "/cliente", accent: "#34d399",
    features: ["Atendimento IA 24/7", "SDR automatizado", "Follow-up inteligente", "Acesso prioritário BUILD"],
  },
];

const DORES = [
  "Você já testou ChatGPT, Copilot, n8n, Zapier, Make… e ainda não automatizou nada de verdade.",
  "Você assiste vídeos sobre IA no YouTube mas sua operação continua igual.",
  "Você sente que seus concorrentes estão avançando enquanto você ainda está no 'vou começar semana que vem'.",
  "Você sabe que IA pode transformar seu negócio mas não sabe por onde começar.",
];

const SAAS_CASES = [
  { nome: "IAra",        categoria: "Assistente de IA",                           stack: ["Claude", "Next.js"],         accent: GOLD,      emoji: "🤖" },
  { nome: "OCTUS",       categoria: "Criação de conteúdo com IA",                 stack: ["Claude Code", "Supabase"],   accent: "#60a5fa", emoji: "✍️" },
  { nome: "Lead Radar",  categoria: "Gestão de desempenho para pequenas equipes", stack: ["IA", "Automação"],           accent: "#34d399", emoji: "📡" },
  { nome: "Black Table", categoria: "Reserva de mesas e descontos",               stack: ["IA", "Next.js"],             accent: "#a78bfa", emoji: "🍽️" },
  { nome: "SafeNow",     categoria: "ERP para controle de EPIs",                  stack: ["IA", "Supabase"],            accent: "#f97316", emoji: "🦺" },
];

const FAQ_ITEMS = [
  { q: "Preciso saber programar?",                   a: "Não. O Método LEAP foi criado especificamente para gestores, não desenvolvedores. Você vai construir sistemas reais de IA sem escrever uma única linha de código." },
  { q: "Funciona para o meu nicho?",                 a: "Sim. Qualquer operação com processos repetitivos se beneficia de IA. Já foram construídos sistemas para varejo, saúde, advocacia, educação, logística e muito mais." },
  { q: "Quanto tempo por semana preciso dedicar?",   a: "De 2 a 4 horas por semana durante as primeiras 4 semanas é suficiente para entregar o primeiro sistema funcionando." },
  { q: "Qual a diferença entre LEAP e FGI?",         a: "LEAP é o método prático em formato de cursos online — você aprende construindo. FGI é a imersão ao vivo com certificado de Gestor de IA, para quem quer ir além e ter formação reconhecida." },
  { q: "E se eu não gostar?",                        a: "Garantia incondicional de 7 dias. Se em qualquer momento dentro dos primeiros 7 dias você sentir que não era o que esperava, devolvo 100% do valor sem perguntas e sem burocracia." },
  { q: "Posso parcelar?",                            a: "Sim, em até 12x no cartão de crédito. O valor de R$498 fica em parcelas de menos de R$42/mês — menos que uma assinatura de streaming." },
];

/* ─── Componentes internos ───────────────────────────────────────────────────── */

function GoldDivider() {
  return (
    <div style={{ padding: "0 1.5rem", position: "relative" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.12) 20%, rgba(201,168,76,0.4) 50%, rgba(201,168,76,0.12) 80%, transparent)", position: "relative" }}>
        {/* Center glow point */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 48, height: 3, background: GOLD, borderRadius: 2, boxShadow: `0 0 12px ${GOLD}, 0 0 28px ${GOLD}80` }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 4, height: 4, borderRadius: "50%", background: "#fff", boxShadow: `0 0 6px ${GOLD}, 0 0 16px ${GOLD}` }} />
      </div>
    </div>
  );
}

function SectionLabel({ children, color = GOLD }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 14 }}>
      <span style={{ fontFamily: MONO, fontSize: 10, color: `${color}60`, letterSpacing: "0.05em" }}>//</span>
      <p style={{ color, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: MONO }}>{children}</p>
      <span style={{ fontFamily: MONO, fontSize: 10, color: `${color}60`, letterSpacing: "0.05em" }}>//</span>
    </div>
  );
}

/* ─── Página ─────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  useEffect(() => {
    const targets = document.querySelectorAll('[data-fade]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Animações CSS */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.75; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        [data-fade] {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1);
        }
        [data-fade].visible {
          opacity: 1;
          transform: translateY(0);
        }
        .btn-gold {
          background: linear-gradient(110deg, #c9a84c 0%, #e8c96a 40%, #c9a84c 60%, #b8943c 100%);
          background-size: 200% auto;
          transition: background-position 0.5s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }
        .btn-gold:hover {
          background-position: right center;
          transform: scale(1.03);
          box-shadow: 0 0 80px rgba(201,168,76,0.55);
        }
        .leap-card:hover .leap-letter {
          transform: scale(1.08) translateY(-4px);
          opacity: 0.08;
        }
        .portfolio-card:hover .portfolio-overlay {
          opacity: 1;
        }
        .faq-answer {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease;
        }
        .grain-bg::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.022;
          pointer-events: none;
          z-index: 9999;
        }
        /* ── Tech dot-grid pattern ───────────── */
        .dot-grid {
          background-image: radial-gradient(rgba(201,168,76,0.10) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        /* ── Corner bracket decoration ───────── */
        .corner-tl { position:absolute; top:10px; left:10px; width:14px; height:14px; border-top:1px solid; border-left:1px solid; }
        .corner-tr { position:absolute; top:10px; right:10px; width:14px; height:14px; border-top:1px solid; border-right:1px solid; }
        .corner-bl { position:absolute; bottom:10px; left:10px; width:14px; height:14px; border-bottom:1px solid; border-left:1px solid; }
        .corner-br { position:absolute; bottom:10px; right:10px; width:14px; height:14px; border-bottom:1px solid; border-right:1px solid; }
        /* ── Scan line sweep on tech-card hover ─ */
        @keyframes scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .tech-card:hover .scan-line { animation: scan 1.2s linear; }
        .scan-line {
          position:absolute; left:0; right:0; height:40px;
          background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.06) 50%, transparent);
          pointer-events:none; transform: translateY(-100%);
        }
        /* ── Terminal cursor blink ───────────── */
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor { animation: blink 1s step-end infinite; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>

      <div className="grain-bg dot-grid" style={{ background: DARK, fontFamily: "'Satoshi', 'DM Sans', sans-serif", minHeight: "100vh" }}>

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(5,13,26,0.88)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,168,76,0.10)"
        }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>🤖</div>
              <span style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: 14 }}>IA com Peterson</span>
            </div>

            <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {[["Método","#metodo"],["Cursos","#cursos"],["Consultoria","#consultoria"],["Sobre","#sobre"]].map(([label, href]) => (
                <a key={href} href={href} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                  {label}
                </a>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link href="/member/login" style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Membros →</Link>
              <Link href="/cliente" className="btn-gold" style={{ fontSize: 13, fontWeight: 700, padding: "8px 18px", borderRadius: 10, color: NAVY, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                Quero entrar
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section style={{ position: "relative", overflow: "hidden", paddingTop: 96, paddingBottom: 112, paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
          {/* Tech grid lines no hero */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)`, backgroundSize: "80px 80px", pointerEvents: "none" }} />
          {/* Orbs de fundo */}
          <div style={{ position: "absolute", top: -160, right: -80, width: 700, height: 700, borderRadius: "50%", background: GOLD, opacity: 0.05, filter: "blur(140px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -160, left: -80, width: 560, height: 560, borderRadius: "50%", background: "#1a4fd6", opacity: 0.07, filter: "blur(120px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: `radial-gradient(ellipse, ${GOLD}0d 0%, transparent 65%)`, pointerEvents: "none" }} />
          {/* Horizontal scan line */}
          <div style={{ position: "absolute", top: "60%", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}20 30%, ${GOLD}40 50%, ${GOLD}20 70%, transparent)`, pointerEvents: "none" }} />

          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            {/* Badge terminal CLI */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 8, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(201,168,76,0.22)", marginBottom: 36, backdropFilter: "blur(8px)" }}>
              <span style={{ position: "relative", display: "flex", width: 7, height: 7 }}>
                <span style={{ position: "absolute", display: "inline-flex", width: "100%", height: "100%", borderRadius: "50%", background: "#4ade80", animation: "pulse-ring 1.5s cubic-bezier(0,0,0.2,1) infinite", opacity: 0.7 }} />
                <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", width: 7, height: 7, background: "#4ade80" }} />
              </span>
              <span style={{ fontFamily: MONO, color: "rgba(255,255,255,0.35)", fontSize: 11 }}>$</span>
              <span style={{ fontFamily: MONO, color: GOLD, fontSize: 11, letterSpacing: "0.04em" }}>leap build --turma-zero --preco R$498</span>
              <span className="cursor" style={{ fontFamily: MONO, color: GOLD, fontSize: 11 }}>█</span>
            </div>

            {/* Título principal */}
            <h1 style={{
              fontFamily: "'General Sans',sans-serif",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              fontWeight: 700, lineHeight: 1.02,
              color: "white", marginBottom: 20,
              letterSpacing: "-0.03em",
              textShadow: "0 4px 60px rgba(0,0,0,0.4)",
            }}>
              Você usa IA.<br />
              Enquanto seu concorrente<br />
              <span style={{ color: GOLD }}>a comanda.</span>
            </h1>

            {/* Subtítulo */}
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 700, color: GOLD, marginBottom: 18, letterSpacing: "-0.01em", fontFamily: "'General Sans',sans-serif" }}>
              Torne-se um Gestor de IA com o Método LEAP e saia da plateia de uma vez por todas.
            </p>
            <p style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", color: "rgba(255,255,255,0.5)", marginBottom: 44, maxWidth: 620, margin: "0 auto 44px", lineHeight: 1.75, fontStyle: "italic", fontFamily: "'Libre Baskerville',serif" }}>
              O Método LEAP transforma você no profissional que o mercado está buscando: quem não só usa IA, mas lidera, automatiza e faz o negócio escalar com ela. Sem programar uma linha de código.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 52 }}>
              <Link href="/cliente" className="btn-gold" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 36px", borderRadius: 16, fontWeight: 700,
                fontSize: "1.05rem", color: NAVY, textDecoration: "none",
                boxShadow: "0 0 48px rgba(201,168,76,0.35)",
              }}>
                Dê o salto agora →
              </Link>
              <Link href="/member/login" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 32px", borderRadius: 16, fontWeight: 700,
                fontSize: "1.05rem", color: "rgba(255,255,255,0.65)",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                textDecoration: "none", transition: "all 0.2s"
              }}>
                Já sou membro
              </Link>
            </div>

            {/* Floating proof badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {[
                { icon: "🏗️", text: "10+ sistemas de IA construídos" },
                { icon: "📦", text: "5 SaaS em produção" },
                { icon: "⚡", text: "0 linhas de código necessárias" },
              ].map(p => (
                <div key={p.text} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "7px 14px", borderRadius: 100,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
                  fontSize: 12, color: "rgba(255,255,255,0.5)"
                }}>
                  <span>{p.icon}</span>{p.text}
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, marginTop: 28, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>
              LEAP BUILD · 22 aulas · Acesso vitalício · Garantia de 7 dias
            </p>
          </div>
        </section>

        {/* ── NÚMEROS ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "64px 1.5rem", background: "rgba(0,0,0,0.35)", borderTop: `1px solid rgba(201,168,76,0.08)`, borderBottom: `1px solid rgba(201,168,76,0.08)` }}>
          <div data-fade="" style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[
              { n: "60%",  d: "redução em tarefas operacionais",  key: "EFFICIENCY" },
              { n: "10",   d: "dias para o primeiro sistema",     key: "TIME_TO_LIVE" },
              { n: "24/7", d: "operação no piloto automático",    key: "UPTIME" },
              { n: "0",    d: "linhas de código necessárias",     key: "CODE_REQUIRED" },
            ].map(r => (
              <div key={r.n} className="tech-card" style={{ textAlign: "center", padding: "24px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)", position: "relative", overflow: "hidden" }}>
                <div className="scan-line" />
                {/* Top scanline accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />
                <p style={{ fontFamily: MONO, fontSize: 9, color: `${GOLD}50`, letterSpacing: "0.12em", marginBottom: 10 }}>{r.key}</p>
                <div style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3rem)", color: GOLD, lineHeight: 1, marginBottom: 10 }}>{r.n}</div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>{r.d}</p>
              </div>
            ))}
          </div>
        </section>

        <GoldDivider />

        {/* ── DOR / AGITAÇÃO ──────────────────────────────────────────────── */}
        <section style={{ padding: "96px 1.5rem" }}>
          <div data-fade="" style={{ maxWidth: 720, margin: "0 auto" }}>
            <SectionLabel>Seja honesto</SectionLabel>
            <h2 style={{ fontFamily: "'General Sans',sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "white", lineHeight: 1.1, textAlign: "center", marginBottom: 48 }}>
              Você reconhece{" "}
              <span style={{ color: GOLD }}>algum destes cenários?</span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
              {DORES.map((dor, i) => (
                <div key={i}
                  style={{ display: "flex", gap: 16, padding: "18px 22px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s", cursor: "default", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.22)"; (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}>
                  <span style={{ fontFamily: MONO, color: `${GOLD}60`, fontSize: 10, flexShrink: 0, marginTop: 4 }}>0{i + 1}</span>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.65)", margin: 0 }}>{dor}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: "24px 28px", borderRadius: 16, background: "rgba(201,168,76,0.06)", borderLeft: "4px solid " + GOLD }}>
              <p style={{ fontWeight: 700, color: "white", fontSize: "1.05rem", marginBottom: 8 }}>O problema não é falta de informação. É falta de método.</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.8, margin: 0 }}>
                Você tem ferramentas. O que falta é saber como usá-las de forma integrada, estratégica e lucrativa — e é exatamente isso que o <strong style={{ color: "white" }}>Método LEAP</strong> ensina.
              </p>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── MÉTODO LEAP ─────────────────────────────────────────────────── */}
        <section id="metodo" style={{ padding: "96px 1.5rem", background: "rgba(255,255,255,0.015)" }}>
          <div data-fade="" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>A solução</SectionLabel>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "white", lineHeight: 1.1 }}>
                O Gestor de IA não usa mais ferramentas.<br />
                <span style={{ color: GOLD }}>Ele as comanda.</span>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 48 }}>
              {[
                { letra: "L", titulo: "Liderar",    desc: "Estratégia antes da ferramenta. O que automatizar vs. o que manter humano.", cor: GOLD },
                { letra: "E", titulo: "Escalar",    desc: "O ecossistema certo — ferramentas que conversam entre si sem tocar em código.", cor: "#60a5fa" },
                { letra: "A", titulo: "Automatizar",desc: "Agentes de IA trabalhando 24/7 — conteúdo, atendimento e vendas no automático.", cor: "#34d399" },
                { letra: "P", titulo: "Performar",  desc: "IA sem métrica é brinquedo. Dashboard, otimização e monetização real.", cor: "#a78bfa" },
              ].map(f => (
                <div key={f.letra} className="leap-card tech-card"
                  style={{ padding: "28px 24px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: `1px solid ${f.cor}22`, position: "relative", overflow: "hidden", cursor: "default", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseMove={e => {
                    const el = e.currentTarget as HTMLElement;
                    const r = el.getBoundingClientRect();
                    const x = (e.clientX - r.left) / r.width - 0.5;
                    const y = (e.clientY - r.top) / r.height - 0.5;
                    el.style.transition = 'border-color 0.2s, box-shadow 0.2s';
                    el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
                    el.style.borderColor = f.cor + '60';
                    el.style.boxShadow = `0 20px 60px ${f.cor}25`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transition = 'border-color 0.2s, box-shadow 0.2s, transform 0.5s ease';
                    el.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateZ(0)';
                    el.style.borderColor = 'rgba(255,255,255,0.09)';
                    el.style.boxShadow = 'none';
                  }}>
                  {/* Scan line */}
                  <div className="scan-line" />
                  {/* Corner brackets */}
                  <div className="corner-tl" style={{ borderColor: `${f.cor}40` }} />
                  <div className="corner-tr" style={{ borderColor: `${f.cor}40` }} />
                  <div className="corner-bl" style={{ borderColor: `${f.cor}40` }} />
                  <div className="corner-br" style={{ borderColor: `${f.cor}40` }} />
                  {/* Giant watermark letter */}
                  <div className="leap-letter" style={{ position: "absolute", top: -8, right: -8, fontSize: "7rem", fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: f.cor, opacity: 0.04, lineHeight: 1, userSelect: "none", transition: "all 0.3s ease", pointerEvents: "none" }}>{f.letra}</div>
                  <div style={{ fontFamily: "'General Sans',sans-serif", fontSize: "2.5rem", fontWeight: 700, color: f.cor, marginBottom: 12, position: "relative" }}>{f.letra}</div>
                  <div style={{ fontWeight: 700, color: "white", fontSize: "1.05rem", marginBottom: 10 }}>{f.titulo}</div>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", padding: "36px 32px", borderRadius: 20, background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(15,32,68,0))", border: "1px solid rgba(201,168,76,0.18)" }}>
              <p style={{ fontWeight: 700, color: "white", fontSize: "1.1rem", marginBottom: 8 }}>Peterson Oliveira criou o Método LEAP e formou uma nova categoria profissional:</p>
              <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "1.8rem", color: GOLD, margin: "0 0 8px" }}>O Gestor de IA.</p>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>O profissional que lidera, escala, automatiza e performa com inteligência artificial — sem precisar saber programar.</p>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── TRILOGIA ────────────────────────────────────────────────────── */}
        <section id="cursos" style={{ padding: "96px 1.5rem" }}>
          <div data-fade="" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>Os produtos</SectionLabel>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "white", lineHeight: 1.1 }}>
                Três cursos. <span style={{ color: GOLD }}>Uma jornada completa.</span>
              </h2>
              <p style={{ marginTop: 16, fontSize: "0.95rem", color: "rgba(255,255,255,0.35)" }}>Quem entrar no BUILD agora garante o preço turma zero nos três.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 24 }}>
              {CURSOS.map(c => (
                <div key={c.nome} style={{
                  borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column",
                  background: c.active ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.02)",
                  border: c.active ? `1px solid rgba(201,168,76,0.35)` : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: c.active ? "0 0 40px rgba(201,168,76,0.08), inset 0 0 0 1px rgba(201,168,76,0.06)" : "none",
                  position: "relative", transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-6px)';
                    el.style.boxShadow = c.active
                      ? `0 0 60px ${c.accent}25, inset 0 1px 0 rgba(201,168,76,0.15)`
                      : `0 12px 40px rgba(255,255,255,0.06)`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = c.active
                      ? '0 0 40px rgba(201,168,76,0.10), inset 0 1px 0 rgba(201,168,76,0.15)'
                      : 'none';
                  }}>
                  {/* Accent bar */}
                  <div style={{ height: 3, background: c.accent }} />

                  {/* Active badge */}
                  {c.active && (
                    <div style={{ position: "absolute", top: 16, right: 16, padding: "4px 10px", borderRadius: 100, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.1em" }}>
                      ✦ Disponível
                    </div>
                  )}
                  {!c.active && (
                    <div style={{ position: "absolute", top: 16, right: 16, padding: "4px 10px", borderRadius: 100, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", fontSize: 10, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.1em" }}>
                      Em breve
                    </div>
                  )}

                  <div style={{ padding: "24px 24px 16px", flex: 1 }}>
                    <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.25rem", marginBottom: 4 }}>{c.nome}</h3>
                    <p style={{ fontSize: "0.8rem", fontWeight: 600, color: c.accent, marginBottom: 16 }}>{c.tagline}</p>
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 20 }}>{c.desc}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      {c.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
                          <span style={{ color: c.accent, fontSize: 10 }}>✓</span>{f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: "16px 24px 24px" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.75rem", lineHeight: 1 }}>{c.preco}</p>
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.28)", marginTop: 4 }}>Turma zero · {c.precoFull}</p>
                      </div>
                    </div>
                    <Link href={c.href} style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: "0.85rem",
                      background: `${c.accent}18`, color: c.accent, border: `1px solid ${c.accent}35`,
                      textDecoration: "none", transition: "all 0.2s"
                    }}>
                      {c.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle */}
            <div style={{ padding: "32px 40px", borderRadius: 20, borderLeft: "4px solid #7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa" }}>Bundle · Leve 3 Pague 2</span>
                <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.5rem", margin: "6px 0 8px" }}>Trilogia LEAP Completa</h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>Os três cursos pelo preço de dois. Quem entra no BUILD agora garante esse preço quando os outros lançarem.</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", marginBottom: 4 }}>3 × R$498 = R$1.494</p>
                <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "3.2rem", color: "#a78bfa", lineHeight: 1 }}>R$998</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: 4 }}>bundle turma zero · R$1.998 depois</p>
              </div>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── FGI ─────────────────────────────────────────────────────────── */}
        <section style={{ padding: "96px 1.5rem", background: "rgba(59,130,246,0.03)", borderTop: "1px solid rgba(59,130,246,0.08)" }}>
          <div data-fade="" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <SectionLabel color="#60a5fa">Formação Completa · Junho 2025</SectionLabel>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.1, marginBottom: 20 }}>
                FGI — Formação<br />Gestores de IA
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 16, fontSize: "0.95rem" }}>
                A imersão completa que cria a nova categoria profissional. Mais do que um curso: é uma certificação em uma profissão que o mercado está pedindo agora.
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: 32, lineHeight: 1.7 }}>
                Quem faz o LEAP BUILD tem acesso prioritário à FGI — e os cases que você construiu no BUILD viram portfólio na imersão.
              </p>
              <Link href="/cliente" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: "0.9rem", background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)", textDecoration: "none", transition: "all 0.2s" }}>
                Quero acesso prioritário →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { plan: "FGI — Essencial", price: "R$1.498", features: ["Imersão ao vivo", "Certificado de Gestor de IA", "Material exclusivo", "Comunidade privada"] },
                { plan: "FGI — Premium",   price: "R$2.498", features: ["Tudo do Essencial", "Mentoria em grupo", "Acesso lifetime às gravações", "Bônus exclusivos"] },
              ].map(p => (
                <div key={p.plan} style={{ padding: "20px 24px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.18)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontWeight: 700, color: "white", fontSize: "0.9rem" }}>{p.plan}</span>
                    <span style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "1.35rem", color: "#60a5fa" }}>{p.price}</span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                        <span style={{ color: "#60a5fa", fontSize: 10 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── CONSULTORIA ─────────────────────────────────────────────────── */}
        <section id="consultoria" style={{ padding: "96px 1.5rem" }}>
          <div data-fade="" style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ borderRadius: 24, padding: "56px 64px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.18)", borderLeft: "4px solid " + GOLD, position: "relative", overflow: "hidden" }}>
              {/* Background decoration */}
              <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: GOLD, opacity: 0.03, pointerEvents: "none" }} />

              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 32 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#f87171" }}>Vagas limitadas</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "flex-start" }}>
                <div>
                  <SectionLabel>Consultoria</SectionLabel>
                  <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "clamp(1.6rem,3vw,2.4rem)", lineHeight: 1.1, marginBottom: 16 }}>
                    Seu negócio precisa de um sistema feito para ele.
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 12, fontSize: "0.95rem" }}>
                    Nem todo problema cabe dentro de um curso. Alguns precisam de um projeto.
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: 32, fontSize: "0.9rem" }}>
                    Você tem uma operação com gargalos específicos. Um fluxo que precisa de IA customizada. Um sistema que não existe ainda. Peterson mergulha no seu negócio, mapeia os pontos de atrito e constrói a solução, sem deixar você para trás no processo.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Diagnóstico completo da operação","Mapeamento de automações prioritárias","Construção de agentes e sistemas sob medida","Acompanhamento até o sistema estar rodando"].map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.9rem", color: "rgba(255,255,255,0.65)" }}>
                        <span style={{ color: GOLD }}>→</span>{item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/cliente" className="btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, fontWeight: 700, fontSize: "0.9rem", color: NAVY, textDecoration: "none" }}>
                    Quero um projeto →
                  </Link>
                </div>

                <div>
                  <div style={{ padding: "24px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 12 }}>
                    <p style={{ fontWeight: 700, color: "white", fontSize: "0.85rem", marginBottom: 20 }}>O que você recebe:</p>
                    {[
                      { n: "01", t: "Discovery call",         d: "Peterson entende sua operação em profundidade antes de propor qualquer coisa" },
                      { n: "02", t: "Proposta sob medida",    d: "Escopo, prazo e investimento definidos juntos, sem surpresas" },
                      { n: "03", t: "Execução acompanhada",   d: "Você participa de cada decisão ao longo do desenvolvimento" },
                      { n: "04", t: "Entrega e treinamento",  d: "Sistema rodando e equipe treinada para manter tudo funcionando" },
                    ].map(s => (
                      <div key={s.n} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, flexShrink: 0, marginTop: 2 }}>{s.n}</span>
                        <div>
                          <p style={{ fontWeight: 700, color: "white", fontSize: "0.85rem", marginBottom: 3 }}>{s.t}</p>
                          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>{s.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>Peterson atende poucos clientes por vez para garantir profundidade.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOBRE PETERSON ──────────────────────────────────────────────── */}
        <section id="sobre" style={{ overflow: "hidden" }}>
          <div data-fade="" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }}>

            {/* Foto — full height, sem maxHeight */}
            <div style={{ position: "relative", minHeight: 640, overflow: "hidden" }}>
              <img src="/photos/peterson-headshot.jpg" alt="Peterson Oliveira"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
              {/* Blend direita → funde com o fundo navy */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 50%, #0f2044 100%)" }} />
              {/* Sombra base */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,32,68,0.85) 0%, transparent 40%)" }} />

              {/* Name plate */}
              <div style={{ position: "absolute", bottom: 28, left: 28 }}>
                <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.15rem", margin: 0 }}>Peterson Oliveira</p>
                <p style={{ color: GOLD, fontSize: "0.8rem", margin: "3px 0 0" }}>Criador do Método LEAP</p>
              </div>

              {/* Stage photo badge */}
              <div style={{ position: "absolute", top: 20, left: 20, borderRadius: 12, overflow: "hidden", width: 88, height: 88, border: "2px solid rgba(201,168,76,0.35)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                <img src="/photos/peterson-stage.jpg" alt="Peterson no palco"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
              </div>
              <p style={{ position: "absolute", top: 114, left: 20, fontSize: 10, color: "rgba(255,255,255,0.38)", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>no palco</p>
            </div>

            {/* Bio */}
            <div style={{ padding: "72px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <SectionLabel>Quem criou o método</SectionLabel>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 16, fontSize: "0.95rem" }}>
                Criou o Método LEAP depois de perceber que o mercado estava cheio de ferramentas de IA sem nenhum método para usá-las estrategicamente. Em menos de 3 meses, construiu mais de 10 sistemas de IA, 10 sites e landing pages e 5 SaaS que já estão rodando com clientes reais.
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: 36, fontSize: "0.9rem" }}>
                Não é guru. É quem faz, documenta e ensina o que funciona na prática. O OCTUS, uma plataforma de criação de conteúdo com IA, é o case mais visível do que ele ensina: construído por ele, usado por ele, vendido por ele.
              </p>

              {/* Credential grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
                {[
                  { n: "10+", l: "Sistemas de IA",  icon: "🤖" },
                  { n: "10+", l: "Sites e LPs",      icon: "🌐" },
                  { n: "5",   l: "SaaS criados",     icon: "📦" },
                  { n: "3m",  l: "Entregando",       icon: "⚡" },
                ].map(c => (
                  <div key={c.l} style={{ textAlign: "center", padding: "16px 12px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>{c.icon}</div>
                    <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "1.4rem", color: GOLD, lineHeight: 1, marginBottom: 4 }}>{c.n}</p>
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.3 }}>{c.l}</p>
                  </div>
                ))}
              </div>

              {/* SaaS badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                {["IAra", "OCTUS", "Lead Radar", "Black Table", "SafeNow"].map(s => (
                  <span key={s} style={{ fontSize: "0.78rem", fontWeight: 600, padding: "6px 12px", borderRadius: 8, background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)", color: "rgba(255,255,255,0.55)" }}>{s}</span>
                ))}
              </div>

              <SocialLinks />
            </div>
          </div>
        </section>

        {/* ── PORTFOLIO / CASES ───────────────────────────────────────────── */}
        <section style={{ padding: "96px 1.5rem", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div data-fade="" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>Portfólio</SectionLabel>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.1 }}>
                O que foi construído
              </h2>
              <p style={{ marginTop: 16, fontSize: "0.9rem", color: "rgba(255,255,255,0.35)", maxWidth: 480, margin: "16px auto 0" }}>
                Peterson não ensina o que leu. Ensina o que construiu. Cada um desses sistemas existe, roda e tem clientes reais.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {SAAS_CASES.map((s, i) => (
                <div key={s.nome} className="portfolio-card tech-card"
                  style={{
                    borderRadius: 12, overflow: "hidden", position: "relative", cursor: "default",
                    background: "rgba(255,255,255,0.02)", border: `1px solid ${s.accent}18`,
                    transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s, background 0.2s",
                    gridColumn: i === 4 ? "2" : "auto",
                  }}
                  onMouseMove={e => {
                    const el = e.currentTarget as HTMLElement;
                    const r = el.getBoundingClientRect();
                    const x = e.clientX - r.left;
                    const y = e.clientY - r.top;
                    el.style.background = `radial-gradient(circle at ${x}px ${y}px, ${s.accent}22 0%, rgba(255,255,255,0.03) 55%)`;
                    el.style.borderColor = s.accent + '55';
                    el.style.transform = 'translateY(-4px) scale(1.015)';
                    el.style.boxShadow = `0 16px 48px ${s.accent}18`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(255,255,255,0.03)';
                    el.style.borderColor = 'rgba(255,255,255,0.08)';
                    el.style.transform = 'translateY(0) scale(1)';
                    el.style.boxShadow = 'none';
                  }}>
                  {/* Scan line */}
                  <div className="scan-line" />
                  {/* Top accent */}
                  <div style={{ height: 1, background: s.accent }} />
                  {/* File header monospace */}
                  <div style={{ padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: `${s.accent}80`, fontSize: 10 }}>▶</span>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.04em" }}>{s.nome.toLowerCase().replace(/ /g, "-")}.ts</span>
                  </div>

                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", background: `${s.accent}15`, border: `1px solid ${s.accent}25`, flexShrink: 0 }}>{s.emoji}</div>
                      <div>
                        <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.05rem", margin: 0 }}>{s.nome}</h3>
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>{s.categoria}</p>
                      </div>
                    </div>
                    {/* Stack pills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {s.stack.map(t => (
                        <span key={t} style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: `${s.accent}12`, color: s.accent, border: `1px solid ${s.accent}25` }}>{t}</span>
                      ))}
                      <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>Em produção ✓</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── DEPOIMENTOS ─────────────────────────────────────────────────── */}
        <section style={{ padding: "96px 1.5rem" }}>
          <div data-fade="" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.1, marginBottom: 20 }}>
                Quem já recebeu uma solução
              </h2>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: `1px solid rgba(201,168,76,0.18)` }}>
                <span style={{ fontFamily: MONO, color: `${GOLD}60`, fontSize: 10 }}>></span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>aguardando_confirmação.depoimentos — collecting...</span>
                <span className="cursor" style={{ fontFamily: MONO, color: GOLD, fontSize: 10 }}>█</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                {
                  initials: "SE",
                  nome: "Sabrina Espinós",
                  cargo: "CEO",
                  empresa: "IAra",
                  placeholder: "Depoimento a caminho — solução entregue.",
                },
                {
                  initials: "MR",
                  nome: "Marina Oliveira Rodrigues",
                  cargo: "Head de Estratégia e Marketing",
                  empresa: "Grupo Carbo",
                  placeholder: "Depoimento a caminho — solução entregue.",
                },
                {
                  initials: "SJ",
                  nome: "Sarah Justus",
                  cargo: "Co-founder · Gestora de Tráfego",
                  empresa: "Forget.co",
                  placeholder: "Depoimento a caminho — solução entregue.",
                },
              ].map(d => (
                <div key={d.nome} style={{ position: "relative", borderRadius: 12, padding: "24px", overflow: "hidden", background: "rgba(255,255,255,0.02)", border: `1px solid rgba(201,168,76,0.12)` }}>
                  {/* Corner brackets */}
                  <div style={{ position: "absolute", top: 10, left: 10, width: 12, height: 12, borderTop: `1px solid ${GOLD}35`, borderLeft: `1px solid ${GOLD}35` }} />
                  <div style={{ position: "absolute", top: 10, right: 10, width: 12, height: 12, borderTop: `1px solid ${GOLD}35`, borderRight: `1px solid ${GOLD}35` }} />
                  <div style={{ position: "absolute", bottom: 10, left: 10, width: 12, height: 12, borderBottom: `1px solid ${GOLD}35`, borderLeft: `1px solid ${GOLD}35` }} />
                  <div style={{ position: "absolute", bottom: 10, right: 10, width: 12, height: 12, borderBottom: `1px solid ${GOLD}35`, borderRight: `1px solid ${GOLD}35` }} />

                  {/* Header identidade */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.82rem", flexShrink: 0, background: "rgba(201,168,76,0.10)", border: "1px solid rgba(201,168,76,0.20)", color: GOLD, fontFamily: MONO }}>
                      {d.initials}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "white", fontSize: "0.88rem", margin: 0 }}>{d.nome}</p>
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", margin: "2px 0 0", lineHeight: 1.4 }}>{d.cargo} · {d.empresa}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ color: GOLD, fontSize: "0.8rem" }}>★</span>)}
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{d.placeholder}</p>

                  {/* Overlay "aguardando" */}
                  <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "rgba(5,13,26,0.82)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid rgba(201,168,76,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: MONO, color: GOLD, fontSize: 14 }}>↻</span>
                    </div>
                    <p style={{ fontFamily: MONO, fontSize: 9, color: `${GOLD}70`, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>aguardando</p>
                    <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.22)", margin: 0 }}>depoimento solicitado</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section id="faq" style={{ padding: "96px 1.5rem", background: "rgba(255,255,255,0.015)" }}>
          <div data-fade="" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SectionLabel>FAQ</SectionLabel>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "clamp(2rem,4vw,2.8rem)", lineHeight: 1.1 }}>
                Perguntas frequentes
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} style={{
                  borderRadius: 14, overflow: "hidden", border: "1px solid",
                  borderColor: faqAberto === i ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.08)",
                  transition: "border-color 0.2s"
                }}>
                  <button
                    onClick={() => setFaqAberto(faqAberto === i ? null : i)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "18px 22px", textAlign: "left", background: faqAberto === i ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.02)",
                      border: "none", cursor: "pointer", transition: "background 0.2s", gap: 14,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = faqAberto === i ? 'rgba(201,168,76,0.09)' : 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = faqAberto === i ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.02)'; }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flex: 1 }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: `${GOLD}50`, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: faqAberto === i ? "white" : "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{item.q}</span>
                    </div>
                    <span style={{ fontFamily: MONO, color: faqAberto === i ? GOLD : "rgba(255,255,255,0.25)", fontSize: "1rem", fontWeight: 400, flexShrink: 0, transform: faqAberto === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.25s ease, color 0.2s", lineHeight: 1 }}>+</span>
                  </button>
                  <div className="faq-answer" style={{ maxHeight: faqAberto === i ? 300 : 0, opacity: faqAberto === i ? 1 : 0 }}>
                    <div style={{ padding: "4px 24px 20px", background: "rgba(201,168,76,0.03)" }}>
                      <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: 0 }}>{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── GARANTIA ────────────────────────────────────────────────────── */}
        <section style={{ padding: "64px 1.5rem", borderTop: `1px solid rgba(201,168,76,0.08)` }}>
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", position: "relative", padding: "36px 40px", borderRadius: 14, border: "1px solid rgba(201,168,76,0.18)", background: "rgba(201,168,76,0.03)" }}>
            {/* Corner brackets */}
            <div style={{ position: "absolute", top: 12, left: 12, width: 18, height: 18, borderTop: `1px solid ${GOLD}50`, borderLeft: `1px solid ${GOLD}50` }} />
            <div style={{ position: "absolute", top: 12, right: 12, width: 18, height: 18, borderTop: `1px solid ${GOLD}50`, borderRight: `1px solid ${GOLD}50` }} />
            <div style={{ position: "absolute", bottom: 12, left: 12, width: 18, height: 18, borderBottom: `1px solid ${GOLD}50`, borderLeft: `1px solid ${GOLD}50` }} />
            <div style={{ position: "absolute", bottom: 12, right: 12, width: 18, height: 18, borderBottom: `1px solid ${GOLD}50`, borderRight: `1px solid ${GOLD}50` }} />
            <p style={{ fontFamily: MONO, fontSize: 9, color: `${GOLD}50`, letterSpacing: "0.15em", marginBottom: 14 }}>GUARANTEE_7D</p>
            <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>🛡️</div>
            <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.4rem", marginBottom: 12 }}>Garantia incondicional de 7 dias</h3>
            <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.8, fontSize: "0.9rem", margin: 0 }}>
              Se você entrar no LEAP BUILD e em 7 dias sentir que não era para você, devolvo 100% do valor sem perguntas. O risco é zero.
            </p>
          </div>
        </section>

        {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
        <section style={{ padding: "128px 1.5rem", position: "relative", overflow: "hidden" }}>
          {/* Ghost text de fundo */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "clamp(5rem,15vw,14rem)", color: "white", opacity: 0.025, whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", letterSpacing: "-0.05em" }}>
            LEAP
          </div>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${GOLD}08 0%, transparent 65%)`, pointerEvents: "none" }} />

          <div data-fade="" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <SectionLabel>A decisão é agora</SectionLabel>
            <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "clamp(2.5rem,6vw,4.5rem)", lineHeight: 1.02, letterSpacing: "-0.04em", marginBottom: 16 }}>
              O salto começa aqui.
            </h2>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.45)", fontStyle: "italic", fontFamily: "'Libre Baskerville',serif", marginBottom: 48 }}>
              R$498 hoje. R$998 depois. O preço de turma zero nunca volta.
            </p>

            <Link href="/cliente" className="btn-gold" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 12,
              padding: "20px 52px", borderRadius: 18, fontWeight: 700, fontSize: "1.15rem",
              color: NAVY, textDecoration: "none", boxShadow: "0 0 64px rgba(201,168,76,0.4)",
            }}>
              Entrar no LEAP BUILD →
            </Link>

            <p style={{ fontSize: 11, marginTop: 20, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
              Turma zero · R$498 · 22 aulas + 4 bônus · Acesso vitalício · Garantia de 7 dias
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 32 }}>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.25)" }}>Já tem acesso?</span>
              <Link href="/member/login" style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Entrar na área de membros</Link>
            </div>
          </div>
        </section>

        {/* ── TECH CAROUSEL ───────────────────────────────────────────────── */}
        <section style={{ padding: "64px 0", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 600, margin: "0 auto 40px", textAlign: "center", padding: "0 1.5rem" }}>
            <SectionLabel>Tecnologia de ponta</SectionLabel>
            <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.5rem" }}>
              Construído com as melhores ferramentas do mundo
            </h3>
          </div>
          <CarouselTrack />
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer style={{ padding: "56px 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
            {/* Logo */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>🤖</div>
                <span style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: 14 }}>IA com Peterson</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Método LEAP · Gestor de IA · {new Date().getFullYear()}</p>
            </div>

            {/* Links */}
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              {[
                { label: "Formulário", href: "/cliente", isLink: true },
                { label: "Método LEAP", href: "#metodo", isLink: false },
                { label: "Cursos", href: "#cursos", isLink: false },
                { label: "Consultoria", href: "#consultoria", isLink: false },
                { label: "Membros", href: "/member/login", isLink: true },
              ].map(item => (
                item.isLink
                  ? <Link key={item.label} href={item.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                      {item.label}
                    </Link>
                  : <a key={item.label} href={item.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                      {item.label}
                    </a>
              ))}
            </div>

            <SocialLinks />
          </div>
        </footer>

      </div>
    </>
  );
}
