"use client";

import { cn } from "@/lib/utils";

interface ChoiceCardProps {
  emoji: string;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function ChoiceCard({ emoji, label, description, selected, onClick }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "choice-card w-full text-left",
        selected && "selected"
      )}
    >
      <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-semibold text-sm",
          selected ? "text-emerald-700" : "text-slate-800"
        )}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-200",
        selected
          ? "bg-emerald-600 border-emerald-600"
          : "border-slate-300"
      )}>
        {selected && (
          <svg viewBox="0 0 20 20" fill="white" className="w-full h-full">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
}
