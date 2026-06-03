"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useFocusStore } from "@/app/store/useFocusStore";
import {
  CAMERA_POSES,
  CAMERA_TWEEN_DURATION,
  IDLE_ORBIT,
} from "@/app/constants/cameraPoses";

/**
 * Owns the camera. At idle it gently auto-orbits with a touch of mouse
 * parallax; on focus change it GSAP-tweens position + lookAt to the focused
 * pose. Returning to idle resumes the orbit from wherever the camera lands.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const focus = useFocusStore((s) => s.focus);

  const target = useRef(new THREE.Vector3(...CAMERA_POSES.idle.target));
  const tweening = useRef(false);
  const angle = useRef(Math.atan2(CAMERA_POSES.idle.position[2], CAMERA_POSES.idle.position[0]));
  const pointer = useRef({ x: 0, y: 0 });

  // Track pointer for subtle idle parallax.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const pose = CAMERA_POSES[focus];
    tweening.current = true;

    const posTween = gsap.to(camera.position, {
      x: pose.position[0],
      y: pose.position[1],
      z: pose.position[2],
      duration: CAMERA_TWEEN_DURATION,
      ease: "power3.inOut",
    });
    const targetTween = gsap.to(target.current, {
      x: pose.target[0],
      y: pose.target[1],
      z: pose.target[2],
      duration: CAMERA_TWEEN_DURATION,
      ease: "power3.inOut",
      onComplete: () => {
        tweening.current = false;
        if (focus === "idle") {
          // Resume orbit from the angle we actually landed on.
          angle.current = Math.atan2(camera.position.z, camera.position.x);
        }
      },
    });

    return () => {
      posTween.kill();
      targetTween.kill();
    };
  }, [focus, camera]);

  useFrame((_, dt) => {
    if (focus === "idle" && !tweening.current) {
      angle.current += IDLE_ORBIT.speed * dt;
      const px = pointer.current.x * 0.6;
      const py = pointer.current.y * 0.4;
      camera.position.x = Math.cos(angle.current) * IDLE_ORBIT.radius + px;
      camera.position.z = Math.sin(angle.current) * IDLE_ORBIT.radius;
      camera.position.y = IDLE_ORBIT.height - py;
    }
    camera.lookAt(target.current);
  });

  return null;
}
