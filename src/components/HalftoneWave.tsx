import { useEffect, useRef } from "react";

/**
 * HalftoneWave — an animated halftone dot field driven by fractal (FBM) noise.
 *
 * Inspired by reactbits' HalftoneWave: a grid of dots whose radius (and color)
 * tracks a multi-octave value-noise field that slowly drifts and swirls. Dot
 * size = local tone, so the field reads like a living halftone print.
 *
 * Performance notes — this is a background layer, so it is built to stay cheap:
 *   - Soft dot edges come from a small set of pre-rendered radial-gradient
 *     sprites (one per tone bucket), blitted with drawImage. No per-dot
 *     gradients, no per-frame allocation.
 *   - One FBM sample per cell per frame; octaves default to 3.
 *   - DPR is capped, the loop is fps-limited, and prefers-reduced-motion
 *     renders a single static frame.
 */
export type ElementShape = "dot" | "square" | "triangle";

export interface HalftoneWaveProps {
  /** Element shape rendered at each grid cell. */
  shape?: ElementShape;
  /** Pixel pitch between dots. Smaller = denser grid. */
  cellSize?: number;
  /** Max dot diameter as a fraction of the cell (0..~1). */
  dotScale?: number;
  /** Edge softness, 0 (crisp) .. 1 (very fuzzy). */
  softness?: number;
  /** Overall time multiplier. */
  speed?: number;
  /** Tilt of the noise field, in degrees. */
  rotation?: number;
  /** Spatial frequency of the noise (higher = smaller blobs). */
  noiseScale?: number;
  /** FBM octaves (detail layers). */
  octaves?: number;
  /** Noise values below this map to the smallest dots. */
  contrastMin?: number;
  /** Noise values above this map to the largest dots. */
  contrastMax?: number;
  /** Horizontal drift speed of the field. */
  scrollX?: number;
  /** Vertical drift speed of the field. */
  scrollY?: number;
  /** Dot color at low tone (small dots). */
  colorA?: string;
  /** Dot color at high tone (large dots). */
  colorB?: string;
  /** Solid backdrop fill, or null for transparent. */
  background?: string | null;
  /** Layer opacity, 0..1. */
  opacity?: number;
  /** Frames-per-second cap for the loop. */
  fps?: number;
  /** When true, dots swell near the pointer. */
  cursorInteraction?: boolean;
  /** Sparkle intensity (0 = off); scattered cells briefly pop and fade. */
  twinkle?: number;
  /**
   * A quiet region (e.g. behind hero copy) where dots are damped so text
   * stays readable. Coordinates are normalized 0..1 across the canvas.
   */
  calm?: { x: number; y: number; radius: number; strength: number } | null;
  className?: string;
}

const TONE_BUCKETS = 12;
const SPRITE_RES = 56;

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Deterministic 2D integer hash → [0,1). */
function hash(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  h ^= h >> 16;
  return (h >>> 0) / 4294967295;
}

/** Smoothly interpolated 2D value noise → [0,1]. */
function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

/** Fractional Brownian Motion: sum octaves of value noise → [0,1]. */
function fbm(x: number, y: number, octaves: number): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

/**
 * Build one tone-bucket sprite of the given color and shape. Dots get a soft
 * radial-gradient edge (controlled by `softness`); squares and triangles are
 * crisp fills (their feel comes from the size modulation, not the edge).
 */
function makeSprite(
  shape: ElementShape,
  rgb: [number, number, number],
  softness: number,
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE_RES;
  const g = c.getContext("2d")!;
  const mid = SPRITE_RES / 2;
  const [r, gr, b] = rgb;

  if (shape === "dot") {
    const solidTo = clamp(1 - softness, 0.04, 1);
    const grad = g.createRadialGradient(mid, mid, 0, mid, mid, mid);
    grad.addColorStop(0, `rgba(${r},${gr},${b},1)`);
    grad.addColorStop(solidTo, `rgba(${r},${gr},${b},1)`);
    grad.addColorStop(1, `rgba(${r},${gr},${b},0)`);
    g.fillStyle = grad;
    g.beginPath();
    g.arc(mid, mid, mid, 0, Math.PI * 2);
    g.fill();
    return c;
  }

  g.fillStyle = `rgb(${r},${gr},${b})`;
  if (shape === "square") {
    g.fillRect(0, 0, SPRITE_RES, SPRITE_RES);
  } else {
    // triangle, apex up
    g.beginPath();
    g.moveTo(mid, 0);
    g.lineTo(SPRITE_RES, SPRITE_RES);
    g.lineTo(0, SPRITE_RES);
    g.closePath();
    g.fill();
  }
  return c;
}

