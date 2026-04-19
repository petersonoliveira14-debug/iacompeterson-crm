"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const PIPELINE_STAGES = [
  { value: "lead_captado", label: "Lead Captado" },
  { value: "discovery_call", label: "Discovery Call" },
  { value: "formulario_enviado", label: "Form. Enviado" },
  { value: "formulario_recebido", label: "Form. Recebido" },
  { value: "prd_elaborado", label: "PRD Elaborado" },
  { value: "reuniao_1", label: "Reunião 1" },
  { value: "prd_aprovado", label: "PRD Aprovado" },
  { value: "proposta_elaborada", label: "Proposta Pronta" },
  { value: "proposta_enviada", label: "Proposta Enviada" },
  { value: "proposta_aceita", label: "Aceito 🎉" },
  { value: "em_execucao", label: "Em Execução" },
  { value: "entregue", label: "Entregue" },
  { value: "pos_venda", label: "Pós-venda" },
];

const FIELD_LABELS: Record<string, string> = {
  tipo_solucao: "Tipo de solução",
  subtipo: "Subtipo",
  segmento: "Segmento",
  whatsapp: "WhatsApp",
  como_gerencia_hoje: "Como gerencia hoje",
  maior_dor: "Maior dor",
  volume_atendimentos: "Volume/dia",
  resultado_esperado: "Resultado esperado",
  prazo_desejado: "Prazo",
  faixa_investimento: "Investimento",
  observacoes: "Observações",
};

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) { router.push("/admin/login"); return; }
    supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) { router.push("/admin/clientes"); return; }
          setCliente(data);
          setLoading(false);
        });
  }, [id, router]);

  const updateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    const { error } = await supabase
      .from("clientes")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar status.");
    } else {
      setCliente((c: any) => ({ ...c, status: newStatus }));
      toast.success("Status atualizado!");
    }
    setUpdatingStatus(false);
  };

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center text-slate-400">Carregando...</div>
    </div>
  );

  if (!cliente) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/admin/clientes" className="hover:text-slate-600">Clientes</Link>
          <span>›</span>
          <span className="text-slate-700 font-medium">{cliente.nome_empresa || cliente.nome_contato}</span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl text-slate-900">{cliente.nome_empresa || cliente.nome_contato}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {cliente.nome_empresa ? `${cliente.nome_contato} · ` : ""}
              {cliente.segmento} · {cliente.whatsapp}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/clientes/${id}/proposta`} className="btn-primary text-sm py-2">+ Criar proposta</Link>
            <Link href={`/admin/clientes/${id}/prd`} className="btn-secondary text-sm py-2">PRD</Link>
          </div>
        </div>

        {/* Status pipeline */}
        <div className="card p-5 mb-5">
          <h2 className="font-bold text-slate-800 mb-3 text-sm">Estágio no pipeline</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={cliente.status}
              onChange={e => updateStatus(e.target.value)}
              disabled={updatingStatus}
              className="input-field w-auto text-sm"
            >
              {PIPELINE_STAGES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {updatingStatus && <span className="text-xs text-slate-400">Salvando...</span>}
          </div>
        </div>

        {/* Briefing */}
        <div className="card p-5 mb-5">
          <h2 className="font-bold text-slate-800 mb-4 text-sm">Briefing do cliente</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(FIELD_LABELS).map(([key, label]) => {
              const val = cliente[key];
              if (!val) return null;
              return (
                <div key={key} className={key === "maior_dor" || key === "resultado_esperado" || key === "observacoes" ? "md:col-span-2" : ""}>
                  <dt className="text-xs font-medium text-slate-500 mb-0.5">{label}</dt>
                  <dd className="text-sm text-slate-800 bg-slate-50 rounded-lg px-3 py-2">{val}</dd>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href={`/admin/clientes/${id}/prd`} className="card p-4 hover:border-gold-400 transition-colors text-center">
            <p className="text-2xl mb-1">📄</p>
            <p className="text-sm font-medium text-slate-700">PRD</p>
          </Link>
          <Link href={`/admin/clientes/${id}/proposta`} className="card p-4 hover:border-gold-400 transition-colors text-center">
            <p className="text-2xl mb-1">💰</p>
            <p className="text-sm font-medium text-slate-700">Proposta</p>
          </Link>
          <Link href={`/admin/clientes/${id}/prompt`} className="card p-4 hover:border-gold-400 transition-colors text-center">
            <p className="text-2xl mb-1">🤖</p>
            <p className="text-sm font-medium text-slate-700">Prompt</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
