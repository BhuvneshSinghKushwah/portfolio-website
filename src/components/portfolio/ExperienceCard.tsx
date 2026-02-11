"use client";

import { motion } from "framer-motion";
import type { Experience } from "@/types/database";

interface ExperienceCardProps {
  experience: Experience;
  isLast: boolean;
  index?: number;
}

/** Terminal-style timeline entry with ASCII connector, bracket markers, and staggered reveal. */
export function ExperienceCard({ experience, isLast, index = 0 }: ExperienceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative pl-6"
    >
      <span className="absolute left-0 top-1 text-accent text-xs font-bold leading-none">▶</span>
      {!isLast && (
        <div className="absolute left-[5px] top-5 h-full w-px bg-accent/20" />
      )}
      <div className="pb-7">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-foreground">{experience.company}</h3>
          <span className="text-xs text-muted">{experience.start_date} – {experience.end_date}</span>
        </div>
        <p className="mb-2 text-sm text-accent/80">{experience.role}</p>
        <ul className="space-y-1">
          {experience.description.map((point, i) => (
            <li key={i} className="text-sm leading-relaxed text-foreground/70">
              <span className="mr-1.5 text-accent/70">›</span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
