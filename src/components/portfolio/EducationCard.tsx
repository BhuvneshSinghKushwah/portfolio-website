"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import type { Education } from "@/types/database";

interface EducationCardProps {
  education: Education[];
  index?: number;
}

/** Terminal log-style education card with monospace entries and accent grade display. */
export function EducationCard({ education, index = 0 }: EducationCardProps) {
  return (
    <Card index={index}>
      <h2 className="section-label mb-4">Education</h2>
      <div className="space-y-4">
        {education.map((edu, i) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-foreground">{edu.degree}</h3>
              <span className="shrink-0 rounded-none border border-accent/20 px-2 py-0.5 text-xs text-muted">
                {edu.year}
              </span>
            </div>
            <p className="text-sm text-muted">{edu.institution}</p>
            <p className="text-sm text-foreground/55">{edu.location}</p>
            {edu.grade && (
              <p className="mt-1 text-sm font-medium text-accent">{edu.grade}</p>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
