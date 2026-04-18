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

type TipoSolucao = "sistema" | "atendimento" | "assistente" | "multiplo" | null;

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

const GESTAO_OPTIONS = [
  { emoji: "📱", label: "WhatsApp informal", value: "whatsapp_informal" },
  { emoji: "📋", label: "Planilha Excel", value: "planilha" },
  { emoji: "💻", label: "Sistema próprio", value: "sistema_proprio" },
  { emoji: "🤷", label: "Ainda não gerencio", value: "nao_gerencio" },
];

const VOLUME_OPTIONS = [
  { emoji: "🌱", label: "Menos de 10/dia", value: "menos_10" },
  { emoji: "📈", label: "10 a 50/dia", value: "10_50" },
  { emoji: "🚀", label: "50 a 200/dia", value: "50_200" },
  { emoji: "⚡", label: "Mais de 200/dia", value: "mais_200" },
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

export default function ClienteFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [tipoSolucao, setTipoSolucao] = useState<TipoSolucao>(null);
  const [subtipo, setSubtipo] = useState<string | null>(null);
  const [segmento, setSegmento] = useState<string | null>(null);
  const [gestaoHoje, setGestaoHoje] = useState<string | null>(null);
  const [volume, setVolume] = useState<string | null>(null);
  const [prazo, setPrazo] = useState<string | null>(null);
  const [investimento, setInvestimento] = useState<string | null>(null);

  const [nomeContato, setNomeContato] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [maiorDor, setMaiorDor] = useState("");
  const [resultadoEsperado, setResultadoEsperado] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Restore draft
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.nomeContato) setNomeContato(d.nomeContato);
        if (d.nomeEmpresa) setNomeEmpresa(d.nomeEmpresa);
        if (d.whatsapp) setWhatsapp(d.whatsapp);
        if (d.tipoSolucao) setTipoSolucao(d.tipoSolucao);
        if (d.subtipo) setSubtipo(d.subtipo);
        if (d.segmento) setSegmento(d.segmento);
      } catch {}
    }
  }, []);

  // Save draft
  const saveDraft = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      nomeContato, nomeEmpresa, whatsapp, tipoSolucao, subtipo, segmento,
    }));
  }, [nomeContato, nomeEmpresa, whatsapp, tipoSolucao, subtipo, segmento]);

  useEffect(() => { saveDraft(); }, [saveDraft]);

  const handleTipoSelect = (tipo: TipoSolucao) => {
    setTipoSolucao(tipo);
    if (tipo === "multiplo") {
      setTimeout(() => setStep(2), 400);
    } else {
      setTimeout(() => setStep(1), 400);
    }
  };

  const handleSubtipoSelect = (value: string) => {
    setSubtipo(value);
    setTimeout(() => setStep(2), 400);
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!nomeContato || !whatsapp) {
      toast.error("Preencha nome e WhatsApp antes de enviar.");
      return;
    }
    setLoading(true);
    try {
      const payload: FormData = {
        nome_contato: nomeContato,
        nome_empresa: nomeEmpresa || undefined,
        whatsapp,
        segmento: segmento || "Não informado",
        tipo_solucao: tipoSolucao || "multiplo",
        subtipo: subtipo || undefined,
        como_gerencia_hoje: gestaoHoje || undefined,
        maior_dor: maiorDor || undefined,
        volume_atendimentos: volume || undefined,
        resultado_esperado: resultadoEsperado || undefined,
        prazo_desejado: prazo || undefined,
        faixa_investimento: investimento || undefined,
        observacoes: observacoes || undefined,
      };
      await submitForm(payload);
      localStorage.removeItem(STORAGE_KEY);
      setStep(TOTAL_STEPS);
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const currentProgress = step === 0 ? 0 : step;

  return (
    <div className="flex min-h-screen">
      <BrandingSidebar />

      {/* Form area */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-white max-w-[560px] lg:max-w-none mx-auto w-full">
        <div className="w-full max-w-[448px] mx-auto">

          {/* Step 0: Splash */}
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
              <button onClick={() => setStep(1)} className="btn-primary w-full text-base py-4">
                Começar →
              </button>
              <p className="text-sm text-slate-400 mt-4">Suas informações são confidenciais e seguras.</p>
            </div>
          )}

          {/* Step 1: Tipo de solução */}
          {step === 1 && !tipoSolucao && (
            <div className="step-content">
              <ProgressBar current={1} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2 flex items-center gap-2">
                <h2 className="text-3xl text-slate-900">O que você precisa?</h2>
                <HintTooltip text="Não precisa ter certeza! Escolha o que mais se aproxima. Vamos te ajudar a descobrir a solução ideal." />
              </div>
              <p className="text-slate-500 text-base mb-6">Escolha o que melhor descreve o que você busca:</p>
              <div className="space-y-3">
                <ChoiceCard emoji="⚙️" label="#sistema" description="CRM, ERP, Estoque, Dashboard, Pipeline comercial..." selected={false} onClick={() => handleTipoSelect("sistema")} />
                <ChoiceCard emoji="🤖" label="#atendimento automatizado" description="Bot no WhatsApp, Instagram DM, chat no site..." selected={false} onClick={() => handleTipoSelect("atendimento")} />
                <ChoiceCard emoji="🧠" label="#assistente pessoal" description="Assistente com IA para uso interno ou com clientes" selected={false} onClick={() => handleTipoSelect("assistente")} />
                <ChoiceCard emoji="🔀" label="#preciso de tudo isso" description="Minha operação precisa de mais de uma solução" selected={false} onClick={() => handleTipoSelect("multiplo")} />
              </div>
            </div>
          )}

          {/* Step 1b: Sub-tipo sistema */}
          {step === 1 && tipoSolucao === "sistema" && !subtipo && (
            <div className="step-content">
              <ProgressBar current={1} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2 flex items-center gap-2">
                <h2 className="text-3xl text-slate-900">Qual sistema você precisa?</h2>
              </div>
              <p className="text-slate-500 text-base mb-6">Selecione o tipo de sistema:</p>
              <div className="space-y-3">
                <ChoiceCard emoji="📊" label="CRM" description="Gestão de clientes, leads e funil de vendas" selected={false} onClick={() => handleSubtipoSelect("crm")} />
                <ChoiceCard emoji="🏭" label="ERP" description="Financeiro + estoque + pedidos integrados" selected={false} onClick={() => handleSubtipoSelect("erp")} />
                <ChoiceCard emoji="📦" label="Estoque" description="Controle de produtos, entradas e saídas" selected={false} onClick={() => handleSubtipoSelect("estoque")} />
                <ChoiceCard emoji="📈" label="Pipeline comercial" description="Funil de vendas visual tipo Kanban" selected={false} onClick={() => handleSubtipoSelect("pipeline")} />
                <ChoiceCard emoji="🗂️" label="Outro / Não sei" description="Me ajude a descobrir o melhor para mim" selected={false} onClick={() => handleSubtipoSelect("outro")} />
              </div>
              <button onClick={() => { setTipoSolucao(null); }} className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline">
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 1b: Sub-tipo atendimento */}
          {step === 1 && tipoSolucao === "atendimento" && !subtipo && (
            <div className="step-content">
              <ProgressBar current={1} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2 flex items-center gap-2">
                <h2 className="text-3xl text-slate-900">Em qual canal?</h2>
                <HintTooltip text="É possível integrar todos os canais em um bot centralizado. Escolha o principal agora." />
              </div>
              <p className="text-slate-500 text-base mb-6">Onde você quer automatizar o atendimento?</p>
              <div className="space-y-3">
                <ChoiceCard emoji="💬" label="WhatsApp" description="Bot direto no WhatsApp da empresa" selected={false} onClick={() => handleSubtipoSelect("whatsapp")} />
                <ChoiceCard emoji="📸" label="Instagram DM" description="Atendimento automático no Direct" selected={false} onClick={() => handleSubtipoSelect("instagram")} />
                <ChoiceCard emoji="🌐" label="Chat no site" description="Widget de chat integrado ao seu site" selected={false} onClick={() => handleSubtipoSelect("site")} />
                <ChoiceCard emoji="🔀" label="Todos os canais" description="WhatsApp + Instagram + Site integrados" selected={false} onClick={() => handleSubtipoSelect("todos_canais")} />
              </div>
              <button onClick={() => { setTipoSolucao(null); }} className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline">
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 1b: Sub-tipo assistente */}
          {step === 1 && tipoSolucao === "assistente" && !subtipo && (
            <div className="step-content">
              <ProgressBar current={1} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2">
                <h2 className="text-3xl text-slate-900">Para que usaria o assistente?</h2>
              </div>
              <p className="text-slate-500 text-base mb-6">Escolha o principal uso:</p>
              <div className="space-y-3">
                <ChoiceCard emoji="📅" label="Agenda e tarefas" description="Organizar meu dia e compromissos" selected={false} onClick={() => handleSubtipoSelect("agenda")} />
                <ChoiceCard emoji="📊" label="Análise de dados" description="Interpretar relatórios e métricas" selected={false} onClick={() => handleSubtipoSelect("analise")} />
                <ChoiceCard emoji="✍️" label="Criação de conteúdo" description="Posts, textos, propostas, e-mails" selected={false} onClick={() => handleSubtipoSelect("conteudo")} />
                <ChoiceCard emoji="🎯" label="Tudo isso" description="Preciso de um assistente completo" selected={false} onClick={() => handleSubtipoSelect("completo")} />
              </div>
              <button onClick={() => { setTipoSolucao(null); }} className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline">
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 2: Sobre você */}
          {step === 2 && (
            <div className="step-content">
              <ProgressBar current={2} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2 flex items-center gap-2">
                <h2 className="text-3xl text-slate-900">Sobre você</h2>
                <HintTooltip text="Informações confidenciais, usadas apenas para personalizar sua proposta." />
              </div>
              <p className="text-slate-500 text-base mb-6">Vamos nos conhecer!</p>

              <div className="space-y-4">
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

          {/* Step 3: Como é hoje */}
          {step === 3 && (
            <div className="step-content">
              <ProgressBar current={3} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2">
                <h2 className="text-3xl text-slate-900">Como é hoje?</h2>
              </div>
              <p className="text-slate-500 text-base mb-6">Me conta sobre a situação atual da sua operação.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Como gerencia clientes/pedidos hoje?</label>
                  <div className="space-y-2">
                    {GESTAO_OPTIONS.map((o) => (
                      <ChoiceCard key={o.value} emoji={o.emoji} label={o.label} selected={gestaoHoje === o.value} onClick={() => setGestaoHoje(o.value)} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <label className="text-base font-medium text-slate-700">Qual é sua maior dor operacional hoje?</label>
                    <HintTooltip text="Ex: 'Perco clientes por falta de follow-up' ou 'Minha equipe não registra nada no sistema'" />
                  </div>
                  <textarea
                    className="input-field h-24 resize-none pt-3"
                    placeholder="Descreva o problema que mais te impede de crescer..."
                    value={maiorDor}
                    onChange={(e) => setMaiorDor(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Volume médio de atendimentos por dia:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {VOLUME_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setVolume(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-base font-medium transition-all duration-200 ${
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

          {/* Step 4: O que espera */}
          {step === 4 && (
            <div className="step-content">
              <ProgressBar current={4} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2">
                <h2 className="text-3xl text-slate-900">O que você espera?</h2>
              </div>
              <p className="text-slate-500 text-base mb-6">Vamos alinhar expectativas.</p>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <label className="text-base font-medium text-slate-700">Qual resultado concreto você quer em 3 meses?</label>
                    <HintTooltip text="Seja específico! Ex: 'quero reduzir 50% do tempo no atendimento manual' ou 'quero um bot que qualifique meus leads automaticamente'" />
                  </div>
                  <textarea
                    className="input-field h-24 resize-none pt-3"
                    placeholder="Descreva o resultado que transformaria sua operação..."
                    value={resultadoEsperado}
                    onChange={(e) => setResultadoEsperado(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Em quanto tempo precisa disso funcionando?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRAZO_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setPrazo(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-base font-medium transition-all duration-200 ${
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

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-base font-medium text-slate-700">Faixa de investimento:</label>
                    <HintTooltip text="Sem julgamento — isso ajuda a calibrar a solução ideal para a sua realidade." />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {INVESTIMENTO_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setInvestimento(o.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-base font-medium transition-all duration-200 ${
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

          {/* Step 5: Finalização */}
          {step === 5 && (
            <div className="step-content">
              <ProgressBar current={5} total={TOTAL_STEPS} />
              <div className="mt-6 mb-2 flex items-center gap-2">
                <h2 className="text-3xl text-slate-900">Mais alguma coisa?</h2>
                <HintTooltip text="Conte sobre limitações, experiências ruins anteriores, integrações específicas ou qualquer detalhe único do seu negócio." />
              </div>
              <p className="text-slate-500 text-base mb-6">Opcional — mas pode fazer toda a diferença na proposta.</p>

              <textarea
                className="input-field h-40 resize-none pt-3"
                placeholder="Algo que eu precise saber sobre o seu negócio, uma limitação, uma integração específica, algo que já tentou e não funcionou..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />

              <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mt-6">
                <p className="text-base text-navy-800 font-medium">📋 Resumo do seu briefing:</p>
                <ul className="text-sm text-slate-700 mt-2 space-y-1">
                  <li>• <strong>Tipo:</strong> {tipoSolucao} {subtipo ? `→ ${subtipo}` : ""}</li>
                  <li>• <strong>Empresa:</strong> {nomeEmpresa || nomeContato}</li>
                  <li>• <strong>Segmento:</strong> {segmento}</li>
                  <li>• <strong>Investimento:</strong> {investimento}</li>
                  <li>• <strong>Prazo:</strong> {prazo}</li>
                </ul>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={handleBack} className="btn-secondary flex-1">← Voltar</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-70"
                >
                  {loading ? "Enviando..." : "Enviar briefing 🚀"}
                </button>
              </div>
              <p className="text-sm text-slate-400 mt-3 text-center">
                Ao enviar, você concorda que usaremos seus dados para preparar a proposta.
              </p>
            </div>
          )}

          {/* Step 6: Sucesso */}
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
