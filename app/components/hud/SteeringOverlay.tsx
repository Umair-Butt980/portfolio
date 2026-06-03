"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SKILL_CATEGORIES,
  STEERING_CATEGORY_IDS,
  type SkillCategoryId,
} from "@/app/data/skills";
import { SkillPanel } from "@/app/components/hud/SkillPanel";

export function SteeringOverlay() {
  const [selected, setSelected] = useState<SkillCategoryId | null>(null);

  return (
    <div className="pointer-events-none flex w-full flex-col items-center gap-8">
      <div className="text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-accent text-glow">
          On the Wheel
        </p>
        <p className="mt-1 text-sm text-muted">
          Pick a control to see the skills behind it.
        </p>
      </div>

      {/* Wheel buttons */}
      <div className="pointer-events-auto grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STEERING_CATEGORY_IDS.map((id) => {
          const cat = SKILL_CATEGORIES[id];
          const active = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(active ? null : id)}
              className={`group relative flex h-24 w-32 flex-col items-center justify-center rounded-xl border px-3 text-center transition-all ${
                active
                  ? "border-accent bg-accent/20"
                  : "border-white/12 bg-black/40 hover:border-accent/50 hover:bg-accent/10"
              }`}
            >
              <span
                className={`mb-2 h-2.5 w-2.5 rounded-full transition-all ${
                  active ? "bg-accent" : "bg-white/20 group-hover:bg-accent/70"
                }`}
                style={{
                  boxShadow: active ? "0 0 14px var(--accent-glow)" : "none",
                }}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <SkillPanel category={SKILL_CATEGORIES[selected]} align="left" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
