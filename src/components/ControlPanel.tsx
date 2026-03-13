import { useHalftoneStore } from "@/store/halftoneStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeSwitch } from "./ModeSwitch";
import { VariantSelector } from "./VariantSelector";
import { PatternControls } from "./PatternControls";
import { BehaviorControls } from "./BehaviorControls";
import { CanvasControls } from "./CanvasControls";
import { ColorControls } from "./ColorControls";
import { PreviewControls } from "./PreviewControls";
import { PresetManager } from "./PresetManager";
import { ControlSection } from "./ControlSection";
import { ImageUpload } from "./ImageUpload";
import { ImagePatternSelector } from "./ImagePatternSelector";
import { ImagePatternControls } from "./ImagePatternControls";
import { ImageCanvasControls } from "./ImageCanvasControls";
import { ImageColorControls } from "./ImageColorControls";
import { ToneMappingControls } from "./ToneMappingControls";
import { ImagePreviewControls } from "./ImagePreviewControls";
import { cn } from "@/lib/utils";

export function ControlPanel() {
  const { mode, config, imageConfig, toggleAdvancedMode } = useHalftoneStore();
  const advancedMode = mode === "procedural" ? config.advancedMode : imageConfig.advancedMode;

  return (
    <div className="flex h-full w-[300px] flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <ModeSwitch />
        <button
          onClick={toggleAdvancedMode}
          className={cn(
            "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
            advancedMode
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {advancedMode ? "Advanced" : "Basic"}
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-5 p-4">
          {mode === "procedural" ? (
            <ProceduralControls />
          ) : (
            <ImageControls />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ProceduralControls() {
  const { config } = useHalftoneStore();

  return (
    <>
      <ControlSection title="Variant">
        <VariantSelector />
      </ControlSection>
      <div className="h-px bg-border" />
      <PatternControls />
      <div className="h-px bg-border" />
      {config.advancedMode && (
        <>
          <BehaviorControls />
          <div className="h-px bg-border" />
        </>
      )}
      <CanvasControls />
      <div className="h-px bg-border" />
      <ColorControls />
      {config.advancedMode && (
        <>
          <div className="h-px bg-border" />
          <PreviewControls />
        </>
      )}
      <div className="h-px bg-border" />
      <PresetManager />
    </>
  );
}

function ImageControls() {
  const { imageConfig } = useHalftoneStore();

  return (
    <>
      <ImageUpload />
      <div className="h-px bg-border" />
      <ControlSection title="Pattern">
        <ImagePatternSelector />
      </ControlSection>
      <div className="h-px bg-border" />
      <ImagePatternControls />
      <div className="h-px bg-border" />
      <ToneMappingControls />
      {imageConfig.advancedMode && (
        <>
          <div className="h-px bg-border" />
          <ImageWaveControls />
        </>
      )}
      <div className="h-px bg-border" />
      <ImageCanvasControls />
      <div className="h-px bg-border" />
      <ImageColorControls />
      {imageConfig.advancedMode && (
        <>
          <div className="h-px bg-border" />
          <ImagePreviewControls />
        </>
      )}
    </>
  );
}
