"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { PALETTE } from "@/app/constants/palette";

/**
 * One warm dominant + one accent. The key is a spotlight pooled on the car —
 * a light pool reads "garage lamp", a directional reads "sun in a void".
 * Cyan never appears here; it is reserved for interactive hover feedback.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.15} color={PALETTE.keyWarm} />

      {/* Key — halogen gantry lamp over the car. Sole shadow caster. */}
      <spotLight
        position={[2.5, 3.9, 1.5]}
        angle={0.85}
        penumbra={0.7}
        intensity={90}
        color={PALETTE.keyWarm}
        distance={18}
        decay={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      />

      {/* Dim neutral fill so shadow sides don't go to pure black. */}
      <directionalLight position={[-6, 5, -4]} intensity={0.25} color="#cfc8bd" />

      {/* Accent rims low behind the car for silhouette. */}
      <pointLight
        position={[-4, 1.2, -3]}
        intensity={12}
        color={PALETTE.accent}
        distance={12}
        decay={2}
      />
      <pointLight
        position={[3.8, 0.6, -2.2]}
        intensity={7}
        color={PALETTE.accent}
        distance={10}
        decay={2}
      />

      {/* Procedural studio environment — baked once, locally, with no network
          fetch (a CDN preset would suspend the whole canvas if it hung). */}
      <Environment resolution={256} frames={1} environmentIntensity={0.5}>
        {/* Warm ceiling panel */}
        <Lightformer
          intensity={2.2}
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
          color={PALETTE.keyWarm}
        />
        {/* Single dim accent side panel */}
        <Lightformer
          intensity={0.8}
          position={[-6, 2, 0]}
          scale={[3, 5, 1]}
          color={PALETTE.accent}
        />
      </Environment>
    </>
  );
}
