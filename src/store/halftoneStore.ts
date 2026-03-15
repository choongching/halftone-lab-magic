import { create } from "zustand";
import type { ImageConfig, SizePreset } from "@/types/halftone";
import { SIZE_PRESET_DIMENSIONS, DEFAULT_WAVE_CONFIG } from "@/types/halftone";

export const DEFAULT_CONFIG: ImageConfig = {
  sourceImageUrl: null,
  sourceImageWidth: 0,
  sourceImageHeight: 0,
  fitMode: "contain",
  patternType: "dot-grid",
  brightness: 0,
  contrast: 0,
  threshold: 0.1,
  invert: false,
  gamma: 1,
  wave: { ...DEFAULT_WAVE_CONFIG },
  columns: 40,
  rows: 40,
  sizeRange: 0.5,
  rotation: 0,
  width: 1200,
  height: 1200,
  padding: 40,
  foregroundColor: "#e8e4dc",
  backgroundColor: "#1a1a2e",
  transparentBackground: false,
  showBackground: true,
  invertColors: false,
  showFrame: false,
  frameRadius: 12,
  sizePreset: "square",
  advancedMode: false,
};

interface HalftoneStore {
  config: ImageConfig;
  setConfig: (partial: Partial<ImageConfig>) => void;
  resetConfig: () => void;
  randomize: () => void;
  setSizePreset: (preset: SizePreset) => void;
  toggleAdvancedMode: () => void;
  setSourceImage: (url: string, width: number, height: number) => void;
  removeSourceImage: () => void;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export const useHalftoneStore = create<HalftoneStore>((set, get) => ({
  config: { ...DEFAULT_CONFIG },

  setConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),

  resetConfig: () =>
    set((state) => ({
      config: {
        ...DEFAULT_CONFIG,
        sourceImageUrl: state.config.sourceImageUrl,
        sourceImageWidth: state.config.sourceImageWidth,
        sourceImageHeight: state.config.sourceImageHeight,
      },
    })),

  randomize: () => {
    const waveTypes = ["sine", "triangle", "noise"] as const;
    const fgColors = ["#e8e4dc", "#ffffff", "#f5c542", "#ff6b6b", "#4ecdc4", "#a8e6cf", "#ff8a5c", "#d4a5ff"];
    const bgColors = ["#1a1a2e", "#0d1117", "#16213e", "#1b1b2f", "#2d132c", "#0a192f", "#121212", "#1e1e1e"];
    const patterns = ["dot-grid", "square-grid", "triangle-grid"] as const;

    set((state) => ({
      config: {
        ...state.config,
        patternType: patterns[Math.floor(Math.random() * patterns.length)],
        density: randomBetween(0.3, 0.7),
        sizeRange: randomBetween(0.3, 0.7),
        spacing: randomBetween(0.3, 0.6),
        brightness: randomBetween(-0.3, 0.3),
        contrast: randomBetween(-0.2, 0.5),
        threshold: randomBetween(0.05, 0.3),
        wave: {
          enabled: Math.random() > 0.5,
          type: waveTypes[Math.floor(Math.random() * waveTypes.length)],
          amplitude: randomBetween(0.1, 0.4),
          frequency: randomBetween(0.5, 3),
          phaseOffset: randomBetween(0, 0.5),
        },
        foregroundColor: fgColors[Math.floor(Math.random() * fgColors.length)],
        backgroundColor: bgColors[Math.floor(Math.random() * bgColors.length)],
      },
    }));
  },

  setSizePreset: (preset) => {
    if (preset === "custom") {
      set((state) => ({ config: { ...state.config, sizePreset: "custom" } }));
    } else {
      const dims = SIZE_PRESET_DIMENSIONS[preset];
      set((state) => ({
        config: { ...state.config, sizePreset: preset, width: dims.width, height: dims.height },
      }));
    }
  },

  toggleAdvancedMode: () =>
    set((state) => ({ config: { ...state.config, advancedMode: !state.config.advancedMode } })),

  setSourceImage: (url, width, height) =>
    set((state) => ({
      config: {
        ...state.config,
        sourceImageUrl: url,
        sourceImageWidth: width,
        sourceImageHeight: height,
      },
    })),

  removeSourceImage: () =>
    set((state) => ({
      config: {
        ...state.config,
        sourceImageUrl: null,
        sourceImageWidth: 0,
        sourceImageHeight: 0,
      },
    })),
}));
