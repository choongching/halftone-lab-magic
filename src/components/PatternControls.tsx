import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";

export function PatternControls() {
  const { config, setConfig } = useHalftoneStore();

  return (
    <ControlSection title="Pattern">
      <SliderRow label="Density" value={config.density} onChange={(v) => setConfig({ density: v })} />
      <SliderRow label="Size Range" value={config.sizeRange} onChange={(v) => setConfig({ sizeRange: v })} />
      <SliderRow label="Spacing" value={config.spacing} onChange={(v) => setConfig({ spacing: v })} />
      {config.advancedMode && (
        <SliderRow
          label="Rotation"
          value={config.rotation}
          min={0}
          max={360}
          step={1}
          onChange={(v) => setConfig({ rotation: v })}
          displayValue={`${config.rotation}°`}
        />
      )}
    </ControlSection>
  );
}
