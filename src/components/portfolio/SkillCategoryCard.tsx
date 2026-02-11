"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import type { Skill } from "@/types/database";

interface SkillCategoryCardProps {
  skill: Skill;
  index?: number;
}

/** Terminal-style skill card: `$ ls skills/category/` header with monospace item list. */
export function SkillCategoryCard({ skill, index = 0 }: SkillCategoryCardProps) {
  return (
    <Card index={index}>
      <h3 className="terminal-cmd mb-3 text-xs">ls skills/{skill.category.toLowerCase().replace(/\s+/g, "-")}/</h3>
      <div className="flex flex-wrap gap-1.5">
        {skill.items.map((item, i) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="rounded-none border border-accent/20 bg-accent/5 px-2 py-0.5 text-sm text-foreground/75 transition-colors hover:border-accent/40 hover:text-accent"
          >
            › {item}
          </motion.span>
        ))}
      </div>
    </Card>
  );
}
