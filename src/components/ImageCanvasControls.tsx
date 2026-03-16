import { useHalftoneStore } from "@/store/halftoneStore";
import { ControlSection, SliderRow } from "./ControlSection";
import { SIZE_PRESET_DIMENSIONS, type SizePreset } from "@/types/halftone";
import { cn } from "@/lib/utils";

const SIZE_PRESETS: { value: SizePreset; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "story", label: "Story" },
  { value: "poster", label: "Poster" },
  { value: "custom", label: "Custom" },
];

export function ImageCanvasControls() {
  const { config, setConfig, setSizePreset } = useHalftoneStore();

  return (
    <ControlSection title="Size">
      <div className="flex gap-1.5 flex-wrap">
        {SIZE_PRESETS.map((sp) => (
          <button
            key={sp.value}
            onClick={() => setSizePreset(sp.value)}
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-medium transition-all",
              config.sizePreset === sp.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {sp.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Width</span>
          <input
            type="number"
            value={config.width}
            onChange={(e) =>
              setConfig({ width: parseInt(e.target.value) || 100, sizePreset: "custom" })
            }
            className="w-full rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Height</span>
          <input
            type="number"
            value={config.height}
            onChange={(e) =>
              setConfig({ height: parseInt(e.target.value) || 100, sizePreset: "custom" })
            }
            className="w-full rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground"
          />
        </div>
      </div>
      {config.advancedMode && (
        <>
          <SliderRow
            label="Margin"
            value={config.padding}
            min={0}
            max={200}
            step={1}
            onChange={(v) => setConfig({ padding: v })}
            displayValue={`${config.padding}px`}
          />
          <div className="space-y-1.5">
            <span className="text-xs text-secondary-foreground">Image Fit</span>
            <div className="flex gap-1.5">
              {(["contain", "cover"] as const).map((fm) => (
                <button
                  key={fm}
                  onClick={() => setConfig({ fitMode: fm })}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-all",
                    config.fitMode === fm
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {fm}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-foreground">Background</span>
            <button
              onClick={() => setConfig({ showBackground: !config.showBackground })}
              className={cn(
                "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
                config.showBackground
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {config.showBackground ? "On" : "Off"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-foreground">Transparent BG</span>
            <button
              onClick={() => setConfig({ transparentBackground: !config.transparentBackground })}
              className={cn(
                "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
                config.transparentBackground
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {config.transparentBackground ? "On" : "Off"}
            </button>
          </div>
        </>
      )}
    </ControlSection>
  );
}
