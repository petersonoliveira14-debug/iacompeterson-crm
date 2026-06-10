"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CarouselTrack, SocialLinks, TECH_STACK } from "@/components/layout/TechCarousel";

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
  "Você paga R$3–8K para dev que demora meses, entrega pela metade e você fica sem controle do que foi feito.",
  "O negócio para quando você para — tudo depende de você ou de terceiros que cobram caro.",
  "Processos repetitivos consomem horas que deveriam estar em vendas ou estratégia.",
  "Seus concorrentes estão usando IA enquanto você ainda está no 'vou começar semana que vem'.",
];

const SAAS_CASES: { nome: string; categoria: string; stack: string[]; accent: string; screenshot: string; href?: string; entregue?: boolean }[] = [
  { nome: "Forget",      categoria: "Branding & Identidade Visual",               stack: ["Design", "Strategy"],        accent: "#e879f9", screenshot: "/screenshots/forget.png",     href: "https://www.forgetcompany.com/", entregue: true },
  { nome: "OCTUS",       categoria: "Criação de conteúdo com IA",                 stack: ["Claude Code", "Supabase"],   accent: "#60a5fa", screenshot: "/screenshots/octus.png",      href: "https://octuscreator.com.br" },
  { nome: "IAra",        categoria: "Assistente de IA",                           stack: ["Claude", "Next.js"],         accent: GOLD,      screenshot: "/screenshots/iara.png",       href: "https://iaraia.com" },
  { nome: "Lead Radar",  categoria: "Gestão de desempenho para pequenas equipes", stack: ["IA", "Automação"],           accent: "#34d399", screenshot: "/screenshots/leadradar.png",  href: "https://leadradarpro.com" },
  { nome: "Black Table", categoria: "Reserva de mesas e descontos",               stack: ["IA", "Next.js"],             accent: "#a78bfa", screenshot: "/screenshots/blacktable.png", entregue: true },
  { nome: "SafeNow",     categoria: "ERP para controle de EPIs",                  stack: ["IA", "Supabase"],            accent: "#f97316", screenshot: "/screenshots/safenow.png",    entregue: true },
  { nome: "CarboZe",     categoria: "Plataforma de gestão Grupo Carbo",           stack: ["Next.js", "Supabase"],       accent: "#4ade80", screenshot: "/screenshots/carboze.png",    href: "https://www.carboze.com.br/",   entregue: true },
  { nome: "CarboHub",    categoria: "Ecossistema integrado Grupo Carbo",          stack: ["Next.js", "IA"],             accent: "#38bdf8", screenshot: "/screenshots/carbohub.png",   href: "https://www.carbohub.com.br/",  entregue: true },
];

