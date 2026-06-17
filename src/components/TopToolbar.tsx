import { Link } from "react-router-dom";
import { useHalftoneStore } from "@/store/halftoneStore";
import { renderImageHalftone, imageElementsToSvgString } from "@/engine/imageRenderer";
import { useImageLuminance } from "@/hooks/useImageLuminance";
import { downloadSvg, downloadPng } from "@/utils/export";
import { LogoMark } from "@/pages/Landing";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Shuffle, RotateCcw, Download, Image, FileCode, ChevronDown } from "lucide-react";

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
    <header className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2.5">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80" title="Back to landing">
          <LogoMark className="h-6 w-6" />
          <span className="font-chakra text-[15px] font-semibold tracking-tight text-foreground">
            Halftone Lab
          </span>
        </Link>
        <span className="hidden text-[11px] text-muted-foreground sm:inline">by CC Teo</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Link
          to="/styleguide"
          className="hidden rounded-md px-2.5 py-1 font-geist-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
        >
          Guide
        </Link>
        <div className="mx-1 hidden h-4 w-px bg-border md:block" />
        <button
          onClick={randomize}
          className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5 text-[11px] font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
        >
          <Shuffle className="h-3 w-3" /> Randomize
        </button>
        <button
          onClick={resetConfig}
          className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5 text-[11px] font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={!canExport}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none disabled:opacity-40 data-[state=open]:opacity-90"
          >
            <Download className="h-3 w-3" /> Export
            <ChevronDown className="h-3 w-3 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[9rem]">
            <DropdownMenuItem onClick={handleExportSvg} className="gap-2 text-xs">
              <FileCode className="h-3.5 w-3.5 text-primary" />
              Download SVG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPng} className="gap-2 text-xs">
              <Image className="h-3.5 w-3.5 text-primary" />
              Download PNG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
