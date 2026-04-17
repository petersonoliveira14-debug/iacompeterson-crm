"use client";

import { useEffect } from "react";

export default function PropostaAceitaPage() {
  useEffect(() => {
    import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#059669", "#0ea5e9", "#10b981", "#f59e0b"],
      });
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full text-center animate-step-in">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-5xl mx-auto mb-6">
          🎉
        </div>

        <h1 className="text-3xl text-slate-900 mb-3">Proposta aceita!</h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Seu aceite foi registrado com sucesso. Peterson vai entrar em contato em breve para os próximos passos.
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-left mb-6">
          <p className="text-sm font-bold text-emerald-800 mb-3">📋 O que acontece agora:</p>
          <ol className="space-y-2 text-sm text-emerald-700">
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">1.</span>
              <span>Peterson confirma o recebimento pelo WhatsApp</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">2.</span>
              <span>Você recebe as instruções de pagamento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">3.</span>
              <span>Agendamos o kick-off nos próximos 2 dias úteis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold flex-shrink-0">4.</span>
              <span>Começamos a transformar sua operação!</span>
            </li>
          </ol>
        </div>

        <p className="text-sm text-slate-400">
          Dúvidas? Chame no WhatsApp — Peterson responde pessoalmente.
        </p>
      </div>
    </div>
  );
}
