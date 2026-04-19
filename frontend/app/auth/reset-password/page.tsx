"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase coloca o access_token no hash da URL após o click no email
    // Ex: /auth/reset-password#access_token=...&type=recovery
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      // O Supabase JS detecta o token do hash automaticamente na sessão
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setReady(true);
        } else {
          toast.error("Link expirado ou inválido. Solicite um novo.");
        }
      });
    } else {
      // Tentar pegar a sessão de qualquer forma (PKCE flow)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setReady(true);
        } else {
          toast.error("Acesse via link do e-mail de recuperação.");
        }
      });
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha definida com sucesso!");
      setTimeout(() => router.push("/admin/login"), 1500);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao definir senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Branding */}
      <div
        className="hidden lg:flex w-[60%] min-h-screen flex-col relative overflow-hidden"
        style={{ background: "#0f2044" }}
      >
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "#c9a84c" }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "#163566" }} />
        <div className="relative z-10 flex flex-col justify-center flex-1 px-12 max-w-[560px] mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)" }}
            >
              🤖
            </div>
            <div>
              <p className="text-white font-bold text-lg">IA com Peterson</p>
              <p className="text-sm" style={{ color: "#c9a84c" }}>Painel Administrativo</p>
            </div>
          </div>
          <h2 className="text-white font-bold text-4xl mb-4">
            Defina sua nova senha
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#d0def4" }}>
            Escolha uma senha forte para proteger o acesso ao painel.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-white">
        <div className="w-full max-w-[448px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl text-slate-900 mb-2">Nova senha</h1>
            <p className="text-base text-slate-500">Digite e confirme sua nova senha de acesso</p>
          </div>

          {ready ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-base font-medium text-slate-700 mb-1.5">Nova senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field pr-12"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 mb-1.5">Confirmar senha</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Repita a senha"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-base py-4 mt-2 disabled:opacity-70"
              >
                {loading ? "Salvando..." : "Definir senha →"}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-slate-500">Verificando link de recuperação...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
