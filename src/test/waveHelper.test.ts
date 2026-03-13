import { describe, it, expect } from "vitest";
import { getWaveModifier } from "@/engine/waveHelper";
import type { WaveConfig } from "@/types/halftone";

const base = { x: 100, y: 100, width: 1200, height: 1200 };

function makeWave(overrides: Partial<WaveConfig> = {}): WaveConfig {
  return { enabled: true, type: "sine", amplitude: 0.25, frequency: 1, phaseOffset: 0, ...overrides };
}

describe("getWaveModifier", () => {
  it("returns 1 when disabled", () => {
    expect(getWaveModifier({ ...base, wave: makeWave({ enabled: false }) })).toBe(1);
  });

  it("returns 1 when amplitude is 0", () => {
    expect(getWaveModifier({ ...base, wave: makeWave({ amplitude: 0 }) })).toBe(1);
  });

  it("returns stable output for sine", () => {
    const a = getWaveModifier({ ...base, wave: makeWave({ type: "sine" }) });
    const b = getWaveModifier({ ...base, wave: makeWave({ type: "sine" }) });
    expect(a).toBe(b);
    expect(a).toBeGreaterThan(0);
    expect(a).toBeLessThanOrEqual(1);
  });

  it("returns stable output for triangle", () => {
    const v = getWaveModifier({ ...base, wave: makeWave({ type: "triangle" }) });
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThanOrEqual(1);
  });

  it("noise returns value in valid range", () => {
    const v = getWaveModifier({ ...base, wave: makeWave({ type: "noise" }), seed: 42 });
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(1);
  });

  it("amplitude 1 still returns valid positive multiplier", () => {
    const v = getWaveModifier({ ...base, wave: makeWave({ amplitude: 1 }) });
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(1);
  });

  it("phase offset affects output", () => {
    const a = getWaveModifier({ ...base, wave: makeWave({ phaseOffset: 0 }) });
    const b = getWaveModifier({ ...base, wave: makeWave({ phaseOffset: 0.5 }) });
    expect(a).not.toBe(b);
  });

  it("frequency affects output", () => {
    const a = getWaveModifier({ ...base, wave: makeWave({ frequency: 1 }) });
    const b = getWaveModifier({ ...base, wave: makeWave({ frequency: 4 }) });
    expect(a).not.toBe(b);
  });
});
