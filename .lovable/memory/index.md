Halftone Lab — image-based SVG halftone generator with dark creative-tool aesthetic.

- Font: Space Grotesk (body) + JetBrains Mono (mono)
- Theme: Dark-only, teal primary (172 50% 55%), purple accent (260 45% 60%)
- State: Zustand store in src/store/halftoneStore.ts (single ImageConfig)
- Single mode: image upload → halftone (no procedural mode)
- Rendering: src/engine/imageRenderer.ts (3 pattern types: dot/square/triangle grid)
- Image pipeline: src/engine/imageSampler.ts (luminance extraction), src/hooks/useImageLuminance.ts
- Wave helper: src/engine/waveHelper.ts (sine/triangle/noise modulation)
- Export: SVG serialization + canvas PNG in src/utils/export.ts
- No backend, no auth, fully client-side
