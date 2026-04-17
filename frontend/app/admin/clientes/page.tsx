"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const STATUS_INFO: Record<string, { label: string; color: string }> = {
  lead_captado: { label: "Lead", color: "bg-slate-100 text-slate-600" },
  discovery_call: { label: "Discovery", color: "bg-blue-100 text-blue-700" },
  formulario_enviado: { label: "Form. enviado", color: "bg-indigo-100 text-indigo-700" },
  formulario_recebido: { label: "Form. recebido", color: "bg-sky-100 text-sky-700" },
  prd_elaborado: { label: "PRD", color: "bg-purple-100 text-purple-700" },
  reuniao_1: { label: "Reunião 1", color: "bg-violet-100 text-violet-700" },
  prd_aprovado: { label: "PRD ✓", color: "bg-emerald-100 text-emerald-700" },
  proposta_elaborada: { label: "Proposta 📝", color: "bg-amber-100 text-amber-700" },
  proposta_enviada: { label: "Proposta 📤", color: "bg-orange-100 text-orange-700" },
  proposta_aceita: { label: "Aceito 🎉", color: "bg-green-100 text-green-700" },
  em_execucao: { label: "Execução 🔨", color: "bg-cyan-100 text-cyan-700" },
  entregue: { label: "Entregue ✓", color: "bg-teal-100 text-teal-700" },
  pos_venda: { label: "Pós-venda", color: "bg-lime-100 text-lime-700" },
};

const TIPO_EMOJI: Record<string, string> = {
  sistema: "⚙️", atendimento: "🤖", assistente: "🧠", multiplo: "🔀",
};

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetch(`${API_URL}/api/admin/clientes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setClientes(d.items || d))
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = clientes.filter(c =>
    !search || [c.nome_contato, c.nome_empresa, c.segmento].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl text-slate-900">Clientes</h1>
            <p className="text-slate-500 text-sm mt-0.5">{clientes.length} no total</p>
          </div>
          <Link href="/admin/clientes/novo" className="btn-primary">+ Novo lead</Link>
        </div>

        <div className="card mb-4">
          <div className="p-4 border-b border-slate-100">
            <input
              className="input-field"
              placeholder="Buscar por nome, empresa ou segmento..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="divide-y divide-slate-100">
            {loading && (
              <div className="p-8 text-center text-slate-400">Carregando...</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                {search ? "Nenhum resultado." : "Nenhum cliente ainda. Compartilhe o link do formulário!"}
              </div>
            )}
            {filtered.map(c => {
              const st = STATUS_INFO[c.status] || { label: c.status, color: "bg-slate-100 text-slate-600" };
              return (
                <Link key={c.id} href={`/admin/clientes/${c.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">
                    {TIPO_EMOJI[c.tipo_solucao] || "👤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{c.nome_empresa || c.nome_contato}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.nome_empresa ? c.nome_contato + " · " : ""}{c.segmento} · {c.whatsapp}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                    <span className="text-xs text-slate-400 hidden md:block">
                      {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="text-slate-300">›</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
