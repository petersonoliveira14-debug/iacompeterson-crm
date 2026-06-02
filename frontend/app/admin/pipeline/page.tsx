"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";

// ─── Pipeline com 6 colunas (+ Negativa) ─────────────────────────────────────

const STAGES = [
  {
    id: "novo_lead",
    label: "Novo Lead",
    dot: "#64748b",
    statuses: ["lead_captado", "novo_lead"],
  },
  {
    id: "qualificando",
    label: "Qualificando",
    dot: "#8b5cf6",
    statuses: ["discovery_call", "formulario_enviado", "formulario_recebido", "qualificando"],
  },
  {
    id: "discovery",
    label: "Discovery / PRD",
    dot: "#0ea5e9",
    statuses: ["prd_elaborado", "reuniao_1", "prd_aprovado", "discovery"],
  },
  {
    id: "proposta",
    label: "Proposta",
    dot: "#c9a84c",
    statuses: ["proposta_elaborada", "proposta_enviada", "proposta_aceita", "proposta"],
  },
  {
    id: "em_execucao",
    label: "Em Execução",
    dot: "#f97316",
    statuses: ["em_execucao"],
  },
  {
    id: "concluido",
    label: "Concluído ✓",
    dot: "#22c55e",
    statuses: ["entregue", "pos_venda", "concluido"],
  },
  {
    id: "negativa",
    label: "❌ Negativa",
    dot: "#ef4444",
    statuses: ["negativa"],
  },
];

// ─── Canal de origem ──────────────────────────────────────────────────────────

const ORIGEM_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  instagram_dm: { label: "Instagram", color: "#e879f9", icon: "📸" },
  whatsapp:     { label: "WhatsApp",  color: "#25d366", icon: "💬" },
  formulario:   { label: "Formulário",color: "#60a5fa", icon: "📋" },
  indicacao:    { label: "Indicação", color: "#f59e0b", icon: "🤝" },
};

// ─── Status legíveis (tooltip) ────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  lead_captado:        "Lead captado",
  novo_lead:           "Novo lead",
  discovery_call:      "Discovery call",
  formulario_enviado:  "Formulário enviado",
  formulario_recebido: "Formulário recebido",
  qualificando:        "Qualificando",
  prd_elaborado:       "PRD elaborado",
  reuniao_1:           "Reunião 1",
  prd_aprovado:        "PRD aprovado",
  discovery:           "Discovery",
  proposta_elaborada:  "Proposta elaborada",
  proposta_enviada:    "Proposta enviada",
  proposta_aceita:     "Proposta aceita 🎉",
  proposta:            "Em proposta",
  em_execucao:         "Em execução",
  entregue:            "Entregue",
  pos_venda:           "Pós-venda",
  concluido:           "Concluído",
  negativa:            "Negativa",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Cliente {
  id: string;
  nome_contato: string | null;
  nome_empresa: string | null;
  status: string | null;
  segmento: string | null;
  faixa_investimento: string | null;
  data_inicio_execucao: string | null;
  prazo_execucao_dias: number | null;
  origem: string | null;
}

interface ChecklistItem {
  done: boolean;
  [key: string]: unknown;
}

interface ChecklistRow {
  cliente_id: string;
  itens: ChecklistItem[] | null;
}

