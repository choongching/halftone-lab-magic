import { Link } from "react-router-dom";
import { HalftoneWave } from "@/components/HalftoneWave";
import { HALFTONE_TEXT_MASK, LogoMark } from "./Landing";

// Orange-fill theme, with cream + deep tones for box-to-box contrast.
const PAGE = "#231008"; // deep espresso gutter — high contrast behind the cards
// warm radial vignette painted over the gutter for depth
const PAGE_GRADIENT = "radial-gradient(130% 130% at 50% 0%, #3C1C0C 0%, #231008 55%, #160A03 100%)";
const ORANGE = "#F15A22";
const DEEP = "#C2430E";
const EMBER = "#7C2C07";
const CREAM = "#FDF1E7";
const INK_DARK = "#8A3209"; // wordmark + headline on cream

const BOX = "relative flex flex-col overflow-hidden rounded-lg p-5 md:rounded-xl md:p-7";

const BentoLanding = () => {
  return (
    <div className="font-geist min-h-screen w-full p-6 md:p-16" style={{ backgroundColor: PAGE, backgroundImage: PAGE_GRADIENT }}>
      <div className="grid grid-cols-2 gap-1.5 [grid-auto-rows:minmax(7rem,auto)] md:min-h-[calc(100vh-8rem)] md:grid-cols-6 md:grid-rows-3 md:gap-2 md:[grid-auto-rows:1fr]">
        {/* A — Headline hero (3x2) */}
        <section
          className={`${BOX} col-span-2 row-span-2 justify-between md:col-span-3`}
          style={{ backgroundColor: CREAM }}
        >
          {/* faint drifting scanlines behind the title */}
          <div aria-hidden className="halftone-scanlines pointer-events-none absolute inset-0" />
          <div className="relative flex items-center justify-between">
            <span className="flex items-center gap-2">
              <LogoMark className="h-7 w-7" />
              <span className="text-[14px] font-semibold tracking-tight" style={{ color: INK_DARK }}>
                Halftone Lab
              </span>
            </span>
          </div>
          <h1
            className="halftone-mask-anim relative font-chakra mt-auto text-[clamp(3rem,8.4vw,7.5rem)] font-semibold leading-[0.82] tracking-[-0.04em]"
            style={{ color: INK_DARK, ...HALFTONE_TEXT_MASK }}
          >
            Get
            <br />
            halftone
            <br />
            art.
          </h1>
        </section>

        {/* B — Live dot field (3x1, wide): dense, crisp, the signature motion */}
        <section className={`${BOX} col-span-2 justify-end md:col-span-3 md:col-start-4 md:row-start-1`} style={{ backgroundColor: EMBER }}>
          <HalftoneWave
            className="absolute inset-0 h-full w-full"
            colorA="#E9B89B"
            colorB="#FDF1E7"
            cellSize={9}
            softness={0.16}
            speed={1.5}
          />
        </section>

        {/* C — CTA (2x1) */}
        <Link
          to="/app"
          className={`${BOX} group col-span-1 justify-end transition-opacity hover:opacity-95 md:col-span-2 md:col-start-4 md:row-start-2`}
          style={{ backgroundColor: DEEP }}
        >
          {/* fine field that swells under the cursor */}
          <HalftoneWave
            className="absolute inset-0 h-full w-full"
            colorA="#A8380A"
            colorB="#EE8650"
            cellSize={8}
            softness={0.4}
            speed={1}
            opacity={0.75}
            cursorInteraction
          />
          <span className="relative font-chakra text-[clamp(1.375rem,2.4vw,2.125rem)] font-semibold leading-[0.95]" style={{ color: CREAM }}>
            Launch
            <br />
            the app
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>

        {/* D — Triangle grid (1x2, tall): gentle live triangles with a fleeting twinkle */}
        <section className={`${BOX} col-span-1 justify-end md:col-span-1 md:col-start-6 md:row-start-2 md:row-span-2`} style={{ backgroundColor: CREAM }}>
          <HalftoneWave
            className="absolute inset-0 h-full w-full"
            shape="triangle"
            colorA="#F4954F"
            colorB="#C2430E"
            cellSize={15}
            dotScale={0.9}
            contrastMin={0.3}
            contrastMax={0.7}
            noiseScale={2.4}
            speed={1}
            twinkle={0.6}
          />
        </section>

        {/* E — Statement (3x1): Swiss-grid placement — eyebrow pinned top-left,
            copy anchored bottom-left in a column, negative space upper-right */}
        <section className={`${BOX} col-span-2 justify-end md:col-span-3 md:col-start-1 md:row-start-3`} style={{ backgroundColor: ORANGE }}>
          <HalftoneWave
            className="absolute inset-0 h-full w-full"
            colorA="#D24E16"
            colorB="#94360A"
            cellSize={17}
            softness={0.72}
            speed={0.8}
            rotation={12}
            noiseScale={2}
            opacity={0.6}
          />
          <p
            className="relative max-w-md font-chakra text-[clamp(1.25rem,2.4vw,2rem)] font-medium leading-[1.12] tracking-[-0.01em]"
            style={{ color: CREAM, textShadow: "0 1px 12px rgba(120,38,6,0.4)" }}
          >
            Edit it live and watch every change appear instantly. Nothing ever
            leaves your browser.
          </p>
        </section>

        {/* F — Square grid (2x1): abstract square shapes forming, shifting, dissolving */}
        <section className={`${BOX} col-span-2 justify-end md:col-span-2 md:col-start-4 md:row-start-3`} style={{ backgroundColor: DEEP }}>
          <HalftoneWave
            className="absolute inset-0 h-full w-full"
            shape="square"
            colorA="#E8C2A6"
            colorB="#FDF1E7"
            cellSize={15}
            dotScale={1.15}
            contrastMin={0.3}
            contrastMax={0.56}
            noiseScale={1.8}
            octaves={2}
            speed={1.2}
            rotation={-10}
          />
        </section>
      </div>
    </div>
  );
};

export default BentoLanding;
