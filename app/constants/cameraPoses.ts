import type { Focus } from "@/app/store/useFocusStore";

export interface CameraPose {
  /** Camera world position. */
  position: [number, number, number];
  /** Point the camera looks at. */
  target: [number, number, number];
}

// Scene convention:
//   - Car is normalized & centered at the origin.
//   - Car length runs along Z; nose points toward +Z (the garage opening / camera).
//   - Rear of the car faces -Z (the back wall).
//   - Pit board lives on the left wall at roughly x = -4.5.
// Values tuned live with leva, then baked here. Keep in sync with hotspot
// placement in Car.tsx / PitBoard.tsx.
export const CAMERA_POSES: Record<Focus, CameraPose> = {
  idle: {
    position: [5.2, 2.8, 6.2],
    target: [0, 0.55, 0],
  },
  frontend: {
    position: [0, 1.15, 5.4],
    target: [0, 0.55, 1.6],
  },
  backend: {
    position: [0, 1.25, -5.4],
    target: [0, 0.55, -1.6],
  },
  steering: {
    position: [0, 1.35, 2.1],
    target: [0, 0.95, 0.2],
  },
  experience: {
    position: [-1.4, 1.7, 3.0],
    target: [-4.5, 1.6, 0],
  },
};

// Idle camera gently orbits around this radius/height.
export const IDLE_ORBIT = {
  radius: Math.hypot(CAMERA_POSES.idle.position[0], CAMERA_POSES.idle.position[2]),
  height: CAMERA_POSES.idle.position[1],
  speed: 0.05, // radians/sec
};

export const CAMERA_TWEEN_DURATION = 1.25; // seconds
