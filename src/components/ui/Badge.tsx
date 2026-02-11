interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

/** CRT-style [tag] badge with square corners and green accent border. */
export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-none border border-accent/15 bg-accent/5 px-2 py-0.5 text-xs text-muted/80 transition-colors hover:border-accent/30 hover:text-accent ${className}`}
    >
      [{children}]
    </span>
  );
}
