"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, ContactShadows, AdaptiveDpr } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { CAMERA_POSES } from "@/app/constants/cameraPoses";
import { PALETTE } from "@/app/constants/palette";
import { CameraRig } from "@/app/components/scene/CameraRig";
import { Lighting } from "@/app/components/scene/Lighting";
import { Garage } from "@/app/components/scene/Garage";
import { Car } from "@/app/components/scene/Car";
import { SteeringWheel } from "@/app/components/scene/SteeringWheel";
import { PitBoard } from "@/app/components/scene/PitBoard";
import { Effects } from "@/app/components/scene/Effects";
import { TUNING } from "@/app/components/scene/devTuning";

// Preload everything so the loading screen reflects real download progress.
const MODELS = [
  "/models/optimized/lotus_renault_f1_car_free_download.glb",
  "/models/optimized/mclaren_formula_1_steering_wheel.glb",
  "/models/optimized/car_mechanic.glb",
  "/models/optimized/tyre_holder_2023.glb",
  "/models/optimized/pit_board.glb",
  "/models/optimized/red_bull_f1_garage.glb",
];
MODELS.forEach((url) => useGLTF.preload(url, "/draco/"));

export function ExperienceCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        // Lets headless/automated screenshots read back the WebGL frame.
        preserveDrawingBuffer: TUNING.screenshotMode,
      }}
      camera={{
        position: CAMERA_POSES.idle.position,
        fov: 42,
        near: 0.1,
        far: 100,
      }}
    >
      <color attach="background" args={[PALETTE.bgNight]} />
      <fog attach="fog" args={[PALETTE.bgNight, 10, 26]} />

      <CameraRig />
      <Lighting />

      <Suspense fallback={null}>
        <Garage />
        <Car />
        <SteeringWheel />
        <PitBoard />
      </Suspense>

      <ContactShadows
        position={[0, 0.02, 0]}
        scale={12}
        blur={2.6}
        far={6}
        opacity={0.55}
        resolution={512}
      />

      <Effects enabled={TUNING.enableEffects} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
