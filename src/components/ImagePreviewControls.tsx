import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow, ToggleRow } from "./ControlSection";

export function ImagePreviewControls() {
  const { config, setConfig } = useHalftoneStore();

  if (!config.advancedMode) return null;

  return (
    <ControlSection title="Border" tooltip="Add a decorative border around your artwork">
      <ToggleRow
        label="Add Border"
        tooltip="Frame your artwork with a border and drop shadow"
        checked={config.showFrame}
        onChange={(v) => setConfig({ showFrame: v })}
      />
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
