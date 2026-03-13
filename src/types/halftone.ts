export type HalftoneVariant =
  | "dot-grid"
  | "square-grid"
  | "triangle-grid"
  | "helio-circles"
  | "noise-scatter"
  | "wave-dashes";

export type WaveType = "sine" | "cosine" | "triangle" | "noise";

export type SizePreset = "square" | "portrait" | "landscape" | "story" | "poster" | "custom";

export interface HalftoneConfig {
  variant: HalftoneVariant;
  width: number;
  height: number;
  padding: number;
  transparentBackground: boolean;
  showBackground: boolean;
  foregroundColor: string;
  backgroundColor: string;
  invertColors: boolean;
  density: number;       // 0-1
  sizeRange: number;     // 0-1
  spacing: number;       // 0-1
  rotation: number;      // 0-360
  waveType: WaveType;
  amplitude: number;     // 0-1
  frequency: number;     // 0-1
  phaseOffset: number;   // 0-1
  seed: number;          // integer
  showFrame: boolean;
  frameRadius: number;   // 0-50
  sizePreset: SizePreset;
  advancedMode: boolean;
}

export interface SavedPreset {
  id: string;
  name: string;
  config: Omit<HalftoneConfig, 'advancedMode'>;
  createdAt: number;
}

export const VARIANT_LABELS: Record<HalftoneVariant, string> = {
  "dot-grid": "Dot Grid",
  "square-grid": "Square Grid",
  "triangle-grid": "Triangle Grid",
  "helio-circles": "Helio Circles",
  "noise-scatter": "Noise Scatter",
  "wave-dashes": "Wave Dashes",
};

export const WAVE_TYPE_LABELS: Record<WaveType, string> = {
  sine: "Sine",
  cosine: "Cosine",
  triangle: "Triangle",
  noise: "Noise",
};

export const SIZE_PRESET_DIMENSIONS: Record<Exclude<SizePreset, 'custom'>, { width: number; height: number }> = {
  square: { width: 1200, height: 1200 },
  portrait: { width: 900, height: 1200 },
  landscape: { width: 1200, height: 900 },
  story: { width: 1080, height: 1920 },
  poster: { width: 1800, height: 2400 },
};