function diasRestantes(c: Cliente): number | null {
  if (!c.data_inicio_execucao || !c.prazo_execucao_dias) return null;
  const inicio = new Date(c.data_inicio_execucao);
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + c.prazo_execucao_dias);
  return Math.ceil((fim.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [checklistMap, setChecklistMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [origemFiltro, setOrigemFiltro] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) {
      router.push("/admin/login");
      return;
    }

    Promise.all([
      supabase
        .from("clientes")
        .select(
          "id, nome_contato, nome_empresa, status, segmento, faixa_investimento, data_inicio_execucao, prazo_execucao_dias, origem"
        )
        .order("created_at", { ascending: false })
        .limit(300),
      supabase.from("checklists").select("cliente_id, itens"),
    ]).then(([clientesRes, checklistsRes]) => {
      setClientes((clientesRes.data as Cliente[]) || []);
      const map: Record<string, number> = {};
      for (const ch of (checklistsRes.data as ChecklistRow[]) || []) {
        const itens = ch.itens || [];
        if (itens.length === 0) continue;
        const done = itens.filter((i) => i.done).length;
        map[ch.cliente_id] = Math.round((done / itens.length) * 100);
      }
      setChecklistMap(map);
      setLoading(false);
    });
  }, [router]);

  // Filtragem por origem
  const clientesFiltrados = origemFiltro
    ? clientes.filter((c) => c.origem === origemFiltro)
    : clientes;

  // Origens presentes no pipeline
  const origensPresentes = Array.from(
    new Set(clientes.map((c) => c.origem).filter(Boolean))
  ) as string[];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--admin-page-bg)" }}>
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: "var(--admin-text-1)" }}>
            Pipeline Kanban
          </h1>

          {/* Filtro por origem */}
          {origensPresentes.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium" style={{ color: "var(--admin-text-3)" }}>
                Canal:
              </span>
              <button
                onClick={() => setOrigemFiltro(null)}
                className="text-xs px-3 py-1 rounded-full font-medium transition-all"
                style={{
                  background: origemFiltro === null ? "#c9a84c" : "var(--admin-badge-bg)",
                  color: origemFiltro === null ? "#0f2044" : "var(--admin-badge-text)",
                  border: "1px solid var(--admin-badge-border)",
                }}
              >
                Todos
              </button>
              {origensPresentes.map((o) => {
                const cfg = ORIGEM_CONFIG[o];
                if (!cfg) return null;
                return (
                  <button
                    key={o}
                    onClick={() => setOrigemFiltro(origemFiltro === o ? null : o)}
                    className="text-xs px-3 py-1 rounded-full font-medium transition-all"
                    style={{
                      background: origemFiltro === o ? cfg.color : "var(--admin-badge-bg)",
                      color: origemFiltro === o ? "#fff" : "var(--admin-badge-text)",
                      border: `1px solid ${origemFiltro === o ? cfg.color : "var(--admin-badge-border)"}`,
                    }}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--admin-text-3)" }}>
            <span
              className="inline-block w-4 h-4 rounded-full border-2 animate-spin"
              style={{
                borderColor: "var(--admin-spinner-1)",
                borderTopColor: "var(--admin-spinner-2)",
              }}
              aria-hidden="true"
            />
            Carregando pipeline...
          </div>
        ) : (
          <div className="flex gap-3 min-w-max pb-4">
            {STAGES.map((stage) => {
              const items = clientesFiltrados.filter(
                (c) => c.status && stage.statuses.includes(c.status)
              );

              return (
                <div key={stage.id} className="w-56 flex-shrink-0">
                  <div
                    className="rounded-2xl p-3"
                    style={{
                      background: "var(--admin-col-bg)",
                      border: "1px solid var(--admin-col-border)",
                    }}
                  >
                    {/* Column header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: stage.dot }}
                        aria-hidden="true"
                      />
                      <p
                        className="text-xs font-bold uppercase tracking-wide flex-1 leading-tight"
                        style={{ color: "var(--admin-text-2)" }}
                      >
                        {stage.label}
                      </p>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-medium tabular-nums"
                        style={{
                          background: "var(--admin-badge-bg)",
                          border: "1px solid var(--admin-badge-border)",
                          color: "var(--admin-badge-text)",
                        }}
                      >
                        {items.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-2">
                      {items.length === 0 && (
                        <p
                          className="text-xs text-center py-6"
                          style={{ color: "var(--admin-text-3)" }}
                        >
                          Vazio
                        </p>
                      )}
                      {items.map((c) => {
                        const pct = checklistMap[c.id];
                        const dias =
                          stage.id === "em_execucao" ? diasRestantes(c) : null;
                        return (
                          <PipelineCard
                            key={c.id}
                            cliente={c}
                            pct={pct}
                            dias={dias}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface PipelineCardProps {
  cliente: Cliente;
  pct: number | undefined;
  dias: number | null;
}

function PipelineCard({ cliente: c, pct, dias }: PipelineCardProps) {
  const [hovered, setHovered] = useState(false);
  const subtitulo = [c.segmento, c.faixa_investimento].filter(Boolean).join(" · ");
  const origemCfg = c.origem ? ORIGEM_CONFIG[c.origem] : null;
  const statusLabel = c.status ? (STATUS_LABEL[c.status] || c.status) : null;

  return (
    <Link
      href={`/admin/clientes/${c.id}`}
      className="block rounded-xl p-3 transition-all duration-150 focus:outline-none"
      style={{
        background: hovered
          ? "var(--admin-card-bg-hover)"
          : "var(--admin-card-bg)",
        border: `1px solid ${hovered ? "#c9a84c" : "var(--admin-card-border)"}`,
        boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Ver cliente ${c.nome_empresa || c.nome_contato}`}
    >
      {/* Nome */}
      <p
        className="text-sm font-semibold truncate leading-tight"
        style={{ color: "var(--admin-text-1)" }}
      >
        {c.nome_empresa || c.nome_contato || "—"}
      </p>

      {/* Subtítulo */}
      {subtitulo && (
        <p
          className="text-xs mt-0.5 truncate"
          style={{ color: "var(--admin-text-2)" }}
        >
          {subtitulo}
        </p>
      )}

      {/* Badges: origem + status atual */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {origemCfg && (
          <span
            className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{
              background: `${origemCfg.color}22`,
              color: origemCfg.color,
              border: `1px solid ${origemCfg.color}44`,
            }}
          >
            {origemCfg.icon} {origemCfg.label}
          </span>
        )}
        {statusLabel && (
          <span
            className="inline-flex text-xs px-1.5 py-0.5 rounded-full"
            style={{
              background: "var(--admin-badge-bg)",
              color: "var(--admin-text-3)",
              border: "1px solid var(--admin-badge-border)",
            }}
          >
            {statusLabel}
          </span>
        )}
      </div>

      {/* Progresso */}
      {pct !== undefined && (
        <div className="mt-2">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--admin-badge-bg)" }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Checklist ${pct}% concluído`}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: "#c9a84c" }}
            />
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--admin-text-3)" }}>
            {pct}% concluído
          </p>
        </div>
      )}

      {/* Prazo */}
      {dias !== null && (
        <p
          className="text-xs mt-1.5 font-medium"
          style={{ color: dias >= 0 ? "#f97316" : "#ef4444" }}
        >
          {dias >= 0
            ? `⏱ ${dias}d restantes`
            : `⚠️ Vencido há ${Math.abs(dias)}d`}
        </p>
      )}
    </Link>
  );
}
