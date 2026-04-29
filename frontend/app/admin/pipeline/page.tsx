"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";

const STAGES = [
  { id: "lead_captado",        label: "Lead Captado",      dot: "#64748b" },
  { id: "discovery_call",      label: "Discovery Call",    dot: "#8b5cf6" },
  { id: "formulario_enviado",  label: "Form. Enviado",     dot: "#6366f1" },
  { id: "formulario_recebido", label: "Form. Recebido",    dot: "#3b82f6" },
  { id: "prd_elaborado",       label: "PRD Elaborado",     dot: "#0ea5e9" },
  { id: "reuniao_1",           label: "Reunião 1",         dot: "#06b6d4" },
  { id: "prd_aprovado",        label: "PRD Aprovado",      dot: "#14b8a6" },
  { id: "proposta_elaborada",  label: "Proposta Pronta",   dot: "#10b981" },
  { id: "proposta_enviada",    label: "Proposta Enviada",  dot: "#c9a84c" },
  { id: "proposta_aceita",     label: "Aceito 🎉",         dot: "#84cc16" },
  { id: "em_execucao",         label: "Em Execução",       dot: "#f97316" },
  { id: "entregue",            label: "Entregue ✓",        dot: "#22c55e" },
  { id: "pos_venda",           label: "Pós-venda",         dot: "#a78bfa" },
];

interface Cliente {
  id: string;
  nome_contato: string | null;
  nome_empresa: string | null;
  status: string | null;
  segmento: string | null;
  faixa_investimento: string | null;
  data_inicio_execucao: string | null;
  prazo_execucao_dias: number | null;
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
  const hoje = new Date();
  return Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

export default function PipelinePage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [checklistMap, setChecklistMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) {
      router.push("/admin/login");
      return;
    }

    Promise.all([
      supabase
        .from("clientes")
        .select(
          "id, nome_contato, nome_empresa, status, segmento, faixa_investimento, data_inicio_execucao, prazo_execucao_dias"
        )
        .order("created_at", { ascending: false })
        .limit(200),
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Pipeline Kanban
        </h1>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span
              className="inline-block w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin"
              aria-hidden="true"
            />
            Carregando pipeline...
          </div>
        ) : (
          <div className="flex gap-3 min-w-max pb-4">
            {STAGES.map((stage) => {
              const items = clientes.filter((c) => c.status === stage.id);
              return (
                <div key={stage.id} className="w-52 flex-shrink-0">
                  <div className="rounded-2xl border border-slate-200 bg-slate-100/50 p-3">
                    {/* Column header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: stage.dot }}
                        aria-hidden="true"
                      />
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wide flex-1 leading-tight">
                        {stage.label}
                      </p>
                      <span className="text-xs bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-medium tabular-nums">
                        {items.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-2">
                      {items.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-6">
                          Vazio
                        </p>
                      )}
                      {items.map((c) => {
                        const pct = checklistMap[c.id];
                        const dias =
                          stage.id === "em_execucao"
                            ? diasRestantes(c)
                            : null;

                        return (
                          <PipelineCard
                            key={c.id}
                            cliente={c}
                            stageDot={stage.dot}
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

interface PipelineCardProps {
  cliente: Cliente;
  stageDot: string;
  pct: number | undefined;
  dias: number | null;
}

function PipelineCard({ cliente: c, pct, dias }: PipelineCardProps) {
  const [hovered, setHovered] = useState(false);

  const subtitulo = [c.segmento, c.faixa_investimento]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/admin/clientes/${c.id}`}
      className="block bg-white rounded-xl p-3 border transition-all duration-150 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-amber-400"
      style={{
        borderColor: hovered ? "#c9a84c" : "#e2e8f0",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Ver cliente ${c.nome_empresa || c.nome_contato}`}
    >
      <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
        {c.nome_empresa || c.nome_contato || "—"}
      </p>

      {subtitulo && (
        <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitulo}</p>
      )}

      {/* Checklist progress bar */}
      {pct !== undefined && (
        <div className="mt-2">
          <div
            className="h-1.5 bg-slate-100 rounded-full overflow-hidden"
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
          <p className="text-xs text-slate-400 mt-0.5">{pct}% concluído</p>
        </div>
      )}

      {/* Prazo de execucao */}
      {dias !== null && (
        <p
          className="text-xs mt-1.5 font-medium"
          style={{ color: dias >= 0 ? "#f97316" : "#ef4444" }}
        >
          {dias >= 0
            ? `⏱ ${dias} dias restantes`
            : `⚠️ Prazo vencido há ${Math.abs(dias)} dias`}
        </p>
      )}
    </Link>
  );
}
