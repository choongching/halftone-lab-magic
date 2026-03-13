import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";
import { WAVE_TYPE_LABELS, type WaveType } from "@/types/halftone";
import { cn } from "@/lib/utils";

const WAVE_TYPES: WaveType[] = ["sine", "cosine", "triangle", "noise"];

export function BehaviorControls() {
  const { config, setConfig } = useHalftoneStore();

  if (!config.advancedMode) return null;

  return (
    <ControlSection title="Behavior">
      <div className="space-y-1.5">
        <span className="text-xs text-secondary-foreground">Wave Type</span>
        <div className="flex gap-1.5">
          {WAVE_TYPES.map((wt) => (
            <button
              key={wt}
              onClick={() => setConfig({ waveType: wt })}
              className={cn(
                "flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                config.waveType === wt
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {WAVE_TYPE_LABELS[wt]}
            </button>
          ))}
        </div>
      </div>
      <SliderRow label="Amplitude" value={config.amplitude} onChange={(v) => setConfig({ amplitude: v })} />
      <SliderRow label="Frequency" value={config.frequency} onChange={(v) => setConfig({ frequency: v })} />
      <SliderRow label="Phase Offset" value={config.phaseOffset} onChange={(v) => setConfig({ phaseOffset: v })} />
      <SliderRow
        label="Seed"
        value={config.seed}
        min={0}
        max={9999}
        step={1}
        onChange={(v) => setConfig({ seed: v })}
        displayValue={String(config.seed)}
      />
    </ControlSection>
  );
}
