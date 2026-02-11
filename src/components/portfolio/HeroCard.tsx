"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { SocialLinks } from "./SocialLinks";
import type { PersonalInfo } from "@/types/database";

interface HeroCardProps {
  info: PersonalInfo;
}

/** Terminal-style hero card with command output sections, blinking cursor, and CRT aesthetic. */
export function HeroCard({ info }: HeroCardProps) {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <Card colSpan={2} rowSpan={2} className="flex flex-col justify-start gap-5 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-5"
      >
        {/* $ whoami */}
        <motion.div variants={itemVariants}>
          <div className="terminal-cmd mb-1 text-xs">whoami</div>
          <div className="pl-2">
            <h1 className="text-2xl font-bold text-accent lg:text-3xl">
              {info.full_name}
              <span className="animate-cursor-blink ml-1 inline-block text-accent">_</span>
            </h1>
            <p className="mt-0.5 text-sm text-muted">{info.title}</p>
          </div>
        </motion.div>

        {/* $ cat about.txt */}
        <motion.div variants={itemVariants}>
          <div className="terminal-cmd mb-1 text-xs">cat about.txt</div>
          <p className="pl-2 text-sm leading-relaxed text-foreground/80">{info.bio}</p>
        </motion.div>

        {/* $ uptime */}
        <motion.div variants={itemVariants}>
          <div className="terminal-cmd mb-1 text-xs">uptime</div>
          <div className="pl-2 flex items-center gap-2 text-sm">
            <span className="h-1.5 w-1.5 animate-[status-blink_2s_ease-in-out_infinite] rounded-full bg-accent inline-block" />
            <span className="text-foreground">Available for opportunities</span>
            <span className="text-muted text-xs">[ONLINE]</span>
          </div>
        </motion.div>

        {/* $ ./links */}
        <motion.div variants={itemVariants}>
          <div className="terminal-cmd mb-2 text-xs">./links</div>
          <div className="pl-2 flex flex-wrap items-center gap-3">
            <SocialLinks
              linkedin_url={info.linkedin_url}
              github_url={info.github_url}
              email={info.email}
            />
            {info.resume_url && (
              <a
                href={info.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-accent/40 bg-accent/5 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_15px_-3px_var(--glow-accent)]"
              >
                [Resume]
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
}
