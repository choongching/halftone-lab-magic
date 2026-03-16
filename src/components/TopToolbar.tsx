import { useHalftoneStore } from "@/store/halftoneStore";
import { renderImageHalftone, imageElementsToSvgString } from "@/engine/imageRenderer";
import { useImageLuminance } from "@/hooks/useImageLuminance";
import { downloadSvg, downloadPng } from "@/utils/export";
import { Shuffle, RotateCcw, Download, Image } from "lucide-react";

export function TopToolbar() {
  const { config, randomize, resetConfig } = useHalftoneStore();
  const lumaMap = useImageLuminance(config);

  const handleExportSvg = () => {
    if (!lumaMap) return;
    const elements = renderImageHalftone(config, lumaMap);
    const svgString = imageElementsToSvgString(config, elements);
    downloadSvg(svgString, config);
  };

  const handleExportPng = () => {
    if (!lumaMap) return;
    const elements = renderImageHalftone(config, lumaMap);
    const svgString = imageElementsToSvgString(config, elements);
    downloadPng(svgString, config);
  };

  const canExport = !!config.sourceImageUrl && !!lumaMap;

  return (
    <div className="flex h-11 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold tracking-tight text-foreground">Halftone Lab <span className="font-normal text-muted-foreground">by CC Teo</span></h1>
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
          disabled={!canExport}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
        >
          <Download className="h-3 w-3" /> SVG
        </button>
        <button
          onClick={handleExportPng}
          disabled={!canExport}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-40"
        >
          <Image className="h-3 w-3" /> PNG
        </button>
      </div>
    </div>
  );
}
