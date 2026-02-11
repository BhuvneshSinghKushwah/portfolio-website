interface BentoGridProps {
  children: React.ReactNode;
}

/** Responsive CSS grid with ambient background glow: 1 col (mobile), 2 cols (tablet), 4 cols (desktop). */
export function BentoGrid({ children }: BentoGridProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" style={{ background: "rgba(0,255,65,0.025)" }} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(180px,auto)]">
        {children}
      </div>
    </div>
  );
}
