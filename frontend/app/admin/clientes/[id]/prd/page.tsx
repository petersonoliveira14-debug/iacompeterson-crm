"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

// ─── Mapas de rótulos ─────────────────────────────────────────────────────────

const PORTE_LABELS: Record<string, string> = {
  somente_eu: "Só eu", "2_5": "2–5 pessoas", "6_20": "6–20 pessoas",
  "21_50": "21–50 pessoas", "51_mais": "51+ pessoas",
};
const FATURAMENTO_LABELS: Record<string, string> = {
  ate_20k: "Até R$20k/mês", "20k_80k": "R$20k–R$80k",
  "80k_250k": "R$80k–R$250k", "250k_1m": "R$250k–R$1M", acima_1m: "+R$1M",
};
const TEMPO_LABELS: Record<string, string> = {
  menos_1ano: "Menos de 1 ano", "1_3anos": "1–3 anos",
  "3_10anos": "3–10 anos", mais_10anos: "Mais de 10 anos",
};
const DORES_LABELS: Record<string, string> = {
  sem_followup: "Perco clientes por falta de follow-up",
  sem_registro: "Minha equipe não registra processos",
  atendimento_lento: "Atendimento lento está me fazendo perder vendas",
  sem_visibilidade_funil: "Não tenho visibilidade do meu funil comercial",
  tarefas_repetitivas: "Muito tempo perdido em tarefas repetitivas",
  escala_sem_contratar: "Difícil crescer sem contratar mais pessoas",
  sem_metricas: "Não consigo rastrear resultados e métricas",
  vendas_desorganizadas: "Processo de vendas totalmente desorganizado",
};
const PRAZO_LABELS: Record<string, string> = {
  urgente: "Urgente (menos de 30 dias)", "1_2_meses": "1 a 2 meses",
  "3_meses": "3 meses ou mais", sem_pressa: "Sem pressa definida",
};
const INVESTIMENTO_LABELS: Record<string, string> = {
  ate_2k: "Até R$2.000", "2k_5k": "R$2.000–R$5.000",
  "5k_15k": "R$5.000–R$15.000", acima_15k: "Acima de R$15.000",
};
const BUDGET_LABELS: Record<string, string> = {
  menos_5k: "menos de R$5.000/mês", "5k_15k": "R$5.000–R$15.000/mês",
  "15k_50k": "R$15.000–R$50.000/mês", mais_50k: "mais de R$50.000/mês",
};
const CANAL_LABELS: Record<string, string> = {
  indicacao: "Indicação de clientes", google_seo: "Google / SEO / Blog",
  social_media: "Instagram / TikTok / Redes sociais", linkedin: "LinkedIn / Outreach",
  portais: "Portais e marketplaces", cold_outreach: "Prospecção ativa (cold)",
};
const TECH_LABELS: Record<string, string> = {
  leigo: "Leigo — precisa de suporte e simplicidade",
  intermediario: "Intermediário — usa ferramentas, mas não programa",
  avancado: "Avançado — possui equipe técnica própria",
};
const TIPO_LABELS: Record<string, string> = {
  sistema: "Sistema interno (CRM, ERP, pipeline...)",
  atendimento: "Atendimento automatizado (bot, WhatsApp, Instagram...)",
  assistente: "Assistente com IA",
  site_lp: "Site / Landing Page / Página de vendas",
  plataforma: "Plataforma de usuários (portal, área de membros...)",
};

// ─── Interface e gerador de estrutura ────────────────────────────────────────

interface EstruturaItem {
  id: string;
  label: string;
  incluir: boolean;
}

function uid(): string {
  return Math.random().toString(36).slice(2);
}

