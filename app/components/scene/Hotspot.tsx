"use client";

import { useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { useFocusStore, type Zone } from "@/app/store/useFocusStore";
import { TUNING } from "@/app/components/scene/devTuning";

interface HotspotProps {
  zone: Zone;
  position: [number, number, number];
  /** Box hit-area size [w, h, d]. */
  size: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Invisible box that focuses the camera on `zone` when clicked. Updates the
 * hovered state (cursor + scene highlight) on pointer enter/leave. Only active
 * once the drive-in has finished and we're at the idle view.
 */
export function Hotspot({ zone, position, size, rotation }: HotspotProps) {
  const ready = useFocusStore((s) => s.ready);
  const focus = useFocusStore((s) => s.focus);
  const setFocus = useFocusStore((s) => s.setFocus);
  const setHovered = useFocusStore((s) => s.setHovered);
  const [hovering, setHovering] = useState(false);

  const active = ready && focus === "idle";

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (!active) return;
    e.stopPropagation();
    setHovering(true);
    setHovered(zone);
    document.body.style.cursor = "pointer";
  };

  const onOut = () => {
    setHovering(false);
    setHovered(null);
    document.body.style.cursor = "auto";
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!active) return;
    e.stopPropagation();
    document.body.style.cursor = "auto";
    setFocus(zone);
  };

  return (
    <mesh
      position={position}
      rotation={rotation}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
      visible={TUNING.showHotspots}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial
        color={hovering ? "#ff5a3c" : "#3ca6ff"}
        transparent
        opacity={TUNING.showHotspots ? 0.25 : 0}
        depthWrite={false}
      />
    </mesh>
  );
}
