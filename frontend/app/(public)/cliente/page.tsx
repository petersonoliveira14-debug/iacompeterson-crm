"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BrandingSidebar } from "@/components/layout/BrandingSidebar";
import { ChoiceCard } from "@/components/form/ChoiceCard";
import { HintTooltip } from "@/components/form/HintTooltip";
import { ProgressBar } from "@/components/form/ProgressBar";
import { submitForm, type FormData } from "@/lib/api";
import toast from "react-hot-toast";

const STORAGE_KEY = "iap-form-draft";
const TOTAL_STEPS = 6;

// ─── Constantes ────────────────────────────────────────────────────────────────

const TIPO_OPTIONS = [
  { value: "sistema", emoji: "⚙️", label: "Sistema interno", description: "CRM, ERP, estoque, dashboard, pipeline comercial..." },
  { value: "atendimento", emoji: "🤖", label: "Atendimento automatizado", description: "Bot no WhatsApp, Instagram DM, chat no site..." },
  { value: "assistente", emoji: "🧠", label: "Assistente com IA", description: "Assistente com IA para uso interno ou com clientes" },
  { value: "site_lp", emoji: "🌐", label: "Site / Landing Page / Página de vendas", description: "Site institucional, LP de campanha, página de captação" },
  { value: "plataforma", emoji: "👥", label: "Plataforma de usuários", description: "Portal do cliente, app web, área de membros" },
];

const SEGMENTOS = [
  { emoji: "🏥", label: "Saúde" },
  { emoji: "🎓", label: "Educação" },
  { emoji: "🛍️", label: "Varejo" },
  { emoji: "🔧", label: "Serviços" },
  { emoji: "🏘️", label: "Imóveis" },
  { emoji: "🍽️", label: "Gastronomia" },
  { emoji: "⚖️", label: "Jurídico" },
  { emoji: "📊", label: "Outro" },
];

const PORTE_OPTIONS = [
  { emoji: "👤", label: "Só eu", value: "somente_eu" },
  { emoji: "👥", label: "2–5 pessoas", value: "2_5" },
  { emoji: "👨‍👩‍👦", label: "6–20 pessoas", value: "6_20" },
  { emoji: "🏢", label: "21–50 pessoas", value: "21_50" },
  { emoji: "🏭", label: "51+ pessoas", value: "51_mais" },
];

const FATURAMENTO_OPTIONS = [
  { emoji: "🌱", label: "Até R$20k/mês", value: "ate_20k" },
  { emoji: "📈", label: "R$20k – R$80k", value: "20k_80k" },
  { emoji: "🚀", label: "R$80k – R$250k", value: "80k_250k" },
  { emoji: "💎", label: "R$250k – R$1M", value: "250k_1m" },
  { emoji: "🏆", label: "Acima de R$1M", value: "acima_1m" },
];

const TEMPO_OPTIONS = [
  { emoji: "🌱", label: "Menos de 1 ano", value: "menos_1ano" },
  { emoji: "📅", label: "1–3 anos", value: "1_3anos" },
  { emoji: "🏗️", label: "3–10 anos", value: "3_10anos" },
  { emoji: "🏛️", label: "Mais de 10 anos", value: "mais_10anos" },
];

const GESTAO_OPTIONS = [
  { emoji: "📱", label: "WhatsApp informal", value: "whatsapp_informal" },
  { emoji: "📋", label: "Planilha Excel", value: "planilha" },
  { emoji: "💻", label: "Sistema próprio", value: "sistema_proprio" },
  { emoji: "🤷", label: "Ainda não gerencio", value: "nao_gerencio" },
];

const DORES_OPTIONS = [
  { emoji: "📉", label: "Perco clientes por falta de follow-up", value: "sem_followup" },
  { emoji: "📋", label: "Minha equipe não registra processos", value: "sem_registro" },
  { emoji: "⏰", label: "Atendimento lento está me fazendo perder vendas", value: "atendimento_lento" },
  { emoji: "🔍", label: "Não tenho visibilidade do meu funil comercial", value: "sem_visibilidade_funil" },
  { emoji: "🔁", label: "Muito tempo perdido em tarefas repetitivas", value: "tarefas_repetitivas" },
  { emoji: "📈", label: "Difícil crescer sem contratar mais pessoas", value: "escala_sem_contratar" },
  { emoji: "📊", label: "Não consigo rastrear resultados e métricas", value: "sem_metricas" },
  { emoji: "🗂️", label: "Processo de vendas totalmente desorganizado", value: "vendas_desorganizadas" },
];

