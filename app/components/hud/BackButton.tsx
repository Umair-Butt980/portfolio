"use client";

import { useFocusStore } from "@/app/store/useFocusStore";

export function BackButton() {
  const exit = useFocusStore((s) => s.exit);
  return (
    <button
      onClick={exit}
      className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground backdrop-blur transition-colors hover:border-accent/60 hover:bg-accent/15"
    >
      <span className="text-base leading-none">←</span> Back
      <span className="ml-1 hidden text-muted sm:inline">· Esc</span>
    </button>
  );
}
