"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";

export type FittedModelProps = ThreeElements["group"] & {
  url: string;
  /** Target size of the longest bounding-box axis, in world units. */
  fit?: number;
  /** Drop the model so its base sits on y = 0 (after fitting). */
  groundize?: boolean;
  /** Cast/receive shadows on all meshes. */
  shadows?: boolean;
  /** Mesh/node names to hide and exclude from the fit (e.g. baked ground planes). */
  hideNames?: string[];
};

/**
 * Loads a (draco-compressed) GLB, recenters it, and uniformly scales it so its
 * longest axis equals `fit`, optionally resting it on the ground plane.
 *
 * The fit transform is applied to the inner group via JSX props (not an
 * imperative effect) so React/R3F preserve it across re-renders — an effect
 * would get clobbered to (0,0,0) whenever a parent re-renders, flinging
 * models with large intrinsic offsets off-stage.
 */
export function FittedModel({
  url,
  fit = 4,
  groundize = true,
  shadows = true,
  hideNames,
  children,
  ...props
}: FittedModelProps) {
  const { scene } = useGLTF(url, "/draco/");

  // Clone so the same GLB can be reused without sharing transforms.
  const cloned = useMemo(() => scene.clone(true), [scene]);

  const { scale, position } = useMemo(() => {
    const hidden = new Set(hideNames ?? []);
    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (hidden.has(o.name)) {
        o.visible = false;
        return;
      }
      if (shadows) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    // Measure only visible meshes (so baked ground planes don't skew the fit).
    cloned.position.set(0, 0, 0);
    cloned.scale.setScalar(1);
    cloned.updateWorldMatrix(true, true);
    const box = new THREE.Box3();
    const tmp = new THREE.Box3();
    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.visible || !mesh.geometry) return;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      tmp.copy(mesh.geometry.boundingBox!).applyMatrix4(mesh.matrixWorld);
      box.union(tmp);
    });

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const longest = Math.max(size.x, size.y, size.z) || 1;
    const s = fit / longest;
    const pos: [number, number, number] = [
      -center.x * s,
      groundize ? -box.min.y * s : -center.y * s,
      -center.z * s,
    ];
    return { scale: s, position: pos };
  }, [cloned, fit, groundize, shadows, hideNames]);

  return (
    <group {...props}>
      <group scale={scale} position={position}>
        <primitive object={cloned} />
      </group>
      {children}
    </group>
  );
}
