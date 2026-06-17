import { Link } from "react-router-dom";
import { HalftoneWave } from "@/components/HalftoneWave";

// Orange-fill theme (shared with the styleguide): saturated orange surfaces,
// cream type, a cream CTA pill, and tone-on-tone orange halftone dots.
const PAGE = "#E04E1A"; // page gutter behind the hero card
const CARD = "#F15A22"; // hero card surface
const HEADING = "#FFFFFF"; // strong display type
const INK = "#FCE7D8"; // body + muted display type
const GRAY = "rgba(255,244,236,0.74)"; // secondary / wordmark
const BTN_BG = "#FDF1E7"; // CTA pill fill
const BTN_TEXT = "#B5430F"; // CTA pill text
const FIELD = { colorA: "#F79A63", colorB: "#FBD3B4" }; // light orange dots, lighter than the card — subtle and faint
const GLOW = "#F15A22"; // halo that lifts the wordmark off the field
const BODY_SHADOW = "0 1px 14px rgba(120,38,6,0.45)"; // keeps copy legible over dots
const RULE = "rgba(255,240,228,0.42)"; // hairline grid rules
const GRIDLINE = "rgba(255,240,228,0.14)"; // faint column guides — the "hidden grid"

/** The app icon: dark rounded tile with a 3x3 halftone dot gradient (same as the favicon). */
export function LogoMark({ className }: { className?: string }) {
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

const HERO_CARD_STYLE = {
  backgroundColor: CARD,
};

/** Calm zone behind the hero copy (left-center) so the type stays readable. */
const HERO_CALM = { x: 0.27, y: 0.52, radius: 0.45, strength: 0.62 };

/**
 * Subtle inner halftone mask for the display headline: a fine dot tile gently
 * carved out of the letterforms so the wordmark echoes the product without
 * shouting. Gaps keep most of their opacity, so the effect reads as texture.
 */
export const HALFTONE_TEXT_MASK = {
  WebkitMaskImage:
    "radial-gradient(circle at center, #000 0 1.05px, rgba(0,0,0,0.8) 1.7px)",
  maskImage:
    "radial-gradient(circle at center, #000 0 1.05px, rgba(0,0,0,0.8) 1.7px)",
  WebkitMaskSize: "5px 5px",
  maskSize: "5px 5px",
  WebkitMaskRepeat: "repeat",
  maskRepeat: "repeat",
} as const;

const Landing = () => {
  return (
    <div className="font-geist flex min-h-screen w-full flex-col p-3 md:p-4" style={{ backgroundColor: PAGE, color: INK }}>
      {/* Hero card: rounded, textured, with the animated dither filling it edge to edge */}
      <section
        className="relative flex min-h-[calc(100vh-2rem)] flex-1 flex-col overflow-hidden rounded-2xl md:rounded-3xl"
        style={HERO_CARD_STYLE}
      >
        <HalftoneWave
          className="absolute inset-0 h-full w-full"
          colorA={FIELD.colorA}
          colorB={FIELD.colorB}
          calm={HERO_CALM}
          cursorInteraction
        />


        {/* Hero: a strong Vignelli-style typographic grid laid over the field */}
        <main className="relative flex w-full flex-1 flex-col justify-center gap-[clamp(1.25rem,3.5vh,2.5rem)] px-6 py-10 md:px-12 md:py-14">
          {/* Masthead row + rule */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <span
                className="flex items-center gap-[clamp(0.5rem,1vw,0.625rem)]"
                style={{ filter: `drop-shadow(0 0 8px ${GLOW}) drop-shadow(0 0 22px ${GLOW})` }}
              >
                <LogoMark className="h-[clamp(1.75rem,1.25rem+1.6vw,2.25rem)] w-[clamp(1.75rem,1.25rem+1.6vw,2.25rem)]" />
                <span
                  className="text-[clamp(0.875rem,0.7rem+0.55vw,1.0625rem)] font-semibold tracking-tight"
                  style={{ color: HEADING }}
                >
                  Halftone Lab
                </span>
              </span>
              <span
                className="hidden font-geist-mono text-[11px] uppercase tracking-[0.18em] sm:block"
                style={{ color: GRAY }}
              >
                Halftone studio
              </span>
            </div>
            <div className="mt-[clamp(0.75rem,2vh,1.25rem)] h-px w-full" style={{ backgroundColor: RULE }} />
          </div>

          {/* Type field: "Get halftone art." broken into fragments, displaced
              across a hidden 12-column grid but kept in balance. */}
          <div className="relative flex-1">
            {/* faint column guides — the hidden grid made just visible */}
            <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:grid md:grid-cols-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ borderLeft: `1px solid ${GRIDLINE}` }} />
              ))}
              <div className="absolute right-0 top-0 h-full" style={{ borderRight: `1px solid ${GRIDLINE}` }} />
            </div>

            <div className="font-chakra relative flex h-full flex-col justify-center gap-3 tracking-[-0.03em] md:grid md:grid-cols-12 md:content-center md:gap-x-4 md:gap-y-[clamp(0.1rem,0.6vh,0.5rem)] md:[grid-template-rows:repeat(4,auto)]">
              {/* kicker, top-left */}
              <span
                className="text-[clamp(1.1rem,2.4vw,1.875rem)] font-medium tracking-[-0.01em] md:col-span-7 md:col-start-1 md:row-start-1 md:self-end"
                style={{ color: HEADING }}
              >
                Drop a photo.
              </span>

              {/* The headline, broken across the grid (display:contents keeps the
                  three words as direct grid items while staying one <h1>). */}
              <h1 className="contents">
                {/* "Get" — upper-left */}
                <span
                  className="text-[clamp(2.25rem,6vw,5rem)] font-semibold leading-[0.85] md:col-span-4 md:col-start-1 md:row-start-2"
                  style={{ color: INK, ...HALFTONE_TEXT_MASK }}
                >
                  Get
                </span>
                {/* "halftone" — the dominant word, indented and shifted right */}
                <span
                  className="text-[clamp(3rem,12vw,9rem)] font-semibold leading-[0.82] tracking-[-0.04em] md:col-span-11 md:col-start-2 md:row-start-3"
                  style={{ color: INK, ...HALFTONE_TEXT_MASK }}
                >
                  halftone
                </span>
                {/* "art." — dropped to the lower-right */}
                <span
                  className="text-[clamp(2.25rem,6vw,5rem)] font-semibold leading-[0.85] md:col-span-5 md:col-start-8 md:row-start-4"
                  style={{ color: INK, ...HALFTONE_TEXT_MASK }}
                >
                  art.
                </span>
              </h1>

              {/* descriptor — anchors the lower-left negative space to balance "art." */}
              <span
                className="max-w-xs font-geist text-[clamp(0.8125rem,0.5rem+0.7vw,0.95rem)] font-normal leading-[1.45] tracking-normal md:col-span-3 md:col-start-1 md:row-start-4 md:self-center"
                style={{ color: INK, textShadow: BODY_SHADOW }}
              >
                Photos become dots, squares, or triangles that trace light and
                shadow — exported as crisp SVG or PNG.
              </span>
            </div>
          </div>

          {/* Rule */}
          <div className="h-px w-full" style={{ backgroundColor: RULE }} />

          {/* Action band: CTA left, meta in the right column */}
          <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12">
            <div className="md:col-span-8">
              <Link
                to="/app"
                className="inline-flex items-center rounded-full px-[clamp(1.375rem,3vw,1.75rem)] py-[clamp(0.7rem,1.8vw,0.875rem)] text-[clamp(0.8125rem,0.65rem+0.5vw,0.9375rem)] font-medium transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: BTN_BG, color: BTN_TEXT }}
              >
                Launch the app
              </Link>
            </div>
            <div className="md:col-span-4">
              <span
                className="font-geist-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: GRAY }}
              >
                Dots · Squares · Triangles — SVG &amp; PNG
              </span>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Landing;
