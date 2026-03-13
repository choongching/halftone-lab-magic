import type { HalftoneConfig } from "@/types/halftone";
import { createSeededRandom } from "./seededRandom";
import { getWaveModifier } from "./waveHelper";

interface SvgElement {
  type: "circle" | "rect" | "polygon" | "line";
  props: Record<string, string | number>;
}

function getGridStep(config: HalftoneConfig): number {
  const baseStep = 8 + (1 - config.density) * 40;
  const spacingFactor = 0.5 + config.spacing * 1.5;
  return baseStep * spacingFactor;
}

function getSize(config: HalftoneConfig, x: number, y: number, rand: () => number): number {
  const baseMin = 1;
  const baseMax = 3 + config.sizeRange * 20;
  const mid = (baseMin + baseMax) / 2;

  // Legacy internal wave for procedural richness (always active for backward compat)
  const freq = 0.5 + (config.wave.enabled ? config.wave.frequency : 2) * 0.5;
  const amp = config.wave.enabled ? 0 : 0.35; // disable legacy wave when new wave is on
  const phase = config.wave.enabled ? 0 : 0.15 * Math.PI * 2;
  const nx = (x * freq * 0.01) + phase;
  const ny = (y * freq * 0.01) + phase;

  let legacyWave = 0;
  if (!config.wave.enabled) {
    legacyWave = Math.sin(nx + ny) * amp;
  }

  const range = (baseMax - baseMin) / 2;
  let size = Math.max(0.5, mid + legacyWave * range);

  // Apply new wave modifier
  if (config.wave.enabled) {
    const modifier = getWaveModifier({
      x, y,
      width: config.width,
      height: config.height,
      wave: config.wave,
      seed: config.seed,
    });
    size *= modifier;
  }

  return Math.max(0, size);
}

export function renderDotGrid(config: HalftoneConfig): SvgElement[] {
  const elements: SvgElement[] = [];
  const rand = createSeededRandom(config.seed);
  const step = getGridStep(config);
  const pad = config.padding;
  const rot = (config.rotation * Math.PI) / 180;
  const cx = config.width / 2;
  const cy = config.height / 2;

  for (let y = pad; y < config.height - pad; y += step) {
    for (let x = pad; x < config.width - pad; x += step) {
      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);
      const r = getSize(config, x, y, rand);
      if (r > 0.3 && rx > pad && rx < config.width - pad && ry > pad && ry < config.height - pad) {
        elements.push({ type: "circle", props: { cx: +rx.toFixed(2), cy: +ry.toFixed(2), r: +r.toFixed(2) } });
      }
    }
  }
  return elements;
}

export function renderSquareGrid(config: HalftoneConfig): SvgElement[] {
  const elements: SvgElement[] = [];
  const rand = createSeededRandom(config.seed);
  const step = getGridStep(config);
  const pad = config.padding;
  const rot = (config.rotation * Math.PI) / 180;
  const cx = config.width / 2, cy = config.height / 2;

  for (let y = pad; y < config.height - pad; y += step) {
    for (let x = pad; x < config.width - pad; x += step) {
      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);
      const s = getSize(config, x, y, rand) * 1.8;
      if (s > 0.5 && rx > pad && rx < config.width - pad && ry > pad && ry < config.height - pad) {
        elements.push({
          type: "rect",
          props: {
            x: +(rx - s / 2).toFixed(2),
            y: +(ry - s / 2).toFixed(2),
            width: +s.toFixed(2),
            height: +s.toFixed(2),
          },
        });
      }
    }
  }
  return elements;
}

