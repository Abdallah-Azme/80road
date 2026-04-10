import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ProgressTop({
  step,
  totalSteps,
  setStep,
}: {
  step: number;
  totalSteps: number;
  setStep: (s: number) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col gap-6 py-6 md:py-10" dir="rtl">
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 min-w-fit">
            <span className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
              الخطوة {step} من {totalSteps}
            </span>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              إضافة إعلان جديد في 80road
            </h1>
          </div>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden shadow-inner relative">
            <div
              className="absolute inset-y-0 right-0 bg-linear-to-l from-primary to-primary/60 transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <div className="w-12 h-12 rounded-2xl border border-border/60 flex items-center justify-center text-xs font-black bg-card shadow-xl shadow-primary/5 shrink-0 translate-y-1">
            {Math.round((step / totalSteps) * 100)}%
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setStep(n)}
              aria-label={`الذهاب للخطوة ${n}`}
              className={cn(
                "min-w-[40px] h-10 rounded-xl border-2 font-black text-sm flex items-center justify-center transition-all active:scale-90 shrink-0",
                step === n
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-110"
                  : n < step
                    ? "bg-primary/5 text-primary border-primary/20"
                    : "bg-card text-muted-foreground border-border/60 hover:border-primary/40",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Title({ label }: { label: string }) {
  return (
    <h2 className="text-2xl md:text-2xl font-black text-center mb-10 md:mb-16 tracking-tighter text-foreground leading-tight">
      {label}
    </h2>
  );
}

export function Opt({
  label,
  selected,
  onClick,
  sub,
}: {
  label: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full p-6 md:p-8 rounded-[40px] border-2 flex items-center justify-between transition-all duration-500 group active:scale-[0.97] text-right",
        selected
          ? "border-primary bg-primary/4 text-primary shadow-2xl shadow-primary/10"
          : "border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-muted/30 hover:shadow-xl hover:-translate-y-1",
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="font-black text-lg md:text-lg tracking-tight leading-none">
          {label}
        </div>
        {sub && (
          <div className="text-sm text-muted-foreground font-bold">{sub}</div>
        )}
      </div>
      <div
        className={cn(
          "w-8 h-8 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-500",
          selected
            ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg"
            : "border-muted/60 group-hover:border-primary/40",
        )}
      >
        {selected && <Check className="w-5 h-5 stroke-[4px]" />}
      </div>
    </button>
  );
}
