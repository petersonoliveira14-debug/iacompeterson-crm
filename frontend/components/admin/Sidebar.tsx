"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const NAV_ITEMS = [
  { href: "/admin/dashboard", emoji: "📊", label: "Dashboard" },
  { href: "/admin/clientes", emoji: "👥", label: "Clientes" },
  { href: "/admin/pipeline", emoji: "🔀", label: "Pipeline" },
  { href: "/admin/metricas", emoji: "📈", label: "Métricas" },
  { href: "/admin/configuracoes", emoji: "⚙️", label: "Configurações" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col py-6 px-4"
      style={{ background: "#0f2044" }}
    >
      <div className="flex items-center gap-3 px-2 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)" }}
        >
          🤖
        </div>
        <div>
          <p className="text-white font-bold text-sm" style={{ fontFamily: "'General Sans', sans-serif" }}>IA com Peterson</p>
          <p className="text-xs" style={{ color: "#c9a84c" }}>Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
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

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 mt-4"
      >
        <span>🚪</span>
        Sair
      </button>
    </aside>
  );
}