export function HalftoneWave({
  shape = "dot",
  cellSize = 8,
  dotScale = 1.3,
  softness = 0.22,
  speed = 1.6,
  rotation = -8,
  noiseScale = 2.9,
  octaves = 3,
  contrastMin = 0.22,
  contrastMax = 0.64,
  scrollX = 0.06,
  scrollY = 0.04,
  colorA = "#8b959d",
  colorB = "#222932",
  background = null,
  opacity = 1,
  fps = 30,
  cursorInteraction = false,
  twinkle = 0,
  calm = null,
  className,
}: HalftoneWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Pre-render the tone-bucket sprites once (light → dark).
    const a = hexToRgb(colorA);
    const b = hexToRgb(colorB);
    const sprites = Array.from({ length: TONE_BUCKETS }, (_, i) => {
      const t = i / (TONE_BUCKETS - 1);
      const rgb: [number, number, number] = [
        Math.round(lerp(a[0], b[0], t)),
        Math.round(lerp(a[1], b[1], t)),
        Math.round(lerp(a[2], b[2], t)),
      ];
      return makeSprite(shape, rgb, softness);
    });

    const rad = (rotation * Math.PI) / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);
    const maxR = cellSize * dotScale * 0.5;
    const span = clamp(contrastMax - contrastMin, 0.001, 1);

    // `s` is the eased influence (0..1) so the swell fades in/out smoothly.
    const pointer = { x: -1, y: -1, active: false, s: 0 };
    let cssW = 0;
    let cssH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    };

    const draw = (tSec: number) => {
      const t = tSec * speed;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, cssW, cssH);
      }
      ctx.globalAlpha = opacity;

      const cols = Math.ceil(cssW / cellSize) + 1;
      const rows = Math.ceil(cssH / cellSize) + 1;
      // Swirl: a small circular drift on top of the linear scroll makes the
      // field morph in place rather than merely sliding past.
      const ox = scrollX * t + Math.cos(t * 0.15) * 0.4;
      const oy = scrollY * t + Math.sin(t * 0.15) * 0.4;
      const invH = 1 / cssH;

      // Ease the cursor influence toward its target each frame.
      if (cursorInteraction) {
        pointer.s += ((pointer.active ? 1 : 0) - pointer.s) * 0.1;
      }
      const cursorOn = cursorInteraction && pointer.s > 0.01;
      const reach = cellSize * 7;
      const reach2 = reach * reach;

      for (let row = 0; row < rows; row++) {
        const py = (row + 0.5) * cellSize;
        for (let col = 0; col < cols; col++) {
          const px = (col + 0.5) * cellSize;
          // Normalize by height to keep blobs round, then rotate the field.
          const nx = px * invH;
          const ny = py * invH;
          const rx = nx * cosR - ny * sinR;
          const ry = nx * sinR + ny * cosR;
          const raw = fbm(rx * noiseScale + ox, ry * noiseScale + oy, octaves);
          let tone = clamp((raw - contrastMin) / span, 0, 1);

          if (calm) {
            const dx = px / cssW - calm.x;
            const dy = py / cssH - calm.y;
            const d2 = (dx * dx + dy * dy) / (calm.radius * calm.radius);
            tone *= 1 - calm.strength * Math.exp(-d2);
          }

          if (cursorOn) {
            const dx = px - pointer.x;
            const dy = py - pointer.y;
            const f = Math.exp(-(dx * dx + dy * dy) / reach2);
            tone = clamp(tone + 0.7 * f * pointer.s, 0, 1);
          }

          if (twinkle > 0) {
            // Each cell flashes on its own phase; the steep power keeps every
            // flash brief, so sparkles scatter and fade — fun and fleeting.
            const phase = hash(col + 17, row + 43);
            const s = Math.sin(t * 2.6 + phase * 6.2832);
            if (s > 0) tone = clamp(tone + twinkle * s ** 6, 0, 1);
          }

          const r = (0.2 + 0.8 * Math.pow(tone, 1.1)) * maxR;
          if (r < 0.35) continue;
          const bucket = clamp(Math.floor(tone * TONE_BUCKETS), 0, TONE_BUCKETS - 1);
          ctx.drawImage(sprites[bucket], px - r, py - r, r * 2, r * 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The canvas is a background layer (content sits on top), so track the
    // pointer on the window and map it into canvas space, activating only
    // while the cursor is over the canvas bounds.
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
      } else {
        pointer.active = false;
      }
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    if (cursorInteraction) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerout", onPointerLeave, { passive: true });
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(canvas);

    if (reduced) {
      draw(0);
      return () => {
        ro.disconnect();
        if (cursorInteraction) {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerout", onPointerLeave);
        }
      };
    }

    let raf = 0;
    let last = -Infinity;
    const minDelta = 1000 / fps;
    const loop = (ms: number) => {
      if (ms - last >= minDelta) {
        last = ms;
        draw(ms / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (cursorInteraction) {
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, [
    shape,
    cellSize,
    dotScale,
    softness,
    speed,
    rotation,
    noiseScale,
    octaves,
    contrastMin,
    contrastMax,
    scrollX,
    scrollY,
    colorA,
    colorB,
    background,
    opacity,
    fps,
    cursorInteraction,
    twinkle,
    calm,
  ]);

  return <canvas ref={canvasRef} aria-hidden className={className} style={{ display: "block" }} />;
}

export default HalftoneWave;
