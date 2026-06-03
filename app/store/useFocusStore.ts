import { create } from "zustand";

// Camera focus targets. "idle" is the default orbiting hero view.
export type Focus =
  | "idle"
  | "frontend"
  | "backend"
  | "steering"
  | "experience";

export type Zone = Exclude<Focus, "idle">;

interface FocusState {
  /** User has clicked "Start Engine" — unlocks audio + drive-in. */
  started: boolean;
  /** Drive-in animation finished — interactions become live. */
  ready: boolean;
  focus: Focus;
  /** Hovered hotspot, for cursor + highlight feedback. */
  hovered: Zone | null;
  muted: boolean;

  start: () => void;
  setReady: () => void;
  setFocus: (focus: Focus) => void;
  exit: () => void;
  setHovered: (zone: Zone | null) => void;
  toggleMute: () => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  started: false,
  ready: false,
  focus: "idle",
  hovered: null,
  muted: false,

  start: () => set({ started: true }),
  setReady: () => set({ ready: true }),
  setFocus: (focus) => set({ focus }),
  exit: () => set({ focus: "idle" }),
  setHovered: (hovered) => set({ hovered }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
}));
