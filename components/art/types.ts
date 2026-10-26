/**
 * A drawing built by scripts/art/build.mjs. Every item knows when it draws, as a start and end in 0..1.
 *   ["b", tone, outline, centerline, length, maskWidth, t0, t1]  a pen stroke
 *   ["f", tone, shape, t0, t1]                                   a filled shape
 *   ["t", tone, centerline, length, width, t0, t1]               the red thread
 * An optional last entry names how the item moves in the breeze ("curl", "wisp", "light").
 */
export type ArtItem =
  | ["b", string, string, string, number, number, number, number, string?]
  | ["f", string, string, number, number, string?]
  | ["t", string, string, number, number, number, number, string?];

export interface ArtData {
  name: string;
  width: number;
  height: number;
  /** Named moments in the drawing, as [start, end]. */
  steps: Record<string, [number, number]>;
  items: ArtItem[];
}
