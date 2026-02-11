"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import type { Project } from "@/types/database";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

/** Terminal-style project card with bracket tags, hover border glow, and monospace link arrows. */
export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <Card index={index} className="group flex flex-col justify-between">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
            {project.name}
          </h3>
          <span className="text-xs text-muted">{project.year}</span>
        </div>
        <p className="mb-1 text-sm text-accent/80">{project.tagline}</p>
        <p className="mb-3 text-sm leading-relaxed text-foreground/70">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-none border border-accent/20 bg-accent/5 px-2 py-0.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              [{tag}]
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        {project.github_url && (
          <motion.a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-muted transition-colors hover:text-accent"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            › github →
          </motion.a>
        )}
        {project.live_url && (
          <motion.a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-muted transition-colors hover:text-accent"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            › live →
          </motion.a>
        )}
      </div>
    </Card>
  );
}
