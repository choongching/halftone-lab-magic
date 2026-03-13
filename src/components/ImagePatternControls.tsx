import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";

export function ImagePatternControls() {
  const { imageConfig, setImageConfig } = useHalftoneStore();

  return (
    <ControlSection title="Pattern">
      <SliderRow
        label="Density"
        value={imageConfig.density}
        onChange={(v) => setImageConfig({ density: v })}
      />
      <SliderRow
        label="Size Range"
        value={imageConfig.sizeRange}
        onChange={(v) => setImageConfig({ sizeRange: v })}
      />
      <SliderRow
        label="Spacing"
        value={imageConfig.spacing}
        onChange={(v) => setImageConfig({ spacing: v })}
      />
      {imageConfig.advancedMode && (
        <SliderRow
          label="Rotation"
          value={imageConfig.rotation}
          min={0}
          max={360}
          step={1}
          onChange={(v) => setImageConfig({ rotation: v })}
          displayValue={`${imageConfig.rotation}°`}
        />
      )}
    </ControlSection>
  );
}
