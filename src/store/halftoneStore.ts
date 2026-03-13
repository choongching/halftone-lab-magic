import { create } from "zustand";
import type { HalftoneConfig, SavedPreset, SizePreset } from "@/types/halftone";
import { SIZE_PRESET_DIMENSIONS } from "@/types/halftone";

export const DEFAULT_CONFIG: HalftoneConfig = {
  variant: "helio-circles",
  width: 1200,
  height: 1200,
  padding: 40,
  transparentBackground: false,
  showBackground: true,
  foregroundColor: "#e8e4dc",
  backgroundColor: "#1a1a2e",
  invertColors: false,
  density: 0.5,
  sizeRange: 0.4,
  spacing: 0.45,
  rotation: 0,
  waveType: "sine",
  amplitude: 0.35,
  frequency: 0.5,
  phaseOffset: 0.15,
  seed: 42,
  showFrame: false,
  frameRadius: 12,
  sizePreset: "square",
  advancedMode: false,
};

interface HalftoneStore {
  config: HalftoneConfig;
  savedPresets: SavedPreset[];
  setConfig: (partial: Partial<HalftoneConfig>) => void;
  resetConfig: () => void;
  randomize: () => void;
  setSizePreset: (preset: SizePreset) => void;
  toggleAdvancedMode: () => void;
  savePreset: (name: string) => void;
  loadPreset: (preset: SavedPreset) => void;
  deletePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
  loadSavedPresets: () => void;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export const useHalftoneStore = create<HalftoneStore>((set, get) => ({
  config: { ...DEFAULT_CONFIG },
  savedPresets: [],

  setConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),

  resetConfig: () => set({ config: { ...DEFAULT_CONFIG } }),

  randomize: () => {
    const variants = ["dot-grid", "square-grid", "triangle-grid", "helio-circles", "noise-scatter", "wave-dashes"] as const;
    const waveTypes = ["sine", "cosine", "triangle", "noise"] as const;
    const fgColors = ["#e8e4dc", "#ffffff", "#f5c542", "#ff6b6b", "#4ecdc4", "#a8e6cf", "#ff8a5c", "#d4a5ff"];
    const bgColors = ["#1a1a2e", "#0d1117", "#16213e", "#1b1b2f", "#2d132c", "#0a192f", "#121212", "#1e1e1e"];

    set((state) => ({
      config: {
        ...state.config,
        variant: variants[Math.floor(Math.random() * variants.length)],
        density: randomBetween(0.25, 0.75),
        sizeRange: randomBetween(0.2, 0.7),
        spacing: randomBetween(0.25, 0.65),
        rotation: Math.floor(randomBetween(0, 360)),
        waveType: waveTypes[Math.floor(Math.random() * waveTypes.length)],
        amplitude: randomBetween(0.15, 0.6),
        frequency: randomBetween(0.25, 0.75),
        phaseOffset: randomBetween(0, 0.5),
        seed: Math.floor(Math.random() * 10000),
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

  savePreset: (name) => {
    const { config } = get();
    const { advancedMode, ...configWithoutMode } = config;
    const preset: SavedPreset = {
      id: crypto.randomUUID(),
      name,
      config: configWithoutMode,
      createdAt: Date.now(),
    };
    const updated = [...get().savedPresets, preset];
    set({ savedPresets: updated });
    localStorage.setItem("halftone-lab-presets", JSON.stringify(updated));
  },

  loadPreset: (preset) =>
    set((state) => ({ config: { ...state.config, ...preset.config } })),

  deletePreset: (id) => {
    const updated = get().savedPresets.filter((p) => p.id !== id);
    set({ savedPresets: updated });
    localStorage.setItem("halftone-lab-presets", JSON.stringify(updated));
  },

  renamePreset: (id, name) => {
    const updated = get().savedPresets.map((p) => (p.id === id ? { ...p, name } : p));
    set({ savedPresets: updated });
    localStorage.setItem("halftone-lab-presets", JSON.stringify(updated));
  },

  loadSavedPresets: () => {
    try {
      const raw = localStorage.getItem("halftone-lab-presets");
      if (raw) set({ savedPresets: JSON.parse(raw) });
    } catch {}
  },
}));
