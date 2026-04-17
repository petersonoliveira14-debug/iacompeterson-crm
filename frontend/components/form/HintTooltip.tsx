"use client";

import { useState } from "react";

interface HintTooltipProps {
  text: string;
}

export function HintTooltip({ text }: HintTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 text-xs font-bold
                   flex items-center justify-center hover:bg-sky-200 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-sky-400"
        aria-label="Dica"
      >
        !
      </button>
      {open && (
        <div className="absolute z-50 bottom-7 left-1/2 -translate-x-1/2 w-64 p-3
                        bg-slate-900 text-white text-xs rounded-xl shadow-xl
                        animate-fade-in leading-relaxed">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
