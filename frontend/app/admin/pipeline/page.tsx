"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";

// ─── Estágios do pipeline ─────────────────────────────────────────────────────

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

// ─── Origem dos leads ─────────────────────────────────────────────────────────

const ORIGEM_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  instagram_dm: { label: "Instagram", color: "#e879f9", icon: "📸" },
  whatsapp:     { label: "WhatsApp",  color: "#25d366", icon: "💬" },
  formulario:   { label: "Formulário",color: "#60a5fa", icon: "📋" },
  indicacao:    { label: "Indicação", color: "#f59e0b", icon: "🤝" },
};

// ─── Status legíveis ──────────────────────────────────────────────────────────

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

// ─── Subetapas por estágio de destino ────────────────────────────────────────

const TRANSITION_STEPS: Record<string, string[]> = {
  novo_lead: [
    "Lead registrado no CRM",
    "Canal de origem identificado",
  ],
  qualificando: [
    "Primeiro contato realizado",
    "Interesse confirmado pelo cliente",
    "Dados básicos coletados",
  ],
  discovery: [
    "Discovery call realizada",
    "Formulário recebido e analisado",
    "Lead validado como perfil ideal (ICP)",
  ],
  proposta: [
    "PRD elaborado e documentado",
    "Reunião de alinhamento realizada",
    "Escopo aprovado pelo cliente",
  ],
  em_execucao: [
    "Proposta enviada ao cliente",
    "Proposta aceita / assinada digitalmente",
    "Kickoff agendado",
    "Pagamento inicial confirmado",
  ],
  concluido: [
    "Entrega técnica concluída",
    "Treinamento da equipe realizado",
    "Aceite formal do cliente obtido",
    "Suporte pós-entrega alinhado",
  ],
  negativa: [
    "Motivo da negativa identificado",
    "Feedback registrado para melhoria interna",
    "Follow-up futuro considerado",
  ],
};

const DEFAULT_STEPS = ["Justificativa para mudança de etapa"];

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

interface ChecklistItem { done: boolean; [key: string]: unknown }
interface ChecklistRow  { cliente_id: string; itens: ChecklistItem[] | null }

interface StepState {
  label: string;
  checked: boolean;
  skipped: boolean;
  justification: string;
}

