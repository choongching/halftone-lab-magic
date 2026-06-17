import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow, ToggleRow } from "./ControlSection";
import { WAVE_TYPE_LABELS, type WaveType } from "@/types/halftone";
import { cn } from "@/lib/utils";
import { HelpTip } from "./HelpTip";

const WAVE_TYPES: WaveType[] = ["sine", "triangle", "noise"];

export function ImageWaveControls() {
  const { config, setConfig } = useHalftoneStore();

  if (!config.advancedMode) return null;

  const wave = config.wave;
  const setWave = (partial: Partial<typeof wave>) =>
    setConfig({ wave: { ...wave, ...partial } });

  return (
    <ControlSection title="Waviness" tooltip="Add a wavy distortion effect to the pattern">
      <ToggleRow
        label="Add Waves"
        tooltip="Turn on a wave effect that bends the pattern"
        checked={wave.enabled}
        onChange={(v) => setWave({ enabled: v })}
      />
      {wave.enabled && (
        <>
          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs text-secondary-foreground">
              Style
              <HelpTip text="Choose the wave shape — smooth curves, sharp zigzags, or random noise" />
            </span>
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
          <SliderRow label="Intensity" tooltip="How strong the wave effect is" value={wave.amplitude} onChange={(v) => setWave({ amplitude: v })} />
          <SliderRow label="Density" tooltip="How many waves fit across the image" value={wave.frequency} min={0.1} max={8} step={0.1} onChange={(v) => setWave({ frequency: v })} />
          <SliderRow label="Shift" tooltip="Offset the wave — great for animating" value={wave.phaseOffset} onChange={(v) => setWave({ phaseOffset: v })} />
        </>
      )}
    </ControlSection>
  );
}
