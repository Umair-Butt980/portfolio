"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Clean studio-garage lighting: a warm key from above, cool fill, red rim
 * accents either side of the car, plus an environment map for reflections.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} />

      {/* Key light — overhead garage gantry. */}
      <directionalLight
        position={[4, 9, 5]}
        intensity={2.2}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-8, 8, 8, -8, 0.1, 30]}
        />
      </directionalLight>

      {/* Cool fill from the opposite side. */}
      <directionalLight position={[-6, 5, -4]} intensity={0.5} color="#9bc2ff" />

      {/* Red rim accents — the F1 mood. */}
      <pointLight position={[-5, 2, 2]} intensity={30} color="#ff2d2d" distance={14} decay={2} />
      <pointLight position={[5, 2, -2]} intensity={28} color="#ff5a3c" distance={14} decay={2} />

      {/* Headlight-ish kick from the front. */}
      <spotLight
        position={[0, 3.2, 7]}
        angle={0.7}
        penumbra={0.8}
        intensity={18}
        color="#ffffff"
        distance={20}
      />

      {/* Procedural studio environment — baked once, locally, with no network
          fetch (a CDN preset would suspend the whole canvas if it hung). Gives
          the car clean reflections. */}
      <Environment resolution={256} frames={1} environmentIntensity={0.4}>
        {/* Soft white ceiling box */}
        <Lightformer
          intensity={2.4}
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[12, 12, 1]}
          color="#ffffff"
        />
        {/* Cool key from the front */}
        <Lightformer
          intensity={1.4}
          position={[0, 3, 6]}
          scale={[8, 6, 1]}
          color="#bcd4ff"
        />
        {/* Red accent rims */}
        <Lightformer
          intensity={1.6}
          position={[-6, 2, 1]}
          scale={[3, 6, 1]}
          color="#ff2d2d"
        />
        <Lightformer
          intensity={1.2}
          position={[6, 2, -1]}
          scale={[3, 6, 1]}
          color="#ff7a3c"
        />
      </Environment>
    </>
  );
}
