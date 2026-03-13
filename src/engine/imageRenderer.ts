import type { ImageConfig } from "@/types/halftone";
import type { LuminanceMap } from "./imageSampler";
import { sampleLuminance } from "./imageSampler";

interface SvgElement {
  type: "circle" | "rect" | "polygon";
  props: Record<string, string | number>;
}

function getGridStep(config: ImageConfig): number {
  const baseStep = 8 + (1 - config.density) * 40;
  const spacingFactor = 0.5 + config.spacing * 1.5;
  return baseStep * spacingFactor;
}

export function renderImageDotGrid(config: ImageConfig, lumaMap: LuminanceMap): SvgElement[] {
  const elements: SvgElement[] = [];
  const step = getGridStep(config);
  const pad = config.padding;
  const rot = (config.rotation * Math.PI) / 180;
  const cx = config.width / 2;
  const cy = config.height / 2;
  const maxSize = 2 + config.sizeRange * 18;

  for (let y = pad; y < config.height - pad; y += step) {
    for (let x = pad; x < config.width - pad; x += step) {
      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);

      if (rx < pad || rx > config.width - pad || ry < pad || ry > config.height - pad) continue;

      const lum = sampleLuminance(lumaMap, x, y);
      // Dark pixels = large dots (lum 0 = darkest)
      const darkness = 1 - lum;
      const r = darkness * maxSize;

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
  const step = getGridStep(config);
  const pad = config.padding;
  const rot = (config.rotation * Math.PI) / 180;
  const cx = config.width / 2;
  const cy = config.height / 2;
  const maxSize = 2 + config.sizeRange * 18;

  for (let y = pad; y < config.height - pad; y += step) {
    for (let x = pad; x < config.width - pad; x += step) {
      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);

      if (rx < pad || rx > config.width - pad || ry < pad || ry > config.height - pad) continue;

      const lum = sampleLuminance(lumaMap, x, y);
      const darkness = 1 - lum;
      const s = darkness * maxSize * 1.8;

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
  const step = getGridStep(config);
  const pad = config.padding;
  const rot = (config.rotation * Math.PI) / 180;
  const cx = config.width / 2;
  const cy = config.height / 2;
  const maxSize = 2 + config.sizeRange * 18;
  let row = 0;

  for (let y = pad; y < config.height - pad; y += step * 0.866) {
    const offset = row % 2 === 0 ? 0 : step / 2;
    for (let x = pad + offset; x < config.width - pad; x += step) {
      const dx = x - cx, dy = y - cy;
      const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot);
      const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot);

      if (rx < pad || rx > config.width - pad || ry < pad || ry > config.height - pad) continue;

      const lum = sampleLuminance(lumaMap, x, y);
      const darkness = 1 - lum;
      const s = darkness * maxSize * 2;

      if (s > 0.5) {
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
