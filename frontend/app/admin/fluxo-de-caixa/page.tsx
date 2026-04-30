"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Lancamento {
  id: string;
  tipo: "entrada" | "saida";
  categoria: string;
  descricao: string | null;
  valor: number;
  data: string;
  recorrente: boolean;
  recorrencia: "mensal" | "trimestral" | "anual" | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const MONTH_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const CATEGORIAS_ENTRADA = ["Projeto fechado","Consultoria","Recorrência","Mentoria","Curso","Outro"];
const CATEGORIAS_SAIDA   = ["IA / APIs","Hospedagem","Marketing","Assinaturas","Ferramentas","Impostos","Pró-labore","Outro"];

const EMPTY_FORM = {
  tipo: "entrada" as "entrada" | "saida",
  categoria: "",
  descricao: "",
  valor: "",
  data: new Date().toISOString().split("T")[0],
  recorrente: false,
  recorrencia: "" as "" | "mensal" | "trimestral" | "anual",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function mesLabel(date: Date) {
  return `${MONTH_SHORT[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`;
}

// ─── Gráfico de barras duplas (entradas x saídas) ────────────────────────────

function BarChart({ meses }: { meses: Array<{ label: string; entradas: number; saidas: number }> }) {
  const max = Math.max(...meses.flatMap(m => [m.entradas, m.saidas]), 1);
  const H = 100;
  return (
    <div className="flex items-end justify-between gap-3 pt-2" style={{ height: H + 32 }}>
      {meses.map(m => {
        const hE = Math.max(Math.round((m.entradas / max) * H), m.entradas > 0 ? 4 : 0);
        const hS = Math.max(Math.round((m.saidas   / max) * H), m.saidas   > 0 ? 4 : 0);
        return (
          <div key={m.label} className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: H }}>
              <div title={`Entradas: R$ ${formatBRL(m.entradas)}`}
                className="flex-1 rounded-t transition-all duration-500"
                style={{ height: hE, background: "#10b981", maxWidth: 20 }} />
              <div title={`Saídas: R$ ${formatBRL(m.saidas)}`}
                className="flex-1 rounded-t transition-all duration-500"
                style={{ height: hS, background: "#ef4444", maxWidth: 20 }} />
            </div>
            <span className="text-xs text-slate-400 truncate w-full text-center">{m.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function FluxoCaixaPage() {
  const router = useRouter();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [mesFiltro, setMesFiltro]   = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // ── Auth + busca ──
  useEffect(() => {
    if (!localStorage.getItem("admin_session")) { router.push("/admin/login"); return; }
    fetchLancamentos();
  }, [router]);

  const fetchLancamentos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("fluxo_caixa")
      .select("*")
      .order("data", { ascending: false });
    if (!error && data) setLancamentos(data as Lancamento[]);
    setLoading(false);
  }, []);

  // ── Expandir recorrentes nos próximos 6 meses ──
  const lancamentosExpandidos = useMemo(() => {
    const resultado: (Lancamento & { dataObj: Date })[] = [];
    const hoje = new Date();

    lancamentos.forEach(l => {
      const base = new Date(l.data + "T12:00:00");
      resultado.push({ ...l, dataObj: base });

      if (!l.recorrente || !l.recorrencia) return;

      for (let i = 1; i <= 6; i++) {
        const prox = new Date(base);
        if (l.recorrencia === "mensal")      prox.setMonth(prox.getMonth() + i);
        if (l.recorrencia === "trimestral")  prox.setMonth(prox.getMonth() + i * 3);
        if (l.recorrencia === "anual")       prox.setFullYear(prox.getFullYear() + i);
        if (prox > hoje && prox <= new Date(hoje.getFullYear(), hoje.getMonth() + 6, 1)) {
          resultado.push({ ...l, id: `${l.id}_proj_${i}`, dataObj: prox, data: prox.toISOString().split("T")[0] });
        }
      }
    });

    return resultado.sort((a, b) => b.dataObj.getTime() - a.dataObj.getTime());
  }, [lancamentos]);

  // ── Dados dos últimos 6 meses + próximos 3 (projeção) ──
  const chartMeses = useMemo(() => {
    const meses = Array.from({ length: 9 }, (_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - 3 + i);
      return { label: mesLabel(d), ano: d.getFullYear(), mes: d.getMonth(), entradas: 0, saidas: 0 };
    });

    lancamentosExpandidos.forEach(l => {
      const entry = meses.find(m => m.mes === l.dataObj.getMonth() && m.ano === l.dataObj.getFullYear());
      if (!entry) return;
      if (l.tipo === "entrada") entry.entradas += l.valor;
      else entry.saidas += l.valor;
    });

    return meses;
  }, [lancamentosExpandidos]);

  // ── Filtro do mês selecionado ──
  const [anoFiltro, mesFiltroNum] = mesFiltro.split("-").map(Number);
  const lancamentosMes = useMemo(
    () => lancamentosExpandidos.filter(l =>
      l.dataObj.getFullYear() === anoFiltro && l.dataObj.getMonth() === mesFiltroNum - 1
    ),
    [lancamentosExpandidos, anoFiltro, mesFiltroNum]
  );

  const totalEntradasMes = useMemo(() => lancamentosMes.filter(l => l.tipo === "entrada").reduce((s, l) => s + l.valor, 0), [lancamentosMes]);
  const totalSaidasMes   = useMemo(() => lancamentosMes.filter(l => l.tipo === "saida").reduce((s, l) => s + l.valor, 0), [lancamentosMes]);
  const saldoMes = totalEntradasMes - totalSaidasMes;

  // ── Totais gerais ──
  const totalEntradas = useMemo(() => lancamentos.filter(l => l.tipo === "entrada").reduce((s, l) => s + l.valor, 0), [lancamentos]);
  const totalSaidas   = useMemo(() => lancamentos.filter(l => l.tipo === "saida").reduce((s, l) => s + l.valor, 0), [lancamentos]);

  // ── Opções de mês para filtro ──
  const mesesOpcoes = useMemo(() => {
    const set = new Set<string>();
    const hoje = new Date();
    for (let i = -6; i <= 3; i++) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    lancamentos.forEach(l => {
      const [y, m] = l.data.split("-");
      set.add(`${y}-${m}`);
    });
    return Array.from(set).sort().reverse();
  }, [lancamentos]);

  // ── Salvar ──
  const handleSave = async () => {
    if (!form.categoria || !form.valor || !form.data) {
      toast.error("Preencha categoria, valor e data.");
      return;
    }
    setSaving(true);
    const payload = {
      tipo: form.tipo,
      categoria: form.categoria,
      descricao: form.descricao || null,
      valor: parseFloat(form.valor.replace(",", ".")),
      data: form.data,
      recorrente: form.recorrente,
      recorrencia: form.recorrente && form.recorrencia ? form.recorrencia : null,
    };
    const { error } = await supabase.from("fluxo_caixa").insert(payload);
    if (error) {
      toast.error("Erro ao salvar lançamento.");
    } else {
      toast.success("Lançamento salvo!");
      setShowForm(false);
      setForm(EMPTY_FORM);
      await fetchLancamentos();
    }
    setSaving(false);
  };

  // ── Excluir ──
  const handleDelete = async (id: string) => {
    if (id.includes("_proj_")) { toast.error("Não é possível excluir uma ocorrência projetada. Exclua o lançamento original."); return; }
    if (!confirm("Excluir este lançamento?")) return;
    const { error } = await supabase.from("fluxo_caixa").delete().eq("id", id);
    if (error) { toast.error("Erro ao excluir."); return; }
    toast.success("Excluído.");
    await fetchLancamentos();
  };

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen" style={{ background: "var(--admin-page-bg)" }}>
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden max-w-5xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--admin-text-1)" }}>Fluxo de Caixa</h1>
            <p className="text-sm mt-1" style={{ color: "var(--admin-text-3)" }}>Lançamentos, projeções e saldo do negócio</p>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="btn-primary text-sm py-2 px-4"
          >
            {showForm ? "✕ Fechar" : "+ Novo lançamento"}
          </button>
        </div>

        {/* ── Formulário ── */}
        {showForm && (
          <div className="card p-6 mb-6 border-2" style={{ borderColor: "var(--admin-col-border)" }}>
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-4">Novo lançamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Tipo */}
              <div className="md:col-span-2 flex gap-3">
                {(["entrada","saida"] as const).map(t => (
                  <button key={t} type="button"
                    onClick={() => setForm(f => ({ ...f, tipo: t, categoria: "" }))}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: form.tipo === t ? (t === "entrada" ? "#10b981" : "#ef4444") : "var(--admin-badge-bg)",
                      color: form.tipo === t ? "white" : "var(--admin-text-2)",
                      border: `2px solid ${form.tipo === t ? (t === "entrada" ? "#10b981" : "#ef4444") : "transparent"}`,
                    }}
                  >
                    {t === "entrada" ? "⬆️ Entrada" : "⬇️ Saída"}
                  </button>
                ))}
              </div>

              {/* Categoria */}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Categoria *</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className="input-field w-full">
                  <option value="">Selecione...</option>
                  {(form.tipo === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Valor */}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Valor (R$) *</label>
                <input type="number" min="0" step="0.01" placeholder="0,00"
                  value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
                  className="input-field w-full" />
              </div>

              {/* Data */}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Data *</label>
                <input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                  className="input-field w-full" />
              </div>

              {/* Descrição */}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Descrição</label>
                <input type="text" placeholder="Ex: API OpenAI março" maxLength={120}
                  value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  className="input-field w-full" />
              </div>

              {/* Recorrência */}
              <div className="md:col-span-2 flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
                  <input type="checkbox" checked={form.recorrente}
                    onChange={e => setForm(f => ({ ...f, recorrente: e.target.checked, recorrencia: "" }))}
                    className="w-4 h-4" style={{ accentColor: "#c9a84c" }} />
                  Lançamento recorrente
                </label>
                {form.recorrente && (
                  <select value={form.recorrencia}
                    onChange={e => setForm(f => ({ ...f, recorrencia: e.target.value as any }))}
                    className="input-field w-auto text-sm">
                    <option value="">Periodicidade...</option>
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </select>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="btn-secondary flex-1 text-sm">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 text-sm">
                {saving ? "Salvando..." : "Salvar lançamento"}
              </button>
            </div>
          </div>
        )}

        {/* ── KPIs do mês ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Entradas no mês", value: totalEntradasMes, color: "#10b981", emoji: "⬆️" },
            { label: "Saídas no mês",   value: totalSaidasMes,   color: "#ef4444", emoji: "⬇️" },
            { label: "Saldo do mês",    value: saldoMes, color: saldoMes >= 0 ? "#10b981" : "#ef4444", emoji: saldoMes >= 0 ? "💚" : "🔴" },
          ].map(({ label, value, color, emoji }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <span>{emoji}</span>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
              </div>
              <p className="text-2xl font-bold" style={{ color, fontFamily: "'General Sans',sans-serif" }}>
                R$ {formatBRL(value)}
              </p>
            </div>
          ))}
        </div>

        {/* ── Gráfico ── */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Visão por mês</h2>
              <p className="text-xs text-slate-400 mt-0.5">3 meses anteriores + mês atual + 3 meses projetados (recorrências)</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ background:"#10b981" }}/> Entradas</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ background:"#ef4444" }}/> Saídas</span>
            </div>
          </div>
          <BarChart meses={chartMeses} />
        </div>

        {/* ── Tabela por mês ── */}
        <div className="card mb-6">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-wrap gap-3">
            <h2 className="font-bold text-slate-900 text-lg">Lançamentos</h2>
            <select value={mesFiltro} onChange={e => setMesFiltro(e.target.value)} className="input-field w-auto text-sm">
              {mesesOpcoes.map(m => {
                const [y, mo] = m.split("-").map(Number);
                return <option key={m} value={m}>{MONTH_SHORT[mo-1]}/{String(y).slice(2)}</option>;
              })}
            </select>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-slate-400 text-center">Carregando...</p>
          ) : lancamentosMes.length === 0 ? (
            <p className="p-6 text-sm text-slate-400 text-center">Nenhum lançamento neste mês.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {lancamentosMes.map(l => {
                const isProj = l.id.includes("_proj_");
                return (
                  <div key={l.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0">{l.tipo === "entrada" ? "⬆️" : "⬇️"}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {l.categoria}
                          {isProj && <span className="ml-1.5 text-xs text-slate-400 font-normal">(projeção)</span>}
                          {l.recorrente && !isProj && <span className="ml-1.5 text-xs text-slate-400 font-normal">🔁 {l.recorrencia}</span>}
                        </p>
                        {l.descricao && <p className="text-xs text-slate-400 truncate">{l.descricao}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: l.tipo === "entrada" ? "#10b981" : "#ef4444" }}>
                          {l.tipo === "entrada" ? "+" : "−"} R$ {formatBRL(l.valor)}
                        </p>
                        <p className="text-xs text-slate-400">{new Date(l.data + "T12:00:00").toLocaleDateString("pt-BR")}</p>
                      </div>
                      {!isProj && (
                        <button onClick={() => handleDelete(l.id)}
                          className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none"
                          title="Excluir">×</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Subtotal do mês */}
          {lancamentosMes.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t-2 border-slate-100 bg-slate-50/50">
              <span className="text-sm font-semibold text-slate-600">Saldo do mês</span>
              <span className="text-base font-bold" style={{ color: saldoMes >= 0 ? "#10b981" : "#ef4444" }}>
                R$ {formatBRL(saldoMes)}
              </span>
            </div>
          )}
        </div>

        {/* ── Totais gerais ── */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-500 text-xs uppercase tracking-wider mb-4">Acumulado geral (todos os lançamentos)</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-400 mb-1">Total entradas</p>
              <p className="text-lg font-bold text-emerald-600">R$ {formatBRL(totalEntradas)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Total saídas</p>
              <p className="text-lg font-bold text-red-500">R$ {formatBRL(totalSaidas)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Saldo líquido</p>
              <p className="text-lg font-bold" style={{ color: (totalEntradas - totalSaidas) >= 0 ? "#10b981" : "#ef4444" }}>
                R$ {formatBRL(totalEntradas - totalSaidas)}
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
