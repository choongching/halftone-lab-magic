import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const INK = "#282926";
const INK_DEEP = "#1d201f"; // for small text on sage: clears WCAG AA (5.1:1)
const SAGE = "#759093";
const TEAL = "#53c4b4";

/** The app icon: dark rounded tile with a 3x3 halftone dot gradient (same as the favicon). */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" fill="#141517" />
      <g fill="#53c4b4">
        <circle cx="16" cy="16" r="3.2" />
        <circle cx="32" cy="16" r="4.6" />
        <circle cx="48" cy="16" r="6" />
        <circle cx="16" cy="32" r="4.6" />
        <circle cx="32" cy="32" r="6" />
        <circle cx="48" cy="32" r="7.4" />
        <circle cx="16" cy="48" r="6" />
        <circle cx="32" cy="48" r="7.4" />
        <circle cx="48" cy="48" r="8.8" />
      </g>
    </svg>
  );
}

/**
 * 1-bit dithered mountain scenery: layered ridgelines drawn as scattered
 * ink pixels on the panel, dense along each crest and fading below it.
 * Animated at ~10fps on a canvas: each ridge layer drifts sideways at its
 * own slow speed (parallax) and a fraction of the dither grain re-rolls
 * (twinkle). Honors prefers-reduced-motion by rendering a single frame.
 */
function DitherScenery({ cols = 320, rows = 200, cell = 4 }: { cols?: number; rows?: number; cell?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const W = cols * cell;
    const H = rows * cell;
    // five ridge layers, lightest mist at the back to full ink up front
    const layers = [
      { seed: 3.3, base: 0.52, amp: 0.05, peak: 0.5, fade: 10, drift: 0.01, shade: "#5e7a78" },
      { seed: 1.7, base: 0.62, amp: 0.07, peak: 0.65, fade: 8, drift: 0.018, shade: "#4d6664" },
      { seed: 4.2, base: 0.71, amp: 0.08, peak: 0.8, fade: 6.5, drift: 0.028, shade: "#3d5251" },
      { seed: 9.1, base: 0.8, amp: 0.09, peak: 0.9, fade: 5, drift: 0.04, shade: "#303f3e" },
      { seed: 7.9, base: 0.88, amp: 0.1, peak: 1, fade: 3.5, drift: 0.055, shade: INK },
    ];
    const SKY_SHADE = "#5e7a78";
    const hash = (x: number, y: number, s: number) =>
      Math.abs(Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453) % 1;
    const ridge = (nx: number, seed: number, base: number, amp: number, ph: number) =>
      base +
      amp *
        (0.55 * Math.sin(nx * 3.1 + seed + ph) +
          0.3 * Math.sin(nx * 6.9 + seed * 2.1 + ph * 1.7) +
          0.15 * Math.sin(nx * 12.3 + seed * 0.7 + ph * 2.4));

    const draw = (tSec: number) => {
      ctx.fillStyle = SAGE;
      ctx.fillRect(0, 0, W, H);
      const twinkleSeed = Math.floor(tSec * 2.5) + 1;
      // bucket pixels by shade so each layer keeps its own tone
      const buckets = new Map<string, number[]>();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x / cols;
          const ny = (y + 0.5) / rows;
          let density = 0.012; // sparse sky speckle
          let shade = SKY_SHADE;
          for (const l of layers) {
            const r = ridge(nx, l.seed, l.base, l.amp, tSec * l.drift);
            let d = 0;
            if (ny > r) {
              d = l.peak * Math.exp(-(ny - r) * l.fade * 4);
            } else if (r - ny < 0.015) {
              d = l.peak * 0.25; // spray above the crest
            }
            if (d > density) {
              density = d;
              shade = l.shade;
            }
          }
          // mostly static grain with a re-rolled twinkle component
          const grain = hash(x, y, 0) * 0.85 + hash(x, y, twinkleSeed) * 0.15;
          if (grain < density) {
            let b = buckets.get(shade);
            if (!b) buckets.set(shade, (b = []));
            b.push(x, y);
          }
        }
      }
      for (const [shade, pts] of buckets) {
        ctx.fillStyle = shade;
        for (let i = 0; i < pts.length; i += 2) {
          ctx.fillRect(pts[i] * cell, pts[i + 1] * cell, cell * 0.85, cell * 0.85);
        }
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(0);
      return;
    }

    let raf = 0;
    let last = 0;
    const loop = (ms: number) => {
      if (ms - last >= 100) {
        last = ms;
        draw(ms / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [cols, rows, cell]);

  return (
    <canvas
      ref={canvasRef}
      width={cols * cell}
      height={rows * cell}
      aria-hidden
      className="h-full w-full"
      style={{ objectFit: "cover", objectPosition: "center bottom" }}
    />
  );
}

const Landing = () => {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-hidden"
      style={{ backgroundColor: SAGE, color: INK }}
    >
      {/* Full-bleed animated scenery, dialed back so the content leads */}
      <div aria-hidden className="absolute inset-0 opacity-35">
        <DitherScenery />
      </div>

      {/* Header: centered wordmark, floating above the centered hero */}
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-center pt-6">
        <span className="flex items-center gap-2.5 whitespace-nowrap">
          <LogoMark className="h-6 w-6 md:h-7 md:w-7" />
          <span className="font-display text-xl uppercase tracking-tight md:text-2xl">Halftone Lab</span>
        </span>
      </header>

      {/* Hero, dead-center of the page */}
      <main className="relative flex min-h-screen flex-col items-center justify-center px-5 py-8 text-center">
        <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-[-0.03em] md:text-7xl">
          Photos in,
          <br />
          vectors out
        </h1>

        <p className="mt-8 max-w-xl font-fragment text-[13px] uppercase leading-relaxed tracking-tight md:text-sm" style={{ color: INK_DEEP }}>
          Turn any photo into halftone art with dots, squares and triangles.{" "}
          <br className="hidden md:block" />
          100% in your browser. Exports SVG and PNG.
        </p>

        <Link
          to="/app"
          className="mt-10 inline-flex items-center gap-2.5 rounded-[4px] bg-[#f2f0e9] px-7 py-3.5 font-fragment text-xs uppercase tracking-[0.12em] text-[#282926] shadow-[0_2px_0_rgba(40,41,38,0.35)] transition-all hover:-translate-y-px hover:bg-white hover:shadow-[0_3px_0_rgba(40,41,38,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2f0e9] focus-visible:ring-offset-2"
        >
          <span aria-hidden className="text-[8px]" style={{ color: TEAL }}>
            &#9632;
          </span>
          Launch the app
        </Link>

        <p className="mt-4 font-fragment text-[10px] uppercase tracking-[0.2em]" style={{ color: INK_DEEP }}>
          No account &middot; No upload &middot; Free forever
        </p>
      </main>
    </div>
  );
};

export default Landing;
