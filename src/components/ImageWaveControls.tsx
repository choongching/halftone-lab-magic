import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";
import { WAVE_TYPE_LABELS, type WaveType } from "@/types/halftone";
import { cn } from "@/lib/utils";

const WAVE_TYPES: WaveType[] = ["sine", "triangle", "noise"];

export function ImageWaveControls() {
  const { config, setConfig } = useHalftoneStore();

  if (!config.advancedMode) return null;

  const wave = config.wave;
  const setWave = (partial: Partial<typeof wave>) =>
    setConfig({ wave: { ...wave, ...partial } });

  return (
    <ControlSection title="Waviness">
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary-foreground">Add Waves</span>
        <button
          onClick={() => setWave({ enabled: !wave.enabled })}
          className={cn(
            "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
            wave.enabled
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {wave.enabled ? "On" : "Off"}
        </button>
      </div>
      {wave.enabled && (
        <>
          <div className="space-y-1.5">
            <span className="text-xs text-secondary-foreground">Wave Type</span>
            <div className="flex gap-1.5">
              {WAVE_TYPES.map((wt) => (
                <button
                  key={wt}
                  onClick={() => setWave({ type: wt })}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                    wave.type === wt
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {WAVE_TYPE_LABELS[wt]}
                </button>
              ))}
            </div>
          </div>
          <SliderRow label="Amplitude" value={wave.amplitude} onChange={(v) => setWave({ amplitude: v })} />
          <SliderRow label="Frequency" value={wave.frequency} min={0.1} max={8} step={0.1} onChange={(v) => setWave({ frequency: v })} />
          <SliderRow label="Phase Offset" value={wave.phaseOffset} onChange={(v) => setWave({ phaseOffset: v })} />
        </>
      )}
    </ControlSection>
  );
}