const VOLUME_OPTIONS = [
  { emoji: "🌱", label: "Menos de 10/dia", value: "menos_10" },
  { emoji: "📈", label: "10 a 50/dia", value: "10_50" },
  { emoji: "🚀", label: "50 a 200/dia", value: "50_200" },
  { emoji: "⚡", label: "Mais de 200/dia", value: "mais_200" },
];

const BUDGET_OPTIONS = [
  { emoji: "💚", label: "Menos de R$5k/mês", value: "menos_5k" },
  { emoji: "💛", label: "R$5k – R$15k/mês", value: "5k_15k" },
  { emoji: "🧡", label: "R$15k – R$50k/mês", value: "15k_50k" },
  { emoji: "❤️", label: "Mais de R$50k/mês", value: "mais_50k" },
];

const PRAZO_OPTIONS = [
  { emoji: "🔥", label: "Urgente (< 30 dias)", value: "urgente" },
  { emoji: "📅", label: "1 a 2 meses", value: "1_2_meses" },
  { emoji: "🗓️", label: "3+ meses", value: "3_meses" },
  { emoji: "😌", label: "Sem pressa", value: "sem_pressa" },
];

const INVESTIMENTO_OPTIONS = [
  { emoji: "💚", label: "Até R$ 2.000", value: "ate_2k" },
  { emoji: "💛", label: "R$ 2k – R$ 5k", value: "2k_5k" },
  { emoji: "🧡", label: "R$ 5k – R$ 15k", value: "5k_15k" },
  { emoji: "❤️", label: "Acima de R$ 15k", value: "acima_15k" },
];

const CANAL_OPTIONS = [
  { emoji: "🗣️", label: "Indicação de clientes", value: "indicacao" },
  { emoji: "🔍", label: "Google / SEO / Blog", value: "google_seo" },
  { emoji: "📱", label: "Instagram / TikTok / Redes sociais", value: "social_media" },
  { emoji: "💼", label: "LinkedIn / Outreach", value: "linkedin" },
  { emoji: "🏢", label: "Portais e marketplaces", value: "portais" },
  { emoji: "✉️", label: "Prospecção ativa (cold)", value: "cold_outreach" },
];

