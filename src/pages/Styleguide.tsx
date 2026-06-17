import { createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { HalftoneWave } from "@/components/HalftoneWave";
import { HALFTONE_TEXT_MASK, LogoMark } from "./Landing";

/** A full color theme for the styleguide chrome. Two variations are compared. */
interface Theme {
  name: string;
  page: string; // page gutter background
  card: string; // section / card surface
  heading: string; // display + strong text
  ink: string; // body text
  gray: string; // muted: eyebrows, captions, secondary
  border: string; // hairline border color
  btnBg: string; // primary pill fill
  btnText: string; // primary pill text
  tile: string; // small spec-tile background (swatches, pattern, field previews)
  tileDot: string; // pattern-swatch dot color
  field: { colorA: string; colorB: string }; // header HalftoneWave tint
  glow: string; // logo/wordmark halo color so it lifts off the field
  bodyShadow: string; // text-shadow that keeps hero copy legible over the field
}

/** Saturated orange surfaces with cream type. */
const THEME_FILL: Theme = {
  name: "Orange fill",
  page: "#E04E1A",
  card: "#F15A22",
  heading: "#FFFFFF",
  ink: "#FCE7D8",
  gray: "rgba(255,244,236,0.74)",
  border: "rgba(255,255,255,0.20)",
  btnBg: "#FDF1E7",
  btnText: "#B5430F",
  tile: "#FFFFFF",
  tileDot: "#1f1f1f",
  field: { colorA: "#F79A63", colorB: "#FBD3B4" },
  glow: "#F15A22",
  bodyShadow: "0 1px 14px rgba(120,38,6,0.45)",
};

const ThemeCtx = createContext<Theme>(THEME_FILL);
const useTheme = () => useContext(ThemeCtx);

/** One documented swatch: color block with name + CSS value underneath. */
function Swatch({ name, value, note }: { name: string; value: string; note?: string }) {
  const t = useTheme();
  return (
    <li className="min-w-0">
      <div className="h-16 rounded-xl border" style={{ backgroundColor: value, borderColor: t.border }} />
      <p className="mt-2 text-[13px] font-medium" style={{ color: t.heading }}>
        {name}
      </p>
      <p className="font-geist-mono text-[11px] leading-snug" style={{ color: t.gray }}>
        {value}
        {note ? ` · ${note}` : ""}
      </p>
    </li>
  );
}

/** A card section with the mono uppercase eyebrow. */
function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <section className="rounded-2xl p-6 md:rounded-3xl md:p-10" style={{ backgroundColor: t.card }}>
      <p className="font-geist-mono text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: t.gray }}>
        {eyebrow}
      </p>
      <h2 className="font-chakra mt-2 text-2xl font-semibold tracking-[-0.02em] md:text-3xl" style={{ color: t.heading }}>
        {title}
      </h2>
      <div className="mt-6 md:mt-8">{children}</div>
    </section>
  );
}

/** A type specimen row: meta on the left, rendered sample on the right. */
function TypeRow({
  name,
  usage,
  className,
  style,
  sample,
}: {
  name: string;
  usage: string;
  className: string;
  style?: React.CSSProperties;
  sample: string;
}) {
  const t = useTheme();
  return (
    <div
      className="grid gap-2 border-t py-5 first:border-t-0 first:pt-0 md:grid-cols-[14rem_1fr] md:gap-8"
      style={{ borderColor: t.border }}
    >
      <div>
        <p className="text-[13px] font-medium" style={{ color: t.heading }}>
          {name}
        </p>
        <p className="font-geist-mono text-[11px] leading-snug" style={{ color: t.gray }}>
          {usage}
        </p>
      </div>
      <p className={className} style={{ color: t.heading, ...style }}>
        {sample}
      </p>
    </div>
  );
}

/**
 * Static halftone swatch: an 8x8 grid of dots, squares, or triangles whose
 * size follows a diagonal tone ramp — a frozen miniature of what the engine
 * renders in the app.
 */
function PatternSwatch({ kind }: { kind: "dot" | "square" | "triangle" }) {
  const t = useTheme();
  const cells = 8;
  const cell = 16;
  const size = cells * cell;
  const els: React.ReactNode[] = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const s = (x + y) / (2 * (cells - 1));
      const cx = (x + 0.5) * cell;
      const cy = (y + 0.5) * cell;
      const r = (0.12 + 0.82 * s) * cell * 0.5;
      const key = `${x}-${y}`;
      if (kind === "dot") {
        els.push(<circle key={key} cx={cx} cy={cy} r={r} />);
      } else if (kind === "square") {
        els.push(<rect key={key} x={cx - r} y={cy - r} width={r * 2} height={r * 2} />);
      } else {
        els.push(<polygon key={key} points={`${cx},${cy - r} ${cx + r},${cy + r} ${cx - r},${cy + r}`} />);
      }
    }
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full" aria-hidden>
      <rect width={size} height={size} fill={t.tile} rx="12" />
      <g fill={t.tileDot}>{els}</g>
    </svg>
  );
}

