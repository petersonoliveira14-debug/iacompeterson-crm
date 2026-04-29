"use client";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const NAVY = "#0f2044";
const GOLD = "#c9a84c";

// ─── Tech stack — SVGs locais em /public/logos/ (100% confiável, sem CDN externo) ─
// Todos os arquivos estão em frontend/public/logos/*.svg com cor da marca embutida.
type TechItem = { name: string; logoUrl: string };

export const TECH_STACK: TechItem[] = [
  { name: "Supabase",  logoUrl: "/logos/supabase.svg" },   // verde
  { name: "OpenAI",    logoUrl: "/logos/openai.svg" },     // verde-escuro
  { name: "Claude",    logoUrl: "/logos/claude.svg" },     // dourado
  { name: "Anthropic", logoUrl: "/logos/anthropic.svg" },  // salmão
  { name: "Google",    logoUrl: "/logos/google.svg" },     // azul
  { name: "Meta",      logoUrl: "/logos/meta.svg" },       // azul
  { name: "GitHub",    logoUrl: "/logos/github.svg" },     // branco
  { name: "Canva",     logoUrl: "/logos/canva.svg" },      // ciano
  { name: "n8n",       logoUrl: "/logos/n8n.svg" },        // vermelho
  { name: "Vercel",    logoUrl: "/logos/vercel.svg" },     // branco
  { name: "Lovable",   logoUrl: "/logos/lovable.svg" },    // rosa
];

// ─── Redes sociais ─────────────────────────────────────────────────────────────
// ⚠️  Atualize os hrefs com seus links reais antes de publicar
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/iacompeterson",      logoUrl: "https://cdn.simpleicons.org/instagram/ffffff" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/petersonoliveirawind", logoUrl: "/logos/linkedin.svg" },
  { label: "WhatsApp",  href: "https://wa.me/5584998955575",               logoUrl: "https://cdn.simpleicons.org/whatsapp/ffffff" },
  { label: "YouTube",   href: "https://youtube.com/@iacompeterson",        logoUrl: "https://cdn.simpleicons.org/youtube/ffffff" },
];

// ─── CarouselTrack — track reutilizável ────────────────────────────────────────

interface TrackProps {
  /** compact=true → cards menores para BrandingSidebar */
  compact?: boolean;
}

export function CarouselTrack({ compact = false }: TrackProps) {
  const doubled = [...TECH_STACK, ...TECH_STACK];

  // Cards retangulares +20%: largura > altura, nome abaixo do logo
  const cardClass = compact ? "w-[68px] h-16"     : "w-24 h-[86px]";
  const imgClass  = compact ? "w-[26px] h-[26px]" : "w-[42px] h-[42px]";
  const txtClass  = compact ? "text-[7px]"         : "text-[9px]";
  const gap       = compact ? "gap-2.5"            : "gap-3.5";

  return (
    <div className="relative overflow-hidden">
      {/* Fade nas bordas */}
      <div className="absolute left-0 top-0 bottom-0 w-14 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${NAVY}, transparent)` }} />
      <div className="absolute right-0 top-0 bottom-0 w-14 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${NAVY}, transparent)` }} />

      <div className={`flex ${gap} animate-scroll-x`}
        style={{ width: "max-content", paddingLeft: compact ? "10px" : "14px" }}>
        {doubled.map((tech, i) => (
          <div
            key={i}
            className={`flex-shrink-0 flex flex-col items-center justify-center ${cardClass} cursor-default
                        transition-all duration-200`}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: compact ? "12px" : "16px",
              gap: compact ? "5px" : "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `rgba(201,168,76,0.7)`;
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img
              src={tech.logoUrl}
              alt={tech.name}
              className={`${imgClass} object-contain flex-shrink-0`}
            />
            <span
              className={`${txtClass} font-medium tracking-wide leading-none`}
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TechCarousel — seção completa ────────────────────────────────────────────

interface TechCarouselProps {
  compact?: boolean;
}

export function TechCarousel({ compact = false }: TechCarouselProps) {
  if (compact) {
    return (
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
          style={{ color: "rgba(201,168,76,0.7)" }}>
          Tecnologias utilizadas
        </p>
        <CarouselTrack compact />
      </div>
    );
  }

  return (
    <section style={{ background: NAVY }} className="py-16 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center mb-10 px-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
          Tecnologia de ponta
        </p>
        <h2 className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: "'General Sans', sans-serif" }}>
          Construído com as melhores ferramentas do mundo
        </h2>
      </div>
      <CarouselTrack />
    </section>
  );
}

// ─── SocialLinks ───────────────────────────────────────────────────────────────

interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className = "" }: SocialLinksProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          title={s.label}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(201,168,76,0.25)";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          <img
            src={s.logoUrl}
            alt={s.label}
            width={18}
            height={18}
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </a>
      ))}
    </div>
  );
}
