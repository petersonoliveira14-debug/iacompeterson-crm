export function BrandingSidebar() {
  return (
    <div
      className="hidden lg:flex w-[60%] min-h-screen flex-col relative overflow-hidden"
      style={{ background: "#064e3b" }}
    >
      {/* Abstract gradients */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#059669" }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#075985" }}
      />

      <div className="relative z-10 flex flex-col justify-center flex-1 px-12 py-16 max-w-[560px] mx-auto">
        {/* Logo lockup */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" }}
          >
            🤖
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'General Sans', sans-serif" }}>
              IA com Peterson
            </p>
            <p className="text-emerald-300 text-sm">Automação inteligente</p>
          </div>
        </div>

        <h1
          className="text-white font-bold mb-4 leading-tight"
          style={{ fontSize: "3.5rem", fontFamily: "'General Sans', sans-serif" }}
        >
          Transforme sua operação com IA
        </h1>
        <p className="text-emerald-200 text-lg mb-10 leading-relaxed">
          Sistemas personalizados, bots de atendimento e automações que trabalham enquanto você dorme.
        </p>

        {/* Feature cards */}
        <div className="space-y-3">
          {[
            { icon: "⚡", title: "Resultados em semanas", desc: "Não em meses" },
            { icon: "🎯", title: "Solução sob medida", desc: "Para o seu negócio específico" },
            { icon: "🤝", title: "Você fala com quem faz", desc: "Sem intermediários, sem tickets" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{item.title}</p>
                <p className="text-emerald-300 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
