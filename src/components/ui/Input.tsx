import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-muted/70 font-mono">› {label}</label>
      )}
      <input
        className={`w-full rounded-none border border-card-border bg-card-bg px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted/30 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30 ${
          error ? "border-error" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
