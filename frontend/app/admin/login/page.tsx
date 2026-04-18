"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const ADMIN_USERNAME = "masteradmin01";
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username !== ADMIN_USERNAME) {
      toast.error("Usuário não encontrado.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
      if (error) throw error;
      router.push("/admin/dashboard");
    } catch {
      toast.error("Usuário ou senha incorretos.");
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
              <p className="text-white font-bold text-lg" style={{ fontFamily: "'General Sans', sans-serif" }}>IA com Peterson</p>
              <p className="text-sm" style={{ color: "#c9a84c" }}>Painel Administrativo</p>
            </div>
          </div>
          <h2 className="text-white font-bold text-4xl mb-4" style={{ fontFamily: "'General Sans', sans-serif" }}>
            Bem-vindo de volta, Peterson
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#d0def4" }}>
            Gerencie seus clientes, acompanhe o pipeline e construa propostas — tudo em um lugar.
          </p>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-white">
        <div className="w-full max-w-[448px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl text-slate-900 mb-2">Entrar</h1>
            <p className="text-base text-slate-500">Acesse o painel de gestão</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1.5">Usuário</label>
              <input
                type="text"
                className="input-field"
                placeholder="masteradmin01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-4 mt-2 disabled:opacity-70"
            >
              {loading ? "Entrando..." : "Entrar →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
