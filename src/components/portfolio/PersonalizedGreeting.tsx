"use client";

import { motion } from "framer-motion";

interface PersonalizedGreetingProps {
  name: string;
  company?: string;
}

/** Animated greeting banner shown when visiting via a trackable link with name metadata. */
export function PersonalizedGreeting({ name, company }: PersonalizedGreetingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card relative mb-8 overflow-hidden rounded-2xl px-6 py-4 text-center"
    >
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-accent to-purple-500" />
      <p className="text-lg font-medium text-foreground">
        Hi {name}!{" "}
        {company && (
          <span className="text-muted">
            Thanks for checking out my portfolio from {company}.
          </span>
        )}
      </p>
    </motion.div>
  );
}
