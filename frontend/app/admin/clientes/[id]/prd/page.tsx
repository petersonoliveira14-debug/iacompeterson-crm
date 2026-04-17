"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PRDPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [conteudo, setConteudo] = useState("");
  const [versao, setVersao] = useState(1);
  const [saving, setSaving] = useState(false);

  const save = async (status: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    setSaving(true);
    try {
      await fetch(`${API_URL}/api/admin/clientes/${id}/documentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tipo: "prd", versao, conteudo, status }),
      });
      toast.success(status === "aprovado" ? "PRD aprovado!" : "PRD salvo!");
      if (status === "aprovado") {
        await fetch(`${API_URL}/api/admin/clientes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: "prd_aprovado" }),
        });
      }
    } catch {
      toast.error("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Link href="/admin/clientes" className="hover:text-slate-600">Clientes</Link>
          <span>›</span>
          <Link href={`/admin/clientes/${id}`} className="hover:text-slate-600">Cliente</Link>
          <span>›</span>
          <span className="text-slate-700">PRD v{versao}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-slate-900">Editor de PRD</h1>
          <div className="flex gap-2">
            <button onClick={() => save("rascunho")} disabled={saving} className="btn-secondary text-sm py-2">Salvar rascunho</button>
            <button onClick={() => save("aprovado")} disabled={saving} className="btn-primary text-sm py-2">✅ Aprovar PRD</button>
          </div>
        </div>

        <div className="card p-1">
          <textarea
            className="w-full h-[calc(100vh-280px)] p-5 text-sm font-mono text-slate-800 resize-none focus:outline-none rounded-2xl"
            placeholder="Cole ou escreva o PRD aqui (Markdown)..."
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">Use Markdown. Cole o template de _TEMPLATES/prd-template.md como base.</p>
      </main>
    </div>
  );
}
