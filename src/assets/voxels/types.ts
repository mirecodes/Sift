/** [x, y, z, paletteIndex]. Models face +Z, origin at bottom center (see DESIGN.md 16). */
export type Voxel = readonly [x: number, y: number, z: number, paletteIndex: number];

export interface VoxelModel {
  /** Bounding box in voxels: [width (x), height (y), depth (z)]. */
  size: readonly [number, number, number];
  palette: Readonly<Record<number, string>>;
  voxels: readonly Voxel[];
}
