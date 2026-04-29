"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface Pacote {
  nome: string;
  descricao: string;
  itens: string;
  valor: string;
  prazo_dias: string;
  destaque: boolean;
}

// ─── Mapas e lógica de geração ────────────────────────────────────────────────

const DORES_LABELS: Record<string, string> = {
  sem_followup: "Follow-up automatizado de clientes",
  sem_registro: "Registro automático de processos e histórico",
  atendimento_lento: "Atendimento ágil e respostas instantâneas",
  sem_visibilidade_funil: "Visibilidade completa do funil comercial",
  tarefas_repetitivas: "Automação de tarefas repetitivas",
  escala_sem_contratar: "Escalonamento sem necessidade de novas contratações",
  sem_metricas: "Rastreamento de resultados e métricas em tempo real",
  vendas_desorganizadas: "Processo de vendas estruturado e organizado",
};

const PRICE_MAP: Record<string, [number, number, number]> = {
  ate_2k:    [1200,  1800,  2500],
  "2k_5k":   [2200,  3800,  5200],
  "5k_15k":  [4500,  8500, 13500],
  acima_15k: [14000, 22000, 35000],
};

const PRAZO_MAP: Record<string, [number, number, number]> = {
  urgente:     [7,  14, 21],
  "1_2_meses": [21, 30, 45],
  "3_meses":   [30, 45, 60],
  sem_pressa:  [30, 45, 60],
};

function itensPorTipo(tipos: string[]): string[] {
  const base: string[] = [];
  if (tipos.includes("sistema"))     base.push("Sistema web responsivo", "Painel de gestão", "Relatórios automáticos");
  if (tipos.includes("atendimento")) base.push("Bot WhatsApp integrado", "Respostas automáticas 24/7", "Menu interativo");
  if (tipos.includes("assistente"))  base.push("Assistente IA personalizado", "Base de conhecimento treinada", "Integração com seus dados");
  if (tipos.includes("site_lp"))     base.push("Landing page otimizada", "Formulário de captação", "Integração com CRM");
  if (tipos.includes("plataforma"))  base.push("Área de membros", "Gestão de usuários", "Dashboard personalizado");
  if (base.length === 0)             base.push("Solução personalizada", "Painel administrativo", "Documentação técnica");
  return base;
}

function gerarPacotes(c: any): Pacote[] {
  const precos = PRICE_MAP[c.faixa_investimento] || [3000, 6000, 10000];
  const prazos = PRAZO_MAP[c.prazo_desejado] || [21, 30, 45];
  const tipos: string[] = c.tipos_solucao || (c.tipo_solucao ? c.tipo_solucao.split(", ") : []);
  const itensBase = itensPorTipo(tipos);
  const doresResolvidas = (c.dores_b2b || [])
    .slice(0, 4)
    .map((d: string) => DORES_LABELS[d] || d);

  return [
    {
      nome: "Essencial",
      descricao: "Solução inicial com o essencial para começar",
      itens: [
        itensBase[0] || "Módulo principal",
        itensBase[1] || "Configuração inicial",
        "Suporte por 15 dias",
        ...(doresResolvidas.slice(0, 1)),
      ].filter(Boolean).join("\n"),
      valor: String(precos[0]),
      prazo_dias: String(prazos[0]),
      destaque: false,
    },
    {
      nome: "Profissional",
      descricao: "Solução completa — a mais escolhida",
      itens: [
        ...itensBase,
        "Suporte por 30 dias",
        "Treinamento da equipe",
        ...doresResolvidas,
      ].filter(Boolean).join("\n"),
      valor: String(precos[1]),
      prazo_dias: String(prazos[1]),
      destaque: true,
    },
    {
      nome: "Premium",
      descricao: "Tudo incluído + suporte estendido e personalizações",
      itens: [
        ...itensBase,
        "Suporte por 60 dias",
        "Treinamento completo da equipe",
        "Customizações extras",
        "Reuniões de acompanhamento mensais",
        ...doresResolvidas,
      ].filter(Boolean).join("\n"),
      valor: String(precos[2]),
      prazo_dias: String(prazos[2]),
      destaque: false,
    },
  ];
}

