"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard",      emoji: "📊", label: "Dashboard" },
  { href: "/admin/clientes",       emoji: "👥", label: "Clientes" },
  { href: "/admin/pipeline",       emoji: "🔀", label: "Pipeline" },
  { href: "/admin/produtos",       emoji: "📦", label: "Produtos" },
  { href: "/admin/metricas",       emoji: "📈", label: "Métricas" },
  { href: "/admin/fluxo-de-caixa", emoji: "💸", label: "Fluxo de Caixa" },
  { href: "/admin/configuracoes",  emoji: "⚙️", label: "Configurações" },
];

function SidebarContent({
  darkMode,
  toggleTheme,
  handleLogout,
  onNavClick,
}: {
  darkMode: boolean;
  toggleTheme: () => void;
  handleLogout: () => void;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)" }}
        >
          🤖
        </div>
        <div>
          <p className="text-white font-bold text-sm" style={{ fontFamily: "'General Sans', sans-serif" }}>
            IA com Peterson
          </p>
          <p className="text-xs" style={{ color: "#c9a84c" }}>Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-all duration-200",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className="text-base">{item.emoji}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={darkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 mt-2"
      >
        <span>{darkMode ? "☀️" : "🌙"}</span>
        {darkMode ? "Tema claro" : "Tema escuro"}
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 mt-1"
      >
        <span>🚪</span>
        Sair
      </button>
    </>
  );
}

export function Sidebar() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_theme");
    const isDark = saved !== "light";
    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  // Close on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  function applyTheme(dark: boolean) {
    if (dark) document.documentElement.classList.add("admin-dark");
    else document.documentElement.classList.remove("admin-dark");
  }

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("admin_theme", next ? "dark" : "light");
    applyTheme(next);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin/login");
  };

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────────────── */}
      <aside
        className="hidden md:flex w-64 min-h-screen flex-col py-6 px-4 flex-shrink-0"
        style={{ background: "#0f2044" }}
      >
        <SidebarContent
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
        />
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: "#0f2044", borderBottom: "1px solid rgba(201,168,76,0.15)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
            style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)" }}
          >
            🤖
          </div>
          <p className="text-white font-bold text-sm">IA com Peterson</p>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-all"
          aria-label="Abrir menu"
        >
          <span className="block w-5 h-0.5 bg-white/70" />
          <span className="block w-5 h-0.5 bg-white/70" />
          <span className="block w-4 h-0.5 bg-white/70" />
        </button>
      </div>

      {/* Spacer gerenciado pelo admin/layout.tsx */}

      {/* ── Mobile drawer overlay ─────────────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <aside
            className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col py-6 px-4"
            style={{ background: "#0f2044" }}
          >
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Fechar menu"
            >
              ✕
            </button>

            <SidebarContent
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
              onNavClick={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}
    </>
  );
}
