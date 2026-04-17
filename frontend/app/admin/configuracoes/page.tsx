"use client";

import { Sidebar } from "@/components/admin/Sidebar";

export default function ConfiguracoesPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-2xl">
        <h1 className="text-2xl text-slate-900 mb-6">Configurações</h1>
        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do negócio</label>
            <input className="input-field" defaultValue="IA com Peterson" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp de contato</label>
            <input className="input-field" placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Link do formulário público</label>
            <input className="input-field" readOnly
              value={typeof window !== "undefined" ? `${window.location.origin}/cliente` : "https://iacompeterson.com.br/cliente"} />
          </div>
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">Para alterar e-mail/senha admin, edite as variáveis de ambiente no Railway (backend).</p>
          </div>
        </div>
      </main>
    </div>
  );
}
