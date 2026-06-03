"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { FittedModel } from "@/app/components/scene/FittedModel";
import { Hotspot } from "@/app/components/scene/Hotspot";
import { useFocusStore } from "@/app/store/useFocusStore";

const CAR_URL = "/models/optimized/lotus_renault_f1_car_free_download.glb";

// Car orientation/scale. The model's body runs along local X, so a -90° Y
// turn lays the length along Z with the nose toward +Z (garage opening).
// Object_2 (25x29 ground plane) and Object_5 (baked floor shadow) are hidden.
const CAR_FIT = 4.6;
const CAR_ROTATION: [number, number, number] = [0, -Math.PI / 2, 0];
const CAR_HIDE = ["Object_2", "Object_5"];

// Where the car enters from, down the pit lane (+Z), before settling at z = 0.
const DRIVE_IN_FROM_Z = 22;

export function Car() {
  const group = useRef<THREE.Group>(null);
  const started = useFocusStore((s) => s.started);
  const setReady = useFocusStore((s) => s.setReady);

  useEffect(() => {
    const g = group.current;
    if (!g || !started) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      g.position.set(0, 0, 0);
      setReady();
      return;
    }

    g.position.set(0, 0, DRIVE_IN_FROM_Z);
    const tl = gsap.timeline({ onComplete: () => setReady() });
    tl.to(g.position, { z: 0, duration: 2.4, ease: "power3.out" })
      // little brake-dip settle
      .to(g.rotation, { x: -0.015, duration: 0.18, ease: "power2.out" }, "-=0.4")
      .to(g.rotation, { x: 0, duration: 0.35, ease: "power2.inOut" });

    return () => {
      tl.kill();
    };
  }, [started, setReady]);

  return (
    <group ref={group} position={[0, 0, DRIVE_IN_FROM_Z]}>
      <FittedModel
        url={CAR_URL}
        fit={CAR_FIT}
        rotation={CAR_ROTATION}
        hideNames={CAR_HIDE}
      />

      {/* Interaction zones (invisible — tune via TUNING.showHotspots). */}
      {/* Front of the car → Frontend */}
      <Hotspot zone="frontend" position={[0, 0.5, 1.9]} size={[1.6, 1, 1.4]} />
      {/* Rear of the car → Backend */}
      <Hotspot zone="backend" position={[0, 0.6, -1.9]} size={[1.6, 1.2, 1.4]} />
      {/* Steering wheel / cockpit → categories */}
      <Hotspot zone="steering" position={[0, 0.85, 0.15]} size={[0.9, 0.7, 0.9]} />
    </group>
  );
}
