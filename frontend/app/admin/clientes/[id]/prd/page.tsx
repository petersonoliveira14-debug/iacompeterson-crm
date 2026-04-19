"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function PRDPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [conteudo, setConteudo] = useState("");
  const [versao, setVersao] = useState(1);
  const [docId, setDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) { router.push("/admin/login"); return; }
    // Carregar PRD existente (última versão)
      supabase
        .from("documentos")
        .select("id, conteudo, versao")
        .eq("cliente_id", id)
        .eq("tipo", "prd")
        .order("versao", { ascending: false })
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setConteudo(data[0].conteudo);
            setVersao(data[0].versao);
            setDocId(data[0].id);
          }
        });
    });
  }, [id, router]);

  const save = async (status: string) => {
    setSaving(true);
    try {
      if (docId) {
        // Atualizar documento existente
        const { error } = await supabase
          .from("documentos")
          .update({ conteudo, status, versao })
          .eq("id", docId);
        if (error) throw error;
      } else {
        // Criar novo documento
        const { data, error } = await supabase
          .from("documentos")
          .insert({ cliente_id: id, tipo: "prd", versao, conteudo, status })
          .select("id")
          .single();
        if (error) throw error;
        setDocId(data.id);
      }

      if (status === "aprovado") {
        await supabase
          .from("clientes")
          .update({ status: "prd_aprovado" })
          .eq("id", id);
        toast.success("PRD aprovado! Cliente avançado para PRD Aprovado.");
      } else {
        toast.success("PRD salvo como rascunho.");
      }
    } catch {
      toast.error("Erro ao salvar PRD.");
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
            <button onClick={() => save("rascunho")} disabled={saving} className="btn-secondary text-sm py-2">
              Salvar rascunho
            </button>
            <button onClick={() => save("aprovado")} disabled={saving} className="btn-primary text-sm py-2">
              ✅ Aprovar PRD
            </button>
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
        <p className="text-xs text-slate-400 mt-2 text-center">
          Use Markdown. Cole o template de _TEMPLATES/prd-template.md como base.
        </p>
      </main>
    </div>
  );
}
