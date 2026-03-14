import { useHalftoneStore } from "@/store/halftoneStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUpload } from "./ImageUpload";
import { ImagePatternSelector } from "./ImagePatternSelector";
import { ImagePatternControls } from "./ImagePatternControls";
import { ImageCanvasControls } from "./ImageCanvasControls";
import { ImageColorControls } from "./ImageColorControls";
import { ToneMappingControls } from "./ToneMappingControls";
import { ImagePreviewControls } from "./ImagePreviewControls";
import { ImageWaveControls } from "./ImageWaveControls";
import { ControlSection } from "./ControlSection";
import { cn } from "@/lib/utils";

export function ControlPanel() {
  const { config, toggleAdvancedMode } = useHalftoneStore();

  return (
    <div className="flex h-full w-[300px] flex-col border-r border-border bg-card">
      <div className="flex items-center justify-end border-b border-border px-4 py-2.5">
        <button
          onClick={toggleAdvancedMode}
          className={cn(
            "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
            config.advancedMode
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {config.advancedMode ? "Advanced" : "Basic"}
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-5 p-4">
          <ImageUpload />
          <div className="h-px bg-border" />
          <ControlSection title="Pattern">
            <ImagePatternSelector />
          </ControlSection>
          <div className="h-px bg-border" />
          <ImagePatternControls />
          <div className="h-px bg-border" />
          <ToneMappingControls />
          {config.advancedMode && (
            <>
              <div className="h-px bg-border" />
              <ImageWaveControls />
            </>
          )}
          <div className="h-px bg-border" />
          <ImageCanvasControls />
          <div className="h-px bg-border" />
          <ImageColorControls />
          {config.advancedMode && (
            <>
              <div className="h-px bg-border" />
              <ImagePreviewControls />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
