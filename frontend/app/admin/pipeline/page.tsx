"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const STAGES = [
  { value: "lead_captado", label: "Lead Captado", color: "bg-slate-100 border-slate-200" },
  { value: "formulario_recebido", label: "Form. Recebido", color: "bg-blue-50 border-blue-200" },
  { value: "prd_aprovado", label: "PRD Aprovado", color: "bg-emerald-50 border-emerald-200" },
  { value: "proposta_enviada", label: "Proposta Enviada", color: "bg-amber-50 border-amber-200" },
  { value: "proposta_aceita", label: "Aceito 🎉", color: "bg-green-50 border-green-200" },
  { value: "em_execucao", label: "Em Execução", color: "bg-sky-50 border-sky-200" },
  { value: "entregue", label: "Entregue ✓", color: "bg-teal-50 border-teal-200" },
];

export default function PipelinePage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetch(`${API_URL}/api/admin/clientes?limit=100`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setClientes(d.items || d))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-auto">
        <h1 className="text-2xl text-slate-900 mb-6">Pipeline Kanban</h1>
        {loading ? (
          <p className="text-slate-400">Carregando...</p>
        ) : (
          <div className="flex gap-4 min-w-max pb-4">
            {STAGES.map(stage => {
              const items = clientes.filter(c => c.status === stage.value);
              return (
                <div key={stage.value} className="w-64 flex-shrink-0">
                  <div className={`rounded-2xl border-2 p-3 ${stage.color}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{stage.label}</p>
                      <span className="text-xs bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">{items.length}</span>
                    </div>
                    <div className="space-y-2">
                      {items.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-4">Vazio</p>
                      )}
                      {items.map(c => (
                        <Link key={c.id} href={`/admin/clientes/${c.id}`}
                          className="block bg-white rounded-xl p-3 border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all">
                          <p className="text-sm font-semibold text-slate-800 truncate">{c.nome_empresa || c.nome_contato}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{c.segmento} · {c.faixa_investimento || "—"}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