const FAQ_ITEMS = [
  { q: "Preciso saber programar?",                   a: "Não. O Método LEAP foi criado especificamente para gestores, não desenvolvedores. Você vai construir sistemas reais de IA sem escrever uma única linha de código." },
  { q: "Funciona para o meu nicho?",                 a: "Sim. Qualquer operação com processos repetitivos se beneficia de IA. Já foram construídos sistemas para varejo, saúde, advocacia, educação, logística e muito mais." },
  { q: "Quanto tempo por semana preciso dedicar?",   a: "De 2 a 4 horas por semana durante as primeiras 4 semanas é suficiente para entregar o primeiro sistema funcionando." },
  { q: "Qual a diferença entre LEAP e FGI?",         a: "LEAP é o método prático em formato de cursos online — você aprende construindo. FGI é a imersão ao vivo com certificado de Gestor de IA, para quem quer ir além e ter formação reconhecida." },
  { q: "E se eu não gostar?",                        a: "Garantia incondicional de 7 dias. Se em qualquer momento dentro dos primeiros 7 dias você sentir que não era o que esperava, devolvo 100% do valor sem perguntas e sem burocracia." },
  { q: "Posso parcelar?",                            a: "Sim, em até 12x no cartão de crédito. O valor de R$498 fica em parcelas de menos de R$42/mês — menos que uma assinatura de streaming." },
  { q: "30 dias é possível de verdade?",             a: "Sim — IA comprime o diagnóstico para dias, não semanas. A construção segue um método testado, não improvisação. O que levaria 3–6 meses com um dev, entregamos em 30 dias com qualidade e você no controle." },
  { q: "Minha equipe não entende de tecnologia.",    a: "O sistema é construído para sua equipe atual usar. A capacitação faz parte da entrega — você sai sem depender de suporte técnico externo." },
  { q: "Já tentei automatizar antes e não funcionou.", a: "O que faltou foi diagnóstico antes de construir. Esse é exatamente nosso ponto de partida obrigatório — sem diagnóstico, não há construção." },
  { q: "Como sei que funciona para o meu negócio?", a: "Começamos pelo Diagnóstico — você vê o valor e o plano de sistemas antes de decidir avançar para a implantação completa." },
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
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 18 }}>
      <div style={{ height: 1, width: 32, background: `linear-gradient(to right, transparent, ${color}50)` }} />
      <p style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: MONO, margin: 0 }}>{children}</p>
      <div style={{ height: 1, width: 32, background: `linear-gradient(to left, transparent, ${color}50)` }} />
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
        .pf-card .pf-panel {
          transform: translateY(0);
        }
        .pf-card {
          transition: border-color 0.25s, box-shadow 0.25s;
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
              <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></div>
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
        <section style={{ position: "relative", overflow: "hidden", paddingTop: 48, paddingBottom: 56, paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
          {/* Tech grid lines no hero */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)`, backgroundSize: "80px 80px", pointerEvents: "none" }} />
          {/* Orbs de fundo */}
          <div style={{ position: "absolute", top: -160, right: -80, width: 700, height: 700, borderRadius: "50%", background: GOLD, opacity: 0.05, filter: "blur(140px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -160, left: -80, width: 560, height: 560, borderRadius: "50%", background: "#1a4fd6", opacity: 0.07, filter: "blur(120px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: `radial-gradient(ellipse, ${GOLD}0d 0%, transparent 65%)`, pointerEvents: "none" }} />
          {/* Horizontal scan line */}
          <div style={{ position: "absolute", top: "60%", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}20 30%, ${GOLD}40 50%, ${GOLD}20 70%, transparent)`, pointerEvents: "none" }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

            {/* ── Coluna esquerda — texto */}
            <div>
              {/* Badge terminal CLI */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 8, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(201,168,76,0.22)", marginBottom: 32, backdropFilter: "blur(8px)" }}>
                <span style={{ position: "relative", display: "flex", width: 7, height: 7 }}>
                  <span style={{ position: "absolute", display: "inline-flex", width: "100%", height: "100%", borderRadius: "50%", background: "#4ade80", animation: "pulse-ring 1.5s cubic-bezier(0,0,0.2,1) infinite", opacity: 0.7 }} />
                  <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", width: 7, height: 7, background: "#4ade80" }} />
                </span>
                <span style={{ fontFamily: MONO, color: "rgba(255,255,255,0.35)", fontSize: 11 }}>$</span>
                <span style={{ fontFamily: MONO, color: GOLD, fontSize: 11, letterSpacing: "0.04em" }}>leap build --turma-zero --preco R$498</span>
                <span className="cursor" style={{ fontFamily: MONO, color: GOLD, fontSize: 11 }}>█</span>
              </div>

              <h1 style={{
                fontFamily: "'General Sans',sans-serif",
                fontSize: "clamp(1.7rem, 2.8vw, 2.6rem)",
                fontWeight: 700, lineHeight: 1.04,
                color: "white", marginBottom: 20,
                letterSpacing: "-0.03em",
                textShadow: "0 4px 60px rgba(0,0,0,0.4)",
              }}>
                Você usa IA.<br />
                Enquanto seu concorrente<br />
                <span style={{ color: GOLD }}>a comanda.</span>
              </h1>

              <p style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", color: "rgba(255,255,255,0.5)", marginBottom: 36, lineHeight: 1.75, fontStyle: "italic", fontFamily: "'Libre Baskerville',serif" }}>
                O Método LEAP transforma você no profissional que o mercado está buscando: quem não só usa IA, mas lidera, automatiza e faz o negócio escalar com ela. Sem programar uma linha de código.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 40 }}>
                <Link href="/cliente" className="btn-gold" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 28px", borderRadius: 14, fontWeight: 700,
                  fontSize: "0.97rem", color: NAVY, textDecoration: "none",
                  boxShadow: "0 0 40px rgba(201,168,76,0.35)",
                }}>
                  Dê o salto agora →
                </Link>
                <Link href="/member/login" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 22px", borderRadius: 16, fontWeight: 700,
                  fontSize: "0.88rem", color: "rgba(255,255,255,0.65)",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  textDecoration: "none", transition: "all 0.2s"
                }}>
                  Já sou membro
                </Link>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {([
                  { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, text: "10+ sistemas de IA" },
                  { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>, text: "5 SaaS em produção" },
                  { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 13 9 20 9"/><path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34"/><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/></svg>, text: "0 linhas de código" },
                ] as { icon: React.ReactNode; text: string }[]).map(p => (
                  <div key={p.text} style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "6px 13px", borderRadius: 100,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
                    fontSize: 12, color: "rgba(255,255,255,0.5)"
                  }}>
                    <span style={{ display:"flex", alignItems:"center", color:"rgba(255,255,255,0.45)" }}>{p.icon}</span>{p.text}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 11, marginTop: 24, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>
                LEAP BUILD · 22 aulas · Acesso vitalício · Garantia de 7 dias
              </p>
            </div>

            {/* ── Coluna direita — LEAP pipeline dashboard */}
            <div style={{ borderRadius: 20, border: "1px solid rgba(201,168,76,0.18)", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(16px)", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
              {/* Titlebar */}
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.4)" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                </div>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.25)", marginLeft: 6 }}>leap.pipeline</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
                  <span style={{ fontFamily: MONO, fontSize: 9, color: "#4ade80" }}>3 / 4 completo</span>
                </div>
              </div>

              {/* Gradient progress bar */}
              <div style={{ height: 2, background: "rgba(255,255,255,0.04)", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "75%", background: `linear-gradient(90deg, ${GOLD}, #60a5fa, #34d399)`, boxShadow: "0 0 8px rgba(52,211,153,0.5)" }} />
              </div>

              {/* Metrics strip */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {[
                  { val: "30d",  label: "prazo",  color: GOLD },
                  { val: "0",    label: "LOC",    color: "#60a5fa" },
                  { val: "24/7", label: "ativo",  color: "#34d399" },
                ].map((m, i) => (
                  <div key={m.label} style={{ padding: "10px 0", textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 800, color: m.color, fontSize: "1rem", lineHeight: 1, margin: 0 }}>{m.val}</p>
                    <p style={{ fontFamily: MONO, fontSize: 8, color: "rgba(255,255,255,0.22)", margin: "3px 0 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Steps */}
              <div style={{ padding: "16px", position: "relative" }}>
                {/* Vertical connector line */}
                <div style={{ position: "absolute", left: 30, top: 26, width: 1, height: "calc(100% - 80px)", background: "linear-gradient(to bottom, rgba(201,168,76,0.35) 0%, rgba(96,165,250,0.35) 33%, rgba(52,211,153,0.45) 66%, rgba(167,139,250,0.12) 100%)", pointerEvents: "none" }} />

                {[
                  { letter: "L", label: "Levantar",    desc: "diagnóstico completo do negócio",     status: "done",   color: GOLD },
                  { letter: "E", label: "Escolher",    desc: "plano de sistemas personalizado",      status: "done",   color: "#60a5fa" },
                  { letter: "A", label: "Automatizar", desc: "1 sistema de IA construído e rodando", status: "active", color: "#34d399" },
                  { letter: "P", label: "Performar",   desc: "entrega + você operando sozinho",      status: "next",   color: "#a78bfa" },
                ].map((step, i) => (
                  <div key={step.letter} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 10, marginBottom: i < 3 ? 6 : 0,
                    background: step.status === "active" ? `${step.color}0d` : "transparent",
                    border: step.status === "active" ? `1px solid ${step.color}30` : "1px solid transparent",
                    position: "relative",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: step.status === "done" ? `${step.color}20` : step.status === "active" ? `${step.color}22` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${step.status !== "next" ? step.color + "45" : "rgba(255,255,255,0.07)"}`,
                      flexShrink: 0, position: "relative", zIndex: 1,
                      boxShadow: step.status === "active" ? `0 0 10px ${step.color}35` : "none",
                    }}>
                      {step.status === "done"
                        ? <span style={{ color: step.color, fontSize: 11 }}>✓</span>
                        : <span style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: step.status === "next" ? "rgba(255,255,255,0.2)" : step.color, fontSize: "0.8rem" }}>{step.letter}</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, color: step.status === "next" ? "rgba(255,255,255,0.35)" : "white", fontSize: "0.8rem" }}>{step.label}</span>
                        <span style={{
                          fontFamily: MONO, fontSize: 8, padding: "1px 6px", borderRadius: 3, letterSpacing: "0.05em",
                          color: step.status === "done" ? "#4ade80" : step.status === "active" ? step.color : "rgba(255,255,255,0.18)",
                          background: step.status === "done" ? "rgba(74,222,128,0.1)" : step.status === "active" ? `${step.color}12` : "rgba(255,255,255,0.04)",
                          border: `1px solid ${step.status === "done" ? "rgba(74,222,128,0.2)" : step.status === "active" ? step.color + "30" : "rgba(255,255,255,0.06)"}`,
                        }}>
                          {step.status === "done" ? "✓ done" : step.status === "active" ? "▶ running" : "queued"}
                        </span>
                      </div>
                      <p style={{ fontFamily: MONO, fontSize: 9, color: step.status === "next" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.3)", margin: 0, letterSpacing: "0.02em" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Footer status */}
                <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 8, background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", flexShrink: 0 }} />
                  <span style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>sistema ativo · 0 linhas de código · acesso vitalício</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── TOOLS BAND ──────────────────────────────────────────────────── */}
        <section style={{ padding: "28px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.28)", overflow: "hidden" }}>
          <p style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.22em", textTransform: "uppercase", textAlign: "center", marginBottom: 18 }}>ferramentas que você vai dominar</p>
          <div style={{ position: "relative" }}>
            {/* Fade esquerda */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 10, pointerEvents: "none", background: `linear-gradient(to right, ${DARK}, transparent)` }} />
            {/* Fade direita */}
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 10, pointerEvents: "none", background: `linear-gradient(to left, ${DARK}, transparent)` }} />
            {/* Track — scroll infinito */}
            <div className="animate-scroll-x" style={{ display: "flex", gap: 14, width: "max-content", paddingLeft: 14 }}>
              {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
                <div key={i}
                  style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 92, height: 84, borderRadius: 16, gap: 7, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)", cursor: "default", transition: "all 0.2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(201,168,76,0.65)"; el.style.transform = "scale(1.08)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)"; (el.parentElement as HTMLElement).style.animationPlayState = "paused"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.10)"; el.style.transform = "scale(1)"; el.style.boxShadow = "none"; (el.parentElement as HTMLElement).style.animationPlayState = "running"; }}>
                  <img src={tech.logoUrl} alt={tech.name} style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }} />
                  <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 500, letterSpacing: "0.04em", color: "rgba(255,255,255,0.38)", lineHeight: 1 }}>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NÚMEROS ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "80px 1.5rem", background: "rgba(0,0,0,0.35)", borderTop: `1px solid rgba(201,168,76,0.08)`, borderBottom: `1px solid rgba(201,168,76,0.08)` }}>
          <div data-fade="" style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[
              { n: "60%",  d: "menos tarefas manuais. Clientes reais rodando automações com o Método LEAP.", accent: GOLD },
              { n: "10",   d: "dias para o primeiro sistema. Da ideia ao deploy, sem uma linha de código.", accent: "#60a5fa" },
              { n: "24/7", d: "operação no automático. Os sistemas do LEAP rodam enquanto você dorme.", accent: "#34d399" },
              { n: "0",    d: "linhas de código. Tudo que Peterson ensina, qualquer gestor consegue replicar.", accent: "#a78bfa" },
            ].map(r => (
              <div key={r.n} className="tech-card" style={{ padding: "28px 24px", borderRadius: 16, background: "rgba(255,255,255,0.025)", border: `1px solid ${r.accent}20`, position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${r.accent}45`; (e.currentTarget as HTMLElement).style.background = `${r.accent}06`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${r.accent}20`; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}>
                <div className="scan-line" />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${r.accent}80, transparent)` }} />
                <div style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,3vw,2.7rem)", color: r.accent, lineHeight: 1, marginBottom: 14, letterSpacing: "-0.02em" }}>{r.n}</div>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.65, margin: 0 }}>{r.d}</p>
              </div>
            ))}
          </div>
        </section>

        <GoldDivider />

        {/* ── DOR / AGITAÇÃO ──────────────────────────────────────────────── */}
        <section style={{ padding: "80px 1.5rem" }}>
          <div data-fade="" style={{ maxWidth: 760, margin: "0 auto" }}>
            <SectionLabel>Seja honesto</SectionLabel>
            <h2 style={{ fontFamily: "'General Sans',sans-serif", fontSize: "clamp(1.6rem,2.8vw,2.2rem)", fontWeight: 800, color: "white", lineHeight: 1.08, textAlign: "center", marginBottom: 40, letterSpacing: "-0.02em" }}>
              Você reconhece{" "}
              <span style={{ color: GOLD }}>algum destes cenários?</span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
              {DORES.map((dor, i) => {
                const cores = [GOLD, "#60a5fa", "#34d399", "#f97316"];
                const icons: React.ReactNode[] = [
                  <svg key="0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
                  <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
                  <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                ];
                const bgAlpha = [
                  "rgba(201,168,76,0.07)", "rgba(96,165,250,0.07)",
                  "rgba(52,211,153,0.07)", "rgba(249,115,22,0.07)",
                ];
                return (
                  <div key={i}
                    style={{ padding: "22px 28px", borderRadius: "0 14px 14px 0", background: "rgba(255,255,255,0.025)", borderLeft: `3px solid ${cores[i]}`, transition: "background 0.2s, transform 0.2s", cursor: "default", display: "flex", alignItems: "flex-start", gap: 16 }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = bgAlpha[i]; el.style.transform = "translateX(4px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.025)"; el.style.transform = "translateX(0)"; }}>
                    <span style={{ color: cores[i], flexShrink: 0, marginTop: 2, display:"flex" }}>{icons[i]}</span>
                    <p style={{ fontSize: "1.02rem", lineHeight: 1.7, color: "rgba(255,255,255,0.75)", margin: 0 }}>{dor}</p>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "28px 32px", borderRadius: 18, background: "rgba(201,168,76,0.06)", border: `1px solid ${GOLD}25`, borderLeft: `4px solid ${GOLD}` }}>
              <p style={{ fontWeight: 700, color: "white", fontSize: "1.1rem", marginBottom: 10 }}>O problema não é falta de informação. É falta de método.</p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.92rem", lineHeight: 1.8, margin: 0 }}>
                Você tem ferramentas. O que falta é saber como usá-las de forma integrada, estratégica e lucrativa — e é exatamente isso que o <strong style={{ color: "white" }}>Método LEAP</strong> ensina.
              </p>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── MÉTODO LEAP ─────────────────────────────────────────────────── */}
        <section id="metodo" style={{ padding: "72px 1.5rem", position: "relative", overflow: "hidden", background: "linear-gradient(160deg, rgba(201,168,76,0.07) 0%, rgba(15,32,68,0.5) 35%, rgba(5,13,26,1) 70%)" }}>
          {/* Grid lines overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
          {/* Radial glow */}
          <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: `radial-gradient(ellipse, ${GOLD}0d 0%, transparent 60%)`, pointerEvents: "none" }} />
          <div data-fade="" style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>A solução</SectionLabel>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontSize: "clamp(1.6rem,2.8vw,2.2rem)", fontWeight: 800, color: "white", lineHeight: 1.06, letterSpacing: "-0.025em" }}>
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
                  <div className="leap-letter" style={{ position: "absolute", top: -8, right: -8, fontSize: "5rem", fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: f.cor, opacity: 0.04, lineHeight: 1, userSelect: "none", transition: "all 0.3s ease", pointerEvents: "none" }}>{f.letra}</div>
                  <div style={{ fontFamily: "'General Sans',sans-serif", fontSize: "1.9rem", fontWeight: 700, color: f.cor, marginBottom: 10, position: "relative" }}>{f.letra}</div>
                  <div style={{ fontWeight: 700, color: "white", fontSize: "1.05rem", marginBottom: 10 }}>{f.titulo}</div>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", padding: "36px 32px", borderRadius: 20, background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(15,32,68,0))", border: "1px solid rgba(201,168,76,0.18)" }}>
              <p style={{ fontWeight: 700, color: "white", fontSize: "1.1rem", marginBottom: 8 }}>Peterson Oliveira criou o Método LEAP e formou uma nova categoria profissional:</p>
              <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "1.4rem", color: GOLD, margin: "0 0 6px" }}>O Gestor de IA.</p>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>O profissional que lidera, escala, automatiza e performa com inteligência artificial — sem precisar saber programar.</p>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── TRILOGIA ────────────────────────────────────────────────────── */}
        <section id="cursos" style={{ padding: "72px 1.5rem" }}>
          <div data-fade="" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>Os produtos</SectionLabel>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontSize: "clamp(1.6rem,2.8vw,2.2rem)", fontWeight: 800, color: "white", lineHeight: 1.06, letterSpacing: "-0.025em" }}>
                Três cursos. <span style={{ color: GOLD }}>Uma jornada completa.</span>
              </h2>
              <p style={{ marginTop: 18, fontSize: "0.97rem", color: "rgba(255,255,255,0.45)" }}>Quem entrar no BUILD agora garante o preço turma zero nos três.</p>
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
                        <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.5rem", lineHeight: 1 }}>{c.preco}</p>
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
                <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "2.4rem", color: "#a78bfa", lineHeight: 1 }}>R$998</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: 4 }}>bundle turma zero · R$1.998 depois</p>
              </div>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── CONSULTORIA ─────────────────────────────────────────────────── */}
        <section id="consultoria" style={{ padding: "80px 1.5rem" }}>
          <div data-fade="" style={{ maxWidth: 1080, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 800, color: "white", fontSize: "clamp(1.6rem,2.8vw,2.2rem)", lineHeight: 1.06, marginBottom: 16, letterSpacing: "-0.025em" }}>
                Seu negócio <span style={{ color: GOLD }}>inteligente</span> em 30 dias.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "1rem", lineHeight: 1.75, maxWidth: 580, margin: "0 auto" }}>
                Diagnóstico completo + sistema de IA construído e rodando. Sem saber programar. Sem depender de desenvolvedor.
              </p>
            </div>

            {/* ── Pacotes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 48 }}>

              {/* Pacote 1 — Entrada */}
              <div style={{ borderRadius: 20, padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column" }}>
                <p style={{ fontFamily: MONO, fontSize: 10, color: `${GOLD}80`, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>entrada</p>
                <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.15rem", marginBottom: 16 }}>Só o Diagnóstico</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                  {["Mapeamento completo da operação","Plano de sistemas personalizado","2 encontros 1:1 com Peterson","Entregue em até 5 dias úteis","Valor abatido na implantação"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                      <span style={{ color: GOLD, fontFamily: MONO, fontSize: 11, marginTop: 1, flexShrink: 0 }}>→</span>{item}
                    </li>
                  ))}
                </ul>
                <div>
                  <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "white", lineHeight: 1, marginBottom: 4 }}>R$998</p>
                  <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.25)" }}>pagamento único</p>
                </div>
              </div>

              {/* Pacote 2 — Completo [recomendado] */}
              <div style={{ borderRadius: 20, padding: "28px", background: `linear-gradient(160deg, rgba(15,32,68,0.6), rgba(5,13,26,0.9))`, border: `1px solid ${GOLD}`, boxShadow: `0 0 48px ${GOLD}12`, position: "relative", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "absolute", top: -1, right: 20, background: GOLD, color: NAVY, fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", fontWeight: 700, padding: "4px 12px", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>
                  recomendado
                </div>
                <p style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>completo</p>
                <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.15rem", marginBottom: 16 }}>Diagnóstico + Sistema em 30 dias</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                  {["Tudo do Diagnóstico","Construção do sistema prioritário","5 encontros 1:1 ao longo do processo","Acompanhamento semanal da equipe","Entrega com sistema rodando"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
                      <span style={{ color: GOLD, fontFamily: MONO, fontSize: 11, marginTop: 1, flexShrink: 0 }}>→</span>{item}
                    </li>
                  ))}
                </ul>
                <div>
                  <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "1.5rem", color: GOLD, lineHeight: 1, marginBottom: 4 }}>
                    R$2.498 <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>– R$4.498</span>
                  </p>
                  <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.25)" }}>conforme escopo</p>
                </div>
              </div>

              {/* Pacote 3 — Exclusivo */}
              <div style={{ borderRadius: 20, padding: "28px", background: "linear-gradient(160deg, rgba(124,58,237,0.1), rgba(5,13,26,0.92))", border: "1px solid rgba(124,58,237,0.4)", boxShadow: "0 0 48px rgba(124,58,237,0.08)", position: "relative", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "absolute", top: -1, right: 20, background: "#7c3aed", color: "white", fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", fontWeight: 700, padding: "4px 12px", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>
                  exclusivo
                </div>
                <p style={{ fontFamily: MONO, fontSize: 10, color: "#a78bfa", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>para negócios</p>
                <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.15rem", marginBottom: 16 }}>Exclusivo</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                  {["Tudo do Completo","Sistema construído pelo time IA com Peterson","Suporte exclusivo pós-entrega","SLA garantido","Para operações complexas e escala"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                      <span style={{ color: "#a78bfa", fontFamily: MONO, fontSize: 11, marginTop: 1, flexShrink: 0 }}>→</span>{item}
                    </li>
                  ))}
                </ul>
                <div>
                  <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#a78bfa", lineHeight: 1, marginBottom: 4 }}>Sob consulta</p>
                  <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.25)" }}>fale com Peterson</p>
                </div>
              </div>
            </div>

            {/* ── Timeline 30 dias */}
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.22em", textTransform: "uppercase", textAlign: "center", marginBottom: 20 }}>o caminho em 30 dias</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { letters: ["L"], name: "Levantar — Diagnóstico Completo",   desc: "Call de imersão + mapeamento de processos com IA + identificação de gargalos e oportunidades de automação.", week: "semana 1", color: GOLD },
                  { letters: ["E"], name: "Escolher — Plano de Sistemas",       desc: "Quais ferramentas de IA usar, por onde começar e qual sistema construir primeiro. Plano personalizado aprovado com você.", week: "semana 1", color: "#60a5fa" },
                  { letters: ["A"], name: "Automatizar — Construção",            desc: "Construção de 1 sistema prioritário: robô de atendimento, agendamento ou gestão integrada com IA. Checkpoints semanais.", week: "semanas 2–3", color: "#34d399" },
                  { letters: ["P"], name: "Performar — Entrega & Operação",      desc: "Sistema entregue e funcionando + orientação completa para o dono operar sozinho, sem depender de suporte técnico.", week: "semana 4", color: "#a78bfa" },
                ].map(step => (
                  <div key={step.name} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 20, padding: "20px 24px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${step.color}` }}>
                    <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                      {step.letters.map(l => (
                        <div key={l} style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${step.color}15`, border: `1px solid ${step.color}35` }}>
                          <span style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: step.color, fontSize: "1rem" }}>{l}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "white", fontSize: "0.9rem", margin: "0 0 4px" }}>{step.name}</p>
                      <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
                    </div>
                    <div style={{ flexShrink: 0, fontFamily: MONO, fontSize: 10, color: step.color, background: `${step.color}10`, border: `1px solid ${step.color}25`, padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>
                      {step.week}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── O que você recebe (deliverables 2×2) */}
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.22em", textTransform: "uppercase", textAlign: "center", marginBottom: 20 }}>o que você recebe</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {([
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>, num: "01", title: "Diagnóstico Completo", desc: "Mapeamento de processos, gargalos identificados e oportunidades priorizadas — entregue na semana 1.", color: GOLD, tag: "Semana 1" },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>, num: "02", title: "Plano de Sistemas", desc: "Roadmap personalizado com ferramentas, prioridades e sequência de implantação — aprovado com você.", color: "#60a5fa", tag: "Semana 1" },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>, num: "03", title: "1 Sistema com IA Rodando", desc: "Atendimento automatizado, gestão ou integração de dados — construído, testado e entregue em 30 dias.", color: "#34d399", tag: "30 dias" },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, num: "04", title: "Capacitação da Equipe", desc: "Treinamento para operar com autonomia total — sem suporte técnico externo, sem dependência.", color: "#a78bfa", tag: "Entrega final" },
                ] as { icon: React.ReactNode; num: string; title: string; desc: string; color: string; tag: string }[]).map(d => (
                  <div key={d.title}
                    style={{
                      padding: "22px 22px", borderRadius: 14,
                      background: "rgba(255,255,255,0.025)",
                      border: `1px solid rgba(255,255,255,0.07)`,
                      borderTop: `2px solid ${d.color}45`,
                      transition: "border-color 0.2s, background 0.2s",
                      position: "relative", overflow: "hidden",
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${d.color}07`; el.style.borderColor = `${d.color}28`; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.025)"; el.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                    {/* Number watermark */}
                    <div style={{ position: "absolute", top: -6, right: 10, fontFamily: "'General Sans',sans-serif", fontWeight: 800, fontSize: "3rem", color: d.color, opacity: 0.05, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{d.num}</div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${d.color}12`, border: `1px solid ${d.color}28`, flexShrink: 0 }}>
                        <span style={{ display:"flex", color: d.color }}>{d.icon}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <p style={{ fontWeight: 700, color: "white", fontSize: "0.88rem", margin: 0 }}>{d.title}</p>
                          <span style={{ fontFamily: MONO, fontSize: 8, color: d.color, background: `${d.color}12`, border: `1px solid ${d.color}28`, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.05em", flexShrink: 0 }}>{d.tag}</span>
                        </div>
                        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65, margin: 0 }}>{d.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Comparativo */}
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.22em", textTransform: "uppercase", textAlign: "center", marginBottom: 20 }}>o custo real de não ter método</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 52px 1fr", gap: 0, alignItems: "stretch" }}>

                {/* Sem LEAP */}
                <div style={{ borderRadius: "16px 0 0 16px", overflow: "hidden", background: "rgba(255,107,107,0.04)", border: "1px solid rgba(255,107,107,0.18)", borderRight: "none" }}>
                  <div style={{ padding: "14px 20px 10px", background: "rgba(255,107,107,0.06)" }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f87171", fontWeight: 700 }}>❌ Sem Método LEAP</span>
                  </div>
                  <div style={{ padding: "4px 20px 20px" }}>
                    {[
                      ["Freelancer / Dev avulso", "R$3–8K"],
                      ["Retrabalho e revisões", "+R$2–4K"],
                      ["Manutenção mensal", "R$500–1.5K/mês"],
                      ["Horas gerenciando dev", "~20h/mês"],
                      ["Prazo de entrega", "3–6 meses"],
                      ["Controle sobre o sistema", "Nenhum"],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)" }}>{label}</span>
                        <span style={{ fontFamily: MONO, fontSize: "0.78rem", fontWeight: 700, color: "#f87171" }}>{val}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 10, background: "rgba(255,107,107,0.07)", border: "1px solid rgba(255,107,107,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>Custo no primeiro ano</span>
                      <span style={{ fontFamily: MONO, fontSize: "1.05rem", fontWeight: 700, color: "#f87171" }}>~R$20–30K</span>
                    </div>
                  </div>
                </div>

                {/* VS divider */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0, background: "rgba(255,255,255,0.015)", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(15,32,68,0.95)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 700, position: "relative", zIndex: 1, boxShadow: "0 0 0 4px rgba(5,13,26,0.8)" }}>VS</div>
                </div>

                {/* Com LEAP */}
                <div style={{ borderRadius: "0 16px 16px 0", overflow: "hidden", background: `linear-gradient(160deg, rgba(15,32,68,0.5), rgba(5,13,26,0.85))`, border: `1px solid ${GOLD}40`, borderLeft: "none", boxShadow: `0 0 32px ${GOLD}08` }}>
                  <div style={{ padding: "14px 20px 10px", background: `${GOLD}08` }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, fontWeight: 700 }}>✓ Com Método LEAP</span>
                  </div>
                  <div style={{ padding: "4px 20px 20px" }}>
                    {[
                      ["Investimento na consultoria", "R$2.5–4.5K"],
                      ["Retrabalho", "R$0"],
                      ["Manutenção (você mesmo)", "R$0/mês"],
                      ["Horas gerenciando", "~2h/mês"],
                      ["Prazo de entrega", "30 dias"],
                      ["Controle sobre o sistema", "Total"],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)" }}>{label}</span>
                        <span style={{ fontFamily: MONO, fontSize: "0.78rem", fontWeight: 700, color: GOLD }}>{val}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 10, background: `${GOLD}08`, border: `1px solid ${GOLD}25`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>Custo no primeiro ano</span>
                      <span style={{ fontFamily: MONO, fontSize: "1.05rem", fontWeight: 700, color: GOLD }}>R$2.5–4.5K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CTA consultoria */}
            <div style={{ textAlign: "center" }}>
              <a href="https://wa.me/5584999867636" className="btn-gold" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 40px", borderRadius: 16, fontWeight: 700, fontSize: "1rem",
                color: NAVY, textDecoration: "none", boxShadow: `0 0 48px ${GOLD}35`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                {" "}Falar com Peterson →
              </a>
              <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em", marginTop: 14 }}>
                Vagas limitadas · Diagnóstico em 5 dias · Sistema em 30 dias
              </p>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.18)", marginTop: 6 }}>
                Peterson atende poucos clientes por vez para garantir profundidade e resultado real.
              </p>
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

              {/* Credential grid — row 1: outputs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
                {([
                  { n: "10+", l: "Sistemas de IA", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg> },
                  { n: "10+", l: "Sites e LPs",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
                  { n: "5",   l: "SaaS criados",   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
                ] as { n: string; l: string; icon: React.ReactNode }[]).map(c => (
                  <div key={c.l} style={{ textAlign: "center", padding: "16px 12px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom: 4 }}>{c.icon}</div>
                    <p style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "1.4rem", color: GOLD, lineHeight: 1, marginBottom: 4 }}>{c.n}</p>
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.3 }}>{c.l}</p>
                  </div>
                ))}
              </div>
              {/* Credential grid — row 2: experiência */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 28 }}>
                {([
                  { n: "10+", l: "Anos em gestão e projetos", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
                  { n: "~4",  l: "Anos com IA e automação",   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> },
                ] as { n: string; l: string; icon: React.ReactNode }[]).map(c => (
                  <div key={c.l} style={{ textAlign: "center", padding: "16px 12px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom: 4 }}>{c.icon}</div>
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
        <section style={{ padding: "72px 0 80px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          {/* Header */}
          <div data-fade="" style={{ textAlign: "center", marginBottom: 48, padding: "0 1.5rem" }}>
            <SectionLabel>Portfólio</SectionLabel>
            <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 800, color: "white", fontSize: "clamp(1.6rem,2.8vw,2.2rem)", lineHeight: 1.06, letterSpacing: "-0.025em" }}>
              O que foi construído
            </h2>
            <p style={{ marginTop: 12, fontSize: "0.88rem", color: "rgba(255,255,255,0.35)", maxWidth: 460, margin: "12px auto 0" }}>
              Peterson não ensina o que leu. Ensina o que construiu. Cada um desses sistemas existe, roda e tem clientes reais.
            </p>
          </div>

          {/* Carousel */}
          <div style={{ position: "relative" }}>
            {/* Edge fades */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 10, pointerEvents: "none", background: `linear-gradient(to right, ${DARK}, transparent)` }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 10, pointerEvents: "none", background: `linear-gradient(to left, ${DARK}, transparent)` }} />

            {/* Track */}
            <div className="pf-carousel-track animate-scroll-pf" style={{ display: "flex", gap: 20, width: "max-content", paddingLeft: 20 }}>
              {[...SAAS_CASES, ...SAAS_CASES].map((s, i) => {
                const inner = (
                  <>
                    {/* Screenshot bg */}
                    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                      <img src={s.screenshot} alt={s.nome}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,13,26,0.08) 0%, rgba(5,13,26,0.15) 45%, rgba(5,13,26,0.92) 100%)" }} />
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }} />
                    </div>
                    {/* File tab */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, zIndex: 3 }}>
                      <span style={{ fontFamily: MONO, color: `${s.accent}90`, fontSize: 10 }}>▶</span>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>{s.nome.toLowerCase().replace(/ /g, "-")}.ts</span>
                      <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
                        {[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />)}
                      </div>
                    </div>
                    {/* Info panel */}
                    <div className="pf-panel" style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 4,
                      padding: "14px 18px 18px",
                      background: "linear-gradient(to top, rgba(5,13,26,0.98) 65%, rgba(5,13,26,0.85) 100%)",
                      backdropFilter: "blur(12px)",
                      borderTop: `1px solid ${s.accent}28`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "0.95rem", margin: 0, lineHeight: 1.2 }}>{s.nome}</h3>
                        {s.href && <span style={{ fontSize: "0.62rem", fontWeight: 600, color: s.accent, letterSpacing: "0.05em" }}>visitar →</span>}
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", margin: "0 0 10px", lineHeight: 1.4 }}>{s.categoria}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {s.stack.map(t => (
                          <span key={t} style={{ fontSize: "0.64rem", fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${s.accent}12`, color: s.accent, border: `1px solid ${s.accent}26` }}>{t}</span>
                        ))}
                        {s.entregue
                          ? <span style={{ fontSize: "0.64rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(201,168,76,0.14)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.32)", letterSpacing: "0.02em" }}>Entregue</span>
                          : <span style={{ fontSize: "0.64rem", fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "rgba(52,211,153,0.10)", color: "#34d399", border: "1px solid rgba(52,211,153,0.22)" }}>Em produção</span>
                        }
                      </div>
                    </div>
                  </>
                );

                return s.href
                  ? (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="pf-card"
                      style={{
                        flexShrink: 0, position: "relative", borderRadius: 18, overflow: "hidden",
                        width: 340, height: 290,
                        border: `1px solid ${s.accent}22`,
                        textDecoration: "none", display: "block",
                        transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(-4px) scale(1.01)";
                        el.style.boxShadow = `0 28px 64px ${s.accent}28`;
                        el.style.borderColor = s.accent + "55";
                        el.closest(".animate-scroll-pf")!.classList.add("paused");
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "none";
                        el.style.boxShadow = "none";
                        el.style.borderColor = s.accent + "22";
                        el.closest(".animate-scroll-pf")!.classList.remove("paused");
                      }}
                    >{inner}</a>
                  )
                  : (
                    <div key={i} className="pf-card"
                      style={{
                        flexShrink: 0, position: "relative", borderRadius: 18, overflow: "hidden",
                        width: 340, height: 290,
                        border: `1px solid ${s.accent}22`,
                        transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(-4px) scale(1.01)";
                        el.style.boxShadow = `0 28px 64px ${s.accent}22`;
                        el.style.borderColor = s.accent + "44";
                        el.closest(".animate-scroll-pf")!.classList.add("paused");
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "none";
                        el.style.boxShadow = "none";
                        el.style.borderColor = s.accent + "22";
                        el.closest(".animate-scroll-pf")!.classList.remove("paused");
                      }}
                    >{inner}</div>
                  );
              })}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── DEPOIMENTOS ─────────────────────────────────────────────────── */}
        <section style={{ padding: "80px 1.5rem" }}>
          <div data-fade="" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>Resultados reais</SectionLabel>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 800, color: "white", fontSize: "clamp(1.6rem,2.8vw,2.2rem)", lineHeight: 1.06, marginBottom: 20, letterSpacing: "-0.025em" }}>
                Quem já recebeu uma solução
              </h2>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: `1px solid rgba(201,168,76,0.18)` }}>
                <span style={{ fontFamily: MONO, color: `${GOLD}60`, fontSize: 10 }}>{">"}</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>3/4 depoimentos — 1 a caminho</span>
                <span className="cursor" style={{ fontFamily: MONO, color: GOLD, fontSize: 10 }}>█</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {([
                {
                  initials: "SE",
                  foto: "/photos/sabrina-espinos.jpg",
                  nome: "Sabrina Espinós",
                  cargo: "CEO",
                  empresa: "IAra",
                  depoimento: "O trabalho do Peterson na IAra foi essencial para transformar uma ideia em algo real, funcional e estratégico. Ele foi responsável pela criação da plataforma, desenvolvimento do Hub de materiais, estruturação do bot de atendimento e integração das funcionalidades que tornam a experiência muito mais fluida e inteligente. O que mais impressiona é a capacidade dele de unir visão estratégica, agilidade e execução. Tudo isso sendo desenvolvido em um tempo extremamente rápido, sem perder qualidade, organização e atenção aos detalhes.",
                },
                {
                  initials: "SJ",
                  foto: "/photos/sarah-justus.jpg",
                  nome: "Sarah Justus",
                  cargo: "Co-founder · Gestora de Tráfego",
                  empresa: "Forget.co",
                  depoimento: "A entrega foi feita de forma extremamente rápida, seguindo os direcionamentos de layout e copy, além disso os ajustes foram feitos muito rápidos também e tivemos a entrega dentro do prazo e suporte necessário. Indico muito!",
                },
                {
                  initials: "MO",
                  foto: "/photos/marina-oliveira.jpg",
                  nome: "Marina Oliveira",
                  cargo: "Estrategista de Expansão de Negócios · Founder",
                  empresa: "MOR & Co",
                  depoimento: "Estar em projetos com o Peterson é ter por perto alguém que faz a régua subir. Ele entende o problema, organiza rapidamente caminhos possíveis e usa tecnologia, especialmente IA, estrategicamente. Ele orquestra muito bem a visão de negócio, leitura de pessoas, pensamento estruturado e capacidade real de transformar ideia em produtos e melhoria concreta. É o tipo de pessoa que amplia a qualidade das decisões.",
                },
              ] as Array<{ initials: string; foto: string | null; nome: string; cargo: string; empresa: string; depoimento: string | null }>).map(d => (
                <div key={d.nome} style={{ position: "relative", borderRadius: 12, padding: "24px", overflow: "hidden", background: "rgba(255,255,255,0.02)", border: `1px solid ${d.depoimento ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.12)"}` }}>
                  {/* Corner brackets */}
                  <div style={{ position: "absolute", top: 10, left: 10, width: 12, height: 12, borderTop: `1px solid ${GOLD}35`, borderLeft: `1px solid ${GOLD}35` }} />
                  <div style={{ position: "absolute", top: 10, right: 10, width: 12, height: 12, borderTop: `1px solid ${GOLD}35`, borderRight: `1px solid ${GOLD}35` }} />
                  <div style={{ position: "absolute", bottom: 10, left: 10, width: 12, height: 12, borderBottom: `1px solid ${GOLD}35`, borderLeft: `1px solid ${GOLD}35` }} />
                  <div style={{ position: "absolute", bottom: 10, right: 10, width: 12, height: 12, borderBottom: `1px solid ${GOLD}35`, borderRight: `1px solid ${GOLD}35` }} />

                  {/* Header identidade */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    {d.foto ? (
                      <img src={d.foto} alt={d.nome} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", objectPosition: "top center", flexShrink: 0, border: `2px solid rgba(201,168,76,0.40)`, boxShadow: `0 0 20px rgba(201,168,76,0.15)` }} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem", flexShrink: 0, background: "rgba(201,168,76,0.10)", border: "2px solid rgba(201,168,76,0.25)", color: GOLD, fontFamily: MONO }}>
                        {d.initials}
                      </div>
                    )}
                    <div>
                      <p style={{ fontWeight: 700, color: "white", fontSize: "0.95rem", margin: 0 }}>{d.nome}</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.38)", margin: "3px 0 0", lineHeight: 1.4 }}>{d.cargo} · {d.empresa}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ color: GOLD, fontSize: "1rem" }}>★</span>)}
                  </div>
                  {d.depoimento && (
                    <div style={{ fontSize: "2.5rem", color: `${GOLD}25`, lineHeight: 1, marginBottom: 8, fontFamily: "Georgia, serif" }}>"</div>
                  )}
                  <p style={{ fontSize: "0.85rem", color: d.depoimento ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)", lineHeight: 1.75, margin: 0, fontStyle: d.depoimento ? "italic" : "normal" }}>
                    {d.depoimento ?? "Depoimento a caminho — solução entregue."}
                  </p>

                  {/* Overlay "aguardando" — só para cards sem depoimento */}
                  {!d.depoimento && (
                    <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "rgba(5,13,26,0.82)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid rgba(201,168,76,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: MONO, color: GOLD, fontSize: 14 }}>↻</span>
                      </div>
                      <p style={{ fontFamily: MONO, fontSize: 9, color: `${GOLD}70`, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>aguardando</p>
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.22)", margin: 0 }}>depoimento solicitado</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section id="faq" style={{ padding: "80px 1.5rem", background: "rgba(255,255,255,0.015)" }}>
          <div data-fade="" style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <SectionLabel>FAQ</SectionLabel>
              <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 800, color: "white", fontSize: "clamp(1.6rem,2.8vw,2.2rem)", lineHeight: 1.06, letterSpacing: "-0.025em" }}>
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
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: faqAberto === i ? GOLD : `${GOLD}50`, flexShrink: 0, transition: "color 0.2s" }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ fontWeight: 600, fontSize: "0.93rem", color: faqAberto === i ? "white" : "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{item.q}</span>
                    </div>
                    <span style={{ fontFamily: MONO, color: faqAberto === i ? GOLD : "rgba(255,255,255,0.25)", fontSize: "1rem", fontWeight: 400, flexShrink: 0, transform: faqAberto === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.25s ease, color 0.2s", lineHeight: 1 }}>+</span>
                  </button>
                  <div className="faq-answer" style={{ maxHeight: faqAberto === i ? 300 : 0, opacity: faqAberto === i ? 1 : 0 }}>
                    <div style={{ padding: "8px 28px 24px", background: "rgba(201,168,76,0.03)" }}>
                      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.85, margin: 0 }}>{item.a}</p>
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
            <div style={{ display:"flex", justifyContent:"center", marginBottom: 14 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            </div>
            <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 700, color: "white", fontSize: "1.4rem", marginBottom: 12 }}>Garantia incondicional de 7 dias</h3>
            <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.8, fontSize: "0.9rem", margin: 0 }}>
              Se você entrar no LEAP BUILD e em 7 dias sentir que não era para você, devolvo 100% do valor sem perguntas. O risco é zero.
            </p>
          </div>
        </section>

        {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
        <section style={{ padding: "128px 1.5rem", position: "relative", overflow: "hidden" }}>
          {/* Ghost text de fundo */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'General Sans',sans-serif", fontWeight: 700, fontSize: "clamp(5rem,12vw,10rem)", color: "white", opacity: 0.025, whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", letterSpacing: "-0.05em" }}>
            LEAP
          </div>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${GOLD}08 0%, transparent 65%)`, pointerEvents: "none" }} />

          <div data-fade="" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <SectionLabel>A decisão é agora</SectionLabel>
            <h2 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 800, color: "white", fontSize: "clamp(2.2rem,4.5vw,3.8rem)", lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: 20 }}>
              O salto<br/>começa aqui.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontStyle: "italic", fontFamily: "'Libre Baskerville',serif", marginBottom: 40 }}>
              R$498 hoje. R$998 depois. O preço de turma zero nunca volta.
            </p>

            <Link href="/cliente" className="btn-gold" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 12,
              padding: "16px 48px", borderRadius: 16, fontWeight: 700, fontSize: "1.05rem",
              color: NAVY, textDecoration: "none", boxShadow: "0 0 80px rgba(201,168,76,0.5)",
            }}>
              Entrar no LEAP BUILD →
            </Link>

            <p style={{ fontSize: 12, marginTop: 22, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>
              Turma zero · R$498 · 22 aulas + 4 bônus · Acesso vitalício · Garantia de 7 dias
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 36 }}>
              <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.3)" }}>Já tem acesso?</span>
              <Link href="/member/login" style={{ fontSize: "0.88rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Entrar na área de membros</Link>
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
                <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></div>
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
