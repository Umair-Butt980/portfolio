// Single source of truth for scene colors. One warm dominant + one accent,
// with cyan reserved exclusively for interactive feedback so "clickable"
// reads instantly against the warm scene.
export const PALETTE = {
  /** Warm near-black — background and fog. */
  bgNight: "#0c0a09",
  /** ~3200K halogen garage key light. */
  keyWarm: "#ffd9a8",
  /** The one accent (signage, rims, markers at rest). */
  accent: "#ff6b35",
  /** Interactive hover feedback only. */
  hover: "#4cc9f0",
  /** Floor concrete base. */
  concrete: "#2b2724",
  /** Wall panels. */
  wallDark: "#17140f",
} as const;
