import type { WaveConfig } from "@/types/halftone";

function createSeededRandom(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export interface WaveInput {
  x: number;
  y: number;
  width: number;
  height: number;
  wave: WaveConfig;
  seed?: number;
}

/**
 * Compute a size multiplier from wave config.
 * Returns 1.0 when wave is disabled.
 * Returns a positive value in range [1 - amplitude, 1] when enabled.
 */
export function getWaveModifier(input: WaveInput): number {
  const { wave } = input;
  if (!wave.enabled || wave.amplitude === 0) return 1;

  const nx = input.x / input.width;
  const ny = input.y / input.height;
  const phase = wave.phaseOffset * Math.PI * 2;
  const freq = wave.frequency;

  let raw: number;
  switch (wave.type) {
    case "sine":
      raw = Math.sin((nx + ny) * freq * Math.PI * 2 + phase);
      break;
    case "triangle": {
      const t = (((nx + ny) * freq + phase / (Math.PI * 2)) % 1 + 1) % 1;
      raw = Math.abs(t * 4 - 2) - 1;
      break;
    }
    case "noise": {
      // Deterministic noise based on position
      const rand = createSeededRandom(
        Math.floor(nx * 1000) * 7919 + Math.floor(ny * 1000) * 104729 + (input.seed ?? 42)
      );
      raw = rand() * 2 - 1;
      break;
    }
    default:
      return 1;
  }

  // Normalize raw (-1..1) to 0..1
  const normalized = (raw + 1) / 2;

  // Multiplier: 1 - amplitude + normalized * amplitude
  // Range: [1-amplitude, 1]
  return Math.max(0, 1 - wave.amplitude + normalized * wave.amplitude);
}
