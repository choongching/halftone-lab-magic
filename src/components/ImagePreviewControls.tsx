import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";
import { cn } from "@/lib/utils";

export function ImagePreviewControls() {
  const { imageConfig, setImageConfig } = useHalftoneStore();

  if (!imageConfig.advancedMode) return null;

  return (
    <ControlSection title="Preview">
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary-foreground">Show Frame</span>
        <button
          onClick={() => setImageConfig({ showFrame: !imageConfig.showFrame })}
          className={cn(
            "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
            imageConfig.showFrame
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {imageConfig.showFrame ? "On" : "Off"}
        </button>
      </div>
      {imageConfig.showFrame && (
        <SliderRow
          label="Corner Radius"
          value={imageConfig.frameRadius}
          min={0}
          max={50}
          step={1}
          onChange={(v) => setImageConfig({ frameRadius: v })}
          displayValue={`${imageConfig.frameRadius}px`}
        />
      )}
    </ControlSection>
  );
}
