import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow, ToggleRow } from "./ControlSection";

export function ToneMappingControls() {
  const { config, setConfig } = useHalftoneStore();

  return (
    <ControlSection title="Light & Shadow" tooltip="Fine-tune how light and dark areas are mapped to shapes">
      <SliderRow
        label="Brightness"
        tooltip="Make the overall image lighter or darker"
        value={config.brightness}
        min={-1}
        max={1}
        step={0.01}
        onChange={(v) => setConfig({ brightness: v })}
      />
      <SliderRow
        label="Contrast"
        tooltip="Increase or decrease the difference between light and dark"
        value={config.contrast}
        min={-1}
        max={1}
        step={0.01}
        onChange={(v) => setConfig({ contrast: v })}
      />
      <SliderRow
        label="Cutoff"
        tooltip="Set a brightness level — anything darker becomes a shape"
        value={config.threshold}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => setConfig({ threshold: v })}
      />
      <ToggleRow
        label="Flip Tones"
        tooltip="Swap light and dark areas so shadows become highlights"
        checked={config.invert}
        onChange={(v) => setConfig({ invert: v })}
      />
      {config.advancedMode && (
        <SliderRow
          label="Midtones"
          tooltip="Adjust how smoothly mid-brightness values blend"
          value={config.gamma}
          min={0.2}
          max={5}
          step={0.01}
          onChange={(v) => setConfig({ gamma: v })}
          displayValue={config.gamma.toFixed(2)}
        />
      )}
    </ControlSection>
  );
}
