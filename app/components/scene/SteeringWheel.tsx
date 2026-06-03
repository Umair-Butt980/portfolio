"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FittedModel } from "@/app/components/scene/FittedModel";
import { useFocusStore } from "@/app/store/useFocusStore";

const WHEEL_URL = "/models/optimized/mclaren_formula_1_steering_wheel.glb";

/**
 * The McLaren wheel, floated in front of the cockpit. It scales up when the
 * steering view is focused and shrinks away otherwise, so clicking the wheel
 * reads as "zoom to a bigger steering wheel".
 */
export function SteeringWheel() {
  const group = useRef<THREE.Group>(null);
  const focus = useFocusStore((s) => s.focus);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const target = focus === "steering" ? 1 : 0;
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent lerp
    const next = THREE.MathUtils.lerp(g.scale.x, target, k);
    g.scale.setScalar(next);
    g.visible = next > 0.01;
    // Idle spin-in flourish while focused.
    if (focus === "steering") g.rotation.z += dt * 0.05;
    else g.rotation.z = 0;
  });

  return (
    <group
      ref={group}
      position={[0, 0.98, 0.78]}
      rotation={[-0.22, 0, 0]}
      scale={0}
      visible={false}
    >
      <Suspense fallback={null}>
        <FittedModel url={WHEEL_URL} fit={1.15} groundize={false} />
      </Suspense>
    </group>
  );
}
