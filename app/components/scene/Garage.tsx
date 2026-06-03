"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { Suspense } from "react";
import { FittedModel } from "@/app/components/scene/FittedModel";

const MODELS = {
  mechanic: "/models/optimized/car_mechanic.glb",
  tyres: "/models/optimized/tyre_holder_2023.glb",
};

/** The pit-garage environment: reflective floor, walls, ceiling and decor. */
export function Garage() {
  return (
    <group>
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          resolution={1024}
          mirror={0.45}
          mixBlur={8}
          mixStrength={1.2}
          blur={[300, 100]}
          roughness={0.85}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#0a0c12"
          metalness={0.6}
        />
      </mesh>

      {/* Pit-lane centre line under the car */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.25, 30]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 6, -10]} receiveShadow>
        <planeGeometry args={[40, 18]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.95} />
      </mesh>
      <mesh position={[-10, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 18]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.95} />
      </mesh>
      <mesh position={[10, 6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 18]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.95} />
      </mesh>

      {/* Ceiling light strips (emissive bars — picked up by bloom) */}
      {[-3, 0, 3].map((x) => (
        <mesh key={x} position={[x, 7.4, -1]}>
          <boxGeometry args={[0.4, 0.1, 9]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={2.2}
          />
        </mesh>
      ))}

      {/* Decor models */}
      <Suspense fallback={null}>
        <FittedModel
          url={MODELS.tyres}
          fit={3.2}
          position={[-6.5, 0, -5.5]}
          rotation={[0, Math.PI / 5, 0]}
        />
        <FittedModel
          url={MODELS.mechanic}
          fit={2.2}
          position={[4.6, 0, 2.4]}
          rotation={[0, -Math.PI / 1.6, 0]}
        />
      </Suspense>
    </group>
  );
}