export function renderTriangleGrid(config: HalftoneConfig): SvgElement[] {
  const elements: SvgElement[] = [];
  const rand = createSeededRandom(config.seed);
  const step = getGridStep(config);
  const pad = config.padding;
  const rot = (config.rotation * Math.PI) / 180;
  const cx = config.width / 2, cy = config.height / 2;
  let row = 0;

  for (let y = pad; y < config.height - pad; y += step * 0.866) {
    const offset = row % 2 === 0 ? 0 : step / 2;
    for (let x = pad + offset; x < config.width - pad; x += step) {
      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);
      const s = getSize(config, x, y, rand) * 2;
      if (s > 0.5 && rx > pad && rx < config.width - pad && ry > pad && ry < config.height - pad) {
        const flip = (row + Math.floor(x / step)) % 2 === 0 ? 1 : -1;
        const h = s * 0.866;
        const points = `${rx.toFixed(2)},${(ry - h * flip / 2).toFixed(2)} ${(rx - s / 2).toFixed(2)},${(ry + h * flip / 2).toFixed(2)} ${(rx + s / 2).toFixed(2)},${(ry + h * flip / 2).toFixed(2)}`;
        elements.push({ type: "polygon", props: { points } });
      }
    }
    row++;
  }
  return elements;
}

export function renderHelioCircles(config: HalftoneConfig): SvgElement[] {
  const elements: SvgElement[] = [];
  const rand = createSeededRandom(config.seed);
  const cx = config.width / 2, cy = config.height / 2;
  const maxR = Math.min(config.width, config.height) / 2 - config.padding;
  const numRings = 5 + Math.floor(config.density * 30);
  const { wave } = config;

  // Internal helio wave params (legacy behavior when wave disabled)
  const helioFreq = wave.enabled ? wave.frequency : 2;
  const helioAmp = wave.enabled ? wave.amplitude * 15 : 0.35 * 15;
  const helioPhase = wave.enabled ? wave.phaseOffset * Math.PI * 2 : 0.15 * Math.PI * 2;
  const helioType = wave.enabled ? wave.type : "sine";

  for (let i = 0; i < numRings; i++) {
    const t = i / numRings;
    const baseR = t * maxR;
    const circumference = 2 * Math.PI * baseR;
    const dotsOnRing = Math.max(3, Math.floor(circumference / (6 + (1 - config.density) * 20)));
    let dotSize = 1 + config.sizeRange * (5 + t * 8);

    for (let j = 0; j < dotsOnRing; j++) {
      const angle = (j / dotsOnRing) * Math.PI * 2;
      let waveOff = 0;
      switch (helioType) {
        case "sine": waveOff = Math.sin(angle * helioFreq + t * 10 + helioPhase) * helioAmp; break;
        case "triangle": {
          const v = ((angle * helioFreq + t * 10 + helioPhase) % (Math.PI * 2)) / (Math.PI * 2);
          waveOff = (Math.abs(v * 4 - 2) - 1) * helioAmp;
          break;
        }
        case "noise": waveOff = (rand() * 2 - 1) * helioAmp; break;
      }
      const r = baseR + waveOff;
      const px = cx + Math.cos(angle + (config.rotation * Math.PI / 180)) * r;
      const py = cy + Math.sin(angle + (config.rotation * Math.PI / 180)) * r;

      // Apply wave modifier to dot size
      let finalSize = dotSize;
      if (wave.enabled) {
        const modifier = getWaveModifier({
          x: px, y: py,
          width: config.width, height: config.height,
          wave, seed: config.seed,
        });
        finalSize *= modifier;
      }

      if (px > config.padding && px < config.width - config.padding && py > config.padding && py < config.height - config.padding && finalSize > 0.3) {
        elements.push({ type: "circle", props: { cx: +px.toFixed(2), cy: +py.toFixed(2), r: +finalSize.toFixed(2) } });
      }
    }
  }
  return elements;
}

export function renderNoiseScatter(config: HalftoneConfig): SvgElement[] {
  const elements: SvgElement[] = [];
  const rand = createSeededRandom(config.seed);
  const pad = config.padding;
  const numPoints = Math.floor(200 + config.density * 2000);
  const areaW = config.width - pad * 2;
  const areaH = config.height - pad * 2;

  for (let i = 0; i < numPoints; i++) {
    const x = pad + rand() * areaW;
    const y = pad + rand() * areaH;
    let r = Math.max(0.3, 1 + config.sizeRange * 6 + (rand() * 2 - 1) * 4);

    if (config.wave.enabled) {
      const modifier = getWaveModifier({
        x, y,
        width: config.width, height: config.height,
        wave: config.wave, seed: config.seed,
      });
      r *= modifier;
    }

    if (r > 0.3) {
      elements.push({ type: "circle", props: { cx: +x.toFixed(2), cy: +y.toFixed(2), r: +r.toFixed(2) } });
    }
  }
  return elements;
}

