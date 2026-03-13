import type { HalftoneConfig } from "@/types/halftone";

type PresetConfig = Omit<HalftoneConfig, 'advancedMode'>;

export const BUILT_IN_PRESETS: { name: string; config: Partial<PresetConfig> }[] = [
  {
    name: "Soft Grid",
    config: {
      variant: "dot-grid",
      density: 0.4,
      sizeRange: 0.3,
      spacing: 0.55,
      rotation: 0,
      wave: { enabled: true, type: "sine", amplitude: 0.2, frequency: 1.2, phaseOffset: 0 },
      foregroundColor: "#d4d0c8",
      backgroundColor: "#1e1e2e",
    },
  },
  {
    name: "Brutalist Squares",
    config: {
      variant: "square-grid",
      density: 0.6,
      sizeRange: 0.55,
      spacing: 0.35,
      rotation: 45,
      wave: { enabled: true, type: "triangle", amplitude: 0.5, frequency: 2.4, phaseOffset: 0 },
      foregroundColor: "#ffffff",
      backgroundColor: "#0a0a0a",
    },
  },
  {
    name: "Poster Dots",
    config: {
      variant: "dot-grid",
      density: 0.55,
      sizeRange: 0.6,
      spacing: 0.4,
      rotation: 15,
      wave: { enabled: true, type: "sine", amplitude: 0.45, frequency: 2.0, phaseOffset: 0 },
      foregroundColor: "#f5c542",
      backgroundColor: "#16213e",
    },
  },
  {
    name: "Retro Print",
    config: {
      variant: "dot-grid",
      density: 0.65,
      sizeRange: 0.5,
      spacing: 0.3,
      rotation: 30,
      wave: { enabled: true, type: "sine", amplitude: 0.3, frequency: 1.8, phaseOffset: 0 },
      foregroundColor: "#ff6b6b",
      backgroundColor: "#1b1b2f",
    },
  },
  {
    name: "Tech Noise",
    config: {
      variant: "noise-scatter",
      density: 0.5,
      sizeRange: 0.35,
      spacing: 0.5,
      rotation: 0,
      wave: { enabled: true, type: "noise", amplitude: 0.4, frequency: 2.0, phaseOffset: 0 },
      seed: 1337,
      foregroundColor: "#4ecdc4",
      backgroundColor: "#0d1117",
    },
  },
  {
    name: "Fluid Helio",
    config: {
      variant: "helio-circles",
      density: 0.5,
      sizeRange: 0.4,
      spacing: 0.45,
      rotation: 0,
      wave: { enabled: true, type: "sine", amplitude: 0.35, frequency: 2.0, phaseOffset: 0.15 },
      foregroundColor: "#e8e4dc",
      backgroundColor: "#1a1a2e",
    },
  },
];
