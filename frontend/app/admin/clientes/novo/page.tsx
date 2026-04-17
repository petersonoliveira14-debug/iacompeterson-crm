"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NovoClientePage() {
  const router = useRouter();
  const [form, setForm] = useState({ nome_contato: "", nome_empresa: "", whatsapp: "", segmento: "", tipo_solucao: "sistema", status: "lead_captado" });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    if (!form.nome_contato || !form.whatsapp) { toast.error("Nome e WhatsApp são obrigatórios."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "lead_captado" }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success("Lead criado!");
      router.push(`/admin/clientes/${data.id}`);
    } catch {
      toast.error("Erro ao criar lead.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-2xl">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/admin/clientes" className="hover:text-slate-600">Clientes</Link>
          <span>›</span>
          <span className="text-slate-700">Novo lead</span>
        </div>
        <h1 className="text-2xl text-slate-900 mb-6">Adicionar lead manualmente</h1>
        <div className="card p-6 space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo *</label>
            <input className="input-field" value={form.nome_contato} onChange={e => set("nome_contato", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Empresa</label>
            <input className="input-field" value={form.nome_empresa} onChange={e => set("nome_empresa", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp *</label>
            <input className="input-field" value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Segmento</label>
            <input className="input-field" value={form.segmento} onChange={e => set("segmento", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de solução</label>
            <select className="input-field" value={form.tipo_solucao} onChange={e => set("tipo_solucao", e.target.value)}>
              <option value="sistema">⚙️ Sistema</option>
              <option value="atendimento">🤖 Atendimento</option>
              <option value="assistente">🧠 Assistente</option>
              <option value="multiplo">🔀 Múltiplo</option>
            </select>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3">
            {saving ? "Salvando..." : "Criar lead"}
          </button>
        </div>
      </main>
    </div>
  );
}
