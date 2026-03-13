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
  const { imageConfig, setImageConfig, setImageSizePreset } = useHalftoneStore();

  return (
    <ControlSection title="Canvas">
      <div className="flex gap-1.5 flex-wrap">
        {SIZE_PRESETS.map((sp) => (
          <button
            key={sp.value}
            onClick={() => setImageSizePreset(sp.value)}
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-medium transition-all",
              imageConfig.sizePreset === sp.value
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
            value={imageConfig.width}
            onChange={(e) =>
              setImageConfig({ width: parseInt(e.target.value) || 100, sizePreset: "custom" })
            }
            className="w-full rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Height</span>
          <input
            type="number"
            value={imageConfig.height}
            onChange={(e) =>
              setImageConfig({ height: parseInt(e.target.value) || 100, sizePreset: "custom" })
            }
            className="w-full rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground"
          />
        </div>
      </div>
      {imageConfig.advancedMode && (
        <>
          <SliderRow
            label="Padding"
            value={imageConfig.padding}
            min={0}
            max={200}
            step={1}
            onChange={(v) => setImageConfig({ padding: v })}
            displayValue={`${imageConfig.padding}px`}
          />
          <div className="space-y-1.5">
            <span className="text-xs text-secondary-foreground">Fit Mode</span>
            <div className="flex gap-1.5">
              {(["contain", "cover"] as const).map((fm) => (
                <button
                  key={fm}
                  onClick={() => setImageConfig({ fitMode: fm })}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-all",
                    imageConfig.fitMode === fm
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
              onClick={() => setImageConfig({ showBackground: !imageConfig.showBackground })}
              className={cn(
                "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
                imageConfig.showBackground
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {imageConfig.showBackground ? "On" : "Off"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-foreground">Transparent BG</span>
            <button
              onClick={() =>
                setImageConfig({ transparentBackground: !imageConfig.transparentBackground })
              }
              className={cn(
                "rounded-full px-3 py-0.5 text-[10px] font-medium transition-all",
                imageConfig.transparentBackground
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {imageConfig.transparentBackground ? "On" : "Off"}
            </button>
          </div>
        </>
      )}
    </ControlSection>
  );
}
