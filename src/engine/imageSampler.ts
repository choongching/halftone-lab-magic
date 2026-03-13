import type { ImageConfig } from "@/types/halftone";

export interface LuminanceMap {
  data: Float32Array;
  width: number;
  height: number;
}

/**
 * Loads an image from a URL and returns the HTMLImageElement.
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

/**
 * Draws the source image onto an offscreen canvas, fitted to artboard dimensions.
 * Returns the canvas with the rasterized image.
 */
export function rasterizeImage(
  img: HTMLImageElement,
  config: ImageConfig
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext("2d")!;

  // Fill with white (will map to "no dot" areas)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, config.width, config.height);

  // Compute fit dimensions
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = config.width / config.height;
  let drawW: number, drawH: number, drawX: number, drawY: number;

  if (config.fitMode === "contain") {
    if (imgAspect > canvasAspect) {
      drawW = config.width - config.padding * 2;
      drawH = drawW / imgAspect;
    } else {
      drawH = config.height - config.padding * 2;
      drawW = drawH * imgAspect;
    }
  } else {
    // cover
    if (imgAspect > canvasAspect) {
      drawH = config.height - config.padding * 2;
      drawW = drawH * imgAspect;
    } else {
      drawW = config.width - config.padding * 2;
      drawH = drawW / imgAspect;
    }
  }

  drawX = (config.width - drawW) / 2;
  drawY = (config.height - drawH) / 2;

  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  return canvas;
}

/**
 * Extracts a luminance map from a canvas, applying tone mapping controls.
 */
export function extractLuminanceMap(
  canvas: HTMLCanvasElement,
  config: ImageConfig
): LuminanceMap {
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const map = new Float32Array(canvas.width * canvas.height);

  for (let i = 0; i < map.length; i++) {
    const idx = i * 4;
    // Standard luminance
    let lum = (pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114) / 255;

    // Apply brightness (-1 to 1)
    lum += config.brightness;

    // Apply contrast (-1 to 1)
    const contrastFactor = 1 + config.contrast;
    lum = (lum - 0.5) * contrastFactor + 0.5;

    // Apply gamma
    if (config.gamma !== 1 && lum > 0) {
      lum = Math.pow(lum, 1 / config.gamma);
    }

    // Clamp
    lum = Math.max(0, Math.min(1, lum));

    // Apply threshold (suppress light areas)
    if (lum > 1 - config.threshold) {
      lum = 1;
    }

    // Invert if needed
    if (config.invert) {
      lum = 1 - lum;
    }

    map[i] = lum;
  }

  return { data: map, width: canvas.width, height: canvas.height };
}

/**
 * Sample luminance at a specific point using nearest-neighbor.
 */
export function sampleLuminance(map: LuminanceMap, x: number, y: number): number {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || px >= map.width || py < 0 || py >= map.height) return 1;
  return map.data[py * map.width + px];
}
