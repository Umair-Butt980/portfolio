"use client";

import { motion } from "framer-motion";
import type { SkillCategory } from "@/app/data/skills";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function SkillPanel({
  category,
  align = "left",
}: {
  category: SkillCategory;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`hud-panel pointer-events-auto w-[min(92vw,30rem)] rounded-2xl p-7 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-accent text-glow">
        {category.label}
      </p>
      <p className="mt-2 text-sm text-muted">{category.blurb}</p>

      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className={`mt-6 flex flex-wrap gap-2.5 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        {category.skills.map((skill) => (
          <motion.li
            key={skill}
            variants={item}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-foreground"
          >
            {skill}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