function gerarEstrutura(c: any): EstruturaItem[] {
  const tipos: string[] = c.tipos_solucao || (c.tipo_solucao ? c.tipo_solucao.split(", ") : []);
  const dores: string[] = c.dores_b2b || [];

  const itens: EstruturaItem[] = [];

  // Base universal
  itens.push({ id: uid(), label: "Diagnóstico e levantamento de requisitos", incluir: true });
  itens.push({ id: uid(), label: "Reunião de kickoff com o cliente", incluir: true });

  if (tipos.includes("sistema") || tipos.includes("plataforma")) {
    itens.push({ id: uid(), label: "Painel de gestão administrativo (dashboard)", incluir: true });
    itens.push({ id: uid(), label: "Banco de dados e modelagem de entidades", incluir: true });
    itens.push({ id: uid(), label: "Autenticação e controle de acesso por perfil", incluir: true });
    itens.push({ id: uid(), label: "Relatórios e exportação de dados", incluir: true });
  }

  if (tipos.includes("atendimento")) {
    itens.push({ id: uid(), label: "Bot de atendimento automatizado via WhatsApp", incluir: true });
    itens.push({ id: uid(), label: "Fluxo de qualificação de leads", incluir: true });
    itens.push({ id: uid(), label: "Integração com WhatsApp Business API", incluir: true });
    itens.push({ id: uid(), label: "Handoff automático para atendente humano", incluir: true });
  }

  if (tipos.includes("assistente")) {
    itens.push({ id: uid(), label: "Agente de IA com base de conhecimento personalizada", incluir: true });
    itens.push({ id: uid(), label: "Integração com modelo de linguagem (OpenAI/Claude)", incluir: true });
    itens.push({ id: uid(), label: "Memória de contexto e histórico de conversas", incluir: true });
  }

  if (tipos.includes("site_lp")) {
    itens.push({ id: uid(), label: "Landing page com copy persuasiva e CTA", incluir: true });
    itens.push({ id: uid(), label: "Formulário de captura e integração com CRM", incluir: true });
    itens.push({ id: uid(), label: "SEO on-page e otimização de performance", incluir: true });
  }

  if (tipos.includes("plataforma")) {
    itens.push({ id: uid(), label: "Área de membros com login e controle de acesso", incluir: true });
    itens.push({ id: uid(), label: "Gestão de usuários e permissões", incluir: true });
  }

  // Baseado nas dores
  if (dores.includes("sem_followup")) {
    itens.push({ id: uid(), label: "Sistema de follow-up automático por etapa do funil", incluir: true });
  }
  if (dores.includes("sem_metricas")) {
    itens.push({ id: uid(), label: "Dashboard de métricas e KPIs do negócio", incluir: true });
  }
  if (dores.includes("tarefas_repetitivas")) {
    itens.push({ id: uid(), label: "Automação de tarefas operacionais repetitivas", incluir: true });
  }
  if (dores.includes("sem_visibilidade_funil")) {
    itens.push({ id: uid(), label: "Visualização do funil comercial em tempo real", incluir: true });
  }
  if (dores.includes("vendas_desorganizadas")) {
    itens.push({ id: uid(), label: "Pipeline de vendas e CRM integrado", incluir: true });
  }

  // Universal final
  itens.push({ id: uid(), label: "Treinamento da equipe e documentação", incluir: true });
  itens.push({ id: uid(), label: "Suporte técnico pós-entrega (30 dias)", incluir: true });

  return itens;
}

// ─── Gerador de PRD ───────────────────────────────────────────────────────────

const PRAZO_DURACAO: Record<string, number> = {
  urgente: 21,
  "1_2_meses": 35,
  "3_meses": 55,
  sem_pressa: 60,
};

