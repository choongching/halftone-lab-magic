import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";
import { cn } from "@/lib/utils";
import { HelpTip } from "./HelpTip";

export function ImagePreviewControls() {
  const { config, setConfig } = useHalftoneStore();

  if (!config.advancedMode) return null;

  return (
    <ControlSection title="Border" tooltip="Add a decorative border around your artwork">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-secondary-foreground">
          Add Border
          <HelpTip text="Frame your artwork with a border and drop shadow" />
        </span>
        <button
          onClick={() => setConfig({ showFrame: !config.showFrame })}
          className={cn(
            "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
            config.showFrame
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {config.showFrame ? "On" : "Off"}
        </button>
      </div>
      {config.showFrame && (
        <SliderRow
          label="Roundness"
          tooltip="How rounded the corners of the border are"
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
