"use client";

import { useEffect, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import type CameraControlsImpl from "camera-controls";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFocusStore } from "@/app/store/useFocusStore";
import { CAMERA_POSES } from "@/app/constants/cameraPoses";

// Seconds of no interaction before the idle view starts drifting again.
const DRIFT_DELAY = 8;
const DRIFT_SPEED = 0.03; // rad/s

// Keep the user inside the free bay volume (see cameraPoses.ts): short of
// the pit-wall counter in front, clear of the plinth behind. Applied only
// while idle — focus poses (e.g. backend, behind the car) sit outside them,
// so flights run unclamped and the clamps come back on return.
const IDLE_CLAMPS = {
  minDistance: 3.0,
  maxDistance: 4.6,
  minPolarAngle: 0.8,
  maxPolarAngle: 1.5,
  minAzimuthAngle: 0.35,
  maxAzimuthAngle: 1.45,
};

function relaxClamps(c: CameraControlsImpl) {
  c.minDistance = 0.5;
  c.maxDistance = 12;
  c.minPolarAngle = 0;
  c.maxPolarAngle = Math.PI;
  c.minAzimuthAngle = -Infinity;
  c.maxAzimuthAngle = Infinity;
}

function applyIdleClamps(c: CameraControlsImpl) {
  Object.assign(c, IDLE_CLAMPS);
}

/**
 * Owns the camera. At idle the user can drag-orbit within clamps (with a slow
 * auto-drift after a few seconds of inactivity); focusing a zone flies the
 * camera to its pose and locks controls until the user exits back to idle.
 */
export function CameraRig() {
  const controls = useRef<CameraControlsImpl | null>(null);
  const focus = useFocusStore((s) => s.focus);
  const ready = useFocusStore((s) => s.ready);

  const idleTime = useRef(0);
  const mounted = useRef(false);
  const reducedMotion = useRef(false);
  // Where the user left the idle view, restored when they exit a zone.
  const lastIdle = useRef({
    position: new THREE.Vector3(...CAMERA_POSES.idle.position),
    target: new THREE.Vector3(...CAMERA_POSES.idle.target),
  });
  const prevFocus = useRef<string>("idle");

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Drag-orbit only; panning would let users truck out of the diorama.
    c.mouseButtons.right = 0;
    c.mouseButtons.middle = 0;
    c.touches.three = 0;

    const onControlStart = () => {
      idleTime.current = 0;
    };
    c.addEventListener("controlstart", onControlStart);

    // Dev-only: lets scripts/shoot.mjs frame arbitrary calibration shots.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__portfolioCamera = {
        set: (
          px: number, py: number, pz: number,
          tx: number, ty: number, tz: number
        ) => c.setLookAt(px, py, pz, tx, ty, tz, false),
        get: () => {
          const p = c.getPosition(new THREE.Vector3());
          const t = c.getTarget(new THREE.Vector3());
          return { position: p.toArray(), target: t.toArray() };
        },
      };
    }
    return () => c.removeEventListener("controlstart", onControlStart);
  }, []);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const animate = mounted.current && !reduced;
    mounted.current = true;

    if (focus === "idle") {
      const { position, target } = lastIdle.current;
      c.normalizeRotations();
      c.setLookAt(
        position.x, position.y, position.z,
        target.x, target.y, target.z,
        animate
      ).then(() => {
        // Clamps come back only once we've flown inside the bay again,
        // otherwise they'd snap the camera mid-flight.
        if (useFocusStore.getState().focus === "idle") applyIdleClamps(c);
      });
      c.enabled = true;
    } else {
      if (prevFocus.current === "idle") {
        c.getPosition(lastIdle.current.position);
        c.getTarget(lastIdle.current.target);
      }
      c.enabled = false;
      relaxClamps(c);
      const pose = CAMERA_POSES[focus];
      c.setLookAt(...pose.position, ...pose.target, animate);
    }
    prevFocus.current = focus;
    idleTime.current = 0;
  }, [focus]);

  // Lock controls until the drive-in has finished.
  useEffect(() => {
    const c = controls.current;
    if (c) c.enabled = ready && focus === "idle";
  }, [ready, focus]);

  const driftDir = useRef(1);
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c || focus !== "idle" || !ready || reducedMotion.current) return;
    if (c.currentAction !== 0) return; // user is actively dragging
    idleTime.current += dt;
    if (idleTime.current > DRIFT_DELAY) {
      // Ping-pong between the azimuth clamps instead of sticking at one end.
      if (c.azimuthAngle >= IDLE_CLAMPS.maxAzimuthAngle - 0.05) driftDir.current = -1;
      if (c.azimuthAngle <= IDLE_CLAMPS.minAzimuthAngle + 0.05) driftDir.current = 1;
      c.azimuthAngle += DRIFT_SPEED * driftDir.current * dt;
    }
  });

  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={0.25}
      {...IDLE_CLAMPS}
    />
  );
}