function gerarPRD(c: any, itensSelecionados: string[] = []): string {
  const tiposArr: string[] = c.tipos_solucao || (c.tipo_solucao ? c.tipo_solucao.split(", ") : []);
  const tipos = tiposArr.map((t: string) => TIPO_LABELS[t] || t).join(", ") || "A definir";
  const dores = (c.dores_b2b || [])
    .map((d: string) => `- ${DORES_LABELS[d] || d}`).join("\n");
  const dorOutraLine = c.dor_outra ? `- ${c.dor_outra}` : "";
  const hoje = new Date().toLocaleDateString("pt-BR");

  const prazoTotal = PRAZO_DURACAO[c.prazo_desejado] || 45;
  const f1End = 3;
  const f2End = Math.max(f1End + 2, Math.round(prazoTotal * 0.2));
  const f3End = Math.round(prazoTotal * 0.7);
  const f4End = Math.round(prazoTotal * 0.9);
  const f5End = prazoTotal;

  const escopoLinhas =
    itensSelecionados.length > 0
      ? itensSelecionados.map((label) => `- [ ] ${label}`).join("\n")
      : `- [ ] Levantamento detalhado de requisitos e fluxos
- [ ] Definição de integrações necessárias
- [ ] Arquitetura e stack tecnológica
- [ ] Desenvolvimento, testes e homologação
- [ ] Treinamento da equipe e go-live
- [ ] Suporte pós-entrega`;

  return `# PRD — ${c.nome_empresa || c.nome_contato}
> Gerado automaticamente em ${hoje} · Versão 1 · Revisar antes de apresentar ao cliente

---

## 1. Visão geral do projeto

| Campo | Valor |
|-------|-------|
| **Cliente** | ${c.nome_empresa || c.nome_contato} |
| **Contato** | ${c.nome_contato} |
| **WhatsApp** | ${c.whatsapp} |
| **Segmento** | ${c.segmento || "—"} |
| **Porte da empresa** | ${PORTE_LABELS[c.porte_empresa] || "—"} |
| **Faturamento mensal** | ${FATURAMENTO_LABELS[c.faturamento_mensal] || "—"} |
| **Tempo no mercado** | ${TEMPO_LABELS[c.tempo_empresa] || "—"} |
| **CNPJ / CPF** | ${c.cnpj || c.cpf || "—"} |

---

## 2. Problema a resolver

Atualmente a empresa gerencia seus processos via **${c.como_gerencia_hoje || "método não informado"}**, com um volume médio de **${c.volume_atendimentos || "—"}** atendimentos por dia.

### Dores identificadas pelo cliente:
${dores || "- Não informado"}
${dorOutraLine}

---

## 3. Solução proposta

**Tipo(s) de solução:** ${tipos}

### Escopo preliminar (a validar com o cliente):
${escopoLinhas}

---

## 4. Contexto do negócio

**Diferencial competitivo:**
${c.diferencial || "A preencher com o cliente"}

**Cliente ideal (ICP):**
${c.icp || "A preencher com o cliente"}

**Principal canal de aquisição:** ${CANAL_LABELS[c.canal_aquisicao] || "—"}

**Maturidade tecnológica:** ${TECH_LABELS[c.experiencia_tech] || "—"}

---

## 5. Resultados esperados

${c.resultado_esperado || "A definir com o cliente na reunião de discovery"}

---

## 6. Prazo e investimento

| Campo | Valor |
|-------|-------|
| **Prazo desejado** | ${PRAZO_LABELS[c.prazo_desejado] || "—"} |
| **Faixa de investimento no projeto** | ${INVESTIMENTO_LABELS[c.faixa_investimento] || "—"} |
| **Custo mensal atual (base do ROI)** | ${c.budget_mensal ? BUDGET_LABELS[c.budget_mensal] : "—"} |

> **Nota de ROI:** O cliente gasta atualmente ${c.budget_mensal ? BUDGET_LABELS[c.budget_mensal] : "valor não informado"} com os processos que deseja automatizar. A solução deve se pagar em até 6 meses para se justificar financeiramente.

---

## 7. Restrições e integrações obrigatórias

${c.restricoes || "Nenhuma restrição ou integração obrigatória informada pelo cliente."}

---

## 8. Critérios de aceite

- [ ] Sistema funcional em ambiente de produção
- [ ] Todos os fluxos principais testados e aprovados pelo cliente
- [ ] Documentação técnica entregue
- [ ] Treinamento da equipe realizado
- [ ] Suporte pós-entrega de 30 dias garantido

---

## 9. Riscos e pontos de atenção

- [ ] Integração com sistemas legados (verificar APIs disponíveis)
- [ ] Dependência de dados externos do cliente (base de clientes, produtos, etc.)
- [ ] Aprovação de identidade visual e textos pelo cliente
- [ ] Disponibilidade do cliente para validações durante o desenvolvimento

---

## 10. Cronograma de execução

| Fase | Atividade | Prazo estimado |
|------|-----------|----------------|
| Fase 1 | Kickoff, alinhamento e refinamento de escopo | Dias 1–${f1End} |
| Fase 2 | Prototipagem, wireframes e aprovação visual | Dias ${f1End + 1}–${f2End} |
| Fase 3 | Desenvolvimento e integrações | Dias ${f2End + 1}–${f3End} |
| Fase 4 | Testes, ajustes e homologação | Dias ${f3End + 1}–${f4End} |
| Fase 5 | Entrega, deploy e treinamento da equipe | Dias ${f4End + 1}–${f5End} |
| Pós-entrega | Suporte e monitoramento | 30 dias após entrega |

> Prazo total estimado: **${prazoTotal} dias úteis** a partir do kickoff.
> Cada fase pode ser ajustada conforme complexidade identificada nas reuniões de alinhamento.

---

## 11. Próximos passos

1. Apresentar e validar este PRD com o cliente
2. Ajustar escopo conforme feedback da reunião
3. Emitir proposta comercial com os pacotes
4. Coletar assinatura digital / aceite da proposta
5. Iniciar desenvolvimento após kickoff
`;
}

