"use client";

import { useState } from "react";
import Link from "next/link";

const NAVY = "#0f2044";
const GOLD = "#c9a84c";

export default function MemberLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // TODO: integrar autenticação de membros (Supabase Auth separado ou mesmo projeto)
    await new Promise((r) => setTimeout(r, 800));
    setError("Área de membros em breve. Acesse pelo link enviado ao seu e-mail.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: NAVY }}>

      {/* Gradientes */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: GOLD }} />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "#1a4fd6" }} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
              🤖
            </div>
            <div>
              <p className="font-bold text-white text-lg" style={{ fontFamily: "'General Sans', sans-serif" }}>
                IA com Peterson
              </p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                Área de Membros
              </p>
            </div>
          </Link>
        </div>

        {/* Card de login */}
        <div className="rounded-2xl p-8 border"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>

          <h1 className="text-2xl font-bold text-white mb-1"
            style={{ fontFamily: "'General Sans', sans-serif" }}>
            Bem-vindo de volta
          </h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            Acesse seus cursos, comunidade e conteúdos exclusivos.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(201,168,76,0.5)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(201,168,76,0.5)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg text-sm"
                style={{ background: "rgba(201,168,76,0.1)", color: GOLD, border: "1px solid rgba(201,168,76,0.2)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 mt-2"
              style={{ background: GOLD, color: NAVY, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Entrando..." : "Acessar minha área →"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t flex items-center justify-between"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <Link href="/auth/reset-password"
              className="text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              Esqueci minha senha
            </Link>
            <Link href="/"
              className="text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              ← Voltar ao site
            </Link>
          </div>
        </div>

        {/* Não tem acesso */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            Ainda não é membro?{" "}
            <Link href="/#produtos"
              className="font-medium underline transition-colors"
              style={{ color: GOLD }}>
              Conheça o LEAP BUILD
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
