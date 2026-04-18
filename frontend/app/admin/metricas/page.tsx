"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function MetricasPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetch(`${API_URL}/api/admin/metricas`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setMetrics);
  }, [router]);

  const cards = metrics ? [
    { emoji: "📥", label: "Total de leads", value: metrics.total_leads },
    { emoji: "💼", label: "Em negociação", value: metrics.em_negociacao },
    { emoji: "🔨", label: "Em execução", value: metrics.em_execucao },
    { emoji: "✅", label: "Entregues", value: metrics.entregues_mes },
    { emoji: "💰", label: "Receita no mês", value: `R$ ${(metrics.receita_mes || 0).toLocaleString("pt-BR")}` },
    { emoji: "📊", label: "Taxa de conversão", value: `${metrics.taxa_conversao || 0}%` },
  ] : [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl text-slate-900 mb-6">Métricas</h1>
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
          {!metrics && <p className="text-base text-slate-400 col-span-3 text-center py-8">Carregando...</p>}
        </div>
      </main>
    </div>
  );
}