// ─── Stepper visual ───────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Estrutura" },
  { number: 2, label: "Revisão" },
  { number: 3, label: "PRD" },
];

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-8" role="list" aria-label="Etapas do fluxo">
      {STEPS.map((s, i) => {
        const isDone = step > s.number;
        const isCurrent = step === s.number;
        const isFuture = step < s.number;

        return (
          <div key={s.number} className="flex items-center" role="listitem">
            {/* Dot + label */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: isDone
                    ? "#16a34a"
                    : isCurrent
                    ? "#c9a84c"
                    : "#e2e8f0",
                  color: isDone || isCurrent ? "#ffffff" : "#94a3b8",
                }}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isDone ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.number
                )}
              </div>
              <span
                className="text-xs font-medium"
                style={{
                  color: isDone ? "#16a34a" : isCurrent ? "#c9a84c" : "#94a3b8",
                }}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className="h-0.5 w-16 sm:w-24 mx-1 mb-4 transition-colors"
                style={{
                  backgroundColor: step > s.number ? "#16a34a" : "#e2e8f0",
                }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PRDPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Stepper
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Etapa 1 — Estrutura
  const [estrutura, setEstrutura] = useState<EstruturaItem[]>([]);
  const [novoItem, setNovoItem] = useState("");
  const [salvandoEstrutura, setSalvandoEstrutura] = useState(false);

  // Etapa 3 — PRD
  const [conteudo, setConteudo] = useState("");
  const [versao, setVersao] = useState(1);
  const [docId, setDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Carregar dados ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem("admin_session")) {
      router.push("/admin/login");
      return;
    }

    Promise.all([
      supabase.from("clientes").select("*").eq("id", id).single(),
      supabase
        .from("documentos")
        .select("id, conteudo, versao")
        .eq("cliente_id", id)
        .eq("tipo", "prd")
        .order("versao", { ascending: false })
        .limit(1),
    ]).then(([clienteRes, docRes]) => {
      const c = clienteRes.data;
      if (c) {
        setCliente(c);

        if (c.estrutura_aprovada === true) {
          // Estrutura já aprovada — ir direto ao PRD
          if (c.estrutura_sistema && Array.isArray(c.estrutura_sistema)) {
            setEstrutura(c.estrutura_sistema);
          }
          setStep(3);
        } else if (c.estrutura_sistema && Array.isArray(c.estrutura_sistema) && c.estrutura_sistema.length > 0) {
          // Estrutura salva mas não aprovada — carregar na etapa 1
          setEstrutura(c.estrutura_sistema);
          setStep(1);
        } else {
          // Nenhuma estrutura — gerar automaticamente
          setEstrutura(gerarEstrutura(c));
          setStep(1);
        }
      }

      if (docRes.data && docRes.data.length > 0) {
        setConteudo(docRes.data[0].conteudo);
        setVersao(docRes.data[0].versao);
        setDocId(docRes.data[0].id);
      }

      setLoading(false);
    });
  }, [id, router]);

  // ── Etapa 1 — handlers ──────────────────────────────────────────────────────

  const toggleIncluir = (itemId: string) => {
    setEstrutura((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, incluir: !item.incluir } : item
      )
    );
  };

  const removerItem = (itemId: string) => {
    setEstrutura((prev) => prev.filter((item) => item.id !== itemId));
  };

  const adicionarItem = () => {
    const label = novoItem.trim();
    if (!label) return;
    setEstrutura((prev) => [...prev, { id: uid(), label, incluir: true }]);
    setNovoItem("");
  };

  const salvarEstrutura = async () => {
    setSalvandoEstrutura(true);
    try {
      const { error } = await supabase
        .from("clientes")
        .update({ estrutura_sistema: estrutura })
        .eq("id", id);
      if (error) throw error;
      toast.success("Estrutura salva!");
    } catch {
      toast.error("Erro ao salvar estrutura.");
    } finally {
      setSalvandoEstrutura(false);
    }
  };

  const aprovarEstrutura = async () => {
    const itensSelecionados = estrutura.filter((i) => i.incluir);
    if (itensSelecionados.length === 0) {
      toast.error("Selecione pelo menos um item antes de aprovar.");
      return;
    }
    setSalvandoEstrutura(true);
    try {
      const { error } = await supabase
        .from("clientes")
        .update({ estrutura_sistema: estrutura, estrutura_aprovada: true })
        .eq("id", id);
      if (error) throw error;
      toast.success("Estrutura aprovada! PRD habilitado.");
      setStep(3);
    } catch {
      toast.error("Erro ao aprovar estrutura.");
    } finally {
      setSalvandoEstrutura(false);
    }
  };

  // ── Etapa 3 — handlers ──────────────────────────────────────────────────────

  const handleGerarPRD = () => {
    if (!cliente) return;
    if (conteudo && !window.confirm("Já existe conteúdo no editor. Deseja substituir pelo PRD gerado?")) return;
    const itensSelecionados = estrutura.filter((i) => i.incluir).map((i) => i.label);
    setConteudo(gerarPRD(cliente, itensSelecionados));
    toast.success("PRD gerado! Revise e ajuste antes de salvar.");
  };

  const save = async (status: string) => {
    setSaving(true);
    try {
      if (docId) {
        const { error } = await supabase
          .from("documentos")
          .update({ conteudo, status, versao })
          .eq("id", docId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("documentos")
          .insert({ cliente_id: id, tipo: "prd", versao, conteudo, status })
          .select("id")
          .single();
        if (error) throw error;
        setDocId(data.id);
      }

      if (status === "aprovado") {
        await supabase.from("clientes").update({ status: "prd_aprovado" }).eq("id", id);
        toast.success("PRD aprovado! Cliente avançado para PRD Aprovado.");
      } else {
        toast.success("PRD salvo como rascunho.");
      }
    } catch {
      toast.error("Erro ao salvar PRD.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const nomeCliente = cliente?.nome_empresa || cliente?.nome_contato || "Cliente";
  const itensSelecionados = estrutura.filter((i) => i.incluir);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6" aria-label="Navegação">
          <Link href="/admin/clientes" className="hover:text-slate-600 transition-colors">
            Clientes
          </Link>
          <span aria-hidden="true">›</span>
          <Link href={`/admin/clientes/${id}`} className="hover:text-slate-600 transition-colors">
            {nomeCliente}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">PRD v{versao}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Editor de PRD</h1>
            {cliente && (
              <p className="text-sm text-slate-500 mt-1">{nomeCliente}</p>
            )}
          </div>
        </div>

        {/* Stepper */}
        <Stepper step={step} />

        {/* ── Loading ── */}
        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-yellow-500 animate-spin"
              aria-label="Carregando"
              role="status"
            />
          </div>
        )}

        {/* ── Etapa 1 — Estrutura do Sistema ── */}
        {!loading && step === 1 && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Etapa 1 — Estrutura do Sistema
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Revise os módulos e funcionalidades gerados com base no briefing do cliente.
                    Marque os itens que farão parte do escopo do projeto.
                  </p>
                </div>
                <button
                  onClick={salvarEstrutura}
                  disabled={salvandoEstrutura}
                  className="btn-secondary text-sm py-2 px-4 disabled:opacity-50"
                >
                  {salvandoEstrutura ? "Salvando..." : "Salvar rascunho"}
                </button>
              </div>

              {/* Contagem */}
              <p className="text-xs text-slate-400 mt-3 mb-4">
                {itensSelecionados.length} de {estrutura.length} itens selecionados
              </p>

              {/* Lista de itens */}
              <ul className="space-y-2" role="list" aria-label="Itens da estrutura">
                {estrutura.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      id={`item-${item.id}`}
                      checked={item.incluir}
                      onChange={() => toggleIncluir(item.id)}
                      className="w-4 h-4 rounded flex-shrink-0 cursor-pointer"
                      style={{ accentColor: "#c9a84c" }}
                      aria-label={`Incluir: ${item.label}`}
                    />
                    <label
                      htmlFor={`item-${item.id}`}
                      className="flex-1 text-sm text-slate-700 cursor-pointer select-none"
                      style={{ textDecoration: item.incluir ? "none" : "line-through", opacity: item.incluir ? 1 : 0.45 }}
                    >
                      {item.label}
                    </label>
                    <button
                      onClick={() => removerItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 focus:opacity-100"
                      aria-label={`Remover item: ${item.label}`}
                      title="Remover item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              {estrutura.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">
                  Nenhum item na estrutura. Adicione itens abaixo.
                </p>
              )}

              {/* Adicionar novo item */}
              <div className="flex gap-2 mt-4">
                <label htmlFor="novo-item" className="sr-only">
                  Novo módulo ou funcionalidade
                </label>
                <input
                  id="novo-item"
                  type="text"
                  value={novoItem}
                  onChange={(e) => setNovoItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionarItem();
                    }
                  }}
                  placeholder="Adicionar módulo ou funcionalidade..."
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 placeholder:text-slate-400"
                />
                <button
                  onClick={adicionarItem}
                  disabled={!novoItem.trim()}
                  className="btn-primary text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Adicionar item"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botão avançar */}
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={itensSelecionados.length === 0}
                className="btn-primary py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Revisar estrutura →
              </button>
            </div>
          </div>
        )}

        {/* ── Etapa 2 — Revisão e aprovação ── */}
        {!loading && step === 2 && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Etapa 2 — Revisão da Estrutura
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Confirme os itens abaixo para habilitar a geração do PRD. Após aprovar, a estrutura
                ficará salva e o editor de PRD será desbloqueado.
              </p>

              {/* Resumo dos itens selecionados */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  {itensSelecionados.length} itens aprovados para o escopo
                </p>
                <ul className="space-y-2" role="list">
                  {itensSelecionados.map((item) => (
                    <li key={item.id} className="flex items-start gap-2 text-sm text-slate-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item.label}
                    </li>
                  ))}
                </ul>

                {itensSelecionados.length === 0 && (
                  <p className="text-sm text-slate-400">
                    Nenhum item selecionado. Volte à etapa anterior e marque pelo menos um item.
                  </p>
                )}
              </div>

              {/* Itens excluídos (se houver) */}
              {estrutura.filter((i) => !i.incluir).length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    {estrutura.filter((i) => !i.incluir).length} itens fora do escopo
                  </p>
                  <ul className="space-y-1" role="list">
                    {estrutura
                      .filter((i) => !i.incluir)
                      .map((item) => (
                        <li
                          key={item.id}
                          className="text-sm text-slate-400 line-through pl-6"
                        >
                          {item.label}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Ações */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary text-sm py-2.5 px-5"
                >
                  ← Voltar e editar
                </button>
                <button
                  onClick={aprovarEstrutura}
                  disabled={salvandoEstrutura || itensSelecionados.length === 0}
                  className="btn-primary text-sm py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {salvandoEstrutura ? "Aprovando..." : "Aprovar estrutura e habilitar PRD"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Etapa 3 — Editor de PRD ── */}
        {!loading && step === 3 && (
          <div className="space-y-4">
            {/* Barra de ações */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    // Reabrir edição da estrutura: desaprovar no banco
                    const { error } = await supabase
                      .from("clientes")
                      .update({ estrutura_aprovada: false })
                      .eq("id", id);
                    if (!error) {
                      toast.success("Estrutura reaberta para edição.");
                      setStep(1);
                    } else {
                      toast.error("Erro ao reabrir estrutura.");
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
                >
                  Editar estrutura
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleGerarPRD}
                  disabled={!cliente || saving}
                  className="btn-secondary text-sm py-2 disabled:opacity-50"
                >
                  Gerar PRD
                </button>
                <button
                  onClick={() => save("rascunho")}
                  disabled={saving}
                  className="btn-secondary text-sm py-2 disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar rascunho"}
                </button>
                <button
                  onClick={() => save("aprovado")}
                  disabled={saving}
                  className="btn-primary text-sm py-2 disabled:opacity-50"
                >
                  {saving ? "Aprovando..." : "Aprovar PRD"}
                </button>
              </div>
            </div>

            {/* Dica quando o editor está vazio */}
            {!conteudo && cliente && (
              <div
                className="border rounded-xl p-4 text-sm"
                style={{
                  backgroundColor: "#fffbeb",
                  borderColor: "#fde68a",
                  color: "#92400e",
                }}
                role="note"
              >
                Clique em <strong>Gerar PRD</strong> para criar automaticamente um documento
                estruturado com os dados do briefing e os módulos aprovados de{" "}
                <strong>{nomeCliente}</strong>.
              </div>
            )}

            {/* Editor */}
            <div className="bg-white border border-slate-200 rounded-2xl p-1">
              <label htmlFor="prd-editor" className="sr-only">
                Conteúdo do PRD em Markdown
              </label>
              <textarea
                id="prd-editor"
                className="w-full h-[calc(100vh-320px)] p-5 text-base font-mono text-slate-800 resize-none focus:outline-none rounded-2xl"
                placeholder="Clique em Gerar PRD para criar automaticamente, ou escreva aqui em Markdown..."
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-400 text-center">
              Markdown suportado · O PRD gerado usa os dados do formulário e os módulos aprovados — revise antes de aprovar.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
