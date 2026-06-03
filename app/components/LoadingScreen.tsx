"use client";

import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useFocusStore } from "@/app/store/useFocusStore";
import { PROFILE } from "@/app/data/skills";

const LIGHTS = [0, 1, 2, 3, 4];

export function LoadingScreen() {
  const { progress, active } = useProgress();
  const started = useFocusStore((s) => s.started);
  const start = useFocusStore((s) => s.start);

  // Once the user has entered the garage, the overlay is gone for good.
  const visible = !started;
  const loaded = !active && progress >= 100;
  // Map progress onto the 5 starting lights.
  const litLights = Math.round((progress / 100) * LIGHTS.length);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-background"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-muted">
              Pit Lane Open
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              {PROFILE.name}
            </h1>
            <p className="text-sm uppercase tracking-[0.3em] text-accent text-glow">
              {PROFILE.title}
            </p>
          </div>

          {/* F1 starting gantry */}
          <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
            {LIGHTS.map((i) => {
              const on = loaded ? false : i < litLights;
              return (
                <span
                  key={i}
                  className="h-7 w-7 rounded-full transition-all duration-300"
                  style={{
                    background: loaded
                      ? "#19c37d"
                      : on
                        ? "var(--accent)"
                        : "rgba(255,255,255,0.08)",
                    boxShadow: loaded
                      ? "0 0 18px #19c37d"
                      : on
                        ? "0 0 18px var(--accent-glow)"
                        : "none",
                  }}
                />
              );
            })}
          </div>

          {loaded ? (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={start}
              className="group rounded-full border border-accent/60 bg-accent/10 px-10 py-4 font-mono text-sm uppercase tracking-[0.3em] text-foreground transition-colors hover:bg-accent/25"
            >
              Start Engine
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </motion.button>
          ) : (
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              Warming up tyres… {Math.round(progress)}%
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
