# Halftone Lab

A browser-based tool that turns any photo into a stylized halftone graphic — the kind of pattern made out of dots, squares, or triangles whose size traces the light and shadow of the original image. Upload a picture, tweak the look until you like it, and export the result as a clean SVG or a high-resolution PNG.

Everything runs in your browser. No accounts, no uploads to a server, no tracking — the image never leaves your device.

## What you can do

- **Pick a pattern.** Render the image as a grid of dots, squares, or triangles.
- **Shape the tones.** Adjust brightness, contrast, gamma (midtones), and a threshold control that decides what counts as "light" and disappears.
- **Tune the grid.** Set rows, columns, padding, rotation, and the maximum cell size.
- **Apply a wave.** Optional smooth, zigzag, or noise modulation distorts the shape sizes across the canvas, for a more dynamic, less mechanical look.
- **Choose your colors.** Pick foreground and background, or pick from eight preset palettes. Flip them with one click; switch on a transparent background for layering elsewhere.
- **Pick a canvas size.** Built-in presets for square, portrait, landscape, story (9:16), and poster, plus a fully custom size.
- **Export.** Download as SVG (infinitely scalable, perfect for print or further editing in Illustrator / Figma) or PNG.

There's a **Simple** mode that hides the more advanced controls, and a **Pro** mode that exposes the wave, padding, image-fit, gamma, and border tools.

## Who it's for

- **Designers and illustrators** building posters, album covers, editorial graphics, or print work where a tactile halftone treatment fits.
- **Makers and crafters** preparing artwork for screen printing, riso, stickers, or pen plotters — the SVG export is plotter-friendly.
- **Social media creators** who want a quick, distinctive treatment for a photo (story and poster presets are included).
- **Anyone curious** who just wants to see what their photo looks like as 1,600 little dots.

No prior design experience needed; the defaults produce something usable, and the "Randomize" button is a good starting point if you're not sure where to begin.

## How it works

The process happens in four steps inside your browser, each one running every time you nudge a slider:

1. **The image is rasterized** onto an invisible canvas sized to your chosen artwork dimensions, fitted with either "Fit Inside" (no cropping) or "Fill" (covers, crops edges).
2. **Brightness is read pixel by pixel** to produce a luminance map. Brightness, contrast, gamma, and the cutoff slider all reshape this map — for example, raising "Cutoff" turns more of the bright pixels into pure white, which means they get no shape drawn at all.
3. **A grid is laid over the canvas** at the rows × columns you set. For each cell, the tool checks the luminance at that point: dark areas get a large shape, light areas get a small shape (or no shape at all). The "Shape Size" slider controls how big the largest shapes are allowed to grow.
4. **The grid is rendered as SVG primitives** — circles, rectangles, or triangles depending on the pattern you chose. Optionally, a wave function multiplies the shape sizes across the canvas to add a rolling, woven feel.

The result is a single SVG, drawn live to the preview panel. The PNG export rasterizes that same SVG to a flat image at full canvas resolution.

## A tour of the controls

The sidebar is grouped into sections. From top to bottom:

- **Image** — Upload, drag-drop, or paste a photo. Click "Remove" to clear.
- **Look & Feel** — Flip Colors swaps the shape and background colors instantly.
- **Shape Style** — Pick Dots, Squares, or Triangles. Set Columns, Rows, and Shape Size. (Pro adds Angle, which rotates the entire pattern.) A warning appears when the grid passes 10,000 elements — see "Tips" below.
- **Light & Shadow** — Brightness, Contrast, and Cutoff (the threshold that drops light areas), plus Flip Tones to invert. (Pro adds Midtones, a gamma curve.)
- **Waviness** (Pro) — Add Waves and pick a Style: Smooth (sine), Zigzag (triangle), or Random (noise). Intensity sets how strongly shapes shrink, Density sets how many wave cycles fit across the image, and Shift moves the wave's phase — handy for finding a sweet spot.
- **Size** — Pick a preset (Square, Portrait, Landscape, Story, Poster) or type a custom Width and Height. (Pro adds Margin for breathing room, Image Fit toggling Fit Inside vs. Fill, plus Show BG and See-Through BG.)
- **Colors** — Set Shape Color and Canvas Color directly, or click one of the eight Quick Picks for a curated combination.
- **Border** (Pro) — Add a rounded frame and drop shadow to the preview.

The top toolbar holds **Randomize** (shuffle the pattern, grid, wave, and palette), **Reset** (restore defaults but keep your uploaded image), and the two export buttons — **SVG** and **PNG**.

The preview itself supports zooming from 20% to 150%. Use the `+` and `-` keys, or the buttons in the corner of the preview area.

## Tips for getting good results

- **Start with a high-contrast photo.** Portraits with strong key lighting, silhouettes, and graphic shapes work best. Flat, evenly-lit scenes turn into uniform gray dots.
- **Tune Cutoff first.** The Cutoff slider is the single biggest dial for cleaning up the result. Raise it until backgrounds and skies vanish into white. Drop it if details are disappearing.
- **Mind the element count.** A 100 × 100 grid is already 10,000 shapes; 200 × 200 is 40,000 — the renderer's hard cap. The warning chip in the sidebar tells you when you're approaching slow territory. For print, a denser grid pays off; for screen, less is usually more.
- **Use SVG for print, PNG for screen.** SVG is infinitely scalable and stays sharp at any size, which matters for posters or screen-printed apparel. PNG is the better pick for sharing on social, in slides, or anywhere an SVG won't render.
- **Try See-Through BG for layering.** When exported, transparent backgrounds let you drop the halftone art over any color or photo in another tool.
- **Hit Randomize a few times.** It's faster than dialing in from scratch when you're exploring.

## Try it locally

You'll need [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

```sh
git clone https://github.com/choongching/halftone-lab-magic.git
cd halftone-lab-magic
pnpm install
pnpm dev
```

Then open http://localhost:8080.

To produce a production build:

```sh
pnpm build
```

## Tech

Vite · React · TypeScript · Tailwind · shadcn/ui · Zustand. Halftone rendering reads luminance directly from a Canvas 2D context and emits SVG primitives — no rendering libraries involved.

## Developed by

[CC Teo](https://github.com/choongching).

## License

TBD.
