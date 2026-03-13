

# Halftone Lab — Implementation Plan

## Overview
A focused, desktop-first procedural SVG halftone generator. Users pick a variant, tweak controls, preview live, and export clean SVG/PNG files. Dark creative-tool aesthetic, no backend, fully client-side.

## Architecture
- **State**: Zustand store with a single `HalftoneConfig` object driving everything
- **Rendering**: Pure functions per variant that take config → SVG elements
- **UI**: Three-zone layout (top toolbar, left controls panel, right preview stage)
- **Export**: Direct SVG serialization + canvas-based PNG conversion

## Implementation Phases

### Phase 1 — Foundation
- App shell with dark split layout: slim top toolbar, scrollable left panel (~300px), large right preview stage
- Zustand store with full `HalftoneConfig` type and sensible defaults (Helio circles, 1200×1200, dark bg)
- Variant selector (chip buttons) — implement **Dot Grid** rendering first
- Basic pattern controls: Density, Size Range, Spacing sliders
- Canvas controls: Width, Height, preset sizes dropdown
- Color controls: Foreground/Background pickers, Invert toggle
- Live SVG preview with zoom-to-fit
- SVG export with clean markup and auto-generated filename
- Basic/Advanced toggle (Advanced sections collapsed by default)

### Phase 2 — All Variants
- **Square Grid**: rectangular units in regular grid
- **Triangle Grid**: triangular tiling with geometric feel
- **Helio Circles**: organic, wave-field-driven circular patterns
- **Noise Scatter**: controlled random point placement using seeded noise
- **Wave Dashes**: directional short line marks responding to wave field
- Each variant as a separate render function producing SVG primitives

### Phase 3 — Polish & Features
- Behavior controls (Advanced): Wave Type selector, Amplitude, Frequency, Phase Offset, Seed
- Randomize button with curated value ranges (biased toward pleasing outputs)
- Reset to defaults
- 6 built-in presets: Soft Grid, Brutalist Squares, Poster Dots, Retro Print, Tech Noise, Fluid Helio
- Local storage preset system: save, load, rename, delete custom presets
- PNG export via offscreen canvas rendering
- Frame/card preview toggle with corner radius control
- Padding control
- Transparent background toggle
- Export options: artwork only vs. artwork with frame

### Phase 4 — UX Refinement
- Debounced/throttled slider updates for smooth performance
- Palette swatches (quick color presets)
- Preset selector in top toolbar
- Tooltip hints on controls
- Keyboard accessibility pass
- Visual polish: transitions, hover states, focus rings
- Export filename customization
- Final default tuning across all variants

## UI Structure
```
TopToolbar:  [Logo/Title] [Preset Dropdown] [Randomize] [Reset] [Export SVG] [Export PNG]

Left Panel (dark, ~300px, scrollable):
  § Variant — chip buttons (6 options)
  § Pattern — Density, Size Range, Spacing, [Advanced: Rotation]
  § Behavior (Advanced) — Wave Type, Amplitude, Frequency, Phase, Seed
  § Canvas — W×H inputs, Size preset, [Advanced: Padding, BG toggles]
  § Color — FG/BG pickers, Invert, Swatches
  § Preview (Advanced) — Frame toggle, Corner radius, Zoom to fit

Right Panel:
  Large centered SVG preview with generous surrounding space
```

## Key Decisions
- All rendering is SVG-based (not canvas) for both preview and export
- Seeded pseudo-random for reproducible Noise/Scatter variants
- Progressive disclosure via Basic/Advanced toggle — beginners see ~8 controls, advanced users see ~18
- No backend, no auth, no cloud — purely local tool
- Presets stored in localStorage as JSON

