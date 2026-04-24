"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProposta, aceitarProposta, type Proposta, type PacoteProposta } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PropostaPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [nomeAssinante, setNomeAssinante] = useState("");
  const [aceiteConfirmado, setAceiteConfirmado] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProposta(token)
      .then(setProposta)
      .catch(() => toast.error("Proposta não encontrada ou expirada."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAceitar = async () => {
    if (!selected || !nomeAssinante || !aceiteConfirmado) {
      toast.error("Selecione um pacote, informe seu nome e confirme o aceite.");
      return;
    }
    setSubmitting(true);
    try {
      await aceitarProposta(token, selected, nomeAssinante);
      router.push(`/proposta/${token}/aceita`);
    } catch {
      toast.error("Erro ao registrar aceite. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (!proposta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Proposta não encontrada</h2>
          <p className="text-slate-500">Este link pode ter expirado ou sido desativado. Entre em contato com Peterson.</p>
        </div>
      </div>
    );
  }

  if (proposta.status === "aceita") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Proposta já aceita!</h2>
          <p className="text-slate-500">Esta proposta já foi aceita. Em breve entraremos em contato.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div style={{ background: "#064e3b" }} className="py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">🤖</div>
          <div>
            <p className="text-white font-bold" style={{ fontFamily: "'General Sans', sans-serif" }}>IA com Peterson</p>
            <p className="text-emerald-300 text-xs">Proposta Comercial</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Intro */}
        <div className="text-center mb-10 animate-step-in">
          <h1 className="text-3xl text-slate-900 mb-3">
            Olá, {proposta.cliente.nome_contato.split(" ")[0]}!
          </h1>
          <p className="text-slate-500 text-lg">
            Preparei esta proposta especialmente para a <strong>{proposta.cliente.nome_empresa || "sua empresa"}</strong>.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            {proposta.validade_ate && (
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-2 rounded-full">
                ⏰ Válida até {new Date(proposta.validade_ate).toLocaleDateString("pt-BR")}
              </div>
            )}
            <Link
              href={`/proposta/${proposta.token}/apresentacao`}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium transition-all"
              style={{ background: "#0f2044", color: "white" }}
            >
              📊 Ver apresentação
            </Link>
          </div>

          {/* Diferencial */}
          <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
            {[
              { icon: "🛡️", text: "30 dias de suporte incluídos" },
              { icon: "✅", text: "Aceite digital com validade legal" },
              { icon: "🚀", text: "Início imediato após aceite" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-500">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pacotes */}
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          {proposta.pacotes.map((pacote) => (
            <PacoteCard
              key={pacote.id}
              pacote={pacote}
              selected={selected === pacote.id}
              onSelect={() => setSelected(pacote.id)}
            />
          ))}
        </div>

        {/* Assinatura */}
        {selected && (
          <div className="card p-6 animate-step-in">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Confirmar aceite</h3>

            <div className="mb-4">
              <label className="block text-base font-medium text-slate-700 mb-1.5">
                Seu nome completo (assinatura digital)
              </label>
              <input
                className="input-field"
                placeholder="Digite seu nome completo para assinar"
                value={nomeAssinante}
                onChange={(e) => setNomeAssinante(e.target.value)}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={aceiteConfirmado}
                onChange={(e) => setAceiteConfirmado(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-emerald-600"
              />
              <span className="text-base text-slate-600 leading-relaxed">
                Declaro que li e aceito os termos desta proposta, incluindo o escopo, valores e condições descritos acima.
                Estou ciente que este aceite tem validade legal.
              </span>
            </label>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-emerald-800">Resumo do que você está aceitando:</p>
              <p className="text-sm text-emerald-700 mt-1">
                Pacote <strong>{proposta.pacotes.find(p => p.id === selected)?.nome}</strong> —
                R$ {proposta.pacotes.find(p => p.id === selected)?.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <button
              onClick={handleAceitar}
              disabled={submitting || !nomeAssinante || !aceiteConfirmado}
              className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Registrando aceite..." : "✅ Aceitar e assinar proposta"}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-400 mt-8">
          Dúvidas? Entre em contato com Peterson pelo WhatsApp antes de assinar.
        </p>
      </div>
    </div>
  );
}

function PacoteCard({ pacote, selected, onSelect }: {
  pacote: PacoteProposta;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative text-left p-5 rounded-2xl border-2 transition-all duration-300 w-full",
        selected
          ? "border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-600/10"
          : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md",
        pacote.destaque && !selected && "border-emerald-200"
      )}
    >
      {pacote.destaque && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Mais escolhido ⭐
        </div>
      )}

      <div className={cn("text-base font-bold mb-1", selected ? "text-emerald-700" : "text-slate-800")}>
        {pacote.nome}
      </div>

      {pacote.descricao && (
        <p className="text-sm text-slate-500 mb-3 leading-relaxed">{pacote.descricao}</p>
      )}

      <div className={cn("text-2xl font-bold mb-1", selected ? "text-emerald-600" : "text-slate-900")} style={{ fontFamily: "'General Sans', sans-serif" }}>
        R$ {pacote.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </div>
      <p className="text-sm text-slate-400 mb-4">Prazo: {pacote.prazo_dias} dias úteis</p>

      <ul className="space-y-2">
        {pacote.itens.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-base text-slate-700">
            <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
            {item}
          </li>
        ))}
      </ul>

      <div className={cn(
        "mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200",
        selected
          ? "bg-emerald-600 text-white"
          : "bg-slate-100 text-slate-600"
      )}>
        {selected ? "✓ Selecionado" : "Selecionar"}
      </div>
    </button>
  );
}