const TECH_OPTIONS = [
  { emoji: "🙋", label: "Leigo", description: "Preciso que tudo seja simples e com suporte", value: "leigo" },
  { emoji: "🧑‍💻", label: "Intermediário", description: "Uso ferramentas, mas não programo", value: "intermediario" },
  { emoji: "⚙️", label: "Avançado", description: "Tenho equipe técnica própria", value: "avancado" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

// ─── Componente principal ──────────────────────────────────────────────────────

export default function ClienteFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]);

  // Step 2
  const [nomeContato, setNomeContato] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [segmento, setSegmento] = useState<string | null>(null);
  const [segmentoOutro, setSegmentoOutro] = useState("");
  const [docTipo, setDocTipo] = useState<"cnpj" | "cpf">("cnpj");
  const [cnpj, setCnpj] = useState("");
  const [cpf, setCpf] = useState("");
  const [porte, setPorte] = useState<string | null>(null);
  const [faturamento, setFaturamento] = useState<string | null>(null);
  const [tempoEmpresa, setTempoEmpresa] = useState<string | null>(null);

  // Step 3
  const [gestaoHoje, setGestaoHoje] = useState<string | null>(null);
  const [doresB2b, setDoresB2b] = useState<string[]>([]);
  const [dorOutra, setDorOutra] = useState("");
  const [volume, setVolume] = useState<string | null>(null);

  // Step 4
  const [budgetMensal, setBudgetMensal] = useState<string | null>(null);
  const [resultadoEsperado, setResultadoEsperado] = useState("");
  const [prazo, setPrazo] = useState<string | null>(null);
  const [investimento, setInvestimento] = useState<string | null>(null);

  // Step 5
  const [diferencial, setDiferencial] = useState("");
  const [icp, setIcp] = useState("");
  const [canalAquisicao, setCanalAquisicao] = useState<string | null>(null);
  const [experienciaTech, setExperienciaTech] = useState<string | null>(null);
  const [restricoes, setRestricoes] = useState("");

  // ── Draft restore ────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.nomeContato) setNomeContato(d.nomeContato);
        if (d.nomeEmpresa) setNomeEmpresa(d.nomeEmpresa);
        if (d.whatsapp) setWhatsapp(d.whatsapp);
        if (d.segmento) setSegmento(d.segmento);
        // Não restauramos tiposSelecionados para evitar blank screen no step 1
      } catch {}
    }
  }, []);

  const saveDraft = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      nomeContato, nomeEmpresa, whatsapp, segmento,
    }));
  }, [nomeContato, nomeEmpresa, whatsapp, segmento]);

  useEffect(() => { saveDraft(); }, [saveDraft]);

  // ── Helpers de toggle ────────────────────────────────────────────────────────
  const toggleTipo = (value: string) => {
    setTiposSelecionados(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    );
  };

  const toggleDor = (value: string) => {
    setDoresB2b(prev =>
      prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]
    );
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!nomeContato || !whatsapp) {
      toast.error("Preencha nome e WhatsApp antes de enviar.");
      return;
    }
    setLoading(true);
    try {
      const segmentoFinal = segmento === "Outro" && segmentoOutro
        ? `Outro: ${segmentoOutro}`
        : segmento || "Não informado";

      const payload: FormData = {
        nome_contato: nomeContato,
        nome_empresa: nomeEmpresa || undefined,
        whatsapp,
        segmento: segmentoFinal,
        tipo_solucao: tiposSelecionados.join(", ") || "Não informado",
        tipos_solucao: tiposSelecionados.length > 0 ? tiposSelecionados : undefined,
        segmento_outro: segmentoOutro || undefined,
        cnpj: docTipo === "cnpj" && cnpj ? cnpj : undefined,
        cpf: docTipo === "cpf" && cpf ? cpf : undefined,
        porte_empresa: porte || undefined,
        faturamento_mensal: faturamento || undefined,
        tempo_empresa: tempoEmpresa || undefined,
        como_gerencia_hoje: gestaoHoje || undefined,
        dores_b2b: doresB2b.length > 0 ? doresB2b : undefined,
        dor_outra: dorOutra || undefined,
        volume_atendimentos: volume || undefined,
        budget_mensal: budgetMensal || undefined,
        resultado_esperado: resultadoEsperado || undefined,
        prazo_desejado: prazo || undefined,
        faixa_investimento: investimento || undefined,
        diferencial: diferencial || undefined,
        icp: icp || undefined,
        canal_aquisicao: canalAquisicao || undefined,
        experiencia_tech: experienciaTech || undefined,
        restricoes: restricoes || undefined,
      };
      await submitForm(payload);
      localStorage.removeItem(STORAGE_KEY);
      setStep(TOTAL_STEPS);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao enviar. Tente novamente.", { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">
      <BrandingSidebar />

      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-white max-w-[560px] lg:max-w-none mx-auto w-full">
        <div className="w-full max-w-[448px] mx-auto">

          {/* ── Step 0: Splash ── */}
          {step === 0 && (
            <div className="step-content text-center">
              <div className="w-20 h-20 rounded-3xl bg-gold-100 flex items-center justify-center text-4xl mx-auto mb-6">
                🤖
              </div>
              <h1 className="text-4xl text-slate-900 mb-3">
                Vamos entender o seu negócio
              </h1>
              <p className="text-slate-500 mb-8 leading-relaxed text-lg">
                Responda algumas perguntas rápidas para que eu possa preparar uma proposta personalizada para você.
                <br />
                <span className="text-gold-600 font-medium">São só 5 minutos.</span>
              </p>
              <button
                onClick={() => { setTiposSelecionados([]); setStep(1); }}
                className="btn-primary w-full text-base py-4"
              >
                Começar →
              </button>
              <p className="text-sm text-slate-400 mt-4">Suas informações são confidenciais e seguras.</p>
            </div>
          )}

          {/* ── Step 1: O que você precisa? (multi-select) ── */}
          {step === 1 && (
            <div className="step-content">
              <ProgressBar current={1} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2 flex items-center gap-2">
                <h2 className="text-3xl text-slate-900">O que você precisa?</h2>
                <HintTooltip text="Pode marcar mais de uma opção! Selecione tudo que se encaixa na sua operação." />
              </div>
              <p className="text-slate-500 text-base mb-6">Selecione uma ou mais opções:</p>
              <div className="space-y-3">
                {TIPO_OPTIONS.map((opt) => (
                  <ChoiceCard
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    description={opt.description}
                    selected={tiposSelecionados.includes(opt.value)}
                    onClick={() => toggleTipo(opt.value)}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={tiposSelecionados.length === 0}
                className="btn-primary w-full mt-6 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar →
              </button>
              {tiposSelecionados.length > 0 && (
                <p className="text-center text-xs text-slate-400 mt-2">
                  {tiposSelecionados.length} opção{tiposSelecionados.length > 1 ? "ões" : ""} selecionada{tiposSelecionados.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          {/* ── Step 2: Sobre você ── */}
          {step === 2 && (
            <div className="step-content">
              <ProgressBar current={2} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2 flex items-center gap-2">
                <h2 className="text-3xl text-slate-900">Sobre você</h2>
                <HintTooltip text="Informações confidenciais, usadas apenas para personalizar sua proposta." />
              </div>
              <p className="text-slate-500 text-base mb-6">Vamos nos conhecer!</p>

              <div className="space-y-4">
                {/* Nome + WhatsApp */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-1.5">Seu nome completo *</label>
                  <input className="input-field" placeholder="Ex: João Silva" value={nomeContato} onChange={(e) => setNomeContato(e.target.value)} />
                </div>
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-1.5">Nome da empresa</label>
                  <input className="input-field" placeholder="Ex: Clínica Saúde & Vida" value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} />
                </div>
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-1.5">WhatsApp *</label>
                  <input className="input-field" placeholder="(11) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                </div>

                {/* Segmento */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Segmento de atuação *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SEGMENTOS.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setSegmento(s.label)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-base font-medium transition-all duration-200 ${
                          segmento === s.label
                            ? "border-gold-500 bg-gold-50 text-navy-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                  {segmento === "Outro" && (
                    <input
                      className="input-field mt-2"
                      placeholder="Qual é o seu segmento?"
                      value={segmentoOutro}
                      onChange={(e) => setSegmentoOutro(e.target.value)}
                      autoFocus
                    />
                  )}
                </div>

                {/* CNPJ / CPF */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-base font-medium text-slate-700">CNPJ / CPF</label>
                    <span className="text-xs text-slate-400">Opcional</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setDocTipo("cnpj")}
                      className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        docTipo === "cnpj"
                          ? "border-gold-500 bg-gold-50 text-navy-800"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      CNPJ
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocTipo("cpf")}
                      className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        docTipo === "cpf"
                          ? "border-gold-500 bg-gold-50 text-navy-800"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      CPF (Não tenho CNPJ)
                    </button>
                  </div>
                  {docTipo === "cnpj" ? (
                    <input
                      className="input-field"
                      placeholder="00.000.000/0000-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                    />
                  ) : (
                    <input
                      className="input-field"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(formatCpf(e.target.value))}
                    />
                  )}
                </div>

                {/* Porte */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Quantos colaboradores na empresa?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PORTE_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setPorte(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          porte === o.value
                            ? "border-gold-500 bg-gold-50 text-navy-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{o.emoji}</span>
                        <span>{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Faturamento */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Faturamento mensal aproximado</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FATURAMENTO_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setFaturamento(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          faturamento === o.value
                            ? "border-gold-500 bg-gold-50 text-navy-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{o.emoji}</span>
                        <span>{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tempo */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Há quanto tempo a empresa existe?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPO_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setTempoEmpresa(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          tempoEmpresa === o.value
                            ? "border-gold-500 bg-gold-50 text-navy-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{o.emoji}</span>
                        <span>{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={handleBack} className="btn-secondary flex-1">← Voltar</button>
                <button
                  onClick={handleNext}
                  disabled={!nomeContato || !whatsapp || !segmento}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Como é hoje? ── */}
          {step === 3 && (
            <div className="step-content">
              <ProgressBar current={3} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2">
                <h2 className="text-3xl text-slate-900">Como é hoje?</h2>
              </div>
              <p className="text-slate-500 text-base mb-6">Me conta sobre a situação atual da sua operação.</p>

              <div className="space-y-6">
                {/* Gestão */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Como gerencia clientes/pedidos hoje?</label>
                  <div className="space-y-2">
                    {GESTAO_OPTIONS.map((o) => (
                      <ChoiceCard key={o.value} emoji={o.emoji} label={o.label} selected={gestaoHoje === o.value} onClick={() => setGestaoHoje(o.value)} />
                    ))}
                  </div>
                </div>

                {/* Dores B2B */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-base font-medium text-slate-700">Quais são suas maiores dores hoje?</label>
                    <HintTooltip text="Marque quantas quiser. Quanto mais você marcar, mais precisa ficará a proposta." />
                  </div>
                  <div className="space-y-2">
                    {DORES_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => toggleDor(o.value)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                          doresB2b.includes(o.value)
                            ? "border-gold-500 bg-gold-50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-lg mt-0.5 flex-shrink-0">{o.emoji}</span>
                        <span className={`text-sm font-medium leading-snug ${doresB2b.includes(o.value) ? "text-navy-800" : "text-slate-700"}`}>
                          {o.label}
                        </span>
                        <span className={`ml-auto flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-all ${
                          doresB2b.includes(o.value)
                            ? "border-gold-500 bg-gold-500 text-white"
                            : "border-slate-300"
                        }`}>
                          {doresB2b.includes(o.value) ? "✓" : ""}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Outra dor? <span className="font-normal text-slate-400">(opcional)</span></label>
                    <textarea
                      className="input-field h-20 resize-none pt-2 text-sm"
                      placeholder="Descreva outro problema específico do seu negócio..."
                      value={dorOutra}
                      onChange={(e) => setDorOutra(e.target.value)}
                    />
                  </div>
                </div>

                {/* Volume */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Volume médio de atendimentos por dia:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {VOLUME_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setVolume(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          volume === o.value
                            ? "border-gold-500 bg-gold-50 text-navy-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{o.emoji}</span>
                        <span>{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={handleBack} className="btn-secondary flex-1">← Voltar</button>
                <button onClick={handleNext} className="btn-primary flex-1">Continuar →</button>
              </div>
            </div>
          )}

          {/* ── Step 4: O que você espera? ── */}
          {step === 4 && (
            <div className="step-content">
              <ProgressBar current={4} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2">
                <h2 className="text-3xl text-slate-900">O que você espera?</h2>
              </div>
              <p className="text-slate-500 text-base mb-6">Vamos alinhar expectativas.</p>

              <div className="space-y-6">
                {/* Budget mensal */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-base font-medium text-slate-700">Quanto você gasta por mês com a equipe/processos que quer automatizar?</label>
                    <HintTooltip text="Isso nos ajuda a montar o business case: mostrar que a automação pode custar menos do que uma contratação." />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGET_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setBudgetMensal(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          budgetMensal === o.value
                            ? "border-gold-500 bg-gold-50 text-navy-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{o.emoji}</span>
                        <span>{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resultado esperado */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <label className="text-base font-medium text-slate-700">Qual resultado concreto você quer em 3 meses?</label>
                    <HintTooltip text="Seja específico! Ex: 'reduzir 50% do tempo no atendimento manual' ou 'qualificar leads automaticamente'" />
                  </div>
                  <textarea
                    className="input-field h-24 resize-none pt-3"
                    placeholder="Descreva o resultado que transformaria sua operação..."
                    value={resultadoEsperado}
                    onChange={(e) => setResultadoEsperado(e.target.value)}
                  />
                </div>

                {/* Prazo */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Em quanto tempo precisa disso funcionando?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRAZO_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setPrazo(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          prazo === o.value
                            ? "border-gold-500 bg-gold-50 text-navy-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{o.emoji}</span>
                        <span>{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investimento */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-base font-medium text-slate-700">Faixa de investimento no projeto:</label>
                    <HintTooltip text="Sem julgamento — isso ajuda a calibrar a solução ideal para a sua realidade." />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {INVESTIMENTO_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setInvestimento(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          investimento === o.value
                            ? "border-gold-500 bg-gold-50 text-navy-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{o.emoji}</span>
                        <span>{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={handleBack} className="btn-secondary flex-1">← Voltar</button>
                <button onClick={handleNext} className="btn-primary flex-1">Continuar →</button>
              </div>
            </div>
          )}

          {/* ── Step 5: Sobre o seu negócio ── */}
          {step === 5 && (
            <div className="step-content">
              <ProgressBar current={5} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2 flex items-center gap-2">
                <h2 className="text-3xl text-slate-900">Sobre o seu negócio</h2>
                <HintTooltip text="Essas respostas fazem a proposta parecer que foi feita exatamente para você. Vale o esforço!" />
              </div>
              <p className="text-slate-500 text-base mb-6">Últimas perguntas — prometo.</p>

              <div className="space-y-5">
                {/* Diferencial */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-1.5">
                    Qual é o maior diferencial da sua empresa? <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <textarea
                    className="input-field h-16 resize-none pt-2 text-sm"
                    placeholder='Ex: "Somos os únicos que entregam em 2h na região" ou "15 anos de experiência em saúde"'
                    value={diferencial}
                    onChange={(e) => setDiferencial(e.target.value)}
                  />
                </div>

                {/* ICP */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-1.5">
                    Descreva seu cliente ideal (ICP) <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <textarea
                    className="input-field h-16 resize-none pt-2 text-sm"
                    placeholder='Ex: "Dentistas do interior de SP com consultório próprio" ou "PMEs do setor de serviços com 5-20 funcionários"'
                    value={icp}
                    onChange={(e) => setIcp(e.target.value)}
                  />
                </div>

                {/* Canal de aquisição */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">
                    Como a maioria dos seus clientes chegam até você?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CANAL_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setCanalAquisicao(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 ${
                          canalAquisicao === o.value
                            ? "border-gold-500 bg-gold-50 text-navy-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="flex-shrink-0">{o.emoji}</span>
                        <span className="leading-tight">{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experiência tech */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">
                    Como você se relaciona com tecnologia?
                  </label>
                  <div className="space-y-2">
                    {TECH_OPTIONS.map((o) => (
                      <ChoiceCard
                        key={o.value}
                        emoji={o.emoji}
                        label={o.label}
                        description={o.description}
                        selected={experienciaTech === o.value}
                        onClick={() => setExperienciaTech(o.value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Restrições */}
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-1.5">
                    Restrições ou integrações obrigatórias? <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <textarea
                    className="input-field h-20 resize-none pt-2 text-sm"
                    placeholder='Ex: "Usamos SAP", "Só pode integrar com Google Sheets", "Dados não podem ficar na nuvem"'
                    value={restricoes}
                    onChange={(e) => setRestricoes(e.target.value)}
                  />
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mt-6">
                <p className="text-base text-navy-800 font-medium mb-2">📋 Resumo do seu briefing:</p>
                <ul className="text-sm text-slate-700 space-y-1.5">
                  <li>• <strong>Soluções:</strong> {tiposSelecionados.length > 0 ? tiposSelecionados.map(t => TIPO_OPTIONS.find(o => o.value === t)?.label).join(", ") : "—"}</li>
                  <li>• <strong>Empresa:</strong> {nomeEmpresa || nomeContato} — {segmento}</li>
                  <li>• <strong>Porte:</strong> {PORTE_OPTIONS.find(o => o.value === porte)?.label || "—"}</li>
                  <li>• <strong>Investimento:</strong> {INVESTIMENTO_OPTIONS.find(o => o.value === investimento)?.label || "—"}</li>
                  <li>• <strong>Prazo:</strong> {PRAZO_OPTIONS.find(o => o.value === prazo)?.label || "—"}</li>
                  <li>• <strong>Dores:</strong> {doresB2b.length > 0 ? `${doresB2b.length} selecionada${doresB2b.length > 1 ? "s" : ""}` : "—"}</li>
                </ul>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="btn-secondary flex-1">← Voltar</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-70"
                >
                  {loading ? "Enviando..." : "Enviar briefing 🚀"}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Ao enviar, você concorda que usaremos seus dados para preparar a proposta.
              </p>
            </div>
          )}

          {/* ── Step 6: Sucesso ── */}
          {step === TOTAL_STEPS && (
            <div className="step-content text-center">
              <SuccessScreen whatsapp={whatsapp} nome={nomeContato} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Tela de sucesso ───────────────────────────────────────────────────────────

function SuccessScreen({ whatsapp, nome }: { whatsapp: string; nome: string }) {
  useEffect(() => {
    import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#c9a84c", "#0f2044", "#d4a83e", "#163566"],
      });
    });
  }, []);

  return (
    <div className="step-content">
      <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center text-4xl mx-auto mb-6">
        🎉
      </div>
      <h2 className="text-4xl text-slate-900 mb-3">Briefing recebido!</h2>
      <p className="text-slate-500 mb-6 leading-relaxed text-lg">
        Obrigado, <strong>{nome.split(" ")[0]}</strong>! Vou analisar tudo com cuidado e preparar uma proposta personalizada para você.
      </p>
      <div className="bg-gold-50 border border-gold-200 rounded-xl p-5 text-left">
        <p className="text-base font-semibold text-navy-800 mb-2">📱 Próximos passos:</p>
        <ol className="text-base text-slate-700 space-y-2">
          <li>1. Analyso seu briefing nas próximas horas</li>
          <li>2. Em até <strong>48h</strong>, Peterson entra em contato</li>
          <li>3. Apresentamos o pré-projeto em uma reunião</li>
        </ol>
      </div>
      <p className="text-base text-slate-500 mt-6">
        Fique de olho no WhatsApp: <strong>{whatsapp}</strong>
      </p>
    </div>
  );
}
