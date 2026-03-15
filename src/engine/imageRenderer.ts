import type { ImageConfig } from "@/types/halftone";
import type { LuminanceMap } from "./imageSampler";
import { sampleLuminance } from "./imageSampler";
import { getWaveModifier } from "./waveHelper";

interface SvgElement {
  type: "circle" | "rect" | "polygon";
  props: Record<string, string | number>;
}

/** Max elements to render for performance safety */
const MAX_ELEMENTS = 40_000;

function getSteps(config: ImageConfig): { stepX: number; stepY: number } {
  const usableW = config.width - config.padding * 2;
  const usableH = config.height - config.padding * 2;
  return {
    stepX: usableW / config.columns,
    stepY: usableH / config.rows,
  };
}

function applyWave(config: ImageConfig, x: number, y: number, baseSize: number): number {
  if (!config.wave.enabled) return baseSize;
  const modifier = getWaveModifier({
    x, y,
    width: config.width,
    height: config.height,
    wave: config.wave,
  });
  const softModifier = 1 - (1 - modifier) * 0.7;
  return Math.max(0, baseSize * softModifier);
}

export function renderImageDotGrid(config: ImageConfig, lumaMap: LuminanceMap): SvgElement[] {
  const elements: SvgElement[] = [];
  const { stepX, stepY } = getSteps(config);
  const pad = config.padding;
  const rot = (config.rotation * Math.PI) / 180;
  const cx = config.width / 2;
  const cy = config.height / 2;
  const maxSize = Math.min(stepX, stepY) * 0.5 * (0.2 + config.sizeRange * 0.8);

  for (let row = 0; row < config.rows && elements.length < MAX_ELEMENTS; row++) {
    const y = pad + stepY * (row + 0.5);
    for (let col = 0; col < config.columns && elements.length < MAX_ELEMENTS; col++) {
      const x = pad + stepX * (col + 0.5);

      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);

      if (rx < pad || rx > config.width - pad || ry < pad || ry > config.height - pad) continue;

      const lum = sampleLuminance(lumaMap, x, y);
      const darkness = 1 - lum;
      const r = applyWave(config, x, y, darkness * maxSize);

      if (r > 0.3) {
        elements.push({
          type: "circle",
          props: { cx: +rx.toFixed(2), cy: +ry.toFixed(2), r: +r.toFixed(2) },
        });
      }
    }
  }
  return elements;
}

export function renderImageSquareGrid(config: ImageConfig, lumaMap: LuminanceMap): SvgElement[] {
  const elements: SvgElement[] = [];
  const { stepX, stepY } = getSteps(config);
  const pad = config.padding;
  const rot = (config.rotation * Math.PI) / 180;
  const cx = config.width / 2;
  const cy = config.height / 2;
  const maxSize = Math.min(stepX, stepY) * (0.2 + config.sizeRange * 0.8);

  for (let row = 0; row < config.rows && elements.length < MAX_ELEMENTS; row++) {
    const y = pad + stepY * (row + 0.5);
    for (let col = 0; col < config.columns && elements.length < MAX_ELEMENTS; col++) {
      const x = pad + stepX * (col + 0.5);

      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);

      if (rx < pad || rx > config.width - pad || ry < pad || ry > config.height - pad) continue;

      const lum = sampleLuminance(lumaMap, x, y);
      const darkness = 1 - lum;
      const s = applyWave(config, x, y, darkness * maxSize);

      if (s > 0.5) {
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

export function renderImageTriangleGrid(config: ImageConfig, lumaMap: LuminanceMap): SvgElement[] {
  const elements: SvgElement[] = [];
  const { stepX, stepY } = getSteps(config);
  const pad = config.padding;
  const rot = (config.rotation * Math.PI) / 180;
  const cx = config.width / 2;
  const cy = config.height / 2;
  const maxSize = Math.min(stepX, stepY) * (0.2 + config.sizeRange * 0.8);

  for (let row = 0; row < config.rows && elements.length < MAX_ELEMENTS; row++) {
    const y = pad + stepY * (row + 0.5);
    const offset = row % 2 === 0 ? 0 : stepX / 2;
    for (let col = 0; col < config.columns && elements.length < MAX_ELEMENTS; col++) {
      const x = pad + offset + stepX * (col + 0.5);
      if (x > config.width - pad) continue;

      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);

      if (rx < pad || rx > config.width - pad || ry < pad || ry > config.height - pad) continue;

      const lum = sampleLuminance(lumaMap, x, y);
      const darkness = 1 - lum;
      const s = applyWave(config, x, y, darkness * maxSize);

      if (s > 0.5) {
        const flip = (row + col) % 2 === 0 ? 1 : -1;
        const h = s * 0.866;
        const points = `${rx.toFixed(2)},${(ry - h * flip / 2).toFixed(2)} ${(rx - s / 2).toFixed(2)},${(ry + h * flip / 2).toFixed(2)} ${(rx + s / 2).toFixed(2)},${(ry + h * flip / 2).toFixed(2)}`;
        elements.push({ type: "polygon", props: { points } });
      }
    }
  }
  return elements;
}

export function renderImageHalftone(
  config: ImageConfig,
  lumaMap: LuminanceMap
): SvgElement[] {
  switch (config.patternType) {
    case "dot-grid":
      return renderImageDotGrid(config, lumaMap);
    case "square-grid":
      return renderImageSquareGrid(config, lumaMap);
    case "triangle-grid":
      return renderImageTriangleGrid(config, lumaMap);
    default:
      return [];
  }
}

export function imageElementsToSvgString(
  config: ImageConfig,
  elements: SvgElement[]
): string {
  const fg = config.invertColors ? config.backgroundColor : config.foregroundColor;
  const bg = config.invertColors ? config.foregroundColor : config.backgroundColor;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}">`;

  if (config.showBackground && !config.transparentBackground) {
    svg += `<rect width="${config.width}" height="${config.height}" fill="${bg}"/>`;
  }

  svg += `<g fill="${fg}" stroke="${fg}">`;

  for (const el of elements) {
    const attrs = Object.entries(el.props)
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ");
    svg += `<${el.type} ${attrs}/>`;
  }

  svg += "</g></svg>";
  return svg;
}
