Halftone Lab — procedural SVG halftone generator with dark creative-tool aesthetic.

- Font: Space Grotesk (body) + JetBrains Mono (mono)
- Theme: Dark-only, teal primary (172 50% 55%), purple accent (260 45% 60%)
- State: Zustand store in src/store/halftoneStore.ts
- Two modes: "procedural" (6 variants) and "image" (upload-driven, 3 pattern types)
- Rendering: Pure functions in src/engine/renderers.ts (procedural) and src/engine/imageRenderer.ts (image)
- Image pipeline: src/engine/imageSampler.ts (luminance extraction), src/hooks/useImageLuminance.ts
- Export: SVG serialization + canvas PNG in src/utils/export.ts
- Presets: Built-in in src/data/presets.ts, user presets in localStorage
- No backend, no auth, fully client-side
