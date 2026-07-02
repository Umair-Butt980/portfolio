"use client";

import { MeshReflectorMaterial, useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { FittedModel } from "@/app/components/scene/FittedModel";
import { AOBlob } from "@/app/components/scene/AOBlob";
import { normalizeMaterials } from "@/app/components/scene/materials";
import { makeFloorTextures } from "@/app/components/scene/textures/canvasTextures";
import { PALETTE } from "@/app/constants/palette";

const MODELS = {
  shell: "/models/optimized/red_bull_f1_garage.glb",
  mechanic: "/models/optimized/car_mechanic.glb",
  tyres: "/models/optimized/tyre_holder_2023.glb",
};

// The Red Bull garage GLB is authored at ~10 units per meter with its floor
// at y = -6. Scale to meters and lift so the floor sits on y = 0; slide the
// interior so the pit bay (monitors/tool carts) wraps the car at the origin.
const SHELL_SCALE = 0.1;
// Slide the building so the open pit bay (the Red Bull floor decals) wraps
// the origin, where the hero car parks.
const SHELL_POSITION: [number, number, number] = [-1.3, 0.6, -4];
const SHELL_ROTATION: [number, number, number] = [0, 0, 0];

// Shell nodes hidden to clear the car bay.
const SHELL_HIDE = new Set<string>([]);

/** Pre-dressed pit-garage building used as the environment shell. */
function GarageShell() {
  const { scene } = useGLTF(MODELS.shell, "/draco/");
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    normalizeMaterials(c, { desaturate: 0.1, envMapIntensity: 0.3 });
    c.traverse((o) => {
      if (SHELL_HIDE.has(o.name)) o.visible = false;
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    return c;
  }, [scene]);

  return (
    <group
      position={SHELL_POSITION}
      rotation={SHELL_ROTATION}
      scale={SHELL_SCALE}
    >
      <primitive
        object={cloned}
        onClick={(e: { object: { name: string; parent: { name: string } | null }; point: THREE.Vector3; stopPropagation: () => void }) => {
          // TEMP debug: identify shell parts from automated clicks.
          console.error(
            "SHELL-HIT:", e.object.name,
            "parent:", e.object.parent?.name,
            "at:", e.point.toArray().map((v: number) => v.toFixed(2)).join(",")
          );
        }}
      />
    </group>
  );
}

/** The pit-garage environment: dressed shell, worn-concrete floor and decor. */
export function Garage() {
  const floorTextures = useMemo(() => makeFloorTextures(16, 12), []);

  return (
    <group>
      {/* Worn concrete + painted pit box over the shell floor. Reflections
          only show where the roughness map says the floor is polished. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <MeshReflectorMaterial
          map={floorTextures.map}
          roughnessMap={floorTextures.roughnessMap}
          resolution={512}
          mirror={0.15}
          mixBlur={6}
          mixStrength={0.5}
          blur={[200, 80]}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color={PALETTE.concrete}
          metalness={0}
        />
      </mesh>

      <Suspense fallback={null}>
        <GarageShell />
        <FittedModel
          url={MODELS.tyres}
          fit={2.2}
          position={[-5.2, 0, -3.2]}
          rotation={[0, Math.PI / 5, 0]}
        />
        <FittedModel
          url={MODELS.mechanic}
          fit={1.8}
          position={[3.1, 0, 0.6]}
          rotation={[0, -2.2, 0]}
        />
        <AOBlob position={[-5.2, 0, -3.2]} radius={1.4} />
        <AOBlob position={[3.1, 0, 0.6]} radius={0.9} opacity={0.45} />
      </Suspense>
    </group>
  );
}

useGLTF.preload(MODELS.shell, "/draco/");
