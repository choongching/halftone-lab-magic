import { useHalftoneStore } from "@/store/halftoneStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VariantSelector } from "./VariantSelector";
import { PatternControls } from "./PatternControls";
import { BehaviorControls } from "./BehaviorControls";
import { CanvasControls } from "./CanvasControls";
import { ColorControls } from "./ColorControls";
import { PreviewControls } from "./PreviewControls";
import { PresetManager } from "./PresetManager";
import { ControlSection } from "./ControlSection";
import { cn } from "@/lib/utils";

export function ControlPanel() {
  const { config, toggleAdvancedMode } = useHalftoneStore();

  return (
    <div className="flex h-full w-[300px] flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Controls</span>
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
        </div>
      </ScrollArea>
    </div>
  );
}
