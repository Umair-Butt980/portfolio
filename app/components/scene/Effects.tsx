"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

/** Tasteful, perf-budgeted post: bloom on emissives + a soft vignette. */
export function Effects({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.75}
        luminanceSmoothing={0.2}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
    </EffectComposer>
  );
}
