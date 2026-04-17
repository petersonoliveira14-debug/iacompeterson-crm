"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import toast from "react-hot-toast";

export default function PromptPage() {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState("");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Link href="/admin/clientes" className="hover:text-slate-600">Clientes</Link>
          <span>›</span>
          <Link href={`/admin/clientes/${id}`} className="hover:text-slate-600">Cliente</Link>
          <span>›</span>
          <span className="text-slate-700">Prompt de Sistema</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-slate-900">Prompt de Desenvolvimento</h1>
          <button
            onClick={() => { navigator.clipboard.writeText(prompt); toast.success("Prompt copiado!"); }}
            className="btn-primary text-sm py-2"
          >
            📋 Copiar prompt
          </button>
        </div>

        <div className="card p-1 mb-3">
          <textarea
            className="w-full h-[calc(100vh-280px)] p-5 text-sm font-mono text-slate-800 resize-none focus:outline-none rounded-2xl"
            placeholder="Cole aqui o prompt gerado (use o template em _TEMPLATES/prompt-sistema-template.md)..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
        </div>
        <p className="text-xs text-slate-400 text-center">
          Cole este prompt no Claude Code para iniciar o desenvolvimento do projeto.
        </p>
      </main>
    </div>
  );
}
