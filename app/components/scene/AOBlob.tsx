"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { makeAOTexture } from "@/app/components/scene/textures/canvasTextures";

let sharedTexture: THREE.CanvasTexture | null = null;

/**
 * Fake ambient-occlusion blob dropped under a prop — glues downloaded models
 * to the floor for near-zero cost. One shared texture across all instances.
 */
export function AOBlob({
  position = [0, 0, 0] as [number, number, number],
  radius = 1,
  opacity = 0.5,
}: {
  position?: [number, number, number];
  radius?: number;
  opacity?: number;
}) {
  const texture = useMemo(() => {
    if (!sharedTexture) sharedTexture = makeAOTexture();
    return sharedTexture;
  }, []);

  return (
    <mesh
      position={[position[0], position[1] + 0.015, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[radius * 2, radius * 2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        color="#000000"
      />
    </mesh>
  );
}
