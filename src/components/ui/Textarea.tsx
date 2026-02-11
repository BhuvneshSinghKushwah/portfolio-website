import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-muted/70 font-mono">› {label}</label>
      )}
      <textarea
        className={`w-full rounded-none border border-card-border bg-card-bg px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted/30 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30 resize-none ${
          error ? "border-error" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
