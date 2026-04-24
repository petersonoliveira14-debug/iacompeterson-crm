"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ChecklistItem {
  id: string;
  categoria: string;
  label: string;
  done: boolean;
  notas?: string;
}

// ─── Categorias disponíveis ───────────────────────────────────────────────────

const CATEGORIAS = [
  "Contrato",
  "Acesso",
  "Domínio",
  "Hospedagem",
  "Banco de dados",
  "Integrações",
  "WhatsApp Business",
  "IA",
  "Google",
  "Identidade Visual",
  "Conteúdo",
  "Pagamentos",
  "E-mail",
  "Infraestrutura",
  "Outro",
];

// ─── Gerador de itens inteligentes ───────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function gerarItensInteligentes(tipos: string[]): ChecklistItem[] {
  const universais: Omit<ChecklistItem, "id" | "done">[] = [
    { categoria: "Contrato", label: "Contrato / proposta assinada" },
    { categoria: "Acesso", label: "E-mail de contato principal" },
    { categoria: "Identidade Visual", label: "Logotipo em SVG ou PNG fundo transparente" },
    { categoria: "Identidade Visual", label: "Brandbook ou manual de identidade (se houver)" },
    { categoria: "Identidade Visual", label: "Cores primárias e secundárias (hex)" },
    { categoria: "Identidade Visual", label: "Fontes da marca" },
    { categoria: "Identidade Visual", label: "MIV (Material de Identidade Visual) completo" },
  ];

  const especificos: Omit<ChecklistItem, "id" | "done">[] = [];

  if (tipos.includes("sistema") || tipos.includes("plataforma")) {
    especificos.push(
      { categoria: "Infraestrutura", label: "Domínio do sistema (ex: app.empresa.com)" },
      { categoria: "Infraestrutura", label: "Credenciais do servidor / hosting" },
      { categoria: "Banco de dados", label: "Tipo de banco desejado (PostgreSQL, MySQL...)" },
      { categoria: "Banco de dados", label: "Dados de acesso ao banco (se já existente)" },
      { categoria: "Integrações", label: "APIs externas a integrar (lista + documentação)" },
    );
  }
  if (tipos.includes("plataforma")) {
    especificos.push(
      { categoria: "Pagamentos", label: "Gateway de pagamento (Stripe, PagSeguro, Asaas...)" },
      { categoria: "Pagamentos", label: "Chaves de API do gateway (test + production)" },
      { categoria: "E-mail", label: "Provedor de e-mail transacional (SendGrid, Resend...)" },
      { categoria: "E-mail", label: "Domínio verificado para envio de e-mails" },
    );
  }
  if (tipos.includes("atendimento")) {
    especificos.push(
      { categoria: "WhatsApp Business", label: "Número de WhatsApp dedicado para o bot" },
      { categoria: "WhatsApp Business", label: "Acesso à conta Meta Business Manager" },
      { categoria: "WhatsApp Business", label: "Token de acesso à API do WhatsApp (Meta)" },
      { categoria: "WhatsApp Business", label: "Webhook URL definida (se self-hosted)" },
      { categoria: "Integrações", label: "CRM de destino das conversas (se houver)" },
    );
  }
  if (tipos.includes("assistente")) {
    especificos.push(
      { categoria: "IA", label: "Chave de API OpenAI (ou outro LLM)" },
      { categoria: "IA", label: "Base de conhecimento: PDFs, docs, FAQ, catálogo" },
      { categoria: "IA", label: "Tom de voz e persona do assistente (texto descritivo)" },
      { categoria: "IA", label: "Perguntas e respostas mais frequentes do negócio" },
    );
  }
  if (tipos.includes("site_lp")) {
    especificos.push(
      { categoria: "Domínio", label: "Domínio do site (ex: empresa.com.br)" },
      { categoria: "Domínio", label: "Acesso ao painel de DNS (Registro.br, GoDaddy...)" },
      { categoria: "Hospedagem", label: "Hospedagem definida ou preferência (Vercel, Hostinger...)" },
      { categoria: "Conteúdo", label: "Textos da página aprovados pelo cliente" },
      { categoria: "Conteúdo", label: "Fotos e imagens autorizadas para uso" },
      { categoria: "Conteúdo", label: "Depoimentos / prova social" },
    );
  }

  // Google — universal
  especificos.push(
    { categoria: "Google", label: "Acesso ao Google Analytics (GA4)" },
    { categoria: "Google", label: "Google Tag Manager (se em uso)" },
    { categoria: "Google", label: "Google Search Console" },
  );

  return [
    ...universais.map(i => ({ ...i, id: uid(), done: false })),
    ...especificos.map(i => ({ ...i, id: uid(), done: false })),
  ];
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ChecklistPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  // ── Add item form ──
  const [addOpen, setAddOpen] = useState(false);
  const [newCategoria, setNewCategoria] = useState("Outro");
  const [newLabel, setNewLabel] = useState("");

  // ── Notas abertas ──
  const [notasAbertas, setNotasAbertas] = useState<Set<string>>(new Set());

  // ── Debounce save ──
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSave = useCallback((nextItems: ChecklistItem[]) => {
    setSaveStatus("unsaved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      const { error } = await supabase
        .from("clientes")
        .update({ checklist_itens: nextItems })
        .eq("id", id);
      if (error) {
        toast.error("Erro ao salvar checklist.");
        setSaveStatus("unsaved");
      } else {
        setSaveStatus("saved");
      }
    }, 800);
  }, [id]);

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) { router.push("/admin/login"); return; }
    supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { router.push("/admin/clientes"); return; }
        setCliente(data);
        const saved: ChecklistItem[] = data.checklist_itens || [];
        if (saved.length > 0) {
          setItems(saved);
        } else {
          const tipos: string[] = data.tipos_solucao || (data.tipo_solucao ? data.tipo_solucao.split(", ") : []);
          const gerados = gerarItensInteligentes(tipos);
          setItems(gerados);
          // Salvar logo de início
          supabase.from("clientes").update({ checklist_itens: gerados }).eq("id", id);
        }
        setLoading(false);
      });
  }, [id, router]);

  const toggle = (itemId: string) => {
    const next = items.map(i => i.id === itemId ? { ...i, done: !i.done } : i);
    setItems(next);
    scheduleSave(next);
  };

  const updateNotas = (itemId: string, notas: string) => {
    const next = items.map(i => i.id === itemId ? { ...i, notas } : i);
    setItems(next);
    scheduleSave(next);
  };

  const deleteItem = (itemId: string) => {
    const next = items.filter(i => i.id !== itemId);
    setItems(next);
    scheduleSave(next);
  };

  const addItem = () => {
    if (!newLabel.trim()) return;
    const novo: ChecklistItem = { id: uid(), categoria: newCategoria, label: newLabel.trim(), done: false };
    const next = [...items, novo];
    setItems(next);
    scheduleSave(next);
    setNewLabel("");
    setAddOpen(false);
    toast.success("Item adicionado.");
  };

  const toggleNotas = (itemId: string) => {
    setNotasAbertas(prev => {
      const s = new Set(prev);
      if (s.has(itemId)) s.delete(itemId); else s.add(itemId);
      return s;
    });
  };

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center text-slate-400">Carregando...</div>
    </div>
  );

  // ── Agrupar por categoria ──
  const categorias = Array.from(new Set(items.map(i => i.categoria)));
  const done = items.filter(i => i.done).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/admin/clientes" className="hover:text-slate-600">Clientes</Link>
          <span>›</span>
          <Link href={`/admin/clientes/${id}`} className="hover:text-slate-600">
            {cliente?.nome_empresa || cliente?.nome_contato}
          </Link>
          <span>›</span>
          <span className="text-slate-700 font-medium">Checklist</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl text-slate-900">Checklist do Projeto</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Inputs externos necessários para iniciar a execução
            </p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            saveStatus === "saved" ? "bg-emerald-50 text-emerald-700" :
            saveStatus === "saving" ? "bg-amber-50 text-amber-700" :
            "bg-slate-100 text-slate-500"
          }`}>
            {saveStatus === "saved" ? "✓ Salvo" : saveStatus === "saving" ? "Salvando..." : "Não salvo"}
          </span>
        </div>

        {/* Progress */}
        <div className="card p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-medium text-slate-700">{done} de {total} itens concluídos</span>
            <span className={`text-base font-bold ${pct === 100 ? "text-emerald-600" : "text-navy-700"}`}>{pct}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-navy-600"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && (
            <p className="text-xs text-emerald-600 font-medium mt-2">
              🎉 Todos os inputs coletados! Você está pronto para iniciar o projeto.
            </p>
          )}
        </div>

        {/* Hint */}
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-3 mb-5 text-sm text-navy-800">
          ✨ Lista gerada com base no briefing de <strong>{cliente?.nome_empresa || cliente?.nome_contato}</strong>.
          Adicione ou remova itens conforme necessário.
        </div>

        {/* Itens por categoria */}
        {categorias.map(cat => {
          const catItems = items.filter(i => i.categoria === cat);
          const catDone = catItems.filter(i => i.done).length;
          return (
            <div key={cat} className="card p-5 mb-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-700 text-xs uppercase tracking-wider">{cat}</h2>
                <span className="text-sm text-slate-400">{catDone}/{catItems.length}</span>
              </div>
              <ul className="space-y-2">
                {catItems.map(item => (
                  <li key={item.id}>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggle(item.id)}
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          item.done
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-slate-300 hover:border-emerald-400"
                        }`}
                      >
                        {item.done && <span className="text-xs font-bold">✓</span>}
                      </button>
                      <span className={`flex-1 text-base leading-snug ${item.done ? "line-through text-slate-400" : "text-slate-700"}`}>
                        {item.label}
                      </span>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => toggleNotas(item.id)}
                          className="text-slate-300 hover:text-slate-500 text-xs px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
                          title="Adicionar observação"
                        >
                          📝
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-300 hover:text-red-400 text-xs px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                          title="Remover item"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {notasAbertas.has(item.id) && (
                      <div className="mt-2 ml-8">
                        <textarea
                          className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-gold-400"
                          rows={2}
                          placeholder="Observação, link, credencial... (salvo automaticamente)"
                          value={item.notas || ""}
                          onChange={e => updateNotas(item.id, e.target.value)}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Adicionar item */}
        {!addOpen ? (
          <button
            onClick={() => setAddOpen(true)}
            className="w-full card p-4 text-sm text-slate-500 hover:text-navy-700 hover:border-gold-300 transition-all text-center border-dashed"
          >
            + Adicionar item personalizado
          </button>
        ) : (
          <div className="card p-4">
            <p className="text-sm font-medium text-slate-700 mb-3">Novo item</p>
            <div className="flex gap-2 mb-3 flex-wrap">
              <select
                value={newCategoria}
                onChange={e => setNewCategoria(e.target.value)}
                className="input-field text-sm w-auto"
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <input
                autoFocus
                className="input-field text-sm flex-1"
                placeholder="Descrição do item (ex: API Key do Stripe)"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addItem(); if (e.key === "Escape") setAddOpen(false); }}
              />
              <button onClick={addItem} className="btn-primary text-sm py-2 px-4">Adicionar</button>
              <button onClick={() => { setAddOpen(false); setNewLabel(""); }} className="btn-secondary text-sm py-2 px-3">×</button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Enter para adicionar · Esc para cancelar</p>
          </div>
        )}

        <p className="text-center text-xs text-slate-300 mt-6">
          Salvo automaticamente no perfil do cliente · Visível apenas no painel admin
        </p>

      </main>
    </div>
  );
}
