import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HEADING = "#050507";
const INK = "#111114";
const GRAY = "#697077";
const NAVY = "#16161f";

/** The app icon: dark rounded tile with a 3x3 halftone dot gradient (same as the favicon). */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" fill="#141517" />
      <g fill="#ffffff">
        <circle cx="16" cy="16" r="2.4" />
        <circle cx="32" cy="16" r="3.4" />
        <circle cx="48" cy="16" r="4.4" />
        <circle cx="16" cy="32" r="3.4" />
        <circle cx="32" cy="32" r="4.4" />
        <circle cx="48" cy="32" r="5.4" />
        <circle cx="16" cy="48" r="4.4" />
        <circle cx="32" cy="48" r="5.4" />
        <circle cx="48" cy="48" r="6.4" />
      </g>
    </svg>
  );
}

/**
 * Halftone swirl field: a fixed grid of dots whose radii follow a slowly
 * swirling, domain-warped noise field, like classic halftone artwork. The
 * field morphs and drifts in slow motion; a gentle calm zone keeps the
 * area behind the hero copy quiet. Grayscale, ~10fps, honors
 * prefers-reduced-motion by rendering a single frame.
 */
function HalftoneField({ cols = 96, rows = 60, cell = 14 }: { cols?: number; rows?: number; cell?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const W = cols * cell;
    const H = rows * cell;
    const A = cols / rows;
    // dot shade by intensity band: pale grays for small dots, deeper for blobs
    const SHADES = ["#c9ced3", "#a4adb4", "#7b848c", "#4a525a"];

    // swirling, drifting field in [0..1]
    const field = (u: number, v: number, t: number) => {
      const wu = u + 0.45 * Math.sin(v * 1.6 + t * 0.07) + t * 0.016; // slow lateral drift
      const wv = v + 0.45 * Math.sin(u * 1.4 - t * 0.055);
      let s =
        Math.sin(wu * 1.9 + t * 0.1) +
        Math.sin(wv * 2.4 - t * 0.08) +
        Math.sin((wu + wv) * 1.2 + t * 0.06) +
        Math.sin(Math.hypot(wu - 1.6 * A, wv - 1.4) * 2.2 - t * 0.09);
      s = (s / 4 + 1) / 2;
      return Math.min(1, Math.max(0, (s - 0.5) * 1.7 + 0.42));
    };

    const draw = (tSec: number) => {
      ctx.clearRect(0, 0, W, H);
      const buckets: number[][][] = SHADES.map(() => []);
      for (let y = 0; y < rows; y++) {
        const v = (y / rows) * 3;
        const py = (y + 0.5) * cell;
        for (let x = 0; x < cols; x++) {
          const u = (x / rows) * 3; // row-normalized so blobs stay round
          let s = field(u, v, tSec);
          // calm zone behind the hero copy (left-center)
          const dx = x / cols - 0.27;
          const dy = y / rows - 0.52;
          s *= 1 - 0.62 * Math.exp(-(dx * dx * 9 + dy * dy * 4.5));
          const r = (0.1 + 0.9 * Math.pow(s, 1.5)) * cell * 0.46;
          if (r < 0.7) continue;
          const band = Math.min(SHADES.length - 1, Math.floor(s * SHADES.length));
          buckets[band].push([(x + 0.5) * cell, py, r]);
        }
      }
      buckets.forEach((dots, i) => {
        if (!dots.length) return;
        ctx.fillStyle = SHADES[i];
        ctx.beginPath();
        for (const [cx, cy, r] of dots) {
          ctx.moveTo(cx + r, cy);
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        }
        ctx.fill();
      });
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
      style={{ objectFit: "cover", objectPosition: "center" }}
    />
  );
}

const FEATURES = ["Dot grid", "Square grid", "Triangle grid", "Wave warp", "SVG export", "PNG export"];

const PAPER_GRID_STYLE = {
  backgroundColor: "#fafafa",
};

const Landing = () => {
  return (
    <div className="font-geist flex min-h-screen w-full flex-col bg-white p-3 md:p-4" style={{ color: INK }}>
      {/* Hero card: rounded, textured, with the animated dither filling it edge to edge */}
      <section
        className="relative flex min-h-[calc(100vh-2rem)] flex-1 flex-col overflow-hidden rounded-2xl md:rounded-3xl"
        style={PAPER_GRID_STYLE}
      >
        <div aria-hidden className="absolute inset-0">
          <HalftoneField />
        </div>

        {/* Hero copy, left-aligned over the open sky */}
        <main className="relative flex w-full flex-1 flex-col justify-center px-6 pb-16 md:px-12 md:pb-20">
          <span
            className="flex items-center gap-[clamp(0.5rem,1vw,0.625rem)]"
            style={{ filter: "drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 22px #ffffff)" }}
          >
            <LogoMark className="h-[clamp(1.75rem,1.25rem+1.6vw,2.25rem)] w-[clamp(1.75rem,1.25rem+1.6vw,2.25rem)]" />
            <span
              className="text-[clamp(0.875rem,0.7rem+0.55vw,1.0625rem)] font-semibold tracking-tight"
              style={{ color: HEADING }}
            >
              Halftone Lab
            </span>
          </span>

          <h1 className="font-chakra mt-[clamp(1rem,3vw,1.5rem)] max-w-6xl tracking-[-0.02em]">
            <span
              className="block text-[clamp(1.5rem,calc(5.5vw-6px),4rem)] font-medium leading-none"
              style={{ color: HEADING }}
            >
              Drop a photo.
            </span>
            <span
              className="block text-[clamp(3rem,calc(11vw-12px),8rem)] font-semibold leading-[0.95]"
              style={{ color: GRAY }}
            >
              Get halftone art.
            </span>
          </h1>

          <p
            className="mt-[clamp(1.25rem,4vw,2rem)] max-w-md text-[clamp(0.9375rem,0.6rem+1vw,1.125rem)] leading-[1.55]"
            style={{ color: INK }}
          >
            Your photo becomes dots, squares, or triangles that trace its
            light and shadow. Tune everything live, then export crisp SVG or
            PNG. Nothing leaves your browser.
          </p>

          <div className="mt-[clamp(1.5rem,5vw,2.5rem)]">
            <Link
              to="/app"
              className="inline-flex items-center rounded-full px-[clamp(1.375rem,3vw,1.75rem)] py-[clamp(0.7rem,1.8vw,0.875rem)] text-[clamp(0.8125rem,0.65rem+0.5vw,0.9375rem)] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ backgroundColor: NAVY }}
            >
              Launch the app
            </Link>
          </div>
        </main>
      </section>

      {/* Feature strip, logo-row style */}
      <section className="px-6 py-8 md:px-10">
        <p className="text-center font-geist-mono text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: GRAY }}>
          In the box
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {FEATURES.map((f) => (
            <li key={f} className="text-[17px] font-medium" style={{ color: HEADING }}>
              {f}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Landing;
