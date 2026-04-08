import { cn } from "@/lib/utils";

type ProgressRingProps = {
  label: string;
  value: number;
  detail: string;
  className?: string;
};

export function ProgressRing({ label, value, detail, className }: ProgressRingProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-xl text-center shadow-card",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        <svg className="size-36 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="hsl(var(--surface-muted))"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="hsl(var(--brand))"
            strokeLinecap="round"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute">
          <p className="font-heading text-3xl font-semibold text-text-strong">{clampedValue}%</p>
        </div>
      </div>
      <div className="mt-md space-y-xs">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-brand">{label}</p>
        <p className="text-sm text-text-soft">{detail}</p>
      </div>
    </div>
  );
}