const defaultPacotes = (): Pacote[] => [
  { nome: "Essencial", descricao: "", itens: "", valor: "", prazo_dias: "", destaque: false },
  { nome: "Profissional", descricao: "", itens: "", valor: "", prazo_dias: "", destaque: true },
  { nome: "Premium", descricao: "", itens: "", valor: "", prazo_dias: "", destaque: false },
];

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PropostaBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [validade, setValidade] = useState("");
  const [pacotes, setPacotes] = useState<Pacote[]>(defaultPacotes());
  const [saving, setSaving] = useState(false);

  // Estado para proposta existente
  const [existingPropostaId, setExistingPropostaId] = useState<string | null>(null);
  const [existingToken, setExistingToken] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // true = editando proposta existente

  // Exibição pós-save
  const [savedToken, setSavedToken] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) { router.push("/admin/login"); return; }

    // Validade padrão: 7 dias a partir de hoje
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + 7);
    const defaultValidade = hoje.toISOString().split("T")[0];
    setValidade(defaultValidade);

    const loadData = async () => {
      // 1) Carregar cliente
      const { data: clienteData } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();

      if (!clienteData) return;
      setCliente(clienteData);

      // 2) Query 1: verificar se já existe proposta para este cliente (sem join)
      const { data: propostaExistente } = await supabase
        .from("propostas")
        .select("id, token, validade_ate, status")
        .eq("cliente_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (propostaExistente) {
        setExistingPropostaId(propostaExistente.id);
        setExistingToken(propostaExistente.token);
        setIsEditing(true);

        if (propostaExistente.validade_ate) {
          setValidade(propostaExistente.validade_ate.split("T")[0]);
        }

        // Query 2: buscar pacotes separadamente (evita problema de maybeSingle + join 1→N)
        const { data: pacotesData } = await supabase
          .from("proposta_pacotes")
          .select("*")
          .eq("proposta_id", propostaExistente.id);

        if (pacotesData && pacotesData.length > 0) {
          setPacotes(
            pacotesData.map((p: any) => ({
              nome: p.nome || "",
              descricao: p.descricao || "",
              itens: Array.isArray(p.itens) ? p.itens.join("\n") : p.itens || "",
              valor: String(p.valor ?? ""),
              prazo_dias: String(p.prazo_dias ?? ""),
              destaque: !!p.destaque,
            }))
          );
        }
      } else {
        // Nova proposta: pré-preencher com base no briefing
        setPacotes(gerarPacotes(clienteData));
      }
    };

    loadData();
  }, [id, router]);

  const updatePacote = (i: number, field: keyof Pacote, value: string | boolean) => {
    setPacotes(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const handleSave = async () => {
    const validPacotes = pacotes.filter(p => p.nome && p.valor && p.prazo_dias);
    if (validPacotes.length === 0) {
      toast.error("Preencha ao menos um pacote com nome, valor e prazo.");
      return;
    }

    setSaving(true);
    try {
      const pacoteRows = validPacotes.map(p => ({
        nome: p.nome,
        descricao: p.descricao || null,
        itens: p.itens.split("\n").filter(Boolean),
        valor: parseFloat(p.valor.replace(",", ".")),
        prazo_dias: parseInt(p.prazo_dias),
        destaque: p.destaque,
      }));

      if (isEditing && existingPropostaId) {
        // ── UPDATE proposta existente ──────────────────────────────────────────
        const { error: updateError } = await supabase
          .from("propostas")
          .update({ validade_ate: validade || null })
          .eq("id", existingPropostaId);

        if (updateError) throw updateError;

        // Deletar pacotes antigos e reinserir
        const { error: deleteError } = await supabase
          .from("proposta_pacotes")
          .delete()
          .eq("proposta_id", existingPropostaId);

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase
          .from("proposta_pacotes")
          .insert(pacoteRows.map(p => ({ proposta_id: existingPropostaId, ...p })));

        if (insertError) throw insertError;

        toast.success("Proposta atualizada com sucesso!");
        setSavedToken(existingToken);
      } else {
        // ── INSERT nova proposta ───────────────────────────────────────────────
        const token = Array.from(crypto.getRandomValues(new Uint8Array(12)))
          .map(b => b.toString(16).padStart(2, "0"))
          .join("");

        const { data: proposta, error: propostaError } = await supabase
          .from("propostas")
          .insert({ cliente_id: id, token, validade_ate: validade || null, status: "rascunho" })
          .select("id, token")
          .single();

        if (propostaError || !proposta) throw propostaError || new Error("Erro ao criar proposta");

        const { error: pacotesError } = await supabase
          .from("proposta_pacotes")
          .insert(pacoteRows.map(p => ({ proposta_id: proposta.id, ...p })));

        if (pacotesError) throw pacotesError;

        await supabase.from("clientes").update({ status: "proposta_elaborada" }).eq("id", id);

        setExistingPropostaId(proposta.id);
        setExistingToken(proposta.token);
        setIsEditing(true);
        setSavedToken(proposta.token);
        toast.success("Proposta criada com sucesso!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro ao salvar proposta.");
    } finally {
      setSaving(false);
    }
  };

  const propostaLink = savedToken
    ? `${typeof window !== "undefined" ? window.location.origin : "https://iacompeterson.com.br"}/proposta/${savedToken}`
    : existingToken
      ? `${typeof window !== "undefined" ? window.location.origin : "https://iacompeterson.com.br"}/proposta/${existingToken}`
      : null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/admin/clientes" className="hover:text-slate-600">Clientes</Link>
          <span>›</span>
          <Link href={`/admin/clientes/${id}`} className="hover:text-slate-600">
            {cliente?.nome_empresa || cliente?.nome_contato || "Cliente"}
          </Link>
          <span>›</span>
          <span className="text-slate-700">Proposta</span>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl text-slate-900">
            {isEditing ? "Editar Proposta" : "Builder de Proposta"}
          </h1>
          {isEditing && (
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              ✏️ Editando proposta existente
            </span>
          )}
        </div>

        {/* Link da proposta existente (sempre visível quando existe) */}
        {propostaLink && (
          <div
            className="rounded-xl p-4 mb-5"
            style={{
              background: "rgba(201,168,76,0.10)",
              border: "1px solid rgba(201,168,76,0.28)",
            }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: "#c9a84c" }}>🔗 Link da proposta:</p>
            <div className="flex gap-2">
              <code className="text-sm flex-1 overflow-x-auto break-all" style={{ color: "#e8c96a" }}>{propostaLink}</code>
              <button
                onClick={() => { navigator.clipboard.writeText(propostaLink!); toast.success("Copiado!"); }}
                className="btn-primary py-1.5 px-3 text-xs flex-shrink-0"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        {/* Aviso de pré-preenchimento */}
        {cliente && !isEditing && (
          <div
            className="rounded-xl p-3 mb-5 text-sm"
            style={{
              background: "rgba(201,168,76,0.12)",
              border: "1px solid rgba(201,168,76,0.30)",
              color: "#c9a84c",
            }}
          >
            ✨ Pacotes pré-preenchidos com base no briefing de{" "}
            <strong style={{ color: "#e8c96a" }}>{cliente.nome_empresa || cliente.nome_contato}</strong>. Revise e ajuste os valores antes de criar.
          </div>
        )}

        <div className="card p-5 mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Validade da proposta
            <span className="ml-2 text-xs font-normal text-slate-400">(padrão: 7 dias a partir de hoje)</span>
          </label>
          <input type="date" className="input-field w-auto" value={validade} onChange={e => setValidade(e.target.value)} />
        </div>

        <div className="space-y-4 mb-6">
          {pacotes.map((p, i) => (
            <div key={i} className={`card p-5 ${p.destaque ? "border-gold-300" : ""}`}>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-slate-800">Pacote {i + 1}</h3>
                {p.destaque && <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full font-medium">⭐ Destaque</span>}
                <label className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto cursor-pointer">
                  <input type="checkbox" checked={p.destaque}
                    onChange={e => updatePacote(i, "destaque", e.target.checked)}
                    className="accent-gold-500" />
                  Marcar como destaque
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nome *</label>
                  <input className="input-field" value={p.nome}
                    onChange={e => updatePacote(i, "nome", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Valor (R$) *</label>
                  <input className="input-field" value={p.valor}
                    onChange={e => updatePacote(i, "valor", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Prazo (dias úteis) *</label>
                  <input className="input-field" value={p.prazo_dias}
                    onChange={e => updatePacote(i, "prazo_dias", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Descrição curta</label>
                  <input className="input-field" value={p.descricao}
                    onChange={e => updatePacote(i, "descricao", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    O que está incluso (1 item por linha)
                  </label>
                  <textarea className="input-field h-28 resize-none pt-2 text-xs"
                    value={p.itens}
                    onChange={e => updatePacote(i, "itens", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-4 text-base">
            {saving
              ? (isEditing ? "Salvando alterações..." : "Criando proposta...")
              : isEditing
                ? "💾 Salvar alterações"
                : "✅ Criar proposta e gerar link"}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                if (cliente) setPacotes(gerarPacotes(cliente));
                setIsEditing(false);
                setExistingPropostaId(null);
                setExistingToken(null);
                setSavedToken(null);
              }}
              className="btn-secondary py-4 px-5 text-sm"
              title="Criar uma nova proposta do zero"
            >
              + Nova proposta
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-4 justify-center">
          <Link href={`/admin/clientes/${id}`} className="btn-secondary text-sm py-2">← Voltar ao cliente</Link>
        </div>
      </main>
    </div>
  );
}
