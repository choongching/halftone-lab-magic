import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";
import { cn } from "@/lib/utils";

export function PreviewControls() {
  const { config, setConfig } = useHalftoneStore();

  if (!config.advancedMode) return null;

  return (
    <ControlSection title="Preview">
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary-foreground">Show Frame</span>
        <button
          onClick={() => setConfig({ showFrame: !config.showFrame })}
          className={cn(
            "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
            config.showFrame ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          )}
        >
          {config.showFrame ? "On" : "Off"}
        </button>
      </div>
      {config.showFrame && (
        <SliderRow
          label="Corner Radius"
          value={config.frameRadius}
          min={0}
          max={50}
          step={1}
          onChange={(v) => setConfig({ frameRadius: v })}
          displayValue={`${config.frameRadius}px`}
        />
      )}
    </ControlSection>
  );
}