/** A bordered tile previewing a live HalftoneWave variant with a caption. */
function FieldTile({
  caption,
  ...props
}: { caption: string } & React.ComponentProps<typeof HalftoneWave>) {
  const t = useTheme();
  return (
    <figure>
      <div className="relative h-44 overflow-hidden rounded-xl border" style={{ backgroundColor: t.tile, borderColor: t.border }}>
        <HalftoneWave className="absolute inset-0 h-full w-full" {...props} />
      </div>
      <figcaption className="mt-3 font-geist-mono text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: t.gray }}>
        {caption}
      </figcaption>
    </figure>
  );
}

/** One row of the prop reference: name · default · description. */
function PropRow({ name, def, desc }: { name: string; def: string; desc: string }) {
  const t = useTheme();
  return (
    <div
      className="grid grid-cols-[1fr] gap-1 border-t py-3 first:border-t-0 first:pt-0 sm:grid-cols-[10rem_7rem_1fr] sm:items-baseline sm:gap-4"
      style={{ borderColor: t.border }}
    >
      <code className="font-geist-mono text-[12px] font-semibold" style={{ color: t.heading }}>
        {name}
      </code>
      <code className="font-geist-mono text-[11px]" style={{ color: t.gray }}>
        {def}
      </code>
      <p className="text-[13px] leading-snug" style={{ color: t.ink }}>
        {desc}
      </p>
    </div>
  );
}

