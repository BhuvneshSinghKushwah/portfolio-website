import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/** Styled button with gradient primary, secondary, and ghost variants. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-mono font-medium rounded-none transition-all disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "border border-accent/50 bg-accent/10 text-accent hover:bg-accent/15 hover:border-accent hover:shadow-[0_0_20px_-3px_var(--glow-accent)]",
    secondary: "border border-card-border bg-card-bg text-foreground hover:border-accent/40",
    ghost: "text-muted hover:text-foreground hover:bg-accent/[0.03]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