interface PendingMove {
  cliente: Cliente;
  fromStage: string;
  toStage: string;
  toLabel: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function diasRestantes(c: Cliente): number | null {
  if (!c.data_inicio_execucao || !c.prazo_execucao_dias) return null;
  const inicio = new Date(c.data_inicio_execucao);
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + c.prazo_execucao_dias);
  return Math.ceil((fim.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function getClientStage(status: string | null): string {
  if (!status) return "";
  for (const s of STAGES) {
    if (s.statuses.includes(status)) return s.id;
  }
  return status;
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function PipelinePage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [checklistMap, setChecklistMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [origemFiltro, setOrigemFiltro] = useState<string | null>(null);

  // DnD state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Transition modal
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [stepStates, setStepStates] = useState<StepState[]>([]);
  const [saving, setSaving] = useState(false);

  // Justification sub-modal
  const [justifyingIdx, setJustifyingIdx] = useState<number | null>(null);
  const [justifyDraft, setJustifyDraft] = useState("");

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
        if (!itens.length) continue;
        const done = itens.filter(i => i.done).length;
        map[ch.cliente_id] = Math.round((done / itens.length) * 100);
      }
      setChecklistMap(map);
      setLoading(false);
    });
  }, [router]);

  // ── DnD handlers ─────────────────────────────────────────────────────────────

  function handleDragStart(e: React.DragEvent, clienteId: string) {
    setDraggedId(clienteId);
    e.dataTransfer.setData("clienteId", clienteId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverStage(null);
  }

  function handleDragOver(e: React.DragEvent, stageId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageId) setDragOverStage(stageId);
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverStage(null);
    }
  }

  function handleDrop(e: React.DragEvent, targetStageId: string) {
    e.preventDefault();
    setDragOverStage(null);

    const clienteId = e.dataTransfer.getData("clienteId") || draggedId;
    setDraggedId(null);
    if (!clienteId) return;

    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    const fromStage = getClientStage(cliente.status);
    if (fromStage === targetStageId) return;

    const targetStage = STAGES.find(s => s.id === targetStageId);
    const steps = TRANSITION_STEPS[targetStageId] || DEFAULT_STEPS;
    setStepStates(steps.map(label => ({ label, checked: false, skipped: false, justification: "" })));
    setPendingMove({
      cliente,
      fromStage,
      toStage: targetStageId,
      toLabel: targetStage?.label || targetStageId,
    });
  }

  // ── Step handlers ─────────────────────────────────────────────────────────────

  function toggleCheck(idx: number) {
    setStepStates(prev => prev.map((s, i) =>
      i === idx ? { ...s, checked: !s.checked, skipped: false, justification: "" } : s
    ));
  }

  function openJustify(idx: number) {
    setJustifyingIdx(idx);
    setJustifyDraft(stepStates[idx].justification || "");
  }

  function confirmJustify() {
    if (justifyingIdx === null || !justifyDraft.trim()) return;
    setStepStates(prev => prev.map((s, i) =>
      i === justifyingIdx
        ? { ...s, skipped: true, checked: false, justification: justifyDraft.trim() }
        : s
    ));
    setJustifyingIdx(null);
    setJustifyDraft("");
  }

  function cancelJustify() {
    setJustifyingIdx(null);
    setJustifyDraft("");
  }

  // ── Move confirm/cancel ───────────────────────────────────────────────────────

  function cancelMove() {
    setPendingMove(null);
    setStepStates([]);
    setJustifyingIdx(null);
    setJustifyDraft("");
  }

  async function confirmMove() {
    if (!pendingMove || saving) return;
    const allDone = stepStates.every(
      s => s.checked || (s.skipped && s.justification.trim().length > 0)
    );
    if (!allDone) return;

    setSaving(true);
    try {
      const fromLabel = STAGES.find(s => s.id === pendingMove.fromStage)?.label || pendingMove.fromStage;

      const [, actividadeResult] = await Promise.all([
        supabase
          .from("clientes")
          .update({ status: pendingMove.toStage })
          .eq("id", pendingMove.cliente.id),
        supabase.from("atividades").insert({
          cliente_id: pendingMove.cliente.id,
          tipo: "mudanca_status",
          descricao: JSON.stringify({
            de: pendingMove.fromStage,
            de_label: fromLabel,
            para: pendingMove.toStage,
            para_label: pendingMove.toLabel,
            subetapas: stepStates,
          }),
        }),
      ]);

      if (actividadeResult.error) throw actividadeResult.error;

      // Atualiza state local
      setClientes(prev => prev.map(c =>
        c.id === pendingMove.cliente.id ? { ...c, status: pendingMove.toStage } : c
      ));

      cancelMove();
    } catch (err) {
      console.error("Erro ao mover cliente:", err);
    } finally {
      setSaving(false);
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────────

  const clientesFiltrados = origemFiltro
    ? clientes.filter(c => c.origem === origemFiltro)
    : clientes;

  const origensPresentes = Array.from(
    new Set(clientes.map(c => c.origem).filter(Boolean))
  ) as string[];

  const allStepsDone = stepStates.length > 0 && stepStates.every(
    s => s.checked || (s.skipped && s.justification.trim().length > 0)
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen" style={{ background: "var(--admin-page-bg)" }}>
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold" style={{ color: "var(--admin-text-1)" }}>
              Pipeline Kanban
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--admin-text-3)" }}>
              Arraste os cards para avançar etapas
            </p>
          </div>

          {/* Filtro por origem */}
          {origensPresentes.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium" style={{ color: "var(--admin-text-3)" }}>Canal:</span>
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
              {origensPresentes.map(o => {
                const cfg = ORIGEM_CONFIG[o];
                if (!cfg) return null;
                return (
                  <button key={o} onClick={() => setOrigemFiltro(origemFiltro === o ? null : o)}
                    className="text-xs px-3 py-1 rounded-full font-medium transition-all"
                    style={{
                      background: origemFiltro === o ? cfg.color : "var(--admin-badge-bg)",
                      color: origemFiltro === o ? "#fff" : "var(--admin-badge-text)",
                      border: `1px solid ${origemFiltro === o ? cfg.color : "var(--admin-badge-border)"}`,
                    }}>
                    {cfg.icon} {cfg.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--admin-text-3)" }}>
            <span className="inline-block w-4 h-4 rounded-full border-2 animate-spin"
              style={{ borderColor: "var(--admin-spinner-1)", borderTopColor: "var(--admin-spinner-2)" }} />
            Carregando pipeline...
          </div>
        ) : (
          <div className="flex gap-3 min-w-max pb-4">
            {STAGES.map(stage => {
              const items = clientesFiltrados.filter(
                c => c.status && stage.statuses.includes(c.status)
              );
              const isOver = dragOverStage === stage.id;

              return (
                <div
                  key={stage.id}
                  className="w-56 flex-shrink-0"
                  onDragOver={e => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, stage.id)}
                >
                  <div
                    className="rounded-2xl p-3 transition-all duration-150 min-h-[120px]"
                    style={{
                      background: isOver ? "rgba(201,168,76,0.06)" : "var(--admin-col-bg)",
                      border: isOver
                        ? "2px dashed #c9a84c"
                        : "1px solid var(--admin-col-border)",
                      boxShadow: isOver ? "0 0 0 4px rgba(201,168,76,0.08)" : "none",
                    }}
                  >
                    {/* Column header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: stage.dot }} />
                      <p className="text-xs font-bold uppercase tracking-wide flex-1 leading-tight"
                        style={{ color: "var(--admin-text-2)" }}>
                        {stage.label}
                      </p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium tabular-nums"
                        style={{
                          background: "var(--admin-badge-bg)",
                          border: "1px solid var(--admin-badge-border)",
                          color: "var(--admin-badge-text)",
                        }}>
                        {items.length}
                      </span>
                    </div>

                    {/* Drop hint */}
                    {isOver && (
                      <div className="rounded-xl border-2 border-dashed py-3 mb-2 text-center text-xs font-medium"
                        style={{ borderColor: "#c9a84c", color: "#c9a84c" }}>
                        Soltar aqui
                      </div>
                    )}

                    {/* Cards */}
                    <div className="space-y-2">
                      {items.length === 0 && !isOver && (
                        <p className="text-xs text-center py-6" style={{ color: "var(--admin-text-3)" }}>
                          Vazio
                        </p>
                      )}
                      {items.map(c => {
                        const pct = checklistMap[c.id];
                        const dias = stage.id === "em_execucao" ? diasRestantes(c) : null;
                        return (
                          <PipelineCard
                            key={c.id}
                            cliente={c}
                            pct={pct}
                            dias={dias}
                            isDragging={draggedId === c.id}
                            onDragStart={e => handleDragStart(e, c.id)}
                            onDragEnd={handleDragEnd}
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

      {/* ── Transition Modal ───────────────────────────────────────────────────── */}
      {pendingMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "var(--admin-card-bg, #fff)" }}>

            {/* Header */}
            <div className="px-6 py-5" style={{ background: "#0f2044" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#c9a84c" }}>
                Avançar etapa
              </p>
              <h2 className="text-lg font-bold text-white">
                → {pendingMove.toLabel}
              </h2>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                {pendingMove.cliente.nome_empresa || pendingMove.cliente.nome_contato}
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm font-semibold mb-4" style={{ color: "var(--admin-text-1, #0f172a)" }}>
                Complete ou justifique cada subetapa para confirmar o avanço:
              </p>

              <div className="space-y-3">
                {stepStates.map((step, idx) => (
                  <div key={idx}
                    className="rounded-xl p-3 transition-all"
                    style={{
                      background: step.checked
                        ? "rgba(34,197,94,0.08)"
                        : step.skipped
                        ? "rgba(239,68,68,0.06)"
                        : "var(--admin-badge-bg, #f8fafc)",
                      border: step.checked
                        ? "1px solid rgba(34,197,94,0.3)"
                        : step.skipped
                        ? "1px solid rgba(239,68,68,0.25)"
                        : "1px solid var(--admin-badge-border, #e2e8f0)",
                    }}>
                    <div className="flex items-start gap-3">
                      {/* Status indicator */}
                      <div className="flex-shrink-0 mt-0.5">
                        {step.checked ? (
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white inline-flex"
                            style={{ background: "#22c55e" }}>✓</span>
                        ) : step.skipped ? (
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white inline-flex"
                            style={{ background: "#ef4444" }}>✗</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border-2 inline-flex"
                            style={{ borderColor: "var(--admin-badge-border, #cbd5e1)" }} />
                        )}
                      </div>

                      {/* Label + justificativa */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug"
                          style={{ color: "var(--admin-text-1, #0f172a)" }}>
                          {step.label}
                        </p>
                        {step.skipped && step.justification && (
                          <p className="text-xs mt-1 italic"
                            style={{ color: "var(--admin-text-3, #64748b)" }}>
                            "{step.justification}"
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => toggleCheck(idx)}
                          title="Marcar como feito"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                          style={{
                            background: step.checked ? "#22c55e" : "rgba(34,197,94,0.1)",
                            color: step.checked ? "white" : "#22c55e",
                            border: `1px solid ${step.checked ? "#22c55e" : "rgba(34,197,94,0.25)"}`,
                          }}>
                          ✓
                        </button>
                        <button
                          onClick={() => openJustify(idx)}
                          title="Não aconteceu — justificar"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                          style={{
                            background: step.skipped ? "#ef4444" : "rgba(239,68,68,0.08)",
                            color: step.skipped ? "white" : "#ef4444",
                            border: `1px solid ${step.skipped ? "#ef4444" : "rgba(239,68,68,0.2)"}`,
                          }}>
                          ✗
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--admin-badge-border, #e2e8f0)" }}>
                <div className="flex items-center justify-between text-xs mb-2"
                  style={{ color: "var(--admin-text-3, #64748b)" }}>
                  <span>
                    {stepStates.filter(s => s.checked || s.skipped).length}/{stepStates.length} subetapas resolvidas
                  </span>
                  {allStepsDone && (
                    <span className="font-semibold" style={{ color: "#22c55e" }}>✓ Pronto para avançar</span>
                  )}
                </div>
                <div className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--admin-badge-bg, #f1f5f9)" }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${stepStates.length > 0 ? (stepStates.filter(s => s.checked || s.skipped).length / stepStates.length) * 100 : 0}%`,
                      background: allStepsDone ? "#22c55e" : "#c9a84c",
                    }} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex items-center gap-3">
              <button
                onClick={cancelMove}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "var(--admin-badge-bg, #f1f5f9)",
                  color: "var(--admin-text-2, #475569)",
                  border: "1px solid var(--admin-badge-border, #e2e8f0)",
                }}>
                Cancelar
              </button>
              <button
                onClick={confirmMove}
                disabled={!allStepsDone || saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: allStepsDone ? "#0f2044" : "var(--admin-badge-bg, #f1f5f9)",
                  color: allStepsDone ? "white" : "var(--admin-text-3, #94a3b8)",
                }}>
                {saving ? "Salvando..." : "Confirmar avanço →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Justification sub-modal ────────────────────────────────────────────── */}
      {justifyingIdx !== null && pendingMove && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4"
          style={{ zIndex: 60, background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "var(--admin-card-bg, #fff)" }}>
            {/* Header */}
            <div className="px-5 py-4" style={{ background: "#ef4444" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-red-100 mb-0.5">
                Justificar ausência
              </p>
              <p className="text-sm font-semibold text-white leading-snug">
                "{stepStates[justifyingIdx]?.label}"
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-sm mb-3" style={{ color: "var(--admin-text-2, #475569)" }}>
                Por que esta subetapa não aconteceu?
              </p>
              <textarea
                autoFocus
                rows={4}
                value={justifyDraft}
                onChange={e => setJustifyDraft(e.target.value)}
                placeholder="Descreva o motivo..."
                className="w-full rounded-xl text-sm resize-none p-3 focus:outline-none focus:ring-2"
                style={{
                  background: "var(--admin-badge-bg, #f8fafc)",
                  border: "1px solid var(--admin-badge-border, #e2e8f0)",
                  color: "var(--admin-text-1, #0f172a)",
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && e.metaKey) confirmJustify();
                  if (e.key === "Escape") cancelJustify();
                }}
              />
              <p className="text-xs mt-1.5" style={{ color: "var(--admin-text-3, #94a3b8)" }}>
                ⌘ + Enter para confirmar · Esc para cancelar
              </p>
            </div>

            <div className="px-5 pb-5 flex gap-3">
              <button onClick={cancelJustify}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "var(--admin-badge-bg, #f1f5f9)",
                  color: "var(--admin-text-2, #475569)",
                  border: "1px solid var(--admin-badge-border, #e2e8f0)",
                }}>
                Cancelar
              </button>
              <button
                onClick={confirmJustify}
                disabled={!justifyDraft.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#ef4444", color: "white" }}>
                Confirmar justificativa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pipeline Card ────────────────────────────────────────────────────────────

interface PipelineCardProps {
  cliente: Cliente;
  pct: number | undefined;
  dias: number | null;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function PipelineCard({ cliente: c, pct, dias, isDragging, onDragStart, onDragEnd }: PipelineCardProps) {
  const [hovered, setHovered] = useState(false);
  const subtitulo = [c.segmento, c.faixa_investimento].filter(Boolean).join(" · ");
  const origemCfg = c.origem ? ORIGEM_CONFIG[c.origem] : null;
  const statusLabel = c.status ? (STATUS_LABEL[c.status] || c.status) : null;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="rounded-xl p-3 transition-all duration-150 select-none"
      style={{
        background: hovered ? "var(--admin-card-bg-hover)" : "var(--admin-card-bg)",
        border: `1px solid ${hovered ? "#c9a84c" : "var(--admin-card-border)"}`,
        boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        transform: isDragging ? "rotate(2deg) scale(0.98)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle indicator */}
      <div className="flex items-start gap-2 mb-1">
        <div className="flex flex-col gap-0.5 pt-1 flex-shrink-0 opacity-30">
          <span className="block w-3 border-t" style={{ borderColor: "var(--admin-text-3)" }} />
          <span className="block w-3 border-t" style={{ borderColor: "var(--admin-text-3)" }} />
          <span className="block w-3 border-t" style={{ borderColor: "var(--admin-text-3)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/admin/clientes/${c.id}`}
            onClick={e => e.stopPropagation()}
            className="block text-sm font-semibold truncate leading-tight hover:underline"
            style={{ color: "var(--admin-text-1)" }}
          >
            {c.nome_empresa || c.nome_contato || "—"}
          </Link>
          {subtitulo && (
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--admin-text-2)" }}>
              {subtitulo}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      {(origemCfg || statusLabel) && (
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {origemCfg && (
            <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{
                background: `${origemCfg.color}22`,
                color: origemCfg.color,
                border: `1px solid ${origemCfg.color}44`,
              }}>
              {origemCfg.icon} {origemCfg.label}
            </span>
          )}
          {statusLabel && (
            <span className="inline-flex text-xs px-1.5 py-0.5 rounded-full"
              style={{
                background: "var(--admin-badge-bg)",
                color: "var(--admin-text-3)",
                border: "1px solid var(--admin-badge-border)",
              }}>
              {statusLabel}
            </span>
          )}
        </div>
      )}

      {/* Progresso */}
      {pct !== undefined && (
        <div className="mt-2">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--admin-badge-bg)" }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: "#c9a84c" }} />
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--admin-text-3)" }}>{pct}% concluído</p>
        </div>
      )}

      {/* Prazo */}
      {dias !== null && (
        <p className="text-xs mt-1.5 font-medium"
          style={{ color: dias >= 0 ? "#f97316" : "#ef4444" }}>
          {dias >= 0 ? `⏱ ${dias}d restantes` : `⚠️ Vencido há ${Math.abs(dias)}d`}
        </p>
      )}
    </div>
  );
}
