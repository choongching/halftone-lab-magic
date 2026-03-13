import { useHalftoneStore } from "@/store/halftoneStore";
import { renderHalftone, elementsToSvgString } from "@/engine/renderers";
import { downloadSvg, downloadPng } from "@/utils/export";
import { BUILT_IN_PRESETS } from "@/data/presets";
import { DEFAULT_CONFIG } from "@/store/halftoneStore";
import { Shuffle, RotateCcw, Download, Image } from "lucide-react";

export function TopToolbar() {
  const { config, setConfig, randomize, resetConfig } = useHalftoneStore();

  const handleExportSvg = () => {
    const elements = renderHalftone(config);
    const svgString = elementsToSvgString(config, elements);
    downloadSvg(svgString, config);
  };

  const handleExportPng = () => {
    const elements = renderHalftone(config);
    const svgString = elementsToSvgString(config, elements);
    downloadPng(svgString, config);
  };

  return (
    <div className="flex h-11 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold tracking-tight text-foreground">Halftone Lab</h1>
        <div className="h-4 w-px bg-border" />
        <select
          className="rounded-md bg-secondary px-2 py-1 text-[11px] text-secondary-foreground border border-border cursor-pointer"
          value=""
          onChange={(e) => {
            const preset = BUILT_IN_PRESETS.find((p) => p.name === e.target.value);
            if (preset) setConfig({ ...DEFAULT_CONFIG, ...preset.config, advancedMode: config.advancedMode });
          }}
        >
          <option value="" disabled>Presets</option>
          {BUILT_IN_PRESETS.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={randomize}
          className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <Shuffle className="h-3 w-3" /> Randomize
        </button>
        <button
          onClick={resetConfig}
          className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button
          onClick={handleExportSvg}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Download className="h-3 w-3" /> SVG
        </button>
        <button
          onClick={handleExportPng}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          <Image className="h-3 w-3" /> PNG
        </button>
      </div>
    </div>
  );
}
