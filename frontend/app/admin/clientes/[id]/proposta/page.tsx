"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Pacote {
  nome: string;
  descricao: string;
  itens: string;
  valor: string;
  prazo_dias: string;
  destaque: boolean;
}

const defaultPacote = (): Pacote => ({
  nome: "", descricao: "", itens: "", valor: "", prazo_dias: "", destaque: false,
});

export default function PropostaBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [validade, setValidade] = useState("");
  const [pacotes, setPacotes] = useState<Pacote[]>([
    { ...defaultPacote(), nome: "Essencial" },
    { ...defaultPacote(), nome: "Profissional", destaque: true },
    { ...defaultPacote(), nome: "Premium" },
  ]);
  const [saving, setSaving] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const updatePacote = (i: number, field: keyof Pacote, value: string | boolean) => {
    setPacotes(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }

    const validPacotes = pacotes.filter(p => p.nome && p.valor && p.prazo_dias);
    if (validPacotes.length === 0) {
      toast.error("Preencha ao menos um pacote com nome, valor e prazo.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/clientes/${id}/propostas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          validade_ate: validade || null,
          pacotes: validPacotes.map(p => ({
            nome: p.nome,
            descricao: p.descricao || null,
            itens: p.itens.split("\n").filter(Boolean),
            valor: parseFloat(p.valor.replace(",", ".")),
            prazo_dias: parseInt(p.prazo_dias),
            destaque: p.destaque,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCreatedToken(data.token);
      toast.success("Proposta criada!");
    } catch {
      toast.error("Erro ao criar proposta.");
    } finally {
      setSaving(false);
    }
  };

  const handleEnviar = async (propostaId: string) => {
    const token = localStorage.getItem("admin_token")!;
    await fetch(`${API_URL}/api/admin/propostas/${propostaId}/enviar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Proposta marcada como enviada!");
  };

  const propostaLink = createdToken
    ? `${typeof window !== "undefined" ? window.location.origin : "https://iacompeterson.com.br"}/proposta/${createdToken}`
    : null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/admin/clientes" className="hover:text-slate-600">Clientes</Link>
          <span>›</span>
          <Link href={`/admin/clientes/${id}`} className="hover:text-slate-600">Cliente</Link>
          <span>›</span>
          <span className="text-slate-700">Proposta</span>
        </div>

        <h1 className="text-2xl text-slate-900 mb-6">Builder de Proposta</h1>

        {createdToken ? (
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-xl font-bold text-slate-900">Proposta criada!</h2>
              <p className="text-slate-500 text-sm mt-1">Copie o link e envie para o cliente pelo WhatsApp</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-emerald-800 mb-2">🔗 Link da proposta:</p>
              <div className="flex gap-2">
                <code className="text-sm text-emerald-700 flex-1 overflow-x-auto">{propostaLink}</code>
                <button
                  onClick={() => { navigator.clipboard.writeText(propostaLink!); toast.success("Copiado!"); }}
                  className="btn-primary py-1.5 px-3 text-xs flex-shrink-0"
                >
                  Copiar
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center">
              O link fica disponível até você marcar como &quot;enviada&quot; e o cliente assinar.
            </p>
          </div>
        ) : (
          <>
            <div className="card p-5 mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Validade da proposta</label>
              <input type="date" className="input-field w-auto" value={validade} onChange={e => setValidade(e.target.value)} />
            </div>

            <div className="space-y-4 mb-6">
              {pacotes.map((p, i) => (
                <div key={i} className={`card p-5 ${p.destaque ? "border-emerald-300" : ""}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-bold text-slate-800">Pacote {i + 1}</h3>
                    <label className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto cursor-pointer">
                      <input type="checkbox" checked={p.destaque}
                        onChange={e => updatePacote(i, "destaque", e.target.checked)}
                        className="accent-emerald-600" />
                      Destaque (⭐ Mais escolhido)
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Nome *</label>
                      <input className="input-field" placeholder="Ex: Essencial" value={p.nome}
                        onChange={e => updatePacote(i, "nome", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Valor (R$) *</label>
                      <input className="input-field" placeholder="Ex: 3500" value={p.valor}
                        onChange={e => updatePacote(i, "valor", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Prazo (dias úteis) *</label>
                      <input className="input-field" placeholder="Ex: 14" value={p.prazo_dias}
                        onChange={e => updatePacote(i, "prazo_dias", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Descrição curta</label>
                      <input className="input-field" placeholder="Ex: Ideal para começar" value={p.descricao}
                        onChange={e => updatePacote(i, "descricao", e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        O que está incluso (1 item por linha)
                      </label>
                      <textarea className="input-field h-24 resize-none pt-2 text-xs"
                        placeholder={"Bot WhatsApp com menu\nRespostas automáticas FAQ\nSuporte 30 dias"}
                        value={p.itens}
                        onChange={e => updatePacote(i, "itens", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-4 text-base">
              {saving ? "Criando proposta..." : "✅ Criar proposta e gerar link"}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