export function renderWaveDashes(config: HalftoneConfig): SvgElement[] {
  const elements: SvgElement[] = [];
  const rand = createSeededRandom(config.seed);
  const step = getGridStep(config);
  const pad = config.padding;
  const { wave } = config;

  // Internal dash angle wave (legacy when wave disabled)
  const dashFreq = wave.enabled ? wave.frequency : 2;
  const dashAmp = wave.enabled ? wave.amplitude : 0.35;
  const dashPhase = wave.enabled ? wave.phaseOffset * Math.PI * 2 : 0.15 * Math.PI * 2;
  const dashType = wave.enabled ? wave.type : "sine";

  const dashLen = 3 + config.sizeRange * 15;
  const cx = config.width / 2, cy = config.height / 2;
  const rot = (config.rotation * Math.PI) / 180;

  for (let y = pad; y < config.height - pad; y += step) {
    for (let x = pad; x < config.width - pad; x += step) {
      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);

      let angle: number;
      switch (dashType) {
        case "sine": angle = Math.sin(x * dashFreq * 0.01 + y * dashFreq * 0.01 + dashPhase) * Math.PI * dashAmp; break;
        case "triangle": {
          const v = ((x * dashFreq * 0.01 + y * dashFreq * 0.01 + dashPhase) % (Math.PI * 2)) / (Math.PI * 2);
          angle = (Math.abs(v * 4 - 2) - 1) * Math.PI * dashAmp;
          break;
        }
        case "noise": angle = rand() * Math.PI * 2 * dashAmp; break;
        default: angle = 0;
      }

      let strokeWidth = 1 + config.sizeRange * 3;

      // Apply wave modifier to stroke width
      if (wave.enabled) {
        const modifier = getWaveModifier({
          x, y,
          width: config.width, height: config.height,
          wave, seed: config.seed,
        });
        strokeWidth *= modifier;
      }

      const half = dashLen / 2;
      if (rx > pad && rx < config.width - pad && ry > pad && ry < config.height - pad && strokeWidth > 0.2) {
        elements.push({
          type: "line",
          props: {
            x1: +(rx - Math.cos(angle) * half).toFixed(2),
            y1: +(ry - Math.sin(angle) * half).toFixed(2),
            x2: +(rx + Math.cos(angle) * half).toFixed(2),
            y2: +(ry + Math.sin(angle) * half).toFixed(2),
            "stroke-width": +strokeWidth.toFixed(2),
          },
        });
      }
    }
  }
  return elements;
}

export function renderHalftone(config: HalftoneConfig): SvgElement[] {
  switch (config.variant) {
    case "dot-grid": return renderDotGrid(config);
    case "square-grid": return renderSquareGrid(config);
    case "triangle-grid": return renderTriangleGrid(config);
    case "helio-circles": return renderHelioCircles(config);
    case "noise-scatter": return renderNoiseScatter(config);
    case "wave-dashes": return renderWaveDashes(config);
    default: return [];
  }
}

export function elementsToSvgString(config: HalftoneConfig, elements: SvgElement[]): string {
  const fg = config.invertColors ? config.backgroundColor : config.foregroundColor;
  const bg = config.invertColors ? config.foregroundColor : config.backgroundColor;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}">`;

  if (config.showBackground && !config.transparentBackground) {
    svg += `<rect width="${config.width}" height="${config.height}" fill="${bg}"/>`;
  }

  svg += `<g fill="${fg}" stroke="${fg}">`;

  for (const el of elements) {
    const attrs = Object.entries(el.props).map(([k, v]) => `${k}="${v}"`).join(" ");
    if (el.type === "line") {
      svg += `<${el.type} ${attrs} fill="none"/>`;
    } else {
      svg += `<${el.type} ${attrs}/>`;
    }
  }

  svg += "</g></svg>";
  return svg;
}
