// Flip these on while tuning placement in the browser, then leave them off.
// Kept in one place so tuning visuals never ship enabled.
export const TUNING = {
  /** Render hotspot hit-boxes as translucent coloured cubes. */
  showHotspots: false,
  /** Keep the WebGL buffer readable for automated screenshots (scripts/shoot.mjs). */
  screenshotMode: false,
  /** Postprocessing (bloom/vignette). */
  enableEffects: true,
};
