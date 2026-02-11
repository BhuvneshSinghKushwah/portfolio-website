"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  index?: number;
}

/** CRT-style bento grid card with scroll-triggered staggered reveal and green glow on hover. */
export function Card({ children, className = "", colSpan = 1, rowSpan = 1, index = 0 }: CardProps) {
  const spanClasses = [
    colSpan === 2 ? "md:col-span-2" : "",
    rowSpan === 2 ? "md:row-span-2" : "",
  ].join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      className={`crt-card rounded-sm p-6 ${spanClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
}
