import * as THREE from "three";

export interface NormalizeOptions {
  /** Uniform environment-map response so all props reflect alike. */
  envMapIntensity?: number;
  /** 0..1 saturation pull toward the scene palette. */
  desaturate?: number;
  /** Free assets often ship unrealistically shiny; clamp roughness up. */
  roughnessFloor?: number;
  /** Zero out stray emissives baked into downloaded assets. */
  killEmissive?: boolean;
}

const DEFAULTS: Required<NormalizeOptions> = {
  envMapIntensity: 0.35,
  desaturate: 0.15,
  roughnessFloor: 0.35,
  killEmissive: true,
};

/**
 * Makes disparate downloaded GLBs read as one art-directed set: identical
 * env-map response, narrowed saturation, no plastic-shiny outliers, no
 * surprise emissives. Materials are cloned per-instance first — GLTF-cache
 * clones share materials, so mutating in place would leak across instances.
 */
export function normalizeMaterials(
  root: THREE.Object3D,
  options?: NormalizeOptions
) {
  const opts = { ...DEFAULTS, ...options };
  const clonedByUuid = new Map<string, THREE.Material>();
  const hsl = { h: 0, s: 0, l: 0 };

  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    const patch = (mat: THREE.Material): THREE.Material => {
      const cached = clonedByUuid.get(mat.uuid);
      if (cached) return cached;
      const m = mat.clone();
      clonedByUuid.set(mat.uuid, m);

      const std = m as THREE.MeshStandardMaterial;
      if (std.isMeshStandardMaterial) {
        std.envMapIntensity = opts.envMapIntensity;
        std.roughness = Math.max(std.roughness, opts.roughnessFloor);
        if (opts.desaturate > 0) {
          std.color.getHSL(hsl);
          std.color.setHSL(hsl.h, hsl.s * (1 - opts.desaturate), hsl.l);
        }
        if (opts.killEmissive && std.emissiveIntensity !== 0) {
          // Keep genuinely emissive parts (screens/lights) only if the asset
          // authored an emissive map; kill flat emissive color washes.
          if (!std.emissiveMap) std.emissive.setScalar(0);
        }
        if (std.map) std.map.anisotropy = 4;
      }
      return m;
    };

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(patch)
      : patch(mesh.material);
  });
}
