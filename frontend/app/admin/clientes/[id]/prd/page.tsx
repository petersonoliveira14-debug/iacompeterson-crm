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

// ─── Gerador de PRD ───────────────────────────────────────────────────────────

const PRAZO_DURACAO: Record<string, number> = {
  urgente: 21,
  "1_2_meses": 35,
  "3_meses": 55,
  sem_pressa: 60,
};

function gerarPRD(c: any): string {
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
- [ ] Levantamento detalhado de requisitos e fluxos
- [ ] Definição de integrações necessárias
- [ ] Arquitetura e stack tecnológica
- [ ] Desenvolvimento, testes e homologação
- [ ] Treinamento da equipe e go-live
- [ ] Suporte pós-entrega

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
| 🚀 Fase 1 | Kickoff, alinhamento e refinamento de escopo | Dias 1–${f1End} |
| 🎨 Fase 2 | Prototipagem, wireframes e aprovação visual | Dias ${f1End + 1}–${f2End} |
| ⚙️ Fase 3 | Desenvolvimento e integrações | Dias ${f2End + 1}–${f3End} |
| 🧪 Fase 4 | Testes, ajustes e homologação | Dias ${f3End + 1}–${f4End} |
| 🎓 Fase 5 | Entrega, deploy e treinamento da equipe | Dias ${f4End + 1}–${f5End} |
| 🛡️ Pós-entrega | Suporte e monitoramento | 30 dias após entrega |

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

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PRDPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [conteudo, setConteudo] = useState("");
  const [versao, setVersao] = useState(1);
  const [docId, setDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) { router.push("/admin/login"); return; }

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
      if (clienteRes.data) setCliente(clienteRes.data);
      if (docRes.data && docRes.data.length > 0) {
        setConteudo(docRes.data[0].conteudo);
        setVersao(docRes.data[0].versao);
        setDocId(docRes.data[0].id);
      }
    });
  }, [id, router]);

  const handleGerarPRD = () => {
    if (!cliente) return;
    if (conteudo && !window.confirm("Já existe conteúdo no editor. Deseja substituir pelo PRD gerado?")) return;
    setConteudo(gerarPRD(cliente));
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Link href="/admin/clientes" className="hover:text-slate-600">Clientes</Link>
          <span>›</span>
          <Link href={`/admin/clientes/${id}`} className="hover:text-slate-600">
            {cliente?.nome_empresa || cliente?.nome_contato || "Cliente"}
          </Link>
          <span>›</span>
          <span className="text-slate-700">PRD v{versao}</span>
        </div>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-2xl text-slate-900">Editor de PRD</h1>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleGerarPRD}
              disabled={!cliente || saving}
              className="btn-secondary text-sm py-2"
            >
              ✨ Gerar PRD
            </button>
            <button onClick={() => save("rascunho")} disabled={saving} className="btn-secondary text-sm py-2">
              Salvar rascunho
            </button>
            <button onClick={() => save("aprovado")} disabled={saving} className="btn-primary text-sm py-2">
              ✅ Aprovar PRD
            </button>
          </div>
        </div>

        {!conteudo && cliente && (
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-4 text-sm text-navy-800">
            💡 Clique em <strong>✨ Gerar PRD</strong> para criar automaticamente um documento estruturado com os dados do briefing de <strong>{cliente.nome_empresa || cliente.nome_contato}</strong>.
          </div>
        )}

        <div className="card p-1">
          <textarea
            className="w-full h-[calc(100vh-300px)] p-5 text-base font-mono text-slate-800 resize-none focus:outline-none rounded-2xl"
            placeholder="Clique em ✨ Gerar PRD para criar automaticamente, ou escreva aqui em Markdown..."
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Markdown suportado · O PRD gerado usa os dados do formulário — revise antes de aprovar.
        </p>
      </main>
    </div>
  );
}