/** Eyebrow heading used inside sections. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <h3 className="font-geist-mono text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: t.gray }}>
      {children}
    </h3>
  );
}

const FIELD_PROPS = [
  { name: "cellSize", def: "8", desc: "Pixel pitch between dots — smaller is denser." },
  { name: "dotScale", def: "1.3", desc: "Max dot diameter as a fraction of the cell (>1 lets dark dots merge)." },
  { name: "softness", def: "0.22", desc: "Edge fuzz, 0 (crisp) → 1 (very soft)." },
  { name: "speed", def: "1.6", desc: "Time multiplier for the whole field." },
  { name: "rotation", def: "-8", desc: "Tilt of the noise field, in degrees." },
  { name: "noiseScale", def: "2.9", desc: "Spatial frequency — higher = smaller blobs." },
  { name: "octaves", def: "3", desc: "FBM detail layers summed per sample." },
  { name: "contrastMin/Max", def: "0.22 / 0.64", desc: "Noise window remapped to dot tone." },
  { name: "scrollX/Y", def: "0.06 / 0.04", desc: "Linear drift speed of the field." },
  { name: "colorA → colorB", def: "#8b959d → #222932", desc: "Dot color from low tone (small) to high tone (large)." },
  { name: "background", def: "null", desc: "Solid backdrop, or null for transparent." },
  { name: "fps", def: "30", desc: "Animation-loop frame cap." },
  { name: "cursorInteraction", def: "false", desc: "Dots swell near the pointer when on." },
  { name: "calm", def: "null", desc: "Normalized quiet region so overlaid copy stays readable." },
];

const FIELD_SHADES = [
  { name: "Glow", value: "#F79A63", note: "small dots" },
  { name: "Light", value: "#F8AE80" },
  { name: "Pale", value: "#F9C29D" },
  { name: "Cream", value: "#FBD3B4", note: "blobs" },
];

const APP_COLORS = [
  { name: "Background", value: "hsl(22 55% 5%)", note: "espresso" },
  { name: "Card", value: "hsl(20 52% 9%)", note: "panel" },
  { name: "Foreground", value: "hsl(28 30% 90%)" },
  { name: "Muted fg", value: "hsl(28 16% 60%)" },
  { name: "Primary", value: "hsl(15 68% 50%)", note: "burnt orange" },
  { name: "Accent", value: "hsl(30 52% 54%)", note: "ochre" },
  { name: "Secondary", value: "hsl(20 38% 14%)", note: "chips" },
  { name: "Border", value: "hsl(24 28% 17%)" },
];

const HEADER_CALM = { x: 0.28, y: 0.52, radius: 0.55, strength: 0.78 };

function StyleguidePage({ theme }: { theme: Theme }) {
  const themeSwatches = [
    { name: "Page", value: theme.page, note: "gutter" },
    { name: "Card", value: theme.card, note: "surface" },
    { name: "Heading", value: theme.heading },
    { name: "Ink", value: theme.ink, note: "body" },
    { name: "Button", value: theme.btnBg, note: "pill" },
  ];

  return (
    <ThemeCtx.Provider value={theme}>
      <div
        className="font-geist flex min-h-screen w-full flex-col gap-3 p-3 md:gap-4 md:p-4"
        style={{ backgroundColor: theme.page, color: theme.ink }}
      >
        {/* Header card: hero treatment at documentation scale */}
        <header className="relative overflow-hidden rounded-2xl md:rounded-3xl" style={{ backgroundColor: theme.card }}>
          <HalftoneWave
            className="absolute inset-0 h-full w-full"
            colorA={theme.field.colorA}
            colorB={theme.field.colorB}
            calm={HEADER_CALM}
            cursorInteraction
          />
          <div className="relative px-6 py-14 md:px-12 md:py-20">
            <span
              className="flex items-center gap-2"
              style={{ filter: `drop-shadow(0 0 8px ${theme.glow}) drop-shadow(0 0 22px ${theme.glow})` }}
            >
              <LogoMark className="h-8 w-8" />
              <span className="text-[15px] font-semibold tracking-tight" style={{ color: theme.heading }}>
                Halftone Lab
              </span>
            </span>
            <h1 className="font-chakra mt-5 tracking-[-0.02em]">
              <span className="block text-[clamp(1.25rem,3vw,2rem)] font-medium leading-none" style={{ color: theme.gray }}>
                How it looks.
              </span>
              <span
                className="block text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[0.95]"
                style={{ color: theme.heading, textShadow: theme.bodyShadow }}
              >
                Style guide
              </span>
            </h1>
            <p
              className="mt-5 max-w-md text-[clamp(0.9375rem,0.6rem+1vw,1.125rem)] leading-[1.55]"
              style={{ color: theme.ink, textShadow: theme.bodyShadow }}
            >
              The visual language of Halftone Lab: an orange marketing layer
              and a warm espresso-and-orange workbench, both built from dots.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                to="/"
                className="inline-flex items-center rounded-full px-6 py-3 text-[14px] font-medium transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                Back to landing
              </Link>
              <Link
                to="/app"
                className="text-[14px] font-medium underline-offset-4 transition-opacity hover:opacity-70 hover:underline"
                style={{ color: theme.heading }}
              >
                Launch the app
              </Link>
            </div>
          </div>
        </header>

        <Section eyebrow="01 · Brand" title="Logo mark">
          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div className="flex items-end gap-6">
              <LogoMark className="h-24 w-24" />
              <LogoMark className="h-14 w-14" />
              <LogoMark className="h-8 w-8" />
            </div>
            <div className="max-w-md text-[15px] leading-[1.55]">
              <p>
                A dark rounded tile carrying a 3×3 halftone ramp: dot radius grows
                from the top-left to the bottom-right corner, the whole product in
                nine circles. The same mark is the favicon.
              </p>
              <p className="mt-3 font-geist-mono text-[11px]" style={{ color: theme.gray }}>
                tile #141517 · dots #ffffff · radii 2.4 → 6.4 · corner r14/64
              </p>
            </div>
          </div>
        </Section>

        <Section eyebrow="02 · Color" title="Palettes">
          <p className="max-w-xl text-[15px] leading-[1.55]">
            The landing and styleguide share the{" "}
            <span style={{ color: theme.heading }}>{theme.name}</span> theme. The app workbench is the dark
            sibling: the same orange accent over warm espresso surfaces.
          </p>
          <Eyebrow>Brand · {theme.name}</Eyebrow>
          <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {themeSwatches.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </ul>
          <div className="mt-8">
            <Eyebrow>Halftone field shades</Eyebrow>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FIELD_SHADES.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </ul>
          <div className="mt-8">
            <Eyebrow>App · dark theme tokens</Eyebrow>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {APP_COLORS.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </ul>
        </Section>

        <Section eyebrow="03 · Typography" title="Type">
          <TypeRow
            name="Chakra Petch"
            usage="display · weights 500/600 · tracking -0.02em · halftone inner mask on hero"
            className="font-chakra text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.02em]"
            style={HALFTONE_TEXT_MASK}
            sample="Get halftone art."
          />
          <TypeRow
            name="Geist"
            usage="landing + app body & UI · weights 400/500/600"
            className="max-w-xl text-[17px] leading-[1.55]"
            style={{ color: theme.ink }}
            sample="Your photo becomes dots, squares, or triangles that trace its light and shadow."
          />
          <TypeRow
            name="Geist Mono"
            usage="eyebrows, captions + app section labels · 11px · uppercase · 0.1em tracking"
            className="font-geist-mono text-[11px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: theme.gray }}
            sample="Light & Shadow"
          />
          <TypeRow
            name="JetBrains Mono"
            usage="app slider values + numerics"
            className="font-mono text-[14px]"
            sample="spacing: 12 · size: 0.85 · rotation: 15°"
          />
        </Section>

        <Section eyebrow="04 · Pattern" title="Halftone grids">
          <p className="max-w-xl text-[15px] leading-[1.55]">
            The engine renders three grids — circles, squares, and triangles —
            whose element size follows the luminance of the source photo. Brand
            artwork uses the same logic: shape size is tone.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {(["dot", "square", "triangle"] as const).map((kind) => (
              <figure key={kind}>
                <PatternSwatch kind={kind} />
                <figcaption
                  className="mt-3 font-geist-mono text-[11px] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: theme.gray }}
                >
                  {kind} grid
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section eyebrow="05 · Components" title="Buttons & surfaces">
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              className="inline-flex items-center rounded-full px-7 py-3.5 text-[14px] font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
            >
              Primary pill
            </button>
            <button
              type="button"
              className="text-[14px] font-medium underline-offset-4 transition-opacity hover:opacity-70 hover:underline"
              style={{ color: theme.heading }}
            >
              Quiet text link
            </button>
          </div>
          <ul className="mt-8 max-w-xl space-y-2 text-[15px] leading-[1.55]">
            <li>
              <span className="font-medium" style={{ color: theme.heading }}>Cards:</span>{" "}
              surfaces, <span className="font-geist-mono text-[13px]">rounded-2xl</span> →{" "}
              <span className="font-geist-mono text-[13px]">rounded-3xl</span> at md, on a tinted page with a 12–16px gutter.
            </li>
            <li>
              <span className="font-medium" style={{ color: theme.heading }}>Buttons:</span>{" "}
              fully round (<span className="font-geist-mono text-[13px]">rounded-full</span>), solid fill, opacity hover.
            </li>
            <li>
              <span className="font-medium" style={{ color: theme.heading }}>App radius token:</span>{" "}
              <span className="font-geist-mono text-[13px]">--radius: 0.625rem</span> inside the espresso workbench.
            </li>
            <li>
              <span className="font-medium" style={{ color: theme.heading }}>Workbench controls:</span>{" "}
              collapsible accordion sections, toggle switches for booleans, a segmented Simple/Pro mode control, and a single Export pill with an SVG/PNG menu.
            </li>
          </ul>
        </Section>

        <Section eyebrow="06 · Background" title="Halftone wave field">
          <p className="max-w-xl text-[15px] leading-[1.55]">
            The signature background is{" "}
            <span className="font-geist-mono text-[13px]">&lt;HalftoneWave /&gt;</span> — a dot grid sized by a
            fractal (FBM) noise field that slowly drifts and swirls in place. Dot
            radius and color both track local tone, so it reads like a living
            halftone print. Soft edges come from cached gradient sprites blitted
            per dot, so the layer stays cheap enough to run full-bleed.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FieldTile caption="standard" colorA={theme.field.colorA} colorB={theme.field.colorB} />
            <FieldTile
              caption="crisp · dense"
              colorA={theme.field.colorA}
              colorB={theme.field.colorB}
              softness={0.05}
              cellSize={10}
            />
            <FieldTile
              caption="soft · large"
              colorA={theme.field.colorA}
              colorB={theme.field.colorB}
              softness={0.7}
              cellSize={20}
              noiseScale={1.8}
            />
            <FieldTile caption="deep ember" colorA="#EBA277" colorB="#7C2C07" />
          </div>
          <div className="mt-8 max-w-3xl">
            <Eyebrow>Props</Eyebrow>
            <div className="mt-3">
              {FIELD_PROPS.map((p) => (
                <PropRow key={p.name} {...p} />
              ))}
            </div>
          </div>
        </Section>

        <Section eyebrow="07 · Motion" title="Slow by design">
          <ul className="max-w-xl space-y-2 text-[15px] leading-[1.55]">
            <li>
              The hero halftone field runs at a 30fps cap — an FBM noise swirl
              that drifts and morphs in place, never faster than a lava lamp.
            </li>
            <li>
              A calm zone keeps the field quiet behind hero copy so type stays
              readable without panels or overlays.
            </li>
            <li>
              <span className="font-geist-mono text-[13px]">cursorInteraction</span> swells the dots into a
              soft trail that eases in and out as the pointer moves over the hero.
            </li>
            <li>
              <span className="font-geist-mono text-[13px]">prefers-reduced-motion</span> renders a single static frame.
            </li>
            <li>UI transitions are opacity-only; nothing slides or bounces.</li>
          </ul>
        </Section>

        <footer className="px-6 py-6 text-center">
          <p className="font-geist-mono text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: theme.gray }}>
            Halftone Lab · style guide · {theme.name}
          </p>
        </footer>
      </div>
    </ThemeCtx.Provider>
  );
}

const Styleguide = () => <StyleguidePage theme={THEME_FILL} />;

export default Styleguide;
