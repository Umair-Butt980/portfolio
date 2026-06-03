"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFocusStore } from "@/app/store/useFocusStore";
import { SKILL_CATEGORIES } from "@/app/data/skills";
import { SkillPanel } from "@/app/components/hud/SkillPanel";
import { SteeringOverlay } from "@/app/components/hud/SteeringOverlay";
import { ExperienceTimeline } from "@/app/components/hud/ExperienceTimeline";
import { BackButton } from "@/app/components/hud/BackButton";

export function Hud() {
  const started = useFocusStore((s) => s.started);
  const ready = useFocusStore((s) => s.ready);
  const focus = useFocusStore((s) => s.focus);
  const muted = useFocusStore((s) => s.muted);
  const toggleMute = useFocusStore((s) => s.toggleMute);
  const exit = useFocusStore((s) => s.exit);

  // Global Escape → back to idle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focus !== "idle") exit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, exit]);

  if (!started) return null;

  const focused = focus !== "idle";

  return (
    <div className="pointer-events-none fixed inset-0 z-30 select-none">
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-7">
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <BackButton />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleMute}
          className="pointer-events-auto ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground backdrop-blur transition-colors hover:border-accent/60"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Centre overlay area */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {focus === "frontend" && (
            <Fade key="frontend">
              <SkillPanel category={SKILL_CATEGORIES.frontend} />
            </Fade>
          )}
          {focus === "backend" && (
            <Fade key="backend">
              <SkillPanel category={SKILL_CATEGORIES.backend} align="right" />
            </Fade>
          )}
          {focus === "steering" && (
            <Fade key="steering">
              <SteeringOverlay />
            </Fade>
          )}
          {focus === "experience" && (
            <Fade key="experience">
              <ExperienceTimeline />
            </Fade>
          )}
        </AnimatePresence>
      </div>

      {/* Idle hint */}
      <AnimatePresence>
        {ready && focus === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-x-0 bottom-7 flex justify-center"
          >
            <p className="rounded-full border border-white/10 bg-black/40 px-5 py-2.5 text-center font-mono text-[0.7rem] uppercase tracking-[0.25em] text-muted backdrop-blur">
              Click the car · nose = frontend · rear = backend · wheel = more ·
              board = experience
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="pointer-events-none flex w-full justify-center"
    >
      {children}
    </motion.div>
  );
}
