"use client";

import { motion } from "framer-motion";
import {
  ACHIEVEMENTS,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
} from "@/app/data/skills";

export function ExperienceTimeline() {
  return (
    <div className="hud-panel pointer-events-auto flex max-h-[78vh] w-[min(94vw,44rem)] flex-col rounded-2xl">
      <div className="border-b border-white/10 p-7 pb-5">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-accent text-glow">
          Race History
        </p>
        <h2 className="mt-2 text-2xl font-semibold">{PROFILE.name}</h2>
        <p className="mt-1 text-sm text-muted">{PROFILE.summary}</p>
      </div>

      <div className="no-scrollbar overflow-y-auto p-7 pt-6">
        <ol className="relative border-l border-white/12 pl-6">
          {EXPERIENCE.map((job, i) => (
            <motion.li
              key={`${job.company}-${job.period}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.35 }}
              className="mb-8 last:mb-0"
            >
              <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border border-accent bg-background" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-base font-semibold text-foreground">
                  {job.role}{" "}
                  <span className="text-accent">· {job.company}</span>
                </h3>
                <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                  {job.period}
                </span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {job.highlights.map((h, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>

        <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-accent">
              Achievements
            </p>
            <ul className="mt-2 space-y-1.5">
              {ACHIEVEMENTS.map((a) => (
                <li key={a} className="text-sm text-muted">
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-accent">
              Education
            </p>
            <p className="mt-2 text-sm text-foreground">{EDUCATION.degree}</p>
            <p className="text-sm text-muted">
              {EDUCATION.school} · {EDUCATION.year}
            </p>
          </div>
        </div>

        <a
          href="/skills/skills.md"
          download
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:bg-accent/25"
        >
          ↓ Download Résumé
        </a>
      </div>
    </div>
  );
}
