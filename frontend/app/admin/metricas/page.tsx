"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";

export default function MetricasPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/admin/login"); return; }
      supabase
        .from("clientes")
        .select("status, created_at")
        .then(({ data }) => {
          setClientes(data || []);
          setLoading(false);
        });
    });
  }, [router]);

  const total = clientes.length;
  const emNegociacao = clientes.filter(c => ["formulario_recebido","prd_elaborado","prd_aprovado","proposta_elaborada","proposta_enviada"].includes(c.status)).length;
  const emExecucao = clientes.filter(c => c.status === "em_execucao").length;
  const entregues = clientes.filter(c => c.status === "entregue").length;
  const taxaConversao = total > 0 ? Math.round((entregues / total) * 100 * 10) / 10 : 0;

  const cards = [
    { emoji: "📥", label: "Total de leads", value: total },
    { emoji: "💼", label: "Em negociação", value: emNegociacao },
    { emoji: "🔨", label: "Em execução", value: emExecucao },
    { emoji: "✅", label: "Entregues", value: entregues },
    { emoji: "💰", label: "Receita no mês", value: "R$ —" },
    { emoji: "📊", label: "Taxa de conversão", value: `${taxaConversao}%` },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl text-slate-900 mb-6">Métricas</h1>
        {loading ? (
          <p className="text-base text-slate-400">Carregando...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{c.emoji}</span>
                  <p className="text-sm font-medium text-slate-500">{c.label}</p>
                </div>
                <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'General Sans', sans-serif" }}>{c.value}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
