export type WaveType = "sine" | "triangle" | "noise";

export interface WaveConfig {
  enabled: boolean;
  type: WaveType;
  amplitude: number;   // 0-1
  frequency: number;   // 0.1-8
  phaseOffset: number;  // 0-1 (maps to 0..2π internally)
}

export type SizePreset = "square" | "portrait" | "landscape" | "story" | "poster" | "custom";

export type ImagePatternType = "dot-grid" | "square-grid" | "triangle-grid";

export type ImageFitMode = "contain" | "cover";

export interface ImageConfig {
  sourceImageUrl: string | null;
  sourceImageWidth: number;
  sourceImageHeight: number;
  fitMode: ImageFitMode;
  patternType: ImagePatternType;
  brightness: number;    // -1 to 1
  contrast: number;      // -1 to 1
  threshold: number;     // 0-1
  invert: boolean;
  gamma: number;         // 0.2 to 5
  wave: WaveConfig;
  density: number;       // 0-1
  sizeRange: number;     // 0-1
  spacing: number;       // 0-1
  rotation: number;      // 0-360
  width: number;
  height: number;
  padding: number;
  foregroundColor: string;
  backgroundColor: string;
  transparentBackground: boolean;
  showBackground: boolean;
  invertColors: boolean;
  showFrame: boolean;
  frameRadius: number;
  sizePreset: SizePreset;
  advancedMode: boolean;
}

export const IMAGE_PATTERN_LABELS: Record<ImagePatternType, string> = {
  "dot-grid": "Dot Grid",
  "square-grid": "Square Grid",
  "triangle-grid": "Triangle Grid",
};

export const WAVE_TYPE_LABELS: Record<WaveType, string> = {
  sine: "Sine",
  triangle: "Triangle",
  noise: "Noise",
};

export const DEFAULT_WAVE_CONFIG: WaveConfig = {
  enabled: false,
  type: "sine",
  amplitude: 0.25,
  frequency: 1.0,
  phaseOffset: 0,
};

export const SIZE_PRESET_DIMENSIONS: Record<Exclude<SizePreset, 'custom'>, { width: number; height: number }> = {
  square: { width: 1200, height: 1200 },
  portrait: { width: 900, height: 1200 },
  landscape: { width: 1200, height: 900 },
  story: { width: 1080, height: 1920 },
  poster: { width: 1800, height: 2400 },
};
