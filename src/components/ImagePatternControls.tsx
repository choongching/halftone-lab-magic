import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";
import { AlertTriangle } from "lucide-react";

export function ImagePatternControls() {
  const { config, setConfig } = useHalftoneStore();

  const totalElements = config.columns * config.rows;
  const showWarning = totalElements > 10_000;

  return (
    <>
      <SliderRow
        label="Columns"
        value={config.columns}
        min={5}
        max={200}
        step={1}
        onChange={(v) => setConfig({ columns: v })}
        displayValue={`${config.columns}`}
      />
      <SliderRow
        label="Rows"
        value={config.rows}
        min={5}
        max={200}
        step={1}
        onChange={(v) => setConfig({ rows: v })}
        displayValue={`${config.rows}`}
      />
      <SliderRow
        label="Shape Size"
        value={config.sizeRange}
        onChange={(v) => setConfig({ sizeRange: v })}
      />
      {showWarning && (
        <div className="flex items-center gap-1.5 rounded-md bg-accent/20 px-2 py-1.5 text-[10px] text-accent-foreground">
          <AlertTriangle className="h-3 w-3 shrink-0 text-accent" />
          <span>{totalElements.toLocaleString()} elements — may be slow</span>
        </div>
      )}
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
    </>
  );
}
