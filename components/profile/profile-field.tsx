import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/tailwind/tailwind";

type ProfileFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function ProfileField({ label, error, ...props }: ProfileFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text-strong">{label}</span>
      <input
        {...props}
        className={cn(
          "w-full rounded-2xl border border-input bg-background px-md py-sm text-sm text-text-strong outline-none transition",
          "focus:border-brand focus:ring-2 focus:ring-[hsl(var(--brand)/0.2)]",
          error
            ? "border-destructive focus:ring-[hsl(var(--destructive)/0.2)]"
            : "",
        )}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </label>
  );
}
