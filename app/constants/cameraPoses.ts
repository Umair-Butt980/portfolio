import type { Focus } from "@/app/store/useFocusStore";

export interface CameraPose {
  /** Camera world position. */
  position: [number, number, number];
  /** Point the camera looks at. */
  target: [number, number, number];
}

// Scene convention:
//   - Car is normalized & centered at the origin.
//   - Car length runs along Z; nose points toward +Z (the garage opening).
//   - Red Bull garage shell occupancy (triangle-sampled at camera height):
//     back counter cluster z ≤ -2.9 (x -4.2..3), pit-wall furniture row at
//     z 2.9..4.2 with a gap at x -1..0.8, side fixtures from x ≈ 6.5.
//     Free corridors: alongside the car (x ±1.5..5) and the front gap.
//   - Pit board stands at x = -4.5.
// Keep in sync with hotspot placement in Car.tsx / PitBoard.tsx and the
// CameraRig clamps.
export const CAMERA_POSES: Record<Focus, CameraPose> = {
  idle: {
    position: [4.0, 1.7, 2.0],
    target: [0, 0.6, 0],
  },
  frontend: {
    position: [1.4, 0.9, 2.9],
    target: [0, 0.5, 1.5],
  },
  backend: {
    position: [2.2, 1.5, -2.5],
    target: [0, 0.6, -1.4],
  },
  steering: {
    position: [0, 1.35, 2.1],
    target: [0, 0.95, 0.2],
  },
  experience: {
    position: [-1.2, 1.6, 2.6],
    target: [-4.5, 1.5, 0],
  },
};

export const CAMERA_TWEEN_DURATION = 1.25; // seconds
