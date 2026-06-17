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

const MODES = [
  { value: false, label: "Simple", hint: "The essential controls" },
  { value: true, label: "Pro", hint: "Reveal waves, border, and advanced options" },
];

export function ControlPanel() {
  const { config, setConfig } = useHalftoneStore();

  return (
    <div className="flex h-full w-[304px] flex-col border-r border-border bg-card">
      <div className="border-b border-border p-3">
        <div
          role="tablist"
          aria-label="Control detail level"
          className="grid grid-cols-2 gap-1 rounded-full bg-secondary/50 p-1"
        >
          {MODES.map((m) => {
            const active = config.advancedMode === m.value;
            return (
              <button
                key={m.label}
                role="tab"
                aria-selected={active}
                onClick={() => setConfig({ advancedMode: m.value })}
                title={m.hint}
                className={cn(
                  "rounded-full py-1 text-[11px] font-semibold transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col pb-4">
          <ImageUpload />
          <ControlSection title="Shape Style" tooltip="Choose the shape type and adjust the pattern grid">
            <ImagePatternSelector />
            <ImagePatternControls />
          </ControlSection>
          <ToneMappingControls />
          {config.advancedMode && <ImageWaveControls />}
          <ImageCanvasControls />
          <ImageColorControls />
          {config.advancedMode && <ImagePreviewControls />}
        </div>
      </ScrollArea>
    </div>
  );
}
