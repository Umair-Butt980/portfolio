"use client";

import { Suspense } from "react";
import { FittedModel } from "@/app/components/scene/FittedModel";
import { Hotspot } from "@/app/components/scene/Hotspot";

const PIT_BOARD_URL = "/models/optimized/pit_board.glb";

/** Pit board standing against the left wall — opens the experience timeline. */
export function PitBoard() {
  return (
    <group position={[-4.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Suspense fallback={null}>
        <FittedModel url={PIT_BOARD_URL} fit={3} />
      </Suspense>
      <Hotspot zone="experience" position={[0, 1.6, 0]} size={[2, 2.2, 1]} />
    </group>
  );
}
