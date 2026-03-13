import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";
import { cn } from "@/lib/utils";

export function ToneMappingControls() {
  const { imageConfig, setImageConfig } = useHalftoneStore();

  return (
    <ControlSection title="Tone Mapping">
      <SliderRow
        label="Brightness"
        value={imageConfig.brightness}
        min={-1}
        max={1}
        step={0.01}
        onChange={(v) => setImageConfig({ brightness: v })}
      />
      <SliderRow
        label="Contrast"
        value={imageConfig.contrast}
        min={-1}
        max={1}
        step={0.01}
        onChange={(v) => setImageConfig({ contrast: v })}
      />
      <SliderRow
        label="Threshold"
        value={imageConfig.threshold}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => setImageConfig({ threshold: v })}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary-foreground">Invert</span>
        <button
          onClick={() => setImageConfig({ invert: !imageConfig.invert })}
          className={cn(
            "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
            imageConfig.invert
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {imageConfig.invert ? "On" : "Off"}
        </button>
      </div>
      {imageConfig.advancedMode && (
        <SliderRow
          label="Gamma"
          value={imageConfig.gamma}
          min={0.2}
          max={5}
          step={0.01}
          onChange={(v) => setImageConfig({ gamma: v })}
          displayValue={imageConfig.gamma.toFixed(2)}
        />
      )}
    </ControlSection>
  );
}
