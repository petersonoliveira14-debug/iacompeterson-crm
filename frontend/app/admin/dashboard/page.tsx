"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface DashboardMetrics {
  total_leads: number;
  em_negociacao: number;
  em_execucao: number;
  entregues_mes: number;
  receita_mes: number;
  taxa_conversao: number;
}

interface ClienteRecente {
  id: string;
  nome_contato: string;
  nome_empresa?: string;
  tipo_solucao: string;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  lead_captado: { label: "Lead", color: "bg-slate-100 text-slate-600" },
  formulario_recebido: { label: "Formulário", color: "bg-blue-100 text-blue-700" },
  prd_elaborado: { label: "PRD", color: "bg-purple-100 text-purple-700" },
  prd_aprovado: { label: "PRD ✓", color: "bg-navy-100 text-navy-700" },
  proposta_enviada: { label: "Proposta", color: "bg-amber-100 text-amber-700" },
  proposta_aceita: { label: "Aceito 🎉", color: "bg-green-100 text-green-700" },
  em_execucao: { label: "Em execução", color: "bg-sky-100 text-sky-700" },
  entregue: { label: "Entregue ✓", color: "bg-teal-100 text-teal-700" },
};

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentes, setRecentes] = useState<ClienteRecente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/api/admin/metricas`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/api/admin/clientes?limit=8`, { headers }).then(r => r.json()),
    ]).then(([m, c]) => {
      setMetrics(m);
      setRecentes(c.items || c);
    }).catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl text-slate-900">Dashboard</h1>
          <p className="text-base text-slate-500 mt-1">Visão geral do seu negócio</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
                <div className="h-8 bg-slate-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard emoji="📥" label="Total de leads" value={metrics?.total_leads ?? 0} />
              <MetricCard emoji="💼" label="Em negociação" value={metrics?.em_negociacao ?? 0} />
              <MetricCard emoji="🔨" label="Em execução" value={metrics?.em_execucao ?? 0} />
              <MetricCard
                emoji="💰"
                label="Receita no mês"
                value={`R$ ${(metrics?.receita_mes ?? 0).toLocaleString("pt-BR")}`}
                highlight
              />
            </div>

            {/* Clientes recentes */}
            <div className="card">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-lg">Últimos clientes</h2>
                <Link href="/admin/clientes" className="text-base text-gold-600 hover:underline font-medium">
                  Ver todos →
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentes.length === 0 && (
                  <p className="p-6 text-slate-400 text-base text-center">Nenhum cliente ainda. Compartilhe o link do formulário!</p>
                )}
                {recentes.map((c) => {
                  const st = STATUS_LABELS[c.status] || { label: c.status, color: "bg-slate-100 text-slate-600" };
                  return (
                    <Link
                      key={c.id}
                      href={`/admin/clientes/${c.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-800 text-base">{c.nome_empresa || c.nome_contato}</p>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {c.nome_empresa ? c.nome_contato + " · " : ""}{c.tipo_solucao}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                          {st.label}
                        </span>
                        <span className="text-sm text-slate-400">
                          {new Date(c.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Link rápido formulário */}
            <div className="mt-6 p-5 rounded-2xl border-2 border-dashed border-gold-200 bg-gold-50/50">
              <p className="text-base font-semibold text-navy-800 mb-1">🔗 Link do formulário para clientes:</p>
              <div className="flex items-center gap-3">
                <code className="text-base text-navy-800 bg-white border border-gold-200 rounded-lg px-3 py-1.5 flex-1 overflow-x-auto">
                  {typeof window !== "undefined" ? window.location.origin : "https://iacompeterson.com.br"}/cliente
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/cliente`);
                  }}
                  className="btn-primary py-1.5 px-4 text-sm"
                >
                  Copiar
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function MetricCard({ emoji, label, value, highlight }: {
  emoji: string;
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div className={`card p-6 ${highlight ? "border-gold-200 bg-gold-50/50" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{emoji}</span>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${highlight ? "text-gold-600" : "text-slate-900"}`}
        style={{ fontFamily: "'General Sans', sans-serif" }}>
        {value}
      </p>
    </div>
  );
}
